import React, { useState, useEffect } from 'react';
import { Supervisor, SupervisorCheck } from '../types';
import EInkCard from './EInkCard';
import { AlertOctagon, HeartCrack, HelpCircle, TriangleAlert } from 'lucide-react';

interface SupervisorFeedbackProps {
  supervisor: Supervisor;
  activeCheck: SupervisorCheck | null;
  onCheckAnswer: (isCorrect: boolean) => void;
  tabSwitchViolation: boolean;
  onClearTabViolation: () => void;
  currentStrikes: number;
  timerState: 'idle' | 'focus' | 'break' | 'paused';
}

export default function SupervisorFeedback({
  supervisor,
  activeCheck,
  onCheckAnswer,
  tabSwitchViolation,
  onClearTabViolation,
  currentStrikes,
  timerState
}: SupervisorFeedbackProps) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [apologyText, setApologyText] = useState('');
  const [currentQuote, setCurrentQuote] = useState('');

  // Periodically rotate catchphrases based on timerState
  useEffect(() => {
    if (timerState === 'focus') {
      setCurrentQuote(supervisor.catchphrases[Math.floor(Math.random() * supervisor.catchphrases.length)]);
    } else if (timerState === 'paused') {
      setCurrentQuote("Click resume immediately! The spreadsheet clock does not stop!");
    } else if (timerState === 'break') {
      setCurrentQuote("Do not get comfortable. Your break ends soon.");
    } else {
      setCurrentQuote("Stand by. Ready to inspect.");
    }

    const interval = setInterval(() => {
      if (timerState === 'focus' && !activeCheck && !tabSwitchViolation) {
        const randIndex = Math.floor(Math.random() * supervisor.catchphrases.length);
        setCurrentQuote(supervisor.catchphrases[randIndex]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [timerState, supervisor, activeCheck, tabSwitchViolation]);

  const handleCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCheck) return;

    if (activeCheck.requiredKeyword) {
      const isCorrect = typedAnswer.trim().toLowerCase() === activeCheck.requiredKeyword.toLowerCase();
      onCheckAnswer(isCorrect);
    } else {
      // Any text is fine as long as they typed something to prove presence
      onCheckAnswer(typedAnswer.trim().length > 3);
    }
    setTypedAnswer('');
  };

  const handleApologySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredPhrase = "I AM SORRY COUSIN TIMMY IS INDEED SUPERIOR";
    if (apologyText.trim().toUpperCase() === requiredPhrase) {
      onClearTabViolation();
      setApologyText('');
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Speech bubble containing Uncle or Father's custom quotes */}
      <div id="supervisor-speech-bubble" className="relative bg-paper-light border-2 border-charcoal rounded-lg p-4 eink-shadow">
        <div className="absolute top-[-8px] left-6 bg-charcoal text-paper px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider">
          Auditor Comment
        </div>
        <div className="flex items-start gap-3 mt-1">
          <div className="text-2xl mt-1 select-none">
            {supervisor.type === 'father' ? '👴' : '👨‍💼'}
          </div>
          <div className="flex-1">
            <span className="font-display font-bold text-xs uppercase block text-charcoal">
              {supervisor.name} ({supervisor.role}):
            </span>
            <p className="font-serif italic text-sm text-charcoal mt-1">
              "{currentQuote || supervisor.catchphrases[0]}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tab Switch Violation Lock overlay (Forces them to type the apology) */}
      {tabSwitchViolation && (
        <div id="tab-violation-modal" className="fixed inset-0 bg-charcoal/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-paper border-4 border-charcoal rounded-lg p-6 max-w-md w-full eink-shadow-lg eink-flash-effect">
            <div className="flex items-center gap-3 text-charcoal mb-4 border-b-2 border-charcoal pb-2">
              <AlertOctagon size={28} className="text-charcoal shrink-0" />
              <h2 className="font-display font-bold text-lg tracking-tight uppercase">
                TAB SWITCH DETECTED!
              </h2>
            </div>
            
            <p className="font-mono text-xs text-charcoal mb-4 bg-paper-dark p-3 rounded border border-charcoal">
              WARNING: Our active browser tab sentinel has detected you switching focus. 
              {supervisor.type === 'father' 
                ? " Father Arthur says: 'In our days, we had one focus. If you can't stay on this screen, you are a slacker.'"
                : " Uncle Dave says: 'Cousin Timmy didn't switch to a YouTube tab today. I am documenting this tab switch directly into the Excel logs!'"
              }
            </p>

            <form onSubmit={handleApologySubmit} className="space-y-4">
              <label className="block text-xs font-mono font-bold uppercase text-charcoal">
                Type the apology phrase exactly to release the lock:
                <span className="block font-serif text-sm italic font-normal text-charcoal-muted mt-1 bg-paper-light p-2 rounded border border-dashed border-charcoal select-all">
                  I AM SORRY COUSIN TIMMY IS INDEED SUPERIOR
                </span>
              </label>

              <input
                id="violation-apology-input"
                type="text"
                value={apologyText}
                onChange={(e) => setApologyText(e.target.value)}
                placeholder="Type here..."
                className="w-full px-3 py-2 bg-paper-light border-2 border-charcoal rounded font-mono text-xs focus:outline-none"
                required
              />

              <button
                id="violation-submit-button"
                type="submit"
                className="w-full bg-charcoal text-paper font-display font-bold py-2 rounded uppercase border-2 border-charcoal hover:bg-paper-light hover:text-charcoal cursor-pointer text-xs eink-shadow-sm eink-btn-active"
              >
                SUBMIT APOLOGY & RESUME WORK ROUND
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Random Spot Check Modal (Must answer within time limit) */}
      {activeCheck && activeCheck.isActive && (
        <div id="spot-check-modal" className="fixed inset-0 bg-charcoal/60 flex items-center justify-center p-4 z-40 backdrop-blur-xs">
          <div className="bg-paper border-4 border-charcoal rounded-lg p-6 max-w-md w-full eink-shadow-lg eink-flash-effect">
            <div className="flex justify-between items-center mb-4 border-b-2 border-charcoal pb-2">
              <div className="flex items-center gap-2">
                <HelpCircle size={24} className="text-charcoal" />
                <h3 className="font-display font-bold text-base uppercase">
                  ACTIVE SPOT CHECK!
                </h3>
              </div>
              <div className="font-mono text-xs font-bold border-2 border-charcoal px-2 py-0.5 rounded bg-paper-dark">
                TIME LEFT: {activeCheck.secondsLeft}s
              </div>
            </div>

            <p className="font-sans text-sm text-charcoal mb-4 bg-paper-light p-3 rounded border border-charcoal">
              {activeCheck.prompt}
            </p>

            <form onSubmit={handleCheckSubmit} className="space-y-4">
              {activeCheck.requiredKeyword && (
                <div className="text-[11px] font-mono text-charcoal-muted mb-2">
                  * Must match: <span className="font-bold underline">{activeCheck.requiredKeyword}</span>
                </div>
              )}
              
              <input
                id="spot-check-answer-input"
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder={activeCheck.requiredKeyword ? "Type the keyword here..." : "Explain your active work in details..."}
                className="w-full px-3 py-2 bg-paper-light border-2 border-charcoal rounded font-sans text-xs focus:outline-none"
                required
                autoFocus
              />

              <button
                id="spot-check-submit-button"
                type="submit"
                className="w-full bg-charcoal text-paper font-display font-bold py-2 rounded uppercase border-2 border-charcoal hover:bg-paper-light hover:text-charcoal cursor-pointer text-xs eink-shadow-sm eink-btn-active"
              >
                SUBMIT VERIFICATION RESPONSE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
