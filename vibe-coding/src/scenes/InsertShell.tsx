import { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { rand } from "../backgrounds/NightRoom";
import { actingFor } from "../engine/acting";
import { activeLine, linesOf, type TimedScene } from "../engine/timeline";
import { COLORS, FONT, SAFE, SAFE_BOX } from "../theme";
import { SpeechBubble } from "../ui/SpeechBubble";

/** Bereich für das eingeblendete Fenster (über der Sprechblase, im sicheren Bereich) */
export const PANEL = { x: SAFE.left, y: SAFE.top + 20, w: SAFE_BOX.rightX - SAFE.left, h: 880 };

const GLYPHS = ["{ }", "</>", "git", "★", "()", "=>", "#", "[ ]", ";", "npm"];

/** Hintergrund mit schwebenden Code-Zeichen in drei Tiefen (Parallax) */
const GlyphField: React.FC<{ frame: number; camX: number; camY: number }> = ({ frame, camX, camY }) => {
  const items = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        g: GLYPHS[i % GLYPHS.length],
        x: rand(i * 1.7) * 1300 - 110,
        y: rand(i * 4.3) * 2100 - 90,
        depth: [0.25, 0.55, 1][i % 3],
        rot: (rand(i * 9.2) - 0.5) * 40,
        speed: 0.2 + rand(i * 2.2) * 0.4,
      })),
    [],
  );
  return (
    <>
      {items.map((it, i) => {
        const y = it.y - frame * it.speed * it.depth * 2;
        const yy = ((y % 2100) + 2100) % 2100 - 90;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: it.x - camX * it.depth,
              top: yy - camY * it.depth,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 30 + it.depth * 50,
              color: i % 4 === 0 ? COLORS.coral : "#8C82C8",
              opacity: 0.08 + it.depth * 0.14,
              transform: `rotate(${it.rot + Math.sin(frame / 40 + i) * 6}deg)`,
              filter: it.depth < 0.5 ? "blur(2px)" : undefined,
            }}
          >
            {it.g}
          </div>
        );
      })}
    </>
  );
};

/**
 * Gemeinsamer Rahmen für Einblendungen (Browser, Terminal, App, Karten):
 * Hintergrund mit Parallax, leicht schwebende Kamera, Sprechblase unten mit Avatar.
 */
export const InsertShell: React.FC<{
  scene: TimedScene;
  children: (frame: number) => React.ReactNode;
  /** Fenster-Look (false bei Karten) */
  framed?: boolean;
}> = ({ scene, children, framed = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { current, next } = activeLine(scene, frame);
  const lines = linesOf(scene);
  const prev = current ? lines[lines.indexOf(current) - 1] : undefined;

  // leichte Kamerabewegung
  const camX = Math.sin(frame / 70) * 24;
  const camY = Math.cos(frame / 90) * 14 + frame * 0.15;
  const push = interpolate(frame, [0, scene.duration], [1, 1.045]);
  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const tiltY = Math.sin(frame / 60) * 2.2;
  const tiltX = Math.cos(frame / 75) * 1.4;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "radial-gradient(ellipse at 50% 30%, #2C2456 0%, #171233 55%, #0C0A1E 100%)" }}>
      <GlyphField frame={frame} camX={camX} camY={camY} />
      {/* warmes Licht von unten links */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 10% 95%, rgba(255,160,80,0.25), transparent 45%)" }} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            transform: `translate(${-camX * 0.4}px, ${(1 - enter) * 80 - camY * 0.2}px) scale(${push * (0.92 + 0.08 * enter)}) rotateY(${tiltY}deg) rotateX(${tiltX}deg)`,
            transformOrigin: "50% 40%",
            borderRadius: framed ? 28 : 0,
            boxShadow: framed ? `0 14px 0 ${COLORS.ink}, 0 40px 80px rgba(0,0,0,0.55)` : undefined,
            border: framed ? `6px solid ${COLORS.ink}` : undefined,
            overflow: framed ? "hidden" : "visible",
          }}
        >
          {children(frame)}
        </div>
      </AbsoluteFill>
      {prev && current && frame < current.from + 6 && (
        <SpeechBubble key={prev.index} line={prev} frame={frame} fps={fps} layout={{ mode: "bottom" }} exitAt={current.from} />
      )}
      {current && (
        <SpeechBubble
          key={current.index}
          line={current}
          frame={frame}
          fps={fps}
          layout={{ mode: "bottom" }}
          exitAt={next ? next.from : Infinity}
          mouth={actingFor(current.speaker, scene, frame).mouth}
        />
      )}
    </AbsoluteFill>
  );
};

/** Browser-Fensterkopf mit Adresszeile */
export const BrowserChrome: React.FC<{ url: string; dark?: boolean; children: React.ReactNode }> = ({ url, dark = true, children }) => (
  <div style={{ position: "absolute", inset: 0, background: dark ? COLORS.gh : "#F6F3EE", display: "flex", flexDirection: "column" }}>
    <div style={{ height: 92, background: dark ? "#1E232B" : "#E8E2D8", display: "flex", alignItems: "center", padding: "0 26px", gap: 14, borderBottom: `3px solid ${dark ? COLORS.ghBorder : "#D3CBBE"}` }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
      ))}
      <div
        style={{
          marginLeft: 18,
          flex: 1,
          height: 54,
          borderRadius: 27,
          background: dark ? COLORS.gh : "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 12,
          fontFamily: FONT.ui,
          fontWeight: 700,
          fontSize: 30,
          color: dark ? COLORS.ghMuted : "#6B6257",
        }}
      >
        <svg width={22} height={26} viewBox="0 0 22 26">
          <rect x={2} y={11} width={18} height={14} rx={3} fill="currentColor" />
          <path d="M6 11 V7 a5 5 0 0 1 10 0 V11" stroke="currentColor" strokeWidth={3} fill="none" />
        </svg>
        {url}
      </div>
    </div>
    <div style={{ position: "relative", flex: 1 }}>{children}</div>
  </div>
);

/** Mauszeiger */
export const Cursor: React.FC<{ x: number; y: number; pressed?: boolean }> = ({ x, y, pressed }) => (
  <svg width={56} height={70} viewBox="0 0 28 35" style={{ position: "absolute", left: x, top: y, transform: `scale(${pressed ? 0.85 : 1})`, transformOrigin: "0 0", filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.5))", zIndex: 10 }}>
    <path d="M2 2 L2 28 L9 21 L14 32 L19 30 L14 19 L24 19 Z" fill="#fff" stroke={COLORS.ink} strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);

/** Klick-Welle */
export const ClickRipple: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t < 0 || t > 14) return null;
  const r = 10 + t * 5;
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, border: `5px solid ${COLORS.star}`, opacity: 1 - t / 14, zIndex: 9 }} />;
};
