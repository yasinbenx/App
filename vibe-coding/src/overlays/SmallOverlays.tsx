import { Easing, interpolate, spring } from "remotion";
import type { BadgeIcon, CompareSide } from "../engine/types";
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
export const StatOverlay: React.FC<{ frame: number; outAt: number; fps: number; big: string; label: string; icon?: BadgeIcon }> = ({ frame, outAt, fps, big, label, icon }) => {
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
      {icon && (
        <div style={{ position: "absolute", left: 0, top: 6, transform: `scale(${p}) rotate(-8deg)` }}>
          <BadgeIconSvg icon={icon} frame={frame} size={120} />
        </div>
      )}
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 900,
          fontSize: Math.min(icon ? 100 : 120, Math.floor((SAFE_BOX.rightX - SAFE.left - (icon ? 120 : 0)) / (big.length * 0.74))),
          marginLeft: icon ? 110 : 0,
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

/** Vergleich links ↔ rechts, z. B. Klicken vs. Tippen */
export const CompareOverlay: React.FC<{ frame: number; rightAt: number; outAt: number; fps: number; left: CompareSide; right: CompareSide }> = ({
  frame,
  rightAt,
  outAt,
  fps,
  left,
  right,
}) => {
  if (frame < 0) return null;
  const out = outFade(frame, outAt);
  if (out >= 1) return null;
  const side = (s: CompareSide, start: number, tilt: number) => {
    const p = frame >= start ? spring({ frame: frame - start, fps, config: { damping: 10, stiffness: 200 } }) : 0;
    const mark = frame >= start + 10 ? spring({ frame: frame - start - 10, fps, config: { damping: 8, stiffness: 260 } }) : 0;
    return (
      <div style={{ width: 330, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${p}) rotate(${tilt}deg)` }}>
        <div style={{ position: "relative", width: 190, height: 190, borderRadius: 46, background: COLORS.paper, border: `7px solid ${COLORS.ink}`, boxShadow: `0 9px 0 ${COLORS.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BadgeIconSvg icon={s.icon} frame={frame} size={140} />
          {s.good !== undefined && (
            <div
              style={{
                position: "absolute",
                right: -24,
                top: -24,
                width: 72,
                height: 72,
                borderRadius: 36,
                background: s.good ? COLORS.green : "#E5484D",
                border: `5px solid ${COLORS.ink}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${mark})`,
              }}
            >
              <svg width={40} height={40} viewBox="0 0 24 24">
                <path d={s.good ? "M4 12.5 L9.5 18 L20 6.5" : "M6 6 L18 18 M18 6 L6 18"} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
        <div style={{ marginTop: 14, fontFamily: FONT.ui, fontWeight: 900, fontSize: 44, color: COLORS.ink, background: COLORS.star, border: `5px solid ${COLORS.ink}`, borderRadius: 14, padding: "2px 18px" }}>{s.label}</div>
        {s.note && <div style={{ marginTop: 8, fontFamily: FONT.ui, fontWeight: 800, fontSize: 32, color: COLORS.paper, textShadow: `0 3px 0 ${COLORS.ink}` }}>{s.note}</div>}
      </div>
    );
  };
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top,
        width: SAFE_BOX.rightX - SAFE.left,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        opacity: 1 - out,
      }}
    >
      {side(left, 0, -3)}
      <div style={{ marginTop: 70, fontFamily: FONT.ui, fontWeight: 900, fontSize: 56, color: COLORS.paper, WebkitTextStroke: `3px ${COLORS.ink}`, paintOrder: "stroke fill" }}>vs</div>
      {side(right, rightAt, 3)}
    </div>
  );
};
