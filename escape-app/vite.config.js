// vite.config.js - build settings for the Escape Artists app
// - base:   the app is served at sthakrar.github.io/homepage/escape/,
//           so every file path in the build starts with that
// - outDir: build into ../escape, which GitHub Pages serves straight
//           from the repo
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/homepage/escape/",
  build: {
    outDir: "../escape",
    emptyOutDir: true,
  },
});
