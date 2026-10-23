import { interpolate, spring, useVideoConfig } from "remotion";
import type { TimedScene } from "../engine/timeline";
import type { TerminalScene } from "../engine/types";
import { COLORS, FONT } from "../theme";
import { InsertShell } from "./InsertShell";

export const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d="M4 12.5 L9.5 18 L20 6.5" stroke={color} strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Terminal: Befehl wird getippt, danach läuft die Ausgabe von git clone durch. */
export const TerminalSceneView: React.FC<{ scene: TimedScene & TerminalScene }> = ({ scene }) => {
  const { fps } = useVideoConfig();
  const tc = scene.marks.typeCmd ?? 60;
  const tl = scene.marks.clone ?? tc + 50;
  const typeFrames = tl - tc - 4;

  return (
    <InsertShell scene={scene}>
      {(frame) => {
        const n = Math.round(interpolate(frame, [tc + 1, tc + 1 + typeFrames], [0, scene.command.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        const typing = frame >= tc && frame < tl;
        const running = frame >= tl;
        const caret = !running && Math.floor(frame / 8) % 2 === 0;
        const step = 5;
        const visibleOut = running ? Math.min(scene.output.length, Math.floor((frame - tl) / step) + 1) : 0;
        const pct = Math.round(interpolate(frame - tl, [step * 1, step * 3], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        const done = visibleOut >= scene.output.length;
        const folderPop = spring({ frame: frame - (tl + step * (scene.output.length - 1)), fps, config: { damping: 10 } });

        return (
          <div style={{ position: "absolute", inset: 0, background: "#0F1117", display: "flex", flexDirection: "column" }}>
            <div style={{ height: 80, background: "#22252E", display: "flex", alignItems: "center", padding: "0 26px", gap: 14, borderBottom: "3px solid #30343F" }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
              ))}
              <div style={{ flex: 1, textAlign: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, color: "#9AA0AE", marginRight: 80 }}>Terminal</div>
            </div>
            <div style={{ padding: "30px 32px", fontFamily: FONT.mono, fontWeight: 500, fontSize: 33, lineHeight: 1.45, color: "#D8DEE9", wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
              <div style={{ color: "#6C7486" }}>Last login: heute auf ttys001</div>
              <div style={{ marginTop: 10 }}>
                <span style={{ color: COLORS.green, fontWeight: 700 }}>{scene.cwd}</span>
                <span style={{ color: COLORS.coral, fontWeight: 700 }}> $ </span>
                <span style={{ color: COLORS.star, fontWeight: 700 }}>{scene.command.slice(0, Math.min(n, 9))}</span>
                <span style={{ color: "#fff" }}>{scene.command.slice(9, Math.max(9, n))}</span>
                {(caret || typing) && <span style={{ background: "#D8DEE9", color: "#0F1117" }}> </span>}
              </div>
              {scene.output.slice(0, visibleOut).map((l, i) => {
                const last = i === scene.output.length - 1;
                const line = l.startsWith("Receiving") ? l.replace("100%", `${pct}%`) : l;
                return (
                  <div key={i} style={{ color: last ? COLORS.green : "#AEB6C6", fontWeight: last ? 700 : 500, display: "flex", gap: 10, alignItems: "center", marginTop: last ? 14 : 0, wordBreak: "normal", fontSize: 30 }}>
                    {last && <Check size={34} color={COLORS.green} />}
                    {line}
                  </div>
                );
              })}
              {done && (
                <div
                  style={{
                    marginTop: 34,
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                    transform: `scale(${folderPop})`,
                    transformOrigin: "0 50%",
                  }}
                >
                  <svg width={110} height={92} viewBox="0 0 122 106">
                    <path d="M0 14 Q0 4 10 4 H44 L54 16 H112 Q122 16 122 26 V96 Q122 106 112 106 H10 Q0 106 0 96 Z" fill={COLORS.star} stroke={COLORS.ink} strokeWidth={6} />
                  </svg>
                  <div style={{ fontFamily: FONT.ui, fontWeight: 900, fontSize: 44, color: COLORS.paper }}>habit-tracker/</div>
                </div>
              )}
            </div>
          </div>
        );
      }}
    </InsertShell>
  );
};
