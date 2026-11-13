// vite.config.js - build settings for the Why Trials Stop Early app
// - base:   the app is served at sthakrar.github.io/homepage/trials/,
//           so every file path in the build starts with that
// - outDir: build into ../trials, which GitHub Pages serves straight
//           from the repo
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/homepage/trials/",
  build: {
    outDir: "../trials",
    emptyOutDir: true,
  },
});
