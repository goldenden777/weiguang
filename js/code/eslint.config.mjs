import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

const browserGlobals = {
  window: 'readonly', document: 'readonly', console: 'readonly', fetch: 'readonly',
  URL: 'readonly', URLSearchParams: 'readonly', sessionStorage: 'readonly', localStorage: 'readonly',
  setTimeout: 'readonly', setInterval: 'readonly', clearTimeout: 'readonly', clearInterval: 'readonly',
  requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly',
  alert: 'readonly', confirm: 'readonly', prompt: 'readonly',
  File: 'readonly', FileList: 'readonly', Blob: 'readonly', FormData: 'readonly',
  Event: 'readonly', MouseEvent: 'readonly', KeyboardEvent: 'readonly', InputEvent: 'readonly',
  HTMLElement: 'readonly', HTMLInputElement: 'readonly', SVGElement: 'readonly', Element: 'readonly',
  getComputedStyle: 'readonly', Image: 'readonly', CustomEvent: 'readonly',
  FileReader: 'readonly', DragEvent: 'readonly', navigator: 'readonly',
};
const nodeGlobals = { process: 'readonly', require: 'readonly', __dirname: 'readonly', __filename: 'readonly', URL: 'readonly' };

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: browserGlobals,
    },
    plugins: { vue },
    processor: vue.processors['.vue'],
    rules: {
      'vue/multi-word-component-names': 'warn',
    },
  },
  {
    files: ['**/src/**/*.ts'],
    languageOptions: { globals: browserGlobals },
  },
  {
    files: ['**/astro.config.mjs', '**/scripts/**/*.ts', '**/tailwind.config.mjs'],
    languageOptions: { globals: nodeGlobals },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
  {
    ignores: ['node_modules/', 'dist/', '.astro/', '**/package-lock.json', '**/pnpm-lock.yaml'],
  },
];
