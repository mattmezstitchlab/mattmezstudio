import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { filled, tx } from "@/lib/studio/tree";
import { ui } from "@/lib/studio/i18n";
import type { Project } from "@/lib/studio/types";
import { BlockList } from "./blocks";
import { useStudio } from "./context";
import { MediaFrame } from "./visuals";

export function ProjectView({ slug }: { slug: string }) {
  const { doc, locale, editing, setActiveProjectId, media } = useStudio();
  const copy = ui(locale);
  const project = doc.projects.find((item) => item.slug === slug && (editing || item.status === "published"));
  const [expo, setExpo] = useState(false);
  useEffect(() => {
    if (project) setActiveProjectId(project.id);
  }, [project, setActiveProjectId]);
  if (!project) {
    return (
      <div className="frame">
        <p className="note">Cette pièce n'est pas publiée.</p>
        <Link to="/">Retour</Link>
      </div>
    );
  }
  const slides = [...project.coverIds, ...project.galleryIds].filter((id, index, list) => id && list.indexOf(id) === index);
  return (
    <article>
      <div className="project-hero">
        {project.coverIds[0] ? <MediaFrame id={project.coverIds[0]} alt={project.title} rounded={false} /> : null}
      </div>
      <div className="project-copy">
        <p className="note">{[project.year, project.disciplines.join(" · "), project.meta].filter(Boolean).join("  ·  ")}</p>
        <h1>{tx(locale, project.title, project.titleEn)}</h1>
        {filled(tx(locale, project.subtitle, project.subtitleEn)) ? <p className="subrow">{tx(locale, project.subtitle, project.subtitleEn)}</p> : null}
        {filled(tx(locale, project.summary, project.summaryEn)) ? <p className="prose">{tx(locale, project.summary, project.summaryEn)}</p> : null}
        <Meta project={project} />
        <p>
          <button type="button" className="quiet on" onClick={() => setExpo(true)}>{copy.exposition}</button>
          {project.labHref ? <a className="text-link" href={project.labHref}>Ouvrir l'outil</a> : null}
        </p>
        {project.demo ? <p className="note">{copy.demoLine}</p> : null}
      </div>
      <BlockList blocks={project.blocks} />
      <Narrative title="Contexte" text={project.context} />
      <Narrative title="Processus" text={project.process} />
      <Narrative title="Résultat" text={project.result} />
      {project.externalUrl ? (
        <p className="project-copy"><a className="text-link" href={project.externalUrl} target="_blank" rel="noreferrer">Ouvrir le site</a></p>
      ) : null}
      {expo ? <Exposition project={project} slides={slides} mediaExists={(id) => Boolean(media[id])} onClose={() => setExpo(false)} /> : null}
    </article>
  );
}

function Meta({ project }: { project: Project }) {
  const rows = [
    ["Client", project.client],
    ["Rôle", project.role],
    ["Collaborateurs", project.collaborators],
  ].filter(([, value]) => filled(value));
  if (!rows.length) return null;
  return (
    <ul className="discipline-list">
      {rows.map(([label, value]) => (
        <li key={label}><span className="note">{label}</span><br />{value}</li>
      ))}
    </ul>
  );
}

function Narrative({ title, text }: { title: string; text: string }) {
  if (!filled(text)) return null;
  return (
    <section className="project-copy">
      <h2>{title}</h2>
      <p className="prose">{text}</p>
    </section>
  );
}

function Exposition({
  project,
  slides,
  onClose,
  mediaExists,
}: {
  project: Project;
  slides: string[];
  onClose: () => void;
  mediaExists: (id: string) => boolean;
}) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(false);
  const { media } = useStudio();
  const count = Math.max(slides.length, 1);
  const id = slides[index];
  const item = id ? media[id] : undefined;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((value) => (value + 1) % count);
      if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, onClose]);
  useEffect(() => {
    if (!auto) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % count), 4200);
    return () => window.clearInterval(timer);
  }, [auto, count]);
  const src = item?.webData || item?.externalUrl || "";
  return (
    <div className="expo" role="dialog" aria-modal="true" aria-label={`Exposition ${project.title}`}>
      <div className="expo-bar">
        <strong>{project.title}</strong>
        <span>{index + 1} / {count}</span>
        <button type="button" onClick={onClose}>Fermer</button>
      </div>
      <div
        className="expo-stage"
        onClick={() => setIndex((value) => (value + 1) % count)}
        onTouchStart={(event) => { (event.currentTarget as HTMLElement).dataset.x = String(event.changedTouches[0].clientX); }}
        onTouchEnd={(event) => {
          const start = Number((event.currentTarget as HTMLElement).dataset.x || 0);
          const delta = event.changedTouches[0].clientX - start;
          if (delta > 40) setIndex((value) => (value - 1 + count) % count);
          if (delta < -40) setIndex((value) => (value + 1) % count);
        }}
      >
        {item?.kind === "video" && src ? (
          <video key={src} src={src} controls playsInline preload="metadata" poster={item.posterData ?? undefined} />
        ) : mediaExists(id) ? (
          <MediaFrame id={id} alt={project.title} rounded={false} />
        ) : (
          <p className="note">Aucune image.</p>
        )}
      </div>
      <div className="expo-foot">
        <button type="button" onClick={() => setIndex((value) => (value - 1 + count) % count)} aria-label="Précédent">←</button>
        <button type="button" aria-pressed={auto} onClick={() => setAuto((value) => !value)}>{auto ? "Pause" : "Lecture auto"}</button>
        <button type="button" onClick={() => setIndex((value) => (value + 1) % count)} aria-label="Suivant">→</button>
      </div>
    </div>
  );
}
