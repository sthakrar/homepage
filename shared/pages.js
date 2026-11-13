// pages.js - the site's navigation: the home page and every project, in the
// order they appear on the home page. Each project app imports this list to
// draw its nav bar, so a new project only needs adding here. (The home page
// itself keeps its own short nav: Projects and Contact.)
//   key    which page it is (each app passes its own key to mark it active)
//   label  short text in the nav bar ("Project #1"...)
//   title  the project's full name, shown when hovering its link
//   path   folder under the site root ("" = home page)
export const PAGES = [
  { key: "home", label: "Home", path: "", title: "Home" },
  { key: "imaging", label: "Project #1", path: "imaging/", title: "React Foundation - Medical Imaging Explorer" },
  { key: "barplot", label: "Project #2", path: "barplot/", title: "D3 Intro Barplot - Students by Country" },
  { key: "trials", label: "Project #3", path: "trials/", title: "Why Clinical Trials Stop Early" },
  { key: "escape", label: "Project #4", path: "escape/", title: "Scales - Escape Artists" },
];
