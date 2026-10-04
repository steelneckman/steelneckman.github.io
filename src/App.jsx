import { useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Climber from './components/Climber';
import ExperienceDialog from './components/ExperienceDialog';
import resumeData from './data/resume.json';

export default function App() {
  const [activeCard, setActiveCard] = useState(null);
  const handleCardClick = (id, event) => {
    event.currentTarget.focus({ preventScroll: true });
    setActiveCard(id);
  };

  const handleCloseModal = () => {
    setActiveCard(null);
  };

  const activeExperience = resumeData.experience.find(exp => exp.id === activeCard);

  return (
    <div className="isolate w-full h-dvh overflow-hidden text-gray-200 font-sans selection:bg-accent-gold selection:text-black flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-accent-gold focus:px-4 focus:py-2 focus:rounded">
        Skip to content
      </a>
      <ParticleBackground />

      <div className="flex flex-col w-full h-full">
        <main id="main-content" tabIndex={-1} className="flex-1 min-h-0 w-full max-w-7xl mx-auto p-4 md:p-8 overflow-y-auto overflow-x-hidden z-10 flex flex-col">
          <header className="flex flex-col items-center justify-center pt-2 pb-6 md:pt-0 md:pb-8 shrink-0 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-accent-gold tracking-wider uppercase text-glow">
              {resumeData.personal.name}
            </h1>
            <p className="text-sm md:text-base text-gray-300 font-light mt-3 max-w-3xl">
              {resumeData.profile.headline}
            </p>
            <p className="text-sm text-gray-400 mt-3 max-w-3xl leading-relaxed">
              {resumeData.summary}
            </p>
          </header>

          <ul aria-label="Selected achievements" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 shrink-0">
            {resumeData.highlights.map(highlight => (
              <li key={highlight.label} className="border-l-2 border-accent-gold/50 bg-black/40 backdrop-blur-sm px-5 py-4 rounded-r-lg">
                <span className="block text-2xl font-bold text-accent-gold">{highlight.value}</span>
                <span className="block text-sm text-gray-300 mt-1">{highlight.label}</span>
              </li>
            ))}
          </ul>

          <section aria-labelledby="selected-work-heading" className="w-full mb-16 shrink-0">
            <h2 id="selected-work-heading" className="text-2xl font-bold text-accent-gold mb-3 uppercase tracking-wider text-center text-glow">
              Selected Work
            </h2>
            <p className="text-sm text-gray-400 text-center mb-8">
              Platform foundations, integration modernization, and cloud-native delivery.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {resumeData.caseStudies.map(caseStudy => {
                const experience = resumeData.experience.find(exp => exp.id === caseStudy.experienceId);

                return (
                  <article key={caseStudy.experienceId} className="bg-[#1e1e1e]/80 backdrop-blur-md border border-accent-gold/20 rounded-xl p-6 shadow-lg">
                    <p className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-2">{experience.company}</p>
                    <h3 className="text-xl font-bold text-gray-100 mb-5">{caseStudy.title}</h3>
                    <dl className="space-y-5 text-sm leading-relaxed">
                      <div className="border-l-2 border-accent-gold pl-4">
                        <dt className="font-semibold text-accent-gold mb-1">Result</dt>
                        <dd className="text-gray-100">{caseStudy.result}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-300 mb-1">Challenge</dt>
                        <dd className="text-gray-400">{caseStudy.challenge}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-300 mb-1">My contribution</dt>
                        <dd className="text-gray-400">{caseStudy.contribution}</dd>
                      </div>
                    </dl>
                    <details className="mt-6 border-t border-accent-gold/20 pt-4">
                      <summary className="text-sm text-accent-gold cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-accent-gold focus-visible:outline-offset-4">
                        Technical details
                      </summary>
                      <ul className="mt-4 pl-4 list-disc space-y-3 text-sm text-gray-300 leading-relaxed marker:text-accent-gold">
                        {caseStudy.technicalDetails.map(detail => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </details>
                  </article>
                );
              })}
            </div>
          </section>

          {/* STAIRCASE: Career Highlights */}
          <section aria-labelledby="career-timeline-heading" className="w-full relative pt-2 pb-8 mb-16 flex flex-col items-center shrink-0">
            <h2 id="career-timeline-heading" className="text-2xl font-bold text-accent-gold mb-8 uppercase tracking-wider text-center text-glow w-fit mx-auto">
              Career Timeline
            </h2>
            
            <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto relative">
              <Climber />
              
              {resumeData.experience.map((exp, index) => {
                // Calculate stair step: BRP Systems (index 0) gets highest margin, LiU (last) gets 0 margin.
                const stairStep = (resumeData.experience.length - 1 - index) * 7;
                
                return (
                  <article
                    key={exp.id}
                    style={{ '--stair-margin': `${stairStep}%` }}
                    className="career-step bg-[#1e1e1e]/70 backdrop-blur-md border-l-4 border-b border-r border-t border-accent-gold/20 border-l-accent-gold rounded-r-xl p-6 cursor-pointer hover:bg-[#2a2a2a]/90 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(212,160,23,0.3)] transition-all shadow-lg w-full md:w-[65%] ml-0 md:ml-[var(--stair-margin)] relative group"
                  >
                    {/* Visual Connection Line (Optional, for the stairs effect) */}
                    {index < resumeData.experience.length - 1 && (
                      <div className="hidden md:block absolute -bottom-6 left-0 w-full h-6 border-l-4 border-accent-gold/30 opacity-50"></div>
                    )}

                    <div className="flex flex-col md:flex-row justify-between md:items-start mb-2 gap-2">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-100 group-hover:text-accent-gold transition-colors">{exp.company}</h3>
                        <p id={`career-${exp.id}-role`} className="text-sm md:text-base text-gray-300 font-light mt-1">{exp.role}</p>
                      </div>
                      <span id={`career-${exp.id}-period`} className="text-xs text-accent-gold font-mono bg-black/60 px-3 py-1.5 rounded border border-accent-gold/30 whitespace-nowrap">
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
                    <button
                      type="button"
                      aria-label={`View experience at ${exp.company}`}
                      aria-describedby={`career-${exp.id}-role career-${exp.id}-period`}
                      aria-haspopup="dialog"
                      onClick={event => handleCardClick(exp.id, event)}
                      className="absolute inset-0 w-full rounded-r-xl cursor-pointer focus-visible:outline-2 focus-visible:outline-accent-gold focus-visible:outline-offset-4"
                    />
                  </article>
                );
              })}
            </div>
          </section>

          {/* FLOOR: Competencies Foundation */}
          <section aria-labelledby="competencies-heading" className="w-full mt-auto border-t-2 border-accent-gold/40 pt-10 pb-8 relative shrink-0">
            {/* Ambient glow from the floor */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-accent-gold/5 to-transparent pointer-events-none"></div>

            <h2 id="competencies-heading" className="text-2xl font-bold text-gray-400 mb-10 uppercase tracking-widest text-center">
              Foundation & Competencies
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {resumeData.expertise.map(category => (
                <div key={category} className="bg-black/50 backdrop-blur-sm border-b-4 border-accent-gold/60 p-5 rounded-t-xl hover:bg-black/70 transition-colors shadow-lg">
                  <h3 className="text-xs font-bold text-accent-gold uppercase tracking-widest mb-4 opacity-90">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.proficiencies[category].map(skill => (
                      <span key={skill} className="text-xs bg-[#1a1a1a] text-gray-300 px-2 py-1 rounded border border-gray-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <details className="mt-8 bg-black/40 backdrop-blur-sm border border-accent-gold/20 rounded-xl p-5">
              <summary className="text-sm font-semibold text-accent-gold cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-accent-gold focus-visible:outline-offset-4">
                Additional tools &amp; background
              </summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {Object.entries(resumeData.additionalProficiencies).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{category}</h3>
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
            </details>
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

      {activeExperience && (
        <ExperienceDialog experience={activeExperience} onClose={handleCloseModal} />
      )}
    </div>
  );
}
