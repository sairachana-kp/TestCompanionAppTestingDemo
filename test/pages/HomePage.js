const { waitForElement } = require('../helpers/driver');

class HomePage {
  constructor(driver) {
    this.driver = driver;
  }

  // Selectors
  get selectors() {
    return {
      searchField: 'android=new UiSelector().text("Search products...")',
      productCount: 'android=new UiSelector().textContains("Product(s) found")',
      productsTab: 'android=new UiSelector().descriptionContains("Products")',
      cartTab: 'android=new UiSelector().descriptionContains("Cart")',
      profileTab: 'android=new UiSelector().descriptionContains("Profile")',
      ordersTab: 'android=new UiSelector().descriptionContains("Orders")'
    };
  }

  // Element getters
  async getSearchField() {
    return await waitForElement(this.driver, this.selectors.searchField);
  }

  async getProductCount() {
    return await waitForElement(this.driver, this.selectors.productCount);
  }

  async getProductsTab() {
    return await waitForElement(this.driver, this.selectors.productsTab);
  }

  async getCartTab() {
    return await waitForElement(this.driver, this.selectors.cartTab);
  }

  async getProfileTab() {
    return await waitForElement(this.driver, this.selectors.profileTab);
  }

  async getAddToCartButton(productName) {
    const selector = `android=new UiSelector().descriptionContains("${productName}").childSelector(new UiSelector().clickable(true).instance(0))`;
    return await waitForElement(this.driver, selector);
  }

  // Page state checks
  async isSearchFieldDisplayed() {
    const searchField = await this.getSearchField();
    return await searchField.isDisplayed();
  }

  async isProductCountDisplayed() {
    const productCount = await this.getProductCount();
    return await productCount.isDisplayed();
  }

  async isProductsTabVisible() {
    const productsTab = await this.getProductsTab();
    return await productsTab.isDisplayed();
  }

  async isCartTabVisible() {
    const cartTab = await this.getCartTab();
    return await cartTab.isDisplayed();
  }

  async isProfileTabVisible() {
    const profileTab = await this.getProfileTab();
    return await profileTab.isDisplayed();
  }

  // High-level verification methods
  async verifyHomePageLoaded() {
    const searchDisplayed = await this.isSearchFieldDisplayed();
    const productCountDisplayed = await this.isProductCountDisplayed();
    
    if (!searchDisplayed || !productCountDisplayed) {
      throw new Error('Home page did not load correctly after login');
    }
    return true;
  }

  async verifyAuthenticatedState() {
    const productsVisible = await this.isProductsTabVisible();
    const cartVisible = await this.isCartTabVisible();
    const profileVisible = await this.isProfileTabVisible();
    
    if (!productsVisible || !cartVisible || !profileVisible) {
      throw new Error('User is not in authenticated state - navigation tabs missing');
    }
    return true;
  }

  async verifyUserLoggedIn() {
    await this.verifyHomePageLoaded();
    await this.verifyAuthenticatedState();
    return true;
  }

  // Page actions
  async searchForProduct(searchTerm) {
    const searchField = await this.getSearchField();
    await searchField.setValue(searchTerm);
  }

  async navigateToCart() {
    const cartTab = await this.getCartTab();
    await cartTab.click();
  }

  async navigateToProfile() {
    const profileTab = await this.getProfileTab();
    await profileTab.click();
  }

  async navigateToProducts() {
    const productsTab = await this.getProductsTab();
    await productsTab.click();
  }

  async addProductToCart(productName) {
    const addToCartButton = await this.getAddToCartButton(productName);
    await addToCartButton.click();
  }

  async getProductCountText() {
    const productCount = await this.getProductCount();
    return await productCount.getText();
  }

  async verifyProductCount(expectedCount) {
    const countText = await this.getProductCountText();
    const expectedText = `${expectedCount} Product(s) found`;
    
    if (countText !== expectedText) {
      throw new Error(`Expected product count "${expectedText}" but got "${countText}"`);
    }
    return true;
  }
}

module.exports = HomePage;