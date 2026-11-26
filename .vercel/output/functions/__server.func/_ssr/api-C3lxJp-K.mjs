import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { h as visibleBlocks, i as authMiddleware, n as DEFAULT_DISCIPLINES, o as collectMediaIds, r as LIMITS } from "./tree-D_fzkYKz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-C3lxJp-K.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function media(partial) {
	return partial;
}
function createSeed() {
	const mediaItems = [
		media({
			id: "m_devices",
			name: "Scène appareils",
			kind: "composition",
			mime: "",
			alt: "Composition originale : ordinateur et téléphone, page éditoriale.",
			caption: "Maquette de démonstration, dessinée pour le studio.",
			folder: "Démonstration",
			focalX: .5,
			focalY: .5,
			zoom: 1,
			webData: null,
			externalUrl: null,
			posterData: null,
			bytes: 0,
			width: null,
			height: null,
			composition: "devices",
			hasOriginal: false
		}),
		media({
			id: "m_sax",
			name: "Cuivres",
			kind: "image",
			mime: "image/jpeg",
			alt: "Saxophone en lumière de concert, photographie de démonstration.",
			caption: "Photographie de démonstration — à remplacer.",
			folder: "Démonstration",
			focalX: .42,
			focalY: .45,
			zoom: 1,
			webData: "/demo/sax.jpg",
			externalUrl: null,
			posterData: null,
			bytes: 290335,
			width: 1600,
			height: 1067,
			composition: null,
			hasOriginal: false
		}),
		media({
			id: "m_wall",
			name: "Mur typographique",
			kind: "composition",
			mime: "",
			alt: "Mur jaune et lettres monumentales, composition originale.",
			caption: "Composition graphique de démonstration.",
			folder: "Démonstration",
			focalX: .5,
			focalY: .4,
			zoom: 1,
			webData: null,
			externalUrl: null,
			posterData: null,
			bytes: 0,
			width: null,
			height: null,
			composition: "typewall",
			hasOriginal: false
		}),
		media({
			id: "m_waves",
			name: "Salle blanche",
			kind: "composition",
			mime: "",
			alt: "Salle blanche et lignes topographiques, composition originale.",
			caption: "Composition de démonstration.",
			folder: "Démonstration",
			focalX: .5,
			focalY: .5,
			zoom: 1,
			webData: null,
			externalUrl: null,
			posterData: null,
			bytes: 0,
			width: null,
			height: null,
			composition: "waves",
			hasOriginal: false
		}),
		media({
			id: "m_stage",
			name: "Plateau",
			kind: "image",
			mime: "image/jpeg",
			alt: "Plateau de répétition dans la pénombre, photographie de démonstration.",
			caption: "Photographie de démonstration — à remplacer.",
			folder: "Démonstration",
			focalX: .55,
			focalY: .48,
			zoom: 1,
			webData: "/demo/stage.jpg",
			externalUrl: null,
			posterData: null,
			bytes: 278573,
			width: 1600,
			height: 1067,
			composition: null,
			hasOriginal: false
		}),
		media({
			id: "m_arch",
			name: "Volume",
			kind: "image",
			mime: "image/jpeg",
			alt: "Architecture blanche aux volumes inclinés, photographie de démonstration.",
			caption: "Photographie de démonstration — à remplacer.",
			folder: "Démonstration",
			focalX: .62,
			focalY: .42,
			zoom: 1,
			webData: "/demo/arch.jpg",
			externalUrl: null,
			posterData: null,
			bytes: 266442,
			width: 1800,
			height: 1200,
			composition: null,
			hasOriginal: false
		}),
		media({
			id: "m_gallery",
			name: "Accrochage",
			kind: "image",
			mime: "image/jpeg",
			alt: "Couloir d'exposition, photographie de démonstration.",
			caption: "Photographie de démonstration — à remplacer.",
			folder: "Démonstration",
			focalX: .5,
			focalY: .45,
			zoom: 1,
			webData: "/demo/gallery.jpg",
			externalUrl: null,
			posterData: null,
			bytes: 180236,
			width: 1600,
			height: 1067,
			composition: null,
			hasOriginal: false
		}),
		media({
			id: "m_ink",
			name: "Encre",
			kind: "image",
			mime: "image/jpeg",
			alt: "Encre colorée dans l'eau, photographie de démonstration.",
			caption: "Photographie de démonstration — à remplacer.",
			folder: "Démonstration",
			focalX: .5,
			focalY: .5,
			zoom: 1,
			webData: "/demo/yellow.jpg",
			externalUrl: null,
			posterData: null,
			bytes: 291e3,
			width: 1600,
			height: 1067,
			composition: null,
			hasOriginal: false
		}),
		media({
			id: "m_hands",
			name: "Atelier son",
			kind: "image",
			mime: "image/jpeg",
			alt: "Instruments dans une pièce lumineuse, photographie de démonstration.",
			caption: "Photographie de démonstration — à remplacer.",
			folder: "Démonstration",
			focalX: .5,
			focalY: .55,
			zoom: 1,
			webData: "/demo/hands.jpg",
			externalUrl: null,
			posterData: null,
			bytes: 291532,
			width: 1600,
			height: 1067,
			composition: null,
			hasOriginal: false
		}),
		media({
			id: "m_tone",
			name: "Note grave",
			kind: "audio",
			mime: "audio/wav",
			alt: "",
			caption: "Son de démonstration, une note générée — à remplacer.",
			folder: "Démonstration",
			focalX: .5,
			focalY: .5,
			zoom: 1,
			webData: "/demo/tone.wav",
			externalUrl: null,
			posterData: null,
			bytes: 70604,
			width: null,
			height: null,
			composition: null,
			hasOriginal: false
		}),
		media({
			id: "m_pdf",
			name: "Note PDF",
			kind: "pdf",
			mime: "application/pdf",
			alt: "",
			caption: "Document de démonstration — à remplacer.",
			folder: "Démonstration",
			focalX: .5,
			focalY: .5,
			zoom: 1,
			webData: "/demo/note.pdf",
			externalUrl: null,
			posterData: null,
			bytes: 632,
			width: null,
			height: null,
			composition: null,
			hasOriginal: false
		})
	];
	return {
		doc: {
			settings: {
				name: "MATT MEZ",
				signature: "Creative Studio",
				mark: "MM© STUDIO",
				tagline: "Je conçois des identités, des expériences et des univers où l'art, la technologie et l'humain se rencontrent.",
				taglineEn: "I design identities, experiences and worlds where art, technology and people meet.",
				disciplinesLine: "Direction artistique · Design · Musique",
				disciplinesLineEn: "Art direction · Design · Music",
				availability: "Disponible pour de nouveaux projets",
				availabilityEn: "Available for new projects",
				yearLabel: "2026",
				philosophy: "Mon site n'est jamais terminé. Il évolue avec moi.",
				labIntro: "Recherches, prototypes et applications utilisables. Rien ici n'est une commande, un client ou une récompense inventée.",
				direction: "monument",
				view: "editorial",
				imageRadius: 18,
				columns: 2,
				gap: 12,
				titleScale: 1,
				animations: true,
				navStyle: "pill",
				fontPair: "grotesk",
				disciplines: DEFAULT_DISCIPLINES,
				logoMediaId: null,
				colors: null
			},
			about: {
				portraitId: null,
				statement: "Je conçois des identités, des expériences et des univers où l'art, la technologie et l'humain se rencontrent.",
				statementEn: "I design identities, experiences and worlds where art, technology and people meet.",
				bio: "",
				bioEn: "",
				path: "",
				vision: "",
				experiences: [],
				collaborations: [],
				socials: [],
				city: "",
				email: "",
				phone: "",
				cvId: null
			},
			selections: [
				{
					id: "sel_ad",
					slug: "direction-artistique",
					title: "Direction artistique",
					intro: "Sélection de démonstration. Les fichiers ne sont pas dupliqués.",
					coverId: "m_wall",
					visibility: "public",
					projectIds: ["p_systemes"]
				},
				{
					id: "sel_ux",
					slug: "ux-ui",
					title: "UX/UI",
					intro: "Interfaces et architectures d'expérience — pièces de démonstration.",
					coverId: "m_devices",
					visibility: "public",
					projectIds: ["p_aime"]
				},
				{
					id: "sel_music",
					slug: "musique",
					title: "Musique",
					intro: "Performances, plateaux, écoute.",
					coverId: "m_sax",
					visibility: "public",
					projectIds: ["p_aime", "p_nocturne"]
				},
				{
					id: "sel_photo",
					slug: "photographie",
					title: "Photographie",
					intro: "Images de démonstration, remplaçables depuis la médiathèque.",
					coverId: "m_gallery",
					visibility: "public",
					projectIds: ["p_nocturne", "p_systemes"]
				},
				{
					id: "sel_cine",
					slug: "cinema",
					title: "Cinéma",
					intro: "Cadres, lumières, temps.",
					coverId: "m_stage",
					visibility: "public",
					projectIds: ["p_nocturne"]
				},
				{
					id: "sel_private",
					slug: "cabinet",
					title: "Cabinet",
					intro: "Sélection privée. Un visiteur non propriétaire ne peut pas l'ouvrir.",
					coverId: "m_arch",
					visibility: "private",
					projectIds: ["p_nocturne"]
				}
			],
			projects: [
				{
					id: "p_aime",
					slug: "aime",
					title: "AIME®",
					titleEn: "AIME®",
					subtitle: "Une identité, une interface, une présence sonore.",
					subtitleEn: "An identity, an interface, a sonic presence.",
					summary: "Pièce de démonstration. Elle montre comment une création occupe la page : deux images, un titre, presque pas de texte. Aucun client réel.",
					summaryEn: "Demonstration piece. It shows how a work can hold the page: two images, a title, almost no text. No real client.",
					year: "2026",
					client: "",
					disciplines: ["UX/UI", "Musique"],
					role: "Direction, design, son",
					collaborators: "",
					context: "Contexte fictif de démonstration — à remplacer par le vôtre.",
					process: "Le processus se raconte en blocs : image, citation, colonnes, document.",
					result: "Le site publié ne montre que ce que vous choisissez de publier.",
					externalUrl: "",
					status: "published",
					featured: true,
					placement: "work",
					sort: 0,
					demo: true,
					label: "AIME®",
					tags: [{ text: "UX/UI" }, {
						text: "Music",
						strong: true
					}],
					meta: "Live",
					coverIds: ["m_devices", "m_sax"],
					galleryIds: [
						"m_sax",
						"m_hands",
						"m_gallery"
					],
					blocks: [
						{
							id: "b1",
							type: "monument",
							text: "AIME®"
						},
						{
							id: "b2",
							type: "text",
							size: "m",
							text: "Démonstration éditable. L'image passe avant le discours. Remplacez chaque bloc sans toucher au code."
						},
						{
							id: "b3",
							type: "full",
							mediaId: "m_sax"
						},
						{
							id: "b4",
							type: "quote",
							text: "Le silence autour d'une image est aussi un choix de direction.",
							credit: "Note de studio"
						},
						{
							id: "b5",
							type: "columns2",
							left: [{
								id: "b5a",
								type: "image",
								mediaId: "m_hands",
								size: "l"
							}],
							right: [{
								id: "b5b",
								type: "text",
								size: "s",
								text: "Colonne de démonstration. Le texte peut disparaître : un champ vide n'est pas affiché."
							}]
						},
						{
							id: "b6",
							type: "document",
							mediaId: "m_pdf"
						}
					],
					labHref: ""
				},
				{
					id: "p_systemes",
					slug: "systemes",
					title: "Systèmes",
					titleEn: "Systems",
					subtitle: "Lettres, salles, structures.",
					subtitleEn: "Letters, rooms, structures.",
					summary: "Démonstration de direction artistique. Pas une réalisation client.",
					summaryEn: "Art-direction demonstration. Not a client project.",
					year: "2026",
					client: "",
					disciplines: ["Direction artistique", "Identité visuelle"],
					role: "",
					collaborators: "",
					context: "",
					process: "",
					result: "",
					externalUrl: "",
					status: "published",
					featured: true,
					placement: "both",
					sort: 1,
					demo: true,
					label: "Art direction",
					tags: [{ text: "Identités" }, {
						text: "Experiments",
						strong: true
					}],
					meta: "Lab",
					coverIds: ["m_wall", "m_waves"],
					galleryIds: [
						"m_gallery",
						"m_arch",
						"m_wall"
					],
					blocks: [
						{
							id: "b7",
							type: "image",
							mediaId: "m_gallery",
							size: "xl"
						},
						{
							id: "b8",
							type: "image",
							mediaId: "m_arch",
							size: "l"
						},
						{
							id: "b9",
							type: "compare",
							beforeId: "m_gallery",
							afterId: "m_arch"
						},
						{
							id: "b10",
							type: "mosaic",
							mediaIds: [
								"m_wall",
								"m_waves",
								"m_arch",
								"m_gallery"
							]
						}
					],
					labHref: ""
				},
				{
					id: "p_nocturne",
					slug: "nocturne",
					title: "Nocturne",
					titleEn: "Nocturne",
					subtitle: "Lumière, cuivre, attente.",
					subtitleEn: "Light, brass, waiting.",
					summary: "Démonstration photographique et sonore. Les instruments visibles ne sont pas un concert réel du studio.",
					summaryEn: "Photographic and sonic demonstration. The instruments shown are not a real studio concert.",
					year: "2026",
					client: "",
					disciplines: ["Musique et performances live", "Photographie"],
					role: "",
					collaborators: "",
					context: "",
					process: "",
					result: "",
					externalUrl: "",
					status: "published",
					featured: true,
					placement: "work",
					sort: 2,
					demo: true,
					label: "Nocturne",
					tags: [{ text: "Musique" }, {
						text: "Image",
						strong: true
					}],
					meta: "Studio",
					coverIds: ["m_stage", "m_hands"],
					galleryIds: [
						"m_stage",
						"m_sax",
						"m_hands"
					],
					blocks: [
						{
							id: "b11",
							type: "full",
							mediaId: "m_stage"
						},
						{
							id: "b12",
							type: "audio",
							mediaId: "m_tone"
						},
						{
							id: "b13",
							type: "carousel",
							mediaIds: [
								"m_stage",
								"m_sax",
								"m_hands"
							]
						},
						{
							id: "b14",
							type: "space",
							size: "m"
						},
						{
							id: "b15",
							type: "rule"
						}
					],
					labHref: ""
				},
				{
					id: "p_signal",
					slug: "signal",
					title: "Signal",
					titleEn: "Signal",
					subtitle: "Champ typographique réactif.",
					subtitleEn: "A reactive typographic field.",
					summary: "Expérimentation utilisable. Déplacez le pointeur. Ce n'est pas un projet livré, c'est un outil du laboratoire.",
					summaryEn: "A usable experiment. Move the pointer. This is a laboratory tool, not a delivered commission.",
					year: "2026",
					client: "",
					disciplines: ["Expérimentations digitales"],
					role: "",
					collaborators: "",
					context: "",
					process: "",
					result: "",
					externalUrl: "",
					status: "published",
					featured: false,
					placement: "lab",
					sort: 3,
					demo: true,
					label: "Signal",
					tags: [{
						text: "Lab",
						strong: true
					}],
					meta: "Outil",
					coverIds: ["m_ink"],
					galleryIds: ["m_ink"],
					blocks: [
						{
							id: "b16",
							type: "text",
							size: "m",
							text: "Ouvrez l'outil pour le manipuler. Le lien ci-dessous est une application réelle du site, pas une vitrine factice."
						},
						{
							id: "b17",
							type: "link",
							label: "Ouvrir Signal",
							href: "/laboratoire/signal"
						},
						{
							id: "b18",
							type: "image",
							mediaId: "m_ink",
							size: "xl"
						}
					],
					labHref: "/laboratoire/signal"
				}
			]
		},
		media: mediaItems
	};
}
function parseDoc(value) {
	if (typeof value === "string") return JSON.parse(value);
	return value;
}
function stamp(value) {
	if (value instanceof Date) return value.toISOString();
	return String(value ?? "");
}
function toMedia(row, includeOriginal) {
	return {
		id: row.id,
		name: row.name,
		kind: row.kind,
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
		...includeOriginal ? { originalData: row.original_data } : {}
	};
}
function publicDoc(doc) {
	const projects = doc.projects.filter((project) => project.status === "published").map((project) => ({
		...project,
		blocks: visibleBlocks(project.blocks)
	})).sort((a, b) => a.sort - b.sort);
	const ids = new Set(projects.map((project) => project.id));
	return {
		...doc,
		projects,
		selections: doc.selections.filter((selection) => selection.visibility === "public").map((selection) => ({
			...selection,
			projectIds: selection.projectIds.filter((id) => ids.has(id))
		}))
	};
}
async function sqlClient() {
	const { getSql } = await import("./db-BO-1zz97.mjs").then((n) => n.t).then((n) => n.t);
	return getSql();
}
async function ensureSeed() {
	const sql = await sqlClient();
	if ((await sql`select id from studio_doc where id = 1`).length > 0) return;
	const seed = createSeed();
	await sql.query(`insert into studio_doc (id, draft, published) values (1, $1::jsonb, $2::jsonb) on conflict (id) do nothing`, [JSON.stringify(seed.doc), JSON.stringify(seed.doc)]);
	for (const item of seed.media) await sql.query(`insert into studio_media
        (id, name, kind, mime, alt, caption, folder, focal_x, focal_y, zoom, web_data, original_data, external_url, poster_data, bytes, width, height, composition)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       on conflict (id) do nothing`, [
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
		item.composition
	]);
}
async function loadMedia(ids, includeOriginal) {
	const sql = await sqlClient();
	return (ids ? ids.length ? await sql.query(`select * from studio_media where id = any($1::text[])`, [ids]) : [] : await sql`select * from studio_media order by created_at desc`).map((row) => toMedia(row, includeOriginal));
}
async function readDocs() {
	await ensureSeed();
	const row = (await (await sqlClient())`
    select draft, published, updated_at from studio_doc where id = 1
  `)[0];
	if (!row) throw new Error("Studio introuvable.");
	return {
		draft: parseDoc(row.draft),
		published: parseDoc(row.published),
		updatedAt: stamp(row.updated_at)
	};
}
async function ownerId() {
	return (await (await sqlClient())`select owner_user_id from studio_owner where id = 1`)[0]?.owner_user_id ?? null;
}
async function claimOrReject(userId) {
	await (await sqlClient())`update studio_owner set owner_user_id = ${userId} where id = 1 and owner_user_id is null`;
	if (await ownerId() !== userId) throw new Error("Réservé au propriétaire du studio.");
}
function assertDoc(input) {
	const doc = input;
	if (!doc || typeof doc !== "object" || !doc.settings || !Array.isArray(doc.projects) || !doc.about) throw new Error("Brouillon illisible.");
	if (!String(doc.settings.name ?? "").trim()) throw new Error("Le nom du studio est requis.");
	if (JSON.stringify(doc).length > LIMITS.docChars) throw new Error("Le brouillon dépasse la taille maximale. Les médias se rangent dans la médiathèque.");
	return doc;
}
var getPublished_createServerFn_handler = createServerRpc({
	id: "6c7160d2e42b3ea440ff22512ef01acc7a5a06b68dced6487a2e6a022a9881a1",
	name: "getPublished",
	filename: "src/lib/studio/api.ts"
}, (opts) => getPublished.__executeServer(opts));
var getPublished = createServerFn({ method: "GET" }).handler(getPublished_createServerFn_handler, async () => {
	const { published, updatedAt } = await readDocs();
	const doc = publicDoc(published);
	return {
		doc,
		media: await loadMedia(collectMediaIds(doc), false),
		updatedAt
	};
});
var getWorkspace_createServerFn_handler = createServerRpc({
	id: "3125930a2de4b5ad8a9996d8952c58cd54d9c649f9619789618977caa47c8a30",
	name: "getWorkspace",
	filename: "src/lib/studio/api.ts"
}, (opts) => getWorkspace.__executeServer(opts));
var getWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getWorkspace_createServerFn_handler, async ({ context }) => {
	const { draft, published, updatedAt } = await readDocs();
	const owner = await ownerId();
	if (owner && owner !== context.userId) return {
		isOwner: false,
		updatedAt
	};
	await claimOrReject(context.userId);
	const sql = await sqlClient();
	const media = await loadMedia(null, false);
	const inquiries = await sql`
      select id, name, email, message, created_at from studio_inquiries order by created_at desc limit 80
    `;
	const revisions = await sql`
      select id, label, created_at from studio_revisions order by id desc limit 20
    `;
	return {
		isOwner: true,
		draft,
		published: publicDoc(published),
		media,
		updatedAt,
		inquiries: inquiries.map((row) => ({
			id: row.id,
			name: row.name,
			email: row.email,
			message: row.message,
			createdAt: stamp(row.created_at)
		})),
		revisions: revisions.map((row) => ({
			id: Number(row.id),
			label: row.label,
			createdAt: stamp(row.created_at)
		}))
	};
});
var saveDraft_createServerFn_handler = createServerRpc({
	id: "b4c7ef95999dc0c8213600fd839f589cf0796146353fad39656ce9a295ce4266",
	name: "saveDraft",
	filename: "src/lib/studio/api.ts"
}, (opts) => saveDraft.__executeServer(opts));
var saveDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => assertDoc(input)).handler(saveDraft_createServerFn_handler, async ({ context, data }) => {
	await claimOrReject(context.userId);
	await (await sqlClient()).query(`update studio_doc set draft = $1::jsonb, updated_at = now() where id = 1`, [JSON.stringify(data)]);
	return { ok: true };
});
var publishSite_createServerFn_handler = createServerRpc({
	id: "317897febb63e42c50264bbffc1e29c98faa7e09e5eb06d7049bd5a7f3252682",
	name: "publishSite",
	filename: "src/lib/studio/api.ts"
}, (opts) => publishSite.__executeServer(opts));
var publishSite = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(publishSite_createServerFn_handler, async ({ context }) => {
	await claimOrReject(context.userId);
	const sql = await sqlClient();
	const draft = parseDoc((await sql`select draft from studio_doc where id = 1`)[0]?.draft);
	await sql.query(`update studio_doc set published = $1::jsonb, draft = $1::jsonb, updated_at = now() where id = 1`, [JSON.stringify(draft)]);
	await sql.query(`insert into studio_revisions (label, snapshot) values ($1, $2::jsonb)`, [`Publication ${(/* @__PURE__ */ new Date()).toISOString()}`, JSON.stringify(draft)]);
	await sql`delete from studio_revisions where id not in (select id from studio_revisions order by id desc limit 20)`;
	return {
		ok: true,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
});
function assertMedia(input) {
	const item = input;
	if (!item || typeof item.id !== "string" || typeof item.name !== "string") throw new Error("Média illisible.");
	const bytes = Number(item.bytes) || 0;
	const cap = item.kind === "video" ? LIMITS.video : item.kind === "audio" ? LIMITS.audio : item.kind === "pdf" ? LIMITS.pdf : LIMITS.image;
	if (bytes > cap) throw new Error(`Fichier trop lourd. Maximum ${Math.round(cap / 1048576)} Mo.`);
	if (item.kind === "image" && item.mime === "image/svg+xml" && item.webData?.startsWith("data:")) {
		const comma = item.webData.indexOf(",");
		const raw = decodeURIComponent(item.webData.slice(comma + 1));
		item.webData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sanitizeSvg(raw))}`;
		item.originalData = item.webData;
	}
	if (item.externalUrl && !/^https?:\/\//i.test(item.externalUrl)) throw new Error("L'adresse doit commencer par https://");
	return item;
}
function sanitizeSvg(source) {
	return source.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, "").replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "").replace(/javascript:/gi, "");
}
var saveMedia_createServerFn_handler = createServerRpc({
	id: "d3b73ef2e969e1c49109094cbb96e3ef10aff02a1f8274b365f2564315191af7",
	name: "saveMedia",
	filename: "src/lib/studio/api.ts"
}, (opts) => saveMedia.__executeServer(opts));
var saveMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => assertMedia(input)).handler(saveMedia_createServerFn_handler, async ({ context, data }) => {
	await claimOrReject(context.userId);
	const sql = await sqlClient();
	const countRows = await sql`select count(*)::int as n from studio_media`;
	if (!(await sql`select id from studio_media where id = ${data.id}`).length && Number(countRows[0]?.n ?? 0) >= LIMITS.maxItems) throw new Error(`La médiathèque est limitée à ${LIMITS.maxItems} fichiers.`);
	await sql.query(`insert into studio_media
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
        composition = excluded.composition`, [
		data.id,
		data.name.slice(0, 180),
		data.kind,
		data.mime,
		data.alt ?? "",
		data.caption ?? "",
		data.folder || "Atelier",
		data.focalX ?? .5,
		data.focalY ?? .5,
		data.zoom ?? 1,
		data.webData,
		data.originalData,
		data.externalUrl,
		data.posterData,
		data.bytes || 0,
		data.width,
		data.height,
		data.composition
	]);
	return { ok: true };
});
var deleteMedia_createServerFn_handler = createServerRpc({
	id: "16de5fbca12e46bdaac7cfa00e30b99d474a962df69ac10b63c5f3a30d190564",
	name: "deleteMedia",
	filename: "src/lib/studio/api.ts"
}, (opts) => deleteMedia.__executeServer(opts));
var deleteMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	if (typeof id !== "string" || !id) throw new Error("Média introuvable.");
	return id;
}).handler(deleteMedia_createServerFn_handler, async ({ context, data }) => {
	await claimOrReject(context.userId);
	await (await sqlClient())`delete from studio_media where id = ${data}`;
	return { ok: true };
});
var postInquiry_createServerFn_handler = createServerRpc({
	id: "36b9d6640cc16735463ebacfe2a67604bf93cce03273e1dd3d4c75d2f5365c37",
	name: "postInquiry",
	filename: "src/lib/studio/api.ts"
}, (opts) => postInquiry.__executeServer(opts));
var postInquiry = createServerFn({ method: "POST" }).validator((input) => {
	const value = input;
	const name = String(value?.name ?? "").trim();
	const email = String(value?.email ?? "").trim();
	const message = String(value?.message ?? "").trim();
	if (name.length < 2 || name.length > 80) throw new Error("Indiquez votre nom.");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) throw new Error("Indiquez une adresse courriel valide.");
	if (message.length < 4 || message.length > 2e3) throw new Error("Le message doit faire entre 4 et 2000 caractères.");
	return {
		name,
		email,
		message
	};
}).handler(postInquiry_createServerFn_handler, async ({ data }) => {
	await (await sqlClient())`insert into studio_inquiries (id, name, email, message) values (${`msg_${Math.random().toString(36).slice(2, 10)}`}, ${data.name}, ${data.email}, ${data.message})`;
	return { ok: true };
});
var deleteInquiry_createServerFn_handler = createServerRpc({
	id: "768caf147a7cf3cf311e0417df021abb1660f86446deee32587ef66c40cfa9c9",
	name: "deleteInquiry",
	filename: "src/lib/studio/api.ts"
}, (opts) => deleteInquiry.__executeServer(opts));
var deleteInquiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	if (typeof id !== "string") throw new Error("Message introuvable.");
	return id;
}).handler(deleteInquiry_createServerFn_handler, async ({ context, data }) => {
	await claimOrReject(context.userId);
	await (await sqlClient())`delete from studio_inquiries where id = ${data}`;
	return { ok: true };
});
var getSelection_createServerFn_handler = createServerRpc({
	id: "546ec7cb30b35327feee0dbf816d7000308c7243dd72725edd162a6e897cec25",
	name: "getSelection",
	filename: "src/lib/studio/api.ts"
}, (opts) => getSelection.__executeServer(opts));
var getSelection = createServerFn({ method: "GET" }).validator((slug) => {
	if (typeof slug !== "string" || !slug) throw new Error("Sélection introuvable.");
	return slug;
}).handler(getSelection_createServerFn_handler, async ({ data: slug }) => {
	const { published } = await readDocs();
	const selection = published.selections.find((item) => item.slug === slug);
	if (!selection || selection.visibility !== "public") return { found: false };
	const projects = published.projects.filter((project) => project.status === "published" && selection.projectIds.includes(project.id));
	const doc = {
		...published,
		projects,
		selections: [selection]
	};
	return {
		found: true,
		selection,
		projects,
		media: await loadMedia(collectMediaIds(doc), false),
		settings: published.settings
	};
});
var getPrivateSelection_createServerFn_handler = createServerRpc({
	id: "d38a153da01bf8528fe2c04c733e15ef9635426a41d1b7ca8b39416ff2f8a888",
	name: "getPrivateSelection",
	filename: "src/lib/studio/api.ts"
}, (opts) => getPrivateSelection.__executeServer(opts));
var getPrivateSelection = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((slug) => {
	if (typeof slug !== "string") throw new Error("Sélection introuvable.");
	return slug;
}).handler(getPrivateSelection_createServerFn_handler, async ({ context, data: slug }) => {
	await claimOrReject(context.userId);
	const { draft } = await readDocs();
	const selection = draft.selections.find((item) => item.slug === slug);
	if (!selection) return { found: false };
	const projects = draft.projects.filter((project) => selection.projectIds.includes(project.id));
	const doc = {
		...draft,
		projects,
		selections: [selection]
	};
	return {
		found: true,
		selection,
		projects,
		media: await loadMedia(collectMediaIds(doc), false),
		settings: draft.settings
	};
});
var exportBackup_createServerFn_handler = createServerRpc({
	id: "36f2c220500716ce1f86fe78280309c9ea1042be06d42753f273e02da9ea7a47",
	name: "exportBackup",
	filename: "src/lib/studio/api.ts"
}, (opts) => exportBackup.__executeServer(opts));
var exportBackup = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(exportBackup_createServerFn_handler, async ({ context }) => {
	await claimOrReject(context.userId);
	const { draft } = await readDocs();
	const media = await loadMedia(null, true);
	return {
		kind: "matt-mez-studio",
		version: 1,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		doc: draft,
		media
	};
});
var importBackup_createServerFn_handler = createServerRpc({
	id: "43753182d639e30332dc0d9d54e15a221d0d90b2688db4f047ca291bd67d5468",
	name: "importBackup",
	filename: "src/lib/studio/api.ts"
}, (opts) => importBackup.__executeServer(opts));
var importBackup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const value = input;
	return {
		doc: assertDoc(value?.doc),
		media: Array.isArray(value.media) ? value.media.slice(0, LIMITS.maxItems) : []
	};
}).handler(importBackup_createServerFn_handler, async ({ context, data }) => {
	await claimOrReject(context.userId);
	const sql = await sqlClient();
	await sql.query(`update studio_doc set draft = $1::jsonb, updated_at = now() where id = 1`, [JSON.stringify(data.doc)]);
	await sql`delete from studio_media`;
	for (const item of data.media) {
		const safe = assertMedia({
			...item,
			originalData: item.originalData ?? null,
			webData: item.webData,
			hasOriginal: void 0
		});
		await sql.query(`insert into studio_media
          (id, name, kind, mime, alt, caption, folder, focal_x, focal_y, zoom, web_data, original_data, external_url, poster_data, bytes, width, height, composition)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`, [
			safe.id,
			safe.name,
			safe.kind,
			safe.mime,
			safe.alt ?? "",
			safe.caption ?? "",
			safe.folder || "Atelier",
			safe.focalX ?? .5,
			safe.focalY ?? .5,
			safe.zoom ?? 1,
			safe.webData,
			safe.originalData,
			safe.externalUrl,
			safe.posterData,
			safe.bytes || 0,
			safe.width,
			safe.height,
			safe.composition
		]);
	}
	return { ok: true };
});
var restoreRevision_createServerFn_handler = createServerRpc({
	id: "f17f2fe3382e7b5ff6f23c10c9fe9105a93dd41bf437af9dfb22163ac632e396",
	name: "restoreRevision",
	filename: "src/lib/studio/api.ts"
}, (opts) => restoreRevision.__executeServer(opts));
var restoreRevision = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	const num = Number(id);
	if (!Number.isFinite(num)) throw new Error("Version introuvable.");
	return num;
}).handler(restoreRevision_createServerFn_handler, async ({ context, data }) => {
	await claimOrReject(context.userId);
	const sql = await sqlClient();
	const rows = await sql`select snapshot from studio_revisions where id = ${data}`;
	if (!rows[0]) throw new Error("Version introuvable.");
	const doc = assertDoc(parseDoc(rows[0].snapshot));
	await sql.query(`update studio_doc set draft = $1::jsonb, updated_at = now() where id = 1`, [JSON.stringify(doc)]);
	return {
		ok: true,
		doc
	};
});
//#endregion
export { deleteInquiry_createServerFn_handler, deleteMedia_createServerFn_handler, exportBackup_createServerFn_handler, getPrivateSelection_createServerFn_handler, getPublished_createServerFn_handler, getSelection_createServerFn_handler, getWorkspace_createServerFn_handler, importBackup_createServerFn_handler, postInquiry_createServerFn_handler, publishSite_createServerFn_handler, restoreRevision_createServerFn_handler, saveDraft_createServerFn_handler, saveMedia_createServerFn_handler };
