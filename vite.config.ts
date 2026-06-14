import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/Runtime/uploads": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/wp-content/uploads": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/api/socket.io": {
        target: "http://localhost:8000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("react-pannellum")) return "vendor-pannellum";
            if (id.includes("@tanstack/react-query")) return "vendor-query";
            return;
          }
          if (id.includes("/src/data/doctorsSearchIndex")) return "data-doctors-search";
          if (id.includes("/src/data/doctors")) return "data-doctors";
          if (id.includes("/src/data/departmentDetails")) return "data-department-details";
          if (id.includes("/src/i18n/ar")) return "i18n-ar";
          if (id.includes("/src/i18n/en")) return "i18n-en";
          if (id.includes("/src/data/featuredDoctors")) return "data-featured-doctors";
          if (id.includes("/src/data/doctorsWithClinicCodes")) return "data-booking-doctors";
        },
      },
    },
  },
}));
