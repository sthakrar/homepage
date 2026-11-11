// SourcesInfo.jsx - an "i" button that shows where the numbers and images
// come from. The panel opens on hover and keyboard focus (in CSS), and on
// tap or click (the `open` state), so it works on touch screens too.
import { useEffect, useRef, useState } from "react";
import { imaging, DOSE_SOURCES } from "../data/imaging.js";

export default function SourcesInfo() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // While open, close on Esc or on a click anywhere outside
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <div className={open ? "info is-open" : "info"} ref={ref}>
      <button
        type="button"
        className="info-button"
        aria-label="Sources"
        aria-expanded={open}
        aria-controls="sources-panel"
        onClick={() => setOpen(!open)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 11v6M12 7.5v.01" />
        </svg>
      </button>

      <div className="info-panel" id="sources-panel" role="note">
        <p className="info-title">Sources</p>
        <ul>
          {Object.entries(DOSE_SOURCES).map(([key, source]) => (
            <li key={key}>
              <a href={source.url} target="_blank" rel="noopener">
                {source.label}
              </a>
              <span className="info-scans">
                {imaging
                  .filter((scan) => scan.doseSource === key)
                  .map((scan) => scan.name)
                  .join(", ")}
              </span>
            </li>
          ))}
        </ul>
        <p>
          Doses are typical values for an average adult and vary with the
          patient, machine and protocol. "Like background" assumes about 3 mSv
          a year of natural radiation. Scan times are rough typical values.
        </p>
        <p>
          Images are from Wikimedia Commons, credited on each card, and shown
          in greyscale and cropped (some inverted). Hover a card for the
          original colours.
        </p>
      </div>
    </div>
  );
}
