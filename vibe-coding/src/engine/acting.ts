import { activeBeat, activeLine, type TimedScene } from "./timeline";
import type { Emotion, Gesture, Speaker } from "./types";

export type Acting = {
  /** Mundöffnung 0..1 */
  mouth: number;
  emotion: Emotion;
  gesture: Gesture;
  /** Frames seit Gestenbeginn */
  gestureT: number;
  /** Gewicht der Geste 0..1 (weiches Ein-/Ausblenden) */
  gestureW: number;
  talking: boolean;
  /** Blickrichtung: -1 links .. 1 rechts */
  look: number;
  /** Augenlid 0 = offen, 1 = zu */
  blink: number;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const blinkAt = (frame: number, seed: number) => {
  // Blinzeln alle ~3-4 s, 5 Frames lang
  const period = 97 + seed * 13;
  const t = (frame + seed * 41) % period;
  return t < 5 ? Math.sin((t / 5) * Math.PI) : 0;
};

/** Leitet Mund, Mimik und Gestik einer Figur aus dem Dialog ab. */
export const actingFor = (who: Speaker, scene: TimedScene, frame: number): Acting => {
  const seed = who === "boy" ? 1 : 2;
  const { current } = activeLine(scene, frame);
  const other: Speaker = who === "boy" ? "claude" : "boy";
  const base: Acting = {
    mouth: 0,
    emotion: "neutral",
    gesture: "none",
    gestureT: 0,
    gestureW: 0,
    talking: false,
    look: who === "boy" ? 0.25 : -0.25,
    blink: blinkAt(frame, seed),
  };
  // Reaktions-Shot ohne Text
  const beat = activeBeat(scene, frame);
  if (beat && beat.type !== "line" && beat.react && beat.react.who === who && frame < beat.from + beat.duration) {
    const end = beat.from + beat.duration;
    return {
      ...base,
      emotion: beat.react.emotion ?? "surprised",
      gesture: beat.react.gesture ?? "none",
      gestureT: frame - beat.from,
      gestureW: clamp((frame - beat.from) / 6) * clamp((end - frame) / 8),
      look: 0,
    };
  }
  if (!current) return base;

  if (current.speaker !== who) {
    // Zuhören: zum Sprecher schauen, nach dessen Zeile wieder neutral
    const listenEmotion: Emotion =
      current.emotion === "surprised" || current.emotion === "excited" ? "happy" : "neutral";
    return { ...base, emotion: listenEmotion, look: other === "claude" ? 0.6 : -0.6 };
  }

  const end = current.from + current.duration;
  const gestureW = clamp((frame - current.from) / 8) * clamp((end - frame) / 10);
  const rel = frame - current.typeStart;
  let mouth = 0;
  if (current.voice) {
    // Lippensync: Lautstärke-Hüllkurve der Aufnahme (pro Frame, 0..1)
    const v = rel >= 0 ? current.voice.env[rel] ?? 0 : 0;
    mouth = v < 0.25 ? 0 : clamp((v - 0.2) * 1.5);
  } else if (rel >= 0 && frame < current.typeEnd) {
    // Pause im Tipp-Rhythmus (nach Satzzeichen) → Mund zu
    const idx = current.charFrames.findIndex((f) => f > rel);
    const gap = idx > 0 ? current.charFrames[idx] - current.charFrames[idx - 1] : 1;
    const inPause = gap > 3 && rel - current.charFrames[idx - 1] > 1.5;
    const syll = Math.abs(Math.sin((rel * Math.PI) / 4.2 + seed));
    const vary = 0.65 + 0.35 * Math.abs(Math.sin(rel * 0.37 + seed * 3));
    mouth = inPause ? 0.05 : clamp(syll * vary);
  }
  return {
    ...base,
    mouth,
    emotion: current.emotion ?? "neutral",
    gesture: current.gesture ?? "explain",
    gestureT: frame - current.from,
    gestureW,
    // mit Stimme: während der ganzen Aufnahme "sprechend" (kein Mimik-Flackern in Atempausen)
    talking: current.voice ? rel >= 0 && rel < current.voice.frames : mouth > 0,
    look: who === "boy" ? 0.15 : -0.15,
  };
};
