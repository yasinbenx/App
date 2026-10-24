import { STAGE } from "../engine/camera";
import { Mat, useStarGeometry } from "../characters/materials";
import { NightRoom } from "../backgrounds/NightRoom";
import type { Location } from "./types";

/* Ort: Kinderzimmer bei Nacht – Schreibtisch am Fenster, Nachtstadt draußen, warmes Lampenlicht. */

const Set3D: React.FC<{ frame: number }> = ({ frame }) => {
  const sticker = useStarGeometry(0.045, 0.02, 0.01);
  const bx = STAGE.boy.x;
  return (
    <group>
      {/* Stuhllehne hinter dem Jungen */}
      <mesh position={[bx, 1.08, -0.34]}>
        <boxGeometry args={[0.78, 0.86, 0.08]} />
        <Mat color="#3B2F57" />
      </mesh>
      {/* Tischplatte + Front (verdeckt die Beine der Figuren) */}
      <mesh position={[0, STAGE.deskTop - 0.04, 0.45]}>
        <boxGeometry args={[3.6, 0.08, 0.95]} />
        <Mat color="#8C5B3B" />
      </mesh>
      <mesh position={[0, STAGE.deskTop - 0.04, 0.93]}>
        <boxGeometry args={[3.6, 0.09, 0.03]} />
        <Mat color="#A26B47" />
      </mesh>
      <mesh position={[0, STAGE.deskTop / 2 - 0.08, 0.86]}>
        <boxGeometry args={[3.5, STAGE.deskTop - 0.1, 0.04]} />
        <Mat color="#5E3B2A" />
      </mesh>
      {/* Laptop: Bildschirm zeigt zum Jungen, wir sehen den Deckel */}
      <mesh position={[bx, STAGE.deskTop + 0.012, 0.47]}>
        <boxGeometry args={[0.64, 0.025, 0.42]} />
        <Mat color="#454B5C" />
      </mesh>
      <group position={[bx, STAGE.deskTop + 0.02, 0.69]} rotation={[0.18, 0, 0]}>
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[0.64, 0.42, 0.022]} />
          <Mat color="#5A6175" rough={0.6} />
        </mesh>
        <mesh geometry={sticker} position={[0.0, 0.23, 0.016]}>
          <Mat color="#FFC94D" emissive="#FFB020" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[-0.17, 0.33, 0.013]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.12, 0.06, 0.005]} />
          <Mat color="#D97757" />
        </mesh>
        <mesh position={[0.18, 0.1, 0.013]}>
          <circleGeometry args={[0.04, 8]} />
          <Mat color="#3DD68C" />
        </mesh>
      </group>
      {/* Tasse */}
      <group position={[bx + 0.52, STAGE.deskTop + 0.08, 0.6]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.06, 0.16, 8]} />
          <Mat color="#F3E6D3" />
        </mesh>
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.04, 0.012, 4, 8]} />
          <Mat color="#F3E6D3" />
        </mesh>
        <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.06, 8]} />
          <Mat color="#4A2A1A" />
        </mesh>
      </group>
      {/* Bücherstapel */}
      {[
        ["#3E6DB5", 0.0],
        ["#E0B04A", 0.05],
        ["#7A4FA0", 0.1],
      ].map(([c, y], i) => (
        <mesh key={i} position={[1.35, STAGE.deskTop + 0.025 + (y as number), 0.4]} rotation={[0, 0.2 * i - 0.1, 0]}>
          <boxGeometry args={[0.42, 0.05, 0.3]} />
          <Mat color={c as string} />
        </mesh>
      ))}
      {/* Schreibtischlampe */}
      <group position={[-1.45, STAGE.deskTop, 0.3]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.04, 8]} />
          <Mat color="#2C2A3A" />
        </mesh>
        <mesh position={[0.06, 0.3, 0]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.018, 0.018, 0.6, 5]} />
          <Mat color="#2C2A3A" />
        </mesh>
        <mesh position={[0.24, 0.58, 0.02]} rotation={[0, 0, -2.2]}>
          <coneGeometry args={[0.14, 0.2, 7, 1, true]} />
          <meshStandardMaterial color="#E3A33B" flatShading side={2} emissive="#FFB050" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0.29, 0.53, 0.02]}>
          <icosahedronGeometry args={[0.05, 0]} />
          <meshBasicMaterial color="#FFF2C8" />
        </mesh>
      </group>
      {/* Bildschirmlicht-Flackern */}
      <pointLight
        position={[bx, STAGE.deskTop + 0.3, 0.55]}
        color="#8EC5FF"
        intensity={1.4 + Math.sin(frame / 7) * 0.08}
        distance={1.6}
        decay={1.5}
      />
    </group>
  );
};

const Lights: React.FC<{ frame: number }> = () => (
  <>
    <ambientLight intensity={0.55} color="#9C8AC4" />
    <hemisphereLight args={["#7D8CE0", "#4A2C22", 0.7]} />
    <directionalLight position={[-2, 3, 5]} intensity={2.1} color="#FFD1A0" />
    <directionalLight position={[2.5, 2.5, -3]} intensity={2.2} color="#6FA0FF" />
    <pointLight position={[-1.15, 1.35, 0.6]} intensity={2.8} distance={3.5} decay={1.6} color="#FFB060" />
  </>
);

export const nightRoom: Location = {
  id: "nightRoom",
  name: "Zimmer bei Nacht",
  bg: "#0B0E26",
  Background: NightRoom,
  Set3D,
  Lights,
  grade: "radial-gradient(ellipse at 40% 55%, rgba(255,170,90,0.10) 0%, rgba(0,0,0,0) 45%, rgba(8,6,20,0.55) 100%)",
  shots: {
    // Establishing: von weit draußen (Fenster/Stadt im Bild) auf den Schreibtisch zu
    establish: { x: 0.2, y: 2.5, dist: 9.5 },
  },
};
