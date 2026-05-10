import { getTextParticlePositions } from './textToParticles';

// Intro Phases
export const PHASE = {
  REVEAL_POINTS: 'REVEAL_POINTS',
  TEXT_FORM: 'TEXT_FORM',
  GLOW_HOLD: 'GLOW_HOLD',
  DISINTEGRATE: 'DISINTEGRATE',
  SETTLE: 'SETTLE',
  AMBIENT: 'AMBIENT',
  REDUCED_MOTION_AMBIENT: 'REDUCED_MOTION_AMBIENT'
};

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.radius = Math.random() * 1.5 + 0.5;

    // Ambient velocity
    this.ambientVx = (Math.random() - 0.5) * 0.5;
    this.ambientVy = (Math.random() - 0.5) * 0.5;

    // Current state
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;

    // Target for text formation
    this.targetX = 0;
    this.targetY = 0;
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  explode(centerX, centerY) {
    // Cinematic explosion outwards from center of the screen
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize and add random scatter
    const nx = (dx / distance) || 0;
    const ny = (dy / distance) || 0;

    // Force depends on distance from center (farther = faster)
    const force = Math.random() * 6 + 4 + (distance * 0.03);

    this.vx = nx * force + (Math.random() - 0.5) * 3;
    this.vy = ny * force + (Math.random() - 0.5) * 3;
  }

  update(phase) {
    if (phase === PHASE.REVEAL_POINTS || phase === PHASE.TEXT_FORM) {
      // Smoothly interpolate towards target positions
      // Faster snapping in TEXT_FORM
      const lerpFactor = phase === PHASE.TEXT_FORM ? 0.1 : 0.03;
      this.x += (this.targetX - this.x) * lerpFactor;
      this.y += (this.targetY - this.y) * lerpFactor;
      return;
    }

    if (phase === PHASE.GLOW_HOLD) {
      // Hold shape, but jitter slightly to feel alive and energetic
      this.x += (this.targetX - this.x) * 0.1 + (Math.random() - 0.5) * 0.5;
      this.y += (this.targetY - this.y) * 0.1 + (Math.random() - 0.5) * 0.5;
      return;
    }

    if (phase === PHASE.DISINTEGRATE || phase === PHASE.SETTLE) {
      // Apply friction to slow down the explosion
      this.vx *= 0.95;
      this.vy *= 0.95;

      // Gradually re-introduce ambient drift as they slow down
      this.vx += this.ambientVx * 0.06;
      this.vy += this.ambientVy * 0.06;
    } else if (phase === PHASE.AMBIENT || phase === PHASE.REDUCED_MOTION_AMBIENT) {
      // Pure ambient drift
      this.vx = this.ambientVx;
      this.vy = this.ambientVy;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > this.canvasWidth) {
      this.vx *= -1;
      this.ambientVx *= -1;
      this.x = Math.max(0, Math.min(this.x, this.canvasWidth));
    }
    if (this.y < 0 || this.y > this.canvasHeight) {
      this.vy *= -1;
      this.ambientVy *= -1;
      this.y = Math.max(0, Math.min(this.y, this.canvasHeight));
    }
  }

  draw(ctx, phase, elapsed, phaseDuration) {
    let opacityMultiplier = 1;

    // Calculate opacity based on cinematic phase
    if (phase === PHASE.REVEAL_POINTS) {
      opacityMultiplier = Math.min(1, elapsed / phaseDuration);
    } else if (phase === PHASE.TEXT_FORM) {
      opacityMultiplier = 1;
    } else if (phase === PHASE.GLOW_HOLD) {
      // Build up intensity (1x to 2.5x)
      opacityMultiplier = 1 + (1.5 * (elapsed / phaseDuration));
    } else if (phase === PHASE.DISINTEGRATE) {
      // Fade down from peak intensity (2.5x to 1x)
      const progress = Math.min(1, elapsed / phaseDuration);
      opacityMultiplier = 2.5 - (1.5 * progress);
    } else {
      opacityMultiplier = 1;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    // Clamp opacity so it doesn't break rgba
    const baseAlpha = 0.6;
    const finalAlpha = Math.min(1, baseAlpha * opacityMultiplier);

    // If we are in glow peak, shift color to pure white/yellow for extreme heat
    if (opacityMultiplier > 1.5) {
      ctx.fillStyle = `rgba(255, 247, 214, ${finalAlpha})`; // Brighter gold/white
    } else {
      ctx.fillStyle = `rgba(212, 160, 23, ${finalAlpha})`; // Standard gold
    }

    ctx.fill();
  }
}

