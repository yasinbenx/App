import { Easing, interpolate, spring } from "remotion";
import { COLORS, FONT, SAFE, SAFE_BOX } from "../theme";

const Cloud: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <svg width={300} height={230} viewBox="0 0 300 230">
    <path
      d="M70 190 Q20 190 20 145 Q20 102 66 98 Q72 40 132 38 Q180 36 198 80 Q214 66 238 72 Q276 82 274 124 Q296 136 290 166 Q284 192 250 190 Z"
      fill={color}
      stroke={COLORS.ink}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    {children}
  </svg>
);

/** Kurze Grafik zum Vergleich: Cloud mit Dokumenten → Cloud mit Code-Projekten */
export const FolderCloud: React.FC<{ frame: number; outAt: number; fps: number }> = ({ frame, outAt, fps }) => {
  if (frame < 0) return null;
  const a = spring({ frame, fps, config: { damping: 11, stiffness: 180 } });
  const b = spring({ frame: frame - 26, fps, config: { damping: 11, stiffness: 180 } });
  const arrow = interpolate(frame, [14, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const out = interpolate(frame, [outAt - 8, outAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (out >= 1) return null;
  const float = (o: number) => Math.sin((frame + o) / 14) * 6;
  const label = (text: string, p: number, bg: string) => (
    <div
      style={{
        marginTop: 6,
        fontFamily: FONT.ui,
        fontWeight: 900,
        fontSize: 38,
        color: COLORS.ink,
        background: bg,
        border: `5px solid ${COLORS.ink}`,
        borderRadius: 16,
        padding: "4px 18px",
        transform: `scale(${p})`,
      }}
    >
      {text}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top - 10,
        width: SAFE_BOX.rightX - SAFE.left,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: 1 - out,
        transform: `translateY(${-out * 60}px) scale(0.82)`,
        transformOrigin: "50% 0",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${a}) translateY(${float(0)}px)` }}>
        <Cloud color="#DCE8FF">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${92 + i * 42} ${82 + (i % 2) * 10}) rotate(${(i - 1) * 8})`}>
              <rect x={0} y={0} width={56} height={72} rx={6} fill="#fff" stroke={COLORS.ink} strokeWidth={5} />
              <rect x={10} y={16} width={34} height={6} rx={3} fill="#4C7BD9" />
              <rect x={10} y={30} width={28} height={6} rx={3} fill="#9DB5E8" />
              <rect x={10} y={44} width={34} height={6} rx={3} fill="#9DB5E8" />
            </g>
          ))}
        </Cloud>
        {label("Dokumente", a, "#DCE8FF")}
      </div>
      <svg width={120} height={80} viewBox="0 0 120 80" style={{ marginTop: -50 }}>
        <path d={`M10 40 H${10 + arrow * 80}`} stroke={COLORS.paper} strokeWidth={12} strokeLinecap="round" />
        {arrow > 0.9 && <path d="M78 18 L104 40 L78 62" stroke={COLORS.paper} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${b}) translateY(${float(20)}px)` }}>
        <Cloud color={COLORS.coralLight}>
          <g transform="translate(88 70)">
            <path d="M0 14 Q0 4 10 4 H44 L54 16 H112 Q122 16 122 26 V96 Q122 106 112 106 H10 Q0 106 0 96 Z" fill={COLORS.star} stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
            <text x={61} y={80} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize={40} fill={COLORS.ink}>
              {"</>"}
            </text>
          </g>
        </Cloud>
        {label("Code-Projekte", b, COLORS.coralLight)}
      </div>
    </div>
  );
};
