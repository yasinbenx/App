import { useMemo } from "react";
import * as THREE from "three";
import { Billboard, rand } from "../backgrounds/NightRoom";
import { Mat } from "../characters/materials";
import { STAGE } from "../engine/camera";
import type { Shot } from "../engine/types";
import { Laptop } from "./props";
import type { Location } from "./types";

/* Ort: gemütliches Café bei Regen – Marmortisch, Laptop, Latte-Art, Regen an der großen Scheibe. */

const WIN = { x0: -1.6, x1: 1.9, y0: 1.05, y1: 3.85 };

/* ---------- 2D-Hintergrund ---------- */

const Street: React.FC<{ frame: number }> = ({ frame }) => {
  const blocks = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        x: -1500 + i * 190 + rand(i) * 40,
        w: 150 + rand(i * 3.1) * 70,
        h: 300 + rand(i * 5.3) * 520,
        c: ["#3B3550", "#433A52", "#35304A"][i % 3],
      })),
    [],
  );
  const bokeh = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        x: -1400 + rand(i * 7.7) * 2800,
        y: -60 - rand(i * 2.9) * 520,
        r: 18 + rand(i * 4.1) * 46,
        c: ["#FFC27A", "#FF8A5C", "#FFE6B0", "#9FC7FF", "#FF6B6B"][i % 5],
        s: i,
      })),
    [],
  );
  return (
    <>
      <defs>
        <linearGradient id="cafeSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C2440" />
          <stop offset="0.55" stopColor="#3A4364" />
          <stop offset="1" stopColor="#6E6378" />
        </linearGradient>
        <filter id="cafeBlur">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <rect x={-1500} y={-1500} width={3000} height={1900} fill="url(#cafeSky)" />
      <g filter="url(#cafeBlur)">
        {blocks.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={-b.h} width={b.w} height={b.h + 400} fill={b.c} />
            {Array.from({ length: 8 }, (_, k) => (
              <rect key={k} x={b.x + 20 + (k % 3) * 44} y={-b.h + 40 + Math.floor(k / 3) * 90} width={26} height={40} fill="#FFC77A" opacity={rand(i * 10 + k) > 0.45 ? 0.75 : 0.1} />
            ))}
          </g>
        ))}
        <rect x={-1500} y={-20} width={3000} height={420} fill="#2A2638" />
        {bokeh.map((b) => (
          <circle key={b.s} cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity={0.35 + 0.25 * Math.sin(frame / 25 + b.s)} />
        ))}
      </g>
    </>
  );
};

const Rain: React.FC<{ frame: number; count: number; w: number; h: number; speed: number; opacity: number }> = ({ frame, count, w, h, speed, opacity }) => {
  const drops = useMemo(() => Array.from({ length: count }, (_, i) => ({ x: rand(i * 1.3) * w - w / 2, y: rand(i * 8.1) * h, l: 30 + rand(i * 2.2) * 50, s: 0.8 + rand(i * 6.6) * 0.5 })), [count, w, h]);
  return (
    <g stroke="#CFE0FF" strokeWidth={3} opacity={opacity} strokeLinecap="round">
      {drops.map((d, i) => {
        const y = ((d.y + frame * speed * d.s) % h) - h + 200;
        return <line key={i} x1={d.x} y1={y} x2={d.x - d.l * 0.18} y2={y + d.l} />;
      })}
    </g>
  );
};

