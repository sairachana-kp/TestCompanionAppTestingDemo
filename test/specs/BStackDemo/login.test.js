const assert = require('assert');
const { createDriver, updateSessionStatus } = require('../../helpers/driver');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const { TEST_CREDENTIALS, APP_CONFIG } = require('../../data/testData');

async function run() {
  let driver;

  try {
    driver = await createDriver();
    console.log(`[MOBILE_SESSION_ID] ${driver.sessionId}`);
    console.log(`[MOBILE_APP_PACKAGE] ${APP_CONFIG.packageName}`);

    const loginPage = new LoginPage(driver);
    const homePage = new HomePage(driver);

    await loginPage.getAppTitle();

    console.log('Step 1: Verifying BStackDemo homepage/login screen loads...');
    await loginPage.verifyLoginScreenLoaded();
    console.log('Step 2: Verifying login form fields are visible...');
    await loginPage.verifyLoginFormFields();

    console.log('Step 3: Performing login...');
    await loginPage.enterUsername(TEST_CREDENTIALS.username);
    const usernameValue = await loginPage.getEnteredUsername(TEST_CREDENTIALS.username);
    assert.strictEqual(usernameValue, TEST_CREDENTIALS.username, 'Username should be entered correctly');

    await loginPage.enterPassword(TEST_CREDENTIALS.password);
    const isPasswordMasked = await loginPage.isPasswordMasked();
    assert.ok(isPasswordMasked, 'Password should be masked and entered');

    await loginPage.clickLoginButton();

    console.log('Step 4: Verifying successful login and redirect to homepage...');
    await homePage.verifyHomePageLoaded();

    console.log('Step 5: Verifying user session is authenticated...');
    await homePage.verifyAuthenticatedState();

    await updateSessionStatus(driver, true, 'Login test passed');
    console.log('SUCCESS: Test TC-3338923 completed successfully');
  } catch (error) {
    if (driver) {
      await updateSessionStatus(driver, false, error.message || 'Login test failed');
    }
    throw error;
  } finally {
    if (driver) {
      await driver.deleteSession();
    }
  }
}

module.exports = { run };

describe('BStackDemo login', () => {
  test('logs in successfully', async () => {
    await run();
  });
});

if (require.main === module) {
  run().catch((error) => {
    console.error(error && error.stack ? error.stack : error);
    process.exit(1);
  });
}