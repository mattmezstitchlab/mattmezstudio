import { useState } from "react";
import { parseEmbed } from "@/lib/studio/files";
import { BLOCK_TYPES, blankBlock, duplicateBlock, findBlock, moveBlock, removeBlock } from "@/lib/studio/tree";
import type { Block, Size } from "@/lib/studio/types";
import { useStudio } from "./context";
import { MediaFrame } from "./visuals";

const SIZES: Size[] = ["s", "m", "l", "xl"];

function sizeOf(block: Block): Size {
  if ("size" in block && block.size) return block.size;
  return "m";
}

function BlockToolbar({ block }: { block: Block }) {
  const { editing, selectedBlockId, updateDraft, activeProjectId, setSelectedBlockId } = useStudio();
  if (!editing || selectedBlockId !== block.id) return null;
  const cycleSize = () => {
    const current = sizeOf(block);
    const next = SIZES[(SIZES.indexOf(current) + 1) % SIZES.length];
    patch({ size: next } as Partial<Block>);
  };
  const patch = (partial: Partial<Block>) => {
    if (!activeProjectId) return;
    updateDraft((doc) => {
      const project = doc.projects.find((item) => item.id === activeProjectId);
      if (!project) return;
      const found = findBlock(project.blocks, block.id);
      if (!found) return;
      Object.assign(found, partial);
    });
  };
  const mutate = (fn: (blocks: Block[]) => Block[]) => {
    if (!activeProjectId) return;
    updateDraft((doc) => {
      const project = doc.projects.find((item) => item.id === activeProjectId);
      if (!project) return;
      project.blocks = fn(project.blocks);
    });
  };
  return (
    <div className="tool" role="toolbar" aria-label="Bloc">
      <button type="button" onClick={() => mutate((blocks) => moveBlock(blocks, block.id, -1))}>Déplacer ↑</button>
      <button type="button" onClick={() => mutate((blocks) => moveBlock(blocks, block.id, 1))}>Déplacer ↓</button>
      <button type="button" onClick={() => mutate((blocks) => duplicateBlock(blocks, block.id))}>Dupliquer</button>
      <button type="button" onClick={cycleSize}>Redimensionner</button>
      <button type="button" onClick={() => patch({ hidden: !block.hidden })}>{block.hidden ? "Afficher" : "Masquer"}</button>
      <button type="button" onClick={() => { mutate((blocks) => removeBlock(blocks, block.id)); setSelectedBlockId(null); }}>Supprimer</button>
      <label>
        Couleur
        <input
          aria-label="Couleur du bloc"
          type="color"
          value={"color" in block && block.color ? block.color : "#f4f4f2"}
          onChange={(event) => patch({ color: event.target.value } as Partial<Block>)}
        />
      </label>
      <button
        type="button"
        onClick={() => {
          const order = ["display", "body", "serif"] as const;
          const current = "font" in block && block.font ? block.font : "body";
          const next = order[(order.indexOf(current) + 1) % order.length];
          patch({ font: next } as Partial<Block>);
        }}
      >
        Typographie
      </button>
    </div>
  );
}

function fontFamily(font?: string) {
  if (font === "serif" || font === "display") return "var(--font-display)";
  if (font === "body") return "var(--font-body)";
  return undefined;
}

