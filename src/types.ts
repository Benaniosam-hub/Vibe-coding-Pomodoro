export type SupervisorType = 'father' | 'uncle';

export interface Supervisor {
  type: SupervisorType;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
  strictness: 'demanding' | 'ruthless' | 'unhinged';
  catchphrases: string[];
}

export type SessionStatus = 'COMPLETED' | 'LOAFED' | 'ABANDONED' | 'OVERRUN';

export interface SessionLog {
  id: string;
  date: string;       // e.g. "2026-07-13"
  time: string;       // e.g. "14:22"
  timestamp: number;
  focusArea: string;
  targetDuration: number; // in minutes
  actualDuration: number; // in minutes
  status: SessionStatus;
  supervisorName: string;
  supervisorRole: string;
  strikes: number;
  pausesUsed: number;
  evaluationComment: string;
}

export interface SupervisorCheck {
  id: string;
  prompt: string;
  secondsLeft: number;
  maxSeconds: number;
  isActive: boolean;
  requiredKeyword?: string;
}

export interface UserStats {
  totalFocusTime: number; // in minutes
  sessionsCompleted: number;
  sessionsFailed: number;
  totalStrikes: number;
  longestStreak: number;
  currentStreak: number;
}
