import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Climber() {
  const containerRef = useRef(null);
  const figureRef = useRef(null);
  const poseSpawnRef = useRef(null);
  const poseDashRef = useRef(null);
  const ballRef = useRef(null);
  const tlRef = useRef(null);
  const particlesRef = useRef([]);
  const [particles, setParticles] = useState([]);

  // Initialize particles array once
  useEffect(() => {
    const pts = [];
    for (let i = 0; i < 25; i++) {
      pts.push({ id: i });
    }
    setParticles(pts);
  }, []);

  useEffect(() => {
    // Wait a brief moment to ensure DOM layout is complete
    const timer = setTimeout(initAnimation, 500);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initAnimation();
      }, 300); // Debounce resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (tlRef.current) tlRef.current.kill();
      gsap.killTweensOf(containerRef.current);
      gsap.killTweensOf(figureRef.current);
      gsap.killTweensOf(ballRef.current);
      if (particlesRef.current) {
        particlesRef.current.forEach(p => gsap.killTweensOf(p));
      }
    };
  }, []);

  const initAnimation = () => {
    if (!containerRef.current || !figureRef.current || !ballRef.current) return;

    // Kill any existing animations properly to prevent overlap bugs
    if (tlRef.current) tlRef.current.kill();
    gsap.killTweensOf(containerRef.current);
    gsap.killTweensOf(figureRef.current);
    gsap.killTweensOf(ballRef.current);
    particlesRef.current.forEach(p => gsap.killTweensOf(p));

    const w = 24;
    const h = 36;
    let startX = 0;
    let startY = 0;

    const calculateCoords = () => {
      const steps = Array.from(document.querySelectorAll('.career-step'));
      if (steps.length === 0 || !containerRef.current || !containerRef.current.parentElement) return;

      const topCard = steps[0];
      const parentRect = containerRef.current.parentElement.getBoundingClientRect();
      const cardRect = topCard.getBoundingClientRect();

      // Spawn point: sitting exactly at the Saab card
      startX = cardRect.left - parentRect.left + 20;
      startY = cardRect.top - parentRect.top - h - 10;
    };

    // Calculate initial coords
    calculateCoords();

    const resetVisuals = () => {
      gsap.set(containerRef.current, { x: startX, y: startY, opacity: 1, rotation: 0 });
      gsap.set(figureRef.current, { opacity: 0, rotation: 0, scaleY: 1, y: 0, x: 0 });
      gsap.set(poseSpawnRef.current, { opacity: 1 });
      gsap.set(poseDashRef.current, { opacity: 0 });
      gsap.set(ballRef.current, { opacity: 0, scale: 0, rotation: 0 });
      particlesRef.current.forEach(p => gsap.set(p, { opacity: 0, x: 12, y: 18, scale: 1 }));
    };

    // 15 seconds delay between loops
    const t = gsap.timeline({
      repeat: -1,
      repeatDelay: 15,
      onRepeat: () => {
        calculateCoords();
        resetVisuals(); // Hard reset DOM to prevent any GSAP tween caching bugs (teleporting)
        t.invalidate(); // Re-evaluates function-based values
      }
    });
    tlRef.current = t;

    // Reset visual state at the very start of the timeline (for the first loop)
    t.call(resetVisuals);

    // 1. Spawning Lightning Ball (Flashes intensely)
    t.fromTo(ballRef.current, { scale: 0, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.1 });
    t.to(ballRef.current, { rotation: 180, opacity: 0.1, duration: 0.05, yoyo: true, repeat: 9 }); // 10 fast flashes
    t.to(ballRef.current, { scale: 0, opacity: 0, duration: 0.1 });

    // 2. Figure appears (Hands up pose)
    t.to(figureRef.current, { opacity: 1, duration: 0.01 });
    // Hold for a moment so the spawn is visible
    t.to({}, { duration: 0.6 });

    // 3. Anticipation: Squat down hard!
    t.to(figureRef.current, { scaleY: 0.5, y: 9, duration: 0.3, ease: "power2.inOut" });

    // Hold the squat for a split second
    t.to({}, { duration: 0.1 });

    // 4. Spring and Superman Dash
    // Spring up and rotate 90 degrees forward
    t.to(figureRef.current, { scaleY: 1, y: 0, rotation: 90, duration: 0.2, ease: "back.out(2)" });

    // Switch to Superman pose exactly midway through the spring
    t.call(() => {
      gsap.set(poseSpawnRef.current, { opacity: 0 });
      gsap.set(poseDashRef.current, { opacity: 1 });
    }, null, "<0.1");

    // Dash across the screen! 
    // Using fromTo forces GSAP to respect the start coordinate and prevents teleportation.
    // Flying exactly 600px right in 1.5s, accelerating constantly (ease: power2.in) to hit max speed at the end!
    t.fromTo(containerRef.current,
      { x: () => startX },
      {
        x: () => startX + 600,
        duration: 1.5,
        ease: "power2.in"
      },
      "<0.1"
    ); // Start dashing right as he finishes rotating

    // 5. Flash to nothing (Dissolve into forward-moving particles AT MAX SPEED)
    t.call(() => {
      // Hide figure
      gsap.set(figureRef.current, { opacity: 0 });

      // Animate particles drifting right and fading slowly
      particlesRef.current.forEach((p) => {
        if (!p) return;
        // Cone of particles going forward and SLIGHTLY DOWN to prevent them from hitting the top header clip bounds
        const angle = (Math.random() * Math.PI / 3) - Math.PI / 8; // Mostly right, slightly down

        // Very fast initial burst to match his max speed!
        const velocity = Math.random() * 300 + 150;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        gsap.fromTo(p,
          { x: 12, y: 18, opacity: 1, scale: Math.random() * 2 + 1 }, // Start slightly bigger
          {
            x: () => 12 + dx + 150, // Float heavily to the right
            y: () => 18 + dy,
            opacity: 0,
            scale: 0,
            duration: 2.5 + Math.random() * 1.5, // Long slow float out
            ease: "power3.out" // Strong deceleration to simulate losing momentum
          }
        );
      });
    });

    // Wait for explosion to finish before considering the loop done
    t.to({}, { duration: 3.5 });
  };

  return (
    <div ref={containerRef} className="absolute top-0 left-0 pointer-events-none z-50 opacity-0" style={{ width: '24px', height: '36px' }}>

      {/* Spawning Lightning Ball (No extra blurred glow, just pure lightning) */}
      <div
        ref={ballRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-0 flex items-center justify-center pointer-events-none"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full text-accent-gold drop-shadow-[0_0_8px_rgba(212,160,23,1)]">
          <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" className="opacity-80" />
          {/* Jagged lightning shape */}
          <path d="M13 2 L7 13 L12 13 L11 22 L18 10 L13 10 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={p.id}
          ref={el => particlesRef.current[i] = el}
          className="absolute w-1.5 h-1.5 bg-accent-gold rounded-full opacity-0"
          style={{ left: 0, top: 0 }}
        />
      ))}

      {/* Stick Figure */}
      <div ref={figureRef} className="w-full h-full origin-center">
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold drop-shadow-[0_0_5px_rgba(212,160,23,0.8)]">
          {/* Head & Glasses (always visible) */}
          <circle cx="12" cy="6" r="4" />
          <circle cx="9.5" cy="5.5" r="1.5" fill="none" strokeWidth="1" />
          <circle cx="14.5" cy="5.5" r="1.5" fill="none" strokeWidth="1" />
          <line x1="11" y1="5.5" x2="13" y2="5.5" strokeWidth="1" />
          <line x1="8" y1="5.5" x2="6" y2="4" strokeWidth="1" />

          {/* Spawn Pose (Hands up in the air) */}
          <g ref={poseSpawnRef}>
            <line x1="12" y1="10" x2="12" y2="22" /> {/* Body */}
            <line x1="12" y1="13" x2="6" y2="2" /> {/* Left Arm Up */}
            <line x1="12" y1="13" x2="18" y2="2" /> {/* Right Arm Up */}
            <line x1="12" y1="22" x2="6" y2="34" /> {/* Left Leg */}
            <line x1="12" y1="22" x2="18" y2="34" /> {/* Right Leg */}
          </g>

          {/* Dash Pose (Superman) - Designed to look correct when SVG is rotated 90deg */}
          <g ref={poseDashRef} opacity="0">
            <line x1="12" y1="10" x2="12" y2="22" /> {/* Body (horizontal when rotated) */}

            {/* Arms: One points straight up in SVG (forward when rotated 90deg), one tucked */}
            <line x1="12" y1="13" x2="12" y2="2" /> {/* Arm straight forward */}
            <line x1="12" y1="13" x2="12" y2="20" /> {/* Arm tucked backwards */}

            {/* Legs: Pointing down in SVG (backward when rotated 90deg). One straight, one bent */}
            <line x1="12" y1="22" x2="12" y2="34" /> {/* Straight leg backward */}
            <line x1="12" y1="22" x2="16" y2="28" /> {/* Bent leg backward: thigh dropping slightly */}
            <line x1="16" y1="28" x2="16" y2="34" /> {/* Bent leg backward: calf straight back */}
          </g>
        </svg>
      </div>
    </div>
  );
}
