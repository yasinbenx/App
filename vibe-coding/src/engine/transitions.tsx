import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { COLORS } from "../theme";
import type { Transition } from "./types";

type P = { direction: "left" | "right" };

/* ---------- Whip-Pan: schneller Schwenk mit Bewegungsunschärfe ---------- */
const Whip: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const dir = passedProps.direction === "left" ? -1 : 1;
  const p = Easing.inOut(Easing.cubic)(presentationProgress);
  const x = presentationDirection === "exiting" ? -dir * p * 1080 : dir * (1 - p) * 1080;
  const blur = Math.sin(presentationProgress * Math.PI) * 38;
  const id = `whip-${presentationDirection}`;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-20%" y="0" width="140%" height="100%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      <AbsoluteFill style={{ transform: `translateX(${x}px) skewX(${-dir * blur * 0.12}deg)`, filter: blur > 0.5 ? `url(#${id})` : undefined }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Zoom: raus fliegt nach vorn, rein kommt aus der Tiefe ---------- */
const Zoom: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    const s = interpolate(p, [0, 1], [1, 3.2], { easing: Easing.in(Easing.cubic) });
    return (
      <AbsoluteFill style={{ transform: `scale(${s})`, opacity: interpolate(p, [0.4, 1], [1, 0], { extrapolateLeft: "clamp" }), filter: `blur(${p * 14}px)` }}>
        {children}
      </AbsoluteFill>
    );
  }
  const s = interpolate(p, [0, 1], [0.55, 1], { easing: Easing.out(Easing.back(1.3)) });
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, opacity: interpolate(p, [0, 0.45], [0, 1], { extrapolateRight: "clamp" }), filter: `blur(${(1 - p) * 10}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- Wisch: diagonale Farbbahn wischt das neue Bild herein ---------- */
const Wipe: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const dir = passedProps.direction === "left" ? -1 : 1;
  const p = Easing.inOut(Easing.quad)(presentationProgress);
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ transform: `translateX(${-dir * p * 160}px)` }}>{children}</AbsoluteFill>;
  }
  // Kante läuft von -40% bis 140% (diagonal)
  const edge = interpolate(p, [0, 1], [-40, 140]);
  const poly = dir === 1 ? `polygon(0 0, ${edge}% 0, ${edge - 30}% 100%, 0 100%)` : `polygon(100% 0, ${100 - edge}% 0, ${130 - edge}% 100%, 100% 100%)`;
  const band = (w: number, color: string) => {
    const e = edge + w;
    const poly2 =
      dir === 1
        ? `polygon(${edge}% 0, ${e}% 0, ${e - 30}% 100%, ${edge - 30}% 100%)`
        : `polygon(${100 - e}% 0, ${100 - edge}% 0, ${130 - edge}% 100%, ${130 - e}% 100%)`;
    return <AbsoluteFill style={{ background: color, clipPath: poly2 }} />;
  };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: poly }}>{children}</AbsoluteFill>
      {band(7, COLORS.coral)}
      {band(2.5, COLORS.star)}
    </AbsoluteFill>
  );
};

/* ---------- Glitch: kurzer digitaler Störer (Streifen-Versatz + RGB-Split) ----------
   Rendert die Szene nur EINMAL und verzerrt sie per SVG-Filter – funktioniert daher auch mit 3D. */
const Glitch: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  const visible = presentationDirection === "exiting" ? p < 0.5 : p >= 0.5;
  if (!visible) return null;
  const k = Math.sin(p * Math.PI); // Stärke, Maximum in der Mitte
  const seed = Math.floor(p * 12);
  const id = `glitch-${presentationDirection}`;
  const split = 16 * k;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-10%" y="0" width="120%" height="100%" colorInterpolationFilters="sRGB">
          {/* horizontale Störstreifen: Rauschen nur in y-Richtung */}
          <feTurbulence type="fractalNoise" baseFrequency="0 0.035" numOctaves={1} seed={seed} result="noise" />
          <feComponentTransfer in="noise" result="bands">
            <feFuncR type="discrete" tableValues="0 0.5 0.5 1 0.5 0 0.5 0.5" />
            <feFuncA type="linear" slope={0} intercept={0.5} />
          </feComponentTransfer>
          <feDisplacementMap in="SourceGraphic" in2="bands" scale={k * 180} xChannelSelector="R" yChannelSelector="A" result="disp" />
          {/* RGB-Split */}
          <feOffset in="disp" dx={split} result="r0" />
          <feColorMatrix in="r0" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feColorMatrix in="disp" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feOffset in="disp" dx={-split} result="b0" />
          <feColorMatrix in="b0" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feComposite in="r" in2="g" operator="arithmetic" k2={1} k3={1} result="rg" />
          <feComposite in="rg" in2="b" operator="arithmetic" k2={1} k3={1} />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: k > 0.05 ? `url(#${id})` : undefined }}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 6px)",
          opacity: k,
        }}
      />
    </AbsoluteFill>
  );
};

const COMPONENTS = { whip: Whip, zoom: Zoom, wipe: Wipe, glitch: Glitch } as const;

export const presentationFor = (t: Transition): TransitionPresentation<P> => {
  const type = t.type === "cut" ? "zoom" : t.type;
  return { component: COMPONENTS[type], props: { direction: t.direction ?? "right" } };
};
