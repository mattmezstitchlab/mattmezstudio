import { o as __toESM } from "./_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as blankBlock, c as filled, d as removeBlock, l as findBlock, p as tx, s as duplicateBlock, t as BLOCK_TYPES, u as moveBlock } from "./_ssr/tree-D_fzkYKz.mjs";
import { a as MediaFrame, d as ui, o as useStudio, r as Route$2, u as parseEmbed } from "./_ssr/router-DnAEkaLw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-BAzCS-V1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SIZES = [
	"s",
	"m",
	"l",
	"xl"
];
function sizeOf(block) {
	if ("size" in block && block.size) return block.size;
	return "m";
}
function BlockToolbar({ block }) {
	const { editing, selectedBlockId, updateDraft, activeProjectId, setSelectedBlockId } = useStudio();
	if (!editing || selectedBlockId !== block.id) return null;
	const cycleSize = () => {
		const current = sizeOf(block);
		const next = SIZES[(SIZES.indexOf(current) + 1) % SIZES.length];
		patch({ size: next });
	};
	const patch = (partial) => {
		if (!activeProjectId) return;
		updateDraft((doc) => {
			const project = doc.projects.find((item) => item.id === activeProjectId);
			if (!project) return;
			const found = findBlock(project.blocks, block.id);
			if (!found) return;
			Object.assign(found, partial);
		});
	};
	const mutate = (fn) => {
		if (!activeProjectId) return;
		updateDraft((doc) => {
			const project = doc.projects.find((item) => item.id === activeProjectId);
			if (!project) return;
			project.blocks = fn(project.blocks);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "tool",
		role: "toolbar",
		"aria-label": "Bloc",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => mutate((blocks) => moveBlock(blocks, block.id, -1)),
				children: "Déplacer ↑"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => mutate((blocks) => moveBlock(blocks, block.id, 1)),
				children: "Déplacer ↓"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => mutate((blocks) => duplicateBlock(blocks, block.id)),
				children: "Dupliquer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: cycleSize,
				children: "Redimensionner"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => patch({ hidden: !block.hidden }),
				children: block.hidden ? "Afficher" : "Masquer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					mutate((blocks) => removeBlock(blocks, block.id));
					setSelectedBlockId(null);
				},
				children: "Supprimer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Couleur", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Couleur du bloc",
				type: "color",
				value: "color" in block && block.color ? block.color : "#f4f4f2",
				onChange: (event) => patch({ color: event.target.value })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					const order = [
						"display",
						"body",
						"serif"
					];
					const current = "font" in block && block.font ? block.font : "body";
					const next = order[(order.indexOf(current) + 1) % order.length];
					patch({ font: next });
				},
				children: "Typographie"
			})
		]
	});
}
function fontFamily(font) {
	if (font === "serif" || font === "display") return "var(--font-display)";
	if (font === "body") return "var(--font-body)";
}
function BlockView({ block }) {
	const { editing, media, selectedBlockId, setSelectedBlockId, updateDraft, activeProjectId } = useStudio();
	const [ratio, setRatio] = (0, import_react.useState)(50);
	if (block.hidden && !editing) return null;
	const select = () => {
		if (editing) setSelectedBlockId(block.id);
	};
	const text = (key, value) => {
		if (!activeProjectId) return;
		updateDraft((doc) => {
			const project = doc.projects.find((item) => item.id === activeProjectId);
			const found = project ? findBlock(project.blocks, block.id) : null;
			if (found && key in found) found[key] = value;
		});
	};
	const style = {
		color: "color" in block ? block.color : void 0,
		fontFamily: "font" in block ? fontFamily(block.font) : void 0
	};
	let body = null;
	if (block.type === "text") body = editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: "prose",
		style,
		defaultValue: block.text,
		onBlur: (event) => text("text", event.target.value)
	}, block.text) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "prose",
		style,
		children: block.text
	});
	else if (block.type === "monument") body = editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		style: {
			...style,
			fontFamily: "var(--font-display)",
			fontSize: "clamp(2.4rem, 8vw, 6rem)",
			lineHeight: .9,
			width: "100%"
		},
		defaultValue: block.text,
		onBlur: (event) => text("text", event.target.value)
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		style: {
			...style,
			fontFamily: "var(--font-display)",
			fontSize: "clamp(2.4rem, 8vw, 6rem)",
			lineHeight: .9,
			margin: 0
		},
		children: block.text
	});
	else if (block.type === "image" || block.type === "full") body = block.mediaId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
		id: block.mediaId,
		rounded: block.type !== "full"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMedia, { label: "Choisir une image dans la médiathèque" });
	else if (block.type === "video") body = block.mediaId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, { id: block.mediaId }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMedia, { label: "Choisir une vidéo" });
	else if (block.type === "audio") {
		const item = media[block.mediaId];
		const src = item?.webData || item?.externalUrl;
		body = src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			controls: true,
			preload: "metadata",
			src,
			style: { width: "100%" }
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMedia, { label: "Choisir un fichier audio" });
	} else if (block.type === "document") {
		const item = media[block.mediaId];
		const src = item?.webData || item?.externalUrl;
		body = src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			className: "text-link",
			href: src,
			target: "_blank",
			rel: "noreferrer",
			children: item?.name || "Document"
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMedia, { label: "Choisir un PDF" });
	} else if (block.type === "gallery" || block.type === "mosaic" || block.type === "carousel") {
		const ids = block.mediaIds.filter(Boolean);
		body = ids.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: block.type === "carousel" ? "carousel" : "mosaic",
			style: { ["--cols"]: block.type === "mosaic" ? 2 : void 0 },
			children: ids.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, { id }, id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMedia, { label: "Ajouter des images" });
	} else if (block.type === "compare") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "compare",
		children: [
			block.afterId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, { id: block.afterId }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					position: "absolute",
					inset: 0,
					width: `${ratio}%`,
					overflow: "hidden"
				},
				children: block.beforeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, { id: block.beforeId }) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Comparaison avant après",
				type: "range",
				min: 0,
				max: 100,
				value: ratio,
				onChange: (event) => setRatio(Number(event.target.value))
			})
		]
	});
	else if (block.type === "quote") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
		className: "quote",
		style,
		children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			defaultValue: block.text,
			onBlur: (event) => text("text", event.target.value)
		}) : block.text, block.credit || editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", { children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			defaultValue: block.credit,
			onBlur: (event) => text("credit", event.target.value)
		}) : block.credit }) : null]
	});
	else if (block.type === "link") body = editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		"aria-label": "Libellé du lien",
		defaultValue: block.label,
		onBlur: (event) => text("label", event.target.value)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		"aria-label": "Adresse du lien",
		defaultValue: block.href,
		onBlur: (event) => text("href", event.target.value)
	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		className: "text-link",
		href: block.href,
		children: block.label
	});
	else if (block.type === "embed") body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Embed, {
		url: block.url,
		title: block.title,
		editing,
		onUrl: (value) => text("url", value),
		onTitle: (value) => text("title", value)
	});
	else if (block.type === "columns2") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: block.left.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockView, { block: child }, child.id)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: block.right.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockView, { block: child }, child.id)) })]
	});
	else if (block.type === "columns3") body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cols-3",
		children: block.columns.map((column, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: column.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockView, { block: child }, child.id)) }, index))
	});
	else if (block.type === "space") {
		const height = block.size === "s" ? 24 : block.size === "l" ? 96 : block.size === "xl" ? 160 : 56;
		body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height } });
	} else if (block.type === "rule") body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "rule" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `block size-${sizeOf(block)} ${block.type === "full" ? "fullbleed" : ""} ${block.hidden ? "hidden-block" : ""} ${selectedBlockId === block.id ? "selected-ring" : ""}`,
		onClick: select,
		"data-selected": selectedBlockId === block.id,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockToolbar, { block }), body]
	});
}
function EmptyMedia({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "note",
		children: label
	});
}
function Embed({ url, title, editing, onUrl, onTitle }) {
	const embed = parseEmbed(url);
	const src = embed ? embed.provider === "youtube" ? `https://www.youtube-nocookie.com/embed/${embed.id}?rel=0` : `https://player.vimeo.com/video/${embed.id}` : url.startsWith("http") ? url : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			"aria-label": "Titre du site",
			defaultValue: title,
			onBlur: (event) => onTitle(event.target.value)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			"aria-label": "Adresse du site",
			defaultValue: url,
			onBlur: (event) => onUrl(event.target.value)
		})] }) : null,
		src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "media-frame",
			style: { aspectRatio: "16/9" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: title || "Site intégré",
				src,
				loading: "lazy",
				sandbox: "allow-scripts allow-same-origin allow-presentation",
				style: {
					width: "100%",
					height: "100%",
					border: 0
				}
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Adresse manquante."
		}),
		url.startsWith("http") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			className: "text-link",
			href: url,
			target: "_blank",
			rel: "noreferrer",
			children: "Ouvrir dans un nouvel onglet"
		}) }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Si le site refuse l'intégration, le bouton ci-dessus l'ouvre quand même."
		})
	] });
}
function BlockList({ blocks }) {
	const { editing, updateDraft, activeProjectId, setSelectedBlockId } = useStudio();
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [blocks.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockView, { block }, block.id)), editing && activeProjectId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "add-block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setOpen((value) => !value),
			children: "Ajouter un bloc"
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tool",
			children: BLOCK_TYPES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					const block = blankBlock(item.type);
					updateDraft((doc) => {
						const project = doc.projects.find((entry) => entry.id === activeProjectId);
						if (project) project.blocks.push(block);
					});
					setSelectedBlockId(block.id);
					setOpen(false);
				},
				children: item.label
			}, item.type))
		}) : null]
	}) : null] });
}
function ProjectView({ slug }) {
	const { doc, locale, editing, setActiveProjectId, media } = useStudio();
	const copy = ui(locale);
	const project = doc.projects.find((item) => item.slug === slug && (editing || item.status === "published"));
	const [expo, setExpo] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (project) setActiveProjectId(project.id);
	}, [project, setActiveProjectId]);
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "frame",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Cette pièce n'est pas publiée."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			children: "Retour"
		})]
	});
	const slides = [...project.coverIds, ...project.galleryIds].filter((id, index, list) => id && list.indexOf(id) === index);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "project-hero",
			children: project.coverIds[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
				id: project.coverIds[0],
				alt: project.title,
				rounded: false
			}) : null
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "project-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: [
						project.year,
						project.disciplines.join(" · "),
						project.meta
					].filter(Boolean).join("  ·  ")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: tx(locale, project.title, project.titleEn) }),
				filled(tx(locale, project.subtitle, project.subtitleEn)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "subrow",
					children: tx(locale, project.subtitle, project.subtitleEn)
				}) : null,
				filled(tx(locale, project.summary, project.summaryEn)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prose",
					children: tx(locale, project.summary, project.summaryEn)
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, { project }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "quiet on",
					onClick: () => setExpo(true),
					children: copy.exposition
				}), project.labHref ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "text-link",
					href: project.labHref,
					children: "Ouvrir l'outil"
				}) : null] }),
				project.demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: copy.demoLine
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockList, { blocks: project.blocks }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Narrative, {
			title: "Contexte",
			text: project.context
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Narrative, {
			title: "Processus",
			text: project.process
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Narrative, {
			title: "Résultat",
			text: project.result
		}),
		project.externalUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "project-copy",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "text-link",
				href: project.externalUrl,
				target: "_blank",
				rel: "noreferrer",
				children: "Ouvrir le site"
			})
		}) : null,
		expo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Exposition, {
			project,
			slides,
			mediaExists: (id) => Boolean(media[id]),
			onClose: () => setExpo(false)
		}) : null
	] });
}
function Meta({ project }) {
	const rows = [
		["Client", project.client],
		["Rôle", project.role],
		["Collaborateurs", project.collaborators]
	].filter(([, value]) => filled(value));
	if (!rows.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "discipline-list",
		children: rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "note",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			value
		] }, label))
	});
}
function Narrative({ title, text }) {
	if (!filled(text)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "project-copy",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "prose",
			children: text
		})]
	});
}
function Exposition({ project, slides, onClose, mediaExists }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const [auto, setAuto] = (0, import_react.useState)(false);
	const { media } = useStudio();
	const count = Math.max(slides.length, 1);
	const id = slides[index];
	const item = id ? media[id] : void 0;
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key === "Escape") onClose();
			if (event.key === "ArrowRight") setIndex((value) => (value + 1) % count);
			if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + count) % count);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [count, onClose]);
	(0, import_react.useEffect)(() => {
		if (!auto) return;
		const timer = window.setInterval(() => setIndex((value) => (value + 1) % count), 4200);
		return () => window.clearInterval(timer);
	}, [auto, count]);
	const src = item?.webData || item?.externalUrl || "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "expo",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Exposition ${project.title}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "expo-bar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: project.title }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						index + 1,
						" / ",
						count
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						children: "Fermer"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "expo-stage",
				onClick: () => setIndex((value) => (value + 1) % count),
				onTouchStart: (event) => {
					event.currentTarget.dataset.x = String(event.changedTouches[0].clientX);
				},
				onTouchEnd: (event) => {
					const start = Number(event.currentTarget.dataset.x || 0);
					const delta = event.changedTouches[0].clientX - start;
					if (delta > 40) setIndex((value) => (value - 1 + count) % count);
					if (delta < -40) setIndex((value) => (value + 1) % count);
				},
				children: item?.kind === "video" && src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src,
					controls: true,
					playsInline: true,
					preload: "metadata",
					poster: item.posterData ?? void 0
				}, src) : mediaExists(id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
					id,
					alt: project.title,
					rounded: false
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: "Aucune image."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "expo-foot",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIndex((value) => (value - 1 + count) % count),
						"aria-label": "Précédent",
						children: "←"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": auto,
						onClick: () => setAuto((value) => !value),
						children: auto ? "Pause" : "Lecture auto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIndex((value) => (value + 1) % count),
						"aria-label": "Suivant",
						children: "→"
					})
				]
			})
		]
	});
}
function ProjectPage() {
	const { slug } = Route$2.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectView, { slug });
}
//#endregion
export { ProjectPage as component };
