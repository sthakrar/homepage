# Data Viz with D3 React

The home page for my data visualization work with D3 and React, focused on clinical trials and real-world evidence.

**Live site:** https://sthakrar.github.io/homepage/

## What's on the page

- **Profile card** with my name, role, a short bio, and links to LinkedIn, GitHub, email and Google Scholar. A faint blue beam travels around its border.
- **Animated chart** that cycles through 28 figures you would find in a clinical study report. Each one starts as a scattered cloud of points (the noise), then a beam sweeps across and pulls the points into the finished figure (the signal). Every figure has a title and x and y axis titles.
- **Figure picker** under the chart: one short line per figure. The highlighted line is the figure on show, and clicking any line jumps to that figure.
- **Projects panel** that slides up from the bottom of the page, with one card per project.

## Projects

- **[React Foundation - Medical Imaging Explorer](https://sthakrar.github.io/homepage/imaging/)** (React): 24 medical imaging techniques, from X-ray to capsule endoscopy, as a grid of cards. Each card shows what the scan is used for, its radiation dose, how long natural background radiation takes to give the same dose, and how long the scan takes. Buttons filter the grid by family: X-ray, Magnetic, Sound, Nuclear or Light. Images are from Wikimedia Commons and each card links to its image's credit page.
- **[D3 Intro Barplot - Students by Country](https://sthakrar.github.io/homepage/barplot/)** (D3 + React): a horizontal bar chart of how many students from each country joined the first cohort of a data visualization course. D3 handles only the scales (`scaleBand` for countries, `scaleLinear` for counts) and React draws every bar, label and gridline as SVG. The chart resizes to fit the screen, and hovering a bar highlights it.
- **[Scales - Escape Artists](https://sthakrar.github.io/homepage/escape/)** (D3 + React): a recreation of a bar chart from The Economist showing laboratory-acquired infections by disease, 1970-2021. It matches the original: red rule and tag, title and subtitle, gridlines with values along the top, names written inside each bar (or just outside when the bar is too short), and the sources and credit lines, with colours sampled from the original.
- **[Why Clinical Trials Stop Early](https://sthakrar.github.io/homepage/trials/)** (D3 + React): a donut chart of why 13,089 clinical trials on ClinicalTrials.gov were terminated (completion dates 2020-2025), using the categories of Williams et al., PLOS ONE 2015. A script downloads the trials from the ClinicalTrials.gov API and sorts each free-text reason into a category with keyword rules (about 88% agreement with hand checks on random samples), and splits "Other" into themes. `d3.pie` and `d3.arc` compute the slices and React draws them.
- **[Axes - Wealth & Health, Log vs Linear](https://sthakrar.github.io/homepage/gapminder/)** (D3 + React): a bubble plot of life expectancy against GDP per capita for 142 countries in 2007 (Gapminder data), with colour for continent and bubble area for population. A vertical line splits the chart: left of it the GDP axis is log, right of it linear. Drag it (mouse, touch or arrow keys), or use the Log / Split / Linear buttons, to see how a linear axis squeezes the 88 countries under $10,000 into a fifth of the width while a log axis spreads them over two thirds. The chart is drawn twice, once per scale, and each copy is clipped to its side of the line. Reusable `AxisBottom` and `AxisLeft` components draw the gridlines and ticks.
- **[Responsive - Sixty Years of World Energy](https://sthakrar.github.io/homepage/energy/)** (D3 + React): a responsive dashboard of how the world's energy mix changed from 1965 to 2024 (Our World in Data), for the World and the 28 countries that use the most energy. Four linked charts sit on cards that pile up as you scroll: each card is sticky, and the ones underneath shrink and dim. A stacked area of the mix over time (share or TWh), a donut for one year, a line chart of low-carbon sources and a bar chart comparing countries. Picking a country or year on any card updates them all; clicking a time chart picks a year and clicking a bar picks a country. Every chart uses the wrapper pattern: a `Responsive…` component measures its box with the `useDimensions` hook and passes width and height to the chart.

### Figures in the chart

| Area | Figures |
| --- | --- |
| Efficacy | Model fit, Kaplan-Meier, forest plot, ANOVA, waterfall, mean change from baseline, box plot, swimmer plot, individual patient profiles, dose-response (Emax), ROC curve, cumulative enrollment |
| Early phase and clinical pharmacology | Single Ascending Dose, Multiple Ascending Dose, dose proportionality, concentration-time profile, PK/PD hysteresis loop, bioequivalence, concentration-QTc |
| Vaccines and immunogenicity | GMT after prime and boost, reverse cumulative distribution of titres, ADA titres, reactogenicity |
| Safety | eDISH, adverse events volcano plot |
| Real-world evidence | Propensity score overlap, covariate balance before and after matching (Love plot) |
| Meta-analysis | Funnel plot |

All data is simulated and generated fresh on every cycle, so no two rounds look exactly the same.

## How it's built

The home page is plain HTML, CSS and JavaScript with no libraries and no build step. The chart is drawn directly as SVG.

Each project is its own Vite app. Its source lives in a `*-app/` folder, and building it writes static files to a matching folder (`imaging/`, `barplot/`, `escape/`, `trials/`, `gapminder/`, `energy/`) that GitHub Pages serves like the rest of the repo.

```
index.html        page content
css/style.css     all styling: layout, card, beam, chart colours, project cards
js/signal.js      the animated chart, its 28 figures and the figure picker
js/panels.js      opens and closes the Projects panel
shared/pages.js   every project, for the project pages' Projects menu
shared/ProjectsMenu.jsx, nav.css   the Projects dropdown on every project page

imaging-app/      React source for the Medical Imaging Explorer
  src/data/imaging.js            the 24 imaging techniques
  src/App.jsx                    holds the selected filter and renders the grid
  src/components/FilterBar.jsx   the type filter buttons
  src/components/ImagingCard.jsx one card
  src/index.css                  styles (same colours and fonts as the home page)
imaging/          the built app (generated, don't edit by hand)

barplot-app/      D3 + React source for Students by Country
  src/data/students.js           students per country
  src/components/Barplot.jsx     the chart: D3 scales, React SVG
  src/App.jsx                    page layout; measures the width for the chart
  src/index.css                  styles (same colours and fonts as the home page)
barplot/          the built app (generated, don't edit by hand)

escape-app/       D3 + React source for Escape Artists
  src/data/infections.js         infections per disease
  src/components/Barplot.jsx     the chart: D3 scales, React SVG, inline labels
  src/App.jsx                    page layout: title, subtitle, chart, footer
escape/           the built app (generated, don't edit by hand)

trials-app/       D3 + React source for Why Clinical Trials Stop Early
  scripts/fetch-terminations.mjs downloads trials and writes src/data/snapshot.json
  scripts/classify.mjs           keyword rules that sort each reason into a category
  src/data/terminations.js       snapshot, category colours and order
  src/components/Donut.jsx       the donut: d3.pie + d3.arc, React SVG
  src/components/Legend.jsx      grouped legend; hover or focus highlights a slice
trials/           the built app (generated, don't edit by hand)

gapminder-app/    D3 + React source for Wealth & Health, Log vs Linear
  src/data/gapminder.js          142 countries in 2007, continent colours
  src/components/BubblePlot.jsx  the chart: both scales, clipping, the draggable divider
  src/components/Axes.jsx        reusable AxisBottom and AxisLeft
  src/App.jsx                    page layout, snap buttons, legends
gapminder/        the built app (generated, don't edit by hand)

energy-app/       D3 + React source for Sixty Years of World Energy
  src/data/energy.js             1965-2024 energy by source, 29 entities (compact rows)
  src/data/sources.js            source colours and groups, data helpers
  src/hooks/useDimensions.js     measures a box (ResizeObserver) for the Responsive wrappers
  src/components/Deck.jsx        the sticky card stack and its scroll effect
  src/components/StackedArea.jsx, Donut.jsx, LineChart.jsx, BarChart.jsx
                                 each chart plus its Responsive wrapper
  src/App.jsx                    shared state (country, year), intro, the four cards
energy/           the built app (generated, don't edit by hand)
```

## Run it locally

Clone the repo and open `index.html` in a browser:

```bash
git clone https://github.com/sthakrar/homepage.git
cd homepage
open index.html
```

### Build a project

You need Node.js. After changing anything in a `*-app/` folder, rebuild it and commit its built folder. For example:

```bash
cd imaging-app   # or barplot-app, escape-app, trials-app, gapminder-app, energy-app
npm install      # first time only
npm run dev      # live preview while editing
npm run build    # writes the finished app to ../imaging (or ../barplot)
```

To refresh the trial data: `cd trials-app && node scripts/fetch-terminations.mjs`, then rebuild.

## Customise

- **Add a figure:** write a new function in `js/signal.js` that returns a `label`, `axes`, `points` and `paths`, then add it to the `FIGURES` list. The figure picker updates on its own.
- **Change timing:** `SWEEP_MS` (how long the beam takes to draw) and `HOLD_MS` (how long a finished figure stays) at the top of `js/signal.js`.
- **Change colours or the card beam:** the variables at the top of `css/style.css` and the `.card::before` rule.
- **Add a project:** copy the `<article class="project">` block in `index.html` and change the link, poster image, tag, title and description. Then add it to `shared/pages.js` so every project page links to it, and rebuild the project apps.

## Accessibility

Visitors who have "reduce motion" turned on see each figure already drawn, with no animation, and the card beam is hidden. The figure picker still switches between figures.

## Contact

Sanchit Thakrar, Clinical Data Scientist

- [LinkedIn](https://www.linkedin.com/in/sanchit-thakrar)
- [GitHub](https://github.com/sthakrar)
- [Google Scholar](https://scholar.google.com/citations?user=k8UYZcMAAAAJ&hl=en)
- [Email](mailto:sanchit.thakrar@gmail.com)
