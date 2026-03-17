require('dotenv').config();
const { createDriver } = require('../../helpers/driver');
const assert = require('assert');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const { TEST_CREDENTIALS } = require('../../data/testData');


describe('BStackDemo - User Login', function() {
  this.timeout(120000);
  let driver;
  let sessionId = "";
  let loginPage;
  let homePage;

  before(async function() {
    driver = await createDriver('android');
    sessionId = driver.sessionId;
    console.log(`[MOBILE_SESSION_ID] ${sessionId}`);
    console.log(`[MOBILE_APP_PACKAGE] com.bstack.demo`);
    
    // Initialize Page Objects
    loginPage = new LoginPage(driver);
    homePage = new HomePage(driver);
    
    // Wait for app to fully load by checking for app title
    await loginPage.getAppTitle();
  });

  after(async function() {
     // Keep session alive for debugging - do not close
    // if (driver) {
    //   await driver.deleteSession();
    // }
  });

  describe('Login Flow', function() {
    it('TC-3338923: Should successfully login with valid credentials', async function() {
      // Step 1: Verify app loads and login screen is displayed
      console.log('Step 1: Verifying BStackDemo homepage/login screen loads...');
      await loginPage.verifyLoginScreenLoaded();
      console.log('✓ Homepage loads successfully');

      // Step 2: Verify login form fields are visible
      console.log('Step 2: Verifying login form fields are visible...');
      await loginPage.verifyLoginFormFields();
      console.log('✓ Username field is displayed');
      console.log('✓ Password field is displayed');

      // Step 3: Enter credentials and submit
      console.log('Step 3: Performing login...');
      console.log('  - Entering username...');
      await loginPage.enterUsername(TEST_CREDENTIALS.username);
      
      const usernameValue = await loginPage.getEnteredUsername(TEST_CREDENTIALS.username);
      assert.strictEqual(usernameValue, TEST_CREDENTIALS.username, 'Username should be entered correctly');
      console.log('  ✓ Username entered');

      console.log('  - Entering password...');
      await loginPage.enterPassword(TEST_CREDENTIALS.password);
      
      const isPasswordMasked = await loginPage.isPasswordMasked();
      assert.ok(isPasswordMasked, 'Password should be masked and entered');
      console.log('  ✓ Password entered');

      console.log('  - Clicking Login button...');
      await loginPage.clickLoginButton();
      console.log('  ✓ Login button clicked');

      // Step 4: Verify successful login and navigation
      console.log('Step 4: Verifying successful login and redirect to homepage...');
      await homePage.verifyHomePageLoaded();
      console.log('✓ User is logged in and redirected to homepage');

      // Step 5: Verify authenticated session state
      console.log('Step 5: Verifying user session is authenticated...');
      await homePage.verifyAuthenticatedState();
      console.log('✓ User session is authenticated with full navigation access');

      console.log('\n✅ Test TC-3338923 completed successfully!');
    });
  });
});