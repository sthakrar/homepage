// BubblePlot.jsx - life expectancy against GDP per capita, one bubble per
// country, drawn twice: once with a log x axis and once with a linear one.
// A vertical divider splits the plot. Left of it you see the log copy,
// right of it the linear copy (each copy is clipped to its side).
// D3 only builds the scales; React draws every element as SVG.
//
//   width   pixel width available for the whole SVG
//   frac    divider position, 0 (all linear) to 1 (all log)
//   onFrac  called with a new frac while dragging or using the keyboard
//   selected   the country picked in the filter or by clicking (or null)
//   onSelect   called with a country name (or null) when a bubble is clicked
//
// Hovering a bubble shows a tooltip. Clicking (tapping) a bubble selects
// it; pressing anywhere else, or dragging, moves the divider.
import { useId, useMemo, useRef, useState } from "react";
import { scaleLinear, scaleLog, scaleSqrt, max } from "d3";
import { data, CONTINENTS } from "../data/gapminder.js";
import { AxisBottom, AxisLeft } from "./Axes.jsx";

const MARGIN = { top: 30, right: 18, bottom: 48, left: 48 };

// GDP that splits "poorer" from "richer" countries in the story
export const THRESHOLD = 10000;

const LOG_DOMAIN = [200, 60000];
const LIN_DOMAIN = [0, 52000];
const LOG_TICKS = [300, 1000, 3000, 10000, 30000];
const LIN_TICKS = [0, 10000, 20000, 30000, 40000, 50000];

