import type { Block, StudioDoc } from "./types";

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-3)}`;
}

export function slugify(value: string): string {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "projet";
}

export function tx(locale: "fr" | "en", fr: string, en?: string): string {
  if (locale === "en" && en && en.trim()) return en;
  return fr;
}

export function filled(value: string | null | undefined): string | null {
  const v = value?.trim() ?? "";
  return v ? v : null;
}

function mapNode(block: Block, fn: (list: Block[]) => Block[]): Block {
  if (block.type === "columns2") {
    return { ...block, left: mapLists(block.left, fn), right: mapLists(block.right, fn) };
  }
  if (block.type === "columns3") {
    return {
      ...block,
      columns: [
        mapLists(block.columns[0], fn),
        mapLists(block.columns[1], fn),
        mapLists(block.columns[2], fn),
      ],
    };
  }
  return block;
}

function mapLists(blocks: Block[], fn: (list: Block[]) => Block[]): Block[] {
  return fn(blocks).map((block) => mapNode(block, fn));
}

export function withList(blocks: Block[], id: string, edit: (list: Block[]) => Block[]): Block[] {
  if (blocks.some((block) => block.id === id)) return edit(blocks);
  return blocks.map((block) => {
    if (block.type === "columns2") {
      return { ...block, left: withList(block.left, id, edit), right: withList(block.right, id, edit) };
    }
    if (block.type === "columns3") {
      return {
        ...block,
        columns: [
          withList(block.columns[0], id, edit),
          withList(block.columns[1], id, edit),
          withList(block.columns[2], id, edit),
        ],
      };
    }
    return block;
  });
}

export function findBlock(blocks: Block[], id: string): Block | null {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.type === "columns2") {
      const found = findBlock(block.left, id) ?? findBlock(block.right, id);
      if (found) return found;
    }
    if (block.type === "columns3") {
      for (const column of block.columns) {
        const found = findBlock(column, id);
        if (found) return found;
      }
    }
  }
  return null;
}

function cloneBlock(block: Block): Block {
  const copy = { ...block, id: uid("b") } as Block;
  if (copy.type === "columns2") {
    copy.left = block.type === "columns2" ? block.left.map(cloneBlock) : [];
    copy.right = block.type === "columns2" ? block.right.map(cloneBlock) : [];
  }
  if (copy.type === "columns3" && block.type === "columns3") {
    copy.columns = [
      block.columns[0].map(cloneBlock),
      block.columns[1].map(cloneBlock),
      block.columns[2].map(cloneBlock),
    ];
  }
  if (copy.type === "gallery" && block.type === "gallery") copy.mediaIds = [...block.mediaIds];
  if (copy.type === "carousel" && block.type === "carousel") copy.mediaIds = [...block.mediaIds];
  if (copy.type === "mosaic" && block.type === "mosaic") copy.mediaIds = [...block.mediaIds];
  return copy;
}

export function duplicateBlock(blocks: Block[], id: string): Block[] {
  return withList(blocks, id, (list) => {
    const index = list.findIndex((block) => block.id === id);
    if (index < 0) return list;
    const next = [...list];
    next.splice(index + 1, 0, cloneBlock(list[index]));
    return next;
  });
}

export function removeBlock(blocks: Block[], id: string): Block[] {
  return withList(blocks, id, (list) => list.filter((block) => block.id !== id));
}

export function moveBlock(blocks: Block[], id: string, direction: -1 | 1): Block[] {
  return withList(blocks, id, (list) => {
    const index = list.findIndex((block) => block.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return list;
    const next = [...list];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    return next;
  });
}

export function patchBlock(blocks: Block[], id: string, patch: Partial<Block>): Block[] {
  return withList(blocks, id, (list) =>
    list.map((block) => (block.id === id ? ({ ...block, ...patch } as Block) : block)),
  );
}

export function insertAfter(blocks: Block[], afterId: string | null, block: Block): Block[] {
  if (!afterId) return [...blocks, block];
  if (!findBlock(blocks, afterId)) return [...blocks, block];
  return withList(blocks, afterId, (list) => {
    const index = list.findIndex((item) => item.id === afterId);
    const next = [...list];
    next.splice(index + 1, 0, block);
    return next;
  });
}

export function visibleBlocks(blocks: Block[]): Block[] {
  return blocks
    .filter((block) => !block.hidden)
    .map((block) => {
      if (block.type === "columns2") {
        return { ...block, left: visibleBlocks(block.left), right: visibleBlocks(block.right) };
      }
      if (block.type === "columns3") {
        return {
          ...block,
          columns: [
            visibleBlocks(block.columns[0]),
            visibleBlocks(block.columns[1]),
            visibleBlocks(block.columns[2]),
          ] as [Block[], Block[], Block[]],
        };
      }
      return block;
    });
}

export function collectMediaIds(doc: StudioDoc): string[] {
  const ids = new Set<string>();
  const add = (id: string | null | undefined) => {
    if (id) ids.add(id);
  };
  add(doc.settings.logoMediaId);
  add(doc.about.portraitId);
  add(doc.about.cvId);
  for (const selection of doc.selections) add(selection.coverId);
  const walk = (blocks: Block[]) => {
    for (const block of blocks) {
      if (block.type === "image" || block.type === "video" || block.type === "audio" || block.type === "document" || block.type === "full") {
        add(block.mediaId);
      } else if (block.type === "gallery" || block.type === "carousel" || block.type === "mosaic") {
        block.mediaIds.forEach(add);
      } else if (block.type === "compare") {
        add(block.beforeId);
        add(block.afterId);
      } else if (block.type === "columns2") {
        walk(block.left);
        walk(block.right);
      } else if (block.type === "columns3") {
        block.columns.forEach(walk);
      }
    }
  };
  for (const project of doc.projects) {
    project.coverIds.forEach(add);
    project.galleryIds.forEach(add);
    walk(project.blocks);
  }
  return [...ids];
}

export function blankBlock(type: Block["type"]): Block {
  const id = uid("b");
  switch (type) {
    case "text":
      return { id, type, text: "Écrire ici.", size: "m" };
    case "monument":
      return { id, type, text: "Titre" };
    case "image":
      return { id, type, mediaId: "", size: "l" };
    case "video":
      return { id, type, mediaId: "" };
    case "gallery":
      return { id, type, mediaIds: [] };
    case "carousel":
      return { id, type, mediaIds: [] };
    case "compare":
      return { id, type, beforeId: "", afterId: "" };
    case "quote":
      return { id, type, text: "Une phrase.", credit: "" };
    case "audio":
      return { id, type, mediaId: "" };
    case "document":
      return { id, type, mediaId: "" };
    case "link":
      return { id, type, label: "Ouvrir", href: "https://" };
    case "embed":
      return { id, type, url: "https://", title: "" };
    case "columns2":
      return { id, type, left: [blankBlock("text")], right: [blankBlock("text")] };
    case "columns3":
      return {
        id,
        type,
        columns: [[blankBlock("text")], [blankBlock("text")], [blankBlock("text")]],
      };
    case "full":
      return { id, type, mediaId: "" };
    case "mosaic":
      return { id, type, mediaIds: [] };
    case "space":
      return { id, type, size: "m" };
    case "rule":
      return { id, type };
    default:
      return { id, type: "text", text: "" };
  }
}

export const BLOCK_TYPES: { type: Block["type"]; label: string }[] = [
  { type: "text", label: "Texte" },
  { type: "monument", label: "Titre monumental" },
  { type: "image", label: "Image" },
  { type: "video", label: "Vidéo" },
  { type: "gallery", label: "Galerie" },
  { type: "carousel", label: "Carrousel" },
  { type: "compare", label: "Avant / après" },
  { type: "quote", label: "Citation" },
  { type: "audio", label: "Audio" },
  { type: "document", label: "Document" },
  { type: "link", label: "Lien" },
  { type: "embed", label: "Site interactif" },
  { type: "columns2", label: "Deux colonnes" },
  { type: "columns3", label: "Trois colonnes" },
  { type: "full", label: "Image plein écran" },
  { type: "mosaic", label: "Mosaïque" },
  { type: "space", label: "Espacement" },
  { type: "rule", label: "Séparateur" },
];
