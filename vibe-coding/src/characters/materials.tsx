import { useMemo } from "react";
import * as THREE from "three";

/** Low-Poly-Look: flache Schattierung, matte Oberflächen */
export const Mat: React.FC<{ color: string; emissive?: string; emissiveIntensity?: number; opacity?: number; rough?: number }> = ({
  color,
  emissive,
  emissiveIntensity = 0.4,
  opacity,
  rough = 0.85,
}) => (
  <meshStandardMaterial
    color={color}
    flatShading
    roughness={rough}
    metalness={0}
    emissive={emissive ?? "#000000"}
    emissiveIntensity={emissive ? emissiveIntensity : 0}
    transparent={opacity !== undefined}
    opacity={opacity ?? 1}
  />
);

export const useStarGeometry = (outer: number, inner: number, depth: number) =>
  useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: depth * 0.4,
      bevelSize: outer * 0.08,
      bevelSegments: 1,
    });
    g.center();
    return g;
  }, [outer, inner, depth]);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
