// Zentrale Liste aller Soundeffekte der Serie.
// Wird vom Video (Mix-Lautstärken) und von scripts/generate-sfx.mjs (ElevenLabs-Prompts) benutzt.

export type SfxId = "pop" | "whoosh" | "keyboard" | "click" | "success" | "boom";

export type SfxSpec = {
  file: string;
  description: string;
  /** Prompt für die ElevenLabs-Sound-Effects-API */
  prompt: string;
  /** Länge in Sekunden für die Generierung */
  seconds: number;
  /** Basis-Lautstärke im Mix (0..1). Dateien werden vorher auf -16 dBFS Peak normalisiert. */
  volume: number;
};

export const SFX: Record<SfxId, SfxSpec> = {
  pop: {
    file: "sfx/pop.mp3",
    description: "Sprechblase erscheint: kurzer, weicher Bubble-Pop (ca. 0,2 s)",
    prompt: "Short soft cartoon bubble pop, cute UI pop sound, clean, no reverb",
    seconds: 0.5,
    volume: 0.55,
  },
  whoosh: {
    file: "sfx/whoosh.mp3",
    description: "Szenenübergang: schneller Luft-Whoosh / Swipe (ca. 0,5 s)",
    prompt: "Fast airy whoosh swipe transition, short, clean, cinematic",
    seconds: 0.8,
    volume: 0.5,
  },
  keyboard: {
    file: "sfx/keyboard.mp3",
    description: "Tastatur: schnelles Tippen auf einer Laptop-/mechanischen Tastatur (ca. 3 s)",
    prompt: "Fast typing on a laptop keyboard, close up, steady rhythm, no room noise",
    seconds: 3,
    volume: 0.45,
  },
  click: {
    file: "sfx/click.mp3",
    description: "Einzelner Mausklick (ca. 0,15 s)",
    prompt: "Single crisp computer mouse click, close up, dry",
    seconds: 0.5,
    volume: 0.6,
  },
  success: {
    file: "sfx/success.mp3",
    description: "Erfolgs-Ding: heller, freundlicher Glocken-/Chime-Ton (ca. 1 s)",
    prompt: "Bright cheerful success chime ding, single bell notification, short tail",
    seconds: 1.2,
    volume: 0.5,
  },
  boom: {
    file: "sfx/boom.mp3",
    description: "Kurzer, satter Boom/Impact für die Titelkarte (ca. 1,5 s)",
    prompt: "Short punchy cinematic boom impact hit with deep sub, quick decay, trailer title hit",
    seconds: 1.5,
    volume: 0.6,
  },
};
