import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/", // safer for local dev & GH Pages
  plugins: [
    {
      name: "pre-transform-js-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!id.match(/src\/.*\.(jsx|tsx)$/)) return null; // ✅ match .jsx and .tsx files now
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react({ jsxRuntime: "automatic" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        ".js": "jsx",   // still cover plain .js
        ".jsx": "jsx",  // ✅ add jsx loader
      },
    },
  },
});
