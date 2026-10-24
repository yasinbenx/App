import { Mat, useStarGeometry } from "../characters/materials";
import { STAGE } from "../engine/camera";

/** Wiederkehrende Set-Requisiten, die Orte verwenden können. */

/** Laptop des Jungen: Bildschirm zeigt zu ihm, wir sehen den Deckel mit Stickern. Plus Bildschirmlicht. */
export const Laptop: React.FC<{ frame: number; lid?: string; base?: string }> = ({ frame, lid = "#5A6175", base = "#454B5C" }) => {
  const sticker = useStarGeometry(0.045, 0.02, 0.01);
  const bx = STAGE.boy.x;
  return (
    <group>
      <mesh position={[bx, STAGE.deskTop + 0.012, 0.47]}>
        <boxGeometry args={[0.64, 0.025, 0.42]} />
        <Mat color={base} />
      </mesh>
      <group position={[bx, STAGE.deskTop + 0.02, 0.69]} rotation={[0.18, 0, 0]}>
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[0.64, 0.42, 0.022]} />
          <Mat color={lid} rough={0.6} />
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
