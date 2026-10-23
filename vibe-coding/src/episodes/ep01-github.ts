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
    /* 1 ─ Auftakt: Nahaufnahme Junge, Titelkarte knallt rein, Frage 1 */
    {
      id: "auftakt",
      kind: "stage",
      camera: { shot: "boyClose", drift: 0.06 },
      overlays: [
        {
          type: "title",
          mark: "title",
          until: "q1",
          kicker: "VIBE CODING · FOLGE 1",
          title: "Was ist GitHub?",
          subtitle: "…und warum brauchst du es als Vibe Coder?",
        },
      ],
      leadIn: 0.4,
      beats: [
        {
          type: "action",
          seconds: 2.1,
          mark: "title",
          camera: { shot: "boyClose", mode: "cut", punch: true, drift: 0.05 },
          cues: [{ sfx: "boom" }],
        },
        {
          type: "line",
          speaker: "boy",
          mark: "q1",
          emotion: "confused",
          gesture: "scratch",
          text: "Jedes Tutorial sagt: Hol dir das einfach von *GitHub*. Aber was ist GitHub überhaupt?",
        },
      ],
    },

    /* 2 ─ Totale: Claude erklärt den Vergleich mit Google Drive */
    {
      id: "totale",
      kind: "stage",
      transition: { type: "whip", direction: "right" },
      camera: { shot: "wide", drift: 0.04 },
      overlays: [{ type: "folderCloud", mark: "drive", until: "public" }],
      beats: [
        {
          type: "line",
          speaker: "claude",
          mark: "drive",
          emotion: "happy",
          gesture: "explain",
          text: "Gute Frage! Stell dir GitHub wie *Google Drive für Code* vor. Nur dass dort nicht Dokumente liegen, sondern ganze Projekte.",
        },
        {
          type: "line",
          speaker: "boy",
          emotion: "thinking",
          gesture: "explain",
          camera: { shot: "twoShot", seconds: 0.9 },
          text: "Also ein Online-Speicher für Programme?",
        },
        {
          type: "line",
          speaker: "claude",
          mark: "public",
          emotion: "excited",
          gesture: "count",
          camera: { shot: "claudeMedium", seconds: 0.8 },
          text: "Genau. Und das Beste: Das meiste ist *öffentlich*. Millionen Leute teilen dort ihren Code, kostenlos.",
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
      tail: 0.2,
      beats: [
        {
          type: "line",
          speaker: "boy",
          emotion: "surprised",
          gesture: "wow",
          cues: [{ sfx: "boom", at: -0.1, gain: 0.45 }],
          text: "Moment. Ich kann also einfach *fremden Code* benutzen?",
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
        { repo: "lena-codes/habit-tracker", desc: "Simple daily habit tracker with streaks 🔥", stars: "2,4k", lang: "TypeScript", langColor: "#3178C6" },
        { repo: "dev-tim/tiny-habits", desc: "Minimal habit app – React + local storage", stars: "1,1k", lang: "JavaScript", langColor: "#F1E05A" },
        { repo: "mika/habitkit-web", desc: "Track habits, build streaks, stay motivated", stars: "860", lang: "TypeScript", langColor: "#3178C6" },
        { repo: "noah-builds/streaky", desc: "Open-source habit tracker for the web", stars: "512", lang: "Svelte", langColor: "#FF3E00" },
      ],
      beats: [
        {
          type: "line",
          speaker: "claude",
          gesture: "explain",
          text: "Wenn die Lizenz es erlaubt, ja. Sagen wir, du willst eine Habit-Tracker-App bauen. Du suchst einfach nach *Habit Tracker*.",
        },
        { type: "action", seconds: 1.6, overlap: 1.6, mark: "typeQuery", cues: [{ sfx: "keyboard", at: 0.1, seconds: 1.4 }] },
        { type: "action", seconds: 0.5, mark: "search", cues: [{ sfx: "click", at: 0.05 }] },
        {
          type: "line",
          speaker: "claude",
          mark: "results",
          gesture: "point",
          text: "Schon findest du Hunderte fertige Projekte. Jedes davon heißt *Repository*, kurz Repo. Das ist einfach ein Ordner mit dem ganzen Code.",
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
        "remote: Counting objects: 100% (248/248), done.",
        "Receiving objects: 100% (248/248), 1.2 MiB | 4.8 MiB/s",
        "Resolving deltas: 100% (96/96), done.",
        "✔ Fertig – der Ordner liegt jetzt bei dir.",
      ],
      beats: [
        { type: "line", speaker: "boy", emotion: "thinking", text: "Und wie kriege ich den auf meinen Rechner?" },
        {
          type: "line",
          speaker: "claude",
          text: "Mit einem Befehl: *git clone* und die Adresse des Repos. Das kopiert den ganzen Ordner zu dir.",
        },
        { type: "action", seconds: 1.9, overlap: 1.6, mark: "typeCmd", cues: [{ sfx: "keyboard", at: 0.05, seconds: 1.75 }] },
        { type: "action", seconds: 2.2, mark: "clone", cues: [{ sfx: "click", gain: 0.8 }, { sfx: "success", at: 1.7, gain: 0.6 }] },
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
        { label: "Wasser trinken", emoji: "💧", done: true, streak: 6 },
        { label: "10 Min. lesen", emoji: "📚", streak: 3 },
        { label: "Spazieren gehen", emoji: "🚶", done: true, streak: 12 },
        { label: "Coden üben", emoji: "💻", streak: 4 },
      ],
      checkIndex: 3,
      beats: [
        { type: "line", speaker: "boy", emotion: "thinking", text: "Und dann läuft die App?" },
        {
          type: "line",
          speaker: "claude",
          mark: "launch",
          text: "Fast. Du startest sie, und sie läuft bei dir *lokal*. Schau, da ist dein Habit Tracker.",
        },
        { type: "action", seconds: 1.5, overlap: 1.0, mark: "check", cues: [{ sfx: "click", at: 0.55 }, { sfx: "success", at: 0.62 }] },
        {
          type: "line",
          speaker: "boy",
          emotion: "excited",
          gesture: "wow",
          text: "Krass! Und wofür brauche ich das als *Vibe Coder*?",
        },
      ],
    },

    /* 7 ─ Drei Karten mit den Kernpunkten */
    {
      id: "karten",
      kind: "cards",
      transition: { type: "whip", direction: "left" },
      heading: "Warum GitHub?",
      cards: [
        { title: "Nicht bei null starten", text: "Fertige Projekte als Basis nehmen", icon: "rocket", mark: "card1" },
        { title: "Jede Version gesichert", text: "Kaputt? Einfach zurückspringen", icon: "clock", mark: "card2" },
        { title: "Projekt zeigen", text: "Veröffentlichen & teilen", icon: "eye", mark: "card3" },
      ],
      beats: [
        { type: "line", speaker: "claude", mark: "card1", text: "Drei Dinge. Erstens: Du musst nicht bei *null* anfangen." },
        {
          type: "line",
          speaker: "claude",
          mark: "card2",
          text: "Zweitens: GitHub speichert *jede Version* deines Codes. Geht etwas kaputt, gehst du einfach zurück.",
        },
        {
          type: "line",
          speaker: "claude",
          mark: "card3",
          text: "Drittens: Mit deinem Konto kannst du dein Projekt *veröffentlichen* und anderen zeigen.",
        },
      ],
    },

    /* 8 ─ Abschluss mit beiden Figuren */
    {
      id: "abschluss",
      kind: "stage",
      transition: { type: "zoom" },
      camera: { shot: "twoShot", drift: 0.04 },
      overlays: [{ type: "follow", mark: "follow", text: "Folge mir für Teil 2", sub: "Vibe Coding · nächste Folge" }],
      tail: 0.6,
      beats: [
        {
          type: "line",
          speaker: "boy",
          emotion: "happy",
          gesture: "count",
          text: "Okay. GitHub ist also *Speicher*, *Zeitmaschine* und *Schaufenster* in einem.",
        },
        {
          type: "line",
          speaker: "claude",
          emotion: "happy",
          gesture: "wave",
          camera: { shot: "wide", seconds: 1.0 },
          text: "Perfekt zusammengefasst. Folge mir, damit du die nächste Folge nicht verpasst.",
        },
        { type: "action", seconds: 2.6, overlap: 1.6, mark: "follow", cues: [{ sfx: "pop", gain: 1.2 }, { sfx: "click", at: 0.85 }] },
      ],
    },
  ],
};
