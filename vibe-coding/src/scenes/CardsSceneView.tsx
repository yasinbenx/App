import { interpolate, spring, useVideoConfig } from "remotion";
import type { TimedScene } from "../engine/timeline";
import type { CardsScene } from "../engine/types";
import { COLORS, FONT } from "../theme";
import { InsertShell, PANEL } from "./InsertShell";

const CardIcon: React.FC<{ icon: CardsScene["cards"][number]["icon"]; frame: number }> = ({ icon, frame }) => (
  <svg width={92} height={92} viewBox="0 0 48 48" fill="none" stroke={COLORS.ink} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
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
                  <CardIcon icon={c.icon} frame={frame} />
                </div>
              );
            })}
          </div>
        );
      }}
    </InsertShell>
  );
};
