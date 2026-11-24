// pages.js - the site's navigation: the home page and every project, in the
// order they appear on the home page. The Projects menu on every project
// page (ProjectsMenu.jsx) is built from this list, so a new project only
// needs adding here. (The home page itself keeps its own short nav:
// Projects and Contact.)
//   key    which page it is (each app passes its own key to mark it active)
//   label  "Project #1"...; the menu shows the "#1" part
//   title  the project's full name, shown in the menu
//   path   folder under the site root ("" = home page)
export const PAGES = [
  { key: "home", label: "Home", path: "", title: "Home" },
  { key: "imaging", label: "Project #1", path: "imaging/", title: "React Foundation - Medical Imaging Explorer" },
  { key: "barplot", label: "Project #2", path: "barplot/", title: "D3 Intro Barplot - Students by Country" },
  { key: "trials", label: "Project #3", path: "trials/", title: "Why Clinical Trials Stop Early" },
  { key: "escape", label: "Project #4", path: "escape/", title: "Scales - Escape Artists" },
  { key: "gapminder", label: "Project #5", path: "gapminder/", title: "Axes - Wealth & Health, Log vs Linear" },
];
