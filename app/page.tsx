"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function publicAsset(path: string): string {
  return basePath + path;
}

type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  location: string;
  summary: string;
  impact: string;
  tools: string[];
  visual: string;
  size: "wide" | "tall" | "standard";
};

const projects: Project[] = [
  {
    id: "parametric-facade",
    index: "01",
    title: "Parametric Facade Study",
    category: "Computational Design",
    year: "2026",
    location: "Design Study",
    summary:
      "An attractor-driven panel system exploring how environmental input, repetition and controlled variation can shape a building envelope.",
    impact: "400-panel elevation system",
    tools: ["Rhino", "Grasshopper", "C#", "Panelization"],
    visual: "canopy",
    size: "wide",
  },
  {
    id: "canopy-structure",
    index: "02",
    title: "Canopy Structure Form-Finding",
    category: "Civil Systems",
    year: "2026",
    location: "Structural Study",
    summary:
      "A radial rib canopy with relaxed tension rings, developed through iterative form-finding and load-path studies.",
    impact: "Radial rib + tension ring logic",
    tools: ["Karamba3D", "Grasshopper", "Load paths", "Detailing"],
    visual: "bridge",
    size: "standard",
  },
  {
    id: "rhino-intelligence",
    index: "03",
    title: "Rhino Intelligence Toolkit",
    category: "AI Research",
    year: "2026",
    location: "Tool Development",
    summary:
      "A growing family of AI-assisted design workflows and Rhino tools for repetitive geometry, documentation and project intelligence.",
    impact: "Workflow prototype / in development",
    tools: ["RhinoCommon", "C#", "AI agents", "Vibe coding"],
    visual: "intelligence",
    size: "tall",
  },
  {
    id: "reading-lagos",
    index: "04",
    title: "Reading Lagos: The Subtractive City",
    category: "Urban Research",
    year: "2026",
    location: "LLL Laboratory · Lagos",
    summary:
      "A satellite-led reading of Lagos as a city of conversion: public guarantees withdrawn, private substitutes assembled in their place.",
    impact: "Co-author · Published research",
    tools: ["Satellite data", "Urban mapping", "Research writing", "Visual narrative"],
    visual: "fabric",
    size: "standard",
  },
  {
    id: "connection-atlas",
    index: "05",
    title: "Connection Atlas",
    category: "Civil Systems",
    year: "2025—26",
    location: "Detail Library",
    summary:
      "A visual index of structural connections where architectural intent meets fabrication tolerance, sequence and buildability.",
    impact: "Detail-led design system",
    tools: ["Steel detailing", "Constructability", "BIM", "Technical drawing"],
    visual: "shell",
    size: "wide",
  },
  {
    id: "climate-intelligence",
    index: "06",
    title: "Climate Intelligence / 08°N",
    category: "Architecture",
    year: "Next Study",
    location: "Open Project Slot",
    summary:
      "A ready-made case-study slot for your next architectural project—complete with space for process, performance and final imagery.",
    impact: "Ready for your work",
    tools: ["Climate analysis", "Architecture", "Visualization", "Storytelling"],
    visual: "heat",
    size: "standard",
  },
];

const categories = [
  "All",
  "Architecture",
  "Computational Design",
  "Civil Systems",
  "AI Research",
  "Urban Research",
];

const practiceAreas = [
  ["01", "Design", "Computational + architectural design", "Architecture"],
  ["02", "Structure", "Connections, details, buildability", "Civil Systems"],
  ["03", "Research", "Urban studies, mapping, publications", "Urban Research"],
  ["04", "AI & Tools", "Vibe coding, plugins, workflows", "AI Research"],
];

