exports.config = {
  tests: "./*.test.js",
  output: "./output",
  helpers: {
    Puppeteer: {
      url: "http://localhost",
      show: false
    }
  },
  include: {
    I: "./steps_file.js"
  },
  bootstrap: null,
  mocha: {},
  name: "how-to-solve-it-diagram"
};
