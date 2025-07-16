import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/app-pms/",
  plugins: [react()],
  define: {
    BUILD_TIME: JSON.stringify(Date.now()),
  },
});
