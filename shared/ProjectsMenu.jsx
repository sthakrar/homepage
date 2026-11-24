// ProjectsMenu.jsx - the "Projects" dropdown in the top right of every
// project page. It lists every project from pages.js and marks the page
// you're on. Each app renders <ProjectsMenu current="its-key" />.
//
// It opens on click and closes on a second click, a click outside, Escape
// (which puts focus back on the button), or when focus leaves the menu.
//
// This file lives outside the apps, so each app's vite.config.js lists
// react under resolve.dedupe: that makes "react" resolve from the app's
// own node_modules.
import { useEffect, useId, useRef, useState } from "react";
import { PAGES } from "./pages.js";
import "./nav.css";

export default function ProjectsMenu({ current }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const panelId = useId();

  const home = PAGES.find((p) => p.key === "home");
  const projects = PAGES.filter((p) => p.key !== "home");

  // While open, close on a click outside or on Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Close when keyboard focus moves out of the menu
  const onBlur = (e) => {
    if (!rootRef.current.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <nav className="site-menu" aria-label="Site" ref={rootRef} onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        Projects
        <svg className="chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1.5 3.5 L5 7 L8.5 3.5" />
        </svg>
      </button>

      <div id={panelId} className="menu-panel" hidden={!open}>
        <ul>
          {projects.map((p) => (
            <li key={p.key}>
              <a
                href={`../${p.path}`}
                aria-current={p.key === current ? "page" : undefined}
              >
                <span className="menu-num">{p.label.replace("Project ", "")}</span>
                <span className="menu-title">{p.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="menu-home" href={`../${home.path}`}>
          ← {home.title}
        </a>
      </div>
    </nav>
  );
}
