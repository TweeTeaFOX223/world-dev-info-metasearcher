import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [preact(), viteSingleFile()],
  root: resolve(__dirname, "src"),
  build: {
    outDir: resolve(__dirname, "dist-offline"),
    emptyOutDir: true,
  },
  base: process.env.NODE_ENV === "production" ? "/your-repository-name/" : "/",
});
