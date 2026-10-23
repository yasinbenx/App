import { useMemo } from "react";
import { project, STAGE } from "../engine/camera";
import type { Shot } from "../engine/types";

/**
 * 2D-Ebene, die wie ein Objekt in Tiefe z im 3D-Raum projiziert wird.
 * Inhalt wird in "Welt-Einheiten × 100" gezeichnet (y nach oben = negative SVG-y).
 */
export const Billboard: React.FC<{
  cam: Shot;
  z: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  children: React.ReactNode;
}> = ({ cam, z, x0, x1, y0, y1, children }) => {
  const tl = project(cam, x0, y1, z);
  const w = (x1 - x0) * tl.scale;
  const h = (y1 - y0) * tl.scale;
  return (
    <svg
      viewBox={`${x0 * 100} ${-y1 * 100} ${(x1 - x0) * 100} ${(y1 - y0) * 100}`}
      style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${tl.x}px, ${tl.y}px)`, transformOrigin: "0 0" }}
      preserveAspectRatio="none"
    >
      {children}
    </svg>
  );
};

/** deterministischer Zufall */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

type Building = { x: number; w: number; h: number; windows: { x: number; y: number; on: boolean; seed: number }[] };

const makeSkyline = (seed: number, from: number, to: number, minH: number, maxH: number, winSize: number) => {
  const out: Building[] = [];
  let x = from;
  let i = 0;
  while (x < to) {
    const w = 60 + rand(seed + i) * 110;
    const h = minH + rand(seed + i * 7.1) * (maxH - minH);
    const windows: Building["windows"] = [];
    const cols = Math.max(1, Math.floor((w - 20) / (winSize * 2.2)));
    const rows = Math.floor((h - 30) / (winSize * 2.4));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const s = seed + i * 100 + c * 10 + r;
        windows.push({ x: x + 12 + c * winSize * 2.2, y: h - 22 - r * winSize * 2.4, on: rand(s) > 0.55, seed: s });
      }
    }
    out.push({ x, w, h, windows });
    x += w + 4 + rand(seed + i * 3.3) * 18;
    i++;
  }
  return out;
};

const Skyline: React.FC<{ buildings: Building[]; base: number; color: string; win: number; frame: number; glow: string }> = ({
  buildings,
  base,
  color,
  win,
  frame,
  glow,
}) => (
  <g>
    {buildings.map((b, i) => (
      <g key={i}>
        <rect x={b.x} y={-(base + b.h)} width={b.w} height={b.h + 400} fill={color} />
        {i % 3 === 0 && <rect x={b.x + b.w / 2 - 3} y={-(base + b.h) - 30} width={6} height={30} fill={color} />}
        {b.windows.map((w, j) => {
          // einzelne Fenster gehen langsam an/aus
          const flick = rand(w.seed + Math.floor((frame + w.seed * 7) / 150)) > 0.9;
          const on = w.on !== flick;
          return on ? <rect key={j} x={w.x} y={-(base + w.y)} width={win} height={win * 1.3} fill={glow} opacity={0.55 + rand(w.seed * 3) * 0.45} /> : null;
        })}
      </g>
    ))}
  </g>
);

export const NightRoom: React.FC<{ cam: Shot; frame: number }> = ({ cam, frame }) => {
  const far = useMemo(() => makeSkyline(11, -2600, 2600, 300, 900, 14), []);
  const mid = useMemo(() => makeSkyline(57, -1200, 1200, 80, 330, 9), []);
  const stars = useMemo(
    () => Array.from({ length: 90 }, (_, i) => ({ x: -2600 + rand(i * 3.7) * 5200, y: 900 + rand(i * 9.1) * 1300, r: 3 + rand(i) * 5, s: i })),
    [],
  );

  const W = STAGE.wallZ;
  // Fensteröffnung in Weltkoordinaten
  const win = { x0: -1.5, x1: 1.75, y0: 1.2, y1: 3.75 };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0B0E26" }}>
      {/* Himmel + ferne Stadt (sehr tief → kaum Bewegung) */}
      <Billboard cam={cam} z={STAGE.cityZ} x0={-26} x1={26} y0={-6} y1={24}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070A22" />
            <stop offset="0.55" stopColor="#1B1A4A" />
            <stop offset="0.8" stopColor="#4A2E66" />
            <stop offset="1" stopColor="#B4586A" />
          </linearGradient>
          <radialGradient id="moonGlow">
            <stop offset="0" stopColor="#FFF4D6" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={-2600} y={-2400} width={5200} height={3000} fill="url(#sky)" />
        {stars.map((s) => (
          <circle key={s.s} cx={s.x} cy={-s.y} r={s.r} fill="#FFFFFF" opacity={0.35 + 0.5 * Math.abs(Math.sin(frame / 20 + s.s))} />
        ))}
        <circle cx={500} cy={-1500} r={420} fill="url(#moonGlow)" />
        <circle cx={500} cy={-1500} r={130} fill="#FFF1CF" />
        <circle cx={540} cy={-1530} r={110} fill="#1B1A4A" opacity={0.25} />
        <Skyline buildings={far} base={-150} color="#1C1E4A" win={14} frame={frame} glow="#FFD27A" />
      </Billboard>

      {/* nahe Häuser (mittlere Tiefe) */}
      <Billboard cam={cam} z={-9} x0={-12} x1={12} y0={-4} y1={6}>
        <Skyline buildings={mid} base={-150} color="#121433" win={9} frame={frame + 40} glow="#FFC266" />
      </Billboard>

      {/* Wand mit Fensteröffnung */}
      <Billboard cam={cam} z={W} x0={-6} x1={6} y0={-1} y1={7}>
        <defs>
          <radialGradient id="lampGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFB45E" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#FF9A4A" stopOpacity="0.18" />
            <stop offset="1" stopColor="#FF9A4A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#241B33" />
            <stop offset="1" stopColor="#3A2A3E" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          fill="url(#wallGrad)"
          d={`M-600 -700 H600 V100 H-600 Z M${win.x0 * 100} ${-win.y1 * 100} H${win.x1 * 100} V${-win.y0 * 100} H${win.x0 * 100} Z`}
        />
        {/* Lampenlicht an der Wand */}
        <circle cx={-120} cy={-170} r={260} fill="url(#lampGlow)" />
        {/* Fensterrahmen */}
        <g fill="none" stroke="#5B3A2C" strokeWidth={14}>
          <rect x={win.x0 * 100} y={-win.y1 * 100} width={(win.x1 - win.x0) * 100} height={(win.y1 - win.y0) * 100} />
          <line x1={((win.x0 + win.x1) / 2) * 100} y1={-win.y1 * 100} x2={((win.x0 + win.x1) / 2) * 100} y2={-win.y0 * 100} />
          <line x1={win.x0 * 100} y1={-260} x2={win.x1 * 100} y2={-260} strokeWidth={10} />
        </g>
        <rect x={win.x0 * 100 - 20} y={-win.y0 * 100} width={(win.x1 - win.x0) * 100 + 40} height={14} fill="#6E4834" />
        {/* Lichterkette über dem Fenster */}
        <path d={`M${win.x0 * 100 - 30} ${-win.y1 * 100 + 6} Q ${((win.x0 + win.x1) / 2) * 100} ${-win.y1 * 100 + 60} ${win.x1 * 100 + 30} ${-win.y1 * 100 + 6}`} stroke="#2A1E22" strokeWidth={3} fill="none" />
        {Array.from({ length: 13 }, (_, i) => {
          const t = i / 12;
          const x = win.x0 * 100 - 30 + t * ((win.x1 - win.x0) * 100 + 60);
          const y = -win.y1 * 100 + 6 + 4 * t * (1 - t) * 54;
          const pulse = 0.65 + 0.35 * Math.sin(frame / 12 + i * 1.7);
          return (
            <g key={i}>
              <circle cx={x} cy={y + 6} r={16} fill="#FFC56B" opacity={0.25 * pulse} />
              <circle cx={x} cy={y + 6} r={6} fill="#FFE3A6" opacity={pulse} />
            </g>
          );
        })}
        {/* Poster links */}
        <g transform="translate(-330 -330) rotate(-3)">
          <rect x={-70} y={-90} width={140} height={180} rx={6} fill="#D97757" />
          <rect x={-58} y={-78} width={116} height={156} rx={4} fill="none" stroke="#FFE7D6" strokeWidth={3} opacity={0.6} />
          <text x={0} y={18} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize={56} fill="#FFF3E8">
            {"</>"}
          </text>
        </g>
        {/* Regal rechts */}
        <g transform="translate(300 -300)">
          <rect x={-90} y={0} width={180} height={10} fill="#6E4834" />
          <rect x={-80} y={-60} width={18} height={60} fill="#3E6DB5" />
          <rect x={-60} y={-52} width={14} height={52} fill="#E0B04A" />
          <rect x={-44} y={-64} width={20} height={64} fill="#7A4FA0" />
          <circle cx={40} cy={-26} r={26} fill="#3DA37A" />
          <rect x={22} y={-14} width={36} height={14} fill="#B5643E" />
        </g>
      </Billboard>
    </div>
  );
};
