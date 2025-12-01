import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [preact()],
  root: resolve(__dirname, "src"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  base:
    process.env.NODE_ENV === "production"
      ? "/world-dev-info-metasearcher/"
      : "/",
});
