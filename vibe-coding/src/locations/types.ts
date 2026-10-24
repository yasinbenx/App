import type { Shot, ShotName } from "../engine/types";

/**
 * Ein Drehort. Jede Folge spielt an einem anderen Ort.
 * Figuren-Positionen (STAGE in engine/camera.ts) sind fest; der Ort liefert alles drumherum.
 * Wichtig: Vor dem Jungen braucht jeder Ort einen Tisch / eine Theke auf Höhe STAGE.deskTop,
 * denn die Figur ist sitzend ab der Hüfte modelliert.
 */
export type Location = {
  id: string;
  name: string;
  /** Grundfarbe hinter allem */
  bg: string;
  /** 2D-Hintergrund in Tiefenebenen (Parallax über Billboard) */
  Background: React.FC<{ cam: Shot; frame: number }>;
  /** 3D-Set: Tisch/Theke, Möbel, Requisiten */
  Set3D: React.FC<{ frame: number }>;
  /** Beleuchtung des Ortes */
  Lights: React.FC<{ frame: number }>;
  /** Farbstimmung/Vignette als CSS-Background über dem Bild */
  grade: string;
  /** Eigene Kameraeinstellungen; "establish" (Eröffnungs-Totale) ist Pflicht */
  shots: Partial<Record<ShotName, Shot>> & { establish: Shot };
};
