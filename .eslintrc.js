module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['import'],
  rules: {
    // Prevent circular dependencies across the codebase.
    // maxDepth caps traversal depth to keep lint runs fast.
    'import/no-cycle': ['error', { maxDepth: 10 }],
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
