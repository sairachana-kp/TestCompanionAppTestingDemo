require('dotenv').config({ quiet: true });

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  hostname: 'hub.browserstack.com',

  services: [
    [
      'browserstack',
      {
        buildIdentifier: '${BUILD_NUMBER}',
        browserstackLocal: false,
      }
    ]
  ],

  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': 'Samsung Galaxy S23',
      'appium:platformVersion': '13.0',
      'appium:app': 'bs://f0579d931c6ecfc4221769c3d03c6d6f3b92a6f1',
      'appium:automationName': 'UiAutomator2',
      'bstack:options': {
        projectName: 'Test Companion App Testing',
        buildName: 'Test Companion App Test Build',
        sessionName: 'BStackDemo Tests',
        debug: true,
        networkLogs: true,
      }
    }
  ],

  specs: ['./test/specs/**/*.js'],
  exclude: [],

  logLevel: 'error',
  bail: 0,
  baseUrl: '',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },

  // Hooks
  beforeSession: function (config, capabilities, specs) {
    console.log('Starting WebDriverIO session...');
  },

  before: function (capabilities, specs) {
    console.log('Test session started');
  },

  afterTest: async function(test, context, { error, result, duration, passed, retries }) {
    if (error) {
      await browser.takeScreenshot();
    }
  },

  after: function (result, capabilities, specs) {
    console.log('Test session completed');
  },
};