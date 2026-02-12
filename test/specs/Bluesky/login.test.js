const assert = require('assert');
const { createDriver, safeClick, safeType, getText, elementExists } = require('../../helpers/driver');

describe('Bluesky Login Flow', function() {
  this.timeout(300000); // 5 minutes timeout for BrowserStack
  
  let driver;

  before(async function() {
    // Use 'ios' platform from browserstack.yml
    driver = await createDriver('ios');
  });

  after(async function() {
    if (driver) {
      await driver.deleteSession();
    }
  });

  it('should display the welcome screen', async function() {
    // Wait for welcome screen to load
    const welcomeText = await getText(driver, '~What\'s up?');
    assert.strictEqual(welcomeText, 'What\'s up?', 'Welcome screen should be displayed');
  });

  it('should navigate to login screen', async function() {
    // Click Sign in button
    await safeClick(driver, '~signInButton');
    
    // Wait for navigation to complete
    await driver.pause(2000);
    
    // Verify login screen is displayed by checking for login form elements instead
    const usernameExists = await elementExists(driver, '~loginUsernameInput');
    assert.strictEqual(usernameExists, true, 'Login screen should be displayed with username input');
  });

  it('should display login form elements', async function() {
    // Verify hosting provider button exists
    const hostingProviderExists = await elementExists(driver, '~selectServiceButton');
    assert.strictEqual(hostingProviderExists, true, 'Hosting provider button should exist');
    
    // Verify username input exists
    const usernameExists = await elementExists(driver, '~loginUsernameInput');
    assert.strictEqual(usernameExists, true, 'Username input should exist');
    
    // Verify password input exists
    const passwordExists = await elementExists(driver, '~loginPasswordInput');
    assert.strictEqual(passwordExists, true, 'Password input should exist');
    
    // Verify Next button exists
    const nextButtonExists = await elementExists(driver, '~loginNextButton');
    assert.strictEqual(nextButtonExists, true, 'Next button should exist');
  });

  it('should enter credentials and submit login', async function() {
    // Enter username
    await safeType(driver, '~loginUsernameInput', 'testuser@example.com');
    
    // Enter password
    await safeType(driver, '~loginPasswordInput', 'TestPassword123!');
    
    // Click Next button
    await safeClick(driver, '~loginNextButton');
    
    // Wait a moment for the response
    await driver.pause(2000);
  });

  it('should display error message for invalid credentials', async function() {
    // Verify error message is displayed
    const errorExists = await elementExists(driver, '~Incorrect username or password');
    assert.strictEqual(errorExists, true, 'Error message should be displayed for invalid credentials');
    
    // Get error message text
    const errorText = await getText(driver, '~Incorrect username or password');
    assert.strictEqual(errorText, 'Incorrect username or password', 'Error message should match expected text');
  });

  it('should verify login form is still accessible after error', async function() {
    // Verify username input still exists and has value
    const usernameExists = await elementExists(driver, '~loginUsernameInput');
    assert.strictEqual(usernameExists, true, 'Username input should still be accessible');
    
    // Verify password input still exists
    const passwordExists = await elementExists(driver, '~loginPasswordInput');
    assert.strictEqual(passwordExists, true, 'Password input should still be accessible');
    
    // Verify Next button still exists
    const nextButtonExists = await elementExists(driver, '~loginNextButton');
    assert.strictEqual(nextButtonExists, true, 'Next button should still be accessible');
  });
});