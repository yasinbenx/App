import { Easing, interpolate, spring, useVideoConfig } from "remotion";
import type { TimedScene } from "../engine/timeline";
import type { AppScene } from "../engine/types";
import { COLORS, FONT } from "../theme";
import { BrowserChrome, ClickRipple, Cursor, InsertShell } from "./InsertShell";
import { Check } from "./TerminalSceneView";

const ICON_COLORS = { drop: "#4C9BE8", book: "#E0B04A", walk: "#3DA37A", code: COLORS.coral } as const;

const HabitIcon: React.FC<{ icon: AppScene["habits"][number]["icon"] }> = ({ icon }) => (
  <div style={{ width: 70, height: 70, borderRadius: 20, background: ICON_COLORS[icon], border: `4px solid ${COLORS.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
      {icon === "drop" && <path d="M12 3 C12 3 5 11 5 15 a7 7 0 0 0 14 0 C19 11 12 3 12 3 Z" fill="#fff" />}
      {icon === "book" && <path d="M4 5 H10 a2 2 0 0 1 2 2 V20 a2 2 0 0 0 -2 -2 H4 Z M20 5 H14 a2 2 0 0 0 -2 2 V20 a2 2 0 0 1 2 -2 H20 Z" />}
      {icon === "walk" && (
        <>
          <circle cx={13} cy={4} r={2} fill="#fff" />
          <path d="M9 21 L12 14 L15 17 V21 M12 14 L13 8 L17 11 M13 8 L9 10 L7 13" />
        </>
      )}
      {icon === "code" && <path d="M8 7 L3 12 L8 17 M16 7 L21 12 L16 17" />}
    </svg>
  </div>
);

const Flame: React.FC = () => (
  <svg width={26} height={30} viewBox="0 0 24 28">
    <path d="M12 1 C14 7 20 9 20 17 a8 8 0 0 1 -16 0 C4 12 8 10 8 6 C10 8 11 9 12 1 Z" fill="#FF7A2F" />
    <path d="M12 12 C13 15 16 16 16 19 a4 4 0 0 1 -8 0 C8 17 10 16 12 12 Z" fill="#FFD27A" />
  </svg>
);

/** Lokale App unter localhost:3000 – Gewohnheit wird abgehakt, Haken ploppt auf. */
export const AppSceneView: React.FC<{ scene: TimedScene & AppScene }> = ({ scene }) => {
  const { fps } = useVideoConfig();
  const launch = scene.marks.launch ?? 0;
  const tc = scene.marks.check ?? 60;
  const clickAt = tc + 15;

  return (
    <InsertShell scene={scene}>
      {(frame) => {
        const loaded = frame >= launch + 14;
        const appIn = spring({ frame: frame - launch - 14, fps, config: { damping: 14 } });
        const rowY = (i: number) => 190 + i * 136;
        const target = { x: 730, y: rowY(scene.checkIndex) + 52 };
        const cx = interpolate(frame, [tc - 4, clickAt], [520, target.x], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
        const cy = interpolate(frame, [tc - 4, clickAt], [720, target.y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
        const clicked = frame >= clickAt;
        const pop = spring({ frame: frame - clickAt, fps, config: { damping: 7, stiffness: 260, mass: 0.6 } });
        const doneCount = scene.habits.filter((h) => h.done).length + (clicked ? 1 : 0);

        return (
          <BrowserChrome url={scene.url} dark={false}>
            {!loaded ? (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 90, height: 90, borderRadius: 45, border: "10px solid #E2D9CC", borderTopColor: COLORS.coral, transform: `rotate(${frame * 18}deg)` }} />
              </div>
            ) : (
              <div style={{ position: "absolute", inset: 0, padding: "34px 36px", fontFamily: FONT.ui, color: COLORS.ink, opacity: appIn, transform: `translateY(${(1 - appIn) * 40}px)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 900, fontSize: 52 }}>{scene.appTitle}</div>
                  <div style={{ fontWeight: 900, fontSize: 34, background: COLORS.ink, color: COLORS.paper, borderRadius: 20, padding: "6px 18px" }}>
                    {doneCount}/{scene.habits.length}
                  </div>
                </div>
                <div style={{ height: 18, borderRadius: 9, background: "#E5DDD0", marginTop: 20, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${((scene.habits.filter((h) => h.done).length + (clicked ? Math.min(1, pop) : 0)) / scene.habits.length) * 100}%`,
                      background: `linear-gradient(90deg, ${COLORS.green}, #2BB673)`,
                    }}
                  />
                </div>
                {scene.habits.map((h, i) => {
                  const isTarget = i === scene.checkIndex;
                  const done = h.done || (isTarget && clicked);
                  const streak = h.streak + (isTarget && clicked ? 1 : 0);
                  const rowIn = spring({ frame: frame - launch - 18 - i * 4, fps, config: { damping: 14 } });
                  const s = isTarget && clicked ? 0.4 + 0.6 * pop : 1;
                  return (
                    <div
                      key={h.label}
                      style={{
                        position: "absolute",
                        left: 36,
                        right: 36,
                        top: rowY(i),
                        height: 108,
                        borderRadius: 24,
                        background: done ? "#E9F9F0" : "#fff",
                        border: `4px solid ${isTarget && clicked ? COLORS.green : "#E2D9CC"}`,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 22px",
                        gap: 20,
                        opacity: rowIn,
                        transform: `translateX(${(1 - rowIn) * 80}px) scale(${isTarget && clicked ? 1 + 0.04 * Math.max(0, 1 - (frame - clickAt) / 12) : 1})`,
                      }}
                    >
                      <HabitIcon icon={h.icon} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: 38, textDecoration: done ? "line-through" : undefined, textDecorationThickness: 3, opacity: done ? 0.6 : 1 }}>{h.label}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 26, color: "#8A7F72" }}>
                          <Flame /> {streak} Tage
                        </div>
                      </div>
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 36,
                          border: `5px solid ${done ? COLORS.green : "#CFC5B6"}`,
                          background: done ? COLORS.green : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transform: `scale(${s})`,
                        }}
                      >
                        {done && <Check size={46} color="#fff" />}
                      </div>
                      {isTarget && clicked && (
                        <>
                          {Array.from({ length: 10 }, (_, k) => {
                            const a = (k / 10) * Math.PI * 2;
                            const d = interpolate(frame - clickAt, [0, 14], [10, 90], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
                            const o = interpolate(frame - clickAt, [6, 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                            return (
                              <div
                                key={k}
                                style={{
                                  position: "absolute",
                                  right: 22 + 36 - 7 - Math.cos(a) * d,
                                  top: 54 - 7 + Math.sin(a) * d,
                                  width: 14,
                                  height: 14,
                                  borderRadius: 7,
                                  background: k % 2 ? COLORS.star : COLORS.green,
                                  opacity: o,
                                }}
                              />
                            );
                          })}
                          <div
                            style={{
                              position: "absolute",
                              right: 0,
                              top: -46,
                              fontWeight: 900,
                              fontSize: 34,
                              background: COLORS.star,
                              border: `4px solid ${COLORS.ink}`,
                              borderRadius: 14,
                              padding: "2px 16px",
                              transform: `scale(${pop}) rotate(-4deg)`,
                            }}
                          >
                            Erledigt!
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                {frame >= tc - 4 && <Cursor x={cx} y={cy} pressed={frame >= clickAt && frame < clickAt + 4} />}
                <ClickRipple x={target.x + 4} y={target.y + 4} t={frame - clickAt} />
              </div>
            )}
          </BrowserChrome>
        );
      }}
    </InsertShell>
  );
};
