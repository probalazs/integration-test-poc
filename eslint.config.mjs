import globals from 'globals';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: globals.node } },
  ...tseslint.configs.recommended,
  ...compat.config({
    extends: ['airbnb-base', 'airbnb-typescript/base'],
    parserOptions: {
      project: './tsconfig.json',
    },
  }),
];
