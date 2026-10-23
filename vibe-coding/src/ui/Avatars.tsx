import type { Speaker } from "../engine/types";
import { COLORS } from "../theme";

/** Kleine 2D-Porträts der Figuren für Einblendungs-Szenen */
export const Avatar: React.FC<{ who: Speaker; size: number; mouth?: number; blink?: number }> = ({ who, size, mouth = 0, blink = 0 }) => {
  const eyeH = 1 - blink * 0.9;
  const mouthH = 4 + mouth * 16;
  if (who === "claude") {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx={60} cy={60} r={58} fill="#3A2440" stroke={COLORS.ink} strokeWidth={4} />
        <circle cx={60} cy={70} r={36} fill={COLORS.coral} />
        <path d="M34 62 L48 40 L72 40 L86 62 L80 86 L60 100 L40 86 Z" fill="#E58C6B" opacity={0.35} />
        <polygon
          points="60,12 64.4,22.9 76,23.6 67,31 70,42.4 60,36 50,42.4 53,31 44,23.6 55.6,22.9"
          fill={COLORS.star}
          stroke="#E09A20"
          strokeWidth={1.5}
        />
        <ellipse cx={48} cy={66} rx={5} ry={8 * eyeH} fill={COLORS.ink} />
        <ellipse cx={72} cy={66} rx={5} ry={8 * eyeH} fill={COLORS.ink} />
        <circle cx={50} cy={62} r={1.8} fill="#fff" />
        <circle cx={74} cy={62} r={1.8} fill="#fff" />
        <ellipse cx={38} cy={78} rx={6} ry={3.5} fill="#F7A08C" />
        <ellipse cx={82} cy={78} rx={6} ry={3.5} fill="#F7A08C" />
        {mouth > 0.05 ? (
          <ellipse cx={60} cy={84} rx={7} ry={mouthH / 2} fill="#5A1E24" />
        ) : (
          <path d="M53 81 Q60 88 67 81" stroke="#5A1E24" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        )}
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={60} cy={60} r={58} fill="#203C4A" stroke={COLORS.ink} strokeWidth={4} />
      <path d="M22 120 Q24 92 60 90 Q96 92 98 120 Z" fill={COLORS.teal} />
      <circle cx={60} cy={60} r={30} fill="#F2C29E" />
      <circle cx={30} cy={62} r={6} fill="#E0A882" />
      <circle cx={90} cy={62} r={6} fill="#E0A882" />
      <path d="M28 58 Q26 26 60 24 Q94 26 92 58 Q84 40 70 42 L72 34 L62 42 L56 34 L52 44 Q36 42 28 58 Z" fill="#3A2316" />
      <ellipse cx={49} cy={62} rx={5} ry={6.5 * eyeH} fill={COLORS.ink} />
      <ellipse cx={71} cy={62} rx={5} ry={6.5 * eyeH} fill={COLORS.ink} />
      <circle cx={51} cy={59} r={1.6} fill="#fff" />
      <circle cx={73} cy={59} r={1.6} fill="#fff" />
      <rect x={43} y={50} width={12} height={3} rx={1.5} fill="#3A2316" />
      <rect x={65} y={50} width={12} height={3} rx={1.5} fill="#3A2316" />
      <ellipse cx={41} cy={72} rx={5} ry={3} fill="#F08A86" opacity={0.7} />
      <ellipse cx={79} cy={72} rx={5} ry={3} fill="#F08A86" opacity={0.7} />
      {mouth > 0.05 ? (
        <ellipse cx={60} cy={78} rx={6} ry={mouthH / 2} fill="#5A1E24" />
      ) : (
        <path d="M54 76 Q60 81 66 76" stroke="#5A1E24" strokeWidth={3} fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
};
