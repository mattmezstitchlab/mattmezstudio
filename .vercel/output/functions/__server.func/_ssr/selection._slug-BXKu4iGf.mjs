import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getSelection, n as Route$1, s as getPrivateSelection } from "./router-DnAEkaLw.mjs";
import { a as SelectionView } from "./pages-CghGTf-9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/selection._slug-BXKu4iGf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SelectionPage() {
	const { slug } = Route$1.useParams();
	const [state, setState] = (0, import_react.useState)({ kind: "loading" });
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setState({ kind: "loading" });
		getSelection({ data: slug }).then(async (result) => {
			if (cancelled) return;
			if (result.found) {
				setState({
					kind: "ready",
					selection: result.selection,
					projects: result.projects
				});
				return;
			}
			try {
				const priv = await getPrivateSelection({ data: slug });
				if (cancelled) return;
				if (!priv.found) setState({ kind: "missing" });
				else setState({
					kind: "ready",
					selection: priv.selection,
					projects: priv.projects
				});
			} catch {
				if (!cancelled) setState({ kind: "missing" });
			}
		}).catch(() => {
			if (!cancelled) setState({ kind: "missing" });
		});
		return () => {
			cancelled = true;
		};
	}, [slug]);
	if (state.kind === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "…"
		})
	});
	if (state.kind === "missing") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "frame",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "note",
			children: "Cette sélection n'est pas disponible."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectionView, {
		selection: state.selection,
		projects: state.projects
	});
}
//#endregion
export { SelectionPage as component };
