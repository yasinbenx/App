import { interpolate, spring } from "remotion";
import { COLORS, FONT, SAFE, SAFE_BOX } from "../theme";

/** Abschluss-Einblendung: "Folgen"-Button mit Tipp-Animation */
export const FollowCta: React.FC<{ frame: number; fps: number; text: string; sub?: string }> = ({ frame, fps, text, sub }) => {
  if (frame < 0) return null;
  const pop = spring({ frame, fps, config: { damping: 9, stiffness: 200 } });
  const tap = frame > 22 && frame < 30;
  const pressed = spring({ frame: frame - 26, fps, config: { damping: 12 } });
  const followed = frame >= 26;
  const handX = interpolate(frame, [8, 22], [260, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const handY = interpolate(frame, [8, 22], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wiggle = Math.sin(frame / 6) * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + 40,
        width: SAFE_BOX.rightX - SAFE.left,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${pop}) rotate(${wiggle * 0.5}deg)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 900,
          fontSize: 72,
          lineHeight: 1.05,
          textAlign: "center",
          color: COLORS.paper,
          WebkitTextStroke: `4px ${COLORS.ink}`,
          paintOrder: "stroke fill",
          textShadow: `0 7px 0 ${COLORS.ink}`,
        }}
      >
        {text}
      </div>
      {sub && (
        <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 40, color: COLORS.star, marginTop: 10, textShadow: `0 4px 0 ${COLORS.ink}` }}>{sub}</div>
      )}
      <div style={{ position: "relative", marginTop: 30 }}>
        <div
          style={{
            fontFamily: FONT.ui,
            fontWeight: 900,
            fontSize: 56,
            color: followed ? COLORS.ink : "#fff",
            background: followed ? COLORS.paper : "#FE2C55",
            border: `6px solid ${COLORS.ink}`,
            borderRadius: 60,
            padding: "16px 64px",
            boxShadow: `0 ${tap ? 2 : 10}px 0 ${COLORS.ink}`,
            transform: `translateY(${tap ? 8 : 0}px) scale(${followed ? 1 + 0.08 * (1 - pressed) : 1})`,
          }}
        >
          {followed ? (
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={44} height={44} viewBox="0 0 24 24">
                <path d="M4 12.5 L9.5 18 L20 6.5" stroke={COLORS.ink} strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Gefolgt
            </span>
          ) : (
            "+ Folgen"
          )}
        </div>
        <svg
          width={110}
          height={130}
          viewBox="0 0 110 130"
          style={{ position: "absolute", right: -40, bottom: -90, transform: `translate(${handX}px, ${handY}px) scale(${tap ? 0.92 : 1})`, opacity: frame > 8 && frame < 60 ? 1 : 0 }}
        >
          <path
            d="M36 8 Q48 2 52 14 V56 L60 50 Q70 46 74 56 L78 54 Q88 50 92 60 L94 62 Q104 60 104 72 V96 Q104 122 78 126 H56 Q40 126 30 110 L10 78 Q4 66 16 62 Q24 60 32 70 V16 Q32 10 36 8 Z"
            fill="#FFF8EF"
            stroke={COLORS.ink}
            strokeWidth={6}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
