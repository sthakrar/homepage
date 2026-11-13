// App.jsx - the page: intro, then the chart recreated as in the original
// (red rule, title, subtitle, chart, sources and credit). The chart's width follows its
// container, so it fits phones and desktops.
import { useEffect, useRef, useState } from "react";
import { data } from "./data/infections.js";
import Barplot from "./components/Barplot.jsx";

// Largest first, in the original chart's order (the dataset lists the
// diseases smallest first, so reversing it gives Brucella at the top and
// Dengue above Tularemia, as in the original)
const sorted = [...data].reverse();

export default function App() {
  // Measure the chart box and re-measure when the window resizes
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="../" aria-label="Sanchit Thakrar, home">ST</a>
        <nav className="site-nav">
          <a href="../#projects">Projects</a>
        </nav>
      </header>

      <main className="page">
        <p className="eyebrow">D3 project · Cohort 2</p>
        <h1>Escape Artists</h1>
        <p className="lede">
          Laboratory-acquired infections by disease, 1970-2021.
        </p>

        {/* The chart, laid out like the original */}
        <figure className="chart-card">
          {/* Red rule across the top, with a short red tag at its left */}
          <div className="chart-rule" aria-hidden="true" />
          <figcaption>
            <p className="chart-title">Escape artists</p>
            <p className="chart-subtitle">
              Number of laboratory-acquired infections, 1970-2021
            </p>
          </figcaption>

          <div className="chart-box" ref={boxRef}>
            {width > 0 && <Barplot data={sorted} width={width} />}
          </div>

          <footer className="chart-footer">
            <p>
              Sources: Laboratory-Acquired Infection Database; American
              Biological Safety Association
            </p>
            <p>The Economist</p>
          </footer>
        </figure>
      </main>
    </>
  );
}