export class ParticleEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onIntroComplete = options.onIntroComplete || (() => { });
    this.isReducedMotion = options.isReducedMotion || false;

    this.particles = [];

    // Increased particle count for better text resolution
    this.particleCount = 350;
    this.connectDistance = 150;
    this.animationFrameId = null;

    this.phase = this.isReducedMotion ? PHASE.REDUCED_MOTION_AMBIENT : PHASE.REVEAL_POINTS;
    this.phaseStartTime = performance.now();
    this.phaseDuration = 0;

    // Timings
    this.REVEAL_DURATION = 1500;
    this.TEXT_FORM_DURATION = 1000;
    this.GLOW_HOLD_DURATION = 1500;
    this.DISINTEGRATE_DURATION = 1000;
    this.SETTLE_DURATION = 1500;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.init();
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    
    const oldWidth = this.width;
    const oldHeight = this.height;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Explicitly reset the transform before applying scaling to ensure clean state
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    // Proportionally remap particles to new dimensions to keep them relative
    if (oldWidth && oldHeight && this.particles.length > 0) {
      this.particles.forEach(p => {
        p.x = (p.x / oldWidth) * this.width;
        p.y = (p.y / oldHeight) * this.height;
        p.targetX = (p.targetX / oldWidth) * this.width;
        p.targetY = (p.targetY / oldHeight) * this.height;
        p.canvasWidth = this.width;
        p.canvasHeight = this.height;
      });
    }
  }

  init() {
    const text = "Steelneck";
    let targetPositions = [];

    if (!this.isReducedMotion) {
      targetPositions = getTextParticlePositions(text, this.particleCount, this.width, this.height);
      this.phaseDuration = this.REVEAL_DURATION;
    }

    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const p = new Particle(this.width, this.height);

      if (this.isReducedMotion) {
        // Random spawn for ambient mode immediately
        p.setTarget(Math.random() * this.width, Math.random() * this.height);
        p.x = p.targetX;
        p.y = p.targetY;
      } else {
        // Form the text
        const pos = targetPositions[i] || { x: this.width / 2, y: this.height / 2 };
        p.setTarget(pos.x, pos.y);

        // Spawn randomly across the screen for the REVEAL phase
        p.x = Math.random() * this.width;
        p.y = Math.random() * this.height;
      }

      this.particles.push(p);
    }

    if (this.isReducedMotion) {
      this.onIntroComplete();
    }
  }

  updatePhase(currentTime) {
    if (this.phase === PHASE.AMBIENT || this.phase === PHASE.REDUCED_MOTION_AMBIENT) return;

    const elapsed = currentTime - this.phaseStartTime;

    if (this.phase === PHASE.REVEAL_POINTS && elapsed > this.REVEAL_DURATION) {
      this.phase = PHASE.TEXT_FORM;
      this.phaseStartTime = currentTime;
      this.phaseDuration = this.TEXT_FORM_DURATION;
    }
    else if (this.phase === PHASE.TEXT_FORM && elapsed > this.TEXT_FORM_DURATION) {
      this.phase = PHASE.GLOW_HOLD;
      this.phaseStartTime = currentTime;
      this.phaseDuration = this.GLOW_HOLD_DURATION;
    }
    else if (this.phase === PHASE.GLOW_HOLD && elapsed > this.GLOW_HOLD_DURATION) {
      this.phase = PHASE.DISINTEGRATE;
      this.phaseStartTime = currentTime;
      this.phaseDuration = this.DISINTEGRATE_DURATION;

      const centerX = this.width / 2;
      const centerY = this.height / 2;
      this.particles.forEach(p => p.explode(centerX, centerY));
    }
    else if (this.phase === PHASE.DISINTEGRATE && elapsed > this.DISINTEGRATE_DURATION) {
      this.phase = PHASE.SETTLE;
      this.phaseStartTime = currentTime;
      this.phaseDuration = this.SETTLE_DURATION;
    }
    else if (this.phase === PHASE.SETTLE && elapsed > this.SETTLE_DURATION) {
      this.phase = PHASE.AMBIENT;
      this.phaseStartTime = currentTime;
      this.onIntroComplete();
    }
  }

  drawLines() {
    // Only draw ambient connection lines if we are settling or ambient
    if (this.phase === PHASE.REVEAL_POINTS ||
      this.phase === PHASE.TEXT_FORM ||
      this.phase === PHASE.GLOW_HOLD ||
      this.phase === PHASE.DISINTEGRATE) {
      return;
    }

    let globalLineOpacity = 1;
    if (this.phase === PHASE.SETTLE) {
      const elapsed = performance.now() - this.phaseStartTime;
      globalLineOpacity = Math.min(1, elapsed / this.SETTLE_DURATION);
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);

          const opacity = (1 - (distance / this.connectDistance)) * 0.3 * globalLineOpacity;
          this.ctx.strokeStyle = `rgba(212, 160, 23, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  drawTextGlow(elapsed) {
    if (this.phase === PHASE.REVEAL_POINTS || this.phase === PHASE.TEXT_FORM || this.phase === PHASE.GLOW_HOLD || this.phase === PHASE.DISINTEGRATE) {

      let blur = 0;
      let alpha = 0;

      if (this.phase === PHASE.TEXT_FORM) {
        blur = 10 * (elapsed / this.TEXT_FORM_DURATION);
        alpha = 0.4 * (elapsed / this.TEXT_FORM_DURATION);
      } else if (this.phase === PHASE.GLOW_HOLD) {
        // Ramp up to massive glow
        const progress = Math.min(1, elapsed / this.GLOW_HOLD_DURATION);
        blur = 10 + (25 * progress);
        alpha = 0.4 + (0.5 * progress);
      } else if (this.phase === PHASE.DISINTEGRATE) {
        // Fade out glow
        const progress = Math.min(1, elapsed / this.DISINTEGRATE_DURATION);
        blur = 35 * (1 - progress);
        alpha = 0.9 * (1 - progress);
      }

      if (blur > 0) {
        this.ctx.shadowBlur = blur;
        this.ctx.shadowColor = `rgba(255, 220, 100, ${alpha})`;
      } else {
        this.ctx.shadowBlur = 0;
      }
    } else {
      this.ctx.shadowBlur = 0;
    }
  }

  animate(currentTime = performance.now()) {
    this.updatePhase(currentTime);
    const elapsed = currentTime - this.phaseStartTime;

    // Clear canvas with a solid background to prevent trails, or clearRect for pure overlay
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.particles.forEach(p => p.update(this.phase));

    this.drawLines();

    this.drawTextGlow(elapsed);
    this.particles.forEach(p => p.draw(this.ctx, this.phase, elapsed, this.phaseDuration));
    this.ctx.shadowBlur = 0; // Reset

    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  destroy() {
    window.removeEventListener('resize', this.resize);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
