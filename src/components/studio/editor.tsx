import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { formatBytes, parseEmbed, prepareFile } from "@/lib/studio/files";
import { DIRECTIONS } from "@/lib/studio/themes";
import { slugify, uid } from "@/lib/studio/tree";
import { DEFAULT_DISCIPLINES, LIMITS, type MediaItem, type ProjectStatus } from "@/lib/studio/types";
import { useStudio } from "./context";
import { MediaFrame } from "./visuals";

export function EditorSheet() {
  const studio = useStudio();
  if (!studio.editing || !studio.panel) return null;
  return (
    <aside className="sheet" aria-label="Édition">
      <div className="panel-head tool">
        <button type="button" onClick={() => studio.setPanel(null)}>Fermer</button>
        <button type="button" onClick={() => studio.setPanel("project")}>Projet</button>
        <button type="button" onClick={() => studio.setPanel("media")}>Médias</button>
        <button type="button" onClick={() => studio.setPanel("direction")}>Direction</button>
        <button type="button" onClick={() => studio.setPanel("selections")}>Sélections</button>
        <button type="button" onClick={() => studio.setPanel("about")}>À propos</button>
        <button type="button" onClick={() => studio.setPanel("messages")}>Messages</button>
        <button type="button" onClick={() => studio.setPanel("backup")}>Sauvegarde</button>
      </div>
      {studio.panel === "project" ? <ProjectPanel /> : null}
      {studio.panel === "media" ? <MediaPanel /> : null}
      {studio.panel === "direction" ? <DirectionPanel /> : null}
      {studio.panel === "selections" ? <SelectionPanel /> : null}
      {studio.panel === "about" ? <AboutPanel /> : null}
      {studio.panel === "messages" ? <MessagePanel /> : null}
      {studio.panel === "backup" ? <BackupPanel /> : null}
    </aside>
  );
}

