import { useState, useCallback } from 'react';
import ParticleBackground from './components/ParticleBackground';
import resumeData from './data/resume.json';

export default function App() {
  const [activeCard, setActiveCard] = useState(null);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  const handleCardClick = (id) => {
    setActiveCard(id);
  };

  const handleCloseModal = () => {
    setActiveCard(null);
  };

  const handleIntroComplete = useCallback(() => {
    setIsIntroComplete(true);
  }, []);

  const activeExperience = resumeData.experience.find(exp => exp.id === activeCard);

  return (
    <div className="isolate w-full h-screen overflow-hidden text-gray-200 font-sans selection:bg-accent-gold selection:text-black flex flex-col">
      <ParticleBackground onIntroComplete={handleIntroComplete} />

      {/* Main UI Wrapper: Fades in after intro is complete */}
      <div
        className={`flex flex-col w-full h-full transition-opacity duration-1000 ease-in-out ${isIntroComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* TOP: Hero Section (15%) */}
        <header className="h-[15vh] flex flex-col items-center justify-end pb-4 shrink-0 px-4 text-center z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-accent-gold tracking-wider uppercase text-glow">
            {resumeData.personal.name}
          </h1>
          <h2 className="text-sm md:text-base text-gray-300 font-light mt-1">
            Senior IT Architect | Cloud Platform Lead
          </h2>
          <p className="text-xs md:text-sm text-gray-400 mt-2">
            200+ integrations | 20+ team led | 10+ years
          </p>
        </header>

        {/* MIDDLE: Main Grid */}
        <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 overflow-y-auto z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-8">
            {resumeData.experience.map((exp) => (
              <div
                key={exp.id}
                onClick={() => handleCardClick(exp.id)}
                className="bg-[#1e1e1e]/60 backdrop-blur-md border border-accent-gold/20 rounded-xl p-6 cursor-pointer hover:border-accent-gold/60 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(212,160,23,0.3)] group flex flex-col h-full"
              >
                <h3 className="text-xl font-bold text-gray-100 group-hover:text-accent-gold transition-colors">
                  {exp.company}
                </h3>
                <p className="text-sm text-accent-gold/80 mb-4">{exp.role}</p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {exp.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="text-xs bg-black/50 px-2 py-1 rounded border border-gray-700">
                      {skill}
                    </span>
                  ))}
                  {exp.skills.length > 3 && (
                    <span className="text-xs bg-black/50 px-2 py-1 rounded border border-gray-700">
                      +{exp.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* BOTTOM: Contact Bar */}
        <footer className="py-6 min-h-[80px] w-full flex items-center justify-center border-t border-accent-gold/10 bg-black/20 backdrop-blur-sm shrink-0 z-10 px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm">
            <a href={`mailto:${resumeData.personal.email}`} className="hover:text-accent-gold transition-colors flex items-center gap-2 whitespace-nowrap">
              ✉️ Email
            </a>
            <a href={`https://${resumeData.personal.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors flex items-center gap-2 whitespace-nowrap">
              🔗 LinkedIn
            </a>
            <a href={`https://${resumeData.personal.github}`} target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors flex items-center gap-2 whitespace-nowrap">
              💻 GitHub
            </a>
          </div>
        </footer>
      </div>

      {/* MODAL / CARD EXPANSION */}
      {activeCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#1a1a1a] border border-accent-gold/40 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(212,160,23,0.15)] relative animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-accent-gold mb-2">{activeExperience.company}</h2>
              <p className="text-lg text-gray-300 mb-1">{activeExperience.role}</p>
              <p className="text-sm text-gray-500 mb-6">{activeExperience.period}</p>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-gray-200 leading-relaxed">
                  {activeExperience.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Key Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeExperience.skills.map(skill => (
                      <span key={skill} className="text-xs bg-accent-gold/10 text-accent-gold px-3 py-1.5 rounded-full border border-accent-gold/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {activeExperience.metrics && activeExperience.metrics.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Highlights</h4>
                    <ul className="space-y-2">
                      {activeExperience.metrics.map(metric => (
                        <li key={metric} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-accent-gold mt-1">✦</span>
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
