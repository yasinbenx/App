import { Easing, interpolate } from "remotion";
import { VIDEO } from "../theme";
import type { TimedScene } from "./timeline";
import type { CameraChange, Shot, ShotName, ShotRef } from "./types";

/** Kamera: blickt immer gerade entlang -z (keine Rotation), damit 2D-Ebenen exakt mitlaufen. */
export const FOV = 40;
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180);
const H = VIDEO.height;
const W = VIDEO.width;

/** Feste Positionen der Figuren auf der Bühne (Weltkoordinaten, y = oben) */
export const STAGE = {
  boy: { x: -0.62, headY: 1.62, headR: 0.32 },
  claude: { x: 0.64, y: 1.42, r: 0.42 },
  deskTop: 0.78,
  wallZ: -1.4,
  cityZ: -30,
};

export const SHOTS: Record<ShotName, Shot> = {
  establish: { x: 0.2, y: 2.4, dist: 9 },
  wide: { x: 0.18, y: 2.12, dist: 6.6 },
  twoShot: { x: 0.12, y: 1.98, dist: 5.4 },
  boyClose: { x: -0.5, y: 1.72, dist: 3.0 },
  boyMedium: { x: -0.42, y: 1.84, dist: 3.9 },
  claudeClose: { x: 0.72, y: 1.56, dist: 3.1 },
  claudeMedium: { x: 0.6, y: 1.72, dist: 4.0 },
  deskTop: { x: -0.4, y: 1.3, dist: 2.4 },
};

type ShotOverrides = Partial<Record<ShotName, Shot>>;

export const resolveShot = (s: ShotRef, overrides: ShotOverrides = {}): Shot =>
  typeof s === "string" ? (overrides[s] ?? SHOTS[s]) : s;

/** Pixel pro Welteinheit in Tiefe z */
export const ppu = (cam: Shot, z: number) => H / 2 / ((cam.dist - z) * TAN);

export const project = (cam: Shot, x: number, y: number, z = 0) => {
  const k = ppu(cam, z);
  return { x: W / 2 + (x - cam.x) * k, y: H / 2 - (y - cam.y) * k, scale: k };
};

const mix = (a: Shot, b: Shot, t: number): Shot => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  dist: a.dist + (b.dist - a.dist) * t,
  roll: (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * t,
});

const ease = Easing.bezier(0.65, 0, 0.35, 1);

/** Liefert Kamera + Shake/Punch-Infos einer Bühnenszene zu einem (szenenlokalen) Frame. */
export const cameraAt = (scene: TimedScene & { camera: CameraChange }, frame: number, overrides: ShotOverrides = {}) => {
  type Change = CameraChange & { at: number; until: number };
  const changes: Change[] = [{ ...scene.camera, at: 0, until: scene.duration }];
  for (const b of scene.timedBeats) {
    if (b.camera) changes.push({ ...b.camera, at: b.from, until: b.from + b.duration });
  }
  // Ende der Gültigkeit = Beginn der nächsten Änderung
  for (let i = 0; i < changes.length - 1; i++) changes[i].until = changes[i + 1].at;

  let prev: Shot = resolveShot(changes[0].shot, overrides);
  let cam = prev;
  let punch = 0;
  let shake = 0;
  for (let i = 0; i < changes.length; i++) {
    const c = changes[i];
    if (frame < c.at) break;
    const target = resolveShot(c.shot, overrides);
    const local = frame - c.at;
    const moveFrames = Math.max(1, Math.round((c.seconds ?? 0.8) * 30));
    const t = c.mode === "cut" || i === 0 ? 1 : ease(Math.min(1, local / moveFrames));
    let base = mix(prev, target, t);
    // Drift: langsame Fahrt während der Einstellung
    const drift = c.drift ?? 0.05;
    const span = Math.max(1, c.until - c.at);
    const d = interpolate(local, [0, span], [0, drift], { extrapolateRight: "clamp" });
    base = { ...base, dist: base.dist * (1 - d) };
    if (c.punch) {
      const p = interpolate(local, [0, 4, 16], [0.22, 0.1, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      punch = Math.max(punch, p);
      shake = Math.max(shake, interpolate(local, [0, 12], [1, 0], { extrapolateRight: "clamp" }));
      base = { ...base, dist: base.dist * (1 - p) };
    }
    cam = base;
    // Ausgangspunkt für die nächste Fahrt = Endstand dieser Einstellung
    prev = { ...target, dist: target.dist * (1 - drift) };
  }
  // ganz leichtes Handkamera-Atmen
  const breathe = {
    x: Math.sin(frame / 47) * 0.012 + Math.sin(frame / 23) * 0.004,
    y: Math.cos(frame / 53) * 0.01,
  };
  return {
    cam: { ...cam, x: cam.x + breathe.x, y: cam.y + breathe.y },
    punch,
    shake,
  };
};

export const shakeOffset = (amount: number, frame: number) => ({
  x: amount * 18 * Math.sin(frame * 2.3),
  y: amount * 14 * Math.cos(frame * 3.1),
});
