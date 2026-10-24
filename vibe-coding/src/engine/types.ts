import type { Costumes } from "../characters/accessories";
import type { LocationId } from "../locations";
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
/** pitch (Radiant, negativ = nach unten) nur für Detail-Aufsichten ohne Sprechblase; der 2D-Hintergrund wird dabei ausgeblendet */
export type Shot = { x: number; y: number; dist: number; roll?: number; pitch?: number };

/** "establish" = Eröffnungs-Totale des Ortes (kommt aus der Location) */
export type ShotName = "establish" | "wide" | "twoShot" | "boyClose" | "boyMedium" | "claudeClose" | "claudeMedium" | "deskTop";

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
  /**
   * Marken an Textstellen: feuern, wenn der Zuschauer die Stelle liest (Lesetempo TIMING.readCps),
   * z. B. { mark: "card2", at: "jede Version" }. Optional mit Soundcues relativ zur Marke.
   */
  marks?: { mark: string; at: string; cues?: Cue[] }[];
};

export type WaitBeat = BeatBase & {
  /** "action" = etwas passiert im Bild (Tippen, Klick, Titel ...), "pause" = Luft holen */
  type: "action" | "pause";
  seconds: number;
  /** Reaktions-Shot: Figur zeigt Mimik/Geste ohne Text */
  react?: { who: Speaker; emotion?: Emotion; gesture?: Gesture };
};

export type Beat = LineBeat | WaitBeat;

export type TransitionType = "cut" | "whip" | "zoom" | "wipe" | "glitch";

export type Transition = { type: TransitionType; seconds?: number; direction?: "left" | "right" };

/* ---------- Szenen-Arten ---------- */

export type StageOverlay =
  | { type: "title"; mark: string; kicker: string; title: string; subtitle?: string; until?: string }
  | { type: "folderCloud"; mark: string; until?: string }
  | { type: "follow"; mark: string; text: string; sub?: string }
  /** kleiner Serien-Chip + Thema oben (Establishing) */
  | { type: "series"; mark: string; kicker: string; title: string; until?: string }
  /** große Zahl/Aussage oben im Bild */
  | { type: "stat"; mark: string; big: string; label: string; icon?: BadgeIcon; until?: string }
  /** Vergleich links ↔ rechts (rechts erscheint bei rightMark oder kurz danach) */
  | { type: "compare"; mark: string; rightMark?: string; until?: string; left: CompareSide; right: CompareSide }
  /** Symbol-Abzeichen, die einzeln aufploppen (je eigene Marke) */
  | { type: "badges"; items: { label: string; icon: BadgeIcon; mark: string }[]; until?: string };

export type CompareSide = { icon: BadgeIcon; label: string; note?: string; good?: boolean };

export type BadgeIcon = "folder" | "clock" | "eye" | "rocket" | "mouse" | "terminal" | "remote" | "trash";

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
  cards: { title: string; text: string; icon: BadgeIcon; mark: string }[];
};

export type ShellOutput = string | { text: string; kind?: "error" | "claude" | "ok" | "muted" };

export type TreeNode = { name: string; children?: TreeNode[] };

export type ShellStep = {
  /** Marke, ab der der Befehl getippt wird */
  mark: string;
  command: string;
  output?: ShellOutput[];
  /** Wirkung im Ordnerbaum: ls = Inhalt aufleuchten, cd = "Du bist hier" wandert, mkdir = neuer Ordner wächst */
  tree?: { ls?: boolean; cd?: string; mkdir?: string };
  /** Warnschild statt Ausführen (z. B. bei rm) */
  warn?: { title: string; text: string };
};

/** Großes Terminal mit mehreren Befehlen, optional mit Ordnerbaum darunter */
export type ShellScene = {
  kind: "shell";
  cwd: string[];
  tree?: TreeNode;
  steps: ShellStep[];
};

export type SceneBody = StageScene | BrowserScene | TerminalScene | AppScene | CardsScene | ShellScene;

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

/** Sprachaufnahme einer Dialogzeile (erzeugt von scripts/voices.ts) */
export type VoiceClip = { file: string; frames: number; env: number[] };

export type Episode = {
  id: string;
  series: string;
  number: number;
  title: string;
  /** Drehort dieser Folge (src/locations) */
  location: LocationId;
  /** Requisiten für die Figuren in dieser Folge */
  costumes?: Costumes;
  /** Ziel-Länge in Frames (Serienregel: 1800–1830) – wird von `npm run timeline` geprüft */
  targetFrames?: [number, number];
  /** Optional: Stimmen je Dialogzeile (Reihenfolge = Reihenfolge der Zeilen). Ohne = nur Sprechblasen. */
  voices?: VoiceClip[];
  scenes: Scene[];
};
