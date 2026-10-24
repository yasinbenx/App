import { Easing, interpolate, spring, useVideoConfig } from "remotion";
import type { TimedScene } from "../engine/timeline";
import type { BrowserScene } from "../engine/types";
import { COLORS, FONT } from "../theme";
import { BrowserChrome, ClickRipple, Cursor, InsertShell } from "./InsertShell";

const Star: React.FC<{ size: number; color?: string }> = ({ size, color = COLORS.ghMuted }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2 L15 9 L22 9.5 L16.5 14 L18.5 21 L12 17 L5.5 21 L7.5 14 L2 9.5 L9 9 Z" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
  </svg>
);

const RepoIcon: React.FC = () => (
  <svg width={30} height={30} viewBox="0 0 24 24">
    <path d="M4 3 H18 a2 2 0 0 1 2 2 V17 H6 a2 2 0 0 0 -2 2 Z M4 19 a2 2 0 0 0 2 2 H9 V17" fill="none" stroke={COLORS.ghMuted} strokeWidth={2} strokeLinejoin="round" />
  </svg>
);

/** GitHub-artige Suche: Tippen der Suchanfrage, Klick, Ergebnisliste */
export const BrowserSceneView: React.FC<{ scene: TimedScene & BrowserScene }> = ({ scene }) => {
  const { fps } = useVideoConfig();
  const tq = scene.marks.typeQuery ?? 30;
  const ts = scene.marks.search ?? tq + 45;
  // Suchtext tippt zügig (max. ~1 s), Ergebnisse/Hervorhebung folgen eigenen Marken
  const typeFrames = Math.max(8, Math.min(ts - tq - 4, 30));
  const tShow = scene.marks.results ?? ts + 6;
  const tRepo = scene.marks.repo ?? tShow + 30;

  return (
    <InsertShell scene={scene}>
      {(frame) => {
        const n = Math.round(interpolate(frame, [tq + 2, tq + 2 + typeFrames], [0, scene.query.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        const typed = scene.query.slice(0, n);
        const focused = frame >= tq;
        const showResults = frame >= tShow;
        // Mauszeiger: kommt von unten rechts zum Suchfeld, dann zum Button
        const cx = interpolate(frame, [tq - 20, tq, ts - 8, ts], [700, 360, 360, 690], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
        const cy = interpolate(frame, [tq - 20, tq, ts - 8, ts], [700, 168, 168, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
        const pressed = frame >= ts && frame < ts + 5;
        const highlight = spring({ frame: frame - tRepo, fps, config: { damping: 12 } });

        return (
          <BrowserChrome url={scene.url}>
            <div style={{ position: "absolute", inset: 0, padding: "34px 34px", fontFamily: FONT.ui, color: COLORS.ghText }}>
              {/* Kopfzeile */}
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: COLORS.ghText, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.gh, fontFamily: FONT.mono, fontWeight: 700, fontSize: 24 }}>
                  {"</>"}
                </div>
                <div style={{ fontWeight: 900, fontSize: 40 }}>GitHub</div>
                <div style={{ marginLeft: "auto", fontSize: 28, color: COLORS.ghMuted, fontWeight: 700 }}>Suche</div>
              </div>
              {/* Suchfeld */}
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div
                  style={{
                    flex: 1,
                    height: 82,
                    borderRadius: 16,
                    border: `3px solid ${focused ? COLORS.ghBlue : COLORS.ghBorder}`,
                    boxShadow: focused ? `0 0 0 5px rgba(68,147,248,0.3)` : undefined,
                    background: COLORS.ghPanel,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 22px",
                    gap: 16,
                    fontSize: 38,
                    fontWeight: 700,
                  }}
                >
                  <svg width={32} height={32} viewBox="0 0 24 24">
                    <circle cx={10} cy={10} r={7} stroke={COLORS.ghMuted} strokeWidth={2.5} fill="none" />
                    <path d="M15 15 L21 21" stroke={COLORS.ghMuted} strokeWidth={2.5} strokeLinecap="round" />
                  </svg>
                  <span>{typed || (!focused ? <span style={{ color: COLORS.ghMuted }}>Repositories durchsuchen…</span> : "")}</span>
                  {focused && !showResults && Math.floor(frame / 8) % 2 === 0 && <span style={{ width: 4, height: 44, background: COLORS.ghText, marginLeft: -12 }} />}
                </div>
                <div
                  style={{
                    height: 82,
                    padding: "0 26px",
                    borderRadius: 16,
                    background: "#238636",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 900,
                    fontSize: 32,
                    transform: `scale(${pressed ? 0.93 : 1})`,
                  }}
                >
                  Suchen
                </div>
              </div>
              {/* Ergebnisse */}
              {showResults && (
                <div style={{ marginTop: 30 }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.ghMuted, marginBottom: 16, opacity: spring({ frame: frame - tShow, fps }) }}>
                    {scene.resultsLabel}
                  </div>
                  {scene.results.map((r, i) => {
                    const p = spring({ frame: frame - tShow - 2 - i * 5, fps, config: { damping: 14, stiffness: 160 } });
                    const isFirst = i === 0;
                    return (
                      <div
                        key={r.repo}
                        style={{
                          position: "relative",
                          borderRadius: 18,
                          border: `3px solid ${isFirst && highlight > 0.01 ? COLORS.coral : COLORS.ghBorder}`,
                          boxShadow: isFirst ? `0 0 0 ${highlight * 6}px rgba(217,119,87,0.35)` : undefined,
                          background: COLORS.ghPanel,
                          padding: "18px 22px",
                          marginBottom: 14,
                          opacity: p,
                          transform: `translateX(${(1 - p) * 120}px) scale(${isFirst ? 1 + highlight * 0.03 : 1})`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 33, fontWeight: 900, color: COLORS.ghBlue }}>
                          <RepoIcon />
                          {r.repo}
                        </div>
                        <div style={{ fontSize: 27, fontWeight: 700, color: COLORS.ghText, marginTop: 6, opacity: 0.85 }}>{r.desc}</div>
                        <div style={{ display: "flex", gap: 26, marginTop: 10, fontSize: 25, fontWeight: 700, color: COLORS.ghMuted, alignItems: "center" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 18, height: 18, borderRadius: 9, background: r.langColor }} />
                            {r.lang}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Star size={24} /> {r.stars}
                          </span>
                        </div>
                        {isFirst && highlight > 0.01 && (
                          <div
                            style={{
                              position: "absolute",
                              right: 18,
                              top: -22,
                              background: COLORS.star,
                              color: COLORS.ink,
                              border: `4px solid ${COLORS.ink}`,
                              borderRadius: 14,
                              padding: "4px 16px",
                              fontWeight: 900,
                              fontSize: 28,
                              transform: `scale(${highlight}) rotate(4deg)`,
                            }}
                          >
                            Repo = Ordner mit Code
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <Cursor x={cx} y={cy} pressed={pressed} />
              <ClickRipple x={cx + 4} y={cy + 4} t={frame - ts} />
            </div>
          </BrowserChrome>
        );
      }}
    </InsertShell>
  );
};
