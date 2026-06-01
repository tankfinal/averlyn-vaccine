import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project page: https://tankfinal.github.io/averlyn-vaccine/
// — must set base so assets resolve under the sub-path.
export default defineConfig({
  plugins: [react()],
  base: "/averlyn-vaccine/",
});
