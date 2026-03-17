require('dotenv').config();
const { createDriver } = require('../../helpers/driver');
const assert = require('assert');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const { TEST_CREDENTIALS } = require('../../data/testData');

describe('BStackDemo - Add to Cart', function() {
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
    
    // Wait for app to fully load
    await loginPage.getAppTitle();
  });

  beforeEach(async function() {
    if (!driver || !this.currentTest) {
      return;
    }

    await driver.execute(
      `browserstack_executor: ${JSON.stringify({
        action: 'setSessionName',
        arguments: { name: this.currentTest.fullTitle() }
      })}`
    );
  });

  afterEach(async function() {
    if (!driver || !this.currentTest) {
      return;
    }

    const status = this.currentTest.state === 'passed' ? 'passed' : 'failed';
    const reason = this.currentTest.err && this.currentTest.err.message
      ? this.currentTest.err.message.slice(0, 255)
      : `Test ${status}`;

    await driver.execute(
      `browserstack_executor: ${JSON.stringify({
        action: 'setSessionStatus',
        arguments: { status, reason }
      })}`
    );
  });

  after(async function() {
    // Keep session alive for debugging - do not close
    // if (driver) {
    //   await driver.deleteSession();
    // }
  });

  describe('Add Product to Cart', function() {
    it('Should successfully add a product to cart', async function() {
      // Step 1: Login to the application
      console.log('Step 1: Logging in to BStackDemo...');
      await loginPage.enterUsername(TEST_CREDENTIALS.username);
      await loginPage.enterPassword(TEST_CREDENTIALS.password);
      await loginPage.clickLoginButton();
      
      await homePage.verifyHomePageLoaded();
      console.log('✓ User logged in successfully');

      // Step 2: Verify product listing is displayed
      console.log('Step 2: Verifying product listing...');
      const productCountText = await homePage.getProductCountText();
      assert.ok(productCountText.includes('Product(s) found'), 'Product listing should be displayed');
      console.log(`✓ Product listing displayed: ${productCountText}`);

      // Step 3: Add first product (iPhone 12) to cart
      console.log('Step 3: Adding iPhone 12 to cart...');
      await homePage.addProductToCart('iPhone12');
      console.log('✓ Clicked add to cart button');

      // Step 4: Verify success dialog appears
      console.log('Step 4: Verifying success dialog...');
      const successDialog = await driver.$('android=new UiSelector().resourceId("android:id/message")');
      await successDialog.waitForDisplayed({ timeout: 10000 });
      const dialogText = await successDialog.getText();
      assert.strictEqual(dialogText, 'Added to cart!', 'Success message should be displayed');
      console.log('✓ Success dialog displayed: "Added to cart!"');

      // Step 5: Dismiss the success dialog
      console.log('Step 5: Dismissing success dialog...');
      const okButton = await driver.$('android=new UiSelector().resourceId("android:id/button1")');
      await okButton.waitForDisplayed({ timeout: 5000 });
      await okButton.click();
      console.log('✓ Success dialog dismissed');

      // Step 6: Verify cart badge shows item count
      console.log('Step 6: Verifying cart badge shows item count...');
      const cartBadge = await driver.$('android=new UiSelector().descriptionContains("iPhone 12").childSelector(new UiSelector().text("1"))');
      await cartBadge.waitForDisplayed({ timeout: 10000 });
      const badgeText = await cartBadge.getText();
      assert.strictEqual(badgeText, '1', 'Cart badge should show 1 item');
      console.log('✓ Cart badge shows: 1 item');

      console.log('\n✅ Test completed successfully! Product added to cart.');
    });
  });
});