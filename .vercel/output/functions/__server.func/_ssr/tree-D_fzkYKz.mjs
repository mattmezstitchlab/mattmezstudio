import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tree-D_fzkYKz.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-CgU6ljwF.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-I9poqhfU.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var LIMITS = {
	image: 8388608,
	video: 12582912,
	audio: 8388608,
	pdf: 6291456,
	maxItems: 60,
	docChars: 15e5
};
var DEFAULT_DISCIPLINES = [
	"Direction artistique",
	"Architecture UX/UI",
	"Design graphique",
	"Identité visuelle",
	"Photographie",
	"Vidéo",
	"Musique et performances live",
	"Conception d'applications",
	"Expérimentations digitales",
	"Intelligence artificielle",
	"Événementiel",
	"Projets culturels"
];
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-3)}`;
}
function slugify(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "projet";
}
function tx(locale, fr, en) {
	if (locale === "en" && en && en.trim()) return en;
	return fr;
}
function filled(value) {
	const v = value?.trim() ?? "";
	return v ? v : null;
}
function withList(blocks, id, edit) {
	if (blocks.some((block) => block.id === id)) return edit(blocks);
	return blocks.map((block) => {
		if (block.type === "columns2") return {
			...block,
			left: withList(block.left, id, edit),
			right: withList(block.right, id, edit)
		};
		if (block.type === "columns3") return {
			...block,
			columns: [
				withList(block.columns[0], id, edit),
				withList(block.columns[1], id, edit),
				withList(block.columns[2], id, edit)
			]
		};
		return block;
	});
}
function findBlock(blocks, id) {
	for (const block of blocks) {
		if (block.id === id) return block;
		if (block.type === "columns2") {
			const found = findBlock(block.left, id) ?? findBlock(block.right, id);
			if (found) return found;
		}
		if (block.type === "columns3") for (const column of block.columns) {
			const found = findBlock(column, id);
			if (found) return found;
		}
	}
	return null;
}
function cloneBlock(block) {
	const copy = {
		...block,
		id: uid("b")
	};
	if (copy.type === "columns2") {
		copy.left = block.type === "columns2" ? block.left.map(cloneBlock) : [];
		copy.right = block.type === "columns2" ? block.right.map(cloneBlock) : [];
	}
	if (copy.type === "columns3" && block.type === "columns3") copy.columns = [
		block.columns[0].map(cloneBlock),
		block.columns[1].map(cloneBlock),
		block.columns[2].map(cloneBlock)
	];
	if (copy.type === "gallery" && block.type === "gallery") copy.mediaIds = [...block.mediaIds];
	if (copy.type === "carousel" && block.type === "carousel") copy.mediaIds = [...block.mediaIds];
	if (copy.type === "mosaic" && block.type === "mosaic") copy.mediaIds = [...block.mediaIds];
	return copy;
}
function duplicateBlock(blocks, id) {
	return withList(blocks, id, (list) => {
		const index = list.findIndex((block) => block.id === id);
		if (index < 0) return list;
		const next = [...list];
		next.splice(index + 1, 0, cloneBlock(list[index]));
		return next;
	});
}
function removeBlock(blocks, id) {
	return withList(blocks, id, (list) => list.filter((block) => block.id !== id));
}
function moveBlock(blocks, id, direction) {
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
function visibleBlocks(blocks) {
	return blocks.filter((block) => !block.hidden).map((block) => {
		if (block.type === "columns2") return {
			...block,
			left: visibleBlocks(block.left),
			right: visibleBlocks(block.right)
		};
		if (block.type === "columns3") return {
			...block,
			columns: [
				visibleBlocks(block.columns[0]),
				visibleBlocks(block.columns[1]),
				visibleBlocks(block.columns[2])
			]
		};
		return block;
	});
}
function collectMediaIds(doc) {
	const ids = /* @__PURE__ */ new Set();
	const add = (id) => {
		if (id) ids.add(id);
	};
	add(doc.settings.logoMediaId);
	add(doc.about.portraitId);
	add(doc.about.cvId);
	for (const selection of doc.selections) add(selection.coverId);
	const walk = (blocks) => {
		for (const block of blocks) if (block.type === "image" || block.type === "video" || block.type === "audio" || block.type === "document" || block.type === "full") add(block.mediaId);
		else if (block.type === "gallery" || block.type === "carousel" || block.type === "mosaic") block.mediaIds.forEach(add);
		else if (block.type === "compare") {
			add(block.beforeId);
			add(block.afterId);
		} else if (block.type === "columns2") {
			walk(block.left);
			walk(block.right);
		} else if (block.type === "columns3") block.columns.forEach(walk);
	};
	for (const project of doc.projects) {
		project.coverIds.forEach(add);
		project.galleryIds.forEach(add);
		walk(project.blocks);
	}
	return [...ids];
}
function blankBlock(type) {
	const id = uid("b");
	switch (type) {
		case "text": return {
			id,
			type,
			text: "Écrire ici.",
			size: "m"
		};
		case "monument": return {
			id,
			type,
			text: "Titre"
		};
		case "image": return {
			id,
			type,
			mediaId: "",
			size: "l"
		};
		case "video": return {
			id,
			type,
			mediaId: ""
		};
		case "gallery": return {
			id,
			type,
			mediaIds: []
		};
		case "carousel": return {
			id,
			type,
			mediaIds: []
		};
		case "compare": return {
			id,
			type,
			beforeId: "",
			afterId: ""
		};
		case "quote": return {
			id,
			type,
			text: "Une phrase.",
			credit: ""
		};
		case "audio": return {
			id,
			type,
			mediaId: ""
		};
		case "document": return {
			id,
			type,
			mediaId: ""
		};
		case "link": return {
			id,
			type,
			label: "Ouvrir",
			href: "https://"
		};
		case "embed": return {
			id,
			type,
			url: "https://",
			title: ""
		};
		case "columns2": return {
			id,
			type,
			left: [blankBlock("text")],
			right: [blankBlock("text")]
		};
		case "columns3": return {
			id,
			type,
			columns: [
				[blankBlock("text")],
				[blankBlock("text")],
				[blankBlock("text")]
			]
		};
		case "full": return {
			id,
			type,
			mediaId: ""
		};
		case "mosaic": return {
			id,
			type,
			mediaIds: []
		};
		case "space": return {
			id,
			type,
			size: "m"
		};
		case "rule": return {
			id,
			type
		};
		default: return {
			id,
			type: "text",
			text: ""
		};
	}
}
var BLOCK_TYPES = [
	{
		type: "text",
		label: "Texte"
	},
	{
		type: "monument",
		label: "Titre monumental"
	},
	{
		type: "image",
		label: "Image"
	},
	{
		type: "video",
		label: "Vidéo"
	},
	{
		type: "gallery",
		label: "Galerie"
	},
	{
		type: "carousel",
		label: "Carrousel"
	},
	{
		type: "compare",
		label: "Avant / après"
	},
	{
		type: "quote",
		label: "Citation"
	},
	{
		type: "audio",
		label: "Audio"
	},
	{
		type: "document",
		label: "Document"
	},
	{
		type: "link",
		label: "Lien"
	},
	{
		type: "embed",
		label: "Site interactif"
	},
	{
		type: "columns2",
		label: "Deux colonnes"
	},
	{
		type: "columns3",
		label: "Trois colonnes"
	},
	{
		type: "full",
		label: "Image plein écran"
	},
	{
		type: "mosaic",
		label: "Mosaïque"
	},
	{
		type: "space",
		label: "Espacement"
	},
	{
		type: "rule",
		label: "Séparateur"
	}
];
//#endregion
export { blankBlock as a, filled as c, removeBlock as d, slugify as f, visibleBlocks as h, authMiddleware as i, findBlock as l, uid as m, DEFAULT_DISCIPLINES as n, collectMediaIds as o, tx as p, LIMITS as r, duplicateBlock as s, BLOCK_TYPES as t, moveBlock as u };
