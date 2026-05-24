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
