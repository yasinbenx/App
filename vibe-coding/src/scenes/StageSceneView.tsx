import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { NightRoom } from "../backgrounds/NightRoom";
import { Stage3D } from "../characters/Stage3D";
import { actingFor } from "../engine/acting";
import { cameraAt, project, shakeOffset, STAGE } from "../engine/camera";
import { activeLine, linesOf, type TimedScene } from "../engine/timeline";
import type { StageScene } from "../engine/types";
import { FolderCloud } from "../overlays/FolderCloud";
import { FollowCta } from "../overlays/FollowCta";
import { TitleCard } from "../overlays/TitleCard";
import { SpeechBubble } from "../ui/SpeechBubble";

type Props = { scene: TimedScene & StageScene };

/** Bühne: Nachtzimmer + 3D-Figuren + Sprechblasen, mit Kamera, Parallaxe und Overlays. */
export const StageSceneView: React.FC<Props> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cam, shake } = cameraAt(scene, frame);
  const boy = actingFor("boy", scene, frame);
  const claude = actingFor("claude", scene, frame);
  const { current, next } = activeLine(scene, frame);
  // vorherige Blase darf noch kurz rausanimieren
  const lines = linesOf(scene);
  const prev = current ? lines[lines.indexOf(current) - 1] : undefined;
  const sh = shakeOffset(shake, frame);

  const mark = (m: string) => scene.marks[m] ?? Infinity;
  const anchorFor = (who: "boy" | "claude") =>
    who === "boy"
      ? project(cam, STAGE.boy.x, STAGE.boy.headY + STAGE.boy.headR + 0.12)
      : project(cam, STAGE.claude.x, STAGE.claude.y + STAGE.claude.r + 0.34, 0.2);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0B0E26" }}>
      <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px) rotate(${cam.roll ?? 0}deg) scale(${1 + Math.abs(cam.roll ?? 0) * 0.02 + shake * 0.02})` }}>
        <NightRoom cam={cam} frame={frame} />
        <Stage3D cam={cam} boy={boy} claude={claude} frame={frame} />
        {/* warme Vignette */}
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at 40% 55%, rgba(255,170,90,0.10) 0%, rgba(0,0,0,0) 45%, rgba(8,6,20,0.55) 100%)",
            pointerEvents: "none",
          }}
        />
        {scene.overlays?.map((o, i) => {
          const start = mark(o.mark);
          if (o.type === "title") {
            const outAt = (o.until ? mark(o.until) : start + 60) - start;
            return <TitleCard key={i} frame={frame - start} outAt={outAt} fps={fps} kicker={o.kicker} title={o.title} subtitle={o.subtitle} />;
          }
          if (o.type === "folderCloud") {
            const end = o.until ? mark(o.until) : scene.duration;
            return <FolderCloud key={i} frame={frame - start} outAt={end - start} fps={fps} />;
          }
          return <FollowCta key={i} frame={frame - start} fps={fps} text={o.text} sub={o.sub} />;
        })}
        {prev && current && frame < current.from + 6 && (
          <SpeechBubble key={prev.index} line={prev} frame={frame} fps={fps} layout={{ mode: "anchor", anchor: anchorFor(prev.speaker) }} exitAt={current.from} />
        )}
        {current && (
          <SpeechBubble
            key={current.index}
            line={current}
            frame={frame}
            fps={fps}
            layout={{ mode: "anchor", anchor: anchorFor(current.speaker) }}
            exitAt={next ? next.from : Infinity}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
