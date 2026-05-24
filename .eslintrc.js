/**
 * ESLint configuration for TipMate.
 *
 * Circular dependency detection
 * ─────────────────────────────
 * `import/no-cycle` is set to maxDepth:10 — deep enough to catch real cycles
 * without false-positives in legitimate dependency chains.  `ignoreExternal:true`
 * skips node_modules entirely; without it the TypeScript resolver trips over
 * Flow syntax inside React Native's own index.js.
 *
 * Unused variables
 * ────────────────
 * `@typescript-eslint/no-unused-vars` is preferred over the base rule (which is
 * disabled) because it understands TypeScript type-only imports.  Prefix a name
 * with _ (e.g. `_unused`, `_props`) to signal an intentional no-op and silence
 * the warning.  This is safer than turning the rule off entirely.
 *
 * Module resolution
 * ─────────────────
 * The `babel-module` resolver teaches import/no-cycle to follow path aliases
 * defined in babel.config.js (@hooks, @configs, @styles, etc.).  The `node`
 * resolver adds platform-specific extensions so RN platform files are found.
 */
module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['import'],
  ignorePatterns: ['node_modules/', 'android/', 'ios/', 'build/', 'dist/'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    // ignoreExternal:true prevents traversal into node_modules, fixing the
    // TypeScript parser / Flow syntax conflict in react-native's index.js.
    'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }],
    // Catch unused imports and variables (prefix with _ to intentionally ignore).
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
  },
  settings: {
    'import/resolver': {
      // Resolves babel-plugin-module-resolver aliases (@hooks, @configs, etc.)
      // so import/no-cycle can follow aliased paths correctly.
      'babel-module': {},
      node: {
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      },
    },
  },
};
