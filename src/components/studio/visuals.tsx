import type { CSSProperties } from "react";
import { useStudio } from "./context";
import type { MediaItem } from "@/lib/studio/types";

export function Composition({ name }: { name: string | null }) {
  const src =
    name === "typewall" ? "/demo/yellow.jpg" : name === "waves" ? "/demo/gallery.jpg" : "/demo/devices.jpg";
  const position = name === "waves" ? "center 62%" : name === "typewall" ? "center 45%" : "center center";
  return <img className="scene-photo" src={src} alt="" style={{ objectPosition: position }} />;
}

export function mediaStyle(item: MediaItem): CSSProperties {
  return {
    objectPosition: `${item.focalX * 100}% ${item.focalY * 100}%`,
    transform: item.zoom > 1.01 ? `scale(${item.zoom})` : undefined,
  };
}

export function MediaFrame({
  id,
  alt,
  className = "",
  rounded = true,
}: {
  id: string;
  alt?: string;
  className?: string;
  rounded?: boolean;
}) {
  const { media } = useStudio();
  const item = media[id];
  const radius = rounded ? undefined : { borderRadius: 0 };
  if (!item) return <div className={`media-missing ${className}`} style={radius} />;
  if (item.composition || item.kind === "composition") {
    return (
      <div className={`media-frame ${className}`} style={radius}>
        <Composition name={item.composition} />
      </div>
    );
  }
  const src = item.webData || item.externalUrl || "";
  if (item.kind === "video") {
    return (
      <div className={`media-frame ${className}`} style={radius}>
        <video
          src={src}
          poster={item.posterData ?? undefined}
          controls
          playsInline
          preload="metadata"
          aria-label={alt || item.alt || item.name}
        />
      </div>
    );
  }
  if (!src) return <div className={`media-missing ${className}`} style={radius} />;
  return (
    <div className={`media-frame ${className}`} style={radius}>
      <img src={src} alt={alt ?? item.alt ?? ""} style={mediaStyle(item)} />
    </div>
  );
}

export function Editable({
  value,
  onChange,
  className,
  as: Tag = "span",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  as?: "span" | "h1" | "h2" | "p" | "div";
}) {
  const { editing, epoch } = useStudio();
  if (!editing) return <Tag className={className}>{value}</Tag>;
  return (
    <Tag
      key={`${epoch}-${value.length}`}
      className={className}
      contentEditable
      suppressContentEditableWarning
      data-editable="true"
      role="textbox"
      aria-label="Texte modifiable"
      onBlur={(event) => onChange(event.currentTarget.textContent ?? "")}
    >
      {value}
    </Tag>
  );
}
