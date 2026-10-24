# Serienregeln „Vibe Coding Deutsch“

Gilt für jede Folge. `npm run timeline` und `npm run qa` prüfen die messbaren Punkte.

## Figuren
- Junge und Claude (korallfarbenes Low-Poly-Wesen mit Stern) sehen in jeder Folge exakt gleich aus:
  `src/characters/Boy3D.tsx`, `src/characters/Claude3D.tsx` – nicht pro Folge ändern.
- Requisiten nur über `costumes` in der Folge (`src/characters/accessories.tsx`: Schürze, Helm, Kopfhörer, Mütze, Kochmütze …).

## Orte
- Jede Folge spielt an einem anderen Ort (`src/locations/`): eigener Hintergrund, eigenes Licht, eigenes Set.
- Jeder Ort definiert eine Establishing-Einstellung (`shots.establish`), mit der die Folge beginnt.
- Vor dem Jungen steht immer ein Tisch/eine Theke auf Höhe `STAGE.deskTop` (Figur ist sitzend ab Hüfte modelliert).

## Länge & Timing
- 60–61 s = 1800–1830 Frames (30 fps), Ziel in `targetFrames`.
- Budget: Titel/Establishing ~3 s · Dialog ~40 s · Einblendungen & Reaktions-Shots ~13 s · Abschluss ~4 s.
- Fehlende Zeit mit Bildideen füllen (Reaktions-Shots, längere Einblendungen), nie mit langsamerem Text.
- Blasen tippen schnell (42 Z/s) und stehen so lange, dass ~20 Z/s Lesetempo reichen (`TIMING` in `src/theme.ts`).

## Schnitt
- Die ersten 2 s: Frage des Jungen + starkes Bild.
- Mindestens 8 Schnitte, abwechselnd Nahaufnahme / Totale / Einblendung.
- Übergänge variieren: Hartschnitt, Zoom-Punch (`camera.punch`), Whip-Pan, Wisch, kurzer Glitch (nur zwischen 2D-Einblendungen).

## Ton
- Keine Stimme, keine Musik, keine Geräusche beim Sprechen.
- Nur echte Audiodateien in `public/sfx/` (Pop, Whoosh, Tastatur, Klick, Ding, Boom). True Peak ≤ -1 dBFS.

## Grafik
- Keine echten Markenlogos – nur Textnamen oder eigene einfache Symbole.
- TikTok-Sicherheitsbereiche: unten 380 px, rechts 120 px frei (`SAFE` in `src/theme.ts`).

## Pro Folge
- Eine Datei in `src/episodes/` (Szenen, Dialog, Einblendungen, Soundcues), in `src/episodes/index.ts` eintragen.
- Ende immer mit kurzem Aufruf zur nächsten Folge.
- Vor Abschluss: `npm run timeline` → rendern → `npm run qa -- out/<datei>.mp4` → Standbilder ansehen.
