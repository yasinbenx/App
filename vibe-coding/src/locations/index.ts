import { cafe } from "./cafe";
import { nightRoom } from "./nightRoom";
import type { Location } from "./types";

/** Alle Drehorte. Neuer Ort: Datei anlegen (Vorlage nightRoom.tsx) und hier eintragen. */
export const LOCATIONS = { nightRoom, cafe } satisfies Record<string, Location>;

export type LocationId = keyof typeof LOCATIONS;
