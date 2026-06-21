import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "SRC Trainer",
        short_name: "SRC Trainer",
        description: "Offline lernen für das beschränkt gültige Funkbetriebszeugnis",
        lang: "de",
        theme_color: "#073b4c",
        background_color: "#f4f7f6",
        display: "standalone",
        start_url: "./",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
