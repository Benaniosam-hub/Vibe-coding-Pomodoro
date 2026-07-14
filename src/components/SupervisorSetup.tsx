import React, { useState } from 'react';
import { Supervisor, SupervisorType } from '../types';
import { SUPERVISORS } from '../data/supervisors';
import EInkCard from './EInkCard';
import { Shield, ShieldAlert, Award, User, Flame } from 'lucide-react';

interface SupervisorSetupProps {
  onComplete: (setup: {
    userName: string;
    supervisor: Supervisor;
    strictnessMode: 'demanding' | 'ruthless' | 'unhinged';
    focusArea: string;
    focusDuration: number; // in minutes
    breakDuration: number; // in minutes
  }) => void;
}

export default function SupervisorSetup({ onComplete }: SupervisorSetupProps) {
  const [userName, setUserName] = useState('Son');
  const [selectedType, setSelectedType] = useState<SupervisorType>('father');
  const [strictnessMode, setStrictnessMode] = useState<'demanding' | 'ruthless' | 'unhinged'>('ruthless');
  const [focusArea, setFocusArea] = useState('Writing high-performance code');
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const activeSupervisor = SUPERVISORS.find(s => s.type === selectedType) || SUPERVISORS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    onComplete({
      userName,
      supervisor: activeSupervisor,
      strictnessMode,
      focusArea,
      focusDuration,
      breakDuration
    });
  };

  return (
    <div id="setup-container" className="max-w-2xl mx-auto py-4">
      {/* Title block with strict retro design */}
      <div className="text-center mb-6">
        <div className="inline-block eink-border-thin bg-charcoal text-paper px-4 py-2 font-display uppercase tracking-widest text-sm mb-2 rounded">
          System Core: Active
        </div>
        <h1 className="font-display font-bold text-4xl uppercase tracking-tight text-charcoal">
          YOU CAN'T ESCAPE FROM ME
        </h1>
        <p className="font-mono text-xs text-charcoal-muted mt-2">
          [ STRICT FATHER/UNCLE POMODORO & INTEGRATED WORKING HOUR AUDIT ]
        </p>
      </div>

      <EInkCard title="AUDIT PREPARATION & REGISTRATION" subtitle="Form #401-A">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Subject Identification */}
          <div>
            <label className="block font-display font-semibold uppercase text-xs tracking-wider text-charcoal mb-2">
              1. SUBJECT CHARACTERISTIC NAME
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User size={16} className="text-charcoal" />
              </span>
              <input
                id="user-name-input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name (e.g. Son, Arthur Jr., Nephew)"
                className="w-full pl-9 pr-3 py-2 bg-paper-light border-2 border-charcoal rounded font-sans text-sm focus:outline-none focus:ring-0"
                required
              />
            </div>
            <p className="text-[11px] font-mono text-charcoal-muted mt-1">
              * Used directly in the generated Excel audit sheet subject field.
            </p>
          </div>

          {/* Section 2: Auditor Selection */}
          <div>
            <label className="block font-display font-semibold uppercase text-xs tracking-wider text-charcoal mb-2">
              2. SELECT ACTIVE SUPERVISOR (AUDITOR)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUPERVISORS.map((sup) => (
                <div
                  key={sup.type}
                  onClick={() => setSelectedType(sup.type)}
                  className={`cursor-pointer p-4 rounded-lg border-2 flex flex-col justify-between transition-all duration-150 ${
                    selectedType === sup.type
                      ? 'bg-charcoal text-paper border-charcoal eink-shadow'
                      : 'bg-paper-light text-charcoal border-charcoal-light hover:border-charcoal'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-display font-bold text-base uppercase">
                        {sup.type === 'father' ? '👴 ' : '👨‍💼 '} {sup.name}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        selectedType === sup.type
                          ? 'border-paper text-paper'
                          : 'border-charcoal text-charcoal'
                      }`}>
                        {sup.strictness.toUpperCase()}
                      </span>
                    </div>
                    <p className={`text-xs font-serif italic ${selectedType === sup.type ? 'text-paper-dark' : 'text-charcoal-muted'}`}>
                      "{sup.catchphrases[0]}"
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-dashed border-charcoal-light text-[11px] font-mono">
                    Role: {sup.role}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Subtask and Goal */}
          <div>
            <label className="block font-display font-semibold uppercase text-xs tracking-wider text-charcoal mb-2">
              3. WORK TASK SPECIFICATION
            </label>
            <textarea
              id="focus-area-input"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="What are you supposed to be accomplishing? (Be specific)"
              rows={2}
              className="w-full px-3 py-2 bg-paper-light border-2 border-charcoal rounded font-sans text-sm focus:outline-none focus:ring-0 resize-none"
              required
            />
            <p className="text-[11px] font-mono text-charcoal-muted mt-1">
              * This subtask is automatically recorded in every entry of your Excel progression sheet.
            </p>
          </div>

          {/* Section 4: Strictness Level & Timer config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-display font-semibold uppercase text-xs tracking-wider text-charcoal mb-2">
                4. STRICTNESS ENFORCEMENT
              </label>
              <select
                id="strictness-mode-select"
                value={strictnessMode}
                onChange={(e) => setStrictnessMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-paper-light border-2 border-charcoal rounded font-sans text-sm focus:outline-none focus:ring-0"
              >
                <option value="demanding">⚠️ Demanding Mode (3 Pauses, Simple Checks)</option>
                <option value="ruthless">🔥 Ruthless Mode (1 Pause, Constant Checks, Tab Detection)</option>
                <option value="unhinged">💀 Unhinged Mode (0 Pauses, Exact Checks, Tab Invalidation)</option>
              </select>
              <div className="bg-paper-dark p-2 rounded mt-2 border border-charcoal-muted">
                <p className="text-[11px] font-mono text-charcoal">
                  {strictnessMode === 'demanding' && "• 3 Emergency pauses allowed. Moderate checking frequency."}
                  {strictnessMode === 'ruthless' && "• Only 1 emergency pause. Checks every few mins. Tab switching adds a strike."}
                  {strictnessMode === 'unhinged' && "• No pausing allowed. Constant verification checks. Tab switching invalidates session immediately."}
                </p>
              </div>
            </div>

            <div>
              <label className="block font-display font-semibold uppercase text-xs tracking-wider text-charcoal mb-2">
                5. SESSION CONFIGURATION
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] font-mono block text-charcoal-muted mb-1">FOCUS TIME</span>
                  <select
                    id="focus-duration-select"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-paper-light border-2 border-charcoal rounded font-mono text-xs focus:outline-none"
                  >
                    <option value={25}>25 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={50}>50 Minutes</option>
                    <option value={1}>1 Minute (Fast Test)</option>
                    <option value={0.25}>15 Seconds (Demo)</option>
                  </select>
                </div>
                <div>
                  <span className="text-[11px] font-mono block text-charcoal-muted mb-1">BREAK TIME</span>
                  <select
                    id="break-duration-select"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-paper-light border-2 border-charcoal rounded font-mono text-xs focus:outline-none"
                  >
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                    <option value={1}>1 Minute (Fast Test)</option>
                    <option value={0.1}>6 Seconds (Demo)</option>
                  </select>
                </div>
              </div>
              <p className="text-[10px] font-mono text-charcoal-muted mt-2">
                * Select the demo modes to quickly see the session log export mechanism!
              </p>
            </div>
          </div>

          {/* Guidelines disclaimer */}
          <div className="eink-border-thin p-3 rounded bg-paper-light eink-stripe flex items-start gap-2">
            <ShieldAlert size={18} className="text-charcoal shrink-0 mt-0.5" />
            <div className="text-[11px] font-mono text-charcoal">
              <span className="font-bold">NOTICE OF ACCOUNTABILITY:</span> By clicking the button below, you surrender all slacking privileges. A detailed audit ledger will be logged into your system.
            </div>
          </div>

          {/* Submit button */}
          <button
            id="start-audit-button"
            type="submit"
            className="w-full bg-charcoal text-paper font-display font-bold uppercase py-3 rounded-lg border-2 border-charcoal hover:bg-paper-light hover:text-charcoal cursor-pointer tracking-wider text-sm transition-all duration-150 eink-shadow eink-btn-active flex items-center justify-center gap-2"
          >
            <Flame size={16} /> INITIALIZE STRICT FOCUS SESSION
          </button>
        </form>
      </EInkCard>
    </div>
  );
}
