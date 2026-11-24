// App.jsx - the dashboard. App holds the shared state and hands it to
// every card, so the four charts stay linked:
//   country  picked in cards 1-3, or by clicking a bar in card 4
//   year     picked with the sliders, or by clicking a time chart
//   mode     TWh or share, for the stacked area
//   active   hovered source, shared by the donut and its list
import { useState } from "react";
import ProjectsMenu from "../../shared/ProjectsMenu.jsx";
import {
  SOURCES, GROUPS, LAST_YEAR,
  seriesFor, rowFor, countriesIn, groupShare, share, twh, pct,
} from "./data/sources.js";
import { Deck, Card } from "./components/Deck.jsx";
import { CountrySelect, YearSlider, Toggle } from "./components/Controls.jsx";
import { ResponsiveStackedArea } from "./components/StackedArea.jsx";
import { ResponsiveDonut } from "./components/Donut.jsx";
import { ResponsiveLineChart } from "./components/LineChart.jsx";
import { ResponsiveBarChart } from "./components/BarChart.jsx";

// Which page this is, for the Projects menu
const PAGE = "energy";

// Headline numbers for the World, shown in the intro
const world = seriesFor("World");
const w0 = world[0];
const wN = world.at(-1);
const w2015 = rowFor("World", 2015);
const solarWind = (r) => share(r, "solar") + share(r, "wind");
const KPIS = [
  {
    value: `${twh(wN.primary_energy)} TWh`,
    label: `energy used worldwide in ${wN.year}`,
    note: `${(wN.primary_energy / w0.primary_energy).toFixed(1)}× ${w0.year}`,
  },
  {
    value: pct(groupShare(wN, "fossil")),
    label: "still came from coal, oil and gas",
    note: `${pct(groupShare(w0, "fossil"))} in ${w0.year}`,
  },
  {
    value: pct(solarWind(wN), 1),
    label: "from solar and wind",
    note: `${pct(solarWind(w2015), 1)} in 2015`,
  },
  {
    value: pct(rowFor("China", LAST_YEAR).primary_energy / wN.primary_energy),
    label: "of the world's energy used in China",
    note: `${pct(rowFor("United States", LAST_YEAR).primary_energy / wN.primary_energy)} in the US`,
  },
];

