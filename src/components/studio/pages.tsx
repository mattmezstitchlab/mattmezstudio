import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { postInquiry } from "@/lib/studio/api";
import { ui } from "@/lib/studio/i18n";
import { filled, tx } from "@/lib/studio/tree";
import type { Project, Selection } from "@/lib/studio/types";
import { useStudio } from "./context";
import { Editable, MediaFrame } from "./visuals";

function projectsOf(list: Project[], editing: boolean) {
  return list.filter((project) => editing || project.status === "published").sort((a, b) => a.sort - b.sort);
}

export function WorkIndex() {
  const { doc, editing, locale } = useStudio();
  const copy = ui(locale);
  const projects = projectsOf(doc.projects, editing).filter((project) => project.placement !== "lab");
  return (
    <div className="frame">
      <section className="stage">
        <h1 className="monument" style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}>{copy.work}</h1>
        {projects.length === 0 ? <p className="note">{copy.emptyWork}</p> : null}
        {projects.map((project) => (
          <Link key={project.id} className="list-row" to="/projets/$slug" params={{ slug: project.slug }}>
            <div>
              <h2>{tx(locale, project.title, project.titleEn)}</h2>
              <p className="note">{[project.year, ...project.disciplines].filter(Boolean).join(" · ")}</p>
            </div>
            {project.coverIds[0] ? <MediaFrame id={project.coverIds[0]} alt="" /> : <div />}
          </Link>
        ))}
        <h2>Sélections</h2>
        <div className="lab-grid">
          {doc.selections.filter((selection) => editing || selection.visibility === "public").map((selection) => (
            <Link key={selection.id} className="lab-card" to="/selection/$slug" params={{ slug: selection.slug }}>
              {selection.coverId ? <MediaFrame id={selection.coverId} alt="" /> : <div className="cover" />}
              <div className="caption"><b>{selection.title}</b><span>{selection.visibility === "private" ? "Privé" : "Public"}</span></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AboutPage() {
  const { doc, editing, locale, updateDraft, media } = useStudio();
  const about = doc.about;
  const statement = tx(locale, about.statement, about.statementEn);
  const bio = tx(locale, about.bio, about.bioEn);
  const cv = about.cvId ? media[about.cvId] : undefined;
  return (
    <div className="frame">
      <section className="stage about-grid">
        <div>
          {about.portraitId ? <MediaFrame id={about.portraitId} alt={doc.settings.name} /> : null}
          {editing && !about.portraitId ? <p className="note">Ajoutez un portrait depuis le panneau À propos.</p> : null}
        </div>
        <div>
          <p className="note">{doc.settings.mark}</p>
          <h1 className="monument" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", whiteSpace: "normal" }}>{doc.settings.name}</h1>
          {filled(statement) || editing ? (
            <p className="prose">
              {editing ? (
                <Editable value={statement} onChange={(value) => updateDraft((draft) => {
                  if (locale === "en") draft.about.statementEn = value;
                  else draft.about.statement = value;
                })} />
              ) : statement}
            </p>
          ) : null}
          {filled(bio) ? <p className="prose">{bio}</p> : null}
          {filled(about.path) ? <section><h2>Parcours</h2><p className="prose">{about.path}</p></section> : null}
          {filled(about.vision) ? <section><h2>Vision</h2><p className="prose">{about.vision}</p></section> : null}
          {about.experiences.length ? (
            <section>
              <h2>Expériences</h2>
              <ul className="discipline-list">
                {about.experiences.map((item) => (
                  <li key={item.id}><b>{item.title}</b> {item.period ? `· ${item.period}` : ""}<br />{item.detail}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {about.collaborations.length ? (
            <section>
              <h2>Collaborations</h2>
              <ul className="discipline-list">
                {about.collaborations.map((item) => <li key={item.id}><b>{item.name}</b><br />{item.detail}</li>)}
              </ul>
            </section>
          ) : null}
          <h2>Disciplines</h2>
          <ul className="discipline-list">
            {doc.settings.disciplines.filter((item) => item.trim()).map((item) => <li key={item}>{item}</li>)}
          </ul>
          {about.socials.filter((item) => item.href.trim()).map((item) => (
            <p key={item.id}><a className="text-link" href={item.href}>{item.label || item.href}</a></p>
          ))}
          {[about.city, about.email, about.phone].filter((item) => filled(item)).length ? (
            <p className="prose">{[about.city, about.email, about.phone].filter((item) => filled(item)).join(" · ")}</p>
          ) : null}
          {cv?.webData || cv?.externalUrl ? (
            <p><a className="text-link" href={cv.webData || cv.externalUrl || "#"} download>Télécharger le CV</a></p>
          ) : null}
          {filled(doc.settings.philosophy) ? <p className="note">{doc.settings.philosophy}</p> : null}
        </div>
      </section>
    </div>
  );
}

export function LabPage() {
  const { doc, editing, locale } = useStudio();
  const projects = projectsOf(doc.projects, editing).filter((project) => project.placement === "lab" || project.placement === "both");
  return (
    <div className="frame">
      <section className="stage">
        <h1 className="monument" style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}>LAB</h1>
        <p className="tagline">{doc.settings.labIntro}</p>
        <div className="lab-grid">
          {projects.map((project) => (
            <Link key={project.id} className="lab-card" to="/projets/$slug" params={{ slug: project.slug }}>
              {project.coverIds[0] ? <MediaFrame id={project.coverIds[0]} alt={project.title} /> : <div className="cover" />}
              <div className="caption"><b>{project.title}</b><span>{project.meta || "Démonstration"}</span></div>
            </Link>
          ))}
          <Link className="lab-card" to="/laboratoire/signal">
            <div className="cover" style={{ display: "grid", placeItems: "center" }}><strong style={{ fontSize: "3rem" }}>Aa</strong></div>
            <div className="caption"><b>Signal</b><span>Outil</span></div>
          </Link>
          <Link className="lab-card" to="/laboratoire/cadence">
            <div className="cover" style={{ display: "grid", placeItems: "center" }}><strong style={{ fontSize: "3rem" }}>♩</strong></div>
            <div className="caption"><b>Cadence</b><span>Outil</span></div>
          </Link>
        </div>
        <ChromaTool />
        <p className="note">{ui(locale).demoLine}</p>
      </section>
    </div>
  );
}

export function ContactPage() {
  const { doc, locale } = useStudio();
  const copy = ui(locale);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const about = doc.about;
  return (
    <div className="frame">
      <section className="stage contact-grid">
        <div>
          <h1 className="monument" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", whiteSpace: "normal" }}>{copy.contact}</h1>
          <p className="prose">{tx(locale, doc.settings.availability, doc.settings.availabilityEn)}</p>
          {filled(about.email) ? <p><a className="text-link" href={`mailto:${about.email}`}>{about.email}</a></p> : null}
          {filled(about.phone) ? <p>{about.phone}</p> : null}
          {filled(about.city) ? <p>{about.city}</p> : null}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            setState("sending");
            postInquiry({
              data: {
                name: String(form.get("name") ?? ""),
                email: String(form.get("email") ?? ""),
                message: String(form.get("message") ?? ""),
              },
            })
              .then(() => {
                setState("sent");
                event.currentTarget?.reset();
              })
              .catch((reason: unknown) => {
                setState("error");
                setError(reason instanceof Error ? reason.message : "Envoi impossible.");
              });
          }}
        >
          <h2>{copy.write}</h2>
          <label>Nom<input name="name" required minLength={2} autoComplete="name" /></label>
          <label>Courriel<input name="email" type="email" required autoComplete="email" /></label>
          <label>Message<textarea name="message" required minLength={4} maxLength={2000} /></label>
          <button className="quiet on" type="submit" disabled={state === "sending"}>{copy.send}</button>
          {state === "sent" ? <p className="note">{copy.sent}</p> : null}
          {state === "error" ? <p className="warn">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}

export function SelectionView({
  selection,
  projects,
}: {
  selection: Selection;
  projects: Project[];
}) {
  return (
    <div className="frame">
      <section className="stage">
        <p className="note">Sélection</p>
        <h1 className="monument" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", whiteSpace: "normal" }}>{selection.title}</h1>
        {filled(selection.intro) ? <p className="tagline">{selection.intro}</p> : null}
        <div className="lab-grid">
          {projects.map((project) => (
            <Link key={project.id} className="lab-card" to="/projets/$slug" params={{ slug: project.slug }}>
              {project.coverIds[0] ? <MediaFrame id={project.coverIds[0]} alt={project.title} /> : <div className="cover" />}
              <div className="caption"><b>{project.title}</b><span>{project.year}</span></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function SignalTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const paintRef = useRef<() => void>(() => {});
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let queued = false;
    const paint = () => {
      queued = false;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(rect.width * dpr);
      const height = Math.floor(rect.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#090909";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "#f4f4f2";
      ctx.font = "700 18vw Outfit, sans-serif";
      ctx.textAlign = "center";
      const text = "MATT MEZ";
      const px = pointer.current.x * rect.width;
      const py = pointer.current.y * rect.height;
      for (let index = 0; index < text.length; index += 1) {
        const col = index % 4;
        const row = Math.floor(index / 4);
        const ox = ((col + 0.5) / 4) * rect.width;
        const oy = (0.35 + row * 0.28) * rect.height;
        const dx = (px - ox) / rect.width;
        const dy = (py - oy) / rect.height;
        ctx.fillText(text[index], ox + dx * (reduce ? 0 : 40), oy + dy * (reduce ? 0 : 30));
      }
    };
    const requestPaint = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(paint);
    };
    paintRef.current = requestPaint;
    const observer = new ResizeObserver(() => requestPaint());
    observer.observe(canvas);
    requestPaint();
    return () => {
      paintRef.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);
  return (
    <div className="frame">
      <section className="stage">
        <p className="note">Laboratoire · outil réel</p>
        <h1 className="monument" style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}>Signal</h1>
        <p className="note">Déplacez le doigt ou la souris. Le champ typographique répond. Ce n'est pas une commande client.</p>
        <div
          className="canvas-wrap"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            pointer.current = {
              x: (event.clientX - rect.left) / rect.width,
              y: (event.clientY - rect.top) / rect.height,
            };
            paintRef.current();
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </section>
    </div>
  );
}

const PITCHES = [196, 247, 294, 392];

export function CadenceTool() {
  const [steps, setSteps] = useState<boolean[][]>(() =>
    PITCHES.map((_, row) => Array.from({ length: 8 }, (_, col) => row === 0 && col % 2 === 0)),
  );
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(110);
  const audio = useRef<AudioContext | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!playing) return;
    const ctx = audio.current ?? new AudioContext();
    audio.current = ctx;
    void ctx.resume();
    const timer = window.setInterval(() => {
      const index = stepRef.current % 8;
      steps.forEach((row, rowIndex) => {
        if (!row[index]) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = PITCHES[rowIndex];
        osc.type = "triangle";
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      });
      stepRef.current += 1;
    }, (60 / tempo) * 500);
    return () => window.clearInterval(timer);
  }, [playing, steps, tempo]);

  useEffect(() => () => { void audio.current?.close(); }, []);

  return (
    <div className="frame">
      <section className="stage">
        <p className="note">Laboratoire · outil réel</p>
        <h1 className="monument" style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}>Cadence</h1>
        <p className="note">Un séquenceur de démonstration. Le son ne démarre qu'au geste.</p>
        {steps.map((row, rowIndex) => (
          <div className="steps" key={rowIndex} style={{ marginBottom: 8 }}>
            {row.map((on, col) => (
              <button
                key={col}
                type="button"
                className={on ? "on" : ""}
                aria-pressed={on}
                aria-label={`Pas ${col + 1} hauteur ${rowIndex + 1}`}
                onClick={() => setSteps((current) => current.map((line, r) => r === rowIndex ? line.map((value, c) => c === col ? !value : value) : line))}
              />
            ))}
          </div>
        ))}
        <label className="field">Tempo {tempo}
          <input type="range" min={70} max={180} value={tempo} onChange={(event) => setTempo(Number(event.target.value))} />
        </label>
        <button type="button" className="quiet on" onClick={() => setPlaying((value) => !value)}>{playing ? "Stop" : "Jouer"}</button>
      </section>
    </div>
  );
}

/** Local-only generative poster workshop; no network or animation loop. */
function ChromaTool() {
  const [headline, setHeadline] = useState("CHROMA");
  const [palette, setPalette] = useState(0);
  const [seed, setSeed] = useState(1);
  const [layout, setLayout] = useState("orbit");
  const svg = useRef<SVGSVGElement>(null);
  const { locale } = useStudio();
  const en = locale === "en";
  const colors = [["#f5ebda","#e94b35","#171717"],["#141426","#b9f53c","#f8f7f1"],["#ffcae5","#6246ea","#201333"],["#183e38","#ffb657","#fff3d8"]][palette];
  const random = (i: number) => {
    const n = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const download = () => {
    if (!svg.current) return;
    const data = new XMLSerializer().serializeToString(svg.current);
    const url = URL.createObjectURL(new Blob([data], { type: "image/svg+xml;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "chroma-poster.svg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section id="chroma" aria-labelledby="chroma-title" style={{ marginTop: 64, borderTop: "1px solid currentColor", paddingTop: 24 }}>
      <p className="note">{en ? "Experiment 03 · Generative design" : "Expérience 03 · Design génératif"}</p>
      <h2 id="chroma-title" className="monument" style={{ fontSize: "clamp(2.5rem, 10vw, 6rem)" }}>CHROMA</h2>
      <p>{en ? "Compose your own poster. No account required." : "Composez votre propre affiche. Aucun compte nécessaire."}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 24, alignItems: "start" }}>
        <svg ref={svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-label={en ? "Generated poster" : "Affiche générée"} style={{ width: "100%", height: "auto", display: "block" }}>
          <rect width="600" height="800" fill={colors[0]} />
          {Array.from({ length: 12 }, (_, i) => {
            const x = 80 + random(i * 3) * 440;
            const y = 220 + random(i * 3 + 1) * 400;
            const r = 24 + random(i * 3 + 2) * 100;
            return layout === "orbit"
              ? <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 0 ? colors[2] : colors[1]} opacity={0.7} />
              : <rect key={i} x={x-r/2} y={y-r/2} width={r*1.4} height={r*1.4} fill={i % 3 === 0 ? colors[2] : colors[1]} transform={`rotate(${random(i+50)*180} ${x} ${y})`} opacity={0.8} />;
          })}
          <text x="32" y="55" fill={colors[2]} fontFamily="sans-serif" fontSize="18" letterSpacing="3">CREATIVE STUDIO / 03</text>
          <text x="30" y="145" fill={colors[2]} fontFamily="sans-serif" fontWeight="900" fontSize={Math.min(92, 850 / Math.max(headline.length, 1))}>{headline || "CHROMA"}</text>
          <text x="32" y="760" fill={colors[2]} fontFamily="sans-serif" fontSize="20" letterSpacing="2">FORM / COLOR / {String(seed).padStart(3,"0")}</text>
        </svg>
        <div style={{ display: "grid", gap: 16 }}>
          <label className="field">{en ? "Headline" : "Titre"}<input value={headline} maxLength={20} onChange={(e) => setHeadline(e.target.value)} /></label>
          <label className="field">{en ? "Palette" : "Palette"}<select value={palette} onChange={(e) => setPalette(Number(e.target.value))}><option value="0">Terracotta</option><option value="1">Acid</option><option value="2">Bloom</option><option value="3">Forest</option></select></label>
          <label className="field">{en ? "Composition" : "Composition"}<select value={layout} onChange={(e) => setLayout(e.target.value)}><option value="orbit">Orbit</option><option value="grid">Fragment</option></select></label>
          <button type="button" className="quiet" onClick={() => setSeed((n) => n + 1)}>{en ? "New variation" : "Nouvelle variation"}</button>
          <button type="button" className="quiet on" onClick={download}>{en ? "Download SVG" : "Exporter en SVG"}</button>
          <button type="button" className="quiet" onClick={() => { setHeadline("CHROMA"); setPalette(0); setSeed(1); setLayout("orbit"); }}>{en ? "Reset" : "Réinitialiser"}</button>
        </div>
      </div>
    </section>
  );
}
