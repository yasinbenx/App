import type { SfxId } from "../sfx";

export type Speaker = "boy" | "claude";

export type Emotion = "neutral" | "confused" | "surprised" | "happy" | "excited" | "thinking";

export type Gesture =
  | "none"
  | "shrug" // beide Hände offen nach oben
  | "explain" // eine Hand erklärt, leichte Kreisbewegung
  | "point" // zeigt nach oben/zur Seite
  | "wow" // beide Hände hoch
  | "scratch" // kratzt sich am Kopf
  | "count" // zählt an den Fingern (Arm hebt sich rhythmisch)
  | "wave"; // winkt

/** Kameraposition in Weltkoordinaten (Bühne). dist = Abstand zur Ebene z=0 */
export type Shot = { x: number; y: number; dist: number; roll?: number };

export type ShotName = "wide" | "twoShot" | "boyClose" | "boyMedium" | "claudeClose" | "claudeMedium" | "deskTop";

export type ShotRef = ShotName | Shot;

export type CameraChange = {
  shot: ShotRef;
  /** "cut" = harter Schnitt, "ease" = weiche Fahrt (Standard) */
  mode?: "cut" | "ease";
  /** Dauer der Fahrt in Sekunden (bei ease) */
  seconds?: number;
  /** Zoom-Punch: kurzer Ruck nach vorn mit Shake */
  punch?: boolean;
  /** langsame Fahrt während des Beats: positiv = rein, negativ = raus (Anteil der Distanz) */
  drift?: number;
};

export type Cue = {
  sfx: SfxId;
  /** Sekunden ab Beat-Start (darf negativ sein) */
  at?: number;
  /** Lautstärke-Faktor relativ zur Basislautstärke aus sfx.ts */
  gain?: number;
  /** Länge kürzen (s), z. B. für Tastatur */
  seconds?: number;
};

type BeatBase = {
  /** Benannte Marke, auf die Einblendungen reagieren (z. B. "showResults") */
  mark?: string;
  camera?: CameraChange;
  cues?: Cue[];
  /** Beat startet so viele Sekunden früher, überlappt also den vorherigen (z. B. Aktion, während die Blase noch steht) */
  overlap?: number;
};

export type LineBeat = BeatBase & {
  type: "line";
  speaker: Speaker;
  text: string;
  emotion?: Emotion;
  gesture?: Gesture;
  /** Zusätzliche Standzeit in Sekunden */
  hold?: number;
};

export type WaitBeat = BeatBase & {
  /** "action" = etwas passiert im Bild (Tippen, Klick, Titel ...), "pause" = Luft holen */
  type: "action" | "pause";
  seconds: number;
};

export type Beat = LineBeat | WaitBeat;

export type TransitionType = "cut" | "whip" | "zoom" | "wipe" | "glitch";

export type Transition = { type: TransitionType; seconds?: number; direction?: "left" | "right" };

/* ---------- Szenen-Arten ---------- */

export type StageOverlay =
  | { type: "title"; mark: string; kicker: string; title: string; subtitle?: string; until?: string }
  | { type: "folderCloud"; mark: string; until?: string }
  | { type: "follow"; mark: string; text: string; sub?: string };

export type StageScene = {
  kind: "stage";
  /** Start-Einstellung der Kamera */
  camera: CameraChange;
  overlays?: StageOverlay[];
};

export type BrowserScene = {
  kind: "browser";
  url: string;
  query: string;
  resultsLabel: string;
  results: { repo: string; desc: string; stars: string; lang: string; langColor: string }[];
};

export type TerminalScene = {
  kind: "terminal";
  cwd: string;
  command: string;
  output: string[];
};

export type AppScene = {
  kind: "app";
  url: string;
  appTitle: string;
  habits: { label: string; icon: "drop" | "book" | "walk" | "code"; done?: boolean; streak: number }[];
  /** Index der Gewohnheit, die abgehakt wird */
  checkIndex: number;
};

export type CardsScene = {
  kind: "cards";
  heading: string;
  cards: { title: string; text: string; icon: "rocket" | "clock" | "eye"; mark: string }[];
};

export type SceneBody = StageScene | BrowserScene | TerminalScene | AppScene | CardsScene;

export type Scene = SceneBody & {
  id: string;
  /** Übergang VON der vorherigen Szene in diese */
  transition?: Transition;
  /** Luft vor dem ersten Beat (s), Standard: Übergangsdauer + 0,2 s */
  leadIn?: number;
  /** Luft nach dem letzten Beat (s) */
  tail?: number;
  beats: Beat[];
};

export type Episode = {
  id: string;
  series: string;
  number: number;
  title: string;
  scenes: Scene[];
};
