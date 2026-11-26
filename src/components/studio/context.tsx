import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  deleteInquiry,
  deleteMedia,
  exportBackup,
  getWorkspace,
  importBackup,
  publishSite,
  restoreRevision,
  saveDraft,
  saveMedia,
} from "@/lib/studio/api";
import { uid } from "@/lib/studio/tree";
import type {
  Device,
  Inquiry,
  Locale,
  MediaItem,
  Project,
  PublishedPayload,
  RevisionMeta,
  StudioDoc,
} from "@/lib/studio/types";

type SaveState = "idle" | "saving" | "saved" | "error";
type Panel = "project" | "media" | "direction" | "selections" | "about" | "backup" | "messages" | null;

type StudioValue = {
  ready: boolean;
  authChecked: boolean;
  isOwner: boolean;
  editing: boolean;
  setEditing: (value: boolean) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  doc: StudioDoc;
  media: Record<string, MediaItem>;
  dirty: boolean;
  saveState: SaveState;
  saveError: string | null;
  device: Device;
  setDevice: (device: Device) => void;
  panel: Panel;
  setPanel: (panel: Panel) => void;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  epoch: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  updateDraft: (recipe: (draft: StudioDoc) => void) => void;
  upsertMedia: (item: MediaItem & { originalData?: string | null }) => Promise<void>;
  removeMedia: (id: string) => Promise<void>;
  publish: () => Promise<void>;
  inquiries: Inquiry[];
  setInquiries: (items: Inquiry[]) => void;
  removeInquiry: (id: string) => Promise<void>;
  revisions: RevisionMeta[];
  restore: (id: number) => Promise<void>;
  downloadBackup: () => Promise<void>;
  loadBackup: (payload: unknown) => Promise<void>;
  createProject: () => string;
  notice: string | null;
  setNotice: (value: string | null) => void;
};

const StudioContext = createContext<StudioValue | null>(null);

function indexMedia(items: MediaItem[]): Record<string, MediaItem> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function emptyProject(sort: number): Project {
  const id = uid("p");
  return {
    id,
    slug: `projet-${id.slice(-4)}`,
    title: "Sans titre",
    titleEn: "",
    subtitle: "",
    subtitleEn: "",
    summary: "",
    summaryEn: "",
    year: "",
    client: "",
    disciplines: [],
    role: "",
    collaborators: "",
    context: "",
    process: "",
    result: "",
    externalUrl: "",
    status: "draft",
    featured: true,
    placement: "work",
    sort,
    demo: false,
    label: "Sans titre",
    tags: [],
    meta: "",
    coverIds: [],
    galleryIds: [],
    blocks: [],
    labHref: "",
  };
}

