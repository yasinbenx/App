// Zerlegt eine Sammelaufnahme (mehrere Zeilen mit langen Pausen dazwischen) in Einzeldateien.
// Aufruf: npm run split-voice -- <eingabe.mp3> <zielordner> <nummern, z. B. 03,05,07>
// Schneidet in der Mitte jeder Pause ≥ 0,9 s (unter -40 dB). Die Anzahl Stücke muss zur Nummernliste passen.

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [input, outDir, list] = process.argv.slice(2);
if (!input || !outDir || !list) {
  console.error("Aufruf: npm run split-voice -- <eingabe.mp3> <zielordner> <03,05,07>");
  process.exit(1);
}
const names = list.split(",");
const det = spawnSync("ffmpeg", ["-hide_banner", "-i", input, "-af", "silencedetect=noise=-40dB:d=0.9", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const starts = [...det.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
const ends = [...det.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
const total = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", input], { encoding: "utf8" }));

// Schnittpunkte = Mitte jeder Pause, die zwischen zwei Sprachstücken liegt
const cuts = starts
  .map((s, i) => ({ s, e: ends[i] ?? total }))
  .filter((p) => p.s > 0.2 && p.e < total - 0.2)
  .map((p) => (p.s + p.e) / 2);
const bounds = [0, ...cuts, total];
if (bounds.length - 1 !== names.length) {
  console.error(`✗ ${bounds.length - 1} Stücke gefunden, aber ${names.length} Nummern angegeben. Pausen: ${cuts.map((c) => c.toFixed(2)).join(", ")}`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
names.forEach((n, i) => {
  const out = path.join(outDir, `${n}.mp3`);
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", input, "-ss", bounds[i].toFixed(3), "-to", bounds[i + 1].toFixed(3), "-c:a", "libmp3lame", "-b:a", "160k", out]);
  console.log(`✓ ${out}  ${(bounds[i + 1] - bounds[i]).toFixed(2)} s (inkl. Pause, wird von npm run voices getrimmt)`);
});
