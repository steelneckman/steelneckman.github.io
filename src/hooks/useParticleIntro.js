import { useEffect, useRef } from 'react';
import { ParticleEngine } from '../utils/ParticleEngine';

export function useParticleIntro(onIntroComplete) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Check for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = mediaQuery.matches;

    // Initialize the engine
    engineRef.current = new ParticleEngine(canvasRef.current, {
      onIntroComplete,
      isReducedMotion
    });

    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, [onIntroComplete]);

  return canvasRef;
}
