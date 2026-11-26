import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { createSeed } from "./seed";
import { collectMediaIds, visibleBlocks } from "./tree";
import { LIMITS, type MediaItem, type PublishedPayload, type StudioDoc } from "./types";

type MediaRow = {
  id: string;
  name: string;
  kind: string;
  mime: string;
  alt: string;
  caption: string;
  folder: string;
  focal_x: number;
  focal_y: number;
  zoom: number;
  web_data: string | null;
  original_data: string | null;
  external_url: string | null;
  poster_data: string | null;
  bytes: number;
  width: number | null;
  height: number | null;
  composition: string | null;
  created_at: unknown;
};

function parseDoc(value: unknown): StudioDoc {
  if (typeof value === "string") return JSON.parse(value) as StudioDoc;
  return value as StudioDoc;
}

function stamp(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

function toMedia(row: MediaRow, includeOriginal: boolean): MediaItem {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind as MediaItem["kind"],
    mime: row.mime,
    alt: row.alt,
    caption: row.caption,
    folder: row.folder,
    focalX: Number(row.focal_x),
    focalY: Number(row.focal_y),
    zoom: Number(row.zoom) || 1,
    webData: row.web_data,
    externalUrl: row.external_url,
    posterData: row.poster_data,
    bytes: Number(row.bytes) || 0,
    width: row.width == null ? null : Number(row.width),
    height: row.height == null ? null : Number(row.height),
    composition: row.composition,
    hasOriginal: Boolean(row.original_data),
    ...(includeOriginal ? { originalData: row.original_data } : {}),
  };
}

function publicDoc(doc: StudioDoc): StudioDoc {
  const projects = doc.projects
    .filter((project) => project.status === "published")
    .map((project) => ({ ...project, blocks: visibleBlocks(project.blocks) }))
    .sort((a, b) => a.sort - b.sort);
  const ids = new Set(projects.map((project) => project.id));
  return {
    ...doc,
    projects,
    selections: doc.selections
      .filter((selection) => selection.visibility === "public")
      .map((selection) => ({
        ...selection,
        projectIds: selection.projectIds.filter((id) => ids.has(id)),
      })),
  };
}

async function sqlClient() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

async function ensureSeed(): Promise<void> {
  const sql = await sqlClient();
  const existing = await sql<{ id: number }>`select id from studio_doc where id = 1`;
  if (existing.length > 0) return;
  const seed = createSeed();
  await sql.query(
    `insert into studio_doc (id, draft, published) values (1, $1::jsonb, $2::jsonb) on conflict (id) do nothing`,
    [JSON.stringify(seed.doc), JSON.stringify(seed.doc)],
  );
  for (const item of seed.media) {
    await sql.query(
      `insert into studio_media
        (id, name, kind, mime, alt, caption, folder, focal_x, focal_y, zoom, web_data, original_data, external_url, poster_data, bytes, width, height, composition)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       on conflict (id) do nothing`,
      [
        item.id,
        item.name,
        item.kind,
        item.mime,
        item.alt,
        item.caption,
        item.folder,
        item.focalX,
        item.focalY,
        item.zoom,
        item.webData,
        null,
        item.externalUrl,
        item.posterData,
        item.bytes,
        item.width,
        item.height,
        item.composition,
      ],
    );
  }
}

async function loadMedia(ids: string[] | null, includeOriginal: boolean): Promise<MediaItem[]> {
  const sql = await sqlClient();
  const rows = ids
    ? ids.length
      ? await sql.query<MediaRow>(
          `select * from studio_media where id = any($1::text[])`,
          [ids],
        )
      : []
    : await sql<MediaRow>`select * from studio_media order by created_at desc`;
  return rows.map((row) => toMedia(row, includeOriginal));
}

