import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * البناء يخرج ملف HTML واحدًا مكتفيًا بذاته (JS + CSS + الصور مضمّنة)
 * ليعمل بالنقر المزدوج على أي جهاز في المكتب دون خادم أو تثبيت.
 */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: "./",
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{js,jsx}"],
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "app.js",
        assetFileNames: "app.[ext]",
      },
    },
  },
});
