// vite.config.js - build settings for the barplot app
// - base:   the app is served at sthakrar.github.io/homepage/barplot/,
//           so every file path in the build starts with that
// - outDir: build into ../barplot, which GitHub Pages serves straight
//           from the repo
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/homepage/barplot/",
  build: {
    outDir: "../barplot",
    emptyOutDir: true,
  },
});