async function readDocs(): Promise<{ draft: StudioDoc; published: StudioDoc; updatedAt: string }> {
  await ensureSeed();
  const sql = await sqlClient();
  const rows = await sql<{ draft: unknown; published: unknown; updated_at: unknown }>`
    select draft, published, updated_at from studio_doc where id = 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Studio introuvable.");
  return { draft: parseDoc(row.draft), published: parseDoc(row.published), updatedAt: stamp(row.updated_at) };
}

async function ownerId(): Promise<string | null> {
  const sql = await sqlClient();
  const rows = await sql<{ owner_user_id: string | null }>`select owner_user_id from studio_owner where id = 1`;
  return rows[0]?.owner_user_id ?? null;
}

async function claimOrReject(userId: string): Promise<void> {
  const sql = await sqlClient();
  await sql`update studio_owner set owner_user_id = ${userId} where id = 1 and owner_user_id is null`;
  const owner = await ownerId();
  if (owner !== userId) {
    throw new Error("Réservé au propriétaire du studio.");
  }
}

function assertDoc(input: unknown): StudioDoc {
  const doc = input as StudioDoc;
  if (!doc || typeof doc !== "object" || !doc.settings || !Array.isArray(doc.projects) || !doc.about) {
    throw new Error("Brouillon illisible.");
  }
  if (!String(doc.settings.name ?? "").trim()) throw new Error("Le nom du studio est requis.");
  if (JSON.stringify(doc).length > LIMITS.docChars) {
    throw new Error("Le brouillon dépasse la taille maximale. Les médias se rangent dans la médiathèque.");
  }
  return doc;
}

export const getPublished = createServerFn({ method: "GET" }).handler(async (): Promise<PublishedPayload> => {
  const { published, updatedAt } = await readDocs();
  const doc = publicDoc(published);
  const media = await loadMedia(collectMediaIds(doc), false);
  return { doc, media, updatedAt };
});

export const getWorkspace = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { draft, published, updatedAt } = await readDocs();
    const owner = await ownerId();
    if (owner && owner !== context.userId) {
      return { isOwner: false as const, updatedAt };
    }
    await claimOrReject(context.userId);
    const sql = await sqlClient();
    const media = await loadMedia(null, false);
    const inquiries = await sql<{ id: string; name: string; email: string; message: string; created_at: unknown }>`
      select id, name, email, message, created_at from studio_inquiries order by created_at desc limit 80
    `;
    const revisions = await sql<{ id: number; label: string; created_at: unknown }>`
      select id, label, created_at from studio_revisions order by id desc limit 20
    `;
    return {
      isOwner: true as const,
      draft,
      published: publicDoc(published),
      media,
      updatedAt,
      inquiries: inquiries.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        message: row.message,
        createdAt: stamp(row.created_at),
      })),
      revisions: revisions.map((row) => ({
        id: Number(row.id),
        label: row.label,
        createdAt: stamp(row.created_at),
      })),
    };
  });

export const saveDraft = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => assertDoc(input))
  .handler(async ({ context, data }) => {
    await claimOrReject(context.userId);
    const sql = await sqlClient();
    await sql.query(`update studio_doc set draft = $1::jsonb, updated_at = now() where id = 1`, [
      JSON.stringify(data),
    ]);
    return { ok: true as const };
  });

export const publishSite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await claimOrReject(context.userId);
    const sql = await sqlClient();
    const rows = await sql<{ draft: unknown }>`select draft from studio_doc where id = 1`;
    const draft = parseDoc(rows[0]?.draft);
    await sql.query(
      `update studio_doc set published = $1::jsonb, draft = $1::jsonb, updated_at = now() where id = 1`,
      [JSON.stringify(draft)],
    );
    await sql.query(`insert into studio_revisions (label, snapshot) values ($1, $2::jsonb)`, [
      `Publication ${new Date().toISOString()}`,
      JSON.stringify(draft),
    ]);
    await sql`delete from studio_revisions where id not in (select id from studio_revisions order by id desc limit 20)`;
    return { ok: true as const, updatedAt: new Date().toISOString() };
  });

type MediaInput = {
  id: string;
  name: string;
  kind: string;
  mime: string;
  alt: string;
  caption: string;
  folder: string;
  focalX: number;
  focalY: number;
  zoom: number;
  webData: string | null;
  originalData: string | null;
  externalUrl: string | null;
  posterData: string | null;
  bytes: number;
  width: number | null;
  height: number | null;
  composition: string | null;
};

function assertMedia(input: unknown): MediaInput {
  const item = input as MediaInput;
  if (!item || typeof item.id !== "string" || typeof item.name !== "string") {
    throw new Error("Média illisible.");
  }
  const bytes = Number(item.bytes) || 0;
  const cap =
    item.kind === "video" ? LIMITS.video : item.kind === "audio" ? LIMITS.audio : item.kind === "pdf" ? LIMITS.pdf : LIMITS.image;
  if (bytes > cap) throw new Error(`Fichier trop lourd. Maximum ${Math.round(cap / (1024 * 1024))} Mo.`);
  if (item.kind === "image" && item.mime === "image/svg+xml" && item.webData?.startsWith("data:")) {
    const comma = item.webData.indexOf(",");
    const raw = decodeURIComponent(item.webData.slice(comma + 1));
    item.webData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sanitizeSvg(raw))}`;
    item.originalData = item.webData;
  }
  if (item.externalUrl && !/^https?:\/\//i.test(item.externalUrl)) {
    throw new Error("L'adresse doit commencer par https://");
  }
  return item;
}

