import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

const FACES: { family: string; file: string; weight: string }[] = [
  { family: "Nunito", file: "fonts/nunito-latin-700-normal.woff2", weight: "700" },
  { family: "Nunito", file: "fonts/nunito-latin-800-normal.woff2", weight: "800" },
  { family: "Nunito", file: "fonts/nunito-latin-900-normal.woff2", weight: "900" },
  { family: "Nunito", file: "fonts/nunito-latin-ext-700-normal.woff2", weight: "700" },
  { family: "Nunito", file: "fonts/nunito-latin-ext-800-normal.woff2", weight: "800" },
  { family: "Nunito", file: "fonts/nunito-latin-ext-900-normal.woff2", weight: "900" },
  { family: "JetBrains Mono", file: "fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  { family: "JetBrains Mono", file: "fonts/jetbrains-mono-latin-700-normal.woff2", weight: "700" },
];

let loading: Promise<void> | null = null;
const loadAll = () => {
  loading ??= Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, { weight: f.weight });
      await face.load();
      document.fonts.add(face);
    }),
  ).then(() => undefined);
  return loading;
};

/** Rendert Kinder erst, wenn alle Schriften geladen sind (wichtig für Textmessung). */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender("Schriften laden"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    loadAll()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [handle]);
  return ready ? <>{children}</> : null;
};
