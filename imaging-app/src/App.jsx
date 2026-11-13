// App.jsx - the whole page.
// It keeps one piece of state, the selected type ("All", "X-ray", ...),
// and uses it to decide which cards to show.
import { useEffect, useState } from "react";
import { imaging } from "./data/imaging.js";
import FilterBar from "./components/FilterBar.jsx";
import ImagingCard from "./components/ImagingCard.jsx";
import { PAGES } from "../../shared/pages.js";

// Which page this is, for the nav bar
const PAGE = "imaging";

// Filter options come from the data itself, in the order they first appear
const TYPES = ["All", ...new Set(imaging.map((scan) => scan.type))];

export default function App() {
  // On narrow screens the nav scrolls sideways: bring this page's link into view
  useEffect(() => {
    document
      .querySelector('.site-nav [aria-current="page"]')
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, []);

  const [selectedType, setSelectedType] = useState("All");

  const visible =
    selectedType === "All"
      ? imaging
      : imaging.filter((scan) => scan.type === selectedType);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="../" aria-label="Sanchit Thakrar, home">ST</a>
        {/* Links to the home page and every project; this page is underlined */}
        <nav className="site-nav" aria-label="Site">
          {PAGES.map((p) => (
            <a
              key={p.key}
              href={`../${p.path}`}
              title={p.title}
              aria-current={p.key === PAGE ? "page" : undefined}
            >
              {p.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="page">
        <p className="eyebrow">React project</p>
        <h1>React Foundation - Medical Imaging Explorer</h1>
        <p className="lede">
          What each scan shows, how much radiation it uses, and how long it
          takes.
        </p>

        <FilterBar
          types={TYPES}
          selected={selectedType}
          onSelect={setSelectedType}
          shown={visible.length}
          total={imaging.length}
        />

        <div className="grid">
          {visible.map((scan) => (
            <ImagingCard key={scan.id} scan={scan} />
          ))}
        </div>
      </main>
    </>
  );
}
