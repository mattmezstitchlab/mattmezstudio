import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as filled, p as tx } from "./tree-D_fzkYKz.mjs";
import { a as MediaFrame, d as ui, i as Editable, l as postInquiry, o as useStudio } from "./router-DnAEkaLw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pages-CghGTf-9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function projectsOf(list, editing) {
	return list.filter((project) => editing || project.status === "published").sort((a, b) => a.sort - b.sort);
}
function WorkIndex() {
	const { doc, editing, locale } = useStudio();
	const copy = ui(locale);
	const projects = projectsOf(doc.projects, editing).filter((project) => project.placement !== "lab");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "monument",
					style: { fontSize: "clamp(3rem, 12vw, 8rem)" },
					children: copy.work
				}),
				projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: copy.emptyWork
				}) : null,
				projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "list-row",
					to: "/projets/$slug",
					params: { slug: project.slug },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: tx(locale, project.title, project.titleEn) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "note",
						children: [project.year, ...project.disciplines].filter(Boolean).join(" · ")
					})] }), project.coverIds[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
						id: project.coverIds[0],
						alt: ""
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})]
				}, project.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Sélections" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lab-grid",
					children: doc.selections.filter((selection) => editing || selection.visibility === "public").map((selection) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "lab-card",
						to: "/selection/$slug",
						params: { slug: selection.slug },
						children: [selection.coverId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
							id: selection.coverId,
							alt: ""
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cover" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "caption",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selection.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selection.visibility === "private" ? "Privé" : "Public" })]
						})]
					}, selection.id))
				})
			]
		})
	});
}
function AboutPage() {
	const { doc, editing, locale, updateDraft, media } = useStudio();
	const about = doc.about;
	const statement = tx(locale, about.statement, about.statementEn);
	const bio = tx(locale, about.bio, about.bioEn);
	const cv = about.cvId ? media[about.cvId] : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage about-grid",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [about.portraitId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
				id: about.portraitId,
				alt: doc.settings.name
			}) : null, editing && !about.portraitId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "note",
				children: "Ajoutez un portrait depuis le panneau À propos."
			}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: doc.settings.mark
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "monument",
					style: {
						fontSize: "clamp(3rem, 10vw, 7rem)",
						whiteSpace: "normal"
					},
					children: doc.settings.name
				}),
				filled(statement) || editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prose",
					children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editable, {
						value: statement,
						onChange: (value) => updateDraft((draft) => {
							if (locale === "en") draft.about.statementEn = value;
							else draft.about.statement = value;
						})
					}) : statement
				}) : null,
				filled(bio) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prose",
					children: bio
				}) : null,
				filled(about.path) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Parcours" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prose",
					children: about.path
				})] }) : null,
				filled(about.vision) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Vision" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prose",
					children: about.vision
				})] }) : null,
				about.experiences.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Expériences" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "discipline-list",
					children: about.experiences.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.title }),
						" ",
						item.period ? `· ${item.period}` : "",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						item.detail
					] }, item.id))
				})] }) : null,
				about.collaborations.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Collaborations" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "discipline-list",
					children: about.collaborations.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						item.detail
					] }, item.id))
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Disciplines" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "discipline-list",
					children: doc.settings.disciplines.filter((item) => item.trim()).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
				}),
				about.socials.filter((item) => item.href.trim()).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "text-link",
					href: item.href,
					children: item.label || item.href
				}) }, item.id)),
				[
					about.city,
					about.email,
					about.phone
				].filter((item) => filled(item)).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prose",
					children: [
						about.city,
						about.email,
						about.phone
					].filter((item) => filled(item)).join(" · ")
				}) : null,
				cv?.webData || cv?.externalUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "text-link",
					href: cv.webData || cv.externalUrl || "#",
					download: true,
					children: "Télécharger le CV"
				}) }) : null,
				filled(doc.settings.philosophy) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: doc.settings.philosophy
				}) : null
			] })]
		})
	});
}
function LabPage() {
	const { doc, editing, locale } = useStudio();
	const projects = projectsOf(doc.projects, editing).filter((project) => project.placement === "lab" || project.placement === "both");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "monument",
					style: { fontSize: "clamp(3rem, 12vw, 8rem)" },
					children: "LAB"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tagline",
					children: doc.settings.labIntro
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lab-grid",
					children: [
						projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							className: "lab-card",
							to: "/projets/$slug",
							params: { slug: project.slug },
							children: [project.coverIds[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaFrame, {
								id: project.coverIds[0],
								alt: project.title
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cover" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "caption",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: project.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.meta || "Démonstration" })]
							})]
						}, project.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							className: "lab-card",
							to: "/laboratoire/signal",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cover",
								style: {
									display: "grid",
									placeItems: "center"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									style: { fontSize: "3rem" },
									children: "Aa"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "caption",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Signal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Outil" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							className: "lab-card",
							to: "/laboratoire/cadence",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cover",
								style: {
									display: "grid",
									placeItems: "center"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									style: { fontSize: "3rem" },
									children: "♩"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "caption",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Cadence" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Outil" })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: ui(locale).demoLine
				})
			]
		})
	});
}
function ContactPage() {
	const { doc, locale } = useStudio();
	const copy = ui(locale);
	const [state, setState] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)("");
	const about = doc.about;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage contact-grid",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "monument",
					style: {
						fontSize: "clamp(3rem, 10vw, 7rem)",
						whiteSpace: "normal"
					},
					children: copy.contact
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "prose",
					children: tx(locale, doc.settings.availability, doc.settings.availabilityEn)
				}),
				filled(about.email) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "text-link",
					href: `mailto:${about.email}`,
					children: about.email
				}) }) : null,
				filled(about.phone) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: about.phone }) : null,
				filled(about.city) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: about.city }) : null
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (event) => {
					event.preventDefault();
					const form = new FormData(event.currentTarget);
					setState("sending");
					postInquiry({ data: {
						name: String(form.get("name") ?? ""),
						email: String(form.get("email") ?? ""),
						message: String(form.get("message") ?? "")
					} }).then(() => {
						setState("sent");
						event.currentTarget?.reset();
					}).catch((reason) => {
						setState("error");
						setError(reason instanceof Error ? reason.message : "Envoi impossible.");
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: copy.write }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Nom", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "name",
						required: true,
						minLength: 2,
						autoComplete: "name"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Courriel", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "email",
						type: "email",
						required: true,
						autoComplete: "email"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Message", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						name: "message",
						required: true,
						minLength: 4,
						maxLength: 2e3
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "quiet on",
						type: "submit",
						disabled: state === "sending",
						children: copy.send
					}),
					state === "sent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "note",
						children: copy.sent
					}) : null,
					state === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "warn",
						children: error
					}) : null
				]
			})]
		})
	});
}
function SelectionView({ selection, projects }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: "Sélection"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "monument",
					style: {
						fontSize: "clamp(3rem, 10vw, 7rem)",
						whiteSpace: "normal"
					},
					children: selection.title
				}),
				filled(selection.intro) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tagline",
					children: selection.intro
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lab-grid",
					children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "lab-card",
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
				})
			]
		})
	});
}
function SignalTool() {
	const canvasRef = (0, import_react.useRef)(null);
	const pointer = (0, import_react.useRef)({
		x: .5,
		y: .5
	});
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let frame = 0;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const draw = () => {
			const rect = canvas.getBoundingClientRect();
			canvas.width = Math.floor(rect.width * devicePixelRatio);
			canvas.height = Math.floor(rect.height * devicePixelRatio);
			ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
			ctx.fillStyle = "#090909";
			ctx.fillRect(0, 0, rect.width, rect.height);
			"MATT MEZ".split("").forEach((letter, index) => {
				const col = index % 4;
				const row = Math.floor(index / 4);
				const ox = (col + .5) / 4 * rect.width;
				const oy = (.35 + row * .28) * rect.height;
				const dx = (pointer.current.x * rect.width - ox) / rect.width;
				const dy = (pointer.current.y * rect.height - oy) / rect.height;
				ctx.fillStyle = "#f4f4f2";
				ctx.font = "700 18vw Outfit, sans-serif";
				ctx.textAlign = "center";
				ctx.fillText(letter, ox + dx * (reduce ? 0 : 40), oy + dy * (reduce ? 0 : 30));
			});
			if (!reduce) frame = requestAnimationFrame(draw);
		};
		draw();
		return () => cancelAnimationFrame(frame);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: "Laboratoire · outil réel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "monument",
					style: { fontSize: "clamp(3rem, 10vw, 6rem)" },
					children: "Signal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: "Déplacez le doigt ou la souris. Le champ typographique répond. Ce n'est pas une commande client."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "canvas-wrap",
					onPointerMove: (event) => {
						const rect = event.currentTarget.getBoundingClientRect();
						pointer.current = {
							x: (event.clientX - rect.left) / rect.width,
							y: (event.clientY - rect.top) / rect.height
						};
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", { ref: canvasRef })
				})
			]
		})
	});
}
var PITCHES = [
	196,
	247,
	294,
	392
];
function CadenceTool() {
	const [steps, setSteps] = (0, import_react.useState)(() => PITCHES.map((_, row) => Array.from({ length: 8 }, (_, col) => row === 0 && col % 2 === 0)));
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [tempo, setTempo] = (0, import_react.useState)(110);
	const audio = (0, import_react.useRef)(null);
	const stepRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const ctx = audio.current ?? new AudioContext();
		audio.current = ctx;
		ctx.resume();
		const timer = window.setInterval(() => {
			const index = stepRef.current % 8;
			steps.forEach((row, rowIndex) => {
				if (!row[index]) return;
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.frequency.value = PITCHES[rowIndex];
				osc.type = "triangle";
				gain.gain.setValueAtTime(1e-4, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(.08, ctx.currentTime + .01);
				gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + .18);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start();
				osc.stop(ctx.currentTime + .2);
			});
			stepRef.current += 1;
		}, 60 / tempo * 500);
		return () => window.clearInterval(timer);
	}, [
		playing,
		steps,
		tempo
	]);
	(0, import_react.useEffect)(() => () => {
		audio.current?.close();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: "Laboratoire · outil réel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "monument",
					style: { fontSize: "clamp(3rem, 10vw, 6rem)" },
					children: "Cadence"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: "Un séquenceur de démonstration. Le son ne démarre qu'au geste."
				}),
				steps.map((row, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "steps",
					style: { marginBottom: 8 },
					children: row.map((on, col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: on ? "on" : "",
						"aria-pressed": on,
						"aria-label": `Pas ${col + 1} hauteur ${rowIndex + 1}`,
						onClick: () => setSteps((current) => current.map((line, r) => r === rowIndex ? line.map((value, c) => c === col ? !value : value) : line))
					}, col))
				}, rowIndex)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "field",
					children: [
						"Tempo ",
						tempo,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 70,
							max: 180,
							value: tempo,
							onChange: (event) => setTempo(Number(event.target.value))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "quiet on",
					onClick: () => setPlaying((value) => !value),
					children: playing ? "Stop" : "Jouer"
				})
			]
		})
	});
}
//#endregion
export { SelectionView as a, LabPage as i, CadenceTool as n, SignalTool as o, ContactPage as r, WorkIndex as s, AboutPage as t };
