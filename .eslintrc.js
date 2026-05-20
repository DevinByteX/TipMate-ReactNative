module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['import'],
  rules: {
    // Prevent circular dependencies across the codebase.
    // maxDepth caps traversal depth to keep lint runs fast.
    'import/no-cycle': ['error', { maxDepth: 10 }],
    // Catch unused imports and variables (prefix with _ to intentionally ignore).
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
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
