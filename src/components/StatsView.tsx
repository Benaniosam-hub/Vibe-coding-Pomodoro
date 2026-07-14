import React, { useState } from 'react';
import { SessionLog } from '../types';
import EInkCard from './EInkCard';
import { Award, ShieldAlert, Zap, BookOpen } from 'lucide-react';

interface StatsViewProps {
  logs: SessionLog[];
  stats: {
    totalFocusTime: number;
    sessionsCompleted: number;
    sessionsFailed: number;
    totalStrikes: number;
    longestStreak: number;
    currentStreak: number;
  };
}

export default function StatsView({ logs, stats }: StatsViewProps) {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');

  // Let's filter logs by timeframe
  const filteredLogsByTimeframe = () => {
    const now = new Date();
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      if (timeframe === 'today') {
        return logDate.toDateString() === now.toDateString();
      } else if (timeframe === 'week') {
        // Last 7 days
        const diffTime = Math.abs(now.getTime() - logDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      } else {
        // Last 30 days
        const diffTime = Math.abs(now.getTime() - logDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }
    });
  };

  const currentLogs = filteredLogsByTimeframe();

  // Let's map daily work hours for the SVG Bar Chart
  // We will gather the last 7 days (or last 7 sessions for demonstration if empty)
  const getChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    
    // Initialize last 7 days with 0 minutes
    const dayMap: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayName = days[d.getDay()];
      dayMap[dayName] = 0;
    }

    // Populate with real focus minutes
    logs.forEach(log => {
      if (log.status === 'COMPLETED') {
        const logDate = new Date(log.timestamp);
        const dayName = days[logDate.getDay()];
        if (dayMap[dayName] !== undefined) {
          dayMap[dayName] += log.actualDuration;
        }
      }
    });

    return Object.keys(dayMap).map(key => ({
      label: key,
      value: dayMap[key]
    }));
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.value), 25); // At least 25 for scaling

  // Calculate success score
  const totalRounds = stats.sessionsCompleted + stats.sessionsFailed;
  const focusSuccessRate = totalRounds > 0 
    ? Math.round((stats.sessionsCompleted / totalRounds) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Timeframe selector styled like physical tab toggles */}
      <div className="flex border-2 border-charcoal rounded-lg overflow-hidden bg-paper-dark">
        {(['today', 'week', 'month'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setTimeframe(mode)}
            className={`flex-1 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer ${
              timeframe === mode
                ? 'bg-charcoal text-paper font-bold'
                : 'bg-paper text-charcoal hover:bg-paper-dark'
            }`}
          >
            {mode} Stats
          </button>
        ))}
      </div>

      {/* Numerical Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Core Study Minutes */}
        <EInkCard noShadow className="text-center p-3">
          <div className="flex justify-center mb-1 text-charcoal">
            <BookOpen size={18} />
          </div>
          <span className="block font-mono text-xs text-charcoal-muted uppercase">Study Min</span>
          <span className="block font-display font-bold text-2xl tracking-tight mt-1">
            {stats.totalFocusTime}m
          </span>
        </EInkCard>

        {/* Sessions Completed ratio */}
        <EInkCard noShadow className="text-center p-3">
          <div className="flex justify-center mb-1 text-charcoal">
            <Award size={18} />
          </div>
          <span className="block font-mono text-xs text-charcoal-muted uppercase">Rounds Done</span>
          <span className="block font-display font-bold text-2xl tracking-tight mt-1">
            {stats.sessionsCompleted}/{totalRounds}
          </span>
        </EInkCard>

        {/* Total Accountability Strikes */}
        <EInkCard noShadow className="text-center p-3">
          <div className="flex justify-center mb-1 text-charcoal">
            <ShieldAlert size={18} />
          </div>
          <span className="block font-mono text-xs text-charcoal-muted uppercase">Total Strikes</span>
          <span className={`block font-display font-bold text-2xl tracking-tight mt-1 ${
            stats.totalStrikes > 0 ? 'underline decoration-2' : ''
          }`}>
            {stats.totalStrikes}
          </span>
        </EInkCard>

        {/* Focus Streak info */}
        <EInkCard noShadow className="text-center p-3">
          <div className="flex justify-center mb-1 text-charcoal">
            <Zap size={18} />
          </div>
          <span className="block font-mono text-xs text-charcoal-muted uppercase">Day Streak</span>
          <span className="block font-display font-bold text-2xl tracking-tight mt-1">
            {stats.currentStreak}d
          </span>
        </EInkCard>
      </div>

      {/* Custom Retro E-Ink Chart Component */}
      <EInkCard title="WORK TIME progression CHART" subtitle="Aesthetic E-Ink LEDGERS">
        <div className="pt-2">
          {/* Chart visual context */}
          <div className="text-center mb-3">
            <span className="font-mono text-xs text-charcoal-muted uppercase tracking-wider block">
              Focus Hours distribution per day (mins)
            </span>
          </div>

          <div className="relative h-48 w-full border-b-2 border-charcoal flex items-end justify-between px-4 pb-1">
            {/* Horizontal line marks */}
            <div className="absolute left-0 right-0 top-0 border-t border-dashed border-charcoal-light text-[9px] font-mono text-charcoal-muted pt-1">
              Max Peak ({maxValue}m)
            </div>
            <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-charcoal-light text-[9px] font-mono text-charcoal-muted pt-1">
              Mid Point ({Math.round(maxValue / 2)}m)
            </div>

            {/* Custom SVG/Bar elements */}
            {chartData.map((data, idx) => {
              const barHeightPercent = maxValue > 0 ? (data.value / maxValue) * 100 : 0;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 mx-2">
                  <div className="w-full relative group">
                    {/* Floating minutes popover on focus */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-charcoal text-paper font-mono text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {data.value}m
                    </div>
                    {/* The physical E-ink bar (using hatched lines or solid fill based on values) */}
                    <div
                      style={{ height: `${Math.max(barHeightPercent, 4)}%` }}
                      className={`w-full border-2 border-charcoal rounded-t transition-all duration-300 ${
                        data.value > 0 
                          ? 'bg-charcoal eink-stripe' 
                          : 'bg-paper-light border-dashed border-charcoal-light'
                      }`}
                    />
                  </div>
                  {/* Label */}
                  <span className="font-mono text-xs text-charcoal mt-2 uppercase font-bold">
                    {data.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Performance commentary from Father/Uncle */}
          <div className="mt-4 p-3 border-2 border-charcoal rounded bg-paper-light">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-charcoal mb-1">
              System Audit Efficiency: {focusSuccessRate}%
            </h4>
            <p className="font-mono text-xs text-charcoal-muted">
              {focusSuccessRate >= 80 
                ? "Status: ACTIVE & DEDICATED. Your supervisor is moderately satisfied. Keep the streaks alive to prevent a house inspection." 
                : focusSuccessRate >= 50
                ? "Status: DISTRACTED MINDS. Strikes are compiling on your permanent ledger. Reduce pauses and tab changes immediately."
                : "Status: CRITICAL SLACKER. Your reports contain heavy loafing lines. The Excel sheets are highly embarrassing."
              }
            </p>
          </div>
        </div>
      </EInkCard>
    </div>
  );
}
