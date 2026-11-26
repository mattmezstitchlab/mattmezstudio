import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime, x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-v56B_2zl.mjs";
import { r as signIn, t as authClient } from "./client-CgU6ljwF.mjs";
import { f as useCurrentUserState } from "./router-DnAEkaLw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CXGS5FRC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "…"
		})
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage",
			style: {
				maxWidth: 520,
				margin: "8vh auto"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: "MM© STUDIO"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "monument",
					style: { fontSize: "clamp(3rem, 10vw, 5.5rem)" },
					children: "Éditer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					children: "Le site public reste visible. L'éditeur est réservé au propriétaire, après une connexion réelle."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "tool",
					children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => signIn(provider.providerId, { callbackURL: "/" }),
						children: ["Continuer avec ", provider.label]
					}, provider.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (event) => {
						event.preventDefault();
						const form = new FormData(event.currentTarget);
						const email = String(form.get("email") ?? "");
						const password = String(form.get("password") ?? "");
						const name = String(form.get("name") ?? "Matt Mez");
						setPending(true);
						setError("");
						(mode === "up" ? authClient.signUp.email({
							email,
							password,
							name,
							callbackURL: "/"
						}) : authClient.signIn.email({
							email,
							password,
							callbackURL: "/"
						})).then((result) => {
							if (result.error) setError(result.error.message ?? "Connexion impossible.");
						}).catch((reason) => setError(reason instanceof Error ? reason.message : "Connexion impossible.")).finally(() => setPending(false));
					},
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Nom", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "name",
							autoComplete: "name"
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Courriel", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "email",
							type: "email",
							required: true,
							autoComplete: "email"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Mot de passe", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "password",
							type: "password",
							required: true,
							minLength: 8,
							autoComplete: mode === "up" ? "new-password" : "current-password"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "quiet on",
							type: "submit",
							disabled: pending,
							children: mode === "up" ? "Créer le compte" : "Se connecter"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(mode === "up" ? "in" : "up"),
					children: mode === "up" ? "J'ai déjà un compte" : "Créer un compte propriétaire"
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "warn",
					children: error
				}) : null
			]
		})
	});
}
//#endregion
export { Login as component };
