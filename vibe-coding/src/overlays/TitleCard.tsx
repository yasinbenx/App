import { Easing, interpolate, spring } from "remotion";
import { COLORS, FONT, SAFE, SAFE_BOX } from "../theme";

/** Titelkarte, die mit Wucht ins Bild knallt und danach nach oben wegfliegt. */
export const TitleCard: React.FC<{
  frame: number; // relativ zum Einsatz
  outAt: number; // relativ zum Einsatz
  fps: number;
  kicker: string;
  title: string;
  subtitle?: string;
}> = ({ frame, outAt, fps, kicker, title, subtitle }) => {
  if (frame < 0) return null;
  const slam = spring({ frame, fps, config: { damping: 9, stiffness: 260, mass: 0.7 } });
  const scale = interpolate(slam, [0, 1], [2.6, 1]);
  const rot = interpolate(slam, [0, 1], [-9, -2.5]);
  const out = interpolate(frame, [outAt, outAt + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.back(1.4)) });
  if (out >= 1) return null;
  const kickIn = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const subIn = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const flash = interpolate(frame, [0, 2, 7], [0, 0.55, 0], { extrapolateRight: "clamp" });
  const width = SAFE_BOX.rightX - SAFE.left;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#FFF5E0", opacity: flash, mixBlendMode: "screen" }} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top + 70,
          width,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${-out * 900}px) scale(${scale * (1 - out * 0.3)}) rotate(${rot}deg)`,
          opacity: Math.min(1, slam * 3),
        }}
      >
        <div
          style={{
            fontFamily: FONT.ui,
            fontWeight: 900,
            fontSize: 40,
            letterSpacing: 6,
            color: COLORS.ink,
            background: COLORS.star,
            padding: "10px 26px",
            borderRadius: 16,
            border: `5px solid ${COLORS.ink}`,
            transform: `translateY(${(1 - kickIn) * 40}px) rotate(3deg)`,
            opacity: kickIn,
            marginBottom: -14,
            zIndex: 2,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontFamily: FONT.ui,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1.0,
            color: COLORS.paper,
            background: COLORS.coral,
            padding: "34px 44px 30px",
            borderRadius: 34,
            border: `7px solid ${COLORS.ink}`,
            boxShadow: `0 14px 0 ${COLORS.ink}`,
            textAlign: "center",
            WebkitTextStroke: `3px ${COLORS.ink}`,
            paintOrder: "stroke fill",
            textShadow: `0 6px 0 ${COLORS.ink}`,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT.ui,
              fontWeight: 800,
              fontSize: 46,
              lineHeight: 1.2,
              color: COLORS.paper,
              textAlign: "center",
              background: "rgba(27,20,48,0.82)",
              padding: "14px 28px",
              borderRadius: 20,
              maxWidth: width - 40,
              transform: `scale(${0.7 + 0.3 * subIn})`,
              opacity: subIn,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </>
  );
};