export default function App() {
  const [country, setCountry] = useState("World");
  const [year, setYear] = useState(LAST_YEAR);
  const [mode, setMode] = useState("share");
  const [active, setActive] = useState(null);

  const rows = seriesFor(country);
  const first = rows[0];
  const last = rows.at(-1);
  // Russia starts in 1985: show its first year if an earlier one is picked
  const shownYear = Math.max(year, first.year);
  const row = rowFor(country, shownYear);
  const place = country === "World" ? "the world" : country;

  const countryControl = <CountrySelect value={country} onChange={setCountry} />;
  const yearControl = <YearSlider value={year} onChange={setYear} />;

  return (
    <>
      <header className="site-header">
        <a className="brand" href="../" aria-label="Sanchit Thakrar, home">ST</a>
        <ProjectsMenu current={PAGE} />
      </header>

      <main className="page">
        <section className="hero">
          <p className="eyebrow">D3 project · Cohort 2 · Responsive dashboard</p>
          <h1>Sixty Years of World Energy</h1>
          <p className="lede">
            How the world's energy mix changed from {w0.year} to {wN.year}, for
            the World and the 28 countries that use the most energy. Pick a
            country or a year on any card and every chart follows.
          </p>

          <ul className="kpis">
            {KPIS.map((k) => (
              <li key={k.label} className="kpi">
                <span className="kpi-value">{k.value}</span>
                <span className="kpi-label">{k.label}</span>
                <span className="kpi-note">{k.note}</span>
              </li>
            ))}
          </ul>

          <p className="scroll-cue" aria-hidden="true">Scroll to stack the cards ↓</p>
        </section>

        <Deck>
          <Card
            index={0}
            total={4}
            title="The mix over time"
            subtitle={`Coal, oil and gas supplied ${pct(groupShare(first, "fossil"))} of ${place}'s energy in ${first.year} and ${pct(groupShare(last, "fossil"))} in ${last.year}.`}
            controls={
              <>
                {countryControl}
                <Toggle
                  label="Show"
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: "share", label: "Share" },
                    { value: "twh", label: "TWh" },
                  ]}
                />
              </>
            }
            aside={<ThenNow first={first} last={last} />}
          >
            <ResponsiveStackedArea rows={rows} mode={mode} year={shownYear} onYear={setYear} />
          </Card>

          <Card
            index={1}
            total={4}
            title="One year up close"
            subtitle={
              shownYear !== year
                ? `No data for ${country} before ${first.year}, so this shows ${shownYear}.`
                : `${twh(row.primary_energy)} TWh used in ${place} in ${shownYear}: ${pct(groupShare(row, "fossil"))} fossil, ${pct(groupShare(row, "low"))} low-carbon.`
            }
            controls={<>{countryControl}{yearControl}</>}
            aside={<MixList row={row} active={active} onActive={setActive} />}
          >
            <ResponsiveDonut row={row} active={active} onActive={setActive} />
          </Card>

          <Card
            index={2}
            total={4}
            title="The rise of low-carbon energy"
            subtitle={`Nuclear and renewables went from ${pct(groupShare(first, "low"), 1)} of ${place}'s energy in ${first.year} to ${pct(groupShare(last, "low"), 1)} in ${last.year}.`}
            controls={countryControl}
          >
            <ResponsiveLineChart rows={rows} year={shownYear} onYear={setYear} />
          </Card>

          <Card
            index={3}
            total={4}
            title="Who uses the most energy"
            subtitle={`Energy used in ${year}, split into fossil and low-carbon. Click a bar to explore that country.`}
            controls={
              <>
                <div className="chip-legend" aria-label="Legend">
                  {Object.entries(GROUPS).map(([k, g]) => (
                    <span key={k}><i style={{ background: g.color }} />{g.label}</span>
                  ))}
                </div>
                {yearControl}
              </>
            }
          >
            <ResponsiveBarChart rows={countriesIn(year)} country={country} onCountry={setCountry} />
          </Card>
        </Deck>

        <footer className="page-footer">
          <p>
            Data:{" "}
            <a href="https://ourworldindata.org/energy" target="_blank" rel="noopener">Our World in Data</a>
            , from the Energy Institute Statistical Review of World Energy, as
            published by the{" "}
            <a href="https://www.react-graph-gallery.com/data/energy.js" target="_blank" rel="noopener">React Graph Gallery</a>
            .
          </p>
        </footer>
      </main>
    </>
  );
}

// Card 1's side panel: legend, plus fossil vs low-carbon, then and now
function ThenNow({ first, last }) {
  return (
    <div className="then-now">
      <ul className="legend">
        {[...SOURCES].reverse().map((s) => (
          <li key={s.key}>
            <span className="swatch" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
      <div className="compare">
        {Object.entries(GROUPS).map(([k, g]) => (
          <div key={k} className="compare-row">
            <span className="compare-label">{g.label}</span>
            <span className="compare-values">
              <span>{pct(groupShare(first, k))}</span>
              <span className="arrow">→</span>
              <strong style={{ color: g.color }}>{pct(groupShare(last, k))}</strong>
            </span>
            <span className="compare-years">{first.year} → {last.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Card 2's side panel: every source's share, hover-linked to the donut
function MixList({ row, active, onActive }) {
  return (
    <ul className="mix-list">
      {[...SOURCES].reverse().map((s) => (
        <li
          key={s.key}
          className={active === s.key ? "on" : active ? "dim" : ""}
          onPointerEnter={() => onActive(s.key)}
          onPointerLeave={() => onActive(null)}
        >
          <span className="swatch" style={{ background: s.color }} />
          <span className="mix-label">{s.label}</span>
          <span className="mix-value">{pct(share(row, s.key), 1)}</span>
        </li>
      ))}
    </ul>
  );
}
