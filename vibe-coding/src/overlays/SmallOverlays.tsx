import { Easing, interpolate, spring } from "remotion";
import type { BadgeIcon } from "../engine/types";
import { COLORS, FONT, SAFE, SAFE_BOX } from "../theme";
import { BadgeIconSvg } from "../ui/BadgeIcons";

const outFade = (frame: number, outAt: number) =>
  Number.isFinite(outAt) ? interpolate(frame, [outAt - 6, outAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }) : 0;

/** Serien-Chip + Thema für die Establishing-Einstellung (klein, oben links im sicheren Bereich) */
export const SeriesChip: React.FC<{ frame: number; outAt: number; fps: number; kicker: string; title: string }> = ({ frame, outAt, fps, kicker, title }) => {
  if (frame < 0) return null;
  const a = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const b = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 200 } });
  const out = outFade(frame, outAt);
  if (out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 900,
          fontSize: 30,
          letterSpacing: 4,
          color: COLORS.ink,
          background: COLORS.star,
          border: `4px solid ${COLORS.ink}`,
          borderRadius: 12,
          padding: "4px 16px",
          transform: `translateX(${(1 - a) * -300}px) rotate(-2deg)`,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 900,
          fontSize: 46,
          color: COLORS.paper,
          background: COLORS.coral,
          border: `5px solid ${COLORS.ink}`,
          borderRadius: 16,
          padding: "4px 20px",
          boxShadow: `0 6px 0 ${COLORS.ink}`,
          transform: `translateX(${(1 - b) * -400}px)`,
        }}
      >
        {title}
      </div>
    </div>
  );
};

/** Große Aussage oben, z. B. "MILLIONEN" + Unterzeile */
export const StatOverlay: React.FC<{ frame: number; outAt: number; fps: number; big: string; label: string }> = ({ frame, outAt, fps, big, label }) => {
  if (frame < 0) return null;
  const p = spring({ frame, fps, config: { damping: 8, stiffness: 220 } });
  const l = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const out = outFade(frame, outAt);
  if (out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + 10,
        width: SAFE_BOX.rightX - SAFE.left,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: 1 - out,
      }}
    >
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 900,
          fontSize: 120,
          lineHeight: 1,
          color: COLORS.star,
          WebkitTextStroke: `6px ${COLORS.ink}`,
          paintOrder: "stroke fill",
          textShadow: `0 9px 0 ${COLORS.ink}`,
          transform: `scale(${p}) rotate(${(1 - p) * -12 - 3}deg)`,
        }}
      >
        {big}
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT.ui,
          fontWeight: 900,
          fontSize: 42,
          color: COLORS.paper,
          background: "rgba(27,20,48,0.85)",
          borderRadius: 18,
          padding: "8px 24px",
          transform: `scale(${l})`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Abzeichen, die einzeln aufploppen (z. B. Speicher / Zeitmaschine / Schaufenster) */
export const BadgesOverlay: React.FC<{ frame: number; outAt: number; fps: number; items: { label: string; icon: BadgeIcon; start: number }[] }> = ({ frame, outAt, fps, items }) => {
  const out = outFade(frame, outAt);
  if (out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + 10,
        width: SAFE_BOX.rightX - SAFE.left,
        display: "flex",
        justifyContent: "space-between",
        opacity: 1 - out,
      }}
    >
      {items.map((it, i) => {
        const p = frame >= it.start ? spring({ frame: frame - it.start, fps, config: { damping: 9, stiffness: 220 } }) : 0;
        return (
          <div key={i} style={{ width: 250, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${p}) rotate(${(i - 1) * 4}deg) translateY(${Math.sin((frame + i * 20) / 12) * 5}px)` }}>
            <div style={{ width: 150, height: 150, borderRadius: 40, background: COLORS.paper, border: `6px solid ${COLORS.ink}`, boxShadow: `0 8px 0 ${COLORS.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BadgeIconSvg icon={it.icon} frame={frame} size={110} />
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: FONT.ui,
                fontWeight: 900,
                fontSize: 34,
                color: COLORS.ink,
                background: COLORS.star,
                border: `4px solid ${COLORS.ink}`,
                borderRadius: 12,
                padding: "2px 12px",
              }}
            >
              {it.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
