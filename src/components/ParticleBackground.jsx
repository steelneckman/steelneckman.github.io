import { useParticleIntro } from '../hooks/useParticleIntro';

export default function ParticleBackground({ onIntroComplete }) {
  const canvasRef = useParticleIntro(onIntroComplete);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[-10] w-full h-full pointer-events-none"
    />
  );
}
