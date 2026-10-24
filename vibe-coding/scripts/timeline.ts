// Zeigt die berechnete Timeline einer Folge und prüft die Serienregeln.
// Aufruf: npm run timeline [-- episode-id]
import { buildTimeline, linesOf, plain } from "../src/engine/timeline";
import { EPISODES } from "../src/episodes";
import { SFX } from "../src/sfx";
import { TIMING } from "../src/theme";

const id = process.argv[2];
const eps = EPISODES.filter((e) => !id || e.id === id);
const fps = 30;
const s = (f: number) => (f / fps).toFixed(2).padStart(6);
let failed = false;
const check = (ok: boolean, msg: string) => {
  console.log(`  ${ok ? "✓" : "✗"} ${msg}`);
  if (!ok) failed = true;
};

for (const ep of eps) {
  const tl = buildTimeline(ep);
  console.log(`\n${ep.id} · Ort: ${ep.location} · ${tl.duration} Frames = ${(tl.duration / fps).toFixed(2)} s`);
  let dialogFrames = 0;
  for (const sc of tl.scenes) {
    const shot = sc.kind === "stage" ? (typeof sc.camera.shot === "string" ? sc.camera.shot : "custom") : "Einblendung";
    console.log(`\n[${sc.id}] ${sc.kind}/${shot}  ab ${s(sc.from)} s  Dauer ${s(sc.duration)} s  Übergang ${sc.transition?.type ?? "-"}`);
    for (const l of linesOf(sc)) {
      const chars = plain(l.text).length;
      const typeSec = (l.typeEnd - l.typeStart) / fps;
      const shown = l.duration / fps;
      dialogFrames += l.duration;
      console.log(
        `  ${l.speaker.padEnd(6)} @${s(sc.from + l.from)}  ${String(chars).padStart(3)} Z  getippt ${typeSec.toFixed(1)} s  steht ${shown.toFixed(1)} s = ${(chars / shown).toFixed(1)} Z/s`,
      );
    }
    for (const [m, f] of Object.entries(sc.marks)) console.log(`    · ${m.padEnd(10)} @${s(sc.from + f)}`);
  }

  console.log("\nSerienregeln:");
  const [min, max] = ep.targetFrames ?? [1800, 1830];
  check(tl.duration >= min && tl.duration <= max, `Länge ${tl.duration} Frames (Ziel ${min}–${max})`);
  const cuts = tl.scenes.length - 1;
  check(cuts >= 8, `${cuts} Schnitte (mind. 8)`);
  const kinds = new Set(tl.scenes.slice(1).map((sc) => sc.transition?.type ?? "cut"));
  const punches = tl.scenes.filter((sc) => sc.kind === "stage" && sc.camera.punch).length;
  check(kinds.size >= 4, `Übergänge: ${[...kinds].join(", ")} + ${punches}× Zoom-Punch`);
  const first = linesOf(tl.scenes[0])[0];
  check(!!first && first.speaker === "boy" && tl.scenes[0].from + first.from < 2 * fps, `Frage des Jungen startet bei ${first ? s(first.from) : "-"} s (< 2 s)`);
  const tooFast = tl.scenes.flatMap(linesOf).filter((l) => plain(l.text).length / (l.duration / fps) > TIMING.readCps + 0.01);
  check(tooFast.length === 0, `Lesetempo ≤ ${TIMING.readCps} Z/s bei allen Zeilen`);
  console.log(`  · Dialog sichtbar ${(dialogFrames / fps).toFixed(1)} s, Rest (Bilder/Reaktionen/Übergänge) ${((tl.duration - dialogFrames) / fps).toFixed(1)} s`);
  console.log(`\nSoundcues (${tl.cues.length}):`);
  console.log("  " + tl.cues.map((c) => `${(c.frame / fps).toFixed(1)}s ${c.sfx}`).join(" · "));
  void SFX;
}
process.exit(failed ? 1 : 0);
