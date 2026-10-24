import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useLayoutEffect } from "react";
import { AbsoluteFill } from "remotion";
import type { PerspectiveCamera } from "three";
import { Claude3D } from "./characters/Claude3D";
import type { Acting } from "./engine/acting";
import { STAGE } from "./engine/camera";
import { COLORS, FONT } from "./theme";
import { FontGate } from "./ui/fonts";

const SIZE = 1080;

const Cam: React.FC<{ y: number; dist: number }> = ({ y, dist }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  useLayoutEffect(() => {
    camera.fov = 30;
    camera.position.set(STAGE.claude.x, y, dist);
    camera.rotation.set(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, y, dist]);
  return null;
};

const happy: Acting = {
  mouth: 0,
  emotion: "happy",
  gesture: "wave",
  gestureT: 12,
  gestureW: 1,
  talking: false,
  look: 0,
  blink: 0,
};

/** Profilbild für den Kanal: Claude aus der Serie, rund-tauglich (Motiv im inneren Kreis). */
export const Logo: React.FC<{ withText: boolean }> = ({ withText }) => (
  <AbsoluteFill style={{ background: COLORS.night }}>
    {/* Hintergrund: Nachthimmel mit warmem Glühen hinter der Figur */}
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 46%, #FFB866 0%, #E07A5F 22%, #5A2E66 48%, #1B1640 72%, #0E1230 100%)" }} />
    <svg width={SIZE} height={SIZE} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2;
        const r = 400 + ((i * 37) % 90);
        return <circle key={i} cx={540 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} r={3 + (i % 3) * 2} fill="#FFF4D6" opacity={0.35 + (i % 4) * 0.12} />;
      })}
      <circle cx={540} cy={540} r={500} fill="none" stroke={COLORS.star} strokeWidth={14} opacity={0.9} />
    </svg>
    <ThreeCanvas width={SIZE} height={SIZE} flat style={{ position: "absolute", inset: 0 }}>
      <Cam y={withText ? 1.6 : 1.58} dist={withText ? 3.3 : 2.85} />
      <ambientLight intensity={0.7} color="#B9A8E0" />
      <hemisphereLight args={["#9DAAF0", "#4A2C22", 0.6]} />
      <directionalLight position={[-2, 3, 5]} intensity={2.3} color="#FFD7A8" />
      <directionalLight position={[3, 2, -3]} intensity={2.4} color="#7FB0FF" />
      <Claude3D acting={happy} frame={12} shadow={false} />
    </ThreeCanvas>
    {withText && (
      <FontGate>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 150,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT.ui,
              fontWeight: 900,
              fontSize: 112,
              lineHeight: 1,
              letterSpacing: 2,
              color: COLORS.paper,
              background: COLORS.coral,
              border: `9px solid ${COLORS.ink}`,
              borderRadius: 34,
              padding: "14px 38px 20px",
              boxShadow: `0 12px 0 ${COLORS.ink}`,
              transform: "rotate(-3deg)",
              WebkitTextStroke: `4px ${COLORS.ink}`,
              paintOrder: "stroke fill",
            }}
          >
            {"VIBE </>"}
          </div>
        </div>
      </FontGate>
    )}
  </AbsoluteFill>
);
