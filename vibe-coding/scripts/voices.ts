// Bereitet Sprachaufnahmen einer Folge auf und schreibt das Stimmen-Manifest.
// Erwartet: public/voice/<episode-id>/01.mp3, 02.mp3 … (Reihenfolge = Dialogzeilen der Folge)
// Aufruf:   npm run voices -- ep02-terminal
// Ergebnis: Stille vorn/hinten entfernt, Lautheit angeglichen (-16 LUFS, Peak -2 dBTP),
//           src/episodes/voices/<episode-id>.json mit Dauer (Frames) und Mund-Hüllkurve je Frame.

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

const FPS = 30;
const RATE = 44100;
const id = process.argv[2];
if (!id) {
  console.error("Folgen-ID angeben, z. B. npm run voices -- ep02-terminal");
  process.exit(1);
}
const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "public", "voice", id);
const files = readdirSync(dir)
  .filter((f) => /^\d+\.mp3$/.test(f))
  .sort();

const clips = files.map((f) => {
  const src = path.join(dir, f);
  const tmp = src + ".tmp.mp3";
  // Stille vorn/hinten weg, Lautheit angleichen
  execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y", "-i", src,
    "-af",
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,loudnorm=I=-16:TP=-2:LRA=11",
    "-ar", String(RATE), "-ac", "1", "-b:a", "160k", tmp,
  ]);
  renameSync(tmp, src);
  // RMS je Frame → Hüllkurve 0..1
  const out = spawnSync("ffmpeg", [
    "-hide_banner", "-i", src,
    "-af", `asetnsamples=${RATE / FPS},astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level`,
    "-f", "null", "-",
  ], { encoding: "utf8" }).stderr;
  const db = [...out.matchAll(/RMS_level=(-?[\d.]+|-inf)/g)].map((m) => (m[1] === "-inf" ? -120 : Number(m[1])));
  const lin = db.map((d) => Math.pow(10, d / 20));
  const sorted = [...lin].sort((a, b) => a - b);
  const ref = sorted[Math.floor(sorted.length * 0.95)] || 1;
  const env = lin.map((v, i) => {
    const prev = lin[i - 1] ?? v;
    const next = lin[i + 1] ?? v;
    return Math.round(Math.min(1, ((prev + 2 * v + next) / 4) / ref) * 100) / 100;
  });
  const frames = env.length;
  console.log(`✓ ${f}  ${(frames / FPS).toFixed(2)} s`);
  return { file: `voice/${id}/${f}`, frames, env };
});

const outDir = path.join(root, "src", "episodes", "voices");
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, `${id}.json`), JSON.stringify(clips));
console.log(`→ src/episodes/voices/${id}.json (${clips.length} Zeilen, ${(clips.reduce((a, c) => a + c.frames, 0) / FPS).toFixed(1)} s Sprache)`);

