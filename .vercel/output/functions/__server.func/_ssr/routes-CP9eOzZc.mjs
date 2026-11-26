import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as tx } from "./tree-D_fzkYKz.mjs";
import { a as MediaFrame, d as ui, i as Editable, o as useStudio } from "./router-DnAEkaLw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CP9eOzZc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useFit(text, scale) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		const parent = el?.parentElement;
		if (!el || !parent) return;
		const apply = () => {
			const width = parent.clientWidth;
			let size = width / Math.max([...text].length, 1) * 1.62 * scale;
			el.style.fontSize = `${size}px`;
			let guard = 0;
			while (el.scrollWidth > width && size > 36 && guard < 24) {
				size *= .96;
				el.style.fontSize = `${size}px`;
				guard += 1;
			}
		};
		apply();
		const observer = new ResizeObserver(apply);
		observer.observe(parent);
		return () => observer.disconnect();
	}, [text, scale]);
	return ref;
}
function visibleProjects(projects, editing) {
	return projects.filter((project) => editing ? project.status !== "archived" : project.status === "published").filter((project) => project.featured && project.placement !== "lab").sort((a, b) => a.sort - b.sort);
}
function Home() {
	const { doc, editing, locale, setLocale, updateDraft, setActiveProjectId, setPanel } = useStudio();
	const copy = ui(locale);
	const settings = doc.settings;
	const [view, setView] = (0, import_react.useState)(null);
	const mode = view ?? settings.view;
	const projects = visibleProjects(doc.projects, editing);
	const titleRef = useFit(settings.name, settings.titleScale);
	const [dragId, setDragId] = (0, import_react.useState)(null);
	const reorder = (id, dir) => {
		updateDraft((draft) => {
			const list = [...draft.projects].sort((a, b) => a.sort - b.sort);
			const index = list.findIndex((project) => project.id === id);
			const target = index + dir;
			if (index < 0 || target < 0 || target >= list.length) return;
			const [item] = list.splice(index, 1);
			list.splice(target, 0, item);
			list.forEach((project, index) => {
				project.sort = index;
			});
			draft.projects = list;
		});
	};
	const dropOn = (id) => {
		if (!dragId || dragId === id) return;
		updateDraft((draft) => {
			const list = [...draft.projects].sort((a, b) => a.sort - b.sort);
			const from = list.findIndex((project) => project.id === dragId);
			const to = list.findIndex((project) => project.id === id);
			if (from < 0 || to < 0) return;
			const [item] = list.splice(from, 1);
			list.splice(to, 0, item);
			list.forEach((project, index) => {
				project.sort = index;
			});
			draft.projects = list;
		});
		setDragId(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "frame",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "kicker",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
					value: settings.name,
					onChange: (value) => updateDraft((draft) => {
						draft.settings.name = value;
					})
				}),
				" — ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
					value: settings.signature,
					onChange: (value) => updateDraft((draft) => {
						draft.settings.signature = value;
					})
				})
			] }) : `${settings.name} — ${settings.signature}` })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stage-top",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
						value: settings.mark,
						onChange: (value) => updateDraft((draft) => {
							draft.settings.mark = value;
						})
					}) : settings.mark }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "lang",
						onClick: () => setLocale(locale === "fr" ? "en" : "fr"),
						"aria-label": "Langue",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								style: { opacity: locale === "fr" ? 1 : .4 },
								children: "FR"
							}),
							" / ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								style: { opacity: locale === "en" ? 1 : .4 },
								children: "EN"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" © ", settings.yearLabel] })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "monument",
					ref: titleRef,
					children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
						as: "span",
						value: settings.name,
						onChange: (value) => updateDraft((draft) => {
							draft.settings.name = value;
						})
					}) : settings.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "subrow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: { margin: 0 },
						children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
							value: tx(locale, settings.disciplinesLine, settings.disciplinesLineEn),
							onChange: (value) => updateDraft((draft) => {
								if (locale === "en") draft.settings.disciplinesLineEn = value;
								else draft.settings.disciplinesLine = value;
							})
						}) : tx(locale, settings.disciplinesLine, settings.disciplinesLineEn)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contact",
						children: [tx(locale, settings.availability, settings.availabilityEn), " ↗"]
					})]
				}),
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "views",
					role: "toolbar",
					"aria-label": "Affichage",
					children: [
						["editorial", "Éditorial"],
						["mosaic", "Mosaïque"],
						["list", "Liste"],
						["screen", "Plein écran"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": mode === id,
						onClick: () => setView(id),
						children: label
					}, id))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "rule" }),
				projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: copy.emptyWork
				}) : null,
				mode === "editorial" ? projects.map((project, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					id: `piece-${project.slug}`,
					className: "project-block",
					draggable: editing,
					onDragStart: () => setDragId(project.id),
					onDragOver: (event) => event.preventDefault(),
					onDrop: () => dropOn(project.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "diptych",
							children: (project.coverIds.length ? project.coverIds : [""]).slice(0, 2).map((id, coverIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/projets/$slug",
								params: { slug: project.slug },
								"aria-label": project.title,
								children: id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
									id,
									alt: ""
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cover" })
							}, `${project.id}-${coverIndex}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "caption",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: project.label || project.title }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: tag.strong ? "strong" : void 0,
									children: [" ", tag.text]
								}, tag.text)) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.meta })
							]
						}),
						editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tool",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => reorder(project.id, -1),
									children: "Monter"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => reorder(project.id, 1),
									children: "Descendre"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setActiveProjectId(project.id);
										setPanel("project");
									},
									children: "Modifier"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => updateDraft((draft) => {
										const found = draft.projects.find((item) => item.id === project.id);
										if (found) found.featured = !found.featured;
									}),
									children: project.featured ? "Retirer de l'accueil" : "Mettre en avant"
								}),
								project.status !== "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge",
									children: project.status
								}) : null
							]
						}) : null,
						index === 0 && projects.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "down",
							"aria-label": "Suite",
							onClick: () => document.getElementById(`piece-${projects[1].slug}`)?.scrollIntoView({ behavior: "smooth" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								width: "18",
								height: "18",
								viewBox: "0 0 18 18",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M4 7l5 5 5-5",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.6",
									strokeLinecap: "round"
								})
							})
						}) : null
					]
				}, project.id)) : null,
				mode === "mosaic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mosaic",
					style: { ["--cols"]: settings.columns },
					children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/projets/$slug",
						params: { slug: project.slug },
						children: [project.coverIds[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
							id: project.coverIds[0],
							alt: project.title
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cover" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "caption",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: project.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.year })]
						})]
					}, project.id))
				}) : null,
				mode === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "list-row",
					to: "/projets/$slug",
					params: { slug: project.slug },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: project.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "note",
						children: [
							project.year,
							project.disciplines[0],
							project.meta
						].filter(Boolean).join(" · ")
					})] }), project.coverIds[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
						id: project.coverIds[0],
						alt: ""
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})]
				}, project.id)) }) : null,
				mode === "screen" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, { projects }) : null,
				settings.tagline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tagline closer",
					children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
						value: tx(locale, settings.tagline, settings.taglineEn),
						onChange: (value) => updateDraft((draft) => {
							if (locale === "en") draft.settings.taglineEn = value;
							else draft.settings.tagline = value;
						})
					}) : tx(locale, settings.tagline, settings.taglineEn)
				}) : null,
				settings.philosophy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note closer",
					children: settings.philosophy
				}) : null,
				!editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "views",
					role: "toolbar",
					"aria-label": "Affichage",
					children: [
						["editorial", "Éditorial"],
						["mosaic", "Mosaïque"],
						["list", "Liste"],
						["screen", "Plein écran"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": mode === id,
						onClick: () => setView(id),
						children: label
					}, id))
				}) : null
			]
		})]
	});
}
function Screen({ projects }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const project = projects[index];
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key === "ArrowRight") setIndex((value) => (value + 1) % Math.max(projects.length, 1));
			if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + projects.length) % Math.max(projects.length, 1));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [projects.length]);
	if (!project) return null;
	const touch = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "screen-mode",
		onTouchStart: (event) => {
			touch.current = { x: event.changedTouches[0].clientX };
		},
		onTouchEnd: (event) => {
			if (!touch.current) return;
			const delta = event.changedTouches[0].clientX - touch.current.x;
			if (delta > 40) setIndex((value) => (value - 1 + projects.length) % projects.length);
			if (delta < -40) setIndex((value) => (value + 1) % projects.length);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/projets/$slug",
			params: { slug: project.slug },
			children: project.coverIds[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
				id: project.coverIds[0],
				alt: project.title
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cover" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "caption",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: project.title }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.disciplines[0] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setIndex((value) => (value + 1) % projects.length),
					children: "Suivant"
				})
			]
		})]
	});
}
var SplitComponent = Home;
//#endregion
export { SplitComponent as component };
