module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js'],
  testMatch: ['**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!\\@codecademy)']
};