/** Tropfen auf der Scheibe (statisch + langsam herablaufend) */
const GlassDrops: React.FC<{ frame: number; x0: number; y0: number; w: number; h: number; n: number; scale: number }> = ({ frame, x0, y0, w, h, n, scale }) => {
  const drops = useMemo(() => Array.from({ length: n }, (_, i) => ({ x: rand(i * 3.3) * w, y: rand(i * 9.7) * h, r: (3 + rand(i * 4.4) * 7) * scale, run: rand(i * 5.5) > 0.82 })), [n, w, h, scale]);
  return (
    <g>
      {drops.map((d, i) => {
        const y = d.run ? (d.y + frame * 2.2 * scale) % h : d.y;
        return (
          <g key={i}>
            {d.run && <line x1={x0 + d.x} y1={y0 + y - 60 * scale} x2={x0 + d.x} y2={y0 + y} stroke="#DDE8FF" strokeWidth={2 * scale} opacity={0.25} />}
            <circle cx={x0 + d.x} cy={y0 + y} r={d.r} fill="#DCE7FF" opacity={0.28} />
            <circle cx={x0 + d.x - d.r * 0.3} cy={y0 + y - d.r * 0.3} r={d.r * 0.35} fill="#FFFFFF" opacity={0.6} />
          </g>
        );
      })}
    </g>
  );
};

const Background: React.FC<{ cam: Shot; frame: number }> = ({ cam, frame }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#1A1A2A" }}>
    {/* Straße draußen, unscharf */}
    <Billboard cam={cam} z={-16} x0={-15} x1={15} y0={-4} y1={15}>
      <Street frame={frame} />
    </Billboard>
    {/* Regen vor der Scheibe */}
    <Billboard cam={cam} z={-4} x0={-6} x1={6} y0={-1} y1={8}>
      <Rain frame={frame} count={140} w={1200} h={1000} speed={22} opacity={0.4} />
    </Billboard>
    {/* Wand mit großer Fensterfront */}
    <Billboard cam={cam} z={STAGE.wallZ} x0={-6} x1={6} y0={-1} y1={7}>
      <defs>
        <linearGradient id="cafeWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24382F" />
          <stop offset="1" stopColor="#2F463A" />
        </linearGradient>
        <radialGradient id="cafeWarm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFB870" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FFB870" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8EEF8" stopOpacity="0" />
          <stop offset="1" stopColor="#E8EEF8" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {/* beschlagene Scheibe unten + Tropfen */}
      <rect x={WIN.x0 * 100} y={-WIN.y1 * 100} width={(WIN.x1 - WIN.x0) * 100} height={(WIN.y1 - WIN.y0) * 100} fill="url(#fog)" />
      <GlassDrops frame={frame} x0={WIN.x0 * 100} y0={-WIN.y1 * 100} w={(WIN.x1 - WIN.x0) * 100} h={(WIN.y1 - WIN.y0) * 100} n={70} scale={1} />
      <path
        fillRule="evenodd"
        fill="url(#cafeWall)"
        d={`M-600 -700 H600 V100 H-600 Z M${WIN.x0 * 100} ${-WIN.y1 * 100} H${WIN.x1 * 100} V${-WIN.y0 * 100} H${WIN.x0 * 100} Z`}
      />
      {/* Holzvertäfelung unten */}
      <rect x={-600} y={-WIN.y0 * 100 + 10} width={1200} height={200} fill="#5A3A28" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={-600 + i * 50} y={-WIN.y0 * 100 + 10} width={4} height={200} fill="#4A2F20" />
      ))}
      <circle cx={-40} cy={-300} r={320} fill="url(#cafeWarm)" />
      {/* Fensterrahmen, Sprossen */}
      <g fill="none" stroke="#1F1C1A" strokeWidth={16}>
        <rect x={WIN.x0 * 100} y={-WIN.y1 * 100} width={(WIN.x1 - WIN.x0) * 100} height={(WIN.y1 - WIN.y0) * 100} />
        <line x1={((WIN.x0 + WIN.x1) / 2) * 100} y1={-WIN.y1 * 100} x2={((WIN.x0 + WIN.x1) / 2) * 100} y2={-WIN.y0 * 100} strokeWidth={12} />
        <line x1={WIN.x0 * 100} y1={-320} x2={WIN.x1 * 100} y2={-320} strokeWidth={10} />
      </g>
      {/* Kreidetafel links */}
      <g transform="translate(-300 -300)">
        <rect x={-90} y={-110} width={180} height={220} rx={8} fill="#6E4834" />
        <rect x={-80} y={-100} width={160} height={200} rx={4} fill="#22282A" />
        <text x={0} y={-62} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={26} fill="#F4EFE6">MENÜ</text>
        {["Latte  3,40", "Cappu  3,20", "Kakao  2,90", "Croissant 2,10"].map((t, i) => (
          <text key={t} x={-64} y={-20 + i * 30} fontFamily="Nunito" fontWeight={700} fontSize={19} fill="#E8E2D6" opacity={0.9}>
            {t}
          </text>
        ))}
      </g>
      {/* Regal rechts mit Tassen */}
      <g transform="translate(300 -280)">
        <rect x={-100} y={0} width={200} height={10} fill="#6E4834" />
        {[-70, -30, 10].map((x, i) => (
          <g key={x}>
            <rect x={x} y={-34} width={30} height={34} rx={4} fill={i === 1 ? "#D97757" : "#F2EDE4"} />
            <circle cx={x + 34} cy={-17} r={8} fill="none" stroke={i === 1 ? "#D97757" : "#F2EDE4"} strokeWidth={4} />
          </g>
        ))}
        <circle cx={70} cy={-28} r={26} fill="#3DA37A" />
        <rect x={54} y={-14} width={32} height={14} fill="#B5643E" />
      </g>
    </Billboard>
  </div>
);

