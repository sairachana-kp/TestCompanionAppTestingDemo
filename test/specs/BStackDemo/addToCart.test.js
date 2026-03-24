const assert = require('assert');
const { createDriver, updateSessionStatus } = require('../../helpers/driver');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const { TEST_CREDENTIALS } = require('../../data/testData');

async function run() {
  let driver;

  try {
    driver = await createDriver();
    const loginPage = new LoginPage(driver);
    const homePage = new HomePage(driver);

    await loginPage.getAppTitle();

    console.log('Step 1: Logging in to BStackDemo...');
    await loginPage.enterUsername(TEST_CREDENTIALS.username);
    await loginPage.enterPassword(TEST_CREDENTIALS.password);
    await loginPage.clickLoginButton();

    await homePage.verifyHomePageLoaded();

    console.log('Step 2: Verifying product listing...');
    const productCountText = await homePage.getProductCountText();
    assert.ok(productCountText.includes('Product(s) found'), 'Product listing should be displayed');

    console.log('Step 3: Adding iPhone 12 to cart...');
    await homePage.addProductToCart('iPhone12');

    console.log('Step 4: Verifying success dialog...');
    const successDialog = await driver.$('android=new UiSelector().resourceId("android:id/message")');
    await successDialog.waitForDisplayed({ timeout: 10000 });
    const dialogText = await successDialog.getText();
    assert.strictEqual(dialogText, 'Added to cart!', 'Success message should be displayed');

    console.log('Step 5: Dismissing success dialog...');
    const okButton = await driver.$('android=new UiSelector().resourceId("android:id/button1")');
    await okButton.waitForDisplayed({ timeout: 5000 });
    await okButton.click();

    console.log('Step 6: Verifying cart badge shows item count...');
    const cartBadge = await driver.$('android=new UiSelector().descriptionContains(", 1").childSelector(new UiSelector().text("1"))');
    await cartBadge.waitForDisplayed({ timeout: 10000 });
    const badgeText = await cartBadge.getText();
    assert.strictEqual(badgeText, '1', 'Cart badge should show 1 item');

    await updateSessionStatus(driver, true, 'Add to cart test passed');
    console.log('SUCCESS: Product added to cart');
  } catch (error) {
    if (driver) {
      await updateSessionStatus(driver, false, error.message || 'Add to cart test failed');
    }
    throw error;
  } finally {
    if (driver) {
      await driver.deleteSession();
    }
  }
}

module.exports = { run };

describe('BStackDemo add to cart', () => {
  test('adds iPhone 12 to the cart', async () => {
    await run();
  });
});

if (require.main === module) {
  run().catch((error) => {
    console.error(error && error.stack ? error.stack : error);
    process.exit(1);
  });
}