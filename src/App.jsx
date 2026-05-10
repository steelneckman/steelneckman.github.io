import { useState, useCallback } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Climber from './components/Climber';
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

        {/* MIDDLE: Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 overflow-y-auto overflow-x-hidden z-10 flex flex-col">
          
          {/* STAIRCASE: Career Highlights */}
          <section className="w-full relative pt-2 pb-8 mb-16 flex flex-col items-center">
            <h2 id="career-timeline-heading" className="text-2xl font-bold text-accent-gold mb-8 uppercase tracking-wider text-center text-glow w-fit mx-auto">
              Career Timeline
            </h2>
            
            <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto relative">
              <Climber />
              
              {resumeData.experience.map((exp, index) => {
                // Calculate stair step: Saab (index 0) gets highest margin, LiU (last) gets 0 margin.
                const stairStep = (resumeData.experience.length - 1 - index) * 8;
                
                return (
                  <div 
                    key={exp.id}
                    style={{ '--stair-margin': `${stairStep}%` }}
                    onClick={() => handleCardClick(exp.id)}
                    className="career-step bg-[#1e1e1e]/70 backdrop-blur-md border-l-4 border-b border-r border-t border-accent-gold/20 border-l-accent-gold rounded-r-xl p-6 cursor-pointer hover:bg-[#2a2a2a]/90 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(212,160,23,0.3)] transition-all shadow-lg w-full md:w-[65%] ml-0 md:ml-[var(--stair-margin)] relative group"
                  >
                    {/* Visual Connection Line (Optional, for the stairs effect) */}
                    {index < resumeData.experience.length - 1 && (
                      <div className="hidden md:block absolute -bottom-6 left-0 w-full h-6 border-l-4 border-accent-gold/30 opacity-50"></div>
                    )}

                    <div className="flex flex-col md:flex-row justify-between md:items-start mb-2 gap-2">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-100 group-hover:text-accent-gold transition-colors">{exp.company}</h3>
                        <p className="text-sm md:text-base text-gray-300 font-light mt-1">{exp.role}</p>
                      </div>
                      <span className="text-xs text-accent-gold font-mono bg-black/60 px-3 py-1.5 rounded border border-accent-gold/30 whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-6">
                      {exp.skills.map(skill => (
                        <span key={skill} className="text-xs font-semibold bg-black/60 px-2.5 py-1 rounded border border-gray-700 text-gray-300 shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FLOOR: Competencies Foundation */}
          <section className="w-full mt-auto border-t-2 border-accent-gold/40 pt-10 pb-8 relative">
            {/* Ambient glow from the floor */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-accent-gold/5 to-transparent pointer-events-none"></div>

            <h2 className="text-2xl font-bold text-gray-400 mb-10 uppercase tracking-widest text-center">
              Foundation & Competencies
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {Object.entries(resumeData.proficiencies).map(([category, skills]) => (
                <div key={category} className="bg-black/50 backdrop-blur-sm border-b-4 border-accent-gold/60 p-5 rounded-t-xl hover:bg-black/70 transition-colors shadow-lg">
                  <h3 className="text-xs font-bold text-accent-gold uppercase tracking-widest mb-4 opacity-90">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span key={skill} className="text-xs bg-[#1a1a1a] text-gray-300 px-2 py-1 rounded border border-gray-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

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
