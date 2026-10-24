import { createContext, useContext } from "react";
import type { Costumes } from "../characters/accessories";
import { LOCATIONS } from "../locations";
import type { Location } from "../locations/types";
import type { Episode } from "./types";

type Ctx = { episode: Episode; location: Location; costumes: Costumes };

export const EpisodeContext = createContext<Ctx | null>(null);

export const episodeContext = (episode: Episode): Ctx => ({
  episode,
  location: LOCATIONS[episode.location],
  costumes: episode.costumes ?? {},
});

export const useEpisode = () => {
  const c = useContext(EpisodeContext);
  if (!c) throw new Error("useEpisode außerhalb von EpisodeVideo");
  return c;
};
