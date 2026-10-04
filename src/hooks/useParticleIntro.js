import { useEffect, useRef } from 'react';
import { ParticleEngine } from '../utils/ParticleEngine';

export function useParticleIntro() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canvas = canvasRef.current;
    let engine;
    const initialize = () => {
      engine?.destroy();
      engine = new ParticleEngine(canvas, { isReducedMotion: mediaQuery.matches });
    };
    initialize();
    mediaQuery.addEventListener('change', initialize);

    // Cleanup on unmount
    return () => {
      mediaQuery.removeEventListener('change', initialize);
      engine.destroy();
    };
  }, []);

  return canvasRef;
}
