import { AbsoluteFill } from "remotion";
import type { TimedScene } from "../engine/timeline";
import { StageSceneView } from "./StageSceneView";

/** Wählt die passende Darstellung je Szenen-Art. */
export const SceneView: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  switch (scene.kind) {
    case "stage":
      return <StageSceneView scene={scene} />;
    default:
      return (
        <AbsoluteFill style={{ background: "#1B1430", color: "#fff", fontSize: 60, justifyContent: "center", alignItems: "center", fontFamily: "Nunito" }}>
          {scene.kind} (folgt)
        </AbsoluteFill>
      );
  }
};
