import React, { useEffect, useState, useRef } from 'react';
import { SessionStatus, Supervisor, SupervisorCheck } from '../types';
import EInkCard from './EInkCard';
import { Play, Pause, Square, AlertCircle, RefreshCw, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

interface TimerViewProps {
  userName: string;
  supervisor: Supervisor;
  strictnessMode: 'demanding' | 'ruthless' | 'unhinged';
  focusArea: string;
  focusDuration: number;
  breakDuration: number;
  onSessionComplete: (duration: number, status: SessionStatus, strikes: number, pausesUsed: number) => void;
  onStrikeIncurred: (reason: string) => void;
  triggerSpotCheck: (prompt: string, requiredKeyword?: string) => void;
  currentStrikes: number;
}

export default function TimerView({
  userName,
  supervisor,
  strictnessMode,
  focusArea,
  focusDuration,
  breakDuration,
  onSessionComplete,
  onStrikeIncurred,
  triggerSpotCheck,
  currentStrikes
}: TimerViewProps) {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(focusDuration * 60);
  const [maxDuration, setMaxDuration] = useState(focusDuration * 60);
  
  // Strictness parameters
  const [pausesLeft, setPausesLeft] = useState(
    strictnessMode === 'demanding' ? 3 : strictnessMode === 'ruthless' ? 1 : 0
  );
  const [pausesUsed, setPausesUsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Statistics counters
  const [sessionCompletedDots, setSessionCompletedDots] = useState<boolean[]>([false, false, false, false]);
  const [activeSessionCount, setActiveSessionCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsLeftRef = useRef(secondsLeft);
  secondsLeftRef.current = secondsLeft;

  // Track state changes to prevent infinite loops and manage ticks
  useEffect(() => {
    // Reset timer state when configuration changes
    setIsRunning(false);
    setMode('focus');
    const totalSecs = focusDuration * 60;
    setSecondsLeft(totalSecs);
    setMaxDuration(totalSecs);
    setPausesLeft(strictnessMode === 'demanding' ? 3 : strictnessMode === 'ruthless' ? 1 : 0);
    setPausesUsed(0);
  }, [focusDuration, strictnessMode]);

  // Audio synthesizer for classic retro alarm bleep
  const playRetroTone = (freq: number, durationMs: number) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'square'; // crisp chip sound
      oscillator.frequency.value = freq;
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + durationMs / 1000);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + durationMs / 1000);
    } catch (e) {
      console.warn("AudioContext failed to trigger", e);
    }
  };

  // Timer Tick Core Loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (secondsLeftRef.current > 0) {
          setSecondsLeft(prev => prev - 1);
          
          // Micro bleep every second for the last 5 seconds (Hectic countdown alert)
          if (secondsLeftRef.current <= 5 && secondsLeftRef.current > 0) {
            playRetroTone(880, 80);
          }

          // Random prompt trigger during focus mode (e.g., 2% chance per minute or specific tick mark)
          if (mode === 'focus' && Math.random() < 0.005) {
            triggerSpotCheck(
              "SUPERVISOR SPOT AUDIT: Complete this phrase immediately to verify your focus.",
              "WORKING HARD"
            );
          }
        } else {
          // Timer reached 0! Focus round or Break round complete.
          handleTimerEnd();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleTimerEnd = () => {
    setIsRunning(false);
    playRetroTone(587.33, 200); // alarm sound
    setTimeout(() => playRetroTone(659.25, 200), 220);
    setTimeout(() => playRetroTone(880, 400), 440);

    if (mode === 'focus') {
      // Completed focus session!
      onSessionComplete(focusDuration, 'COMPLETED', 0, pausesUsed);
      
      // Update session dots visual
      const newDots = [...sessionCompletedDots];
      const nextEmptyDotIndex = newDots.findIndex(d => !d);
      if (nextEmptyDotIndex !== -1) {
        newDots[nextEmptyDotIndex] = true;
        setSessionCompletedDots(newDots);
      } else {
        // Reset dots and increment set
        setSessionCompletedDots([true, false, false, false]);
      }
      
      // Toggle to break mode automatically
      setMode('break');
      setSecondsLeft(breakDuration * 60);
      setMaxDuration(breakDuration * 60);
    } else {
      // Completed break session! Transition back to focus
      onSessionComplete(breakDuration, 'COMPLETED', 0, 0);
      setMode('focus');
      setSecondsLeft(focusDuration * 60);
      setMaxDuration(focusDuration * 60);
    }
  };

  const toggleTimer = () => {
    if (isRunning) {
      // Attempting to PAUSE
      if (pausesLeft > 0) {
        setIsRunning(false);
        setPausesLeft(prev => prev - 1);
        setPausesUsed(prev => prev + 1);
        playRetroTone(440, 150);
      } else {
        // Slacker attempt: Pauses are locked!
        playRetroTone(220, 400); // buzzing error tone
        onStrikeIncurred("Pause attempt with zero remaining emergency allowance!");
        alert(
          `${supervisor.name} has BLOCKED your pause request!\n"You Can't Escape From Me! Suffer and continue focusing. No more emergency pauses."`
        );
      }
    } else {
      // RESUME
      setIsRunning(true);
      playRetroTone(880, 100);
    }
  };

  const handleAbandon = () => {
    if (window.confirm("WARNING: Abandoning this focus round records an 'ABANDONED' label into your permanent Excel sheets. Father will be disappointed. Continue?")) {
      setIsRunning(false);
      onSessionComplete(
        Math.round((maxDuration - secondsLeft) / 60),
        'ABANDONED',
        1, // Penalty strike for abandoning
        pausesUsed
      );
      // Reset
      setSecondsLeft(focusDuration * 60);
      setMaxDuration(focusDuration * 60);
      setMode('focus');
    }
  };

  // Convert seconds to human-readable format
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Percentage for progress indicator
  const progressPercent = maxDuration > 0 ? ((maxDuration - secondsLeft) / maxDuration) * 100 : 0;

  return (
    <EInkCard id="timer-view-module" className="relative flex flex-col justify-center items-center text-center p-6">
      {/* Sound toggler styled as miniature flat control */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute top-4 right-4 p-1.5 border border-charcoal rounded hover:bg-charcoal hover:text-paper cursor-pointer text-charcoal"
        title="Toggle audio alarm feedback"
      >
        {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      </button>

      {/* Mode / Phase Indicator label */}
      <div className="mb-4">
        <span className="font-display font-bold uppercase tracking-widest text-xs bg-charcoal text-paper px-3 py-1 rounded">
          {mode === 'focus' ? '✦ FOCUSING SESSION' : '☕ RESTING BREAK'}
        </span>
        <p className="font-mono text-[10px] text-charcoal-muted mt-2 uppercase">
          Enforcement Mode: {strictnessMode.toUpperCase()}
        </p>
      </div>

      {/* Giant countdown timer digits */}
      <div id="countdown-display" className="font-display font-bold text-7xl md:text-8xl tracking-tighter text-charcoal py-4 select-none tabular-nums my-2">
        {formatTime(secondsLeft)}
      </div>

      {/* Simple Session Progress dots (Based on Flow image from prompt) */}
      <div className="flex gap-2 mb-6">
        {sessionCompletedDots.map((dot, idx) => (
          <div
            key={idx}
            className={`w-3.5 h-3.5 rounded-full border-2 border-charcoal transition-all ${
              dot 
                ? 'bg-charcoal' 
                : 'bg-paper-light border-dashed'
            }`}
            title={`Completed Pomodoro segment ${idx + 1}`}
          />
        ))}
      </div>

      {/* Circular/Square Flat controls bar */}
      <div className="flex gap-4 items-center justify-center w-full max-w-xs mb-6">
        {/* Play/Pause control */}
        <button
          id="play-pause-timer-btn"
          onClick={toggleTimer}
          className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-paper font-display font-bold uppercase py-3 rounded-lg border-2 border-charcoal hover:bg-paper-light hover:text-charcoal cursor-pointer text-xs eink-shadow eink-btn-active"
        >
          {isRunning ? (
            <>
              <Pause size={14} /> {strictnessMode === 'unhinged' ? 'LOCK' : 'PAUSE'}
            </>
          ) : (
            <>
              <Play size={14} /> START
            </>
          )}
        </button>

        {/* Abandon/Reset control */}
        {isRunning && (
          <button
            id="abandon-timer-btn"
            onClick={handleAbandon}
            className="p-3 bg-paper border-2 border-charcoal rounded-lg hover:bg-paper-dark cursor-pointer text-charcoal eink-shadow-sm eink-btn-active"
            title="Abandon this round (Strikes penalty)"
          >
            <Square size={14} />
          </button>
        )}
      </div>

      {/* Hardware-like information display rail */}
      <div className="w-full bg-paper-dark border-t-2 border-charcoal pt-4 px-2 grid grid-cols-2 gap-4 text-left font-mono text-xs">
        <div>
          <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Auditor Account</span>
          <span className="block font-semibold text-charcoal truncate mt-0.5">
            {supervisor.name}
          </span>
        </div>
        <div>
          <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Target Subtask</span>
          <span className="block font-semibold text-charcoal truncate mt-0.5" title={focusArea}>
            {focusArea}
          </span>
        </div>

        <div className="border-t border-dashed border-charcoal-light pt-2">
          <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Emergency Pauses</span>
          <span className="block font-semibold text-charcoal mt-0.5">
            {strictnessMode === 'unhinged' ? 'Blocked (0)' : `${pausesLeft} Left`}
          </span>
        </div>
        <div className="border-t border-dashed border-charcoal-light pt-2">
          <span className="block text-[10px] text-charcoal-muted uppercase font-bold">Current Strikes</span>
          <span className="block font-semibold text-charcoal mt-0.5 flex items-center gap-1">
            {currentStrikes > 0 ? (
              <>
                <ShieldAlert size={12} className="text-charcoal shrink-0" />
                <span className="underline font-bold text-red-700">{currentStrikes} active</span>
              </>
            ) : (
              '0 (Excellent)'
            )}
          </span>
        </div>
      </div>

      {/* Tiny disclaimer */}
      <p className="text-[9px] font-mono text-charcoal-muted mt-4 uppercase">
        * System ID: {strictnessMode.toUpperCase()}-SECTOR-MONITOR
      </p>
    </EInkCard>
  );
}
