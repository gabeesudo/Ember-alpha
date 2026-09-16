import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode, command }) => {
  // Load server settings for development without exposing secrets to the browser.
  if (command === "serve") {
    for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ""))) {
      process.env[key] ??= value;
    }
  }
  return {
    resolve: { tsconfigPaths: true, dedupe: ["react", "react-dom"] },
    plugins: [tailwindcss(), tanstackStart({ server: { entry: "server" } }), nitro({ preset: "node-server" }), react()],
  };
});
