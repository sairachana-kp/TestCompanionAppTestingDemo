class HomePage {
  // Selectors
  get selectors() {
    return {
      searchField: 'android=new UiSelector().text("Search products...")',
      productCount: 'android=new UiSelector().textContains("Product(s) found")',
      productsTab: 'android=new UiSelector().description("Products tab")',
      cartTab: 'android=new UiSelector().description("Shopping cart tab")',
      profileTab: 'android=new UiSelector().description("User profile tab")',
      ordersTab: 'android=new UiSelector().description("Orders history tab")'
    };
  }

  // Element getters
  async getSearchField() {
    const element = await $(this.selectors.searchField);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
  }

  async getProductCount() {
    const element = await $(this.selectors.productCount);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
  }

  async getProductsTab() {
    const element = await $(this.selectors.productsTab);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
  }

  async getCartTab() {
    const element = await $(this.selectors.cartTab);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
  }

  async getProfileTab() {
    const element = await $(this.selectors.profileTab);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
  }

  async getAddToCartButton(productName) {
    const selector = `android=new UiSelector().descriptionContains("${productName}, Apple").childSelector(new UiSelector().clickable(true).className("android.view.ViewGroup"))`;
    const element = await $(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
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