class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.radius = Math.random() * 1.5 + 0.5;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.canvasWidth) {
      this.vx *= -1;
      this.x = Math.max(0, Math.min(this.x, this.canvasWidth));
    }
    if (this.y < 0 || this.y > this.canvasHeight) {
      this.vy *= -1;
      this.y = Math.max(0, Math.min(this.y, this.canvasHeight));
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212, 160, 23, 0.6)';
    ctx.fill();
  }
}

export class ParticleEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isReducedMotion = options.isReducedMotion || false;
    this.particles = [];
    this.particleCount = 350;
    this.connectDistance = 150;
    this.animationFrameId = null;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.resize();
    this.particles = Array.from({ length: this.particleCount }, () => new Particle(this.width, this.height));
    window.addEventListener('resize', this.resize);
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
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (oldWidth && oldHeight) {
      this.particles.forEach(particle => {
        particle.x = (particle.x / oldWidth) * this.width;
        particle.y = (particle.y / oldHeight) * this.height;
        particle.canvasWidth = this.width;
        particle.canvasHeight = this.height;
      });
    }

    if (this.isReducedMotion && this.particles.length > 0) this.animate();
  }

  drawLines() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const first = this.particles[i];
        const second = this.particles[j];
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(first.x, first.y);
          this.ctx.lineTo(second.x, second.y);
          this.ctx.strokeStyle = `rgba(212, 160, 23, ${(1 - distance / this.connectDistance) * 0.3})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (!this.isReducedMotion) this.particles.forEach(particle => particle.update());
    this.drawLines();
    this.particles.forEach(particle => particle.draw(this.ctx));
    if (!this.isReducedMotion) this.animationFrameId = requestAnimationFrame(this.animate);
  }

  destroy() {
    window.removeEventListener('resize', this.resize);
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
  }
}
