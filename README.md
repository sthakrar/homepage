# Data Viz with D3 React

The home page for my data visualization work with D3 and React, focused on clinical trials and real-world evidence.

**Live site:** https://sthakrar.github.io/homepage/

## What's on the page

- **Profile card** with my name, role, a short bio, and links to LinkedIn, GitHub, email and Google Scholar. A faint blue beam travels around its border.
- **Animated chart** that cycles through 28 figures you would find in a clinical study report. Each one starts as a scattered cloud of points (the noise), then a beam sweeps across and pulls the points into the finished figure (the signal). Every figure has a title and x and y axis titles.
- **Figure picker** under the chart: one short line per figure. The highlighted line is the figure on show, and clicking any line jumps to that figure.
- **Projects panel** that slides up from the bottom of the page, with one card per project.

## Projects

- **[Medical Imaging Explorer](https://sthakrar.github.io/homepage/imaging/)** (React): 24 medical imaging techniques, from X-ray to capsule endoscopy, as a grid of cards. Each card shows what the scan is used for, its radiation dose, how long natural background radiation takes to give the same dose, and how long the scan takes. Buttons filter the grid by family: X-ray, Magnetic, Sound, Nuclear or Light. Images are from Wikimedia Commons and each card links to its image's credit page.
- **[Students by Country](https://sthakrar.github.io/homepage/barplot/)** (D3 + React): a horizontal bar chart of how many students from each country joined the first cohort of a data visualization course. D3 handles only the scales (`scaleBand` for countries, `scaleLinear` for counts) and React draws every bar, label and gridline as SVG. The chart resizes to fit the screen, and hovering a bar highlights it.
- **[Escape Artists](https://sthakrar.github.io/homepage/escape/)** (D3 + React): a recreation of a bar chart from The Economist showing laboratory-acquired infections by disease, 1970-2021. It follows the original's structure: title, subtitle, gridlines with values along the top, names written inside each bar (or just outside when the bar is too short), and a sources footer. Colours and fonts match this site.

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

Each project is its own Vite app. Its source lives in a `*-app/` folder, and building it writes static files to a matching folder (`imaging/`, `barplot/`, `escape/`) that GitHub Pages serves like the rest of the repo.

```
index.html        page content
css/style.css     all styling: layout, card, beam, chart colours, project cards
js/signal.js      the animated chart, its 28 figures and the figure picker
js/panels.js      opens and closes the Projects panel

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
cd imaging-app   # or barplot-app, escape-app
npm install      # first time only
npm run dev      # live preview while editing
npm run build    # writes the finished app to ../imaging (or ../barplot)
```

## Customise

- **Add a figure:** write a new function in `js/signal.js` that returns a `label`, `axes`, `points` and `paths`, then add it to the `FIGURES` list. The figure picker updates on its own.
- **Change timing:** `SWEEP_MS` (how long the beam takes to draw) and `HOLD_MS` (how long a finished figure stays) at the top of `js/signal.js`.
- **Change colours or the card beam:** the variables at the top of `css/style.css` and the `.card::before` rule.
- **Add a project:** copy the `<article class="project">` block in `index.html` and change the link, poster image, tag, title and description.

## Accessibility

Visitors who have "reduce motion" turned on see each figure already drawn, with no animation, and the card beam is hidden. The figure picker still switches between figures.

## Contact

Sanchit Thakrar, Clinical Data Scientist

- [LinkedIn](https://www.linkedin.com/in/sanchit-thakrar)
- [GitHub](https://github.com/sthakrar)
- [Google Scholar](https://scholar.google.com/citations?user=k8UYZcMAAAAJ&hl=en)
- [Email](mailto:sanchit.thakrar@gmail.com)
