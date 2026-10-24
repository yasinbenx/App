export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

/** TikTok-UI: unten (Caption/Buttons) und rechts (Like-/Share-Leiste) frei halten. */
export const SAFE = {
  top: 170,
  bottom: 380,
  right: 120,
  left: 60,
} as const;

/** Nutzbarer Bereich für Text & wichtige Elemente (in px) */
export const SAFE_BOX = {
  x: SAFE.left,
  y: SAFE.top,
  w: VIDEO.width - SAFE.left - SAFE.right - 20,
  h: VIDEO.height - SAFE.top - SAFE.bottom - 20,
  /** Unterkante, die nichts Wichtiges überschreiten darf */
  bottomY: VIDEO.height - SAFE.bottom - 20,
  rightX: VIDEO.width - SAFE.right - 20,
};

export const COLORS = {
  ink: "#1B1430",
  paper: "#FFF8EF",
  coral: "#D97757",
  coralDark: "#B85A3E",
  coralLight: "#F2A585",
  star: "#FFC94D",
  teal: "#2E8C83",
  night: "#0E1230",
  nightMid: "#24204A",
  wall: "#2E2338",
  warm: "#FFB866",
  window: "#FFD27A",
  green: "#3DD68C",
  gh: "#0D1117",
  ghPanel: "#161B22",
  ghBorder: "#30363D",
  ghText: "#E6EDF3",
  ghMuted: "#8B949E",
  ghBlue: "#4493F8",
};

export const FONT = {
  ui: "Nunito, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

/** Dialog-Timing */
export const TIMING = {
  /** Tippgeschwindigkeit der Sprechblasen (Zeichen/Sekunde) */
  typeCps: 42,
  /** Mindest-Lesezeit: Blase steht insgesamt mindestens Zeichen/readCps Sekunden */
  readCps: 20,
  /** Zusätzliche Standzeit nach der Mindest-Lesezeit (s) */
  readPad: 0.1,
  /** Mindest-Standzeit nach dem Ende des Tippens (s) */
  minHold: 0.5,
  /** Pop-in der Blase bevor die erste Taste kommt (Frames) */
  bubbleIn: 5,
  /** Folgen mit Stimme: Soundeffekte leiser mischen */
  sfxDuckWithVoice: 0.55,
  /** Folgen mit Stimme: Luft nach dem gesprochenen Satz (Frames) */
  voiceTail: 8,
};
