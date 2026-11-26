import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { tx } from "@/lib/studio/tree";
import { ui } from "@/lib/studio/i18n";
import type { Project, ViewMode } from "@/lib/studio/types";
import { useStudio } from "./context";
import { Editable, MediaFrame } from "./visuals";

function useFit(text: string, scale: number) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const apply = () => {
      const width = parent.clientWidth;
      let size = (width / Math.max([...text].length, 1)) * 1.62 * scale;
      el.style.fontSize = `${size}px`;
      let guard = 0;
      while (el.scrollWidth > width && size > 36 && guard < 24) {
        size *= 0.96;
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

function visibleProjects(projects: Project[], editing: boolean) {
  return projects
    .filter((project) => (editing ? project.status !== "archived" : project.status === "published"))
    .filter((project) => project.featured && project.placement !== "lab")
    .sort((a, b) => a.sort - b.sort);
}

export function Home() {
  const studio = useStudio();
  const { doc, editing, locale, setLocale, updateDraft, setActiveProjectId, setPanel } = studio;
  const copy = ui(locale);
  const settings = doc.settings;
  const [view, setView] = useState<ViewMode | null>(null);
  const mode = view ?? settings.view;
  const projects = visibleProjects(doc.projects, editing);
  const titleRef = useFit(settings.name, settings.titleScale);
  const [dragId, setDragId] = useState<string | null>(null);

  const reorder = (id: string, dir: -1 | 1) => {
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

  const dropOn = (id: string) => {
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

  return (
    <div className="frame">
      <div className="kicker">
        <span>
          {editing ? (
            <>
              <Editable value={settings.name} onChange={(value) => updateDraft((draft) => { draft.settings.name = value; })} />
              {" — "}
              <Editable value={settings.signature} onChange={(value) => updateDraft((draft) => { draft.settings.signature = value; })} />
            </>
          ) : (
            `${settings.name} — ${settings.signature}`
          )}
        </span>
      </div>
      <section className="stage">
        <div className="stage-top">
          <span>{editing ? <Editable value={settings.mark} onChange={(value) => updateDraft((draft) => { draft.settings.mark = value; })} /> : settings.mark}</span>
          <span>
            <button type="button" className="lang" onClick={() => setLocale(locale === "fr" ? "en" : "fr")} aria-label="Langue">
              <strong style={{ opacity: locale === "fr" ? 1 : 0.4 }}>FR</strong>
              {" / "}
              <strong style={{ opacity: locale === "en" ? 1 : 0.4 }}>EN</strong>
            </button>
            <span> © {settings.yearLabel}</span>
          </span>
        </div>
        <h1 className="monument" ref={titleRef}>
          {editing ? (
            <Editable as="span" value={settings.name} onChange={(value) => updateDraft((draft) => { draft.settings.name = value; })} />
          ) : (
            settings.name
          )}
        </h1>
        <div className="subrow">
          <p style={{ margin: 0 }}>
            {editing ? (
              <Editable value={tx(locale, settings.disciplinesLine, settings.disciplinesLineEn)} onChange={(value) => updateDraft((draft) => {
                if (locale === "en") draft.settings.disciplinesLineEn = value;
                else draft.settings.disciplinesLine = value;
              })} />
            ) : (
              tx(locale, settings.disciplinesLine, settings.disciplinesLineEn)
            )}
          </p>
          <Link to="/contact">{tx(locale, settings.availability, settings.availabilityEn)} ↗</Link>
        </div>
        {editing ? (
          <div className="views" role="toolbar" aria-label="Affichage">
            {([
              ["editorial", "Éditorial"],
              ["mosaic", "Mosaïque"],
              ["list", "Liste"],
              ["screen", "Plein écran"],
            ] as const).map(([id, label]) => (
              <button key={id} type="button" aria-pressed={mode === id} onClick={() => setView(id)}>
                {label}
              </button>
            ))}
          </div>
        ) : null}
        <hr className="rule" />
        {projects.length === 0 ? <p className="note">{copy.emptyWork}</p> : null}
        {mode === "editorial" ? (
          projects.map((project, index) => (
            <article
              key={project.id}
              id={`piece-${project.slug}`}
              className="project-block"
              draggable={editing}
              onDragStart={() => setDragId(project.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => dropOn(project.id)}
            >
              <div className="diptych">
                {(project.coverIds.length ? project.coverIds : [""]).slice(0, 2).map((id, coverIndex) => (
                  <Link key={`${project.id}-${coverIndex}`} to="/projets/$slug" params={{ slug: project.slug }} aria-label={project.title}>
                    {id ? <MediaFrame id={id} alt="" /> : <div className="cover" />}
                  </Link>
                ))}
              </div>
              <div className="caption">
                <b>{project.label || project.title}</b>
                <span>
                  {project.tags.map((tag) => (
                    <span key={tag.text} className={tag.strong ? "strong" : undefined}> {tag.text}</span>
                  ))}
                </span>
                <span>{project.meta}</span>
              </div>
              {editing ? (
                <div className="tool">
                  <button type="button" onClick={() => reorder(project.id, -1)}>Monter</button>
                  <button type="button" onClick={() => reorder(project.id, 1)}>Descendre</button>
                  <button type="button" onClick={() => { setActiveProjectId(project.id); setPanel("project"); }}>Modifier</button>
                  <button type="button" onClick={() => updateDraft((draft) => {
                    const found = draft.projects.find((item) => item.id === project.id);
                    if (found) found.featured = !found.featured;
                  })}>{project.featured ? "Retirer de l'accueil" : "Mettre en avant"}</button>
                  {project.status !== "published" ? <span className="badge">{project.status}</span> : null}
                </div>
              ) : null}
              {index === 0 && projects.length > 1 ? (
                <button type="button" className="down" aria-label="Suite" onClick={() => document.getElementById(`piece-${projects[1].slug}`)?.scrollIntoView({ behavior: "smooth" })}>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M4 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              ) : null}
            </article>
          ))
        ) : null}
        {mode === "mosaic" ? (
          <div className="mosaic" style={{ ["--cols" as string]: settings.columns }}>
            {projects.map((project) => (
              <Link key={project.id} to="/projets/$slug" params={{ slug: project.slug }}>
                {project.coverIds[0] ? <MediaFrame id={project.coverIds[0]} alt={project.title} /> : <div className="cover" />}
                <div className="caption"><b>{project.title}</b><span>{project.year}</span></div>
              </Link>
            ))}
          </div>
        ) : null}
        {mode === "list" ? (
          <div>
            {projects.map((project) => (
              <Link key={project.id} className="list-row" to="/projets/$slug" params={{ slug: project.slug }}>
                <div>
                  <h2>{project.title}</h2>
                  <p className="note">{[project.year, project.disciplines[0], project.meta].filter(Boolean).join(" · ")}</p>
                </div>
                {project.coverIds[0] ? <MediaFrame id={project.coverIds[0]} alt="" /> : <div />}
              </Link>
            ))}
          </div>
        ) : null}
        {mode === "screen" ? <Screen projects={projects} /> : null}
        {settings.tagline ? (
          <p className="tagline closer">
            {editing ? (
              <Editable value={tx(locale, settings.tagline, settings.taglineEn)} onChange={(value) => updateDraft((draft) => {
                if (locale === "en") draft.settings.taglineEn = value;
                else draft.settings.tagline = value;
              })} />
            ) : (
              tx(locale, settings.tagline, settings.taglineEn)
            )}
          </p>
        ) : null}
        {settings.philosophy ? <p className="note closer">{settings.philosophy}</p> : null}
        {!editing ? (
          <div className="views" role="toolbar" aria-label="Affichage">
            {([
              ["editorial", "Éditorial"],
              ["mosaic", "Mosaïque"],
              ["list", "Liste"],
              ["screen", "Plein écran"],
            ] as const).map(([id, label]) => (
              <button key={id} type="button" aria-pressed={mode === id} onClick={() => setView(id)}>
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Screen({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const project = projects[index];
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((value) => (value + 1) % Math.max(projects.length, 1));
      if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + projects.length) % Math.max(projects.length, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projects.length]);
  if (!project) return null;
  const touch = useRef<{ x: number } | null>(null);
  return (
    <div
      className="screen-mode"
      onTouchStart={(event) => { touch.current = { x: event.changedTouches[0].clientX }; }}
      onTouchEnd={(event) => {
        if (!touch.current) return;
        const delta = event.changedTouches[0].clientX - touch.current.x;
        if (delta > 40) setIndex((value) => (value - 1 + projects.length) % projects.length);
        if (delta < -40) setIndex((value) => (value + 1) % projects.length);
      }}
    >
      <Link to="/projets/$slug" params={{ slug: project.slug }}>
        {project.coverIds[0] ? <MediaFrame id={project.coverIds[0]} alt={project.title} /> : <div className="cover" />}
      </Link>
      <div className="caption">
        <b>{project.title}</b>
        <span>{project.disciplines[0]}</span>
        <button type="button" onClick={() => setIndex((value) => (value + 1) % projects.length)}>Suivant</button>
      </div>
    </div>
  );
}
