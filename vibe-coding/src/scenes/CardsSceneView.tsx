import { interpolate, spring, useVideoConfig } from "remotion";
import type { TimedScene } from "../engine/timeline";
import type { CardsScene } from "../engine/types";
import { COLORS, FONT } from "../theme";
import { BadgeIconSvg } from "../ui/BadgeIcons";
import { InsertShell, PANEL } from "./InsertShell";

/** Drei Karten mit den Kernpunkten, erscheinen synchron zu Claudes Zeilen. */
export const CardsSceneView: React.FC<{ scene: TimedScene & CardsScene }> = ({ scene }) => {
  const { fps } = useVideoConfig();
  return (
    <InsertShell scene={scene} framed={false}>
      {(frame) => {
        const head = spring({ frame, fps, config: { damping: 12 } });
        const starts = scene.cards.map((c) => scene.marks[c.mark] ?? Infinity);
        const activeIdx = starts.reduce((acc, s, i) => (frame >= s ? i : acc), -1);
        const cardH = 196;
        return (
          <div style={{ position: "absolute", inset: 0, fontFamily: FONT.ui }}>
            <div
              style={{
                textAlign: "center",
                fontWeight: 900,
                fontSize: 78,
                color: COLORS.paper,
                WebkitTextStroke: `4px ${COLORS.ink}`,
                paintOrder: "stroke fill",
                textShadow: `0 7px 0 ${COLORS.ink}`,
                transform: `scale(${head}) rotate(-2deg)`,
                marginTop: 10,
              }}
            >
              {scene.heading}
            </div>
            {scene.cards.map((c, i) => {
              const p = spring({ frame: frame - starts[i], fps, config: { damping: 11, stiffness: 170 } });
              if (frame < starts[i]) return null;
              const active = i === activeIdx;
              const settle = interpolate(p, [0, 1], [i % 2 ? -8 : 8, i % 2 ? 1.2 : -1.2]);
              return (
                <div
                  key={c.mark}
                  style={{
                    position: "absolute",
                    left: 0,
                    width: PANEL.w,
                    top: 150 + i * (cardH + 26),
                    height: cardH,
                    borderRadius: 30,
                    background: active ? COLORS.paper : "#E9E1D6",
                    border: `6px solid ${COLORS.ink}`,
                    boxShadow: `0 ${active ? 12 : 7}px 0 ${COLORS.ink}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: "0 30px",
                    transform: `translateX(${(1 - p) * 900}px) rotate(${settle}deg) scale(${active ? 1.02 : 0.97})`,
                    opacity: active ? 1 : 0.88,
                  }}
                >
                  <div
                    style={{
                      width: 92,
                      height: 92,
                      borderRadius: 46,
                      background: COLORS.coral,
                      border: `5px solid ${COLORS.ink}`,
                      color: COLORS.paper,
                      fontWeight: 900,
                      fontSize: 54,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 46, color: COLORS.ink, lineHeight: 1.1 }}>{c.title}</div>
                    <div style={{ fontWeight: 700, fontSize: 32, color: "#6B6257", marginTop: 6 }}>{c.text}</div>
                  </div>
                  <BadgeIconSvg icon={c.icon} frame={frame} size={92} />
                </div>
              );
            })}
          </div>
        );
      }}
    </InsertShell>
  );
};
