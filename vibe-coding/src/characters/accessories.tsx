import { Mat } from "./materials";

/**
 * Requisiten, die den Figuren pro Folge angesteckt werden können.
 * Die Figuren selbst (Proportionen, Farben, Gesicht) bleiben in jeder Folge gleich.
 * Neue Requisiten hier ergänzen und in BoyAccessory / ClaudeAccessory eintragen.
 */
export type BoyAccessory = "apron" | "helmet" | "headphones" | "cap";
export type ClaudeAccessory = "chefHat" | "helmet";

export type Costumes = { boy?: BoyAccessory[]; claude?: ClaudeAccessory[] };

/* ---------- Junge: Kopf (lokal zum Kopfmittelpunkt) ---------- */
export const BoyHeadAccessories: React.FC<{ items: BoyAccessory[] }> = ({ items }) => (
  <>
    {items.includes("helmet") && (
      <group position={[0, 0.12, -0.01]}>
        <mesh scale={[1.08, 0.82, 1.08]}>
          <sphereGeometry args={[0.36, 9, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Mat color="#F2C230" rough={0.5} />
        </mesh>
        <mesh position={[0, 0.0, 0.05]} rotation={[-0.05, 0, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.03, 10, 1, false, -Math.PI / 2 - 0.9, 1.8]} />
          <Mat color="#E0AE1E" rough={0.5} />
        </mesh>
        <mesh position={[0, 0.27, 0]} scale={[0.25, 1, 1.05]}>
          <sphereGeometry args={[0.07, 6, 3, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Mat color="#E0AE1E" />
        </mesh>
      </group>
    )}
    {items.includes("cap") && (
      <group position={[0, 0.16, 0]} rotation={[-0.15, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.345, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Mat color="#D97757" />
        </mesh>
        <mesh position={[0, 0.0, 0.3]} scale={[1, 0.12, 0.8]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 8, 1, false, -Math.PI / 2, Math.PI]} />
          <Mat color="#B95C40" />
        </mesh>
      </group>
    )}
  </>
);

/* ---------- Junge: Körper (lokal zur Figur, Boden = 0) ---------- */
export const BoyBodyAccessories: React.FC<{ items: BoyAccessory[] }> = ({ items }) => (
  <>
    {items.includes("apron") && (
      <group position={[0, 1.0, 0.27]}>
        <mesh rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.42, 0.6, 0.02]} />
          <Mat color="#F3EBDD" />
        </mesh>
        <mesh position={[0, -0.08, 0.015]}>
          <boxGeometry args={[0.2, 0.12, 0.01]} />
          <Mat color="#E3D6C2" />
        </mesh>
      </group>
    )}
    {items.includes("headphones") && (
      <group position={[0, 1.36, 0.02]} rotation={[0.35, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.025, 4, 12, Math.PI]} />
          <Mat color="#2B2840" />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.17 * s, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 8]} />
            <Mat color="#D97757" />
          </mesh>
        ))}
      </group>
    )}
  </>
);

/* ---------- Claude (lokal zum Körpermittelpunkt, r = Radius) ---------- */
export const ClaudeAccessories: React.FC<{ items: ClaudeAccessory[]; r: number }> = ({ items, r }) => (
  <>
    {items.includes("chefHat") && (
      <group position={[0, r * 0.82, -0.04]} rotation={[-0.1, 0, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.22, 0.14, 9]} />
          <Mat color="#FFFFFF" rough={0.9} />
        </mesh>
        <mesh position={[0, 0.16, 0]} scale={[1.2, 0.9, 1.2]}>
          <icosahedronGeometry args={[0.2, 1]} />
          <Mat color="#FFFFFF" rough={0.9} />
        </mesh>
      </group>
    )}
    {items.includes("helmet") && (
      <group position={[0, r * 0.45, -0.02]}>
        <mesh scale={[1.08, 0.75, 1.08]}>
          <sphereGeometry args={[r * 0.9, 9, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Mat color="#F2C230" rough={0.5} />
        </mesh>
      </group>
    )}
  </>
);
