// QA nach dem Rendern: Frame-Zahl, Format, Lautstärke und ein Standbild pro Szene.
// Aufruf: npm run qa -- out/vibe-coding-01-github.mp4 [episode-id]
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { buildTimeline, linesOf } from "../src/engine/timeline";
import { EPISODES } from "../src/episodes";

const file = process.argv[2];
if (!file) {
  console.error("Pfad zur MP4 angeben.");
  process.exit(1);
}
const ep = EPISODES.find((e) => e.id === process.argv[3]) ?? EPISODES[0];
let failed = false;
const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? "✓" : "✗"} ${msg}`);
  if (!ok) failed = true;
};

const probe = (args: string[]) => execFileSync("ffprobe", ["-v", "error", ...args, file], { encoding: "utf8" }).trim();
const frames = Number(probe(["-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "default=nw=1:nk=1"]));
const v = JSON.parse(probe(["-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate,codec_name", "-of", "json"])).streams[0];
const acodec = probe(["-select_streams", "a:0", "-show_entries", "stream=codec_name", "-of", "csv=p=0"]);
const [min, max] = ep.targetFrames ?? [1800, 1830];

check(frames >= min && frames <= max, `Frames: ${frames} (${(frames / 30).toFixed(2)} s, Ziel ${min}–${max})`);
check(v.width === 1080 && v.height === 1920 && v.r_frame_rate === "30/1" && v.codec_name === "h264" && acodec === "aac", `Format ${v.width}x${v.height}, ${v.r_frame_rate} fps, ${v.codec_name} / ${acodec}`);

const loud = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const lufs = Number(loud.match(/I:\s+(-?[\d.]+) LUFS/g)?.pop()?.match(/-?[\d.]+/)?.[0]);
const peak = Number(loud.match(/Peak:\s+(-?[\d.]+) dBFS/g)?.pop()?.match(/-?[\d.]+/)?.[0]);
check(peak <= -1, `True Peak ${peak} dBFS (≤ -1, nichts übersteuert)`);
console.log(`· Lautheit ${lufs} LUFS (nur Soundeffekte, keine Musik/Stimme)`);

// Ein Standbild pro Szene (Mitte jeder Zeile bzw. Szenenmitte)
const tl = buildTimeline(ep);
const outDir = path.join(path.dirname(file), "qa");
mkdirSync(outDir, { recursive: true });
const picks = tl.scenes.map((sc) => {
  const l = linesOf(sc).at(-1);
  return { id: sc.id, frame: sc.from + (l ? l.from + l.duration - 8 : Math.round(sc.duration / 2)) };
});
const select = picks.map((p) => `eq(n\\,${p.frame})`).join("+");
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", file, "-vf", `select='${select}',scale=360:-1,tile=${picks.length}x1`, "-frames:v", "1", path.join(outDir, "szenen.png")]);
console.log(`· Standbilder: ${path.join(outDir, "szenen.png")} (${picks.map((p) => `${p.id}@${p.frame}`).join(", ")})`);
process.exit(failed ? 1 : 0);
