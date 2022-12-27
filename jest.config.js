module.exports = {
  verbose: true,
  testMatch: ["<rootDir>/test/**/*.mjs"],
  transform: {
    "^.+\\.mjs$": "babel-jest",
  },
  moduleFileExtensions: ["js", "mjs"],
};
