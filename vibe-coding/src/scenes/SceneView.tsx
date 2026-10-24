import type { TimedScene } from "../engine/timeline";
import { AppSceneView } from "./AppSceneView";
import { BrowserSceneView } from "./BrowserSceneView";
import { CardsSceneView } from "./CardsSceneView";
import { ShellSceneView } from "./ShellSceneView";
import { StageSceneView } from "./StageSceneView";
import { TerminalSceneView } from "./TerminalSceneView";

/** Wählt die passende Darstellung je Szenen-Art. */
export const SceneView: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  switch (scene.kind) {
    case "stage":
      return <StageSceneView scene={scene} />;
    case "browser":
      return <BrowserSceneView scene={scene} />;
    case "terminal":
      return <TerminalSceneView scene={scene} />;
    case "app":
      return <AppSceneView scene={scene} />;
    case "cards":
      return <CardsSceneView scene={scene} />;
    case "shell":
      return <ShellSceneView scene={scene} />;
  }
};
