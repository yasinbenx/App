import type { Episode, VoiceClip } from "../engine/types";
import voices from "./voices/ep02-terminal.json";

/**
 * Vibe Coding Deutsch – Folge 2
 * "Was ist das Terminal?"
 * Ort: gemütliches Café bei Regen (Marmortisch, Laptop, Latte-Art)
 * Aufbau und Felder: siehe ep01-github.ts und SERIENREGELN.md
 */
export const ep02: Episode = {
  id: "ep02-terminal",
  series: "Vibe Coding Deutsch",
  number: 2,
  title: "Was ist das Terminal?",
  location: "cafe",
  targetFrames: [1800, 1830],
  // Stimmen (ElevenLabs: Junge "Sam", Claude "Thomas – Warm German Explainer"), aufbereitet mit npm run voices
  voices: voices as VoiceClip[],
  scenes: [
    /* 1 ─ Establishing durch die verregnete Scheibe + Haken: Frage sofort */
    {
      id: "frage",
      kind: "stage",
      camera: { shot: "establish", drift: 0 },
      overlays: [{ type: "series", mark: "open", until: "chipOut", kicker: "VIBE CODING · FOLGE 2", title: "Was ist das Terminal?" }],
      leadIn: 0.25,
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "boy",
          mark: "open",
          emotion: "confused",
          gesture: "scratch",
          camera: { shot: "boyClose", seconds: 2.4, drift: 0.05 },
          marks: [{ mark: "chipOut", at: "Was ist das" }],
          text: "Jedes Tutorial öffnet so ein *schwarzes Fenster* mit Text. Was ist das?",
        },
      ],
    },

    /* 2 ─ Detail: Latte-Art von oben, Schwenk auf Claude halbnah, "TERMINAL" knallt rein */
    {
      id: "terminal-ist",
      kind: "stage",
      transition: { type: "whip", direction: "right" },
      camera: { shot: { x: -0.07, y: 1.62, dist: 1.45, pitch: -0.72 }, drift: 0.1 },
      overlays: [{ type: "stat", mark: "term", big: "TERMINAL", label: "Computer steuern per Text", icon: "terminal" }],
      tail: 0.4,
      beats: [
        { type: "pause", seconds: 0.6 },
        { type: "pause", seconds: 0.5, camera: { shot: { x: 0.62, y: 2.0, dist: 4.0 }, seconds: 0.5, drift: 0.07 }, cues: [{ sfx: "whoosh", gain: 0.6 }] },
        {
          type: "line",
          speaker: "claude",
          emotion: "happy",
          gesture: "explain",
          marks: [{ mark: "term", at: "Terminal", cues: [{ sfx: "boom", gain: 0.35 }] }],
          text: "Das ist das *Terminal*. Du steuerst deinen Computer damit per Text statt per Mausklick.",
        },
      ],
    },

    /* 3 ─ Hartschnitt: skeptischer Junge */
    {
      id: "klicken",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyClose", mode: "cut", drift: 0.06 },
      leadIn: 0.1,
      tail: 0.2,
      beats: [{ type: "line", speaker: "boy", emotion: "thinking", gesture: "shrug", text: "Und wieso nicht einfach *klicken*?" }],
    },

    /* 4 ─ Zwei-Einstellung: Klicken vs. Tippen */
    {
      id: "vergleich",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "twoShot", mode: "cut", drift: 0.05 },
      overlays: [
        {
          type: "compare",
          mark: "klick",
          rightMark: "text",
          left: { icon: "mouse", label: "Klicken", note: "nur wo Knöpfe sind", good: false },
          right: { icon: "terminal", label: "Tippen", note: "erreicht alles", good: true },
        },
      ],
      tail: 0.3,
      beats: [
        {
          type: "line",
          speaker: "claude",
          emotion: "happy",
          gesture: "count",
          marks: [
            { mark: "klick", at: "Klicken", cues: [{ sfx: "click" }] },
            { mark: "text", at: "Mit Text", cues: [{ sfx: "pop", gain: 0.8 }] },
          ],
          text: "Klicken geht nur dort, wo jemand einen *Knopf* gebaut hat. Mit Text erreichst du *alles*.",
        },
      ],
    },

    /* 5 ─ Zoom-Punch: Junge will loslegen */
    {
      id: "anfangen",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyMedium", mode: "cut", punch: true, drift: 0.08 },
      leadIn: 0.1,
      tail: 0.2,
      beats: [{ type: "line", speaker: "boy", emotion: "excited", gesture: "explain", cues: [{ sfx: "boom", at: -0.1, gain: 0.45 }], text: "Okay. Und wie fange ich *an*?" }],
    },

    /* 6 ─ Einblendung: großes Terminal mit ls, cd, mkdir – Ordnerbaum wächst mit */
    {
      id: "befehle",
      kind: "shell",
      transition: { type: "zoom" },
      cwd: [],
      tree: {
        name: "~",
        children: [{ name: "Bilder" }, { name: "Dokumente" }, { name: "Projekte", children: [{ name: "habit-tracker" }] }],
      },
      steps: [
        { mark: "ls", command: "ls", output: ["Bilder   Dokumente   Projekte"], tree: { ls: true } },
        { mark: "cd", command: "cd Projekte", tree: { cd: "Projekte" } },
        { mark: "mkdir", command: "mkdir vibe-app", tree: { mkdir: "vibe-app" } },
        { mark: "ls2", command: "ls", output: [{ text: "habit-tracker   vibe-app", kind: "ok" }], tree: { ls: true } },
      ],
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "claude",
          marks: [
            { mark: "ls", at: "ls zeigt", cues: [{ sfx: "keyboard", seconds: 0.3 }] },
            { mark: "cd", at: "cd wechselt", cues: [{ sfx: "keyboard", seconds: 0.7 }] },
            { mark: "mkdir", at: "mkdir legt", cues: [{ sfx: "keyboard", seconds: 0.85 }, { sfx: "pop", at: 0.95, gain: 0.9 }] },
          ],
          text: "Drei Befehle reichen: *ls* zeigt die Dateien, *cd* wechselt den Ordner, *mkdir* legt einen neuen an.",
        },
        { type: "action", seconds: 1.0, mark: "ls2", cues: [{ sfx: "keyboard", at: 0.0, seconds: 0.3 }, { sfx: "success", at: 0.45, gain: 0.7 }] },
      ],
    },

    /* 7 ─ Hartschnitt: besorgter Junge */
    {
      id: "falsch",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyClose", mode: "cut", drift: 0.07 },
      leadIn: 0.1,
      tail: 0.2,
      beats: [
        { type: "action", seconds: 0.4, react: { who: "boy", emotion: "thinking", gesture: "scratch" } },
        { type: "line", speaker: "boy", emotion: "confused", gesture: "shrug", text: "Und wenn ich etwas *Falsches* tippe?" },
      ],
    },

    /* 8 ─ Einblendung: Tippfehler → Fehlermeldung, rm → Warnschild mit Papierkorb und Funken */
    {
      id: "fehler",
      kind: "shell",
      transition: { type: "wipe", direction: "right" },
      cwd: ["Projekte"],
      steps: [
        { mark: "typo", command: "cdd vibe-app", output: [{ text: "zsh: command not found: cdd", kind: "error" }, { text: "→ einfach nochmal tippen", kind: "muted" }] },
        { mark: "rm", command: "rm wichtig.txt", warn: { title: "VORSICHT: rm", text: "löscht endgültig – ohne Papierkorb!" } },
      ],
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "claude",
          marks: [
            { mark: "typo", at: "Meistens", cues: [{ sfx: "keyboard", seconds: 0.7 }, { sfx: "click", at: 0.85, gain: 0.7 }] },
            { mark: "rm", at: "Vorsicht", cues: [{ sfx: "keyboard", seconds: 0.85 }, { sfx: "boom", at: 0.95, gain: 0.6 }] },
          ],
          text: "Meistens kommt nur eine *Fehlermeldung*. Vorsicht nur bei *rm*, das löscht Dateien endgültig.",
        },
        { type: "action", seconds: 1.2 },
      ],
    },

    /* 8b ─ Reaktion: erschrockener Junge */
    {
      id: "schreck",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyClose", mode: "cut", punch: true, drift: 0.1 },
      leadIn: 0.05,
      tail: 0.05,
      beats: [{ type: "action", seconds: 0.8, react: { who: "boy", emotion: "surprised", gesture: "wow" }, cues: [{ sfx: "boom", gain: 0.3 }] }],
    },

    /* 9 ─ Glitch: Junge fasst zusammen: Junge fasst zusammen, "FERNBEDIENUNG" */
    {
      id: "fernbedienung",
      kind: "stage",
      transition: { type: "glitch" },
      camera: { shot: "boyMedium", drift: 0.06 },
      overlays: [{ type: "stat", mark: "remote", big: "FERNBEDIENUNG", label: "für deinen Computer", icon: "remote" }],
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "boy",
          emotion: "happy",
          gesture: "point",
          marks: [{ mark: "remote", at: "Fernbedienung", cues: [{ sfx: "pop", gain: 0.9 }] }],
          text: "Also ist das Terminal eine *Fernbedienung* für meinen Computer?",
        },
      ],
    },

    /* 10 ─ Einblendung: Claude Code im Terminal */
    {
      id: "claude-code",
      kind: "shell",
      transition: { type: "whip", direction: "left" },
      cwd: ["Projekte", "vibe-app"],
      steps: [
        {
          mark: "cc",
          command: "claude",
          output: [
            { text: "Hallo! Ich bin Claude Code.", kind: "claude" },
            { text: "Was wollen wir heute bauen?", kind: "claude" },
          ],
        },
      ],
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "claude",
          emotion: "happy",
          marks: [{ mark: "cc", at: "Claude Code", cues: [{ sfx: "keyboard", seconds: 0.4 }, { sfx: "success", at: 0.55, gain: 0.6 }] }],
          text: "Genau. Und *Claude Code* arbeitet genau dort drin.",
        },
        { type: "action", seconds: 0.9 },
      ],
    },

    /* 11 ─ Hartschnitt + Zoom-Punch: Junge will loslegen */
    {
      id: "krass",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyClose", mode: "cut", punch: true, drift: 0.07 },
      leadIn: 0.1,
      tail: 0.2,
      beats: [
        { type: "action", seconds: 0.35, react: { who: "boy", emotion: "excited", gesture: "wow" }, cues: [{ sfx: "boom", gain: 0.4 }] },
        { type: "line", speaker: "boy", emotion: "excited", gesture: "wow", text: "Krass. Dann will ich das *ausprobieren*!" },
      ],
    },

    /* 12 ─ Abschluss: Totale, Aufruf zur nächsten Folge */
    {
      id: "abschluss",
      kind: "stage",
      transition: { type: "zoom" },
      camera: { shot: "wide", drift: 0.05 },
      overlays: [{ type: "follow", mark: "follow", text: "Folge mir für Folge 3", sub: "Vibe Coding Deutsch" }],
      tail: 0.3,
      beats: [
        {
          type: "line",
          speaker: "claude",
          emotion: "happy",
          gesture: "wave",
          mark: "follow",
          cues: [{ sfx: "click", at: 0.9 }],
          text: "Mach das. Und folge mir für *Folge 3*.",
          hold: 0.6,
        },
      ],
    },
  ],
};
