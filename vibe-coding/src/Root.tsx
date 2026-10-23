import { Composition } from "remotion";
import { EpisodeVideo } from "./engine/EpisodeVideo";
import { buildTimeline } from "./engine/timeline";
import { EPISODES } from "./episodes";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    {EPISODES.map((ep) => (
      <Composition
        key={ep.id}
        id={ep.id}
        component={EpisodeVideo}
        defaultProps={{ episode: ep }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={buildTimeline(ep).duration}
      />
    ))}
  </>
);
