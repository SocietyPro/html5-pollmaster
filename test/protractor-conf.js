var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'e2e/*.js',
    'util/reporter-hack.js'
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
    defaultTimeoutInterval: 10000,
    showColors: true,
    realtimeFailure: true,
  },

  onPrepare: function() {
    require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new jasmine.SpecReporter({displayStacktrace: true}));
  }
};
