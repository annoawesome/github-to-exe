// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactEslint from "eslint-plugin-react";
import prettierEslint from "eslint-config-prettier/flat";
import globals from "globals";

const { browser } = globals;

export default tseslint.config([
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      reactEslint.configs.flat.recommended,
      prettierEslint,
    ],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
