// BubblePlot.jsx - life expectancy against GDP per capita, one bubble per
// country, drawn twice: once with a log x axis and once with a linear one.
// A vertical divider splits the plot. Left of it you see the log copy,
// right of it the linear copy (each copy is clipped to its side).
// D3 only builds the scales; React draws every element as SVG.
//
//   width   pixel width available for the whole SVG
//   frac    divider position, 0 (all linear) to 1 (all log)
//   onFrac  called with a new frac while dragging or using the keyboard
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
    .range([0, Math.max(16, Math.min(40, boundsW * 0.045))]);
}

export default function BubblePlot({ width, frac, onFrac }) {
  const id = useId();
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const boundsW = width - MARGIN.left - MARGIN.right;
  const boundsH = Math.round(Math.min(500, Math.max(300, boundsW * 0.6)));
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

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    svgRef.current.setPointerCapture(e.pointerId);
    setDragging(true);
    onFrac(fracFromEvent(e));
  };
  const onPointerMove = (e) => dragging && onFrac(fracFromEvent(e));
  const onPointerUp = () => setDragging(false);

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

  const labels = compact ? LABELS.slice(0, 4) : LABELS;

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

        {sorted.map((d) => (
          <circle
            key={d.country}
            className="bubble"
            cx={x(d.gdpPercap)}
            cy={y(d.lifeExp)}
            r={Math.max(2, r(d.pop))}
            fill={colorOf[d.continent]}
          />
        ))}

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
            <text key={name} className="country-label" x={at.x} y={at.y} textAnchor={at.anchor}>
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
    >
      <defs>
        <clipPath id={`${id}-log`}>
          <rect x={0} y={clipY} width={split} height={clipH} />
        </clipPath>
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
  );
}
