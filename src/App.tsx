import React, { useState, useEffect } from 'react';
import { SessionLog, SessionStatus, Supervisor, SupervisorCheck, UserStats } from './types';
import { SUPERVISORS, MOCK_INTERACTION_PROMPTS } from './data/supervisors';
import SupervisorSetup from './components/SupervisorSetup';
import SupervisorFeedback from './components/SupervisorFeedback';
import TimerView from './components/TimerView';
import StatsView from './components/StatsView';
import LogsView from './components/LogsView';
import { RefreshCw, Layout, BarChart, History, Settings, ExternalLink, HelpCircle } from 'lucide-react';

export default function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [userName, setUserName] = useState('Son');
  const [supervisor, setSupervisor] = useState<Supervisor>(SUPERVISORS[0]);
  const [strictnessMode, setStrictnessMode] = useState<'demanding' | 'ruthless' | 'unhinged'>('ruthless');
  const [focusArea, setFocusArea] = useState('Writing high-performance code');
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  // App navigation state
  const [currentView, setCurrentView] = useState<'timer' | 'stats' | 'logs'>('timer');
  const [flashEffect, setFlashEffect] = useState(false);

  // Core Data States (synchronized with localStorage)
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalFocusTime: 0,
    sessionsCompleted: 0,
    sessionsFailed: 0,
    totalStrikes: 0,
    longestStreak: 0,
    currentStreak: 0
  });

  // Active supervision states
  const [activeCheck, setActiveCheck] = useState<SupervisorCheck | null>(null);
  const [tabSwitchViolation, setTabSwitchViolation] = useState(false);
  const [currentStrikes, setCurrentStrikes] = useState(0);

  // Load persistent database state on launch
  useEffect(() => {
    const storedLogs = localStorage.getItem('eink_pomodoro_logs');
    const storedStats = localStorage.getItem('eink_pomodoro_stats');
    const storedUser = localStorage.getItem('eink_pomodoro_user');

    if (storedLogs) {
      try {
        const parsedLogs = JSON.parse(storedLogs);
        setLogs(parsedLogs);
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    } else {
      // Seed default logs on very first launch so charts are not empty!
      seedInitialLogs();
    }

    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats));
      } catch (e) {}
    }

    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUserName(userObj.userName);
        const savedSupervisor = SUPERVISORS.find(s => s.type === userObj.supervisorType);
        if (savedSupervisor) setSupervisor(savedSupervisor);
        setStrictnessMode(userObj.strictnessMode);
        setFocusArea(userObj.focusArea);
        setIsConfigured(true);
      } catch (e) {}
    }
  }, []);

  // Save changes to localstorage on update
  const saveLogs = (updatedLogs: SessionLog[]) => {
    setLogs(updatedLogs);
    localStorage.setItem('eink_pomodoro_logs', JSON.stringify(updatedLogs));
    recalculateStats(updatedLogs);
  };

  const seedInitialLogs = () => {
    const today = new Date();
    const seedLogs: SessionLog[] = [
      {
        id: 'mock-1',
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        time: '09:15',
        timestamp: today.getTime() - 4 * 24 * 60 * 60 * 1000,
        focusArea: 'Refactoring legacy API modules',
        targetDuration: 25,
        actualDuration: 25,
        status: 'COMPLETED',
        supervisorName: 'Arthur (Father)',
        supervisorRole: 'Father & Head of Household',
        strikes: 0,
        pausesUsed: 0,
        evaluationComment: "Acceptable output. But I expect 12 rounds tomorrow."
      },
      {
        id: 'mock-2',
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        time: '14:22',
        timestamp: today.getTime() - 3 * 24 * 60 * 60 * 1000,
        focusArea: 'Analyzing slow Spanner DB queries',
        targetDuration: 45,
        actualDuration: 45,
        status: 'COMPLETED',
        supervisorName: 'Uncle Dave',
        supervisorRole: 'Opinionated Relative',
        strikes: 1,
        pausesUsed: 1,
        evaluationComment: "You took a pause to check stock markets? Slacker! Timmy works straight."
      },
      {
        id: 'mock-3',
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        time: '11:00',
        timestamp: today.getTime() - 2 * 24 * 60 * 60 * 1000,
        focusArea: 'Implementing PDF sheet exporter',
        targetDuration: 25,
        actualDuration: 25,
        status: 'COMPLETED',
        supervisorName: 'Arthur (Father)',
        supervisorRole: 'Father & Head of Household',
        strikes: 0,
        pausesUsed: 0,
        evaluationComment: "Excellent focus. Your mother is proud. I remain cautious."
      },
      {
        id: 'mock-4',
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        time: '16:05',
        timestamp: today.getTime() - 1 * 24 * 60 * 60 * 1000,
        focusArea: 'Writing unit test suite',
        targetDuration: 50,
        actualDuration: 25,
        status: 'LOAFED',
        supervisorName: 'Uncle Dave',
        supervisorRole: 'Opinionated Relative',
        strikes: 3,
        pausesUsed: 2,
        evaluationComment: "ABSOLUTELY PATHETIC. Slashed active rounds to game on Discord."
      }
    ];
    setLogs(seedLogs);
    localStorage.setItem('eink_pomodoro_logs', JSON.stringify(seedLogs));
    recalculateStats(seedLogs);
  };

  const recalculateStats = (currentLogs: SessionLog[]) => {
    const completed = currentLogs.filter(l => l.status === 'COMPLETED');
    const failed = currentLogs.filter(l => l.status !== 'COMPLETED');
    const totalFocusTime = completed.reduce((acc, curr) => acc + curr.actualDuration, 0);
    const totalStrikes = currentLogs.reduce((acc, curr) => acc + curr.strikes, 0);

    // Calculate daily streak
    const uniqueDates = Array.from(new Set(completed.map(l => l.date))).sort();
    let currentStreak = 0;
    let longestStreak = 0;

    if (uniqueDates.length > 0) {
      currentStreak = 1;
      longestStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
        } else if (diff > 1) {
          currentStreak = 1;
        }
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      }
    }

    const calculatedStats: UserStats = {
      totalFocusTime,
      sessionsCompleted: completed.length,
      sessionsFailed: failed.length,
      totalStrikes,
      longestStreak,
      currentStreak
    };

    setStats(calculatedStats);
    localStorage.setItem('eink_pomodoro_stats', JSON.stringify(calculatedStats));
  };

  const handleSetupComplete = (setup: {
    userName: string;
    supervisor: Supervisor;
    strictnessMode: 'demanding' | 'ruthless' | 'unhinged';
    focusArea: string;
    focusDuration: number;
    breakDuration: number;
  }) => {
    setUserName(setup.userName);
    setSupervisor(setup.supervisor);
    setStrictnessMode(setup.strictnessMode);
    setFocusArea(setup.focusArea);
    setFocusDuration(setup.focusDuration);
    setBreakDuration(setup.breakDuration);
    setIsConfigured(true);

    // Save profile config
    localStorage.setItem('eink_pomodoro_user', JSON.stringify({
      userName: setup.userName,
      supervisorType: setup.supervisor.type,
      strictnessMode: setup.strictnessMode,
      focusArea: setup.focusArea
    }));

    triggerFlashEffect();
  };

  // Hardware visual flash effect to mimic actual E-ink screen refresh rate
  const triggerFlashEffect = () => {
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 300);
  };

  // Event handler for tab changes (Visibiliy detection)
  useEffect(() => {
    if (!isConfigured) return;

    const handleVisibility = () => {
      if (document.hidden) {
        // Tab changed! Trigger strict action
        if (strictnessMode !== 'demanding') {
          setTabSwitchViolation(true);
          playAudibleBuzz();
          handleStrikeIncurred("TAB SWITCH: Subject attempted to browse external websites!");
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isConfigured, strictnessMode]);

  const playAudibleBuzz = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime); // ugly low frequency buzz
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  };

  // Keep track of active surprise checks
  const handleTriggerSpotCheck = (prompt: string, requiredKeyword?: string) => {
    // Only trigger if no spotcheck is already active
    if (activeCheck) return;

    const newCheck: SupervisorCheck = {
      id: Math.random().toString(),
      prompt,
      secondsLeft: 30,
      maxSeconds: 30,
      isActive: true,
      requiredKeyword
    };

    setActiveCheck(newCheck);

    const checkInterval = setInterval(() => {
      setActiveCheck(prev => {
        if (!prev) {
          clearInterval(checkInterval);
          return null;
        }
        if (prev.secondsLeft > 1) {
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        } else {
          // Time expired! User failed check and gets a strike
          clearInterval(checkInterval);
          handleStrikeIncurred("SPOT CHECK FAILED: Subject did not verify presence in specified window!");
          alert(`${supervisor.name} says: "Inspection failed! A strike was compiled."`);
          return null;
        }
      });
    }, 1000);
  };

  const handleSpotCheckAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      alert(`${supervisor.name} says: "Mmh. You verified your active posture. Continue working."`);
    } else {
      handleStrikeIncurred("SPOT CHECK MALFORMED: Provided verification keyword was wrong!");
      alert(`${supervisor.name} says: "Wrong! You didn't type the phrase properly. Strike added!"`);
    }
    setActiveCheck(null);
  };

  const handleStrikeIncurred = (reason: string) => {
    setCurrentStrikes(prev => prev + 1);
    playAudibleBuzz();
  };

  // Completing or failing a complete focus/break session
  const handleSessionComplete = (
    actualMinutes: number,
    status: SessionStatus,
    sessionStrikes: number,
    pausesUsed: number
  ) => {
    const finalStrikes = currentStrikes + sessionStrikes;
    
    // Choose custom comments based on how bad they did
    let comment = "Satisfactory round.";
    if (status === 'COMPLETED') {
      if (finalStrikes === 0) {
        comment = supervisor.type === 'father' 
          ? "Good work, son. Proud of you. Keep going."
          : "Nice. Your cousin Timmy is still ahead, but this is progress.";
      } else {
        comment = supervisor.type === 'father'
          ? "You finished, but the tab-changes and strikes are noted."
          : "Not bad, but your mother will see those strike marks.";
      }
    } else if (status === 'ABANDONED') {
      comment = supervisor.type === 'father'
        ? "PATHTIC SLACKING. Abandoned work round. Highly disappointed."
        : "You gave up! Absolute amateur effort. I am printing this.";
    }

    const todayDate = new Date();
    const timeStr = todayDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const newLog: SessionLog = {
      id: Math.random().toString(),
      date: todayDate.toISOString().slice(0, 10),
      time: timeStr,
      timestamp: todayDate.getTime(),
      focusArea: focusArea || 'Undetermined Focus Task',
      targetDuration: focusDuration,
      actualDuration: actualMinutes,
      status,
      supervisorName: supervisor.name,
      supervisorRole: supervisor.role,
      strikes: finalStrikes,
      pausesUsed,
      evaluationComment: comment
    };

    const updatedLogs = [newLog, ...logs];
    saveLogs(updatedLogs);
    
    // Reset strikes for next round
    setCurrentStrikes(0);
    triggerFlashEffect();
  };

  const handleSeedLog = () => {
    const today = new Date();
    const randomArea = [
      "Designing responsive layout widgets",
      "Drafting business proposal presentation",
      "Auditing full-stack security tokens",
      "Optimizing cold start container benchmarks"
    ][Math.floor(Math.random() * 4)];

    const seed: SessionLog = {
      id: 'sim-' + Math.random().toString().slice(2, 8),
      date: today.toISOString().slice(0, 10),
      time: today.toTimeString().slice(0, 5),
      timestamp: today.getTime(),
      focusArea: randomArea,
      targetDuration: 25,
      actualDuration: 25,
      status: 'COMPLETED',
      supervisorName: supervisor.name,
      supervisorRole: supervisor.role,
      strikes: Math.floor(Math.random() * 2),
      pausesUsed: Math.floor(Math.random() * 2),
      evaluationComment: supervisor.type === 'father' 
        ? "Completed, but keep the focus tighter. No loose cells." 
        : "Timmy did this with zero strikes. Try harder."
    };

    saveLogs([seed, ...logs]);
    triggerFlashEffect();
  };

  const handleClearLogs = () => {
    if (window.confirm("Wipe all logged sessions? This clears your permanent spreadsheet database history.")) {
      saveLogs([]);
      localStorage.removeItem('eink_pomodoro_logs');
      localStorage.removeItem('eink_pomodoro_stats');
      triggerFlashEffect();
    }
  };

  const handleResetSetup = () => {
    if (window.confirm("Do you want to re-configure your Auditor/Supervisor settings? Active clocks will reset.")) {
      localStorage.removeItem('eink_pomodoro_user');
      setIsConfigured(false);
      setCurrentStrikes(0);
      setActiveCheck(null);
      setTabSwitchViolation(false);
      triggerFlashEffect();
    }
  };

  return (
    <div className={`min-h-screen bg-paper flex items-center justify-center p-4 selection:bg-charcoal selection:text-paper ${
      flashEffect ? 'eink-flash-effect' : ''
    }`}>
      {/* Outer physical hardware-like chassis wrapper (High Density Industrial Bezel) */}
      <div className="w-full max-w-5xl bg-paper-light border-[12px] border-charcoal rounded-none p-6 md:p-8 flex flex-col relative">
        
        {/* Chassis Top Bar Indicator lights */}
        <div className="flex justify-between items-center border-b-2 border-charcoal pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-charcoal" />
            <span className="font-mono text-xs tracking-wider font-bold text-charcoal">
              YOU CAN'T ESCAPE FROM ME • E-INK SYSTEM 1.0
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Clock display */}
            <span className="font-mono text-xs font-semibold bg-paper-dark border border-charcoal px-2.5 py-0.5 rounded text-charcoal">
              SYS-TIME: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
        </div>

        {/* Setup Screen or Main Workspace */}
        {!isConfigured ? (
          <SupervisorSetup onComplete={handleSetupComplete} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Dynamic dialogue & tabs */}
            <div className="lg:col-span-1 space-y-6 flex flex-col">
              
              {/* Supervisor dialogue box */}
              <SupervisorFeedback
                supervisor={supervisor}
                activeCheck={activeCheck}
                onCheckAnswer={handleSpotCheckAnswer}
                tabSwitchViolation={tabSwitchViolation}
                onClearTabViolation={() => {
                  setTabSwitchViolation(false);
                  triggerFlashEffect();
                }}
                currentStrikes={currentStrikes}
                timerState={activeCheck ? 'paused' : 'focus'}
              />

              {/* Hardware Styled Tab Navigation (Kindle style side menu) */}
              <div className="flex flex-col border-2 border-charcoal rounded-lg overflow-hidden bg-paper-light">
                <button
                  id="nav-timer-btn"
                  onClick={() => { setCurrentView('timer'); triggerFlashEffect(); }}
                  className={`flex items-center gap-3 px-4 py-3 font-display font-bold uppercase text-xs tracking-wider border-b-2 border-charcoal cursor-pointer text-left transition-all ${
                    currentView === 'timer'
                      ? 'bg-charcoal text-paper'
                      : 'bg-paper-light text-charcoal hover:bg-paper-dark'
                  }`}
                >
                  <Layout size={16} /> 1. Countdown Core
                </button>
                <button
                  id="nav-stats-btn"
                  onClick={() => { setCurrentView('stats'); triggerFlashEffect(); }}
                  className={`flex items-center gap-3 px-4 py-3 font-display font-bold uppercase text-xs tracking-wider border-b-2 border-charcoal cursor-pointer text-left transition-all ${
                    currentView === 'stats'
                      ? 'bg-charcoal text-paper'
                      : 'bg-paper-light text-charcoal hover:bg-paper-dark'
                  }`}
                >
                  <BarChart size={16} /> 2. Work Analytics
                </button>
                <button
                  id="nav-logs-btn"
                  onClick={() => { setCurrentView('logs'); triggerFlashEffect(); }}
                  className={`flex items-center gap-3 px-4 py-3 font-display font-bold uppercase text-xs tracking-wider cursor-pointer text-left transition-all ${
                    currentView === 'logs'
                      ? 'bg-charcoal text-paper'
                      : 'bg-paper-light text-charcoal hover:bg-paper-dark'
                  }`}
                >
                  <History size={16} /> 3. Progression Ledger
                </button>
              </div>

              {/* Reset Profile hardware link */}
              <button
                id="reset-configuration-btn"
                onClick={handleResetSetup}
                className="flex items-center justify-center gap-2 bg-paper-dark border border-charcoal hover:bg-charcoal hover:text-paper font-mono text-[10px] uppercase py-2 px-3 rounded cursor-pointer transition-all text-charcoal"
              >
                <Settings size={12} /> Reset Auditor Settings
              </button>
            </div>

            {/* Right Columns: Active tab views */}
            <div className="lg:col-span-2">
              {currentView === 'timer' && (
                <TimerView
                  userName={userName}
                  supervisor={supervisor}
                  strictnessMode={strictnessMode}
                  focusArea={focusArea}
                  focusDuration={focusDuration}
                  breakDuration={breakDuration}
                  onSessionComplete={handleSessionComplete}
                  onStrikeIncurred={handleStrikeIncurred}
                  triggerSpotCheck={handleTriggerSpotCheck}
                  currentStrikes={currentStrikes}
                />
              )}

              {currentView === 'stats' && (
                <StatsView logs={logs} stats={stats} />
              )}

              {currentView === 'logs' && (
                <LogsView
                  logs={logs}
                  supervisor={supervisor}
                  userName={userName}
                  onClearLogs={handleClearLogs}
                  onAddSimulatedLog={handleSeedLog}
                />
              )}
            </div>
          </div>
        )}

        {/* Physical chassis bottom info bar */}
        <div className="border-t-2 border-charcoal mt-8 pt-4 flex flex-wrap justify-between items-center text-[11px] font-mono text-charcoal-muted gap-2">
          <span>
            OPERATIONAL STATUS: [ SECURE_AUDIT_STRICT ]
          </span>
          <div className="flex gap-4">
            <span>DEVICE: KINDLE_PEBBLE_HYBRID</span>
            <span className="flex items-center gap-1">
              REFRESH STATE <RefreshCw size={10} className="animate-spin-slow" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
