import { Easing, interpolate, spring } from "remotion";
import { plain, typedCount, type TimedLine } from "../engine/timeline";
import { COLORS, FONT, SAFE, SAFE_BOX, VIDEO } from "../theme";
import { Avatar } from "./Avatars";
import { wrapText } from "./textLayout";

const PAD_X = 40;
const PAD_Y = 28;
const BORDER = 6;

type Layout =
  /** Blase über einem Kopf (Bühne), Spitze zeigt auf anchor */
  | { mode: "anchor"; anchor: { x: number; y: number } }
  /** Blase unten im sicheren Bereich, Avatar links oben */
  | { mode: "bottom" };

/** Markup *Wort* → Hervorhebung pro Zeichen */
const emphasisMask = (text: string) => {
  const mask: boolean[] = [];
  let on = false;
  for (const c of text) {
    if (c === "*") on = !on;
    else mask.push(on);
  }
  return mask;
};

export const bubbleStyle = (mode: Layout["mode"]) => ({
  fontSize: mode === "anchor" ? 50 : 46,
  fontWeight: 800,
  lineHeight: 1.26,
  maxWidth: mode === "anchor" ? 780 : SAFE_BOX.rightX - SAFE.left,
});

/** Misst Blase (für QA und Layout) */
export const measureBubble = (text: string, mode: Layout["mode"]) => {
  const st = bubbleStyle(mode);
  const { lines, widest } = wrapText(plain(text), st.maxWidth - PAD_X * 2 - BORDER * 2, st);
  const width = Math.min(st.maxWidth, widest + PAD_X * 2 + BORDER * 2 + 8);
  const height = lines.length * st.fontSize * st.lineHeight + PAD_Y * 2 + BORDER * 2;
  return { lines, width, height, st };
};

export const SpeechBubble: React.FC<{
  line: TimedLine;
  frame: number; // szenenlokal
  fps: number;
  layout: Layout;
  /** Frame, ab dem die Blase wieder verschwindet (nächste Zeile / Szenenende) */
  exitAt?: number;
  mouth?: number;
}> = ({ line, frame, fps, layout, exitAt = Infinity, mouth = 0 }) => {
  const mask = emphasisMask(line.text);
  const { lines, width, height, st } = measureBubble(line.text, layout.mode);
  const n = typedCount(line, frame);

  const inP = spring({ frame: frame - line.from, fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
  const outP = Number.isFinite(exitAt)
    ? interpolate(frame, [exitAt - 1, exitAt + 5], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      })
    : 0;
  if (frame < line.from || outP >= 1) return null;
  const scale = (0.5 + 0.5 * inP) * (1 - outP * 0.4);
  const opacity = Math.min(1, inP * 2) * (1 - outP);

  const isClaude = line.speaker === "claude";
  const accent = isClaude ? COLORS.coral : COLORS.teal;

  // Position
  let left: number;
  let top: number;
  let tail: { x: number; y: number; baseX: number } | null = null;
  if (layout.mode === "anchor") {
    const a = layout.anchor;
    left = Math.round(Math.min(Math.max(a.x - width / 2, SAFE.left), SAFE_BOX.rightX - width));
    const bottom = Math.min(a.y - 60, SAFE_BOX.bottomY);
    top = Math.max(SAFE.top + 10, bottom - height);
    const baseX = Math.min(Math.max(a.x, left + 90), left + width - 90);
    const tipY = Math.min(top + height + 70, a.y - 10);
    tail = { x: baseX + (a.x - baseX) * 0.5 + (a.x > baseX ? 10 : a.x < baseX ? -10 : 0), y: tipY, baseX };
  } else {
    left = SAFE.left;
    top = SAFE_BOX.bottomY - height;
  }
  const originX = tail ? tail.baseX - left : 80;
  const originY = height + 40;

  // Zeichen über Zeilen verteilen
  let cursor = 0;
  const rows = lines.map((ln) => {
    const start = cursor;
    cursor += ln.length + 1;
    return { ln, start };
  });

  const caretOn = frame < line.typeEnd && Math.floor(frame / 8) % 2 === 0;
  const showCaret = frame >= line.typeStart - 2 && frame < line.typeEnd + 6;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: `${originX}px ${originY}px`,
      }}
    >
      {tail && (
        <svg style={{ position: "absolute", left: -left, top: -top, overflow: "visible" }} width={VIDEO.width} height={VIDEO.height}>
          <path
            d={`M ${tail.baseX - 34} ${top + height - BORDER - 2} L ${tail.x} ${tail.y} L ${tail.baseX + 26} ${top + height - BORDER - 2} Z`}
            fill={COLORS.paper}
            stroke={COLORS.ink}
            strokeWidth={BORDER}
            strokeLinejoin="round"
          />
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLORS.paper,
          border: `${BORDER}px solid ${COLORS.ink}`,
          borderRadius: 42,
          boxShadow: `0 10px 0 ${COLORS.ink}, 0 24px 50px rgba(0,0,0,0.35)`,
        }}
      />
      {/* Abdeckung der Spitzen-Basis, damit Blase und Spitze nahtlos verbunden sind */}
      {tail && (
        <div
          style={{
            position: "absolute",
            left: tail.baseX - left - 28,
            top: height - BORDER - 6,
            width: 52,
            height: BORDER + 4,
            background: COLORS.paper,
          }}
        />
      )}
      {layout.mode === "bottom" && (
        <div style={{ position: "absolute", left: 18, top: -96, filter: "drop-shadow(0 8px 0 rgba(27,20,48,0.9))" }}>
          <Avatar who={line.speaker} size={112} mouth={mouth} />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: BORDER + PAD_X,
          top: BORDER + PAD_Y,
          fontFamily: FONT.ui,
          fontSize: st.fontSize,
          fontWeight: st.fontWeight,
          lineHeight: st.lineHeight,
          color: COLORS.ink,
          whiteSpace: "pre",
        }}
      >
        {rows.map(({ ln, start }, ri) => (
          <div key={ri}>
            {Array.from(ln).map((c, ci) => {
              const gi = start + ci;
              const shown = gi < n;
              return (
                <span key={ci} style={{ color: shown ? (mask[gi] ? accent : COLORS.ink) : "transparent" }}>
                  {c}
                  {showCaret && gi === n - 1 && (
                    <span style={{ position: "relative", display: "inline-block", width: 0 }}>
                      <span
                        style={{
                          position: "absolute",
                          left: 3,
                          top: st.fontSize * 0.12,
                          width: 5,
                          height: st.fontSize * 1.0,
                          background: accent,
                          opacity: caretOn ? 1 : 0.25,
                          borderRadius: 3,
                        }}
                      />
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
