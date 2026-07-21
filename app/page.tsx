"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
    id: "adaptive-civic",
    index: "01",
    title: "Adaptive Civic Canopy",
    category: "Architecture",
    year: "2026",
    location: "Lagos, NG",
    summary:
      "A porous civic roof that turns solar exposure, rainfall and footfall into a responsive public microclimate.",
    impact: "38% less peak solar gain",
    tools: ["Rhino", "Grasshopper", "Ladybug", "Python"],
    visual: "canopy",
    size: "wide",
  },
  {
    id: "delta-link",
    index: "02",
    title: "Delta Link",
    category: "Civil Systems",
    year: "2025",
    location: "Niger Delta, NG",
    summary:
      "A low-carbon pedestrian crossing system optimized for flood cycles, local fabrication and staged assembly.",
    impact: "22% embodied-carbon reduction",
    tools: ["Karamba3D", "ETABS", "GIS", "Life-cycle analysis"],
    visual: "bridge",
    size: "standard",
  },
  {
    id: "site-intelligence",
    index: "03",
    title: "Site Intelligence Engine",
    category: "AI Research",
    year: "2026",
    location: "Research",
    summary:
      "A multimodal research agent that reads planning documents, site imagery and climate data to surface design risks early.",
    impact: "4.6× faster option review",
    tools: ["Vision models", "RAG", "Python", "Geospatial data"],
    visual: "intelligence",
    size: "tall",
  },
  {
    id: "market-fabric",
    index: "04",
    title: "Market Fabric 2.0",
    category: "Urban Research",
    year: "2025",
    location: "Accra, GH",
    summary:
      "A rules-based growth framework for informal markets that protects circulation, shade and social density.",
    impact: "1,840 movement traces modeled",
    tools: ["GIS", "Space syntax", "Agent simulation", "Field research"],
    visual: "fabric",
    size: "standard",
  },
  {
    id: "material-minimum",
    index: "05",
    title: "Material Minimum",
    category: "Computational Design",
    year: "2026",
    location: "Prototype 03",
    summary:
      "Topology-driven masonry shells that transfer structural intelligence into low-tech construction sequences.",
    impact: "31% less material by volume",
    tools: ["COMPAS", "Finite elements", "Robotic paths", "Fabrication"],
    visual: "shell",
    size: "wide",
  },
  {
    id: "heat-atlas",
    index: "06",
    title: "Heat Atlas / 08°N",
    category: "AI Research",
    year: "2024—26",
    location: "West Africa",
    summary:
      "A machine-assisted atlas translating urban heat, surface material and canopy data into neighborhood-scale action.",
    impact: "12 cities, one comparable model",
    tools: ["Remote sensing", "ML", "QGIS", "Data storytelling"],
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

function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

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
      context.strokeStyle = "rgba(17,17,17,.34)";
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

      context.fillStyle = "#ff4d24";
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
      animation = requestAnimationFrame(draw);
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
      };
    };
    canvas.addEventListener("pointermove", handlePointer);
    draw();
    return () => {
      cancelAnimationFrame(animation);
      canvas.removeEventListener("pointermove", handlePointer);
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

      context.strokeStyle = "rgba(244,241,231,.52)";
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
      context.fillStyle = "#ff4d24";
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
        <a className="brand" href="#top" aria-label="EM home">EM<span>—01</span></a>
        <div className="header-status"><i /> Available for ambitious work</div>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#lab">Lab</a>
          <a href="#profile">Profile</a>
        </nav>
        <a className="contact-link" href="mailto:hello@example.com">Start a project <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker">
          <span>Architecture / Computation / Civil Systems / AI</span>
          <span>Based in Lagos · Working globally</span>
        </div>
        <HeroField />
        <div className="hero-title" aria-label="Built Intelligence">
          <div>BUILT <em>↘</em></div>
          <div>INTELLIGENCE</div>
        </div>
        <div className="hero-bottom">
          <p>
            I design <strong>buildings, systems and tools</strong> for a world where
            physical and computational intelligence are inseparable.
          </p>
          <a href="#work" className="round-link" aria-label="Explore selected work">↓</a>
          <div className="hero-meta"><span>PORTFOLIO</span><b>2024—26</b></div>
        </div>
      </section>

      <section className="manifesto reveal">
        <div className="section-code">[ 00 / POSITION ]</div>
        <p>
          Not architecture <i>or</i> engineering <i>or</i> AI.
          <br />The interesting work lives <em>between them.</em>
        </p>
        <div className="manifesto-side">
          From first principle to finished narrative: research, modeling, simulation,
          prototyping and communication in one connected practice.
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
              <div className="project-open">↗</div>
            </button>
          ))}
        </div>
      </section>

      <section className="lab-section" id="lab">
        <div className="section-heading invert reveal">
          <div className="section-code">[ 02 / SYSTEMS LAB ]</div>
          <h2>Don’t show the outcome.<br /><em>Show the intelligence.</em></h2>
          <p>A live form-finding study. Adjust the structure and watch design intent become measurable.</p>
        </div>
        <ParametricLab />
      </section>

      <section className="capabilities reveal">
        <div className="section-code">[ 03 / CAPABILITY STACK ]</div>
        <h2>One practice.<br />Multiple resolutions.</h2>
        <div className="capability-list">
          {[
            ["01", "Architecture", "Spatial strategy, concept design, climate response, visualization"],
            ["02", "Computational Design", "Parametric systems, optimization, geometry, fabrication logic"],
            ["03", "Civil Engineering", "Structural reasoning, infrastructure, constructability, performance"],
            ["04", "AI + Research", "Agents, multimodal workflows, geospatial analysis, decision tools"],
          ].map(([index, title, text]) => (
            <div className="capability-row" key={index}>
              <span>{index}</span><h3>{title}</h3><p>{text}</p><i>↗</i>
            </div>
          ))}
        </div>
      </section>

      <section className="process-section">
        <div className="process-top reveal">
          <div className="section-code">[ 04 / OPERATING SYSTEM ]</div>
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
            <div className="portrait-mark">EM</div>
          </div>
          <div className="profile-copy">
            <div className="section-code">[ 05 / PROFILE ]</div>
            <h2>Generalist by range.<br />Specialist by depth.</h2>
            <p className="profile-lead">
              I work across architecture, computational design, civil engineering and AI research—connecting disciplines that too often arrive in sequence.
            </p>
            <p>
              The aim is simple: ask better questions, build sharper models, and create work whose intelligence can be felt before it is explained.
            </p>
            <div className="profile-facts">
              <div><span>BASE</span><b>Lagos / Global</b></div>
              <div><span>FOCUS</span><b>Built intelligence</b></div>
              <div><span>MODE</span><b>Collaborative / Independent</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-top"><span>Have a difficult problem?</span><span>Good.</span></div>
        <a href="mailto:hello@example.com" className="contact-cta">
          LET’S BUILD <span>↗</span>
        </a>
        <div className="contact-footer">
          <span>© 2026 EM—01</span>
          <span>Architecture · Computation · Civil Systems · AI</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </section>

      {activeProject && (
        <div className="project-overlay" role="dialog" aria-modal="true" aria-labelledby="project-title" onMouseDown={(event) => event.target === event.currentTarget && setActiveProject(null)}>
          <aside className="project-drawer">
            <button className="drawer-close" onClick={() => setActiveProject(null)} aria-label="Close case study">Close ×</button>
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
