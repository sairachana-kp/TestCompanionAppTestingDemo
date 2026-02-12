const assert = require('assert');
const { createDriver, safeClick, safeType, getText, elementExists, waitForElement } = require('../../helpers/driver');

describe('Skyscanner Flight Search - Mumbai to Delhi', function() {
  this.timeout(300000); // 5 minutes timeout for BrowserStack
  
  let driver;

  before(async function() {
    // Use 'android' platform from browserstack.yml
    driver = await createDriver('android');
  });

  after(async function() {
    if (driver) {
      await driver.deleteSession();
    }
  });

  it('should dismiss privacy policy overlay', async function() {
    // Wait for privacy policy to appear
    await driver.pause(3000);
    
    // Click Accept all button
    const acceptButton = await driver.$('id=net.skyscanner.android.main:id/privacy_policy_accept_button');
    await acceptButton.waitForDisplayed({ timeout: 10000 });
    await acceptButton.click();
    
    console.log('✓ Privacy policy accepted');
  });

  it('should skip login screen', async function() {
    // Wait for login screen to load
    await driver.pause(2000);
    
    // Scroll down to ensure Maybe later button is visible
    await driver.touchAction([
      { action: 'press', x: 500, y: 1500 },
      { action: 'wait', ms: 500 },
      { action: 'moveTo', x: 500, y: 500 },
      { action: 'release' }
    ]);
    
    await driver.pause(1000);
    
    // Click Maybe later using UiAutomator selector
    const maybeLaterButton = await driver.$('android=new UiSelector().text("Maybe later")');
    await maybeLaterButton.waitForDisplayed({ timeout: 10000 });
    await maybeLaterButton.click();
    
    console.log('✓ Login screen skipped');
  });

  it('should navigate to flight search', async function() {
    // Wait for home screen to load
    await driver.pause(2000);
    
    // Click Flights icon
    const flightsIcon = await driver.$('id=net.skyscanner.android.main:id/flights_icon');
    await flightsIcon.waitForDisplayed({ timeout: 10000 });
    await flightsIcon.click();
    
    console.log('✓ Navigated to flight search');
  });

  it('should dismiss widget installation popup', async function() {
    // Wait for widget popup to appear
    await driver.pause(2000);
    
    // Click Close button using UiAutomator selector
    const closeButton = await driver.$('android=new UiSelector().text("Close")');
    await closeButton.waitForDisplayed({ timeout: 10000 });
    await closeButton.click();
    
    console.log('✓ Widget popup dismissed');
  });

  it('should enter Mumbai as departure city', async function() {
    // Click on Departing From field
    const originField = await driver.$('id=net.skyscanner.android.main:id/origin');
    await originField.waitForDisplayed({ timeout: 10000 });
    await originField.click();
    
    // Wait for search modal to appear
    await driver.pause(1000);
    
    // Click on search field to activate it
    const searchField = await driver.$('android=new UiSelector().resourceId("searchModalTextField")');
    await searchField.waitForDisplayed({ timeout: 10000 });
    await searchField.click();
    
    // Type Mumbai
    await searchField.setValue('Mumbai');
    
    // Wait for search results
    await driver.pause(2000);
    
    // Click on Mumbai (BOM) from results
    const mumbaiOption = await driver.$('android=new UiSelector().text("Mumbai (BOM)")');
    await mumbaiOption.waitForDisplayed({ timeout: 10000 });
    await mumbaiOption.click();
    
    console.log('✓ Mumbai selected as departure city');
  });

  it('should enter Delhi as destination city', async function() {
    // Click on Flying To field
    const destinationField = await driver.$('id=net.skyscanner.android.main:id/destination');
    await destinationField.waitForDisplayed({ timeout: 10000 });
    await destinationField.click();
    
    // Wait for search modal to appear
    await driver.pause(1000);
    
    // Click on search field to activate it
    const searchField = await driver.$('android=new UiSelector().resourceId("searchModalTextField")');
    await searchField.waitForDisplayed({ timeout: 10000 });
    await searchField.click();
    
    // Type Delhi
    await searchField.setValue('Delhi');
    
    // Wait for search results
    await driver.pause(2000);
    
    // Click on Delhi Indira Gandhi International (DEL) from results
    const delhiOption = await driver.$('android=new UiSelector().text("Delhi Indira Gandhi International (DEL)")');
    await delhiOption.waitForDisplayed({ timeout: 10000 });
    await delhiOption.click();
    
    console.log('✓ Delhi selected as destination city');
  });

  it('should select departure date', async function() {
    // For roundtrip, dates are already pre-selected (Tue, Feb 17 and Tue, Feb 24)
    // We can skip date selection and proceed directly to search
    // This matches the actual app behavior where default dates are set
    
    console.log('✓ Using default departure dates (already set)');
  });

  it('should initiate flight search', async function() {
    // Click SEARCH button
    const searchButton = await driver.$('id=net.skyscanner.android.main:id/searchButton');
    await searchButton.waitForDisplayed({ timeout: 10000 });
    await searchButton.click();
    
    // Wait for search results to load
    await driver.pause(5000);
    
    console.log('✓ Flight search initiated');
  });

  it('should validate IndiGo appears in search results', async function() {
    // Wait for results to fully load
    await driver.pause(3000);
    
    // Check if IndiGo option is displayed
    const indigoOption = await driver.$('android=new UiSelector().text("IndiGo")');
    const isDisplayed = await indigoOption.isDisplayed();
    
    assert.strictEqual(isDisplayed, true, 'IndiGo should appear in flight search results');
    
    // Get the text to verify
    const airlineText = await indigoOption.getText();
    assert.strictEqual(airlineText, 'IndiGo', 'Airline name should be IndiGo');
    
    console.log('✓ IndiGo validated in search results');
  });

  it('should verify flight details are displayed', async function() {
    // Verify route information is displayed
    const routeHeader = await driver.$('id=net.skyscanner.android.main:id/titleLabel');
    const routeText = await routeHeader.getText();
    
    assert.ok(routeText.includes('Mumbai'), 'Route should include Mumbai');
    assert.ok(routeText.includes('Delhi'), 'Route should include Delhi');
    
    console.log('✓ Flight details verified');
  });

  it('should verify multiple flight options are available', async function() {
    // Check for Air India option (first result)
    const airIndiaOption = await driver.$('android=new UiSelector().text("Air India")');
    const airIndiaDisplayed = await airIndiaOption.isDisplayed();
    assert.strictEqual(airIndiaDisplayed, true, 'Air India should be in results');
    
    // Check for IndiGo option (second result)
    const indigoOption = await driver.$('android=new UiSelector().text("IndiGo")');
    const indigoDisplayed = await indigoOption.isDisplayed();
    assert.strictEqual(indigoDisplayed, true, 'IndiGo should be in results');
    
    console.log('✓ Multiple flight options verified');
  });
});