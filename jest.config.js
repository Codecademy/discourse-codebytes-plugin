module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js'],
  modulePaths: ['./assets/javascripts'],
  roots: ['<rootDir>', '<rootDir>/assets/javascripts'],
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['<rootDir>/[/\\\\](node_modules|test)[/\\\\]'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!\\@codecademy)']
};
