import type { Acting } from "../engine/acting";
import type { Gesture } from "../engine/types";
import { STAGE } from "../engine/camera";
import { type BoyAccessory, BoyBodyAccessories, BoyHeadAccessories } from "./accessories";
import { lerp, Mat } from "./materials";

const SKIN = "#F2C29E";
const SKIN_DARK = "#E0A882";
const HAIR = "#3A2316";
const HOODIE = "#2E8C83";
const HOODIE_DARK = "#226B64";

type ArmPose = { x: number; z: number };
type Pose = { L: ArmPose; R: ArmPose; tilt: number; lift: number };

/** Ruhepose: Hände auf der Tastatur */
const rest = (frame: number): Pose => ({
  L: { x: -1.15 + Math.sin(frame * 1.1) * 0.03, z: -0.12 },
  R: { x: -1.15 + Math.sin(frame * 1.1 + 2) * 0.03, z: 0.12 },
  tilt: 0,
  lift: 0,
});

const gesturePose = (g: Gesture, t: number, frame: number): Pose => {
  const r = rest(frame);
  switch (g) {
    case "shrug":
      return { L: { x: -0.85, z: -1.05 }, R: { x: -0.85, z: 1.05 }, tilt: 0.1, lift: 0.03 };
    case "scratch":
      return { L: { x: -0.35, z: -2.92 + Math.sin(t * 0.7) * 0.07 }, R: r.R, tilt: -0.14, lift: 0 };
    case "wow":
      return {
        L: { x: -0.35, z: -2.25 + Math.sin(t * 0.5) * 0.1 },
        R: { x: -0.35, z: 2.25 - Math.sin(t * 0.5) * 0.1 },
        tilt: 0,
        lift: Math.abs(Math.sin(t * 0.25)) * 0.04,
      };
    case "point":
      return { L: r.L, R: { x: -0.55, z: 2.2 }, tilt: -0.05, lift: 0 };
    case "wave":
      return { L: r.L, R: { x: -0.2, z: 2.55 + Math.sin(t * 0.5) * 0.3 }, tilt: 0.05, lift: 0 };
    case "explain":
    case "count":
      return {
        L: r.L,
        R: { x: -1.0 + Math.sin(t / 6) * 0.18, z: 0.85 + Math.sin(t / 9) * 0.15 },
        tilt: 0.04,
        lift: 0,
      };
    default:
      return r;
  }
};

const Arm: React.FC<{ side: 1 | -1; pose: ArmPose }> = ({ side, pose }) => (
  <group position={[0.31 * side, 1.22, 0]} rotation={[pose.x, 0, pose.z]}>
    <mesh position={[0, -0.02, 0]}>
      <icosahedronGeometry args={[0.105, 0]} />
      <Mat color={HOODIE} />
    </mesh>
    <mesh position={[0, -0.24, 0]}>
      <capsuleGeometry args={[0.075, 0.34, 2, 6]} />
      <Mat color={HOODIE} />
    </mesh>
    <mesh position={[0, -0.47, 0]}>
      <icosahedronGeometry args={[0.07, 0]} />
      <Mat color={HOODIE_DARK} />
    </mesh>
    <mesh position={[0, -0.54, 0]}>
      <icosahedronGeometry args={[0.08, 1]} />
      <Mat color={SKIN} />
    </mesh>
  </group>
);

