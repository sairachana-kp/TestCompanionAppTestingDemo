require('dotenv').config();
const { createDriver, safeClick, safeType, getText, waitForElement, elementExists } = require('../../helpers/driver');
const assert = require('assert');

describe('BStackDemo - User Login', function() {
  this.timeout(120000);
  let driver;
  let sessionId = "";

  before(async function() {
    driver = await createDriver('android');
    sessionId = driver.sessionId;
    console.log(`[MOBILE_SESSION_ID] ${sessionId}`);
    console.log(`[MOBILE_APP_PACKAGE] com.bstack.demo`);
    
    // Wait for app to fully load
    await driver.pause(5000);
  });

  after(async function() {
    // Keep session alive for debugging - do not close
    // if (driver) {
    //   await driver.deleteSession();
    // }
  });

  it('TC-3338923: Should successfully login with valid credentials', async function() {
    // Step 1: Verify app loads and login screen is displayed
    console.log('Step 1: Verifying BStackDemo homepage/login screen loads...');
    const appTitle = await waitForElement(driver, 'android=new UiSelector().text("BStackDemo")');
    assert.ok(await appTitle.isDisplayed(), 'BStackDemo title should be displayed');
    console.log('✓ Homepage loads successfully');

    // Step 2: Verify username field is visible
    console.log('Step 2: Verifying username field is visible...');
    const usernameField = await waitForElement(driver, 'android=new UiSelector().text("Username")');
    assert.ok(await usernameField.isDisplayed(), 'Username field should be visible');
    console.log('✓ Username field is displayed');

    // Step 3: Verify password field is visible
    console.log('Step 3: Verifying password field is visible...');
    const passwordField = await waitForElement(driver, 'android=new UiSelector().text("Password")');
    assert.ok(await passwordField.isDisplayed(), 'Password field should be visible');
    console.log('✓ Password field is displayed');

    // Step 4: Enter valid username
    console.log('Step 4: Entering valid username...');
    await safeType(driver, 'android=new UiSelector().text("Username")', 'demouser');
    const usernameValue = await getText(driver, 'android=new UiSelector().text("demouser")');
    assert.strictEqual(usernameValue, 'demouser', 'Username should be entered correctly');
    console.log('✓ Valid username is entered');

    // Step 5: Enter valid password
    console.log('Step 5: Entering valid password...');
    await safeType(driver, 'android=new UiSelector().text("Password")', 'testpass123');
    // Password field shows masked characters, verify field is populated
    const passwordFieldAfter = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)');
    const passwordText = await passwordFieldAfter.getText();
    assert.ok(passwordText.includes('•'), 'Password should be masked and entered');
    console.log('✓ Valid password is entered');

    // Step 6: Click Login button
    console.log('Step 6: Clicking Login button...');
    await safeClick(driver, '~Login');
    console.log('✓ Login button is clicked');

    // Wait for navigation to complete
    await driver.pause(3000);

    // Step 7: Verify successful login and redirect to homepage
    console.log('Step 7: Verifying successful login and redirect to homepage...');
    const searchField = await waitForElement(driver, 'android=new UiSelector().text("Search products...")');
    assert.ok(await searchField.isDisplayed(), 'Product catalog search field should be displayed after login');
    
    const productCount = await waitForElement(driver, 'android=new UiSelector().textContains("Product(s) found")');
    assert.ok(await productCount.isDisplayed(), 'Product count should be displayed');
    console.log('✓ User is logged in and redirected to homepage');

    // Step 8: Verify user session is authenticated
    console.log('Step 8: Verifying user session is authenticated...');
    // Check for authenticated state indicators: product catalog, navigation bar, search functionality
    const productsTab = await waitForElement(driver, 'android=new UiSelector().descriptionContains("Products")');
    assert.ok(await productsTab.isDisplayed(), 'Products tab should be visible in authenticated state');
    
    const cartTab = await waitForElement(driver, 'android=new UiSelector().descriptionContains("Cart")');
    assert.ok(await cartTab.isDisplayed(), 'Cart tab should be visible in authenticated state');
    
    const profileTab = await waitForElement(driver, 'android=new UiSelector().descriptionContains("Profile")');
    assert.ok(await profileTab.isDisplayed(), 'Profile tab should be visible in authenticated state');
    
    console.log('✓ User session is authenticated with full navigation access');

    console.log('\n✅ Test TC-3338923 completed successfully!');
  });
});