export function StudioProvider({ initial, children }: { initial: PublishedPayload; children: ReactNode }) {
  const router = useRouter();
  const { user, isPending } = useCurrentUserState();
  const [published, setPublished] = useState(initial.doc);
  const [draft, setDraft] = useState<StudioDoc | null>(null);
  const [media, setMedia] = useState(() => indexMedia(initial.media));
  const [isOwner, setIsOwner] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [panel, setPanel] = useState<Panel>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [epoch, setEpoch] = useState(0);
  const [histTick, setHistTick] = useState(0);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [revisions, setRevisions] = useState<RevisionMeta[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState(initial.updatedAt);
  const past = useRef<StudioDoc[]>([]);
  const future = useRef<StudioDoc[]>([]);
  const dirty = useRef(false);
  const userId = user?.id;

  useEffect(() => {
    const stored = window.localStorage.getItem("mm-locale");
    if (stored === "en" || stored === "fr") setLocaleState(stored);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("mm-locale", next);
  }, []);

  useEffect(() => {
    if (editing) return;
    setPublished(initial.doc);
    setMedia((current) => ({ ...indexMedia(initial.media), ...current }));
    setUpdatedAt(initial.updatedAt);
  }, [initial, editing]);

  useEffect(() => {
    if (isPending) return;
    if (!userId) {
      setIsOwner(false);
      setAuthChecked(true);
      return;
    }
    let cancelled = false;
    getWorkspace()
      .then((workspace) => {
        if (cancelled) return;
        if (!workspace.isOwner) {
          setIsOwner(false);
        } else {
          setIsOwner(true);
          setDraft(workspace.draft);
          setPublished(workspace.published);
          setMedia(indexMedia(workspace.media));
          setInquiries(workspace.inquiries);
          setRevisions(workspace.revisions);
          setUpdatedAt(workspace.updatedAt);
        }
        setAuthChecked(true);
      })
      .catch(() => {
        if (!cancelled) {
          setIsOwner(false);
          setAuthChecked(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, userId]);

  useEffect(() => {
    if (!dirty.current || !draft || !isOwner) return;
    const snapshot = draft;
    const timer = window.setTimeout(() => {
      dirty.current = false;
      saveDraft({ data: snapshot })
        .then(() => {
          setSaveState("saved");
          setSaveError(null);
        })
        .catch((error: unknown) => {
          dirty.current = true;
          setSaveState("error");
          setSaveError(error instanceof Error ? error.message : "Enregistrement impossible.");
        });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [draft, isOwner]);

  const updateDraft = useCallback((recipe: (draft: StudioDoc) => void) => {
    setDraft((current) => {
      if (!current) return current;
      past.current.push(structuredClone(current));
      if (past.current.length > 40) past.current.shift();
      future.current = [];
      const next = structuredClone(current);
      recipe(next);
      dirty.current = true;
      return next;
    });
    setSaveState("saving");
    setHistTick((value) => value + 1);
  }, []);

  const undo = useCallback(() => {
    setDraft((current) => {
      const prev = past.current.pop();
      if (!current || !prev) return current;
      future.current.push(structuredClone(current));
      dirty.current = true;
      return prev;
    });
    setEpoch((value) => value + 1);
    setHistTick((value) => value + 1);
    setSaveState("saving");
  }, []);

  const redo = useCallback(() => {
    setDraft((current) => {
      const next = future.current.pop();
      if (!current || !next) return current;
      past.current.push(structuredClone(current));
      dirty.current = true;
      return next;
    });
    setEpoch((value) => value + 1);
    setHistTick((value) => value + 1);
    setSaveState("saving");
  }, []);

  const upsertMedia = useCallback(async (item: MediaItem & { originalData?: string | null }) => {
    await saveMedia({
      data: {
        id: item.id,
        name: item.name,
        kind: item.kind,
        mime: item.mime,
        alt: item.alt,
        caption: item.caption,
        folder: item.folder,
        focalX: item.focalX,
        focalY: item.focalY,
        zoom: item.zoom,
        webData: item.webData,
        originalData: item.originalData ?? null,
        externalUrl: item.externalUrl,
        posterData: item.posterData,
        bytes: item.bytes,
        width: item.width,
        height: item.height,
        composition: item.composition,
      },
    });
    setMedia((current) => ({
      ...current,
      [item.id]: { ...item, hasOriginal: Boolean(item.originalData) || item.hasOriginal },
    }));
  }, []);

  const removeMediaItem = useCallback(async (id: string) => {
    await deleteMedia({ data: id });
    setMedia((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const publish = useCallback(async () => {
    await publishSite();
    if (draft) setPublished(structuredClone(draft));
    setSaveState("saved");
    dirty.current = false;
    await router.invalidate();
    setNotice("Publié. Les visiteurs voient cette version.");
  }, [draft, router]);

  const removeInquiryItem = useCallback(async (id: string) => {
    await deleteInquiry({ data: id });
    setInquiries((current) => current.filter((item) => item.id !== id));
  }, []);

  const restore = useCallback(async (id: number) => {
    const result = await restoreRevision({ data: id });
    setDraft(result.doc);
    past.current = [];
    future.current = [];
    dirty.current = false;
    setEpoch((value) => value + 1);
    setNotice("Version restaurée dans le brouillon. Publiez pour la rendre visible.");
  }, []);

  const downloadBackup = useCallback(async () => {
    const payload = await exportBackup();
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "matt-mez-studio.json";
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const loadBackup = useCallback(async (payload: unknown) => {
    const result = payload as { doc?: StudioDoc; media?: MediaItem[] };
    await importBackup({ data: { doc: result.doc as StudioDoc, media: result.media ?? [] } });
    if (result.doc) setDraft(result.doc);
    if (result.media) setMedia(indexMedia(result.media));
    setEpoch((value) => value + 1);
    dirty.current = false;
    setNotice("Sauvegarde importée dans le brouillon. Publiez pour la montrer aux visiteurs.");
  }, []);

  const createProject = useCallback(() => {
    const project = emptyProject(0);
    updateDraft((doc) => {
      doc.projects.forEach((item) => {
        item.sort += 1;
      });
      doc.projects.unshift(project);
    });
    setActiveProjectId(project.id);
    setPanel("project");
    setEditing(true);
    return project.slug;
  }, [updateDraft]);

  const doc = editing && draft ? draft : published;
  const value = useMemo<StudioValue>(
    () => ({
      ready: true,
      authChecked,
      isOwner,
      editing: editing && isOwner,
      setEditing: (next) => {
        if (!isOwner) return;
        setEditing(next);
        if (!next) setPanel(null);
      },
      locale,
      setLocale,
      doc,
      media,
      dirty: saveState === "saving" || updatedAt !== initial.updatedAt,
      saveState,
      saveError,
      device,
      setDevice,
      panel,
      setPanel,
      activeProjectId,
      setActiveProjectId,
      selectedBlockId,
      setSelectedBlockId,
      epoch,
      canUndo: past.current.length > 0 || histTick < 0,
      canRedo: future.current.length > 0 || histTick < 0,
      undo,
      redo,
      updateDraft,
      upsertMedia,
      removeMedia: removeMediaItem,
      publish,
      inquiries,
      setInquiries,
      removeInquiry: removeInquiryItem,
      revisions,
      restore,
      downloadBackup,
      loadBackup,
      createProject,
      notice,
      setNotice,
    }),
    [
      authChecked,
      isOwner,
      editing,
      locale,
      setLocale,
      doc,
      media,
      saveState,
      updatedAt,
      initial.updatedAt,
      saveError,
      device,
      panel,
      activeProjectId,
      selectedBlockId,
      epoch,
      histTick,
      undo,
      redo,
      updateDraft,
      upsertMedia,
      removeMediaItem,
      publish,
      inquiries,
      removeInquiryItem,
      revisions,
      restore,
      downloadBackup,
      loadBackup,
      createProject,
      notice,
    ],
  );

  // canUndo/canRedo read refs during render; histTick forces refresh.
  value.canUndo = past.current.length > 0;
  value.canRedo = future.current.length > 0;

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioValue {
  const value = useContext(StudioContext);
  if (!value) throw new Error("Studio manquant");
  return value;
}
