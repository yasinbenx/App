// Gibt die berechnete Timeline einer Folge aus (Szenen, Zeilen, Lesezeiten).
// Aufruf: node scripts/timeline.ts [episode-id]
import { buildTimeline, linesOf, plain } from "../src/engine/timeline";
import { EPISODES } from "../src/episodes/index";

const id = process.argv[2];
const ep = EPISODES.find((e) => !id || e.id === id)!;
const tl = buildTimeline(ep);
const fps = 30;
const s = (f: number) => (f / fps).toFixed(2).padStart(6);
console.log(`${ep.id}: ${tl.duration} Frames = ${(tl.duration / fps).toFixed(1)} s`);
for (const sc of tl.scenes) {
  console.log(`\n[${sc.id}] ${sc.kind}  ab ${s(sc.from)} s  Dauer ${s(sc.duration)} s  Übergang ${sc.transition?.type ?? "-"}`);
  for (const l of linesOf(sc)) {
    const chars = plain(l.text).length;
    const shown = l.duration / fps;
    console.log(
      `  #${l.lineNo + 1} ${l.speaker.padEnd(6)} @${s(sc.from + l.from)}  ${String(chars).padStart(3)} Z  sichtbar ${shown.toFixed(1)} s  = ${(chars / shown).toFixed(1)} Z/s  endFrame ${sc.from + l.from + l.duration - 1}`,
    );
  }
}
console.log(`\nSoundcues: ${tl.cues.length}`);
for (const c of tl.cues) console.log(`  ${s(c.frame)} s  ${c.sfx.padEnd(9)} vol ${c.volume.toFixed(2)}`);
