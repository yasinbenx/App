import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage3D } from "../characters/Stage3D";
import { actingFor } from "../engine/acting";
import { cameraAt, project, shakeOffset, STAGE } from "../engine/camera";
import { useEpisode } from "../engine/context";
import { activeLine, linesOf, type TimedScene } from "../engine/timeline";
import type { StageScene } from "../engine/types";
import { FolderCloud } from "../overlays/FolderCloud";
import { FollowCta } from "../overlays/FollowCta";
import { BadgesOverlay, SeriesChip, StatOverlay } from "../overlays/SmallOverlays";
import { TitleCard } from "../overlays/TitleCard";
import { SAFE } from "../theme";
import { SpeechBubble } from "../ui/SpeechBubble";

type Props = { scene: TimedScene & StageScene };

/** Bühne: Ort (Hintergrund, Licht, Set) + die zwei festen 3D-Figuren + Sprechblasen, mit Kamera und Overlays. */
export const StageSceneView: React.FC<Props> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { location, costumes } = useEpisode();
  const { cam, shake } = cameraAt(scene, frame, location.shots);
  const boy = actingFor("boy", scene, frame);
  const claude = actingFor("claude", scene, frame);
  const { current, next } = activeLine(scene, frame);
  // vorherige Blase darf noch kurz rausanimieren
  const lines = linesOf(scene);
  const prev = current ? lines[lines.indexOf(current) - 1] : undefined;
  const sh = shakeOffset(shake, frame);

  const mark = (m: string) => scene.marks[m] ?? Infinity;
  const until = (u: string | undefined) => (u ? mark(u) : Infinity);
  const anchorFor = (who: "boy" | "claude") =>
    who === "boy"
      ? project(cam, STAGE.boy.x, STAGE.boy.headY + STAGE.boy.headR + 0.12)
      : project(cam, STAGE.claude.x, STAGE.claude.y + STAGE.claude.r + 0.34, 0.2);

  // Solange oben eine Einblendung steht (Chip, Zahl), bleiben Blasen darunter
  const RESERVE = { series: 150, stat: 300 } as const;
  const minTop =
    SAFE.top +
    Math.max(
      10,
      ...(scene.overlays ?? []).map((o) =>
        (o.type === "series" || o.type === "stat") && frame >= mark(o.mark) - 8 && frame < until(o.until) ? RESERVE[o.type] : 0,
      ),
    );

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: location.bg }}>
      <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px) rotate(${cam.roll ?? 0}deg) scale(${1 + Math.abs(cam.roll ?? 0) * 0.02 + shake * 0.02})` }}>
        <location.Background cam={cam} frame={frame} />
        <Stage3D cam={cam} boy={boy} claude={claude} frame={frame} location={location} costumes={costumes} />
        <AbsoluteFill style={{ background: location.grade, pointerEvents: "none" }} />
        {scene.overlays?.map((o, i) => {
          if (o.type === "badges") {
            const items = o.items.map((it) => ({ ...it, start: mark(it.mark) }));
            const start = Math.min(...items.map((it) => it.start));
            return <BadgesOverlay key={i} frame={frame - start} outAt={until(o.until) - start} fps={fps} items={items.map((it) => ({ ...it, start: it.start - start }))} />;
          }
          const start = mark(o.mark);
          const local = frame - start;
          const outAt = until("until" in o ? o.until : undefined) - start;
          switch (o.type) {
            case "title":
              return <TitleCard key={i} frame={local} outAt={Number.isFinite(outAt) ? outAt : 60} fps={fps} kicker={o.kicker} title={o.title} subtitle={o.subtitle} />;
            case "series":
              return <SeriesChip key={i} frame={local} outAt={outAt} fps={fps} kicker={o.kicker} title={o.title} />;
            case "stat":
              return <StatOverlay key={i} frame={local} outAt={outAt} fps={fps} big={o.big} label={o.label} />;
            case "folderCloud":
              return <FolderCloud key={i} frame={local} outAt={Number.isFinite(outAt) ? outAt : scene.duration - start} fps={fps} />;
            case "follow":
              return <FollowCta key={i} frame={local} fps={fps} text={o.text} sub={o.sub} />;
          }
        })}
        {prev && current && frame < current.from + 6 && (
          <SpeechBubble key={prev.index} line={prev} frame={frame} fps={fps} layout={{ mode: "anchor", anchor: anchorFor(prev.speaker) }} exitAt={current.from} minTop={minTop} />
        )}
        {current && (
          <SpeechBubble
            key={current.index}
            line={current}
            frame={frame}
            fps={fps}
            layout={{ mode: "anchor", anchor: anchorFor(current.speaker) }}
            exitAt={next ? next.from : Infinity}
            minTop={minTop}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
