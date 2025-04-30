import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import pkg from "./package.json";
import { createHash } from "crypto";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  let packageVersion = pkg.version;
  if (command === "build") {
    const timestamp = new Date().toISOString().slice(0, 10);
    const hash = createHash("md5")
      .update(timestamp + packageVersion)
      .digest("hex")
      .substring(0, 8);

    packageVersion += `.${hash}`;
  }

  return {
    define: {
      "import.meta.env.APP_VERSION": JSON.stringify(packageVersion),
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Mindfuld Bites",
          short_name: "Mindful Bites",
          description: "Healthy food choices made simple",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
