// Erzeugt die Soundeffekte einmalig über die ElevenLabs-Sound-Effects-API.
// Aufruf:  ELEVENLABS_API_KEY=... npm run sfx      (vorhandene Dateien werden übersprungen)
//          npm run sfx -- --force                  (alles neu erzeugen)
//          npm run sfx -- --normalize              (nur selbst abgelegte Dateien normalisieren)
// Jede Datei wird mit ffmpeg auf einen einheitlichen Peak (-16 dBFS) gebracht,
// damit die Mix-Lautstärken in src/sfx.ts verlässlich sind.

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { SFX } from "../src/sfx";

const TARGET_PEAK_DB = -16;
const root = path.resolve(import.meta.dirname, "..");
const key = process.env.ELEVENLABS_API_KEY;
const force = process.argv.includes("--force");
const onlyNormalize = process.argv.includes("--normalize");

const abs = (file: string) => path.join(root, "public", file);

const normalize = (input: string, output: string) => {
  const probe = spawnSync("ffmpeg", ["-hide_banner", "-i", input, "-af", "volumedetect", "-f", "null", "-"], {
    encoding: "utf8",
  });
  const m = probe.stderr.match(/max_volume:\s*(-?[\d.]+) dB/);
  const gain = m ? TARGET_PEAK_DB - Number(m[1]) : 0;
  const tmp = output + ".tmp.mp3";
  execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y", "-i", input,
    "-af", `volume=${gain.toFixed(2)}dB`, "-ac", "2", "-ar", "44100", "-b:a", "192k", tmp,
  ]);
  rmSync(output, { force: true });
  execFileSync("mv", [tmp, output]);
  return gain;
};

if (onlyNormalize) {
  for (const [id, s] of Object.entries(SFX)) {
    if (!existsSync(abs(s.file))) continue;
    console.log(`✓ ${id}: Gain ${normalize(abs(s.file), abs(s.file)).toFixed(1)} dB`);
  }
  process.exit(0);
}

const missing = Object.entries(SFX).filter(([, s]) => force || !existsSync(abs(s.file)));
if (missing.length === 0) {
  console.log("Alle Soundeffekte sind vorhanden.");
  process.exit(0);
}

if (!key) {
  console.log("ELEVENLABS_API_KEY ist nicht gesetzt. Bitte diese Dateien selbst ablegen");
  console.log("(danach `npm run sfx -- --normalize` ausführen):\n");
  for (const [, s] of missing) console.log(`  public/${s.file.padEnd(18)} ${s.description}`);
  process.exit(1);
}

mkdirSync(abs("sfx"), { recursive: true });

for (const [id, s] of missing) {
  console.log(`→ ${id}: "${s.prompt}"`);
  const res = await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ text: s.prompt, duration_seconds: s.seconds, prompt_influence: 0.6 }),
  });
  if (!res.ok) {
    console.error(`  Fehler ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const raw = abs(s.file) + ".raw.mp3";
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  const gain = normalize(raw, abs(s.file));
  rmSync(raw);
  console.log(`  ✓ public/${s.file} (Gain ${gain.toFixed(1)} dB)`);
}
console.log("Fertig.");
