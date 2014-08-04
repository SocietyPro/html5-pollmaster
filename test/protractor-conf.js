var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'e2e/*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  suites: {
    results: "e2e/pollResultsSpec.js"
  },

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 5000,
    showColors: true,
    realtimeFailure: true,
  },

  onPrepare: function() {
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: '/tmp/screenshots'
      , docTitle: 'Pantheon Ping Application Test Results'
    }));
  }
};
