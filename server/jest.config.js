/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  forceExit: true,
  collectCoverage: true,
  coverageReporters: ["text", "lcov"],
  coverageDirectory: "coverage",
  setupFiles: ['./test/setup.ts']
};