module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:flowtype/recommended',
    
    // Turn off all rules that are unnecessary or might conflict with prettier
    require.resolve('eslint-config-prettier'),
  ],

  plugins: [
    // Use prettier for code format
    'eslint-plugin-prettier',
    'eslint-plugin-flowtype',
  ],
  rules: {
    'no-unused-vars': [
      'error',
      {vars: 'all', args: 'none', ignoreRestSiblings: true},
    ],

    // Prettier settings
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: false,
        jsxBracketSameLine: false,
        rangeStart: 0,
        rangeEnd: Infinity,
      },
    ],
    
    // Enforce flow file declarations
    'flowtype/require-valid-file-annotation': ['error', 'always'],

    // Enforces consistent spacing within generic type annotation parameters.
    // https://github.com/gajus/eslint-plugin-flowtype/blob/master/.README/rules/generic-spacing.md
    'flowtype/generic-spacing': 'off',
  },
};
