import type { BadgeIcon } from "../engine/types";
import { COLORS } from "../theme";

/** Einfache eigene Symbole für Karten und Abzeichen */
export const BadgeIconSvg: React.FC<{ icon: BadgeIcon; frame: number; size: number }> = ({ icon, frame, size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={COLORS.ink} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
    {icon === "rocket" && (
      <g transform={`translate(0 ${Math.sin(frame / 5) * 1.2})`}>
        <path d="M24 4 C32 10 34 20 31 30 H17 C14 20 16 10 24 4 Z" fill={COLORS.paper} />
        <circle cx={24} cy={17} r={4} fill="#4C9BE8" />
        <path d="M17 26 L10 33 L17 33 M31 26 L38 33 L31 33" fill={COLORS.coral} />
        <path d="M20 34 Q24 44 28 34" fill={COLORS.star} stroke={COLORS.ink} />
      </g>
    )}
    {icon === "clock" && (
      <g>
        <circle cx={24} cy={25} r={16} fill={COLORS.paper} />
        <path d={`M24 25 L${24 + Math.sin(-frame / 6) * 9} ${25 - Math.cos(-frame / 6) * 9}`} />
        <path d="M24 25 L30 29" />
        <path d="M6 12 A21 21 0 0 1 14 5 M6 12 L4 5 M6 12 L13 13" />
      </g>
    )}
    {icon === "folder" && (
      <g>
        <path d="M5 13 Q5 9 9 9 H19 L23 13 H39 Q43 13 43 17 V37 Q43 41 39 41 H9 Q5 41 5 37 Z" fill={COLORS.star} />
        <path d="M17 24 L13 28 L17 32 M31 24 L35 28 L31 32" />
      </g>
    )}
    {icon === "eye" && (
      <g>
        <path d="M3 24 Q24 4 45 24 Q24 44 3 24 Z" fill={COLORS.paper} />
        <circle cx={24} cy={24} r={8} fill="#4C9BE8" />
        <circle cx={24} cy={24} r={3.5} fill={COLORS.ink} stroke="none" />
        <circle cx={27} cy={21} r={1.6} fill="#fff" stroke="none" />
      </g>
    )}
  </svg>
);

