import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Fragment, useMemo } from "react";
import { AbsoluteFill, Audio, getStaticFiles, Sequence, staticFile } from "remotion";
import { SceneView } from "../scenes/SceneView";
import { SFX } from "../sfx";
import { FontGate } from "../ui/fonts";
import { buildTimeline } from "./timeline";
import { presentationFor } from "./transitions";
import type { Episode } from "./types";

/** Alle Soundcues der Folge. Fehlende Dateien werden still übersprungen (Hinweis in der Konsole). */
const SfxTrack: React.FC<{ cues: ReturnType<typeof buildTimeline>["cues"] }> = ({ cues }) => {
  const available = useMemo(() => new Set(getStaticFiles().map((f) => f.name)), []);
  return (
    <>
      {cues.map((c, i) => {
        const spec = SFX[c.sfx];
        if (!available.has(spec.file)) return null;
        return (
          <Sequence key={i} from={c.frame} durationInFrames={c.frames ?? 120} layout="none" name={`sfx:${c.sfx}`}>
            <Audio
              src={staticFile(spec.file)}
              volume={(f) => {
                // kurze Ausblende am Ende gekürzter Sounds (z. B. Tastatur)
                if (!c.frames) return c.volume;
                const fadeStart = c.frames - 5;
                return f < fadeStart ? c.volume : c.volume * Math.max(0, 1 - (f - fadeStart) / 5);
              }}
            />
          </Sequence>
        );
      })}
    </>
  );
};

export const EpisodeVideo: React.FC<{ episode: Episode }> = ({ episode }) => {
  const tl = useMemo(() => buildTimeline(episode), [episode]);
  return (
    <AbsoluteFill style={{ background: "#0B0E26" }}>
      <FontGate>
        <TransitionSeries>
          {tl.scenes.map((scene, i) => (
            <Fragment key={scene.id}>
              {i > 0 && scene.transitionFrames > 0 && scene.transition && (
                <TransitionSeries.Transition
                  presentation={presentationFor(scene.transition)}
                  timing={linearTiming({ durationInFrames: scene.transitionFrames })}
                />
              )}
              <TransitionSeries.Sequence durationInFrames={scene.duration} name={scene.id}>
                <SceneView scene={scene} />
              </TransitionSeries.Sequence>
            </Fragment>
          ))}
        </TransitionSeries>
      </FontGate>
      <SfxTrack cues={tl.cues} />
    </AbsoluteFill>
  );
};
