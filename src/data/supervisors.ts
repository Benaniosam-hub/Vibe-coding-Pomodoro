import { Supervisor } from '../types';

export const SUPERVISORS: Supervisor[] = [
  {
    type: 'father',
    name: 'Arthur (Father)',
    role: 'Father & Head of Household',
    email: 'father.arthur.strict@accountability.org',
    strictness: 'ruthless',
    catchphrases: [
      "Stop slacking. Focus is the only path to a stable career.",
      "In my days, we had no 'Pomodoro'. We worked until the job was done.",
      "You clicked 'Pause'? Is this how you handle adversity?",
      "I am checking the Excel log at the end of the day. No empty cells.",
      "Your cousin Tim is studying 14 hours a day. Are you resting again?",
      "Close the distraction tabs. I can see your eyes wandering.",
      "The timer is ticking, and so is your future. Focus, son."
    ]
  },
  {
    type: 'uncle',
    name: 'Uncle Dave',
    role: 'Opinionated Relative',
    email: 'dave.uncle.realist@cousincomparison.com',
    strictness: 'unhinged',
    catchphrases: [
      "A 5-minute break? In this economy? My son is already a Senior Director.",
      "I'm printing this work progression sheet for the next family dinner.",
      "You switched tabs? I'm noting this down. Cousin Lily doesn't switch tabs.",
      "Are you actually studying or just typing random characters to bypass my checks?",
      "Don't worry, your mother will see the spreadsheet tonight.",
      "You've taken 3 breaks and studied for 20 minutes? What a heavy shift!",
      "If you escape this timer, you escape your potential. Get back to work!"
    ]
  }
];

export const MOCK_INTERACTION_PROMPTS = [
  {
    prompt: "RE-VERIFY ACTIVITY: Briefly type exactly what you are studying or coding right now.",
    requiredKeyword: ""
  },
  {
    prompt: "ATTENTION CHECK: Type 'I PROMISE I AM NOT LOOKING AT REDDIT' to continue focusing.",
    requiredKeyword: "I PROMISE I AM NOT LOOKING AT REDDIT"
  },
  {
    prompt: "E-INK VERIFICATION: What is the main outcome of this current focus session?",
    requiredKeyword: ""
  },
  {
    prompt: "FATHERLY SURPRISE INSPECTION: Type 'WORKING HARD' or get flagged as SLACKING.",
    requiredKeyword: "WORKING HARD"
  },
  {
    prompt: "UNCLE'S DOUBT CHECK: Your cousin already studied 2 hours. Type 'I WILL NOT COWER' to prove your focus.",
    requiredKeyword: "I WILL NOT COWER"
  }
];
