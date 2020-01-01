module.exports = {
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true
  },
  plugins: ['prettier'],
  extends: ['standard', 'prettier', 'plugin:import/warnings'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
      },
    ],
    'import/no-named-as-default': 0,
  },
};
