import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierRecommended,
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'react-refresh/only-export-components': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000'], ['^node:'], ['^@?\\w'], ['^@/'], ['^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