function ProjectPanel() {
  const { doc, updateDraft, activeProjectId, setActiveProjectId, media, upsertMedia, selectedBlockId } = useStudio();
  const project = doc.projects.find((item) => item.id === activeProjectId) ?? doc.projects[0];
  if (!project) return <p>Aucun projet.</p>;
  const set = (recipe: (project: (typeof doc.projects)[number]) => void) => {
    updateDraft((draft) => {
      const found = draft.projects.find((item) => item.id === project.id);
      if (found) recipe(found);
    });
  };
  return (
    <div>
      <h2>Projet</h2>
      <label>Choisir
        <select value={project.id} onChange={(event) => setActiveProjectId(event.target.value)}>
          {doc.projects.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label>
      <Field label="Titre" value={project.title} onChange={(value) => set((item) => { item.title = value; item.label = item.label === "Sans titre" || !item.label ? value : item.label; item.slug = slugify(value) || item.slug; })} />
      <Field label="Titre anglais" value={project.titleEn} onChange={(value) => set((item) => { item.titleEn = value; })} />
      <Field label="Sous-titre" value={project.subtitle} onChange={(value) => set((item) => { item.subtitle = value; })} />
      <Field label="Résumé" value={project.summary} area onChange={(value) => set((item) => { item.summary = value; })} />
      <Field label="Texte long" value={project.context} area onChange={(value) => set((item) => { item.context = value; })} />
      <Field label="Année" value={project.year} onChange={(value) => set((item) => { item.year = value; })} />
      <Field label="Client (vide = masqué)" value={project.client} onChange={(value) => set((item) => { item.client = value; })} />
      <Field label="Rôle" value={project.role} onChange={(value) => set((item) => { item.role = value; })} />
      <Field label="Collaborateurs" value={project.collaborators} onChange={(value) => set((item) => { item.collaborators = value; })} />
      <Field label="Disciplines, séparées par une virgule" value={project.disciplines.join(", ")} onChange={(value) => set((item) => { item.disciplines = value.split(",").map((part) => part.trim()).filter(Boolean); })} />
      <Field label="Processus" value={project.process} area onChange={(value) => set((item) => { item.process = value; })} />
      <Field label="Résultat" value={project.result} area onChange={(value) => set((item) => { item.result = value; })} />
      <Field label="Lien externe" value={project.externalUrl} onChange={(value) => set((item) => { item.externalUrl = value; })} />
      <Field label="Légende gauche" value={project.label} onChange={(value) => set((item) => { item.label = value; })} />
      <Field label="Légende droite" value={project.meta} onChange={(value) => set((item) => { item.meta = value; })} />
      <Field label="Outil du lab (adresse interne)" value={project.labHref} onChange={(value) => set((item) => { item.labHref = value; })} />
      <label>Statut
        <select value={project.status} onChange={(event) => set((item) => { item.status = event.target.value as ProjectStatus; })}>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
          <option value="private">Privé</option>
          <option value="archived">Archivé</option>
        </select>
      </label>
      <label>Emplacement
        <select value={project.placement} onChange={(event) => set((item) => { item.placement = event.target.value as "work" | "lab" | "both"; })}>
          <option value="work">Projets</option>
          <option value="lab">Laboratoire</option>
          <option value="both">Les deux</option>
        </select>
      </label>
      <label><input type="checkbox" checked={project.featured} onChange={(event) => set((item) => { item.featured = event.target.checked; })} /> En avant sur l'accueil</label>
      <label><input type="checkbox" checked={project.demo} onChange={(event) => set((item) => { item.demo = event.target.checked; })} /> Marquer comme démonstration</label>
      <p className="note">Couvertures</p>
      <MediaPicker
        selected={project.coverIds}
        onToggle={(id) => set((item) => {
          item.coverIds = item.coverIds.includes(id) ? item.coverIds.filter((value) => value !== id) : [...item.coverIds, id].slice(0, 4);
        })}
      />
      <p className="note">Le bloc sélectionné peut recevoir un média :</p>
      <MediaPicker
        selected={[]}
        onToggle={(id) => {
          if (!selectedBlockId) return;
          updateDraft((draft) => {
            const found = draft.projects.find((item) => item.id === project.id);
            const block = found?.blocks.find((item) => item.id === selectedBlockId);
            if (!block) return;
            if (block.type === "image" || block.type === "video" || block.type === "audio" || block.type === "document" || block.type === "full") block.mediaId = id;
            if (block.type === "gallery" || block.type === "carousel" || block.type === "mosaic") {
              block.mediaIds = block.mediaIds.includes(id) ? block.mediaIds : [...block.mediaIds, id];
            }
            if (block.type === "compare") {
              if (!block.beforeId) block.beforeId = id;
              else block.afterId = id;
            }
          });
        }}
      />
      <button type="button" className="quiet on" onClick={() => {
        const copy = structuredClone(project);
        copy.id = uid("p");
        copy.slug = `${project.slug}-copie`;
        copy.title = `${project.title} copie`;
        copy.status = "draft";
        updateDraft((draft) => { draft.projects.splice(draft.projects.findIndex((item) => item.id === project.id) + 1, 0, copy); });
      }}>Dupliquer</button>
      <button type="button" onClick={() => {
        if (!window.confirm("Supprimer ce projet du brouillon ?")) return;
        updateDraft((draft) => { draft.projects = draft.projects.filter((item) => item.id !== project.id); });
        setActiveProjectId(null);
      }}>Supprimer</button>
      <p className="note">{Object.keys(media).length} médias. Import max images {formatBytes(LIMITS.image)}, vidéo {formatBytes(LIMITS.video)}.</p>
      <Upload onReady={(item) => void upsertMedia(item)} />
    </div>
  );
}

function Field({ label, value, onChange, area = false }: { label: string; value: string; onChange: (value: string) => void; area?: boolean }) {
  const { epoch } = useStudio();
  const props = {
    key: `${label}-${epoch}`,
    defaultValue: value,
    onBlur: (event: { target: { value: string } }) => onChange(event.target.value),
  };
  return <label>{label}{area ? <textarea {...props} /> : <input {...props} />}</label>;
}

function MediaPicker({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  const { media } = useStudio();
  const items = Object.values(media);
  return (
    <div className="media-grid">
      {items.map((item) => (
        <button type="button" key={item.id} onClick={() => onToggle(item.id)} aria-pressed={selected.includes(item.id)}>
          {item.kind === "image" || item.kind === "composition" || item.kind === "video" ? <MediaFrame id={item.id} alt="" /> : <span>{item.kind}</span>}
          <small>{item.name}</small>
        </button>
      ))}
    </div>
  );
}

function Upload({ onReady }: { onReady: (item: MediaItem & { originalData?: string | null }) => void }) {
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const take = async (files: FileList | File[]) => {
    setError("");
    for (const file of Array.from(files)) {
      try {
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
          focalX: 0.5,
          focalY: 0.5,
          zoom: 1,
          webData: prepared.webData,
          externalUrl: prepared.externalUrl,
          posterData: null,
          bytes: prepared.bytes,
          width: prepared.width,
          height: prepared.height,
          composition: null,
          hasOriginal: prepared.keptOriginal,
          originalData: prepared.originalData,
        });
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Import impossible.");
      }
    }
  };
  return (
    <div
      className="drop"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        void take(event.dataTransfer.files);
      }}
    >
      <p>Déposez des fichiers, ou importez depuis l'appareil.</p>
      <input
        aria-label="Importer des médias"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,video/mp4,video/webm,audio/*,application/pdf"
        multiple
        onChange={(event) => {
          if (event.target.files) void take(event.target.files);
          event.target.value = "";
        }}
      />
      {note ? <p className="note">{note}</p> : null}
      {error ? <p className="warn">{error}</p> : null}
    </div>
  );
}

function MediaPanel() {
  const { media, upsertMedia, removeMedia, updateDraft } = useStudio();
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("Tous");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const folders = useMemo(() => ["Tous", ...new Set(Object.values(media).map((item) => item.folder || "Atelier"))], [media]);
  const items = Object.values(media).filter((item) => {
    const hay = `${item.name} ${item.alt} ${item.caption}`.toLowerCase();
    return (folder === "Tous" || item.folder === folder) && hay.includes(query.toLowerCase());
  });
  const current = active ? media[active] : null;
  return (
    <div>
      <h2>Médiathèque</h2>
      <p className="note">Les originaux d'image légers sont conservés. Au-delà de 1,8 Mo, seule la version web optimisée est stockée. Vidéo {formatBytes(LIMITS.video)} max. {LIMITS.maxItems} fichiers.</p>
      <Upload onReady={(item) => void upsertMedia(item).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Import impossible."))} />
      <label>Recherche<input value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <label>Dossier
        <select value={folder} onChange={(event) => setFolder(event.target.value)}>
          {folders.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <form onSubmit={(event) => {
        event.preventDefault();
        const embed = parseEmbed(url);
        if (!url.startsWith("http")) {
          setError("L'adresse doit commencer par https://");
          return;
        }
        void upsertMedia({
          id: uid("m"),
          name: embed ? `${embed.provider} ${embed.id}` : url,
          kind: embed ? "embed" : "image",
          mime: embed ? "text/html" : "text/uri-list",
          alt: "",
          caption: "",
          folder: "Liens",
          focalX: 0.5,
          focalY: 0.5,
          zoom: 1,
          webData: embed?.provider === "youtube" ? `https://i.ytimg.com/vi/${embed.id}/hqdefault.jpg` : null,
          externalUrl: url,
          posterData: embed?.provider === "youtube" ? `https://i.ytimg.com/vi/${embed.id}/hqdefault.jpg` : null,
          bytes: 0,
          width: null,
          height: null,
          composition: null,
          hasOriginal: false,
        }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Import impossible."));
        setUrl("");
      }}>
        <label>Importer par URL, YouTube ou Vimeo<input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://" /></label>
        <button type="submit">Ajouter le lien</button>
      </form>
      {error ? <p className="warn">{error}</p> : null}
      <div className="media-grid">
        {items.map((item) => (
          <button type="button" key={item.id} onClick={() => setActive(item.id)}>
            {item.kind === "image" || item.kind === "composition" || item.webData ? <MediaFrame id={item.id} alt={item.alt} /> : <span>{item.kind}</span>}
            <small>{item.name}</small>
          </button>
        ))}
      </div>
      {current ? (
        <div>
          <h3>{current.name}</h3>
          <Field label="Nom" value={current.name} onChange={(value) => void upsertMedia({ ...current, name: value })} />
          <Field label="Texte alternatif" value={current.alt} onChange={(value) => void upsertMedia({ ...current, alt: value })} />
          <Field label="Légende" value={current.caption} onChange={(value) => void upsertMedia({ ...current, caption: value })} />
          <Field label="Dossier" value={current.folder} onChange={(value) => void upsertMedia({ ...current, folder: value })} />
          <p className="note">Point focal : cliquez l'image. Recadrage : zoom.</p>
          <div
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const focalX = (event.clientX - rect.left) / rect.width;
              const focalY = (event.clientY - rect.top) / rect.height;
              void upsertMedia({ ...current, focalX, focalY });
            }}
          >
            <MediaFrame id={current.id} alt={current.alt} />
          </div>
          <label>Zoom {current.zoom.toFixed(2)}
            <input type="range" min={1} max={2.4} step={0.01} value={current.zoom} onChange={(event) => void upsertMedia({ ...current, zoom: Number(event.target.value) })} />
          </label>
          <button type="button" onClick={() => {
            if (!window.confirm("Retirer ce média de la médiathèque ? Les projets qui l'utilisent perdront l'image.")) return;
            void removeMedia(current.id);
            setActive(null);
          }}>Supprimer le média</button>
          <button type="button" onClick={() => updateDraft((draft) => {
            const project = draft.projects[0];
            if (project && !project.coverIds.includes(current.id)) project.coverIds.push(current.id);
          })}>Ajouter à la couverture du premier projet</button>
        </div>
      ) : null}
    </div>
  );
}

function DirectionPanel() {
  const { doc, updateDraft } = useStudio();
  const settings = doc.settings;
  const setColor = (key: "bg" | "fg" | "accent", value: string) => {
    updateDraft((draft) => {
      const colors = draft.settings.colors ?? { bg: "#090909", fg: "#f4f4f2", accent: "#f4f4f2" };
      colors[key] = value;
      draft.settings.colors = colors;
    });
  };
  return (
    <div>
      <h2>Direction artistique</h2>
      <p className="note">Changer de direction ne supprime ni les projets ni les médias.</p>
      {DIRECTIONS.map((direction) => (
        <button
          key={direction.id}
          type="button"
          className={settings.direction === direction.id ? "pill-on" : ""}
          onClick={() => updateDraft((draft) => {
            draft.settings.direction = direction.id;
            Object.assign(draft.settings, direction.patch);
            draft.settings.colors = null;
          })}
        >
          <b>{direction.label}</b> — {direction.blurb}
        </button>
      ))}
      <Field label="Nom" value={settings.name} onChange={(value) => updateDraft((draft) => { draft.settings.name = value; })} />
      <Field label="Signature" value={settings.signature} onChange={(value) => updateDraft((draft) => { draft.settings.signature = value; })} />
      <Field label="Phrase" value={settings.tagline} area onChange={(value) => updateDraft((draft) => { draft.settings.tagline = value; })} />
      <label>Fond <input type="color" value={settings.colors?.bg ?? "#090909"} onChange={(event) => setColor("bg", event.target.value)} /></label>
      <label>Texte <input type="color" value={settings.colors?.fg ?? "#f4f4f2"} onChange={(event) => setColor("fg", event.target.value)} /></label>
      <label>Accent <input type="color" value={settings.colors?.accent ?? "#f4f4f2"} onChange={(event) => setColor("accent", event.target.value)} /></label>
      <label>Typographie
        <select value={settings.fontPair} onChange={(event) => updateDraft((draft) => { draft.settings.fontPair = event.target.value as "grotesk" | "editorial"; })}>
          <option value="grotesk">Grotesque</option>
          <option value="editorial">Éditoriale</option>
        </select>
      </label>
      <label>Taille des titres {settings.titleScale.toFixed(2)}
        <input type="range" min={0.7} max={1.3} step={0.02} value={settings.titleScale} onChange={(event) => updateDraft((draft) => { draft.settings.titleScale = Number(event.target.value); })} />
      </label>
      <label>Espacement {settings.gap}
        <input type="range" min={0} max={40} value={settings.gap} onChange={(event) => updateDraft((draft) => { draft.settings.gap = Number(event.target.value); })} />
      </label>
      <label>Colonnes
        <select value={settings.columns} onChange={(event) => updateDraft((draft) => { draft.settings.columns = Number(event.target.value) as 1 | 2 | 3; })}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </label>
      <label>Arrondi des images {settings.imageRadius}
        <input type="range" min={0} max={32} value={settings.imageRadius} onChange={(event) => updateDraft((draft) => { draft.settings.imageRadius = Number(event.target.value); })} />
      </label>
      <label><input type="checkbox" checked={settings.animations} onChange={(event) => updateDraft((draft) => { draft.settings.animations = event.target.checked; })} /> Animations</label>
      <label>Navigation
        <select value={settings.navStyle} onChange={(event) => updateDraft((draft) => { draft.settings.navStyle = event.target.value as "pill" | "top"; })}>
          <option value="pill">Barre flottante</option>
          <option value="top">Liens en haut</option>
        </select>
      </label>
      <Field label="Disciplines, une par ligne" area value={settings.disciplines.join("\n")} onChange={(value) => updateDraft((draft) => { draft.settings.disciplines = value.split("\n").map((item) => item.trim()).filter(Boolean); })} />
      <button type="button" onClick={() => updateDraft((draft) => { draft.settings.disciplines = DEFAULT_DISCIPLINES; })}>Rétablir la liste proposée</button>
      <Field label="Introduction du laboratoire" area value={settings.labIntro} onChange={(value) => updateDraft((draft) => { draft.settings.labIntro = value; })} />
      <Field label="Philosophie" value={settings.philosophy} onChange={(value) => updateDraft((draft) => { draft.settings.philosophy = value; })} />
    </div>
  );
}

function SelectionPanel() {
  const { doc, updateDraft } = useStudio();
  const navigate = useNavigate();
  return (
    <div>
      <h2>Sélections</h2>
      <p className="note">Une sélection pointe vers les projets. Les fichiers ne sont pas copiés. Une sélection privée n'est lisible que par le propriétaire, côté serveur.</p>
      <button type="button" onClick={() => updateDraft((draft) => {
        const id = uid("sel");
        draft.selections.push({ id, slug: `selection-${id.slice(-4)}`, title: "Nouvelle sélection", intro: "", coverId: null, visibility: "public", projectIds: [] });
      })}>Nouvelle sélection</button>
      {doc.selections.map((selection) => (
        <div key={selection.id}>
          <Field label="Titre" value={selection.title} onChange={(value) => updateDraft((draft) => {
            const found = draft.selections.find((item) => item.id === selection.id);
            if (!found) return;
            found.title = value;
            found.slug = slugify(value);
          })} />
          <Field label="Présentation" area value={selection.intro} onChange={(value) => updateDraft((draft) => {
            const found = draft.selections.find((item) => item.id === selection.id);
            if (found) found.intro = value;
          })} />
          <label>Visibilité
            <select value={selection.visibility} onChange={(event) => updateDraft((draft) => {
              const found = draft.selections.find((item) => item.id === selection.id);
              if (found) found.visibility = event.target.value as "public" | "private";
            })}>
              <option value="public">Publique</option>
              <option value="private">Privée</option>
            </select>
          </label>
          {doc.projects.map((project) => (
            <label key={project.id}>
              <input
                type="checkbox"
                checked={selection.projectIds.includes(project.id)}
                onChange={(event) => updateDraft((draft) => {
                  const found = draft.selections.find((item) => item.id === selection.id);
                  if (!found) return;
                  found.projectIds = event.target.checked
                    ? [...found.projectIds, project.id]
                    : found.projectIds.filter((id) => id !== project.id);
                })}
              /> {project.title}
            </label>
          ))}
          <button type="button" onClick={() => void navigate({ to: "/selection/$slug", params: { slug: selection.slug } })}>Ouvrir /{selection.slug}</button>
          <button type="button" onClick={() => updateDraft((draft) => { draft.selections = draft.selections.filter((item) => item.id !== selection.id); })}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}

function AboutPanel() {
  const { doc, updateDraft, media } = useStudio();
  const about = doc.about;
  const set = (recipe: (about: typeof doc.about) => void) => updateDraft((draft) => recipe(draft.about));
  return (
    <div>
      <h2>À propos</h2>
      <p className="note">Les champs vides restent invisibles. N'inventez pas une biographie : écrivez la vôtre.</p>
      <label>Portrait
        <select value={about.portraitId ?? ""} onChange={(event) => set((item) => { item.portraitId = event.target.value || null; })}>
          <option value="">Aucun</option>
          {Object.values(media).filter((item) => item.kind === "image" || item.kind === "composition").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <Field label="Phrase" area value={about.statement} onChange={(value) => set((item) => { item.statement = value; })} />
      <Field label="Biographie" area value={about.bio} onChange={(value) => set((item) => { item.bio = value; })} />
      <Field label="Parcours" area value={about.path} onChange={(value) => set((item) => { item.path = value; })} />
      <Field label="Vision" area value={about.vision} onChange={(value) => set((item) => { item.vision = value; })} />
      <Field label="Ville" value={about.city} onChange={(value) => set((item) => { item.city = value; })} />
      <Field label="Courriel public" value={about.email} onChange={(value) => set((item) => { item.email = value; })} />
      <Field label="Téléphone" value={about.phone} onChange={(value) => set((item) => { item.phone = value; })} />
      <label>CV
        <select value={about.cvId ?? ""} onChange={(event) => set((item) => { item.cvId = event.target.value || null; })}>
          <option value="">Aucun</option>
          {Object.values(media).filter((item) => item.kind === "pdf").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <button type="button" onClick={() => set((item) => { item.experiences.push({ id: uid("ex"), period: "", title: "Expérience", detail: "" }); })}>Ajouter une expérience</button>
      {about.experiences.map((item) => (
        <div key={item.id}>
          <Field label="Titre" value={item.title} onChange={(value) => set((about) => { const found = about.experiences.find((entry) => entry.id === item.id); if (found) found.title = value; })} />
          <Field label="Période" value={item.period} onChange={(value) => set((about) => { const found = about.experiences.find((entry) => entry.id === item.id); if (found) found.period = value; })} />
          <Field label="Détail" value={item.detail} onChange={(value) => set((about) => { const found = about.experiences.find((entry) => entry.id === item.id); if (found) found.detail = value; })} />
        </div>
      ))}
      <button type="button" onClick={() => set((item) => { item.socials.push({ id: uid("so"), label: "Lien", href: "https://" }); })}>Ajouter un réseau</button>
      {about.socials.map((item) => (
        <div key={item.id}>
          <Field label="Nom" value={item.label} onChange={(value) => set((about) => { const found = about.socials.find((entry) => entry.id === item.id); if (found) found.label = value; })} />
          <Field label="Adresse" value={item.href} onChange={(value) => set((about) => { const found = about.socials.find((entry) => entry.id === item.id); if (found) found.href = value; })} />
        </div>
      ))}
      <button type="button" onClick={() => set((item) => { item.collaborations.push({ id: uid("co"), name: "", detail: "" }); })}>Ajouter une collaboration</button>
    </div>
  );
}

function MessagePanel() {
  const { inquiries, removeInquiry } = useStudio();
  return (
    <div>
      <h2>Messages</h2>
      {inquiries.length === 0 ? <p className="note">Aucun message.</p> : null}
      {inquiries.map((item) => (
        <article key={item.id}>
          <p><b>{item.name}</b> · {item.email}</p>
          <p className="prose">{item.message}</p>
          <button type="button" onClick={() => void removeInquiry(item.id)}>Supprimer</button>
        </article>
      ))}
    </div>
  );
}

function BackupPanel() {
  const { downloadBackup, loadBackup, revisions, restore, publish } = useStudio();
  const [confirm, setConfirm] = useState<unknown>(null);
  const [error, setError] = useState("");
  return (
    <div>
      <h2>Sauvegarde</h2>
      <p className="note">L'export contient les projets et les médias, y compris les originaux conservés. L'import remplace le brouillon, pas encore le site public.</p>
      <button type="button" onClick={() => void downloadBackup()}>Exporter</button>
      <label>Importer une sauvegarde
        <input type="file" accept="application/json" onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          try {
            const payload = JSON.parse(await file.text()) as unknown;
            setConfirm(payload);
          } catch {
            setError("Fichier illisible.");
          }
        }} />
      </label>
      {confirm ? (
        <p>
          Remplacer le brouillon par cette sauvegarde ?
          <button type="button" onClick={() => { void loadBackup(confirm).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Import impossible.")); setConfirm(null); }}>Confirmer</button>
          <button type="button" onClick={() => setConfirm(null)}>Annuler</button>
        </p>
      ) : null}
      {error ? <p className="warn">{error}</p> : null}
      <h3>Versions publiées</h3>
      {revisions.length === 0 ? <p className="note">Chaque publication crée une version.</p> : null}
      {revisions.map((revision) => (
        <p key={revision.id}>
          {revision.label}
          <button type="button" onClick={() => {
            if (window.confirm("Restaurer cette version dans le brouillon ?")) void restore(revision.id);
          }}>Restaurer</button>
        </p>
      ))}
      <button type="button" className="quiet on" onClick={() => void publish()}>Publier maintenant</button>
    </div>
  );
}