export function BlockView({ block }: { block: Block }) {
  const { editing, media, selectedBlockId, setSelectedBlockId, updateDraft, activeProjectId } = useStudio();
  const [ratio, setRatio] = useState(50);
  if (block.hidden && !editing) return null;
  const select = () => {
    if (editing) setSelectedBlockId(block.id);
  };
  const text = (key: "text" | "credit" | "label" | "href" | "title" | "url", value: string) => {
    if (!activeProjectId) return;
    updateDraft((doc) => {
      const project = doc.projects.find((item) => item.id === activeProjectId);
      const found = project ? findBlock(project.blocks, block.id) : null;
      if (found && key in found) (found as unknown as Record<string, string>)[key] = value;
    });
  };
  const color = "color" in block ? block.color : undefined;
  const style = { color, fontFamily: "font" in block ? fontFamily(block.font) : undefined };
  let body = null;
  if (block.type === "text") {
    body = editing ? (
      <textarea className="prose" style={style} defaultValue={block.text} key={block.text} onBlur={(event) => text("text", event.target.value)} />
    ) : (
      <p className="prose" style={style}>{block.text}</p>
    );
  } else if (block.type === "monument") {
    body = editing ? (
      <textarea style={{ ...style, fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 8vw, 6rem)", lineHeight: 0.9, width: "100%" }} defaultValue={block.text} onBlur={(event) => text("text", event.target.value)} />
    ) : (
      <h2 style={{ ...style, fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 8vw, 6rem)", lineHeight: 0.9, margin: 0 }}>{block.text}</h2>
    );
  } else if (block.type === "image" || block.type === "full") {
    body = block.mediaId ? <MediaFrame id={block.mediaId} rounded={block.type !== "full"} /> : <EmptyMedia label="Choisir une image dans la médiathèque" />;
  } else if (block.type === "video") {
    body = block.mediaId ? <MediaFrame id={block.mediaId} /> : <EmptyMedia label="Choisir une vidéo" />;
  } else if (block.type === "audio") {
    const item = media[block.mediaId];
    const src = item?.webData || item?.externalUrl;
    body = src ? <audio controls preload="metadata" src={src} style={{ width: "100%" }} /> : <EmptyMedia label="Choisir un fichier audio" />;
  } else if (block.type === "document") {
    const item = media[block.mediaId];
    const src = item?.webData || item?.externalUrl;
    body = src ? (
      <p><a className="text-link" href={src} target="_blank" rel="noreferrer">{item?.name || "Document"}</a></p>
    ) : (
      <EmptyMedia label="Choisir un PDF" />
    );
  } else if (block.type === "gallery" || block.type === "mosaic" || block.type === "carousel") {
    const ids = block.mediaIds.filter(Boolean);
    body = ids.length ? (
      <div className={block.type === "carousel" ? "carousel" : "mosaic"} style={{ ["--cols" as string]: block.type === "mosaic" ? 2 : undefined }}>
        {ids.map((id) => <MediaFrame key={id} id={id} />)}
      </div>
    ) : (
      <EmptyMedia label="Ajouter des images" />
    );
  } else if (block.type === "compare") {
    body = (
      <div className="compare">
        {block.afterId ? <MediaFrame id={block.afterId} /> : null}
        <div style={{ position: "absolute", inset: 0, width: `${ratio}%`, overflow: "hidden" }}>
          {block.beforeId ? <MediaFrame id={block.beforeId} /> : null}
        </div>
        <input aria-label="Comparaison avant après" type="range" min={0} max={100} value={ratio} onChange={(event) => setRatio(Number(event.target.value))} />
      </div>
    );
  } else if (block.type === "quote") {
    body = (
      <blockquote className="quote" style={style}>
        {editing ? (
          <textarea defaultValue={block.text} onBlur={(event) => text("text", event.target.value)} />
        ) : (
          block.text
        )}
        {block.credit || editing ? (
          <footer>
            {editing ? <input defaultValue={block.credit} onBlur={(event) => text("credit", event.target.value)} /> : block.credit}
          </footer>
        ) : null}
      </blockquote>
    );
  } else if (block.type === "link") {
    body = editing ? (
      <div>
        <input aria-label="Libellé du lien" defaultValue={block.label} onBlur={(event) => text("label", event.target.value)} />
        <input aria-label="Adresse du lien" defaultValue={block.href} onBlur={(event) => text("href", event.target.value)} />
      </div>
    ) : (
      <a className="text-link" href={block.href}>{block.label}</a>
    );
  } else if (block.type === "embed") {
    body = <Embed url={block.url} title={block.title} editing={editing} onUrl={(value) => text("url", value)} onTitle={(value) => text("title", value)} />;
  } else if (block.type === "columns2") {
    body = (
      <div className="cols-2">
        <div>{block.left.map((child) => <BlockView key={child.id} block={child} />)}</div>
        <div>{block.right.map((child) => <BlockView key={child.id} block={child} />)}</div>
      </div>
    );
  } else if (block.type === "columns3") {
    body = (
      <div className="cols-3">
        {block.columns.map((column, index) => (
          <div key={index}>{column.map((child) => <BlockView key={child.id} block={child} />)}</div>
        ))}
      </div>
    );
  } else if (block.type === "space") {
    const height = block.size === "s" ? 24 : block.size === "l" ? 96 : block.size === "xl" ? 160 : 56;
    body = <div style={{ height }} />;
  } else if (block.type === "rule") {
    body = <hr className="rule" />;
  }
  return (
    <div
      className={`block size-${sizeOf(block)} ${block.type === "full" ? "fullbleed" : ""} ${block.hidden ? "hidden-block" : ""} ${selectedBlockId === block.id ? "selected-ring" : ""}`}
      onClick={select}
      data-selected={selectedBlockId === block.id}
    >
      <BlockToolbar block={block} />
      {body}
    </div>
  );
}

function EmptyMedia({ label }: { label: string }) {
  return <p className="note">{label}</p>;
}

function Embed({
  url,
  title,
  editing,
  onUrl,
  onTitle,
}: {
  url: string;
  title: string;
  editing: boolean;
  onUrl: (value: string) => void;
  onTitle: (value: string) => void;
}) {
  const embed = parseEmbed(url);
  const src = embed
    ? embed.provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${embed.id}?rel=0`
      : `https://player.vimeo.com/video/${embed.id}`
    : url.startsWith("http")
      ? url
      : "";
  return (
    <div>
      {editing ? (
        <div>
          <input aria-label="Titre du site" defaultValue={title} onBlur={(event) => onTitle(event.target.value)} />
          <input aria-label="Adresse du site" defaultValue={url} onBlur={(event) => onUrl(event.target.value)} />
        </div>
      ) : null}
      {src ? (
        <div className="media-frame" style={{ aspectRatio: "16/9" }}>
          <iframe title={title || "Site intégré"} src={src} loading="lazy" sandbox="allow-scripts allow-same-origin allow-presentation" style={{ width: "100%", height: "100%", border: 0 }} />
        </div>
      ) : (
        <p className="note">Adresse manquante.</p>
      )}
      {url.startsWith("http") ? (
        <p>
          <a className="text-link" href={url} target="_blank" rel="noreferrer">
            Ouvrir dans un nouvel onglet
          </a>
        </p>
      ) : null}
      <p className="note">Si le site refuse l'intégration, le bouton ci-dessus l'ouvre quand même.</p>
    </div>
  );
}

export function BlockList({ blocks }: { blocks: Block[] }) {
  const { editing, updateDraft, activeProjectId, setSelectedBlockId } = useStudio();
  const [open, setOpen] = useState(false);
  return (
    <div>
      {blocks.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
      {editing && activeProjectId ? (
        <div className="add-block">
          <button type="button" onClick={() => setOpen((value) => !value)}>Ajouter un bloc</button>
          {open ? (
            <div className="tool">
              {BLOCK_TYPES.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    const block = blankBlock(item.type);
                    updateDraft((doc) => {
                      const project = doc.projects.find((entry) => entry.id === activeProjectId);
                      if (project) project.blocks.push(block);
                    });
                    setSelectedBlockId(block.id);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
