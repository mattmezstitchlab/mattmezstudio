import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { C as useRouter, S as useNavigate, Z as require_react, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, w as require_jsx_runtime, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { f as slugify, i as authMiddleware, m as uid, n as DEFAULT_DISCIPLINES, r as LIMITS } from "./tree-D_fzkYKz.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-v56B_2zl.mjs";
import { t as authClient } from "./client-CgU6ljwF.mjs";
import { a as House, i as LayoutGrid, n as TriangleAlert, o as FlaskConical, r as Mail, t as UserRound } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-current-user-CCget89g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DnAEkaLw.js
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var fr = {
	home: "Accueil",
	work: "Projets",
	about: "À propos",
	lab: "Laboratoire",
	contact: "Contact",
	edit: "Éditer le site",
	leave: "Quitter l'édition",
	draft: "Brouillon",
	published: "Publié",
	private: "Privé",
	archived: "Archivé",
	publish: "Publier",
	undo: "Annuler",
	redo: "Rétablir",
	newProject: "Nouveau projet",
	media: "Médiathèque",
	direction: "Direction",
	selections: "Sélections",
	backup: "Sauvegarde",
	messages: "Messages",
	exposition: "Exposition",
	available: "Disponible pour de nouveaux projets",
	demoLine: "Pièce de démonstration — aucun client réel n'est associé. Remplacez ce contenu.",
	ownerOnly: "Accès réservé au propriétaire du studio.",
	saved: "Brouillon enregistré",
	saving: "Enregistrement…",
	unpublished: "Modifications non publiées",
	live: "Visible par les visiteurs",
	write: "Écrire au studio",
	send: "Envoyer",
	sent: "Message reçu. Il reste privé, visible seulement par le propriétaire.",
	emptyWork: "Aucun projet publié pour le moment.",
	philosophy: "Mon site n'est jamais terminé. Il évolue avec moi."
};
var en = {
	home: "Home",
	work: "Work",
	about: "About",
	lab: "Laboratory",
	contact: "Contact",
	edit: "Edit site",
	leave: "Leave editing",
	draft: "Draft",
	published: "Published",
	private: "Private",
	archived: "Archived",
	publish: "Publish",
	undo: "Undo",
	redo: "Redo",
	newProject: "New project",
	media: "Library",
	direction: "Direction",
	selections: "Selections",
	backup: "Backup",
	messages: "Messages",
	exposition: "Exhibition",
	available: "Available for new projects",
	demoLine: "Demonstration piece — no real client is attached. Replace this content.",
	ownerOnly: "Reserved for the studio owner.",
	saved: "Draft saved",
	saving: "Saving…",
	unpublished: "Unpublished changes",
	live: "Visible to visitors",
	write: "Write to the studio",
	send: "Send",
	sent: "Message received. Only the owner can read it.",
	emptyWork: "No published project yet.",
	philosophy: "The site is never finished. It moves with me."
};
function ui(locale) {
	return locale === "en" ? en : fr;
}
var DIRECTIONS = [
	{
		id: "monument",
		label: "MONUMENT",
		blurb: "Typographie monumentale et noir profond.",
		patch: {
			imageRadius: 18,
			columns: 2,
			gap: 12,
			titleScale: 1,
			animations: true,
			navStyle: "pill",
			fontPair: "grotesk",
			view: "editorial"
		}
	},
	{
		id: "editorial",
		label: "EDITORIAL",
		blurb: "Blanc, magazine contemporain, grandes images.",
		patch: {
			imageRadius: 2,
			columns: 2,
			gap: 18,
			titleScale: .92,
			animations: true,
			navStyle: "top",
			fontPair: "editorial",
			view: "editorial"
		}
	},
	{
		id: "gallery",
		label: "GALLERY",
		blurb: "Galerie d'art minimaliste.",
		patch: {
			imageRadius: 0,
			columns: 2,
			gap: 28,
			titleScale: .78,
			animations: false,
			navStyle: "top",
			fontPair: "grotesk",
			view: "list"
		}
	},
	{
		id: "bento",
		label: "BENTO",
		blurb: "Mosaïque moderne et modulaire.",
		patch: {
			imageRadius: 22,
			columns: 3,
			gap: 10,
			titleScale: .86,
			animations: true,
			navStyle: "pill",
			fontPair: "grotesk",
			view: "mosaic"
		}
	},
	{
		id: "cinema",
		label: "CINEMA",
		blurb: "Vidéos et compositions immersives.",
		patch: {
			imageRadius: 8,
			columns: 1,
			gap: 0,
			titleScale: 1.05,
			animations: true,
			navStyle: "pill",
			fontPair: "editorial",
			view: "screen"
		}
	},
	{
		id: "brutal",
		label: "BRUTAL",
		blurb: "Contrastes graphiques, expérimental.",
		patch: {
			imageRadius: 0,
			columns: 2,
			gap: 8,
			titleScale: 1.08,
			animations: false,
			navStyle: "top",
			fontPair: "grotesk",
			view: "editorial"
		}
	}
];
function directionById(id) {
	return DIRECTIONS.find((item) => item.id === id) ?? DIRECTIONS[0];
}
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} o`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} Ko`;
	return `${(bytes / 1048576).toFixed(1)} Mo`;
}
function sanitizeSvg$1(source) {
	return source.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, "").replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "").replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "").replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "").replace(/javascript:/gi, "");
}
function parseEmbed(url) {
	try {
		const parsed = new URL(url);
		const host = parsed.hostname.replace(/^www\./, "");
		if (host === "youtu.be") {
			const id = parsed.pathname.split("/").filter(Boolean)[0];
			return id ? {
				provider: "youtube",
				id
			} : null;
		}
		if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
			const id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
			if (parsed.pathname.startsWith("/embed/") || parsed.pathname.startsWith("/shorts/")) {
				const part = parsed.pathname.split("/").filter(Boolean)[1];
				return part ? {
					provider: "youtube",
					id: part
				} : null;
			}
			return id && id !== "watch" ? {
				provider: "youtube",
				id
			} : null;
		}
		if (host === "vimeo.com" || host === "player.vimeo.com") {
			const id = parsed.pathname.split("/").filter((part) => /^\d+$/.test(part))[0];
			return id ? {
				provider: "vimeo",
				id
			} : null;
		}
		return null;
	} catch {
		return null;
	}
}
function readFile(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Lecture impossible."));
		reader.onload = () => resolve(String(reader.result ?? ""));
		reader.readAsDataURL(file);
	});
}
async function compressImage(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Impossible de préparer l'image.");
	ctx.drawImage(bitmap, 0, 0, width, height);
	const web = canvas.toDataURL("image/jpeg", .82);
	bitmap.close();
	return {
		web,
		width,
		height
	};
}
async function prepareFile(file) {
	const mime = file.type || "application/octet-stream";
	if (mime === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
		if (file.size > LIMITS.image) throw new Error(`SVG trop lourd (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.image)}.`);
		const text = sanitizeSvg$1(await file.text());
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
			keptOriginal: true
		};
	}
	if (mime.startsWith("image/")) {
		if (![
			"image/jpeg",
			"image/png",
			"image/webp"
		].includes(mime)) throw new Error("Formats image acceptés : JPG, PNG, WebP, SVG.");
		if (file.size > LIMITS.image) throw new Error(`Image trop lourde (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.image)}.`);
		const compressed = await compressImage(file);
		const keepOriginal = file.size <= 1887436.8;
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
			note: keepOriginal ? void 0 : "Original trop lourd pour être conservé tel quel. La version web optimisée est gardée, l'original n'est pas détruit sur votre appareil."
		};
	}
	if (mime === "video/mp4" || mime === "video/webm") {
		if (file.size > LIMITS.video) throw new Error(`Vidéo trop lourde (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.video)}.`);
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
			keptOriginal: true
		};
	}
	if (mime.startsWith("audio/")) {
		if (file.size > LIMITS.audio) throw new Error(`Audio trop lourd (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.audio)}.`);
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
			keptOriginal: true
		};
	}
	if (mime === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
		if (file.size > LIMITS.pdf) throw new Error(`PDF trop lourd (${formatBytes(file.size)}). Maximum ${formatBytes(LIMITS.pdf)}.`);
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
			keptOriginal: true
		};
	}
	throw new Error("Fichier refusé. Acceptés : JPG, PNG, WebP, SVG, MP4, WebM, audio, PDF.");
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function assertDoc(input) {
	const doc = input;
	if (!doc || typeof doc !== "object" || !doc.settings || !Array.isArray(doc.projects) || !doc.about) throw new Error("Brouillon illisible.");
	if (!String(doc.settings.name ?? "").trim()) throw new Error("Le nom du studio est requis.");
	if (JSON.stringify(doc).length > LIMITS.docChars) throw new Error("Le brouillon dépasse la taille maximale. Les médias se rangent dans la médiathèque.");
	return doc;
}
var getPublished = createServerFn({ method: "GET" }).handler(createSsrRpc("6c7160d2e42b3ea440ff22512ef01acc7a5a06b68dced6487a2e6a022a9881a1"));
var getWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3125930a2de4b5ad8a9996d8952c58cd54d9c649f9619789618977caa47c8a30"));
var saveDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => assertDoc(input)).handler(createSsrRpc("b4c7ef95999dc0c8213600fd839f589cf0796146353fad39656ce9a295ce4266"));
var publishSite = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("317897febb63e42c50264bbffc1e29c98faa7e09e5eb06d7049bd5a7f3252682"));
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
var saveMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => assertMedia(input)).handler(createSsrRpc("d3b73ef2e969e1c49109094cbb96e3ef10aff02a1f8274b365f2564315191af7"));
var deleteMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	if (typeof id !== "string" || !id) throw new Error("Média introuvable.");
	return id;
}).handler(createSsrRpc("16de5fbca12e46bdaac7cfa00e30b99d474a962df69ac10b63c5f3a30d190564"));
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
}).handler(createSsrRpc("36b9d6640cc16735463ebacfe2a67604bf93cce03273e1dd3d4c75d2f5365c37"));
var deleteInquiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	if (typeof id !== "string") throw new Error("Message introuvable.");
	return id;
}).handler(createSsrRpc("768caf147a7cf3cf311e0417df021abb1660f86446deee32587ef66c40cfa9c9"));
var getSelection = createServerFn({ method: "GET" }).validator((slug) => {
	if (typeof slug !== "string" || !slug) throw new Error("Sélection introuvable.");
	return slug;
}).handler(createSsrRpc("546ec7cb30b35327feee0dbf816d7000308c7243dd72725edd162a6e897cec25"));
var getPrivateSelection = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((slug) => {
	if (typeof slug !== "string") throw new Error("Sélection introuvable.");
	return slug;
}).handler(createSsrRpc("d38a153da01bf8528fe2c04c733e15ef9635426a41d1b7ca8b39416ff2f8a888"));
var exportBackup = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("36f2c220500716ce1f86fe78280309c9ea1042be06d42753f273e02da9ea7a47"));
var importBackup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const value = input;
	return {
		doc: assertDoc(value?.doc),
		media: Array.isArray(value.media) ? value.media.slice(0, LIMITS.maxItems) : []
	};
}).handler(createSsrRpc("43753182d639e30332dc0d9d54e15a221d0d90b2688db4f047ca291bd67d5468"));
var restoreRevision = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	const num = Number(id);
	if (!Number.isFinite(num)) throw new Error("Version introuvable.");
	return num;
}).handler(createSsrRpc("f17f2fe3382e7b5ff6f23c10c9fe9105a93dd41bf437af9dfb22163ac632e396"));
var StudioContext = (0, import_react.createContext)(null);
function indexMedia(items) {
	return Object.fromEntries(items.map((item) => [item.id, item]));
}
function emptyProject(sort) {
	const id = uid("p");
	return {
		id,
		slug: `projet-${id.slice(-4)}`,
		title: "Sans titre",
		titleEn: "",
		subtitle: "",
		subtitleEn: "",
		summary: "",
		summaryEn: "",
		year: "",
		client: "",
		disciplines: [],
		role: "",
		collaborators: "",
		context: "",
		process: "",
		result: "",
		externalUrl: "",
		status: "draft",
		featured: true,
		placement: "work",
		sort,
		demo: false,
		label: "Sans titre",
		tags: [],
		meta: "",
		coverIds: [],
		galleryIds: [],
		blocks: [],
		labHref: ""
	};
}
function StudioProvider({ initial, children }) {
	const router = useRouter();
	const { user, isPending } = useCurrentUserState();
	const [published, setPublished] = (0, import_react.useState)(initial.doc);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [media, setMedia] = (0, import_react.useState)(() => indexMedia(initial.media));
	const [isOwner, setIsOwner] = (0, import_react.useState)(false);
	const [authChecked, setAuthChecked] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [locale, setLocaleState] = (0, import_react.useState)("fr");
	const [saveState, setSaveState] = (0, import_react.useState)("idle");
	const [saveError, setSaveError] = (0, import_react.useState)(null);
	const [device, setDevice] = (0, import_react.useState)("desktop");
	const [panel, setPanel] = (0, import_react.useState)(null);
	const [activeProjectId, setActiveProjectId] = (0, import_react.useState)(null);
	const [selectedBlockId, setSelectedBlockId] = (0, import_react.useState)(null);
	const [epoch, setEpoch] = (0, import_react.useState)(0);
	const [histTick, setHistTick] = (0, import_react.useState)(0);
	const [inquiries, setInquiries] = (0, import_react.useState)([]);
	const [revisions, setRevisions] = (0, import_react.useState)([]);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [updatedAt, setUpdatedAt] = (0, import_react.useState)(initial.updatedAt);
	const past = (0, import_react.useRef)([]);
	const future = (0, import_react.useRef)([]);
	const dirty = (0, import_react.useRef)(false);
	const userId = user?.id;
	(0, import_react.useEffect)(() => {
		const stored = window.localStorage.getItem("mm-locale");
		if (stored === "en" || stored === "fr") setLocaleState(stored);
	}, []);
	const setLocale = (0, import_react.useCallback)((next) => {
		setLocaleState(next);
		window.localStorage.setItem("mm-locale", next);
	}, []);
	(0, import_react.useEffect)(() => {
		if (editing) return;
		setPublished(initial.doc);
		setMedia((current) => ({
			...indexMedia(initial.media),
			...current
		}));
		setUpdatedAt(initial.updatedAt);
	}, [initial, editing]);
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		if (!userId) {
			setIsOwner(false);
			setAuthChecked(true);
			return;
		}
		let cancelled = false;
		getWorkspace().then((workspace) => {
			if (cancelled) return;
			if (!workspace.isOwner) setIsOwner(false);
			else {
				setIsOwner(true);
				setDraft(workspace.draft);
				setPublished(workspace.published);
				setMedia(indexMedia(workspace.media));
				setInquiries(workspace.inquiries);
				setRevisions(workspace.revisions);
				setUpdatedAt(workspace.updatedAt);
			}
			setAuthChecked(true);
		}).catch(() => {
			if (!cancelled) {
				setIsOwner(false);
				setAuthChecked(true);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [isPending, userId]);
	(0, import_react.useEffect)(() => {
		if (!dirty.current || !draft || !isOwner) return;
		const snapshot = draft;
		const timer = window.setTimeout(() => {
			dirty.current = false;
			saveDraft({ data: snapshot }).then(() => {
				setSaveState("saved");
				setSaveError(null);
			}).catch((error) => {
				dirty.current = true;
				setSaveState("error");
				setSaveError(error instanceof Error ? error.message : "Enregistrement impossible.");
			});
		}, 700);
		return () => window.clearTimeout(timer);
	}, [draft, isOwner]);
	const updateDraft = (0, import_react.useCallback)((recipe) => {
		setDraft((current) => {
			if (!current) return current;
			past.current.push(structuredClone(current));
			if (past.current.length > 40) past.current.shift();
			future.current = [];
			const next = structuredClone(current);
			recipe(next);
			dirty.current = true;
			return next;
		});
		setSaveState("saving");
		setHistTick((value) => value + 1);
	}, []);
	const undo = (0, import_react.useCallback)(() => {
		setDraft((current) => {
			const prev = past.current.pop();
			if (!current || !prev) return current;
			future.current.push(structuredClone(current));
			dirty.current = true;
			return prev;
		});
		setEpoch((value) => value + 1);
		setHistTick((value) => value + 1);
		setSaveState("saving");
	}, []);
	const redo = (0, import_react.useCallback)(() => {
		setDraft((current) => {
			const next = future.current.pop();
			if (!current || !next) return current;
			past.current.push(structuredClone(current));
			dirty.current = true;
			return next;
		});
		setEpoch((value) => value + 1);
		setHistTick((value) => value + 1);
		setSaveState("saving");
	}, []);
	const upsertMedia = (0, import_react.useCallback)(async (item) => {
		await saveMedia({ data: {
			id: item.id,
			name: item.name,
			kind: item.kind,
			mime: item.mime,
			alt: item.alt,
			caption: item.caption,
			folder: item.folder,
			focalX: item.focalX,
			focalY: item.focalY,
			zoom: item.zoom,
			webData: item.webData,
			originalData: item.originalData ?? null,
			externalUrl: item.externalUrl,
			posterData: item.posterData,
			bytes: item.bytes,
			width: item.width,
			height: item.height,
			composition: item.composition
		} });
		setMedia((current) => ({
			...current,
			[item.id]: {
				...item,
				hasOriginal: Boolean(item.originalData) || item.hasOriginal
			}
		}));
	}, []);
	const removeMediaItem = (0, import_react.useCallback)(async (id) => {
		await deleteMedia({ data: id });
		setMedia((current) => {
			const next = { ...current };
			delete next[id];
			return next;
		});
	}, []);
	const publish = (0, import_react.useCallback)(async () => {
		await publishSite();
		if (draft) setPublished(structuredClone(draft));
		setSaveState("saved");
		dirty.current = false;
		await router.invalidate();
		setNotice("Publié. Les visiteurs voient cette version.");
	}, [draft, router]);
	const removeInquiryItem = (0, import_react.useCallback)(async (id) => {
		await deleteInquiry({ data: id });
		setInquiries((current) => current.filter((item) => item.id !== id));
	}, []);
	const restore = (0, import_react.useCallback)(async (id) => {
		const result = await restoreRevision({ data: id });
		setDraft(result.doc);
		past.current = [];
		future.current = [];
		dirty.current = false;
		setEpoch((value) => value + 1);
		setNotice("Version restaurée dans le brouillon. Publiez pour la rendre visible.");
	}, []);
	const downloadBackup = (0, import_react.useCallback)(async () => {
		const payload = await exportBackup();
		const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "matt-mez-studio.json";
		link.click();
		URL.revokeObjectURL(url);
	}, []);
	const loadBackup = (0, import_react.useCallback)(async (payload) => {
		const result = payload;
		await importBackup({ data: {
			doc: result.doc,
			media: result.media ?? []
		} });
		if (result.doc) setDraft(result.doc);
		if (result.media) setMedia(indexMedia(result.media));
		setEpoch((value) => value + 1);
		dirty.current = false;
		setNotice("Sauvegarde importée dans le brouillon. Publiez pour la montrer aux visiteurs.");
	}, []);
	const createProject = (0, import_react.useCallback)(() => {
		const project = emptyProject(0);
		updateDraft((doc) => {
			doc.projects.forEach((item) => {
				item.sort += 1;
			});
			doc.projects.unshift(project);
		});
		setActiveProjectId(project.id);
		setPanel("project");
		setEditing(true);
		return project.slug;
	}, [updateDraft]);
	const doc = editing && draft ? draft : published;
	const value = (0, import_react.useMemo)(() => ({
		ready: true,
		authChecked,
		isOwner,
		editing: editing && isOwner,
		setEditing: (next) => {
			if (!isOwner) return;
			setEditing(next);
			if (!next) setPanel(null);
		},
		locale,
		setLocale,
		doc,
		media,
		dirty: saveState === "saving" || updatedAt !== initial.updatedAt,
		saveState,
		saveError,
		device,
		setDevice,
		panel,
		setPanel,
		activeProjectId,
		setActiveProjectId,
		selectedBlockId,
		setSelectedBlockId,
		epoch,
		canUndo: past.current.length > 0 || histTick < 0,
		canRedo: future.current.length > 0 || histTick < 0,
		undo,
		redo,
		updateDraft,
		upsertMedia,
		removeMedia: removeMediaItem,
		publish,
		inquiries,
		setInquiries,
		removeInquiry: removeInquiryItem,
		revisions,
		restore,
		downloadBackup,
		loadBackup,
		createProject,
		notice,
		setNotice
	}), [
		authChecked,
		isOwner,
		editing,
		locale,
		setLocale,
		doc,
		media,
		saveState,
		updatedAt,
		initial.updatedAt,
		saveError,
		device,
		panel,
		activeProjectId,
		selectedBlockId,
		epoch,
		histTick,
		undo,
		redo,
		updateDraft,
		upsertMedia,
		removeMediaItem,
		publish,
		inquiries,
		removeInquiryItem,
		revisions,
		restore,
		downloadBackup,
		loadBackup,
		createProject,
		notice
	]);
	value.canUndo = past.current.length > 0;
	value.canRedo = future.current.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioContext.Provider, {
		value,
		children
	});
}
function useStudio() {
	const value = (0, import_react.useContext)(StudioContext);
	if (!value) throw new Error("Studio manquant");
	return value;
}
function Composition({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		className: "scene-photo",
		src: name === "typewall" ? "/demo/yellow.jpg" : name === "waves" ? "/demo/gallery.jpg" : "/demo/devices.jpg",
		alt: "",
		style: { objectPosition: name === "waves" ? "center 62%" : name === "typewall" ? "center 45%" : "center center" }
	});
}
function mediaStyle(item) {
	return {
		objectPosition: `${item.focalX * 100}% ${item.focalY * 100}%`,
		transform: item.zoom > 1.01 ? `scale(${item.zoom})` : void 0
	};
}
function MediaFrame({ id, alt, className = "", rounded = true }) {
	const { media } = useStudio();
	const item = media[id];
	const radius = rounded ? void 0 : { borderRadius: 0 };
	if (!item) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `media-missing ${className}`,
		style: radius
	});
	if (item.composition || item.kind === "composition") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `media-frame ${className}`,
		style: radius,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composition, { name: item.composition })
	});
	const src = item.webData || item.externalUrl || "";
	if (item.kind === "video") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `media-frame ${className}`,
		style: radius,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			src,
			poster: item.posterData ?? void 0,
			controls: true,
			playsInline: true,
			preload: "metadata",
			"aria-label": alt || item.alt || item.name
		})
	});
	if (!src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `media-missing ${className}`,
		style: radius
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `media-frame ${className}`,
		style: radius,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: alt ?? item.alt ?? "",
			style: mediaStyle(item)
		})
	});
}
function Editable({ value, onChange, className, as: Tag = "span" }) {
	const { editing, epoch } = useStudio();
	if (!editing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		className,
		children: value
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		className,
		contentEditable: true,
		suppressContentEditableWarning: true,
		"data-editable": "true",
		role: "textbox",
		"aria-label": "Texte modifiable",
		onBlur: (event) => onChange(event.currentTarget.textContent ?? ""),
		children: value
	}, `${epoch}-${value.length}`);
}
function EditorSheet() {
	const studio = useStudio();
	if (!studio.editing || !studio.panel) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "sheet",
		"aria-label": "Édition",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-head tool",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel(null),
						children: "Fermer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("project"),
						children: "Projet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("media"),
						children: "Médias"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("direction"),
						children: "Direction"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("selections"),
						children: "Sélections"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("about"),
						children: "À propos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("messages"),
						children: "Messages"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("backup"),
						children: "Sauvegarde"
					})
				]
			}),
			studio.panel === "project" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectPanel, {}) : null,
			studio.panel === "media" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPanel, {}) : null,
			studio.panel === "direction" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectionPanel, {}) : null,
			studio.panel === "selections" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectionPanel, {}) : null,
			studio.panel === "about" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutPanel, {}) : null,
			studio.panel === "messages" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagePanel, {}) : null,
			studio.panel === "backup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackupPanel, {}) : null
		]
	});
}
function ProjectPanel() {
	const { doc, updateDraft, activeProjectId, setActiveProjectId, media, upsertMedia, selectedBlockId } = useStudio();
	const project = doc.projects.find((item) => item.id === activeProjectId) ?? doc.projects[0];
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Aucun projet." });
	const set = (recipe) => {
		updateDraft((draft) => {
			const found = draft.projects.find((item) => item.id === project.id);
			if (found) recipe(found);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Projet" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Choisir", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value: project.id,
			onChange: (event) => setActiveProjectId(event.target.value),
			children: doc.projects.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: item.id,
				children: item.title
			}, item.id))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Titre",
			value: project.title,
			onChange: (value) => set((item) => {
				item.title = value;
				item.label = item.label === "Sans titre" || !item.label ? value : item.label;
				item.slug = slugify(value) || item.slug;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Titre anglais",
			value: project.titleEn,
			onChange: (value) => set((item) => {
				item.titleEn = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Sous-titre",
			value: project.subtitle,
			onChange: (value) => set((item) => {
				item.subtitle = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Résumé",
			value: project.summary,
			area: true,
			onChange: (value) => set((item) => {
				item.summary = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Texte long",
			value: project.context,
			area: true,
			onChange: (value) => set((item) => {
				item.context = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Année",
			value: project.year,
			onChange: (value) => set((item) => {
				item.year = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Client (vide = masqué)",
			value: project.client,
			onChange: (value) => set((item) => {
				item.client = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Rôle",
			value: project.role,
			onChange: (value) => set((item) => {
				item.role = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Collaborateurs",
			value: project.collaborators,
			onChange: (value) => set((item) => {
				item.collaborators = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Disciplines, séparées par une virgule",
			value: project.disciplines.join(", "),
			onChange: (value) => set((item) => {
				item.disciplines = value.split(",").map((part) => part.trim()).filter(Boolean);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Processus",
			value: project.process,
			area: true,
			onChange: (value) => set((item) => {
				item.process = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Résultat",
			value: project.result,
			area: true,
			onChange: (value) => set((item) => {
				item.result = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Lien externe",
			value: project.externalUrl,
			onChange: (value) => set((item) => {
				item.externalUrl = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Légende gauche",
			value: project.label,
			onChange: (value) => set((item) => {
				item.label = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Légende droite",
			value: project.meta,
			onChange: (value) => set((item) => {
				item.meta = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Outil du lab (adresse interne)",
			value: project.labHref,
			onChange: (value) => set((item) => {
				item.labHref = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Statut", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: project.status,
			onChange: (event) => set((item) => {
				item.status = event.target.value;
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "draft",
					children: "Brouillon"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "published",
					children: "Publié"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "private",
					children: "Privé"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "archived",
					children: "Archivé"
				})
			]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Emplacement", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: project.placement,
			onChange: (event) => set((item) => {
				item.placement = event.target.value;
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "work",
					children: "Projets"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "lab",
					children: "Laboratoire"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "both",
					children: "Les deux"
				})
			]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked: project.featured,
			onChange: (event) => set((item) => {
				item.featured = event.target.checked;
			})
		}), " En avant sur l'accueil"] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked: project.demo,
			onChange: (event) => set((item) => {
				item.demo = event.target.checked;
			})
		}), " Marquer comme démonstration"] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Couvertures"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
			selected: project.coverIds,
			onToggle: (id) => set((item) => {
				item.coverIds = item.coverIds.includes(id) ? item.coverIds.filter((value) => value !== id) : [...item.coverIds, id].slice(0, 4);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Le bloc sélectionné peut recevoir un média :"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
			selected: [],
			onToggle: (id) => {
				if (!selectedBlockId) return;
				updateDraft((draft) => {
					const block = draft.projects.find((item) => item.id === project.id)?.blocks.find((item) => item.id === selectedBlockId);
					if (!block) return;
					if (block.type === "image" || block.type === "video" || block.type === "audio" || block.type === "document" || block.type === "full") block.mediaId = id;
					if (block.type === "gallery" || block.type === "carousel" || block.type === "mosaic") block.mediaIds = block.mediaIds.includes(id) ? block.mediaIds : [...block.mediaIds, id];
					if (block.type === "compare") {
						if (!block.beforeId) block.beforeId = id;
						else block.afterId = id;
					}
				});
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "quiet on",
			onClick: () => {
				const copy = structuredClone(project);
				copy.id = uid("p");
				copy.slug = `${project.slug}-copie`;
				copy.title = `${project.title} copie`;
				copy.status = "draft";
				updateDraft((draft) => {
					draft.projects.splice(draft.projects.findIndex((item) => item.id === project.id) + 1, 0, copy);
				});
			},
			children: "Dupliquer"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => {
				if (!window.confirm("Supprimer ce projet du brouillon ?")) return;
				updateDraft((draft) => {
					draft.projects = draft.projects.filter((item) => item.id !== project.id);
				});
				setActiveProjectId(null);
			},
			children: "Supprimer"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "note",
			children: [
				Object.keys(media).length,
				" médias. Import max images ",
				formatBytes(LIMITS.image),
				", vidéo ",
				formatBytes(LIMITS.video),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { onReady: (item) => void upsertMedia(item) })
	] });
}
function Field({ label, value, onChange, area = false }) {
	const { epoch } = useStudio();
	const props = {
		key: `${label}-${epoch}`,
		defaultValue: value,
		onBlur: (event) => onChange(event.target.value)
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [label, area ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { ...props }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ...props })] });
}
function MediaPicker({ selected, onToggle }) {
	const { media } = useStudio();
	const items = Object.values(media);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "media-grid",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onToggle(item.id),
			"aria-pressed": selected.includes(item.id),
			children: [item.kind === "image" || item.kind === "composition" || item.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
				id: item.id,
				alt: ""
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.name })]
		}, item.id))
	});
}
function Upload({ onReady }) {
	const [error, setError] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const take = async (files) => {
		setError("");
		for (const file of Array.from(files)) try {
			const prepared = await prepareFile(file);
			if (prepared.note) setNote(prepared.note);
			onReady({
				id: uid("m"),
				name: prepared.name,
				kind: prepared.kind,
				mime: prepared.mime,
				alt: prepared.name,
				caption: "",
				folder: "Atelier",
				focalX: .5,
				focalY: .5,
				zoom: 1,
				webData: prepared.webData,
				externalUrl: prepared.externalUrl,
				posterData: null,
				bytes: prepared.bytes,
				width: prepared.width,
				height: prepared.height,
				composition: null,
				hasOriginal: prepared.keptOriginal,
				originalData: prepared.originalData
			});
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Import impossible.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "drop",
		onDragOver: (event) => event.preventDefault(),
		onDrop: (event) => {
			event.preventDefault();
			take(event.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Déposez des fichiers, ou importez depuis l'appareil." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Importer des médias",
				type: "file",
				accept: "image/jpeg,image/png,image/webp,image/svg+xml,video/mp4,video/webm,audio/*,application/pdf",
				multiple: true,
				onChange: (event) => {
					if (event.target.files) take(event.target.files);
					event.target.value = "";
				}
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "note",
				children: note
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "warn",
				children: error
			}) : null
		]
	});
}
function MediaPanel() {
	const { media, upsertMedia, removeMedia, updateDraft } = useStudio();
	const [query, setQuery] = (0, import_react.useState)("");
	const [folder, setFolder] = (0, import_react.useState)("Tous");
	const [url, setUrl] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [active, setActive] = (0, import_react.useState)(null);
	const folders = (0, import_react.useMemo)(() => ["Tous", ...new Set(Object.values(media).map((item) => item.folder || "Atelier"))], [media]);
	const items = Object.values(media).filter((item) => {
		const hay = `${item.name} ${item.alt} ${item.caption}`.toLowerCase();
		return (folder === "Tous" || item.folder === folder) && hay.includes(query.toLowerCase());
	});
	const current = active ? media[active] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Médiathèque" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "note",
			children: [
				"Les originaux d'image légers sont conservés. Au-delà de 1,8 Mo, seule la version web optimisée est stockée. Vidéo ",
				formatBytes(LIMITS.video),
				" max. ",
				LIMITS.maxItems,
				" fichiers."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { onReady: (item) => void upsertMedia(item).catch((reason) => setError(reason instanceof Error ? reason.message : "Import impossible.")) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Recherche", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: query,
			onChange: (event) => setQuery(event.target.value)
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Dossier", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value: folder,
			onChange: (event) => setFolder(event.target.value),
			children: folders.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (event) => {
				event.preventDefault();
				const embed = parseEmbed(url);
				if (!url.startsWith("http")) {
					setError("L'adresse doit commencer par https://");
					return;
				}
				upsertMedia({
					id: uid("m"),
					name: embed ? `${embed.provider} ${embed.id}` : url,
					kind: embed ? "embed" : "image",
					mime: embed ? "text/html" : "text/uri-list",
					alt: "",
					caption: "",
					folder: "Liens",
					focalX: .5,
					focalY: .5,
					zoom: 1,
					webData: embed?.provider === "youtube" ? `https://i.ytimg.com/vi/${embed.id}/hqdefault.jpg` : null,
					externalUrl: url,
					posterData: embed?.provider === "youtube" ? `https://i.ytimg.com/vi/${embed.id}/hqdefault.jpg` : null,
					bytes: 0,
					width: null,
					height: null,
					composition: null,
					hasOriginal: false
				}).catch((reason) => setError(reason instanceof Error ? reason.message : "Import impossible."));
				setUrl("");
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Importer par URL, YouTube ou Vimeo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: url,
				onChange: (event) => setUrl(event.target.value),
				placeholder: "https://"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				children: "Ajouter le lien"
			})]
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "warn",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "media-grid",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setActive(item.id),
				children: [item.kind === "image" || item.kind === "composition" || item.webData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
					id: item.id,
					alt: item.alt
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.name })]
			}, item.id))
		}),
		current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: current.name }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nom",
				value: current.name,
				onChange: (value) => void upsertMedia({
					...current,
					name: value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Texte alternatif",
				value: current.alt,
				onChange: (value) => void upsertMedia({
					...current,
					alt: value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Légende",
				value: current.caption,
				onChange: (value) => void upsertMedia({
					...current,
					caption: value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Dossier",
				value: current.folder,
				onChange: (value) => void upsertMedia({
					...current,
					folder: value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "note",
				children: "Point focal : cliquez l'image. Recadrage : zoom."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: (event) => {
					const rect = event.currentTarget.getBoundingClientRect();
					const focalX = (event.clientX - rect.left) / rect.width;
					const focalY = (event.clientY - rect.top) / rect.height;
					upsertMedia({
						...current,
						focalX,
						focalY
					});
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
					id: current.id,
					alt: current.alt
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
				"Zoom ",
				current.zoom.toFixed(2),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 1,
					max: 2.4,
					step: .01,
					value: current.zoom,
					onChange: (event) => void upsertMedia({
						...current,
						zoom: Number(event.target.value)
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					if (!window.confirm("Retirer ce média de la médiathèque ? Les projets qui l'utilisent perdront l'image.")) return;
					removeMedia(current.id);
					setActive(null);
				},
				children: "Supprimer le média"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => updateDraft((draft) => {
					const project = draft.projects[0];
					if (project && !project.coverIds.includes(current.id)) project.coverIds.push(current.id);
				}),
				children: "Ajouter à la couverture du premier projet"
			})
		] }) : null
	] });
}
function DirectionPanel() {
	const { doc, updateDraft } = useStudio();
	const settings = doc.settings;
	const setColor = (key, value) => {
		updateDraft((draft) => {
			const colors = draft.settings.colors ?? {
				bg: "#090909",
				fg: "#f4f4f2",
				accent: "#f4f4f2"
			};
			colors[key] = value;
			draft.settings.colors = colors;
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Direction artistique" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Changer de direction ne supprime ni les projets ni les médias."
		}),
		DIRECTIONS.map((direction) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: settings.direction === direction.id ? "pill-on" : "",
			onClick: () => updateDraft((draft) => {
				draft.settings.direction = direction.id;
				Object.assign(draft.settings, direction.patch);
				draft.settings.colors = null;
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: direction.label }),
				" — ",
				direction.blurb
			]
		}, direction.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Nom",
			value: settings.name,
			onChange: (value) => updateDraft((draft) => {
				draft.settings.name = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Signature",
			value: settings.signature,
			onChange: (value) => updateDraft((draft) => {
				draft.settings.signature = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Phrase",
			value: settings.tagline,
			area: true,
			onChange: (value) => updateDraft((draft) => {
				draft.settings.tagline = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Fond ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "color",
			value: settings.colors?.bg ?? "#090909",
			onChange: (event) => setColor("bg", event.target.value)
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Texte ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "color",
			value: settings.colors?.fg ?? "#f4f4f2",
			onChange: (event) => setColor("fg", event.target.value)
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Accent ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "color",
			value: settings.colors?.accent ?? "#f4f4f2",
			onChange: (event) => setColor("accent", event.target.value)
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Typographie", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: settings.fontPair,
			onChange: (event) => updateDraft((draft) => {
				draft.settings.fontPair = event.target.value;
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "grotesk",
				children: "Grotesque"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "editorial",
				children: "Éditoriale"
			})]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
			"Taille des titres ",
			settings.titleScale.toFixed(2),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min: .7,
				max: 1.3,
				step: .02,
				value: settings.titleScale,
				onChange: (event) => updateDraft((draft) => {
					draft.settings.titleScale = Number(event.target.value);
				})
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
			"Espacement ",
			settings.gap,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min: 0,
				max: 40,
				value: settings.gap,
				onChange: (event) => updateDraft((draft) => {
					draft.settings.gap = Number(event.target.value);
				})
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Colonnes", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: settings.columns,
			onChange: (event) => updateDraft((draft) => {
				draft.settings.columns = Number(event.target.value);
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: 1,
					children: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: 2,
					children: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: 3,
					children: "3"
				})
			]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
			"Arrondi des images ",
			settings.imageRadius,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min: 0,
				max: 32,
				value: settings.imageRadius,
				onChange: (event) => updateDraft((draft) => {
					draft.settings.imageRadius = Number(event.target.value);
				})
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked: settings.animations,
			onChange: (event) => updateDraft((draft) => {
				draft.settings.animations = event.target.checked;
			})
		}), " Animations"] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Navigation", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: settings.navStyle,
			onChange: (event) => updateDraft((draft) => {
				draft.settings.navStyle = event.target.value;
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "pill",
				children: "Barre flottante"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "top",
				children: "Liens en haut"
			})]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Disciplines, une par ligne",
			area: true,
			value: settings.disciplines.join("\n"),
			onChange: (value) => updateDraft((draft) => {
				draft.settings.disciplines = value.split("\n").map((item) => item.trim()).filter(Boolean);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => updateDraft((draft) => {
				draft.settings.disciplines = DEFAULT_DISCIPLINES;
			}),
			children: "Rétablir la liste proposée"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Introduction du laboratoire",
			area: true,
			value: settings.labIntro,
			onChange: (value) => updateDraft((draft) => {
				draft.settings.labIntro = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Philosophie",
			value: settings.philosophy,
			onChange: (value) => updateDraft((draft) => {
				draft.settings.philosophy = value;
			})
		})
	] });
}
function SelectionPanel() {
	const { doc, updateDraft } = useStudio();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Sélections" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Une sélection pointe vers les projets. Les fichiers ne sont pas copiés. Une sélection privée n'est lisible que par le propriétaire, côté serveur."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => updateDraft((draft) => {
				const id = uid("sel");
				draft.selections.push({
					id,
					slug: `selection-${id.slice(-4)}`,
					title: "Nouvelle sélection",
					intro: "",
					coverId: null,
					visibility: "public",
					projectIds: []
				});
			}),
			children: "Nouvelle sélection"
		}),
		doc.selections.map((selection) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Titre",
				value: selection.title,
				onChange: (value) => updateDraft((draft) => {
					const found = draft.selections.find((item) => item.id === selection.id);
					if (!found) return;
					found.title = value;
					found.slug = slugify(value);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Présentation",
				area: true,
				value: selection.intro,
				onChange: (value) => updateDraft((draft) => {
					const found = draft.selections.find((item) => item.id === selection.id);
					if (found) found.intro = value;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Visibilité", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: selection.visibility,
				onChange: (event) => updateDraft((draft) => {
					const found = draft.selections.find((item) => item.id === selection.id);
					if (found) found.visibility = event.target.value;
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "public",
					children: "Publique"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "private",
					children: "Privée"
				})]
			})] }),
			doc.projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: selection.projectIds.includes(project.id),
					onChange: (event) => updateDraft((draft) => {
						const found = draft.selections.find((item) => item.id === selection.id);
						if (!found) return;
						found.projectIds = event.target.checked ? [...found.projectIds, project.id] : found.projectIds.filter((id) => id !== project.id);
					})
				}),
				" ",
				project.title
			] }, project.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => void navigate({
					to: "/selection/$slug",
					params: { slug: selection.slug }
				}),
				children: ["Ouvrir /", selection.slug]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => updateDraft((draft) => {
					draft.selections = draft.selections.filter((item) => item.id !== selection.id);
				}),
				children: "Supprimer"
			})
		] }, selection.id))
	] });
}
function AboutPanel() {
	const { doc, updateDraft, media } = useStudio();
	const about = doc.about;
	const set = (recipe) => updateDraft((draft) => recipe(draft.about));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "À propos" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Les champs vides restent invisibles. N'inventez pas une biographie : écrivez la vôtre."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Portrait", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: about.portraitId ?? "",
			onChange: (event) => set((item) => {
				item.portraitId = event.target.value || null;
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				children: "Aucun"
			}), Object.values(media).filter((item) => item.kind === "image" || item.kind === "composition").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: item.id,
				children: item.name
			}, item.id))]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Phrase",
			area: true,
			value: about.statement,
			onChange: (value) => set((item) => {
				item.statement = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Biographie",
			area: true,
			value: about.bio,
			onChange: (value) => set((item) => {
				item.bio = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Parcours",
			area: true,
			value: about.path,
			onChange: (value) => set((item) => {
				item.path = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Vision",
			area: true,
			value: about.vision,
			onChange: (value) => set((item) => {
				item.vision = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Ville",
			value: about.city,
			onChange: (value) => set((item) => {
				item.city = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Courriel public",
			value: about.email,
			onChange: (value) => set((item) => {
				item.email = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Téléphone",
			value: about.phone,
			onChange: (value) => set((item) => {
				item.phone = value;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["CV", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: about.cvId ?? "",
			onChange: (event) => set((item) => {
				item.cvId = event.target.value || null;
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				children: "Aucun"
			}), Object.values(media).filter((item) => item.kind === "pdf").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: item.id,
				children: item.name
			}, item.id))]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => set((item) => {
				item.experiences.push({
					id: uid("ex"),
					period: "",
					title: "Expérience",
					detail: ""
				});
			}),
			children: "Ajouter une expérience"
		}),
		about.experiences.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Titre",
				value: item.title,
				onChange: (value) => set((about) => {
					const found = about.experiences.find((entry) => entry.id === item.id);
					if (found) found.title = value;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Période",
				value: item.period,
				onChange: (value) => set((about) => {
					const found = about.experiences.find((entry) => entry.id === item.id);
					if (found) found.period = value;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Détail",
				value: item.detail,
				onChange: (value) => set((about) => {
					const found = about.experiences.find((entry) => entry.id === item.id);
					if (found) found.detail = value;
				})
			})
		] }, item.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => set((item) => {
				item.socials.push({
					id: uid("so"),
					label: "Lien",
					href: "https://"
				});
			}),
			children: "Ajouter un réseau"
		}),
		about.socials.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Nom",
			value: item.label,
			onChange: (value) => set((about) => {
				const found = about.socials.find((entry) => entry.id === item.id);
				if (found) found.label = value;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Adresse",
			value: item.href,
			onChange: (value) => set((about) => {
				const found = about.socials.find((entry) => entry.id === item.id);
				if (found) found.href = value;
			})
		})] }, item.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => set((item) => {
				item.collaborations.push({
					id: uid("co"),
					name: "",
					detail: ""
				});
			}),
			children: "Ajouter une collaboration"
		})
	] });
}
function MessagePanel() {
	const { inquiries, removeInquiry } = useStudio();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Messages" }),
		inquiries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Aucun message."
		}) : null,
		inquiries.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.name }),
				" · ",
				item.email
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "prose",
				children: item.message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void removeInquiry(item.id),
				children: "Supprimer"
			})
		] }, item.id))
	] });
}
function BackupPanel() {
	const { downloadBackup, loadBackup, revisions, restore, publish } = useStudio();
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Sauvegarde" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "L'export contient les projets et les médias, y compris les originaux conservés. L'import remplace le brouillon, pas encore le site public."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => void downloadBackup(),
			children: "Exporter"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Importer une sauvegarde", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			accept: "application/json",
			onChange: async (event) => {
				const file = event.target.files?.[0];
				if (!file) return;
				try {
					const payload = JSON.parse(await file.text());
					setConfirm(payload);
				} catch {
					setError("Fichier illisible.");
				}
			}
		})] }),
		confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Remplacer le brouillon par cette sauvegarde ?",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					loadBackup(confirm).catch((reason) => setError(reason instanceof Error ? reason.message : "Import impossible."));
					setConfirm(null);
				},
				children: "Confirmer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setConfirm(null),
				children: "Annuler"
			})
		] }) : null,
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "warn",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Versions publiées" }),
		revisions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Chaque publication crée une version."
		}) : null,
		revisions.map((revision) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [revision.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => {
				if (window.confirm("Restaurer cette version dans le brouillon ?")) restore(revision.id);
			},
			children: "Restaurer"
		})] }, revision.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "quiet on",
			onClick: () => void publish(),
			children: "Publier maintenant"
		})
	] });
}
var LINKS = [
	{
		to: "/",
		label: "home",
		icon: House
	},
	{
		to: "/projets",
		label: "work",
		icon: LayoutGrid
	},
	{
		to: "/a-propos",
		label: "about",
		icon: UserRound
	},
	{
		to: "/laboratoire",
		label: "lab",
		icon: FlaskConical
	},
	{
		to: "/contact",
		label: "contact",
		icon: Mail
	}
];
function Shell({ children }) {
	const studio = useStudio();
	const { user, isPending } = useCurrentUserState();
	const copy = ui(studio.locale);
	const path = useRouterState({ select: (state) => state.location.pathname });
	const navigate = useNavigate();
	const settings = studio.doc.settings;
	const direction = directionById(settings.direction);
	const colors = settings.colors;
	const frameClass = studio.editing && studio.device === "tablet" ? "preview-tablet" : studio.editing && studio.device === "phone" ? "preview-phone" : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `studio ${settings.animations ? "" : "is-calm"} ${colors ? "has-custom" : ""} ${studio.editing ? "is-editing" : ""}`,
		"data-direction": settings.direction,
		"data-font": settings.fontPair,
		style: {
			["--radius-img"]: `${settings.imageRadius}px`,
			["--gap"]: `${settings.gap}px`,
			["--title-scale"]: String(settings.titleScale),
			...colors ? {
				["--bg"]: colors.bg,
				["--fg"]: colors.fg,
				["--accent"]: colors.accent
			} : {}
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "skip",
				href: "#contenu",
				children: "Aller au contenu"
			}),
			studio.editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "editbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "badge",
						children: "Brouillon — les visiteurs voient encore la version publiée"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: studio.undo,
						disabled: !studio.canUndo,
						children: copy.undo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: studio.redo,
						disabled: !studio.canRedo,
						children: copy.redo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": studio.device === "desktop",
						onClick: () => studio.setDevice("desktop"),
						children: "Ordinateur"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": studio.device === "tablet",
						onClick: () => studio.setDevice("tablet"),
						children: "Tablette"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": studio.device === "phone",
						onClick: () => studio.setDevice("phone"),
						children: "Téléphone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("media"),
						children: copy.media
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("direction"),
						children: copy.direction
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("selections"),
						children: copy.selections
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setPanel("about"),
						children: copy.about
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const slug = studio.createProject();
							navigate({
								to: "/projets/$slug",
								params: { slug }
							});
						},
						children: copy.newProject
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void studio.publish(),
						children: copy.publish
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => studio.setEditing(false),
						children: copy.leave
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "note",
						children: studio.saveState === "saving" ? copy.saving : studio.saveState === "saved" ? copy.saved : studio.saveError
					})
				]
			}) : null,
			settings.navStyle === "top" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "topnav",
				"aria-label": "Sections",
				children: LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					"aria-current": path === item.to ? "page" : void 0,
					children: copy[item.label]
				}, item.to))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: frameClass ? `preview-shell` : void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					id: "contenu",
					className: frameClass,
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorSheet, {}),
			studio.notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "owner-note",
				style: {
					position: "fixed",
					left: 16,
					bottom: 92,
					zIndex: 35
				},
				children: studio.notice
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "dock",
				"aria-label": "Navigation",
				children: LINKS.map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						"aria-current": path === item.to ? "page" : void 0,
						"aria-label": copy[item.label],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							size: 20,
							strokeWidth: 1.6,
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copy[item.label] })]
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditLink, {
				pending: isPending,
				signedIn: Boolean(user),
				directionLabel: direction.label
			})
		]
	});
}
function EditLink({ pending, signedIn }) {
	const { authChecked, isOwner, editing, setEditing, locale, setNotice } = useStudio();
	const copy = ui(locale);
	if (pending || !authChecked || editing) return null;
	if (isOwner) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "edit-entry",
		style: {
			position: "fixed",
			left: 16,
			bottom: 96,
			zIndex: 32
		},
		onClick: () => setEditing(true),
		children: copy.edit
	});
	if (!signedIn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		className: "edit-entry",
		style: {
			position: "fixed",
			left: 16,
			bottom: 96,
			zIndex: 32
		},
		to: "/login",
		children: copy.edit
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "edit-entry",
		style: {
			position: "fixed",
			left: 16,
			bottom: 96,
			zIndex: 32
		},
		onClick: () => setNotice(copy.ownerOnly),
		children: copy.edit
	});
}
var styles_default = "/assets/styles-CRZsTPBT.css";
var Route$13 = createRootRoute({
	loader: () => getPublished(),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "Matt Mez — Creative Studio" },
			{
				name: "description",
				content: "Matt Mez, creative studio. Identités, expériences, musique."
			},
			{
				name: "theme-color",
				content: "#090909"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,550;1,6..72,400&family=Outfit:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	const data = Route$13.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fr",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioProvider, {
				initial: data,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$11 = () => import("./routes-CP9eOzZc.mjs");
var Route$12 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./a-propos-DtyZkJGD.mjs");
var Route$11 = createFileRoute("/a-propos")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./contact-C2vWYaFT.mjs");
var Route$10 = createFileRoute("/contact")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./route-D57uIrCb.mjs");
var Route$9 = createFileRoute("/laboratoire")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./login-CXGS5FRC.mjs");
var Route$8 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./route-CbSlNcP6.mjs");
var Route$7 = createFileRoute("/projets")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./laboratoire-CX7CzuUK.mjs");
var Route$6 = createFileRoute("/laboratoire/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./cadence-DOhVYpL5.mjs");
var Route$5 = createFileRoute("/laboratoire/cadence")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./signal-3XxADo5r.mjs");
var Route$4 = createFileRoute("/laboratoire/signal")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./projets-eG_MXXPQ.mjs");
var Route$3 = createFileRoute("/projets/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("../_slug-BAzCS-V1.mjs");
var Route$2 = createFileRoute("/projets/$slug")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./selection._slug-BXKu4iGf.mjs");
var Route$1 = createFileRoute("/selection/$slug")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AProposRoute = Route$11.update({
	id: "/a-propos",
	path: "/a-propos",
	getParentRoute: () => Route$13
});
var ContactRoute = Route$10.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$13
});
var LaboratoireRouteRoute = Route$9.update({
	id: "/laboratoire",
	path: "/laboratoire",
	getParentRoute: () => Route$13
});
var LoginRoute = Route$8.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$13
});
var ProjetsRouteRoute = Route$7.update({
	id: "/projets",
	path: "/projets",
	getParentRoute: () => Route$13
});
var LaboratoireIndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => LaboratoireRouteRoute
});
var LaboratoireCadenceRoute = Route$5.update({
	id: "/cadence",
	path: "/cadence",
	getParentRoute: () => LaboratoireRouteRoute
});
var LaboratoireSignalRoute = Route$4.update({
	id: "/signal",
	path: "/signal",
	getParentRoute: () => LaboratoireRouteRoute
});
var ProjetsIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => ProjetsRouteRoute
});
var ProjetsSlugRoute = Route$2.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => ProjetsRouteRoute
});
var SelectionSlugRoute = Route$1.update({
	id: "/selection/$slug",
	path: "/selection/$slug",
	getParentRoute: () => Route$13
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$13
});
var LaboratoireRouteRouteChildren = {
	LaboratoireCadenceRoute,
	LaboratoireSignalRoute,
	LaboratoireIndexRoute
};
var LaboratoireRouteRouteWithChildren = LaboratoireRouteRoute._addFileChildren(LaboratoireRouteRouteChildren);
var ProjetsRouteRouteChildren = {
	ProjetsSlugRoute,
	ProjetsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	LaboratoireRouteRoute: LaboratoireRouteRouteWithChildren,
	ProjetsRouteRoute: ProjetsRouteRoute._addFileChildren(ProjetsRouteRouteChildren),
	AProposRoute,
	ContactRoute,
	LoginRoute,
	SelectionSlugRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { MediaFrame as a, getSelection as c, ui as d, useCurrentUserState as f, Editable as i, postInquiry as l, Route$1 as n, useStudio as o, Route$2 as r, getPrivateSelection as s, router_exports as t, parseEmbed as u };
