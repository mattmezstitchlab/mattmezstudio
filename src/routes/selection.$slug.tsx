import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SelectionView } from "@/components/studio/pages";
import { getPrivateSelection, getSelection } from "@/lib/studio/api";
import type { Project, Selection } from "@/lib/studio/types";

export const Route = createFileRoute("/selection/$slug")({
  component: SelectionPage,
});

function SelectionPage() {
  const { slug } = Route.useParams();
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "missing" }
    | { kind: "ready"; selection: Selection; projects: Project[] }
  >({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    getSelection({ data: slug })
      .then(async (result) => {
        if (cancelled) return;
        if (result.found) {
          setState({ kind: "ready", selection: result.selection, projects: result.projects });
          return;
        }
        try {
          const priv = await getPrivateSelection({ data: slug });
          if (cancelled) return;
          if (!priv.found) setState({ kind: "missing" });
          else setState({ kind: "ready", selection: priv.selection, projects: priv.projects });
        } catch {
          if (!cancelled) setState({ kind: "missing" });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "missing" });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.kind === "loading") return <div className="frame"><p className="note">…</p></div>;
  if (state.kind === "missing") return <div className="frame"><p className="note">Cette sélection n'est pas disponible.</p></div>;
  return <SelectionView selection={state.selection} projects={state.projects} />;
}