function sanitizeSvg(source: string): string {
  return source
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/javascript:/gi, "");
}

export const saveMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => assertMedia(input))
  .handler(async ({ context, data }) => {
    await claimOrReject(context.userId);
    const sql = await sqlClient();
    const countRows = await sql<{ n: number }>`select count(*)::int as n from studio_media`;
    const existing = await sql<{ id: string }>`select id from studio_media where id = ${data.id}`;
    if (!existing.length && Number(countRows[0]?.n ?? 0) >= LIMITS.maxItems) {
      throw new Error(`La médiathèque est limitée à ${LIMITS.maxItems} fichiers.`);
    }
    await sql.query(
      `insert into studio_media
        (id, name, kind, mime, alt, caption, folder, focal_x, focal_y, zoom, web_data, original_data, external_url, poster_data, bytes, width, height, composition)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       on conflict (id) do update set
        name = excluded.name,
        kind = excluded.kind,
        mime = excluded.mime,
        alt = excluded.alt,
        caption = excluded.caption,
        folder = excluded.folder,
        focal_x = excluded.focal_x,
        focal_y = excluded.focal_y,
        zoom = excluded.zoom,
        web_data = coalesce(excluded.web_data, studio_media.web_data),
        original_data = coalesce(excluded.original_data, studio_media.original_data),
        external_url = excluded.external_url,
        poster_data = coalesce(excluded.poster_data, studio_media.poster_data),
        bytes = excluded.bytes,
        width = excluded.width,
        height = excluded.height,
        composition = excluded.composition`,
      [
        data.id,
        data.name.slice(0, 180),
        data.kind,
        data.mime,
        data.alt ?? "",
        data.caption ?? "",
        data.folder || "Atelier",
        data.focalX ?? 0.5,
        data.focalY ?? 0.5,
        data.zoom ?? 1,
        data.webData,
        data.originalData,
        data.externalUrl,
        data.posterData,
        data.bytes || 0,
        data.width,
        data.height,
        data.composition,
      ],
    );
    return { ok: true as const };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => {
    if (typeof id !== "string" || !id) throw new Error("Média introuvable.");
    return id;
  })
  .handler(async ({ context, data }) => {
    await claimOrReject(context.userId);
    const sql = await sqlClient();
    await sql`delete from studio_media where id = ${data}`;
    return { ok: true as const };
  });

export const postInquiry = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const value = input as { name?: string; email?: string; message?: string };
    const name = String(value?.name ?? "").trim();
    const email = String(value?.email ?? "").trim();
    const message = String(value?.message ?? "").trim();
    if (name.length < 2 || name.length > 80) throw new Error("Indiquez votre nom.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
      throw new Error("Indiquez une adresse courriel valide.");
    }
    if (message.length < 4 || message.length > 2000) throw new Error("Le message doit faire entre 4 et 2000 caractères.");
    return { name, email, message };
  })
  .handler(async ({ data }) => {
    const sql = await sqlClient();
    const id = `msg_${Math.random().toString(36).slice(2, 10)}`;
    await sql`insert into studio_inquiries (id, name, email, message) values (${id}, ${data.name}, ${data.email}, ${data.message})`;
    return { ok: true as const };
  });

