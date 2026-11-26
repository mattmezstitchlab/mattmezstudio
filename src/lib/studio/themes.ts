import type { DirectionId, Settings } from "./types";

export type Direction = {
  id: DirectionId;
  label: string;
  blurb: string;
  patch: Pick<Settings, "imageRadius" | "columns" | "gap" | "titleScale" | "animations" | "navStyle" | "fontPair" | "view">;
};

export const DIRECTIONS: Direction[] = [
  {
    id: "monument",
    label: "MONUMENT",
    blurb: "Typographie monumentale et noir profond.",
    patch: { imageRadius: 18, columns: 2, gap: 12, titleScale: 1, animations: true, navStyle: "pill", fontPair: "grotesk", view: "editorial" },
  },
  {
    id: "editorial",
    label: "EDITORIAL",
    blurb: "Blanc, magazine contemporain, grandes images.",
    patch: { imageRadius: 2, columns: 2, gap: 18, titleScale: 0.92, animations: true, navStyle: "top", fontPair: "editorial", view: "editorial" },
  },
  {
    id: "gallery",
    label: "GALLERY",
    blurb: "Galerie d'art minimaliste.",
    patch: { imageRadius: 0, columns: 2, gap: 28, titleScale: 0.78, animations: false, navStyle: "top", fontPair: "grotesk", view: "list" },
  },
  {
    id: "bento",
    label: "BENTO",
    blurb: "Mosaïque moderne et modulaire.",
    patch: { imageRadius: 22, columns: 3, gap: 10, titleScale: 0.86, animations: true, navStyle: "pill", fontPair: "grotesk", view: "mosaic" },
  },
  {
    id: "cinema",
    label: "CINEMA",
    blurb: "Vidéos et compositions immersives.",
    patch: { imageRadius: 8, columns: 1, gap: 0, titleScale: 1.05, animations: true, navStyle: "pill", fontPair: "editorial", view: "screen" },
  },
  {
    id: "brutal",
    label: "BRUTAL",
    blurb: "Contrastes graphiques, expérimental.",
    patch: { imageRadius: 0, columns: 2, gap: 8, titleScale: 1.08, animations: false, navStyle: "top", fontPair: "grotesk", view: "editorial" },
  },
];

export function directionById(id: DirectionId): Direction {
  return DIRECTIONS.find((item) => item.id === id) ?? DIRECTIONS[0];
}
