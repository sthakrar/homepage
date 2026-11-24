// vite.config.js - build settings for the Gapminder app
// - base:   the app is served at sthakrar.github.io/homepage/gapminder/,
//           so every file path in the build starts with that
// - outDir: build into ../gapminder, which GitHub Pages serves straight
//           from the repo
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Let the dev server read ../shared (the site's nav list and Projects menu)
  server: { fs: { allow: [".."] } },
  // ../shared/ProjectsMenu.jsx imports react: resolve it from this app
  resolve: { dedupe: ["react", "react-dom"] },
  base: "/homepage/gapminder/",
  build: {
    outDir: "../gapminder",
    emptyOutDir: true,
  },
});
