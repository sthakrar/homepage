// App.jsx - the page: intro, then a chart card with the donut and its legend.
// App holds one piece of state, the reason being hovered or focused, and
// shares it with both the donut and the legend so they highlight together.
import { useEffect, useRef, useState } from "react";
import { sum } from "d3";
import { data, snapshot, SOURCES } from "./data/terminations.js";
import Donut from "./components/Donut.jsx";
import Legend from "./components/Legend.jsx";

const total = sum(data, (d) => d.count);
const accrual = data.find((d) => d.key === "accrual");
const fmt = (n) => n.toLocaleString("en-US");
const pct = (share) => `${Math.round(share * 100)}%`;
const fromYear = snapshot.window.from.slice(0, 4);
const toYear = snapshot.window.to.slice(0, 4);

// "13 November 2026"
const fetchedOn = new Date(snapshot.fetched).toLocaleDateString("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});

export default function App() {
  const [active, setActive] = useState(null);

  // Size the donut to its box: up to 320px, smaller on narrow screens
  const boxRef = useRef(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setSize(Math.min(320, entry.contentRect.width - 12))
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
        <h1>Why Trials Stop Early</h1>
        <p className="lede">
          Why {fmt(total)} clinical trials on ClinicalTrials.gov stopped early
          in {fromYear}-{toYear}, compared with a 2015 study.
        </p>

        <figure className="chart-card">
          <figcaption>
            <p className="chart-title">
              Too few patients is still the top reason: {pct(accrual.count / total)} of
              trials, down from {pct(accrual.share2015)} in 2015
            </p>
            <p className="chart-subtitle">
              Reasons sponsors gave for {fmt(total)} trials marked terminated,
              with completion dates in {fromYear}-{toYear}
            </p>
          </figcaption>

          <div className="chart-body">
            <div className="donut-box" ref={boxRef}>
              {size > 0 && (
                <Donut
                  data={data}
                  size={size}
                  total={total}
                  active={active}
                  onActive={setActive}
                />
              )}
            </div>
            <Legend data={data} total={total} active={active} onActive={setActive} />
          </div>

          <footer className="chart-footer">
            <p>
              Data:{" "}
              <a href={SOURCES.api.url} target="_blank" rel="noopener">
                {SOURCES.api.label}
              </a>
              , downloaded {fetchedOn}. Each trial's free-text reason was sorted
              into one category by keyword rules (
              <a href={SOURCES.rules.url} target="_blank" rel="noopener">
                {SOURCES.rules.label}
              </a>
              ); checked by hand against random samples, the rules agreed about
              88% of the time, and most misses fall into "Other".
            </p>
            <p>
              2015 column: share of 905 trials (data to 2013) in{" "}
              <a href={SOURCES.study2015.url} target="_blank" rel="noopener">
                {SOURCES.study2015.label}
              </a>
              , sorted by hand. "No reason given" fell because ClinicalTrials.gov
              now requires a reason. Hover a slice or a row for details.
            </p>
          </footer>
        </figure>
      </main>
    </>
  );
}