/** Regentropfen auf der Scheibe, durch die die Establishing-Einstellung schaut (blendet beim Reinfahren aus). */
const Foreground: React.FC<{ cam: Shot; frame: number }> = ({ cam, frame }) => {
  const o = Math.min(1, Math.max(0, (cam.dist - 5.6) / 2.6));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(110,140,190,0.10), rgba(200,215,240,0.22))" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <GlassDrops frame={frame} x0={0} y0={0} w={1080} h={1920} n={90} scale={2.6} />
      </svg>
    </div>
  );
};

/* ---------- 3D-Set ---------- */

const useHeart = () =>
  useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.03);
    s.bezierCurveTo(-0.05, 0.0, -0.045, 0.04, -0.02, 0.04);
    s.bezierCurveTo(-0.008, 0.04, 0, 0.03, 0, 0.022);
    s.bezierCurveTo(0, 0.03, 0.008, 0.04, 0.02, 0.04);
    s.bezierCurveTo(0.045, 0.04, 0.05, 0.0, 0, -0.03);
    return new THREE.ShapeGeometry(s, 6);
  }, []);

const Latte: React.FC<{ frame: number }> = ({ frame }) => {
  const heart = useHeart();
  const top = 0.115;
  return (
    <group position={[STAGE.boy.x + 0.55, STAGE.deskTop + 0.035, 0.6]}>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.02, 12]} />
        <Mat color="#F6F1EA" rough={0.4} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.09, 0.065, 0.11, 12]} />
        <Mat color="#F6F1EA" rough={0.4} />
      </mesh>
      <mesh position={[0.1, 0.075, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.032, 0.011, 4, 8]} />
        <Mat color="#F6F1EA" />
      </mesh>
      <mesh position={[0, top + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.082, 14]} />
        <Mat color="#B57B4A" rough={0.5} />
      </mesh>
      <mesh geometry={heart} position={[0, top + 0.014, 0.005]} rotation={[-Math.PI / 2, 0, 0]} scale={1.3}>
        <meshStandardMaterial color="#FBF1E2" roughness={0.6} />
      </mesh>
      {/* Dampf */}
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 25) % 75) / 75;
        return (
          <mesh key={i} position={[Math.sin(t * 6 + i) * 0.03, top + 0.05 + t * 0.35, 0]} scale={0.6 + t}>
            <icosahedronGeometry args={[0.035, 1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.22 * (1 - t)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const Set3D: React.FC<{ frame: number }> = ({ frame }) => {
  const veins = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ x: -1.6 + rand(i * 2.7) * 3.2, z: 0.05 + rand(i * 4.9) * 0.85, r: rand(i * 7.1) * Math.PI, l: 0.3 + rand(i) * 0.6 })), []);
  const top = STAGE.deskTop;
  return (
    <group>
      {/* Bistrostuhl hinter dem Jungen */}
      <group position={[STAGE.boy.x, 1.12, -0.36]}>
        <mesh>
          <torusGeometry args={[0.3, 0.035, 5, 14]} />
          <Mat color="#3A2418" />
        </mesh>
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, -0.3, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.6, 5]} />
            <Mat color="#3A2418" />
          </mesh>
        ))}
      </group>
      {/* Marmorplatte */}
      <mesh position={[0, top - 0.035, 0.45]}>
        <boxGeometry args={[3.6, 0.07, 0.95]} />
        <Mat color="#EEEAE3" rough={0.35} />
      </mesh>
      {veins.map((v, i) => (
        <mesh key={i} position={[v.x, top + 0.001, v.z]} rotation={[-Math.PI / 2, 0, v.r]}>
          <planeGeometry args={[v.l, 0.008]} />
          <meshStandardMaterial color="#A9A49C" transparent opacity={0.7} />
        </mesh>
      ))}
      {/* Holz-Unterbau mit Lamellen (verdeckt die Beine) */}
      <mesh position={[0, top / 2 - 0.08, 0.84]}>
        <boxGeometry args={[3.5, top - 0.1, 0.04]} />
        <Mat color="#4E3426" />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={i} position={[-1.7 + i * 0.2, top / 2 - 0.08, 0.865]}>
          <boxGeometry args={[0.03, top - 0.14, 0.012]} />
          <Mat color="#3E281C" />
        </mesh>
      ))}
      <Laptop frame={frame} lid="#9AA2B1" base="#7E8696" />
      <Latte frame={frame} />
      {/* Croissant auf Teller */}
      <group position={[1.32, top + 0.02, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.17, 0.15, 0.02, 12]} />
          <Mat color="#F6F1EA" rough={0.4} />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0.3]} scale={[1, 1, 0.7]}>
          <torusGeometry args={[0.08, 0.045, 5, 9, Math.PI * 1.25]} />
          <Mat color="#D9963C" />
        </mesh>
      </group>
      {/* Hängelampen */}
      {[-0.9, 1.05].map((x, i) => (
        <group key={x} position={[x, 3.15 + Math.sin(frame / 40 + i) * 0.01, 0.15]}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.8, 4]} />
            <Mat color="#1E1A18" />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.2, 0.22, 10, 1, true]} />
            <meshStandardMaterial color="#2F5A4A" flatShading side={2} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <icosahedronGeometry args={[0.06, 1]} />
            <meshBasicMaterial color="#FFE7B8" />
          </mesh>
          <pointLight position={[0, -0.2, 0]} intensity={2.2} distance={3.2} decay={1.5} color="#FFB868" />
        </group>
      ))}
    </group>
  );
};

const Lights: React.FC<{ frame: number }> = () => (
  <>
    <ambientLight intensity={0.5} color="#B09A8C" />
    <hemisphereLight args={["#8FA8D8", "#3A2A20", 0.6]} />
    <directionalLight position={[-2, 3, 5]} intensity={1.8} color="#FFD2A0" />
    <directionalLight position={[2.5, 2.5, -3]} intensity={2.4} color="#7FA6E0" />
  </>
);

export const cafe: Location = {
  id: "cafe",
  name: "Café bei Regen",
  bg: "#1A1A2A",
  Background,
  Foreground,
  Set3D,
  Lights,
  grade: "radial-gradient(ellipse at 45% 50%, rgba(255,180,110,0.12) 0%, rgba(0,0,0,0) 45%, rgba(10,12,22,0.5) 100%)",
  shots: {
    // Establishing: von draußen durch die verregnete Scheibe auf den Tisch
    establish: { x: 0.2, y: 2.3, dist: 10 },
  },
};
