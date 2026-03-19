require('dotenv').config();
const { remote } = require('webdriverio');
const wdioConfig = require('../../wdio.conf');

async function createDriver() {
  return remote({
    protocol: wdioConfig.protocol,
    hostname: wdioConfig.hostname,
    port: wdioConfig.port,
    path: wdioConfig.path,
    logLevel: wdioConfig.logLevel,
    capabilities: wdioConfig.capabilities,
  });
}

async function updateSessionStatus(driver, passed, reason) {
  const status = passed ? 'passed' : 'failed';
  const executorPayload = {
    action: 'setSessionStatus',
    arguments: {
      status,
      reason,
    },
  };

  await driver.execute(`browserstack_executor: ${JSON.stringify(executorPayload)}`);
}

module.exports = {
  createDriver,
  updateSessionStatus,
};
