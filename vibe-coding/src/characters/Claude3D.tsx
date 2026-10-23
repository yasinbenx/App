import type { Acting } from "../engine/acting";
import type { Gesture } from "../engine/types";
import { STAGE } from "../engine/camera";
import { Mouth } from "./Boy3D";
import { lerp, Mat, useStarGeometry } from "./materials";

const CORAL = "#D97757";
const CORAL_DARK = "#B95C40";
const STAR = "#FFC94D";
const INK = "#22182E";

type ArmPose = { L: number; R: number; Lx: number; Rx: number };

const pose = (g: Gesture, t: number): ArmPose => {
  switch (g) {
    case "explain":
      return { L: -0.5, R: 1.0 + Math.sin(t / 5) * 0.35, Lx: 0, Rx: -0.4 };
    case "point":
      return { L: -0.4, R: 2.3 + Math.sin(t / 8) * 0.08, Lx: 0, Rx: -0.2 };
    case "count": {
      const bump = Math.abs(Math.sin(t / 7)) * 0.4;
      return { L: -0.6, R: 1.6 + bump, Lx: 0, Rx: -0.5 };
    }
    case "wow":
      return { L: -2.2 + Math.sin(t / 4) * 0.15, R: 2.2 - Math.sin(t / 4) * 0.15, Lx: 0, Rx: 0 };
    case "wave":
      return { L: -0.4, R: 2.4 + Math.sin(t * 0.55) * 0.35, Lx: 0, Rx: -0.2 };
    case "shrug":
      return { L: -1.1, R: 1.1, Lx: -0.4, Rx: -0.4 };
    default:
      return { L: -0.25, R: 0.25, Lx: 0, Rx: 0 };
  }
};

export const Claude3D: React.FC<{ acting: Acting; frame: number }> = ({ acting, frame }) => {
  const { emotion, mouth, gestureW: w, gestureT, blink, look } = acting;
  const bob = Math.sin(frame / 14) * 0.035;
  const talkBounce = acting.talking ? Math.abs(Math.sin(frame / 4.2)) * 0.025 : 0;
  const squash = 1 + talkBounce * 1.6;
  const idle = pose("none", 0);
  const g = pose(acting.gesture, gestureT);
  const armL = lerp(idle.L, g.L, w) + Math.sin(frame / 11) * 0.06;
  const armR = lerp(idle.R, g.R, w) - Math.sin(frame / 11) * 0.06;

  const happy = emotion === "happy" || emotion === "excited";
  const surprised = emotion === "surprised";
  const starGeo = useStarGeometry(0.15, 0.065, 0.05);
  const open = 1 - blink * 0.92;
  const happyEyes = happy && !acting.talking;

  const { x, y, r } = STAGE.claude;
  return (
    <group>
      {/* weicher Schatten auf dem Tisch */}
      <mesh position={[x, STAGE.deskTop + 0.045, 0.32]} rotation={[-Math.PI / 2, 0, 0]} scale={1 - bob * 2}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>
      <group position={[x, y + bob + talkBounce, 0.2]} rotation={[0, look * 0.4, Math.sin(frame / 31) * 0.04]}>
        {/* Körper */}
        <mesh scale={[1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash)]}>
          <icosahedronGeometry args={[r, 1]} />
          <Mat color={CORAL} rough={0.7} />
        </mesh>
        {/* Bauch-Facette etwas heller */}
        <mesh position={[0, -0.08, 0.2]} scale={[0.75, 0.7, 0.55]}>
          <icosahedronGeometry args={[r * 0.7, 1]} />
          <Mat color="#E58C6B" rough={0.7} />
        </mesh>
        {/* Stern */}
        <group position={[0, r + 0.15 + Math.sin(frame / 9) * 0.015, 0]} rotation={[0, Math.sin(frame / 25) * 0.6, Math.sin(frame / 17) * 0.12]}>
          <mesh geometry={starGeo}>
            <Mat color={STAR} emissive="#FFB020" emissiveIntensity={0.55} rough={0.5} />
          </mesh>
          <mesh position={[0, -0.13, 0]}>
            <cylinderGeometry args={[0.012, 0.02, 0.09, 4]} />
            <Mat color={CORAL_DARK} />
          </mesh>
        </group>
        {/* Augen */}
        {[-1, 1].map((s) =>
          happyEyes ? (
            <mesh key={s} position={[0.135 * s + look * 0.02, 0.09, r - 0.03]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.05, 0.016, 4, 8, Math.PI]} />
              <Mat color={INK} />
            </mesh>
          ) : (
            <group key={s} position={[0.135 * s + look * 0.02, 0.07, r - 0.04]} scale={[1, open * (surprised ? 1.2 : 1), 1]}>
              <mesh scale={[0.8, 1.4, 0.5]}>
                <icosahedronGeometry args={[0.062, 1]} />
                <Mat color={INK} rough={0.3} />
              </mesh>
              <mesh position={[0.018, 0.035, 0.03]}>
                <icosahedronGeometry args={[0.017, 0]} />
                <Mat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.9} />
              </mesh>
            </group>
          ),
        )}
        {/* Wangen */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.24 * s, -0.04, r - 0.1]} scale={[1, 0.55, 0.3]}>
            <icosahedronGeometry args={[0.06, 1]} />
            <Mat color="#F7A08C" opacity={0.8} />
          </mesh>
        ))}
        <Mouth y={-0.08} z={r - 0.02} open={mouth} smile={!acting.talking && !surprised} oh={surprised && mouth < 0.1} size={1.05} />
        {/* Ärmchen */}
        {[
          { s: -1, rz: armL, rx: lerp(idle.Lx, g.Lx, w) },
          { s: 1, rz: armR, rx: lerp(idle.Rx, g.Rx, w) },
        ].map(({ s, rz, rx }) => (
          <group key={s} position={[(r - 0.04) * s, -0.06, 0.02]} rotation={[rx, 0, rz]}>
            <mesh position={[0, -0.12, 0]}>
              <capsuleGeometry args={[0.06, 0.13, 2, 6]} />
              <Mat color={CORAL_DARK} rough={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
