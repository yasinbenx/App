# Quba — Qur'an, Duas & Erinnerungen

Ein deutschsprachiges MVP-Produkt für eine ruhige, fokussierte Qur'an- und
Dua-Leseerfahrung. Medina-inspiriertes Farbklima (Sandbeige, gedämpftes
Kuppelgrün, Marmorweiß, Petrol- und Gold-Akzente), iOS-artige Navigation und
realistische deutsche Demo-Inhalte.

## Stack

- React 19 + TypeScript, Vite
- Tailwind CSS v4 (Design-Tokens in `src/index.css`)
- React Router für die Navigation
- Framer Motion für Übergänge
- lucide-react für Icons

## Struktur

```
src/
  data/        Demo-Inhalte (Suren, Duas, Reminder) + Typen
  state/       App-weiter Zustand (Merken/Favoriten/Leseoptionen), localStorage
  components/  Layout (Phone-Shell, Tab-/Navbar) und wiederverwendbare UI-Bausteine
  screens/     Die 11 MVP-Screens
```

Die App wird in einem iPhone-Rahmen dargestellt (auf breiten Viewports) und
füllt auf mobilen Viewports den gesamten Bildschirm.

## Entwicklung

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
