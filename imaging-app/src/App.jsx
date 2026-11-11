// App.jsx - the whole page.
// It keeps one piece of state, the selected type ("All", "X-ray", ...),
// and uses it to decide which cards to show.
import { useState } from "react";
import { imaging } from "./data/imaging.js";
import FilterBar from "./components/FilterBar.jsx";
import ImagingCard from "./components/ImagingCard.jsx";

// Filter options come from the data itself, in the order they first appear
const TYPES = ["All", ...new Set(imaging.map((scan) => scan.type))];

export default function App() {
  const [selectedType, setSelectedType] = useState("All");

  const visible =
    selectedType === "All"
      ? imaging
      : imaging.filter((scan) => scan.type === selectedType);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="../" aria-label="Sanchit Thakrar, home">ST</a>
        <nav className="site-nav">
          <a href="../#projects">Projects</a>
        </nav>
      </header>

      <main className="page">
        <p className="eyebrow">React project</p>
        <h1>Medical Imaging Explorer</h1>
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
