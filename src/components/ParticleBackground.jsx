import { useParticleBackground } from '../hooks/useParticleBackground';

export default function ParticleBackground() {
  const canvasRef = useParticleBackground();

  return (
    <canvas 
      ref={canvasRef} 
      aria-hidden="true"
      className="fixed inset-0 z-[-10] w-full h-full pointer-events-none"
    />
  );
}