/** Der Junge – in jeder Folge identisch. Requisiten nur über `accessories`. */
export const Boy3D: React.FC<{ acting: Acting; frame: number; accessories?: BoyAccessory[] }> = ({ acting, frame, accessories = [] }) => {
  const { emotion, mouth, gestureW, gestureT, blink, look } = acting;
  const r = rest(frame);
  const g = gesturePose(acting.gesture, gestureT, frame);
  const w = gestureW;
  const L = { x: lerp(r.L.x, g.L.x, w), z: lerp(r.L.z, g.L.z, w) };
  const R = { x: lerp(r.R.x, g.R.x, w), z: lerp(r.R.z, g.R.z, w) };

  const surprised = emotion === "surprised" || emotion === "excited";
  const happy = emotion === "happy" || emotion === "excited";
  const confused = emotion === "confused" || emotion === "thinking";

  const headTilt = lerp(0, g.tilt, w) + (confused ? 0.12 : 0) + Math.sin(frame / 37) * 0.02;
  const nod = acting.talking ? Math.sin(frame / 4.5) * 0.04 : 0;
  const breathe = Math.sin(frame / 22) * 0.008;
  const lift = lerp(0, g.lift, w) + (surprised ? 0.02 : 0);

  const eyeScale = surprised ? 1.22 : 1;
  const open = 1 - blink * 0.9;
  const browY = 0.135 + (surprised ? 0.045 : 0) + (confused ? 0.015 : 0);

  return (
    <group position={[STAGE.boy.x, lift, 0]}>
      {/* Oberkörper (Hoodie) */}
      <mesh position={[0, 1.0 + breathe, 0]} scale={[1, 1, 0.82]}>
        <cylinderGeometry args={[0.27, 0.35, 0.62, 7]} />
        <Mat color={HOODIE} />
      </mesh>
      {/* Kapuze */}
      <mesh position={[0, 1.3, -0.13]} scale={[1.35, 0.6, 0.8]}>
        <icosahedronGeometry args={[0.2, 0]} />
        <Mat color={HOODIE_DARK} />
      </mesh>
      {/* Hals */}
      <mesh position={[0, 1.36, 0]}>
        <cylinderGeometry args={[0.085, 0.1, 0.12, 6]} />
        <Mat color={SKIN_DARK} />
      </mesh>

      <Arm side={-1} pose={L} />
      <Arm side={1} pose={R} />

      {/* Kopf */}
      <group position={[0, 1.36, 0]} rotation={[nod - (surprised ? 0.06 : 0), look * 0.35, headTilt]}>
        <group position={[0, 0.27, 0]}>
          <mesh scale={[1, 1.03, 0.95]}>
            <icosahedronGeometry args={[0.32, 1]} />
            <Mat color={SKIN} />
          </mesh>
          {/* Ohren */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.31 * s, 0, 0]} scale={[0.6, 1, 0.8]}>
              <icosahedronGeometry args={[0.075, 0]} />
              <Mat color={SKIN_DARK} />
            </mesh>
          ))}
          {/* Haare: Kappe + Strähnen */}
          <mesh position={[0, 0.035, -0.025]} rotation={[-0.32, 0, 0]}>
            <sphereGeometry args={[0.345, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <Mat color={HAIR} />
          </mesh>
          {[
            [-0.15, 0.28, 0.18, 0.5, -0.4],
            [0.0, 0.31, 0.2, 0.75, 0],
            [0.15, 0.28, 0.18, 0.5, 0.45],
            [0.05, 0.36, 0.0, -0.2, 0.2],
            [-0.08, 0.35, 0.04, -0.3, -0.3],
          ].map(([x, y, z, rx, rz], i) => (
            <mesh key={i} position={[x, y, z]} rotation={[rx, 0, rz]}>
              <coneGeometry args={[0.09, 0.22, 4]} />
              <Mat color={HAIR} />
            </mesh>
          ))}
          {/* Augen */}
          {[-1, 1].map((s) => (
            <group key={s} position={[0.115 * s, 0.03, 0.27]} scale={[eyeScale, eyeScale * open, 1]}>
              <mesh scale={[1, 1.18, 0.55]}>
                <icosahedronGeometry args={[0.072, 1]} />
                <Mat color="#FFFFFF" rough={0.4} />
              </mesh>
              <mesh position={[look * 0.018, -0.005, 0.03]} scale={[1, 1.15, 0.6]}>
                <icosahedronGeometry args={[0.045, 1]} />
                <Mat color="#1E1A2E" rough={0.3} />
              </mesh>
              <mesh position={[look * 0.018 + 0.016, 0.02, 0.06]}>
                <icosahedronGeometry args={[0.012, 0]} />
                <Mat color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
              </mesh>
            </group>
          ))}
          {/* Augenbrauen */}
          {[-1, 1].map((s) => {
            const rot = confused ? (s === -1 ? 0.35 : -0.05) : surprised ? 0.05 * s : happy ? -0.08 * s : 0;
            const yOff = confused && s === -1 ? 0.03 : 0;
            return (
              <mesh key={s} position={[0.115 * s, browY + yOff, 0.29]} rotation={[0, 0, rot]}>
                <boxGeometry args={[0.12, 0.028, 0.03]} />
                <Mat color={HAIR} />
              </mesh>
            );
          })}
          {/* Nase */}
          <mesh position={[0, -0.04, 0.315]}>
            <icosahedronGeometry args={[0.04, 0]} />
            <Mat color={SKIN_DARK} />
          </mesh>
          {/* Wangen */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.19 * s, -0.07, 0.25]} scale={[1, 0.6, 0.3]}>
              <icosahedronGeometry args={[0.05, 1]} />
              <Mat color="#F08A86" opacity={0.55} />
            </mesh>
          ))}
          <Mouth y={-0.135} z={0.285} open={mouth} smile={happy && mouth < 0.1} oh={surprised && mouth < 0.1} />
          <BoyHeadAccessories items={accessories} />
        </group>
      </group>
      <BoyBodyAccessories items={accessories} />
    </group>
  );
};

/** Gemeinsamer Mund für beide Figuren */
export const Mouth: React.FC<{ y: number; z: number; open: number; smile: boolean; oh: boolean; size?: number }> = ({
  y,
  z,
  open,
  smile,
  oh,
  size = 1,
}) => {
  if (smile) {
    return (
      <mesh position={[0, y + 0.02 * size, z]} rotation={[0, 0, Math.PI]} scale={size}>
        <torusGeometry args={[0.055, 0.014, 4, 10, Math.PI]} />
        <Mat color="#5A1E24" />
      </mesh>
    );
  }
  const h = oh ? 0.75 : 0.14 + open * 0.95;
  const wdt = oh ? 0.6 : 1 - open * 0.15;
  return (
    <group position={[0, y, z]} scale={size}>
      <mesh scale={[wdt, h, 0.35]}>
        <icosahedronGeometry args={[0.07, 1]} />
        <Mat color="#5A1E24" />
      </mesh>
      {open > 0.35 && (
        <mesh position={[0, -0.025 * h, 0.012]} scale={[wdt * 0.6, h * 0.35, 0.3]}>
          <icosahedronGeometry args={[0.07, 1]} />
          <Mat color="#E8706E" />
        </mesh>
      )}
    </group>
  );
};
