import { useParticleIntro } from '../hooks/useParticleIntro';

export default function ParticleBackground() {
  const canvasRef = useParticleIntro();

  return (
    <canvas 
      ref={canvasRef} 
      aria-hidden="true"
      className="fixed inset-0 z-[-10] w-full h-full pointer-events-none"
    />
  );
}
