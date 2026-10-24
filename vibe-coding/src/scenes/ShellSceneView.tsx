import { interpolate, spring, useVideoConfig } from "remotion";
import type { TimedScene } from "../engine/timeline";
import type { ShellOutput, ShellScene, ShellStep, TreeNode } from "../engine/types";
import { COLORS, FONT } from "../theme";
import { BadgeIconSvg } from "../ui/BadgeIcons";
import { InsertShell, PANEL } from "./InsertShell";

const FS = 38; // Schriftgröße Terminal
const LH = 1.42;
const TERM_H_WITH_TREE = 430;

/** Tippdauer eines Befehls in Frames (zügig, max. ~1,1 s) */
const typeFramesOf = (cmd: string) => Math.max(8, Math.min(33, Math.round((cmd.length / 16) * 30)));

type Timed = ShellStep & { start: number; typed: number; exec: number };

const timeSteps = (scene: TimedScene & ShellScene): Timed[] =>
  scene.steps.map((st) => {
    const start = scene.marks[st.mark] ?? Infinity;
    const typed = start + typeFramesOf(st.command);
    return { ...st, start, typed, exec: typed + 3 };
  });

const outText = (o: ShellOutput) => (typeof o === "string" ? { text: o, kind: undefined } : o);

/** Prompt, z. B. "~/Projekte $" */
const Prompt: React.FC<{ cwd: string[] }> = ({ cwd }) => (
  <>
    <span style={{ color: COLORS.green, fontWeight: 700 }}>{["~", ...cwd].join("/")}</span>
    <span style={{ color: COLORS.coral, fontWeight: 700 }}> $ </span>
  </>
);

/* ---------- Ordnerbaum ---------- */

type Row = { path: string; name: string; depth: number; born: number };

const flatten = (node: TreeNode, depth = 0, prefix = ""): Row[] => {
  const path = prefix ? `${prefix}/${node.name}` : node.name;
  return [{ path, name: node.name, depth, born: -Infinity }, ...(node.children ?? []).flatMap((c) => flatten(c, depth + 1, path))];
};

