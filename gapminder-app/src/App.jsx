// App.jsx - the page: intro, then a chart card with the scale buttons, the
// bubble plot and its legends. App holds the divider position (frac) and
// shares it with the plot (dragging, keyboard) and the buttons (snapping).
import { useEffect, useRef, useState } from "react";
import { sum, format } from "d3";
import { data, CONTINENTS, SOURCE } from "./data/gapminder.js";
import BubblePlot, { makeRadius, THRESHOLD, dollars, people } from "./components/BubblePlot.jsx";
import ProjectsMenu from "../../shared/ProjectsMenu.jsx";

// Which page this is, for the Projects menu
const PAGE = "gapminder";

const under = data.filter((d) => d.gdpPercap < THRESHOLD);
const popShare = sum(under, (d) => d.pop) / sum(data, (d) => d.pop);
const pct = format(".0%");

// The three snap positions for the buttons
const SNAPS = [
  { label: "Log", frac: 1 },
  { label: "Split", frac: 0.5 },
  { label: "Linear", frac: 0 },
];

// Same margin as the plot's left/right, so the size legend matches its bubbles
const PLOT_SIDES = 48 + 18;

// Countries grouped by continent, A-Z, for the filter
const BY_CONTINENT = CONTINENTS.map((c) => ({
  continent: c.key,
  countries: data
    .filter((d) => d.continent === c.key)
    .map((d) => d.country)
    .sort(),
}));

// Rank of a country (1 = highest) for one field
const rankOf = (country, field) =>
  [...data].sort((a, b) => b[field] - a[field]).findIndex((d) => d.country === country) + 1;

