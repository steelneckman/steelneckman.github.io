import { useEffect, useRef } from 'react';

export default function ExperienceDialog({ experience, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    dialog.showModal();

    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, []);

  const handleBackdropClick = event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      onClose();
    }
  };

  const handleKeyDown = event => {
    if (event.key !== 'Tab') return;
    const dialog = event.currentTarget;
    const controls = Array.from(dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]'))
      .filter(element => !element.matches(':disabled') && element.tabIndex >= 0 && element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (!first) {
      event.preventDefault();
      dialog.focus();
    } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="experience-title"
      aria-describedby="experience-description"
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
      onClose={event => {
        if (!event.currentTarget.open) onClose();
      }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="m-auto bg-[#1a1a1a] text-gray-200 border border-accent-gold/40 rounded-2xl w-[calc(100%-2rem)] max-w-2xl max-h-[85dvh] overflow-y-auto p-0 shadow-[0_0_40px_rgba(212,160,23,0.15)] backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="Close experience details"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-300 hover:text-white bg-black/50 rounded-full w-11 h-11 flex items-center justify-center cursor-pointer"
      >
        <span aria-hidden="true">✕</span>
      </button>

      <div className="p-6 sm:p-8">
        <h2 id="experience-title" className="text-2xl sm:text-3xl font-bold text-accent-gold mb-2 pr-12">{experience.company}</h2>
        <p className="text-lg text-gray-300 mb-1">{experience.role}</p>
        <p className="text-sm text-gray-400 mb-6">{experience.period}</p>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
          <p id="experience-description" className="text-gray-200 leading-relaxed">{experience.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Key Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {experience.skills.map(skill => (
                <span key={skill} className="text-xs bg-accent-gold/10 text-accent-gold px-3 py-1.5 rounded-full border border-accent-gold/20">{skill}</span>
              ))}
            </div>
          </div>

          {experience.metrics?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Highlights</h3>
              <ul className="space-y-3">
                {experience.metrics.map(metric => (
                  <li key={metric} className="text-sm text-gray-300 flex items-start gap-2 leading-relaxed">
                    <span aria-hidden="true" className="text-accent-gold mt-1">✦</span>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
