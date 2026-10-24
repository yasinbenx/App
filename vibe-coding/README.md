# Vibe Coding – TikTok-Erklärvideos (Remotion)

1080×1920, 30 fps, H.264/AAC. Jede Folge ist eine Datei in `src/episodes/`.

```bash
npm install
npm run studio                       # Vorschau (npx remotion studio)
npm run timeline                     # Szenen, Zeilen, Lesezeiten, Soundcues prüfen
npx remotion render ep01-github out/ep01.mp4
```

## Soundeffekte (`public/sfx/`)
`npm run sfx` erzeugt sie über die ElevenLabs-Sound-Effects-API, wenn `ELEVENLABS_API_KEY` gesetzt ist,
sonst listet es die benötigten Dateien. Selbst abgelegte Dateien mit `npm run sfx -- --normalize` angleichen.
Fehlende Dateien werden beim Rendern einfach übersprungen.
Die Dateien für Folge 1 stammen aus ElevenLabs Sound Effects (je eine Generierung, Pop/Klick auf den ersten
Anschlag gekürzt, alles auf -3 dBFS Peak normalisiert). Mix-Lautstärken stehen in `src/sfx.ts`.

## Neue Folge
Regeln: siehe [SERIENREGELN.md](SERIENREGELN.md).
1. Neuen Ort anlegen: `src/locations/nightRoom.tsx` als Vorlage kopieren, in `src/locations/index.ts` eintragen.
2. `src/episodes/ep01-github.ts` kopieren, `location`, `costumes`, Szenen und Dialog anpassen, in `src/episodes/index.ts` eintragen.
3. `npm run timeline` bis alle Regeln ✓ sind, dann rendern und `npm run qa -- out/<datei>.mp4`.

## Ohne Chrome-Download (Sandbox/CI)
`REMOTION_BROWSER=/pfad/zu/chrome-headless-shell npx remotion render …`
