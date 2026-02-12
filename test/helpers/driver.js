require('dotenv').config();
const { remote } = require('webdriverio');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

/**
 * Load BrowserStack configuration from YAML file
 */
function loadBrowserStackConfig() {
  const configPath = path.join(__dirname, '../../browserstack.yml');
  const fileContents = fs.readFileSync(configPath, 'utf8');
  return yaml.load(fileContents);
}

/**
 * Create and configure WebDriver instance for BrowserStack
 * @param {string} platformType - 'ios' or 'android' to select platform from browserstack.yml
 */
async function createDriver(platformType = 'android') {
  const config = loadBrowserStackConfig();
  
  // Find the platform configuration
  const platformConfig = config.platforms.find(p => p.platformName === platformType);
  
  if (!platformConfig) {
    throw new Error(`Platform '${platformType}' not found in browserstack.yml`);
  }

  const capabilities = {
    platformName: platformConfig.platformName,
    'appium:deviceName': platformConfig.deviceName,
    'appium:platformVersion': platformConfig.platformVersion,
    'appium:app': platformConfig.app,
    'appium:automationName': platformConfig.platformName === 'android' ? 'UiAutomator2' : 'XCUITest',
    'bstack:options': {
      projectName: config.projectName,
      buildName: config.buildName,
      sessionName: `${platformConfig.platformName} Test Session`,
      userName: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY
    }
  };

  // Suppress console output during connection to hide credentials
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalError = console.error;
  
  console.log = (...args) => {
    const message = args.join(' ');
    if (!message.includes('BROWSERSTACK') && !message.includes('accessKey') && !message.includes('userName')) {
      originalLog(...args);
    }
  };
  console.info = (...args) => {
    const message = args.join(' ');
    if (!message.includes('BROWSERSTACK') && !message.includes('accessKey') && !message.includes('userName')) {
      originalInfo(...args);
    }
  };

  try {
    const driver = await remote({
      protocol: 'https',
      hostname: 'hub.browserstack.com',
      port: 443,
      path: '/wd/hub',
      capabilities,
      logLevel: 'error'
    });

    return driver;
  } finally {
    // Restore console methods
    console.log = originalLog;
    console.info = originalInfo;
    console.error = originalError;
  }
}

/**
 * Wait for element to be displayed
 */
async function waitForElement(driver, selector, timeout = 10000) {
  const element = await driver.$(selector);
  await element.waitForDisplayed({ timeout });
  return element;
}

/**
 * Safe click with wait
 */
async function safeClick(driver, selector, timeout = 10000) {
  const element = await waitForElement(driver, selector, timeout);
  await element.click();
}

/**
 * Safe type with clear and wait
 */
async function safeType(driver, selector, text, timeout = 10000) {
  const element = await waitForElement(driver, selector, timeout);
  await element.clearValue();
  await element.setValue(text);
}

/**
 * Get text from element
 */
async function getText(driver, selector, timeout = 10000) {
  const element = await waitForElement(driver, selector, timeout);
  return await element.getText();
}

/**
 * Check if element exists
 */
async function elementExists(driver, selector) {
  try {
    const element = await driver.$(selector);
    return await element.isDisplayed();
  } catch (error) {
    return false;
  }
}

module.exports = {
  createDriver,
  waitForElement,
  safeClick,
  safeType,
  getText,
  elementExists
};