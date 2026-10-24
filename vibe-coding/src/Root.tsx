import { Composition, Still } from "remotion";
import { Logo } from "./Logo";
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
    {/* Profilbild (npx remotion still logo out/logo.png) */}
    <Still id="logo" component={Logo} defaultProps={{ withText: false }} width={1080} height={1080} />
    <Still id="logo-text" component={Logo} defaultProps={{ withText: true }} width={1080} height={1080} />
  </>
);
