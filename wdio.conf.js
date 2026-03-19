require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const browserstackConfigPath = path.join(process.cwd(), 'browserstack.yml');
const browserstackConfig = yaml.load(fs.readFileSync(browserstackConfigPath, 'utf8'));
const platform = browserstackConfig.platforms[0];

module.exports = {
  hostname: 'hub.browserstack.com',
  port: 443,
  protocol: 'https',
  path: '/wd/hub',
  logLevel: 'error',
  capabilities: {
    platformName: platform.platformName,
    'appium:automationName': platform.platformName === 'android' ? 'UiAutomator2' : 'XCUITest',
    'appium:deviceName': platform.deviceName,
    'appium:platformVersion': platform.platformVersion,
    'appium:app': platform.app,
    'bstack:options': {
      projectName: browserstackConfig.projectName,
      buildName: browserstackConfig.buildName,
      sessionName: 'BStackDemo App Automate Session',
      userName: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    },
  },
};