import { SFX, type SfxId } from "../sfx";
import { TIMING, VIDEO } from "../theme";
import type { Beat, Episode, LineBeat, Scene, TransitionType, VoiceClip } from "./types";

const FPS = VIDEO.fps;
const sec = (s: number) => Math.round(s * FPS);

export const TRANSITION_SECONDS: Record<TransitionType, number> = {
  cut: 0,
  whip: 0.4,
  zoom: 0.5,
  wipe: 0.5,
  glitch: 0.3,
};

export type TimedLine = LineBeat & {
  index: number;
  from: number; // szenenlokal
  duration: number;
  /** Frame (szenenlokal), ab dem getippt wird */
  typeStart: number;
  /** Frame (szenenlokal), an dem das letzte Zeichen steht */
  typeEnd: number;
  /** Frame-Versatz je Zeichen relativ zu typeStart */
  charFrames: number[];
  /** globaler Zeilen-Index in der Folge (für Varianz) */
  lineNo: number;
  /** Stimme dieser Zeile (startet bei typeStart) */
  voice?: VoiceClip;
};

export type TimedWait = Exclude<Beat, LineBeat> & { index: number; from: number; duration: number };
export type TimedBeat = TimedLine | TimedWait;

export type TimedScene = Scene & {
  from: number; // absolut
  duration: number;
  transitionFrames: number;
  timedBeats: TimedBeat[];
  marks: Record<string, number>;
};

export type AbsCue = { sfx: SfxId; frame: number; volume: number; frames?: number };
export type AbsVoice = { file: string; frame: number; frames: number };

export type EpisodeTimeline = {
  scenes: TimedScene[];
  duration: number;
  cues: AbsCue[];
  voices: AbsVoice[];
};

/** Tipp-Rhythmus: kleine Pausen nach Satzzeichen, damit es natürlich wirkt. */
export const typeSchedule = (text: string) => {
  const step = FPS / TIMING.typeCps;
  const frames: number[] = [];
  let t = 0;
  for (let i = 0; i < text.length; i++) {
    frames.push(t);
    const c = text[i];
    t += step;
    if (c === "," ) t += 3;
    if (c === "." || c === "!" || c === "?" || c === ":") t += 7;
  }
  return { frames, total: Math.ceil(t) };
};

/** Text ohne Hervorhebungs-Markup (*Wort*) */
export const plain = (text: string) => text.replace(/\*/g, "");

/** Tipp-Rhythmus; mit Stimme so gestreckt, dass der Text im Sprechtempo erscheint */
const scheduleFor = (text: string, voice?: VoiceClip) => {
  const sched = typeSchedule(text);
  if (!voice) return sched;
  const target = voice.frames * 0.92;
  const k = target > sched.total ? target / sched.total : 1;
  return { frames: sched.frames.map((f) => f * k), total: Math.ceil(sched.total * k) };
};

export const lineDuration = (line: LineBeat, voice?: VoiceClip) => {
  const { total } = scheduleFor(plain(line.text), voice);
  const read = (plain(line.text).length / TIMING.readCps + TIMING.readPad) * FPS;
  const spoken = voice ? voice.frames + TIMING.voiceTail : 0;
  const visible = Math.max(total + TIMING.minHold * FPS, read, spoken) + (line.hold ?? 0) * FPS;
  return TIMING.bubbleIn + Math.ceil(visible);
};

