import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,jsx,ts,tsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.node } 
  },
  tseslint.configs.recommended,
  {
    ignores: [ "**/forge.config.ts", "dist/**", "build/**", ".webpack/**", "webpack.config.js", "webpack.plugins.ts", "eslint.config.mjs",],
  }
]);
