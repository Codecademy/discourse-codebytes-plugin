module.exports = {
  extends: ['@codecademy/eslint-config'],
  rules: {
    // TODO: disable in eslint config
    'import/order': 'off',
    'lines-between-class-members': 'off',
    // TODO: disable in .ts, .tsx
    'no-restricted-globals': 'off',
    'no-undef': 'off',
  },
};

