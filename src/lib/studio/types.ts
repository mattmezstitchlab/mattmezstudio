export type DirectionId =
  | "monument"
  | "editorial"
  | "gallery"
  | "bento"
  | "cinema"
  | "brutal";

export type ProjectStatus = "draft" | "published" | "private" | "archived";
export type Locale = "fr" | "en";
export type FontChoice = "display" | "body" | "serif";
export type Size = "s" | "m" | "l" | "xl";
export type ViewMode = "editorial" | "mosaic" | "list" | "screen";
export type NavStyle = "pill" | "top";
export type Device = "desktop" | "tablet" | "phone";
export type MediaKind = "image" | "video" | "audio" | "pdf" | "embed" | "composition";

export type Block =
  | {
      id: string;
      type: "text";
      text: string;
      hidden?: boolean;
      color?: string;
      font?: FontChoice;
      size?: Size;
    }
  | { id: string; type: "monument"; text: string; hidden?: boolean; color?: string; font?: FontChoice }
  | { id: string; type: "image"; mediaId: string; hidden?: boolean; size?: Size }
  | { id: string; type: "video"; mediaId: string; hidden?: boolean }
  | { id: string; type: "gallery"; mediaIds: string[]; hidden?: boolean }
  | { id: string; type: "carousel"; mediaIds: string[]; hidden?: boolean }
  | { id: string; type: "compare"; beforeId: string; afterId: string; hidden?: boolean }
  | { id: string; type: "quote"; text: string; credit: string; hidden?: boolean; color?: string; font?: FontChoice }
  | { id: string; type: "audio"; mediaId: string; hidden?: boolean }
  | { id: string; type: "document"; mediaId: string; hidden?: boolean }
  | { id: string; type: "link"; label: string; href: string; hidden?: boolean }
  | { id: string; type: "embed"; url: string; title: string; hidden?: boolean }
  | { id: string; type: "columns2"; left: Block[]; right: Block[]; hidden?: boolean }
  | { id: string; type: "columns3"; columns: [Block[], Block[], Block[]]; hidden?: boolean }
  | { id: string; type: "full"; mediaId: string; hidden?: boolean }
  | { id: string; type: "mosaic"; mediaIds: string[]; hidden?: boolean }
  | { id: string; type: "space"; size: Size; hidden?: boolean }
  | { id: string; type: "rule"; hidden?: boolean };

export type Project = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  summary: string;
  summaryEn: string;
  year: string;
  client: string;
  disciplines: string[];
  role: string;
  collaborators: string;
  context: string;
  process: string;
  result: string;
  externalUrl: string;
  status: ProjectStatus;
  featured: boolean;
  placement: "work" | "lab" | "both";
  sort: number;
  demo: boolean;
  label: string;
  tags: { text: string; strong?: boolean }[];
  meta: string;
  coverIds: string[];
  galleryIds: string[];
  blocks: Block[];
  labHref: string;
};

export type Selection = {
  id: string;
  slug: string;
  title: string;
  intro: string;
  coverId: string | null;
  visibility: "public" | "private";
  projectIds: string[];
};

export type Experience = { id: string; period: string; title: string; detail: string };
export type Collaboration = { id: string; name: string; detail: string };
export type Social = { id: string; label: string; href: string };

export type About = {
  portraitId: string | null;
  statement: string;
  statementEn: string;
  bio: string;
  bioEn: string;
  path: string;
  vision: string;
  experiences: Experience[];
  collaborations: Collaboration[];
  socials: Social[];
  city: string;
  email: string;
  phone: string;
  cvId: string | null;
};

export type Settings = {
  name: string;
  signature: string;
  mark: string;
  tagline: string;
  taglineEn: string;
  disciplinesLine: string;
  disciplinesLineEn: string;
  availability: string;
  availabilityEn: string;
  yearLabel: string;
  philosophy: string;
  labIntro: string;
  direction: DirectionId;
  view: ViewMode;
  imageRadius: number;
  columns: 1 | 2 | 3;
  gap: number;
  titleScale: number;
  animations: boolean;
  navStyle: NavStyle;
  fontPair: "grotesk" | "editorial";
  disciplines: string[];
  logoMediaId: string | null;
  colors: { bg: string; fg: string; accent: string } | null;
};

export type StudioDoc = {
  settings: Settings;
  projects: Project[];
  selections: Selection[];
  about: About;
};

export type MediaItem = {
  id: string;
  name: string;
  kind: MediaKind;
  mime: string;
  alt: string;
  caption: string;
  folder: string;
  focalX: number;
  focalY: number;
  zoom: number;
  webData: string | null;
  externalUrl: string | null;
  posterData: string | null;
  bytes: number;
  width: number | null;
  height: number | null;
  composition: string | null;
  hasOriginal: boolean;
  originalData?: string | null;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type RevisionMeta = { id: number; label: string; createdAt: string };

export type PublishedPayload = {
  doc: StudioDoc;
  media: MediaItem[];
  updatedAt: string;
};

export const LIMITS = {
  image: 8 * 1024 * 1024,
  video: 12 * 1024 * 1024,
  audio: 8 * 1024 * 1024,
  pdf: 6 * 1024 * 1024,
  maxItems: 60,
  docChars: 1_500_000,
};

export const DEFAULT_DISCIPLINES = [
  "Direction artistique",
  "Architecture UX/UI",
  "Design graphique",
  "Identité visuelle",
  "Photographie",
  "Vidéo",
  "Musique et performances live",
  "Conception d'applications",
  "Expérimentations digitales",
  "Intelligence artificielle",
  "Événementiel",
  "Projets culturels",
];