function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const rootStyle = getComputedStyle(document.documentElement);
    const lineColor = rootStyle.getPropertyValue("--canvas-line").trim() || "rgba(239,238,233,.28)";
    const signalColor = rootStyle.getPropertyValue("--signal").trim() || "#f2b13a";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    let frame = 0;
    let animation = 0;
    let pointer = { x: 0.72, y: 0.42 };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== rect.width * ratio || canvas.height !== rect.height * ratio) {
        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      const cols = 23;
      const rows = 15;
      const points: { x: number; y: number }[][] = [];
      for (let row = 0; row < rows; row += 1) {
        const line = [];
        for (let col = 0; col < cols; col += 1) {
          const u = col / (cols - 1);
          const v = row / (rows - 1);
          const distance = Math.hypot(u - pointer.x, v - pointer.y);
          const pulse = Math.max(0, 0.35 - distance) * 58;
          const wave = Math.sin(u * 8 + frame * 0.012) * Math.sin(v * Math.PI) * 20;
          line.push({
            x: rect.width * (0.05 + u * 0.9) + Math.sin(v * 3.4) * 18,
            y:
              rect.height * (0.08 + v * 0.82) +
              wave -
              pulse * Math.sin(v * Math.PI),
          });
        }
        points.push(line);
      }

      context.lineWidth = 0.75;
      context.strokeStyle = lineColor;
      for (const line of points) {
        context.beginPath();
        line.forEach((point, i) =>
          i ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y),
        );
        context.stroke();
      }
      for (let col = 0; col < cols; col += 1) {
        context.beginPath();
        points.forEach((line, i) =>
          i ? context.lineTo(line[col].x, line[col].y) : context.moveTo(line[col].x, line[col].y),
        );
        context.stroke();
      }

      context.fillStyle = signalColor;
      points.forEach((line, row) =>
        line.forEach((point, col) => {
          if ((row + col) % 11 === 0) {
            context.beginPath();
            context.arc(point.x, point.y, 1.8, 0, Math.PI * 2);
            context.fill();
          }
        }),
      );

      frame += 1;
      if (!prefersReducedMotion) animation = requestAnimationFrame(draw);
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
      };
    };
    if (prefersReducedMotion) {
      window.addEventListener("resize", draw);
    } else {
      canvas.addEventListener("pointermove", handlePointer);
    }
    draw();
    return () => {
      cancelAnimationFrame(animation);
      if (prefersReducedMotion) {
        window.removeEventListener("resize", draw);
      } else {
        canvas.removeEventListener("pointermove", handlePointer);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-field" aria-hidden="true" />;
}

function ProjectVisual({ type }: { type: string }) {
  return (
    <div className={`project-visual visual-${type}`} aria-hidden="true">
      <div className="visual-grid" />
      <div className="visual-object">
        {Array.from({ length: type === "intelligence" ? 24 : 8 }).map((_, index) => (
          <i key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <span className="visual-axis visual-axis-x">X</span>
      <span className="visual-axis visual-axis-y">Y</span>
      <span className="visual-coordinate">{type === "heat" ? "08.612°N" : "SYS / 0"}</span>
    </div>
  );
}

function ParametricLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [span, setSpan] = useState(62);
  const [rise, setRise] = useState(48);
  const [porosity, setPorosity] = useState(31);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const rootStyle = getComputedStyle(document.documentElement);
    const lineColor = rootStyle.getPropertyValue("--canvas-line").trim() || "rgba(239,238,233,.28)";
    const signalColor = rootStyle.getPropertyValue("--signal").trim() || "#f2b13a";


    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, rect.width * ratio);
      canvas.height = Math.max(1, rect.height * ratio);
      context.scale(ratio, ratio);
      context.clearRect(0, 0, rect.width, rect.height);

      const rows = 17;
      const cols = 28;
      const pts: { x: number; y: number }[][] = [];
      for (let row = 0; row < rows; row += 1) {
        const current = [];
        for (let col = 0; col < cols; col += 1) {
          const u = col / (cols - 1);
          const v = row / (rows - 1);
          const arch = Math.sin(u * Math.PI) * (rise / 100) * rect.height * 0.58;
          const twist = Math.sin(v * Math.PI * 2 + u * 2.2) * porosity * 0.38;
          current.push({
            x: rect.width * (0.05 + u * 0.9) + twist * (v - 0.5),
            y: rect.height * (0.24 + v * 0.62) - arch + (v - 0.5) * span * 0.12,
          });
        }
        pts.push(current);
      }

      context.strokeStyle = lineColor;
      context.lineWidth = 0.75;
      pts.forEach((line, row) => {
        if (row % Math.max(1, Math.round(porosity / 12)) === 0) return;
        context.beginPath();
        line.forEach((point, i) =>
          i ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y),
        );
        context.stroke();
      });
      for (let col = 0; col < cols; col += 1) {
        context.beginPath();
        pts.forEach((line, i) =>
          i ? context.lineTo(line[col].x, line[col].y) : context.moveTo(line[col].x, line[col].y),
        );
        context.stroke();
      }
      context.fillStyle = signalColor;
      pts.forEach((line, row) =>
        line.forEach((point, col) => {
          if ((row * cols + col) % 37 === 0) {
            context.beginPath();
            context.arc(point.x, point.y, 2, 0, Math.PI * 2);
            context.fill();
          }
        }),
      );
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [span, rise, porosity]);

  const weight = Math.round(184 - rise * 0.42 - porosity * 0.31 + span * 0.17);
  const carbon = Math.max(19, Math.round(48 - rise * 0.18 - porosity * 0.22));

  return (
    <div className="lab-panel">
      <div className="lab-canvas-wrap">
        <canvas ref={canvasRef} className="lab-canvas" aria-label="Live parametric structural form" />
        <div className="lab-stamp">LIVE MODEL / ITERATION 07</div>
        <div className="lab-readout">FORM:FINDING / ACTIVE</div>
      </div>
      <div className="lab-controls">
        <div className="lab-control-heading">
          <span>PARAMETERS</span>
          <span>03 INPUTS</span>
        </div>
        <label>
          <span>SPAN <b>{span} m</b></span>
          <input type="range" min="35" max="90" value={span} onChange={(e) => setSpan(+e.target.value)} />
        </label>
        <label>
          <span>RISE <b>{rise}%</b></span>
          <input type="range" min="18" max="76" value={rise} onChange={(e) => setRise(+e.target.value)} />
        </label>
        <label>
          <span>POROSITY <b>{porosity}%</b></span>
          <input type="range" min="8" max="55" value={porosity} onChange={(e) => setPorosity(+e.target.value)} />
        </label>
        <div className="lab-metrics">
          <div><strong>{weight}</strong><span>kg/m² structure</span></div>
          <div><strong>−{carbon}%</strong><span>estimated carbon</span></div>
        </div>
        <p>Move the parameters. The geometry and performance estimate update together.</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [category, setCategory] = useState("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const filtered = useMemo(
    () => (category === "All" ? projects : projects.filter((project) => project.category === category)),
    [category],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [category]);

  useEffect(() => {
    document.body.style.overflow = activeProject ? "hidden" : "";
    const close = (event: KeyboardEvent) => event.key === "Escape" && setActiveProject(null);
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [activeProject]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Sunday Emmanuel Ajibade home"><span>✦</span> Sunday Emmanuel Ajibade</a>
        <div className="header-status"><i /> Civil Engineering · Computational Design</div>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#expertise">Expertise</a>
          <a href="#lab">Lab</a>
          <a href="#profile">About</a>
        </nav>
        <a className="contact-link" href="mailto:emmanuelajibade751@gmail.com">Contact <span>↗︎</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker">
          <span>Civil Engineering · Structures · Computation · Research</span>
          <span>Portfolio / 2026</span>
        </div>
        <HeroField />
        <h1 className="hero-title" aria-label="Design across systems">
          <div>DESIGN <em>↘︎</em></div>
          <div>ACROSS SYSTEMS</div>
        </h1>
        <div className="hero-bottom">
          <p>
            I connect <strong>architectural intent, structural buildability and computational intelligence</strong>—from first sketch to working system.
          </p>
          <a href="#work" className="round-link" aria-label="Explore selected work">↓</a>
          <div className="hero-meta"><span>UNIVERSITY OF IBADAN</span><b>IBADAN / NIGERIA</b></div>
        </div>
      </section>

      <section className="manifesto reveal">
        <div className="section-code">[ 00 / POSITION ]</div>
        <p>
          Design across <i>methods,</i>
          <br /><em>built to be felt.</em>
        </p>
        <div className="manifesto-side">
          Civil engineering, architectural exploration, computation and research—connected by a hands-on, systems-driven approach.
        </div>
        <div className="practice-grid" aria-label="Practice areas">
          {practiceAreas.map(([index, title, text, target]) => (
            <button
              key={title}
              onClick={() => {
                setCategory(target);
                document.getElementById("work")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
              }}
            >
              <span>{index}</span><strong>{title}</strong><small>{text}</small><i>↘︎</i>
            </button>
          ))}
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading reveal">
          <div className="section-code">[ 01 / SELECTED WORK ]</div>
          <h2>Projects that<br />think in systems.</h2>
          <div className="work-count">{String(projects.length).padStart(2, "0")} CASE STUDIES</div>
        </div>

        <div className="filters reveal" role="group" aria-label="Filter projects">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="project-grid" aria-live="polite">
          {filtered.map((project) => (
            <button
              className={`project-card ${project.size} reveal`}
              key={project.id}
              onClick={() => setActiveProject(project)}
              aria-label={`Open ${project.title} case study`}
            >
              <ProjectVisual type={project.visual} />
              <div className="project-meta">
                <div><span>{project.index}</span><span>{project.category}</span></div>
                <h3>{project.title}</h3>
                <div><span>{project.location}</span><span>{project.year}</span></div>
              </div>
              <div className="project-open">↗︎</div>
            </button>
          ))}
        </div>
      </section>

      <section className="research-feature" id="research">
        <div className="research-mast reveal">
          <div className="section-code">[ 02 / FEATURED RESEARCH ]</div>
          <div className="research-title">
            <span>Reading Lagos</span>
            <h2>The Subtractive<br /><em>City.</em></h2>
          </div>
          <div className="research-stamp">
            <span>LLL LABORATORY</span>
            <span>LAGOS · 2026</span>
            <b>CO-AUTHOR</b>
          </div>
        </div>

        <figure className="research-hero reveal">
          <img
            src={publicAsset("/research/subtractive-city/truckload-urbanism.jpg")}
            alt="Satellite mapping study comparing distributed land reclamation across Lagos with Eko Atlantic"
            width="2000"
            height="710"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <span>01 / TERRITORY</span>
            <span>Truckload Urbanism — reading reclamation as a city-scale material system.</span>
            <a href={publicAsset("/research/subtractive-city/truckload-urbanism.jpg")} target="_blank" rel="noreferrer">View full plate ↗︎</a>
          </figcaption>
        </figure>

        <div className="research-thesis reveal">
          <p>“A city is judged by what it has. This one is understood by what has been taken away.”</p>
          <div>
            <span>RESEARCH THESIS</span>
            <p>
              The study reads Lagos backwards: not as a catalogue of absences, but as a network of conversions. When public guarantees recede, citizens assemble parallel systems for land, movement, value and culture.
            </p>
          </div>
        </div>

        <div className="research-data reveal">
          <div>
            <span className="section-code">THE CITY / 12 LAYERS</span>
            <h3>Evidence before speculation.</h3>
          </div>
          <ol>
            {["Surface water", "Elevation", "Flood exposure", "Population density", "Built volume · FSI", "Ground coverage · GSI", "Building height", "Street density", "Night lights", "Relative wealth", "Urban growth", "The informal city"].map((layer, index) => (
              <li key={layer}><span>{String(index + 1).padStart(2, "0")}</span>{layer}</li>
            ))}
          </ol>
        </div>

        <div className="research-pair reveal">
          <figure>
            <img src={publicAsset("/research/subtractive-city/archipelago-before.jpg")} alt="Existing Lagos lagoon and bridge condition" width="1600" height="1066" loading="lazy" decoding="async" />
            <figcaption><span>BEFORE</span> The lagoon as dividing line</figcaption>
          </figure>
          <figure>
            <img src={publicAsset("/research/subtractive-city/archipelago-after.jpg")} alt="Speculative proposal for an inhabited Lagos archipelago" width="1264" height="843" loading="lazy" decoding="async" />
            <figcaption><span>AMPLIFIED</span> The Archipelago</figcaption>
          </figure>
        </div>

        <div className="research-gallery reveal">
          <div className="research-gallery-intro">
            <span className="section-code">THE NEW LAGOS / AMPLIFICATIONS</span>
            <h3>Not solutions dropped from above. Existing intelligence, made spatial.</h3>
            <p>Five propositions translate the research into civic space across water, learning, exchange and culture.</p>
          </div>
          {[
            ["green-makoko.jpg", "Green Makoko", "Productive landscapes on water", 1264, 843],
            ["school-over-makoko.jpg", "School over Makoko", "Learning as shared infrastructure", 1365, 768],
            ["pattern-junction.jpg", "Pattern Junction", "Street commerce as civic plan", 1488, 714],
            ["transmitter.jpg", "The Transmitter", "Nollywood as urban institution", 1424, 746],
          ].map(([image, title, caption, width, height], index) => (
            <figure className={`research-gallery-item item-${index + 1}`} key={title}>
              <img src={publicAsset("/research/subtractive-city/" + image)} alt={title + " speculative urban proposal"} width={width} height={height} loading="lazy" decoding="async" />
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span><b>{title}</b><small>{caption}</small></figcaption>
            </figure>
          ))}
        </div>

        <div className="research-colophon reveal">
          <div><span>ROLE</span><strong>Co-author · Research · Mapping</strong></div>
          <div><span>PUBLICATION</span><strong>LLL Laboratory / Lex te Loo Architects</strong></div>
          <div><span>TEAM</span><strong>Seven-person international research studio</strong></div>
          <a href="https://lexteloo.com/think-tank/research/the-subtractive-city" target="_blank" rel="noreferrer">
            Read the full research <span>↗︎</span>
          </a>
        </div>
      </section>

      <section className="lab-section" id="lab">
        <div className="section-heading invert reveal">
          <div className="section-code">[ 03 / SYSTEMS LAB ]</div>
          <h2>Don’t show the outcome.<br /><em>Show the intelligence.</em></h2>
          <p>A live form-finding study. Adjust the structure and watch design intent become measurable.</p>
        </div>
        <ParametricLab />
      </section>

      <section className="capabilities reveal" id="expertise">
        <div className="section-code">[ 04 / CAPABILITY STACK ]</div>
        <h2>One practice.<br />Multiple resolutions.</h2>
        <div className="capability-list">
          {[
            ["01", "Architecture", "Spatial strategy, concept design, climate response, visualization"],
            ["02", "Computational Design", "Parametric systems, optimization, geometry, fabrication logic"],
            ["03", "Structures", "Connections, detailing, constructability, load-path reasoning"],
            ["04", "AI + Research", "Vibe coding, plugins, workflows, mapping, publications"],
          ].map(([index, title, text]) => (
            <div className="capability-row" key={index}>
              <span>{index}</span><h3>{title}</h3><p>{text}</p><i>↗︎</i>
            </div>
          ))}
        </div>
      </section>

      <section className="process-section">
        <div className="process-top reveal">
          <div className="section-code">[ 05 / OPERATING SYSTEM ]</div>
          <p>Every project moves between the physical, the analytical and the imaginable.</p>
        </div>
        <div className="process-line reveal">
          {[
            ["01", "Observe", "Context before answers"],
            ["02", "Model", "Make complexity visible"],
            ["03", "Simulate", "Test consequences early"],
            ["04", "Synthesize", "Find the elegant constraint"],
            ["05", "Communicate", "Make the work undeniable"],
          ].map(([number, title, text]) => (
            <div key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </section>

      <section className="profile-section" id="profile">
        <div className="profile-grid reveal">
          <div className="profile-portrait" aria-label="Portrait placeholder ready for your photograph">
            <span>PORTRAIT / DROP IMAGE HERE</span>
            <div className="portrait-mark">SEA</div>
          </div>
          <div className="profile-copy">
            <div className="section-code">[ 06 / PROFILE ]</div>
            <h2>Generalist by range.<br />Specialist by depth.</h2>
            <p className="profile-lead">
              I’m a Civil Engineering student at the University of Ibadan, connecting structural thinking with computational design and urban research.
            </p>
            <p>
              Based in Ibadan, I work across parametric facade systems, structural detailing, urban research and AI-assisted design workflows—moving between Grasshopper definitions, connection details and research papers as one integrated practice.
            </p>
            <div className="profile-facts">
              <div><span>EDUCATION</span><b>Civil Engineering · University of Ibadan</b></div>
              <div><span>BASE</span><b>Ibadan, Nigeria</b></div>
              <div><span>TOOLS</span><b>Rhino / Grasshopper / C#</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-top"><span>Open to design, structural, computational and research collaborations.</span><span>Ibadan / Nigeria</span></div>
        <a href="mailto:emmanuelajibade751@gmail.com" className="contact-cta">
          LET’S WORK <span>↗︎</span>
        </a>
        <div className="contact-footer">
          <span>© 2026 Sunday Emmanuel Ajibade</span>
          <span>Civil Engineering Student · Computational Designer · Researcher</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </section>

      {activeProject && (
        <div className="project-overlay" role="dialog" aria-modal="true" aria-labelledby="project-title" onMouseDown={(event) => event.target === event.currentTarget && setActiveProject(null)}>
          <aside className="project-drawer">
            <button className="drawer-close" onClick={() => setActiveProject(null)} aria-label="Close case study" autoFocus>Close ×</button>
            <div className="drawer-index">CASE STUDY / {activeProject.index}</div>
            <ProjectVisual type={activeProject.visual} />
            <div className="drawer-content">
              <div className="drawer-category">{activeProject.category} · {activeProject.year}</div>
              <h2 id="project-title">{activeProject.title}</h2>
              <p>{activeProject.summary}</p>
              <div className="drawer-impact"><span>MEASURED IMPACT</span><strong>{activeProject.impact}</strong></div>
              <div className="drawer-tools">
                {activeProject.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
              <p className="drawer-note">This case-study template is ready for your drawings, photography, process diagrams and full project narrative.</p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
