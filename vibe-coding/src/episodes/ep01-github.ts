import type { Episode } from "../engine/types";

/**
 * Vibe Coding – Folge 1
 * "Was ist GitHub, und warum brauchst du es als Vibe Coder?"
 *
 * Aufbau einer Folge:
 *  - scenes: Reihenfolge der Szenen. kind bestimmt die Darstellung (stage / browser / terminal / app / cards).
 *  - transition: wie die Szene aus der vorherigen hereinkommt (cut, whip, zoom, wipe, glitch).
 *  - beats: Dialogzeilen (line) und stumme Momente (action / pause). Dauer von Zeilen wird
 *    automatisch aus Tipp- und Lesezeit berechnet. *Wort* hebt ein Wort farbig hervor.
 *  - mark: benannte Zeitpunkte, auf die Einblendungen reagieren.
 *  - cues: Soundeffekte relativ zum Beat. Pop (Sprechblase) und Whoosh (Übergang) kommen automatisch.
 */
export const ep01: Episode = {
  id: "ep01-github",
  series: "Vibe Coding",
  number: 1,
  title: "Was ist GitHub, und warum brauchst du es als Vibe Coder?",
  scenes: [
    /* 1 ─ Einstieg direkt mit der Frage: Nahaufnahme Junge */
    {
      id: "frage",
      kind: "stage",
      camera: { shot: "boyClose", drift: 0.07 },
      leadIn: 0.2,
      beats: [
        {
          type: "line",
          speaker: "boy",
          emotion: "confused",
          gesture: "scratch",
          text: "Jedes Tutorial sagt: Hol's dir von *GitHub*. Aber was ist GitHub überhaupt?",
        },
      ],
    },

    /* 2 ─ Totale: Claude erklärt den Vergleich mit Google Drive */
    {
      id: "totale",
      kind: "stage",
      transition: { type: "whip", direction: "right" },
      camera: { shot: "wide", drift: 0.05 },
      overlays: [{ type: "folderCloud", mark: "drive" }],
      beats: [
        {
          type: "line",
          speaker: "claude",
          mark: "drive",
          emotion: "happy",
          gesture: "explain",
          text: "Wie *Google Drive für Code*: Statt Dokumenten liegen dort ganze Projekte. Das meiste davon öffentlich.",
        },
      ],
    },

    /* 3 ─ Hartschnitt auf den überraschten Jungen mit Zoom-Punch */
    {
      id: "punch",
      kind: "stage",
      transition: { type: "cut" },
      camera: { shot: "boyMedium", mode: "cut", punch: true, drift: 0.07 },
      leadIn: 0.1,
      tail: 0.1,
      beats: [
        {
          type: "line",
          speaker: "boy",
          emotion: "surprised",
          gesture: "wow",
          cues: [{ sfx: "boom", at: -0.1, gain: 0.5 }],
          text: "Ich kann also einfach *fremden Code* benutzen?",
        },
      ],
    },

    /* 4 ─ Bildschirm: GitHub-Suche "habit tracker" */
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
      beats: [
        {
          type: "line",
          speaker: "claude",
          gesture: "explain",
          text: "Wenn die Lizenz es erlaubt, ja. Such zum Beispiel nach *Habit Tracker*.",
        },
        { type: "action", seconds: 1.5, overlap: 1.2, mark: "typeQuery", cues: [{ sfx: "keyboard", at: 0.1, seconds: 1.3 }] },
        { type: "action", seconds: 0.4, mark: "search", cues: [{ sfx: "click", at: 0.05 }] },
        {
          type: "line",
          speaker: "claude",
          mark: "results",
          gesture: "point",
          text: "Jedes Projekt heißt *Repository*, kurz Repo: ein Ordner mit dem ganzen Code.",
        },
      ],
    },

    /* 5 ─ Terminal: git clone */
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
      beats: [
        { type: "line", speaker: "boy", emotion: "thinking", text: "Und wie kommt das auf meinen Rechner?" },
        { type: "line", speaker: "claude", text: "Mit *git clone* und der Adresse. Das kopiert den Ordner zu dir." },
        { type: "action", seconds: 1.6, overlap: 1.4, mark: "typeCmd", cues: [{ sfx: "keyboard", at: 0.05, seconds: 1.45 }] },
        { type: "action", seconds: 1.5, mark: "clone", cues: [{ sfx: "click", gain: 0.8 }] },
      ],
    },

    /* 6 ─ Die App läuft lokal: Haken mit Pop */
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
      beats: [
        {
          type: "line",
          speaker: "claude",
          mark: "launch",
          text: "Starten, und die App läuft bei dir *lokal*. Da ist dein Habit Tracker!",
        },
        { type: "action", seconds: 1.3, overlap: 1.0, mark: "check", cues: [{ sfx: "click", at: 0.5 }, { sfx: "success", at: 0.57 }] },
        { type: "line", speaker: "boy", emotion: "excited", gesture: "wow", text: "Krass! Und wofür brauche ich das als *Vibe Coder*?" },
      ],
    },

    /* 7 ─ Drei Karten mit den Kernpunkten */
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
      beats: [
        { type: "line", speaker: "claude", mark: "card1", text: "Erstens: Du startest nicht bei *null*." },
        { type: "line", speaker: "claude", mark: "card2", text: "Zweitens: *Jede Version* ist gesichert. Kaputt? Einfach zurück." },
        { type: "line", speaker: "claude", mark: "card3", text: "Drittens: Du kannst dein Projekt *zeigen*." },
      ],
    },

    /* 8 ─ Abschluss mit beiden Figuren */
    {
      id: "abschluss",
      kind: "stage",
      transition: { type: "zoom" },
      camera: { shot: "twoShot", drift: 0.04 },
      overlays: [{ type: "follow", mark: "follow", text: "Folge mir für Teil 2", sub: "Vibe Coding · nächste Folge" }],
      tail: 0.5,
      beats: [
        {
          type: "line",
          speaker: "boy",
          emotion: "happy",
          gesture: "count",
          text: "Also *Speicher*, *Zeitmaschine* und *Schaufenster* in einem!",
        },
        {
          type: "line",
          speaker: "claude",
          emotion: "happy",
          gesture: "wave",
          mark: "follow",
          camera: { shot: "wide", seconds: 0.9 },
          cues: [{ sfx: "click", at: 0.9 }],
          text: "Genau! Folge mir für Teil 2.",
          hold: 0.8,
        },
      ],
    },
  ],
};