export const buildTimeline = (ep: Episode): EpisodeTimeline => {
  const scenes: TimedScene[] = [];
  const cues: AbsCue[] = [];
  const voices: AbsVoice[] = [];
  let cursor = 0;
  let lineNo = 0;

  ep.scenes.forEach((scene, si) => {
    const tType = si === 0 ? "cut" : scene.transition?.type ?? "cut";
    const transitionFrames = sec(scene.transition?.seconds ?? TRANSITION_SECONDS[tType]);
    const from = cursor - transitionFrames;
    const leadIn = sec(scene.leadIn ?? (transitionFrames > 0 ? transitionFrames / FPS + 0.15 : 0.1));
    let t = leadIn;
    const marks: Record<string, number> = {};
    let prevFrom = 0;
    const timedBeats: TimedBeat[] = scene.beats.map((beat, index) => {
      if (beat.overlap) t = Math.max(prevFrom + 1, t - sec(beat.overlap));
      prevFrom = t;
      let tb: TimedBeat;
      if (beat.type === "line") {
        const voice = ep.voices?.[lineNo];
        const sched = scheduleFor(plain(beat.text), voice);
        const duration = lineDuration(beat, voice);
        tb = {
          ...beat,
          index,
          from: t,
          duration,
          typeStart: t + TIMING.bubbleIn,
          typeEnd: t + TIMING.bubbleIn + sched.total,
          charFrames: sched.frames,
          lineNo: lineNo++,
          voice,
        };
        cues.push({ sfx: "pop", frame: from + t, volume: SFX.pop.volume });
        if (voice) voices.push({ file: voice.file, frame: from + t + TIMING.bubbleIn, frames: voice.frames });
        // Marken an Textstellen: mit Stimme an der gesprochenen Stelle, sonst im Lesetempo
        const txt = plain(beat.text);
        for (const m of beat.marks ?? []) {
          const idx = txt.indexOf(m.at);
          if (idx < 0) throw new Error(`Marke "${m.mark}": Textstelle "${m.at}" nicht in "${txt}"`);
          const f = t + TIMING.bubbleIn + (voice ? Math.round((idx / txt.length) * voice.frames) : Math.round((idx / TIMING.readCps) * FPS));
          marks[m.mark] = f;
          for (const c of m.cues ?? []) {
            cues.push({ sfx: c.sfx, frame: from + f + sec(c.at ?? 0), volume: SFX[c.sfx].volume * (c.gain ?? 1), frames: c.seconds ? sec(c.seconds) : undefined });
          }
        }
      } else {
        tb = { ...beat, index, from: t, duration: sec(beat.seconds) };
      }
      if (beat.mark) marks[beat.mark] = t;
      for (const c of beat.cues ?? []) {
        cues.push({
          sfx: c.sfx,
          frame: from + t + sec(c.at ?? 0),
          volume: SFX[c.sfx].volume * (c.gain ?? 1),
          frames: c.seconds ? sec(c.seconds) : undefined,
        });
      }
      t += tb.duration;
      return tb;
    });
    const duration = t + sec(scene.tail ?? 0.4);
    if (transitionFrames > 0 && tType !== "cut") {
      cues.push({ sfx: "whoosh", frame: Math.max(0, from - 2), volume: SFX.whoosh.volume });
    }
    scenes.push({ ...scene, from, duration, transitionFrames, timedBeats, marks });
    cursor = from + duration;
  });

  const duck = ep.voices ? TIMING.sfxDuckWithVoice : 1;
  return {
    scenes,
    duration: cursor,
    cues: cues.map((c) => ({ ...c, volume: c.volume * duck })).sort((a, b) => a.frame - b.frame),
    voices,
  };
};

/* ---------- Abfragen für Komponenten ---------- */

export const linesOf = (scene: TimedScene) => scene.timedBeats.filter((b): b is TimedLine => b.type === "line");

/** Aktive (sichtbare) Zeile in einer Szene: die letzte begonnene Zeile bleibt stehen, bis die nächste kommt. */
export const activeLine = (scene: TimedScene, frame: number) => {
  let current: TimedLine | null = null;
  let next: TimedLine | null = null;
  for (const l of linesOf(scene)) {
    if (l.from <= frame) current = l;
    else if (!next) {
      next = l;
    }
  }
  return { current, next };
};

/** Beat, der gerade läuft (letzter begonnener) */
export const activeBeat = (scene: TimedScene, frame: number) => {
  let cur: TimedBeat | null = null;
  for (const b of scene.timedBeats) if (b.from <= frame) cur = b;
  return cur;
};

/** Anzahl getippter Zeichen */
export const typedCount = (line: TimedLine, frame: number) => {
  const rel = frame - line.typeStart;
  if (rel < 0) return 0;
  let n = 0;
  while (n < line.charFrames.length && line.charFrames[n] <= rel) n++;
  return n;
};

export const isTyping = (line: TimedLine, frame: number) => frame >= line.typeStart && frame < line.typeEnd;

export const markFrame = (scene: TimedScene, mark: string, fallback = Infinity) => scene.marks[mark] ?? fallback;