export default function App() {
  const [frac, setFrac] = useState(0.5);
  const [selected, setSelected] = useState(null);

  // Measure the chart box so the SVG fills its width
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, []);

  // Glide the divider to a snap position (or jump, if motion is reduced)
  const frame = useRef(0);
  const glideTo = (target) => {
    cancelAnimationFrame(frame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrac(target);
      return;
    }
    const start = frac;
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / 450);
      const ease = 1 - Math.pow(1 - t, 3);
      setFrac(start + (target - start) * ease);
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  // Dragging or the keyboard cancels any glide in progress
  const moveTo = (f) => {
    cancelAnimationFrame(frame.current);
    setFrac(f);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="../" aria-label="Sanchit Thakrar, home">ST</a>
        <ProjectsMenu current={PAGE} />
      </header>

      <main className="page">
        <p className="eyebrow">D3 project · Cohort 2</p>
        <h1>Wealth &amp; Health, Log vs Linear</h1>
        <p className="lede">
          Life expectancy against income for {data.length} countries in 2007,
          from the Gapminder data. The same chart tells two different stories
          depending on how you draw the income axis.
        </p>

        <figure className="chart-card">
          <figcaption>
            <p className="chart-title">
              {under.length} of {data.length} countries, home to{" "}
              {pct(popShare)} of people, had a GDP per capita under $10,000
            </p>
            <p className="chart-subtitle">
              A linear axis crowds them against the left edge. A log axis
              gives each tenfold step in income the same room, so you can see
              how quickly lifespans rise as poor countries get a little richer.
            </p>
          </figcaption>

          <div className="chart-controls">
            <div className="controls-left">
              <label className="country-filter">
                <span className="legend-label">Find a country</span>
                <select
                  value={selected ?? ""}
                  onChange={(e) => setSelected(e.target.value || null)}
                >
                  <option value="">All countries</option>
                  {BY_CONTINENT.map((g) => (
                    <optgroup key={g.continent} label={g.continent}>
                      {g.countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <span className="hint">Drag the line to compare · hover a bubble for details</span>
            </div>
            <div className="segmented" role="group" aria-label="Snap the divider">
              {SNAPS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  aria-pressed={Math.abs(frac - s.frac) < 0.005}
                  onClick={() => glideTo(s.frac)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-box" ref={boxRef}>
            {width > 0 && (
              <BubblePlot
                width={width}
                frac={frac}
                onFrac={moveTo}
                selected={selected}
                onSelect={setSelected}
              />
            )}
          </div>

          {selected && <CountryCard name={selected} onClear={() => setSelected(null)} />}

          <div className="legends">
            <div>
              <span className="legend-label">Continent</span>
              <ul className="continent-legend">
                {CONTINENTS.map((c) => (
                  <li key={c.key}>
                    <span className="swatch" style={{ background: c.color }} />
                    {c.key}
                  </li>
                ))}
              </ul>
            </div>
            {width > 0 && <SizeLegend boundsW={width - PLOT_SIDES} />}
          </div>

          <footer className="chart-footer">
            <p>
              Data:{" "}
              <a href={SOURCE.url} target="_blank" rel="noopener">
                {SOURCE.label}
              </a>
              , year 2007. GDP per capita is in inflation-adjusted US dollars.
              Bubble area is proportional to population.
            </p>
            <p>
              Swaziland is now called Eswatini. The low life expectancies in
              southern Africa (Swaziland, Botswana, South Africa) reflect the
              HIV epidemic of the 2000s.
            </p>
          </footer>
        </figure>
      </main>
    </>
  );
}

// Where the selected country falls: its numbers, its rank among all 142,
// and how far across each kind of axis it sits
function CountryCard({ name, onClear }) {
  const d = data.find((c) => c.country === name);
  const color = CONTINENTS.find((c) => c.key === d.continent).color;
  const n = data.length;
  const logPos = Math.log(d.gdpPercap / 200) / Math.log(60000 / 200);
  const linPos = d.gdpPercap / 52000;
  const stats = [
    { label: "Life expectancy", value: `${d.lifeExp.toFixed(1)} yrs`, rank: rankOf(name, "lifeExp") },
    { label: "GDP per capita", value: dollars(d.gdpPercap), rank: rankOf(name, "gdpPercap") },
    { label: "Population", value: people(d.pop), rank: rankOf(name, "pop") },
  ];

  return (
    <section className="country-card" aria-live="polite">
      <div className="country-card-head">
        <p className="country-card-name">
          <span className="swatch" style={{ background: color }} />
          {d.country}
          <span className="country-card-continent">{d.continent}</span>
        </p>
        <button type="button" className="clear-button" onClick={onClear}>
          Clear ✕
        </button>
      </div>
      <dl className="country-stats">
        {stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>
              <strong>{s.value}</strong>
              <span>#{s.rank} of {n}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="country-card-note">
        On the GDP axis it sits <strong>{Math.round(logPos * 100)}%</strong> of the way
        across on a log scale, but only <strong>{Math.round(linPos * 100)}%</strong> on a
        linear one.
      </p>
    </section>
  );
}

// Nested circles for 10M, 100M and 1B people, the same scale as the plot
function SizeLegend({ boundsW }) {
  const r = makeRadius(boundsW);
  const steps = [
    { pop: 1e9, label: "1B" },
    { pop: 1e8, label: "100M" },
    { pop: 1e7, label: "10M" },
  ];
  const big = r(steps[0].pop);
  const base = big * 2 + 1;   // y of the circles' shared bottom

  // Each label sits level with its circle's top, but at least 11px below
  // the label above it, so small circles' labels don't overlap
  let prev = -Infinity;
  const rows = steps.map((s) => {
    const rad = r(s.pop);
    const top = base - 2 * rad;
    prev = Math.max(top, prev + 11);
    return { ...s, rad, top, labelY: prev };
  });

  const w = big * 2 + 44;
  const h = Math.max(base + 1, prev + 6);

  return (
    <div className="size-legend">
      <span className="legend-label">Population</span>
      <svg width={w} height={h} aria-hidden="true">
        {rows.map((s) => (
          <g key={s.label}>
            <circle cx={big} cy={base - s.rad} r={s.rad} />
            <polyline
              points={`${big},${s.top} ${big * 2 + 2},${s.top} ${big * 2 + 6},${s.labelY}`}
            />
            <text x={big * 2 + 9} y={s.labelY} dy="0.32em">{s.label}</text>
          </g>
        ))}
      </svg>
      <span className="sr-only">Bubble area shows population: 10 million, 100 million and 1 billion.</span>
    </div>
  );
}
