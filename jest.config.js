/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/index.ts", 
    "!src/config/**",
    "!src/database/**",
    "!src/types/**",
    "!src/swagger/**",
  ],
  coverageDirectory: "coverage",
};

module.exports = config;
