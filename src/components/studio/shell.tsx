import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { FlaskConical, House, LayoutGrid, Mail, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ui } from "@/lib/studio/i18n";
import { directionById } from "@/lib/studio/themes";
import { EditorSheet } from "./editor";
import { useStudio } from "./context";

const LINKS = [
  { to: "/", label: "home", icon: House },
  { to: "/projets", label: "work", icon: LayoutGrid },
  { to: "/a-propos", label: "about", icon: UserRound },
  { to: "/laboratoire", label: "lab", icon: FlaskConical },
  { to: "/contact", label: "contact", icon: Mail },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const studio = useStudio();
  const { user, isPending } = useCurrentUserState();
  const copy = ui(studio.locale);
  const path = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const settings = studio.doc.settings;
  const direction = directionById(settings.direction);
  const colors = settings.colors;
  const frameClass = studio.editing && studio.device === "tablet" ? "preview-tablet" : studio.editing && studio.device === "phone" ? "preview-phone" : "";

  return (
    <div
      className={`studio ${settings.animations ? "" : "is-calm"} ${colors ? "has-custom" : ""} ${studio.editing ? "is-editing" : ""}`}
      data-direction={settings.direction}
      data-font={settings.fontPair}
      style={{
        ["--radius-img" as string]: `${settings.imageRadius}px`,
        ["--gap" as string]: `${settings.gap}px`,
        ["--title-scale" as string]: String(settings.titleScale),
        ...(colors ? { ["--bg" as string]: colors.bg, ["--fg" as string]: colors.fg, ["--accent" as string]: colors.accent } : {}),
      }}
    >
      <a className="skip" href="#contenu">Aller au contenu</a>
      {studio.editing ? (
        <div className="editbar">
          <span className="badge">Brouillon — les visiteurs voient encore la version publiée</span>
          <button type="button" onClick={studio.undo} disabled={!studio.canUndo}>{copy.undo}</button>
          <button type="button" onClick={studio.redo} disabled={!studio.canRedo}>{copy.redo}</button>
          <button type="button" aria-pressed={studio.device === "desktop"} onClick={() => studio.setDevice("desktop")}>Ordinateur</button>
          <button type="button" aria-pressed={studio.device === "tablet"} onClick={() => studio.setDevice("tablet")}>Tablette</button>
          <button type="button" aria-pressed={studio.device === "phone"} onClick={() => studio.setDevice("phone")}>Téléphone</button>
          <button type="button" onClick={() => studio.setPanel("media")}>{copy.media}</button>
          <button type="button" onClick={() => studio.setPanel("direction")}>{copy.direction}</button>
          <button type="button" onClick={() => studio.setPanel("selections")}>{copy.selections}</button>
          <button type="button" onClick={() => studio.setPanel("about")}>{copy.about}</button>
          <button type="button" onClick={() => { const slug = studio.createProject(); void navigate({ to: "/projets/$slug", params: { slug } }); }}>{copy.newProject}</button>
          <button type="button" onClick={() => void studio.publish()}>{copy.publish}</button>
          <button type="button" onClick={() => studio.setEditing(false)}>{copy.leave}</button>
          <span className="note">{studio.saveState === "saving" ? copy.saving : studio.saveState === "saved" ? copy.saved : studio.saveError}</span>
        </div>
      ) : null}
      {settings.navStyle === "top" ? (
        <nav className="topnav" aria-label="Sections">
          {LINKS.map((item) => (
            <Link key={item.to} to={item.to} aria-current={path === item.to ? "page" : undefined}>{copy[item.label]}</Link>
          ))}
        </nav>
      ) : null}
      <div className={frameClass ? `preview-shell` : undefined}>
        <div id="contenu" className={frameClass}>
          {children}
        </div>
      </div>
      <EditorSheet />
      {studio.notice ? <p className="owner-note" style={{ position: "fixed", left: 16, bottom: 92, zIndex: 35 }}>{studio.notice}</p> : null}
      <nav className="dock" aria-label="Navigation">
        {LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} aria-current={path === item.to ? "page" : undefined} aria-label={copy[item.label]}>
              <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
              <span>{copy[item.label]}</span>
            </Link>
          );
        })}
      </nav>
      <EditLink pending={isPending} signedIn={Boolean(user)} directionLabel={direction.label} />
    </div>
  );
}

function EditLink({ pending, signedIn }: { pending: boolean; signedIn: boolean; directionLabel: string }) {
  const { authChecked, isOwner, editing, setEditing, locale, setNotice } = useStudio();
  const copy = ui(locale);
  if (pending || !authChecked || editing) return null;
  if (isOwner) {
    return (
      <button type="button" className="edit-entry" style={{ position: "fixed", left: 16, bottom: 96, zIndex: 32 }} onClick={() => setEditing(true)}>
        {copy.edit}
      </button>
    );
  }
  if (!signedIn) {
    return (
      <Link className="edit-entry" style={{ position: "fixed", left: 16, bottom: 96, zIndex: 32 }} to="/login">
        {copy.edit}
      </Link>
    );
  }
  return (
    <button type="button" className="edit-entry" style={{ position: "fixed", left: 16, bottom: 96, zIndex: 32 }} onClick={() => setNotice(copy.ownerOnly)}>
      {copy.edit}
    </button>
  );
}
