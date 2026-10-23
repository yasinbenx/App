import { measureText } from "@remotion/layout-utils";
import { FONT } from "../theme";

export type TextStyle = { fontSize: number; fontWeight: number; fontFamily?: string };

/** Greedy-Zeilenumbruch wie im Browser; liefert Zeilen und breiteste Zeile. */
export const wrapText = (text: string, maxWidth: number, style: TextStyle) => {
  const fontFamily = style.fontFamily ?? "Nunito";
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  const w = (t: string) =>
    measureText({ text: t, fontFamily, fontSize: style.fontSize, fontWeight: String(style.fontWeight), validateFontIsLoaded: true }).width;
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (w(test) <= maxWidth || !cur) cur = test;
    else {
      lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  const widest = Math.max(...lines.map(w));
  return { lines, widest };
};

export { FONT };