const money = (v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`);
export const dollars = (v) => `$${Math.round(v).toLocaleString("en-US")}`;
export const people = (v) =>
  v >= 1e9 ? `${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e3)}k`;

// Pixels a press can move and still count as a click on a bubble
const CLICK_SLOP = 4;

const colorOf = Object.fromEntries(CONTINENTS.map((c) => [c.key, c.color]));

// Biggest bubbles first, so small countries are drawn on top
const sorted = [...data].sort((a, b) => b.pop - a.pop);
const under = data.filter((d) => d.gdpPercap < THRESHOLD).length;

// Countries to name, and where their label goes relative to the bubble.
// On narrow screens only the first four are named.
const LABELS = [
  ["China", "above"],
  ["India", "below"],
  ["United States", "below"],
  ["Nigeria", "below"],
  ["Japan", "above"],
  ["South Africa", "right"],
  ["Botswana", "right"],
  ["Swaziland", "right"],
];

// Bubble radius: area follows population. China is about 4.5% of the plot width.
export function makeRadius(boundsW) {
  return scaleSqrt()
    .domain([0, max(data, (d) => d.pop)])
    .range([0, Math.max(16, Math.min(52, boundsW * 0.045))]);
}

export default function BubblePlot({ width, frac, onFrac, selected, onSelect }) {
  const id = useId();
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(null);   // { name, kind } under the mouse
  const press = useRef(null);                 // the press in progress

  const boundsW = width - MARGIN.left - MARGIN.right;
  const boundsH = Math.round(Math.min(720, Math.max(300, boundsW * 0.56)));
  const compact = boundsW < 520;

  const { xLog, xLin, y, r } = useMemo(
    () => ({
      xLog: scaleLog().domain(LOG_DOMAIN).range([0, boundsW]),
      xLin: scaleLinear().domain(LIN_DOMAIN).range([0, boundsW]),
      y: scaleLinear().domain([35, 85]).range([boundsH, 0]),
      r: makeRadius(boundsW),
    }),
    [boundsW, boundsH]
  );

  const split = frac * boundsW;
  const pct = Math.round(frac * 100);

  // ---- Dragging: anywhere on the chart, mouse or touch ----
  const fracFromEvent = (e) => {
    const box = svgRef.current.getBoundingClientRect();
    const x = e.clientX - box.left - MARGIN.left;
    return Math.min(1, Math.max(0, x / boundsW));
  };

  // A press on a bubble waits: if it barely moves it's a click (select the
  // country), otherwise it becomes a drag. A press anywhere else moves the
  // divider straight away, as before.
  const startDrag = (e) => {
    press.current.drag = true;
    setDragging(true);
    setHover(null);
    onFrac(fracFromEvent(e));
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    svgRef.current.setPointerCapture(e.pointerId);
    const name = e.target.dataset?.country ?? null;
    press.current = { x: e.clientX, name, drag: false };
    if (!name) startDrag(e);
  };

  const onPointerMove = (e) => {
    const p = press.current;
    if (p) {
      if (p.drag) onFrac(fracFromEvent(e));
      else if (Math.abs(e.clientX - p.x) > CLICK_SLOP) startDrag(e);
      return;
    }
    // Not pressing: track the bubble under a mouse or pen (touch has no hover)
    if (e.pointerType === "touch") return;
    const name = e.target.dataset?.country;
    const kind = e.target.dataset?.kind;
    if (!name) {
      if (hover) setHover(null);
    } else if (hover?.name !== name || hover?.kind !== kind) {
      setHover({ name, kind });
    }
  };

  const onPointerUp = () => {
    const p = press.current;
    press.current = null;
    setDragging(false);
    if (p && !p.drag && p.name) onSelect(p.name === selected ? null : p.name);
  };

  // ---- Keyboard: arrows nudge, Shift+arrow jumps, Home/End go to the ends ----
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 0.2 : 0.05;
    let next = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = frac - step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = frac + step;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 1;
    if (next === null) return;
    e.preventDefault();
    onFrac(Math.min(1, Math.max(0, next)));
  };

  // Named bubbles (the selected country is named by its marker instead)
  const sel = selected ? data.find((d) => d.country === selected) : null;
  const labels = (compact ? LABELS.slice(0, 4) : LABELS).filter(([n]) => n !== selected);

  // The selected country is drawn on top, unclipped, at its position on each
  // scale that's on screen. Clipping alone could hide it: a country can sit
  // right of the divider on the log copy and left of it on the linear copy.
  const marks = !sel
    ? []
    : [
        frac > 0.001 && { kind: "log", tag: "log", x: xLog(sel.gdpPercap) },
        frac < 0.999 && { kind: "linear", tag: "linear", x: xLin(sel.gdpPercap) },
      ].filter(Boolean);
  const selY = sel ? y(sel.lifeExp) : 0;
  const selR = sel ? Math.max(2, r(sel.pop)) : 0;
  const crowded = marks.length === 2 && Math.abs(marks[1].x - marks[0].x) < (compact ? 110 : 170);

  // Tooltip for the hovered bubble, placed on the copy it was hovered in
  const tip = hover && !dragging ? data.find((d) => d.country === hover.name) : null;
  const tipX = tip ? MARGIN.left + (hover.kind === "log" ? xLog : xLin)(tip.gdpPercap) : 0;
  const tipY = tip ? MARGIN.top + y(tip.lifeExp) - Math.max(2, r(tip.pop)) : 0;

  // One full copy of the plot for a given x scale
  const layer = (x, ticks, kind) => {
    const bandW = x(THRESHOLD) - x(x.domain()[0]);
    const share = Math.round((bandW / boundsW) * 100);
    const edge = x(THRESHOLD);

    return (
      <g>
        {/* The band of countries under $10k */}
        <rect className="band" x={0} y={0} width={bandW} height={boundsH} />
        <line className="band-edge" x1={edge} x2={edge} y1={0} y2={boundsH} />

        <AxisBottom scale={x} ticks={ticks} format={money} height={boundsH} />

        {sorted.map((d) => {
          const isOn = d.country === selected || (hover?.name === d.country && hover.kind === kind);
          return (
            <circle
              key={d.country}
              data-country={d.country}
              data-kind={kind}
              className={`bubble${isOn ? " is-on" : selected ? " is-dim" : ""}`}
              cx={x(d.gdpPercap)}
              cy={y(d.lifeExp)}
              r={Math.max(2, r(d.pop))}
              fill={colorOf[d.continent]}
            />
          );
        })}

        {labels.map(([name, pos]) => {
          const d = data.find((c) => c.country === name);
          const cx = x(d.gdpPercap);
          const cy = y(d.lifeExp);
          const rad = Math.max(2, r(d.pop));
          const at = {
            above: { x: cx, y: cy - rad - 5, anchor: "middle" },
            below: { x: cx, y: cy + rad + 13, anchor: "middle" },
            right: { x: cx + rad + 4, y: cy + 4, anchor: "start" },
          }[pos];
          return (
            <text
              key={name}
              className={`country-label${name === selected ? " is-selected" : selected ? " is-dim" : ""}`}
              x={at.x}
              y={at.y}
              textAnchor={at.anchor}
            >
              {name}
            </text>
          );
        })}

        {/* A note about the band, placed in each copy's empty corner so it
            shows on its own side of the divider. Log: top left (no poor
            country lives past 80). Linear: bottom right (no rich country
            dies young). */}
        {kind === "log" ? (
          <text className="band-note" x={8} y={16}>
            <tspan className="strong">{under} countries under $10k</tspan>
            <tspan x={8} dy={14}>spread over {share}% of a log axis</tspan>
          </text>
        ) : (
          <text className="band-note" x={boundsW - 8} y={boundsH - 26} textAnchor="end">
            <tspan className="strong">◀ The same {under} countries</tspan>
            <tspan x={boundsW - 8} dy={14}>squeezed into {share}% of a linear axis</tspan>
          </text>
        )}
      </g>
    );
  };

  // The clip rects reach down into the margin so each side keeps its own tick labels
  const clipY = -MARGIN.top;
  const clipH = boundsH + MARGIN.top + MARGIN.bottom;

  return (
    <div className="plot-wrap">
    <svg
      ref={svgRef}
      className={`bubble-plot${dragging ? " is-dragging" : ""}`}
      width={width}
      height={boundsH + MARGIN.top + MARGIN.bottom}
      role="img"
      aria-label={`Bubble chart of life expectancy against GDP per capita for ${data.length} countries in 2007. The left ${pct}% uses a log GDP axis, the rest a linear one.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => setHover(null)}
    >
      <defs>
        <clipPath id={`${id}-log`}>
          <rect x={0} y={clipY} width={split} height={clipH} />
        </clipPath>
        <marker
          id={`${id}-arrow`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M1,1 L9,5 L1,9" className="arrow-head" />
        </marker>
        <clipPath id={`${id}-lin`}>
          <rect x={split} y={clipY} width={boundsW - split} height={clipH} />
        </clipPath>
      </defs>

      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        <AxisLeft scale={y} ticks={[40, 50, 60, 70, 80]} width={boundsW} title="Life expectancy (years)" />

        <g clipPath={`url(#${id}-log)`}>{layer(xLog, LOG_TICKS, "log")}</g>
        <g clipPath={`url(#${id}-lin)`}>{layer(xLin, LIN_TICKS, "linear")}</g>

        <text className="axis-title" x={boundsW / 2} y={boundsH + 40} textAnchor="middle">
          GDP per capita (US$, inflation-adjusted)
        </text>

        {/* Scale tags either side of the divider; hidden when there's no room */}
        {split > 92 && (
          <text className="scale-tag" x={split - 12} y={-12} textAnchor="end">◀ LOG</text>
        )}
        {boundsW - split > 112 && (
          <text className="scale-tag" x={split + 12} y={-12}>LINEAR ▶</text>
        )}

        {/* The selected country: guides to both axes, its bubble on each
            visible scale, and an arrow from the log spot to the linear one */}
        {sel && (
          <g className="selection">
            <g className="guides">
              <line x1={0} x2={Math.max(...marks.map((m) => m.x))} y1={selY} y2={selY} />
              {marks.map((m) => (
                <line key={m.kind} x1={m.x} x2={m.x} y1={selY} y2={boundsH} />
              ))}
              {!compact && (
                <text className="guide-value" x={4} y={selY + 13}>
                  {sel.lifeExp.toFixed(1)} yrs
                </text>
              )}
              {marks.map((m) => (
                <text key={m.kind} className="guide-value" x={m.x + 5} y={boundsH - 6}>
                  {dollars(sel.gdpPercap)}
                </text>
              ))}
            </g>

            {marks.length === 2 && Math.abs(marks[1].x - marks[0].x) > selR * 2 + 16 && (
              <path
                className="shift-arrow"
                markerEnd={`url(#${id}-arrow)`}
                d={`M${marks[0].x},${selY + selR + 5} Q${(marks[0].x + marks[1].x) / 2},${
                  selY + selR + 48
                } ${marks[1].x},${selY + selR + 7}`}
              />
            )}

            {marks.map((m, i) => (
              <g key={m.kind}>
                <circle className="bubble-ring" cx={m.x} cy={selY} r={selR + 4} />
                <circle
                  className="bubble is-on"
                  data-country={sel.country}
                  data-kind={m.kind}
                  cx={m.x}
                  cy={selY}
                  r={selR}
                  fill={colorOf[sel.continent]}
                />
                {/* Name both marks when there's room, else just the first */}
                {(i === 0 || !crowded) && (
                  <text
                    className="country-label is-selected"
                    x={m.x}
                    y={selY - selR - 9}
                    textAnchor="middle"
                  >
                    {sel.country}
                    {marks.length === 2 && !crowded && !compact && (
                      <tspan className="mark-tag"> · {m.tag}</tspan>
                    )}
                  </text>
                )}
              </g>
            ))}
          </g>
        )}

        {/* The divider: line plus a focusable handle */}
        <g className="divider" transform={`translate(${split}, 0)`}>
          <line y1={-MARGIN.top + 4} y2={boundsH + 22} />
          <g
            className="handle"
            transform={`translate(0, ${boundsH / 2})`}
            tabIndex={0}
            role="slider"
            aria-label="Divider between log and linear scale"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-valuetext={`${pct}% log scale, ${100 - pct}% linear scale`}
            onKeyDown={onKeyDown}
          >
            <circle r={14} />
            <path d="M-3,-5 L-9,0 L-3,5 Z M3,-5 L9,0 L3,5 Z" />
          </g>
        </g>
      </g>
    </svg>

    {tip && (
      <div
        className={`bubble-tip${tipX > width - 120 ? " flip-left" : tipX < 120 ? " flip-right" : ""}`}
        style={{ left: tipX, top: tipY }}
        aria-hidden="true"
      >
        <p className="tip-name">
          <span className="swatch" style={{ background: colorOf[tip.continent] }} />
          {tip.country}
        </p>
        <dl>
          <dt>Life expectancy</dt><dd>{tip.lifeExp.toFixed(1)} yrs</dd>
          <dt>GDP per capita</dt><dd>{dollars(tip.gdpPercap)}</dd>
          <dt>Population</dt><dd>{people(tip.pop)}</dd>
        </dl>
        <p className="tip-hint">{tip.country === selected ? "Click to clear" : "Click to select"}</p>
      </div>
    )}
    </div>
  );
}