const FolderTree: React.FC<{ scene: TimedScene & ShellScene; steps: Timed[]; frame: number; cwdAt: (f: number) => string[] }> = ({ scene, steps, frame, cwdAt }) => {
  const { fps } = useVideoConfig();
  if (!scene.tree) return null;
  let rows = flatten(scene.tree);
  // mkdir-Ordner einfügen (unter dem damaligen Arbeitsordner)
  for (const st of steps) {
    if (!st.tree?.mkdir) continue;
    const parent = ["~", ...cwdAt(st.exec - 1)].join("/");
    const idx = rows.findIndex((r) => r.path === parent);
    const depth = (rows[idx]?.depth ?? 0) + 1;
    let insertAt = idx + 1;
    while (insertAt < rows.length && rows[insertAt].depth >= depth) insertAt++;
    rows = [...rows.slice(0, insertAt), { path: `${parent}/${st.tree.mkdir}`, name: st.tree.mkdir, depth, born: st.exec }, ...rows.slice(insertAt)];
  }
  const here = ["~", ...cwdAt(frame)].join("/");
  const lsFlash = steps.filter((s) => s.tree?.ls && frame >= s.exec && frame < s.exec + 40).map((s) => ["~", ...cwdAt(s.exec)].join("/"));
  const rowH = 54;
  let y = 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: TERM_H_WITH_TREE, bottom: 0, background: "#F6F1E8", padding: "14px 28px", fontFamily: FONT.ui }}>
      <div style={{ fontWeight: 900, fontSize: 26, color: "#8A7F72", letterSpacing: 2, marginBottom: 4 }}>DEINE ORDNER</div>
      <div style={{ position: "relative" }}>
        {rows.map((r) => {
          const visible = frame >= r.born;
          if (!visible) return null;
          const grow = r.born === -Infinity ? 1 : spring({ frame: frame - r.born, fps, config: { damping: 10, stiffness: 200 } });
          const top = y;
          y += rowH * Math.min(1, grow);
          const isHere = r.path === here;
          const parent = r.path.split("/").slice(0, -1).join("/");
          const flash = lsFlash.includes(parent);
          const bounce = flash ? Math.abs(Math.sin(frame / 3)) * 6 : 0;
          const isNew = r.born !== -Infinity;
          return (
            <div
              key={r.path}
              style={{
                position: "absolute",
                top,
                left: r.depth * 54,
                height: rowH - 8,
                display: "flex",
                alignItems: "center",
                gap: 12,
                transform: `scale(${grow}) translateY(${-bounce}px)`,
                transformOrigin: "0 50%",
              }}
            >
              {r.depth > 0 && <div style={{ position: "absolute", left: -32, top: -rowH / 2 + 4, width: 22, height: rowH / 2 + 2, borderLeft: "3px solid #CFC5B6", borderBottom: "3px solid #CFC5B6" }} />}
              <svg width={48} height={40} viewBox="0 0 122 106">
                <path
                  d="M0 14 Q0 4 10 4 H44 L54 16 H112 Q122 16 122 26 V96 Q122 106 112 106 H10 Q0 106 0 96 Z"
                  fill={isNew ? COLORS.green : flash ? "#FFD86B" : COLORS.star}
                  stroke={COLORS.ink}
                  strokeWidth={8}
                />
              </svg>
              <span style={{ fontWeight: 900, fontSize: 33, color: COLORS.ink }}>{r.name === "~" ? "Home" : r.name}</span>
              {isHere && (
                <span style={{ fontWeight: 900, fontSize: 26, color: "#fff", background: COLORS.coral, border: `3px solid ${COLORS.ink}`, borderRadius: 12, padding: "0 12px", marginLeft: 8 }}>
                  Du bist hier
                </span>
              )}
              {isNew && frame - r.born < 45 && (
                <span style={{ fontWeight: 900, fontSize: 26, color: COLORS.ink, background: COLORS.green, border: `3px solid ${COLORS.ink}`, borderRadius: 12, padding: "0 12px", marginLeft: 8 }}>
                  neu!
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Warnschild ---------- */

const WarnSign: React.FC<{ frame: number; title: string; text: string }> = ({ frame, title, text }) => {
  const { fps } = useVideoConfig();
  if (frame < 0) return null;
  const p = spring({ frame, fps, config: { damping: 8, stiffness: 240 } });
  const shake = frame < 14 ? Math.sin(frame * 2.4) * (14 - frame) * 1.2 : 0;
  const sparks = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + (i % 2) * 0.2;
    const t = ((frame * 1.4 + i * 9) % 30) / 30;
    return { x: Math.cos(a) * (60 + t * 170), y: Math.sin(a) * (60 + t * 170) - 40, o: 1 - t, c: i % 3 === 0 ? "#FFFFFF" : i % 3 === 1 ? COLORS.star : "#FF7A2F" };
  });
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(20,10,10,${0.55 * Math.min(1, p)})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
      <div style={{ position: "relative", transform: `scale(${p}) translateX(${shake}px) rotate(${(1 - p) * -10}deg)` }}>
        <svg width={460} height={410} viewBox="0 0 460 410" style={{ overflow: "visible" }}>
          {sparks.map((s, i) => (
            <path key={i} d={`M${230 + s.x} ${255 + s.y} l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 Z`} fill={s.c} opacity={s.o} />
          ))}
          <path d="M230 18 L444 390 H16 Z" fill={COLORS.star} stroke={COLORS.ink} strokeWidth={16} strokeLinejoin="round" />
          <path d="M230 62 L404 366 H56 Z" fill="none" stroke={COLORS.ink} strokeWidth={5} strokeLinejoin="round" opacity={0.35} />
          <g transform="translate(150 150) scale(3.4)">
            <path d="M12 14 H36 L33 42 H15 Z" fill={COLORS.paper} stroke={COLORS.ink} strokeWidth={3} strokeLinejoin="round" />
            <path d="M8 13 H40 M19 9 H29 V13 M20 20 V36 M28 20 V36" stroke={COLORS.ink} strokeWidth={3} strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: FONT.ui,
          fontWeight: 900,
          fontSize: 54,
          color: "#fff",
          background: "#E5484D",
          border: `6px solid ${COLORS.ink}`,
          borderRadius: 20,
          padding: "6px 26px",
          boxShadow: `0 8px 0 ${COLORS.ink}`,
          transform: `scale(${spring({ frame: frame - 5, fps, config: { damping: 10 } })})`,
        }}
      >
        {title}
      </div>
      <div style={{ marginTop: 14, fontFamily: FONT.ui, fontWeight: 800, fontSize: 36, color: COLORS.paper, opacity: interpolate(frame, [8, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        {text}
      </div>
    </div>
  );
};

/* ---------- Szene ---------- */

/** Großes Terminal: mehrere Befehle tippen nacheinander (an Marken), optional Ordnerbaum und Warnschild. */
export const ShellSceneView: React.FC<{ scene: TimedScene & ShellScene }> = ({ scene }) => {
  const steps = timeSteps(scene);
  const cwdAt = (f: number) => {
    let cwd = [...scene.cwd];
    for (const st of steps) {
      if (f < st.exec || !st.tree?.cd || st.warn) continue;
      cwd = st.tree.cd === ".." ? cwd.slice(0, -1) : [...cwd, ...st.tree.cd.split("/")];
    }
    return cwd;
  };
  const termH = scene.tree ? TERM_H_WITH_TREE : PANEL.h - 12;
  const maxLines = Math.floor((termH - 110) / (FS * LH));

  return (
    <InsertShell scene={scene}>
      {(frame) => {
        // Zeilen bis jetzt aufbauen
        const lines: React.ReactNode[] = [];
        let pendingPrompt = true;
        for (const st of steps) {
          if (frame < st.start) break;
          const n = Math.round(interpolate(frame, [st.start, st.typed], [0, st.command.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          const typing = frame < st.typed;
          lines.push(
            <div key={`c${st.mark}`}>
              <Prompt cwd={cwdAt(st.start)} />
              <span style={{ color: "#fff" }}>{st.command.slice(0, n)}</span>
              {(typing || st.warn) && Math.floor(frame / 8) % 2 === 0 && <span style={{ background: "#D8DEE9" }}> </span>}
            </div>,
          );
          pendingPrompt = false;
          if (st.warn) continue;
          if (frame >= st.exec) {
            (st.output ?? []).forEach((o, i) => {
              const { text, kind } = outText(o);
              if (frame < st.exec + i * 3) return;
              lines.push(
                <div
                  key={`o${st.mark}${i}`}
                  style={{
                    color: kind === "error" ? "#FF6B6B" : kind === "claude" ? COLORS.coral : kind === "ok" ? COLORS.green : kind === "muted" ? "#6C7486" : "#AEB6C6",
                    fontWeight: kind === "claude" || kind === "error" ? 700 : 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {kind === "claude" && (
                    <svg width={34} height={34} viewBox="0 0 24 24">
                      <path d="M12 2 L14.6 8.6 L21.6 9 L16.2 13.4 L18 20.2 L12 16.4 L6 20.2 L7.8 13.4 L2.4 9 L9.4 8.6 Z" fill={COLORS.star} />
                    </svg>
                  )}
                  {text}
                </div>,
              );
            });
            pendingPrompt = true;
          }
        }
        if (pendingPrompt) {
          lines.push(
            <div key="prompt">
              <Prompt cwd={cwdAt(frame)} />
              {Math.floor(frame / 8) % 2 === 0 && <span style={{ background: "#D8DEE9" }}> </span>}
            </div>,
          );
        }
        const shown = lines.slice(-maxLines);
        const warnStep = steps.find((s) => s.warn && frame >= s.typed + 2);

        return (
          <div style={{ position: "absolute", inset: 0, background: "#0F1117" }}>
            <div style={{ height: 80, background: "#22252E", display: "flex", alignItems: "center", padding: "0 26px", gap: 14, borderBottom: "3px solid #30343F" }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
              ))}
              <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginRight: 80 }}>
                <BadgeIconSvg icon="terminal" frame={frame} size={36} />
                <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, color: "#9AA0AE" }}>Terminal</span>
              </div>
            </div>
            <div
              style={{
                height: termH - 80,
                padding: "22px 30px",
                fontFamily: FONT.mono,
                fontWeight: 500,
                fontSize: FS,
                lineHeight: LH,
                color: "#D8DEE9",
                whiteSpace: "pre",
                overflow: "hidden",
              }}
            >
              {shown}
            </div>
            <FolderTree scene={scene} steps={steps} frame={frame} cwdAt={cwdAt} />
            {warnStep?.warn && <WarnSign frame={frame - warnStep.typed - 2} title={warnStep.warn.title} text={warnStep.warn.text} />}
          </div>
        );
      }}
    </InsertShell>
  );
};
