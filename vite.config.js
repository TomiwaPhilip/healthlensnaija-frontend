import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // safer for local dev & GH Pages
  plugins: [
    {
      name: "pre-transform-js-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!id.match(/src\/.*\.jsx$/)) return null; // ✅ match .jsx files now
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react({ jsxRuntime: "automatic" }),
  ],
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
