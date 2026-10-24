import type { Episode } from "../engine/types";

/**
 * Vibe Coding Deutsch – Folge 1
 * "Was ist GitHub, und warum brauchst du es als Vibe Coder?"
 * Ort: Zimmer bei Nacht
 *
 * Aufbau einer Folge (eine Datei = eine Folge):
 *  - location / costumes: Drehort und Requisiten (Figuren selbst bleiben immer gleich).
 *  - scenes: Reihenfolge der Einstellungen. kind = stage | browser | terminal | app | cards.
 *  - transition: wie die Szene hereinkommt (cut, whip, zoom, wipe, glitch). camera.punch = Zoom-Punch.
 *  - beats: Dialogzeilen (line), Aktionen (action) und Reaktions-Shots (action + react).
 *    Zeilen-Dauer wird aus Tipp- und Lesezeit (20 Zeichen/s) berechnet. *Wort* = farbig.
 *  - marks an Zeilen: Einblendungen feuern, wenn der Zuschauer die Textstelle liest.
 *  - cues: Soundeffekte. Pop (Blase) und Whoosh (Übergang) kommen automatisch.
 * Prüfen: `npm run timeline` (Länge 1800–1830 Frames, Schnitte, Lesetempo).
 */
export const ep01: Episode = {
  id: "ep01-github",
  series: "Vibe Coding Deutsch",
  number: 1,
  title: "Was ist GitHub, und warum brauchst du es als Vibe Coder?",
  location: "nightRoom",
  costumes: { boy: ["headphones"] },
  targetFrames: [1800, 1830],
  scenes: [
    /* 1 ─ Establishing + Haken: Fahrt durchs Fenster auf den Jungen, Frage sofort */
    {
      id: "frage",
      kind: "stage",
      camera: { shot: "establish", drift: 0 },
      overlays: [{ type: "series", mark: "open", until: "chipOut", kicker: "VIBE CODING · FOLGE 1", title: "Was ist GitHub?" }],
      leadIn: 0.25,
      tail: 0.6,
      beats: [
        {
          type: "line",
          speaker: "boy",
          mark: "open",
          emotion: "confused",
          gesture: "scratch",
          camera: { shot: "boyClose", seconds: 2.2, drift: 0.05 },
          marks: [{ mark: "chipOut", at: "überhaupt" }],
          text: "Jedes Tutorial sagt: Hol dir das von *GitHub*. Aber was ist das überhaupt?",
        },
      ],
    },

    /* 2 ─ Totale: Claude erklärt, Grafik Dokumente → Code-Projekte */
    {
      id: "vergleich",
      kind: "stage",
      transition: { type: "whip", direction: "right" },
      camera: { shot: "wide", drift: 0.06 },
      overlays: [{ type: "folderCloud", mark: "drive" }],
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "claude",
          mark: "drive",
          emotion: "happy",
          gesture: "explain",
          text: "Stell dir *Google Drive für Code* vor. Nur liegen dort ganze Projekte statt Dokumente.",
        },
        { type: "action", seconds: 1.3, react: { who: "boy", emotion: "thinking", gesture: "none" } },
      ],
    },

    /* 3 ─ Hartschnitt: Nahaufnahme Junge */
    {
      id: "speicher",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyClose", mode: "cut", drift: 0.06 },
      leadIn: 0.1,
      tail: 0.2,
      beats: [{ type: "line", speaker: "boy", emotion: "thinking", gesture: "explain", text: "Also ein *Online-Speicher* für Programme?" }],
    },

    /* 4 ─ Gegenschnitt: Nahaufnahme Claude, "MILLIONEN" knallt rein */
    {
      id: "oeffentlich",
      kind: "stage",
      transition: { type: "cut" },
      // Claude etwas tiefer im Bild, damit oben Platz für "MILLIONEN" ist
      camera: { shot: { x: 0.62, y: 2.0, dist: 4.0 }, mode: "cut", drift: 0.07 },
      overlays: [{ type: "stat", mark: "millionen", big: "MILLIONEN", label: "öffentliche Projekte · kostenlos" }],
      leadIn: 0.1,
      tail: 0.6,
      beats: [
        {
          type: "line",
          speaker: "claude",
          emotion: "excited",
          gesture: "count",
          marks: [{ mark: "millionen", at: "Millionen", cues: [{ sfx: "boom", gain: 0.35 }] }],
          text: "Genau. Das meiste ist *öffentlich*. Millionen Leute teilen dort ihren Code, kostenlos.",
        },
      ],
    },

    /* 5 ─ Hartschnitt mit Zoom-Punch: überraschter Junge */
    {
      id: "punch",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyMedium", mode: "cut", punch: true, drift: 0.08 },
      leadIn: 0.1,
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "boy",
          emotion: "surprised",
          gesture: "wow",
          cues: [{ sfx: "boom", at: -0.1, gain: 0.5 }],
          text: "Ich kann also *fremden Code* benutzen?",
        },
      ],
    },

    /* 6 ─ Einblendung: Suche (nur Text, eigenes Symbol) */
    {
      id: "suche",
      kind: "browser",
      transition: { type: "zoom" },
      url: "github.com/search",
      query: "habit tracker",
      resultsLabel: "1.248 Repositories",
      results: [
        { repo: "lena-codes/habit-tracker", desc: "Simple daily habit tracker with streaks", stars: "2,4k", lang: "TypeScript", langColor: "#3178C6" },
        { repo: "dev-tim/tiny-habits", desc: "Minimal habit app – React + local storage", stars: "1,1k", lang: "JavaScript", langColor: "#F1E05A" },
        { repo: "mika/habitkit-web", desc: "Track habits, build streaks, stay motivated", stars: "860", lang: "TypeScript", langColor: "#3178C6" },
        { repo: "noah-builds/streaky", desc: "Open-source habit tracker for the web", stars: "512", lang: "Svelte", langColor: "#FF3E00" },
      ],
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "claude",
          gesture: "explain",
          marks: [
            { mark: "typeQuery", at: "Such nach", cues: [{ sfx: "keyboard", seconds: 1.0 }] },
            { mark: "search", at: "und du findest", cues: [{ sfx: "click" }] },
            { mark: "results", at: "Hunderte" },
            { mark: "repo", at: "sogenannte", cues: [{ sfx: "pop", gain: 0.7 }] },
          ],
          text: "Wenn die Lizenz es erlaubt, ja. Such nach *Habit Tracker*, und du findest Hunderte Projekte, sogenannte *Repos*.",
        },
        { type: "action", seconds: 1.8 },
      ],
    },

    /* 7 ─ Hartschnitt: Junge grübelt, dann Frage */
    {
      id: "rechner",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyClose", mode: "cut", drift: 0.07 },
      leadIn: 0.1,
      tail: 0.2,
      beats: [
        { type: "action", seconds: 0.75, react: { who: "boy", emotion: "thinking", gesture: "scratch" } },
        { type: "line", speaker: "boy", emotion: "thinking", text: "Und wie kriege ich das auf meinen *Rechner*?" },
      ],
    },

    /* 8 ─ Einblendung: Terminal mit git clone */
    {
      id: "terminal",
      kind: "terminal",
      transition: { type: "wipe", direction: "right" },
      cwd: "~/projekte",
      command: "git clone https://github.com/lena-codes/habit-tracker.git",
      output: [
        "Cloning into 'habit-tracker'...",
        "remote: Enumerating objects: 248, done.",
        "Receiving objects: 100% (248/248), 1.2 MiB",
        "Resolving deltas: 100% (96/96), done.",
        "Fertig – der Ordner liegt jetzt bei dir.",
      ],
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "claude",
          marks: [
            { mark: "typeCmd", at: "git clone", cues: [{ sfx: "keyboard", seconds: 1.5 }] },
            { mark: "clone", at: "Das kopiert", cues: [{ sfx: "click", gain: 0.8 }] },
          ],
          text: "Mit *git clone* und der Adresse des Repos. Das kopiert den ganzen Ordner zu dir.",
        },
        { type: "action", seconds: 1.9 },
      ],
    },

    /* 9 ─ Einblendung: Die App läuft im Browser, Haken mit Pop */
    {
      id: "app",
      kind: "app",
      transition: { type: "glitch" },
      url: "localhost:3000",
      appTitle: "Meine Gewohnheiten",
      habits: [
        { label: "Wasser trinken", icon: "drop", done: true, streak: 6 },
        { label: "10 Min. lesen", icon: "book", streak: 3 },
        { label: "Spazieren gehen", icon: "walk", done: true, streak: 12 },
        { label: "Coden üben", icon: "code", streak: 4 },
      ],
      checkIndex: 3,
      tail: 0.1,
      beats: [
        { type: "action", seconds: 0.8, mark: "launch" },
        { type: "action", seconds: 3.0, mark: "check", cues: [{ sfx: "click", at: 0.5 }, { sfx: "success", at: 0.57 }] },
      ],
    },

    /* 10 ─ Hartschnitt + Zoom-Punch: Junge staunt, dann Frage */
    {
      id: "wozu",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyMedium", mode: "cut", punch: true, drift: 0.08 },
      leadIn: 0.1,
      tail: 0.2,
      beats: [
        { type: "action", seconds: 0.9, react: { who: "boy", emotion: "excited", gesture: "wow" }, cues: [{ sfx: "boom", gain: 0.4 }] },
        { type: "line", speaker: "boy", emotion: "thinking", gesture: "explain", text: "Und wozu brauche ich GitHub als *Vibe Coder*?" },
      ],
    },

    /* 11 ─ Einblendung: drei Karten im Lesetempo */
    {
      id: "karten",
      kind: "cards",
      transition: { type: "whip", direction: "left" },
      heading: "Warum GitHub?",
      cards: [
        { title: "Nicht bei null starten", text: "Fertige Projekte als Basis", icon: "rocket", mark: "card1" },
        { title: "Jede Version gesichert", text: "Kaputt? Einfach zurück", icon: "clock", mark: "card2" },
        { title: "Projekt zeigen", text: "Veröffentlichen & teilen", icon: "eye", mark: "card3" },
      ],
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "claude",
          marks: [
            { mark: "card1", at: "Du startest" },
            { mark: "card2", at: "jede Version", cues: [{ sfx: "pop", gain: 0.7 }] },
            { mark: "card3", at: "und du kannst", cues: [{ sfx: "pop", gain: 0.7 }] },
          ],
          text: "Du startest nicht bei *null*, jede Version ist *gesichert*, und du kannst dein Projekt *veröffentlichen*.",
        },
        { type: "action", seconds: 1.5 },
      ],
    },

    /* 12 ─ Abschluss: Totale beider Figuren, Abzeichen, Aufruf */
    {
      id: "abschluss",
      kind: "stage",
      transition: { type: "zoom" },
      camera: { shot: "twoShot", drift: 0.04 },
      overlays: [
        {
          type: "badges",
          until: "follow",
          items: [
            { label: "Speicher", icon: "folder", mark: "b1" },
            { label: "Zeitmaschine", icon: "clock", mark: "b2" },
            { label: "Schaufenster", icon: "eye", mark: "b3" },
          ],
        },
        { type: "follow", mark: "follow", text: "Folge mir für Folge 2", sub: "Vibe Coding Deutsch" },
      ],
      tail: 0.3,
      beats: [
        {
          type: "line",
          speaker: "boy",
          emotion: "excited",
          gesture: "count",
          marks: [
            { mark: "b1", at: "Speicher", cues: [{ sfx: "pop", gain: 0.7 }] },
            { mark: "b2", at: "Zeitmaschine", cues: [{ sfx: "pop", gain: 0.7 }] },
            { mark: "b3", at: "Schaufenster", cues: [{ sfx: "pop", gain: 0.7 }] },
          ],
          text: "*Speicher*, *Zeitmaschine* und *Schaufenster* in einem!",
        },
        {
          type: "line",
          speaker: "claude",
          emotion: "happy",
          gesture: "wave",
          mark: "follow",
          camera: { shot: "wide", seconds: 0.8 },
          cues: [{ sfx: "click", at: 0.9 }],
          text: "Perfekt. Folge mir für Folge 2.",
          hold: 2.0,
        },
      ],
    },
  ],
};
