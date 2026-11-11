// vite.config.js - build settings for the imaging app
// - base:   the app is served at sthakrar.github.io/homepage/imaging/,
//           so every file path in the build starts with that
// - outDir: build into ../imaging (next to index.html of the homepage),
//           which GitHub Pages serves straight from the repo
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/homepage/imaging/",
  build: {
    outDir: "../imaging",
    emptyOutDir: true,
  },
});
