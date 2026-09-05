import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/**", ".astro/**", "storybook-static/**"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  storybook.configs["flat/recommended"],
]);
