import { LIMITS, type MediaKind } from "./types";

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function sanitizeSvg(source: string): string {
  return source
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

export function parseEmbed(url: string): { provider: "youtube" | "vimeo"; id: string } | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? { provider: "youtube", id } : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
      if (parsed.pathname.startsWith("/embed/") || parsed.pathname.startsWith("/shorts/")) {
        const part = parsed.pathname.split("/").filter(Boolean)[1];
        return part ? { provider: "youtube", id: part } : null;
      }
      return id && id !== "watch" ? { provider: "youtube", id } : null;
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter((part) => /^\d+$/.test(part))[0];
      return id ? { provider: "vimeo", id } : null;
    }
    return null;
  } catch {
    return null;
  }
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture impossible."));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File): Promise<{ web: string; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1800;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossible de préparer l'image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  const web = canvas.toDataURL("image/jpeg", 0.82);
  bitmap.close();
  return { web, width, height };
}

export type PreparedUpload = {
  name: string;
  kind: MediaKind;
  mime: string;
  webData: string | null;
  originalData: string | null;
  externalUrl: string | null;
  bytes: number;
  width: number | null;
  height: number | null;
  composition: string | null;
  keptOriginal: boolean;
  note?: string;
};

export async function prepareFile(file: File): Promise<PreparedUpload> {
  const mime = file.type || "application/octet-stream";
  if (mime === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
    if (file.size > LIMITS.image) {
      throw new Error(`SVG trop lourd (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.image)}.`);
    }
    const text = sanitizeSvg(await file.text());
    const webData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
    return {
      name: file.name,
      kind: "image",
      mime: "image/svg+xml",
      webData,
      originalData: webData,
      externalUrl: null,
      bytes: file.size,
      width: null,
      height: null,
      composition: null,
      keptOriginal: true,
    };
  }
  if (mime.startsWith("image/")) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) {
      throw new Error("Formats image acceptés : JPG, PNG, WebP, SVG.");
    }
    if (file.size > LIMITS.image) {
      throw new Error(`Image trop lourde (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.image)}.`);
    }
    const compressed = await compressImage(file);
    const keepOriginal = file.size <= 1.8 * 1024 * 1024;
    return {
      name: file.name,
      kind: "image",
      mime,
      webData: compressed.web,
      originalData: keepOriginal ? await readFile(file) : null,
      externalUrl: null,
      bytes: file.size,
      width: compressed.width,
      height: compressed.height,
      composition: null,
      keptOriginal: keepOriginal,
      note: keepOriginal
        ? undefined
        : "Original trop lourd pour être conservé tel quel. La version web optimisée est gardée, l'original n'est pas détruit sur votre appareil.",
    };
  }
  if (mime === "video/mp4" || mime === "video/webm") {
    if (file.size > LIMITS.video) {
      throw new Error(`Vidéo trop lourde (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.video)}.`);
    }
    const webData = await readFile(file);
    return {
      name: file.name,
      kind: "video",
      mime,
      webData,
      originalData: webData,
      externalUrl: null,
      bytes: file.size,
      width: null,
      height: null,
      composition: null,
      keptOriginal: true,
    };
  }
  if (mime.startsWith("audio/")) {
    if (file.size > LIMITS.audio) {
      throw new Error(`Audio trop lourd (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.audio)}.`);
    }
    const webData = await readFile(file);
    return {
      name: file.name,
      kind: "audio",
      mime,
      webData,
      originalData: webData,
      externalUrl: null,
      bytes: file.size,
      width: null,
      height: null,
      composition: null,
      keptOriginal: true,
    };
  }
  if (mime === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    if (file.size > LIMITS.pdf) {
      throw new Error(`PDF trop lourd (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.pdf)}.`);
    }
    const webData = await readFile(file);
    return {
      name: file.name,
      kind: "pdf",
      mime: "application/pdf",
      webData,
      originalData: webData,
      externalUrl: null,
      bytes: file.size,
      width: null,
      height: null,
      composition: null,
      keptOriginal: true,
    };
  }
  throw new Error("Fichier refusé. Acceptés : JPG, PNG, WebP, SVG, MP4, WebM, audio, PDF.");
}