export const deleteInquiry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => {
    if (typeof id !== "string") throw new Error("Message introuvable.");
    return id;
  })
  .handler(async ({ context, data }) => {
    await claimOrReject(context.userId);
    const sql = await sqlClient();
    await sql`delete from studio_inquiries where id = ${data}`;
    return { ok: true as const };
  });

export const getSelection = createServerFn({ method: "GET" })
  .validator((slug: unknown) => {
    if (typeof slug !== "string" || !slug) throw new Error("Sélection introuvable.");
    return slug;
  })
  .handler(async ({ data: slug }) => {
    const { published } = await readDocs();
    const selection = published.selections.find((item) => item.slug === slug);
    if (!selection || selection.visibility !== "public") return { found: false as const };
    const projects = published.projects.filter(
      (project) => project.status === "published" && selection.projectIds.includes(project.id),
    );
    const doc: StudioDoc = { ...published, projects, selections: [selection] };
    const media = await loadMedia(collectMediaIds(doc), false);
    return { found: true as const, selection, projects, media, settings: published.settings };
  });

export const getPrivateSelection = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((slug: unknown) => {
    if (typeof slug !== "string") throw new Error("Sélection introuvable.");
    return slug;
  })
  .handler(async ({ context, data: slug }) => {
    await claimOrReject(context.userId);
    const { draft } = await readDocs();
    const selection = draft.selections.find((item) => item.slug === slug);
    if (!selection) return { found: false as const };
    const projects = draft.projects.filter((project) => selection.projectIds.includes(project.id));
    const doc: StudioDoc = { ...draft, projects, selections: [selection] };
    const media = await loadMedia(collectMediaIds(doc), false);
    return { found: true as const, selection, projects, media, settings: draft.settings };
  });

export const exportBackup = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await claimOrReject(context.userId);
    const { draft } = await readDocs();
    const media = await loadMedia(null, true);
    return {
      kind: "matt-mez-studio",
      version: 1,
      exportedAt: new Date().toISOString(),
      doc: draft,
      media,
    };
  });

export const importBackup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const value = input as { doc?: StudioDoc; media?: MediaItem[] };
    const doc = assertDoc(value?.doc);
    const media = Array.isArray(value.media) ? value.media.slice(0, LIMITS.maxItems) : [];
    return { doc, media };
  })
  .handler(async ({ context, data }) => {
    await claimOrReject(context.userId);
    const sql = await sqlClient();
    await sql.query(`update studio_doc set draft = $1::jsonb, updated_at = now() where id = 1`, [
      JSON.stringify(data.doc),
    ]);
    await sql`delete from studio_media`;
    for (const item of data.media) {
      const safe = assertMedia({
        ...item,
        originalData: item.originalData ?? null,
        webData: item.webData,
        hasOriginal: undefined,
      });
      await sql.query(
        `insert into studio_media
          (id, name, kind, mime, alt, caption, folder, focal_x, focal_y, zoom, web_data, original_data, external_url, poster_data, bytes, width, height, composition)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
        [
          safe.id,
          safe.name,
          safe.kind,
          safe.mime,
          safe.alt ?? "",
          safe.caption ?? "",
          safe.folder || "Atelier",
          safe.focalX ?? 0.5,
          safe.focalY ?? 0.5,
          safe.zoom ?? 1,
          safe.webData,
          safe.originalData,
          safe.externalUrl,
          safe.posterData,
          safe.bytes || 0,
          safe.width,
          safe.height,
          safe.composition,
        ],
      );
    }
    return { ok: true as const };
  });

export const restoreRevision = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => {
    const num = Number(id);
    if (!Number.isFinite(num)) throw new Error("Version introuvable.");
    return num;
  })
  .handler(async ({ context, data }) => {
    await claimOrReject(context.userId);
    const sql = await sqlClient();
    const rows = await sql<{ snapshot: unknown }>`select snapshot from studio_revisions where id = ${data}`;
    if (!rows[0]) throw new Error("Version introuvable.");
    const doc = assertDoc(parseDoc(rows[0].snapshot));
    await sql.query(`update studio_doc set draft = $1::jsonb, updated_at = now() where id = 1`, [
      JSON.stringify(doc),
    ]);
    return { ok: true as const, doc };
  });

