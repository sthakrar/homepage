// App.jsx - the whole page: intro, summary numbers and the bar chart.
// The chart's width follows its container, so it fits phones and desktops.
import { useEffect, useRef, useState } from "react";
import { sum } from "d3";
import { data } from "./data/students.js";
import Barplot from "./components/Barplot.jsx";

// Largest first, so the chart reads top to bottom
const sorted = [...data].sort((a, b) => b.students - a.students);
const total = sum(data, (d) => d.students);

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
        <h1>Students by Country</h1>
        <p className="lede">
          How many students from each country joined the first cohort of a
          data visualization course.
        </p>

        <p className="summary">
          {data.length} countries · {total} students
        </p>

        <section className="chart-card">
          <div className="chart-box" ref={boxRef}>
            {width > 0 && <Barplot data={sorted} width={width} />}
          </div>
          <p className="note">
            Countries with 3 or more students. Built with D3 for the scales and
            React for the SVG.
          </p>
        </section>
      </main>
    </>
  );
}
