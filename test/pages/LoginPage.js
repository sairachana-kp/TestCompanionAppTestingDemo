class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  // Selectors
  get selectors() {
    return {
      appTitle: 'android=new UiSelector().text("BStackDemo")',
      usernameField: 'android=new UiSelector().text("Username")',
      passwordField: 'android=new UiSelector().text("Password")',
      loginButton: 'android=new UiSelector().text("Login")',
      demoAccountsSection: 'android=new UiSelector().text("Demo Accounts:")'
    };
  }

  // Element getters
  async getAppTitle() {
    const element = await this.driver.$(this.selectors.appTitle);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
  }

  async getUsernameField() {
    const element = await this.driver.$(this.selectors.usernameField);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
  }

  async getPasswordField() {
    const element = await this.driver.$(this.selectors.passwordField);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
  }

  async getLoginButton() {
    const element = await this.driver.$(this.selectors.loginButton);
    await element.waitForDisplayed({ timeout: 10000 });
    return element;
  }

  // Page actions
  async isLoginScreenDisplayed() {
    const appTitle = await this.getAppTitle();
    return await appTitle.isDisplayed();
  }

  async isUsernameFieldVisible() {
    const usernameField = await this.getUsernameField();
    return await usernameField.isDisplayed();
  }

  async isPasswordFieldVisible() {
    const passwordField = await this.getPasswordField();
    return await passwordField.isDisplayed();
  }

  async enterUsername(username) {
    const usernameField = await this.getUsernameField();
    await usernameField.clearValue();
    await usernameField.setValue(username);
  }

  async enterPassword(password) {
    const passwordField = await this.getPasswordField();
    await passwordField.clearValue();
    await passwordField.setValue(password);
  }

  async clickLoginButton() {
    const loginButton = await this.getLoginButton();
    await loginButton.click();
  }

  async getEnteredUsername(username) {
    const enteredText = await this.driver.$(`android=new UiSelector().text("${username}")`);
    return await enteredText.getText();
  }

  async isPasswordMasked() {
    const passwordField = await this.driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)');
    const passwordText = await passwordField.getText();
    return passwordText.includes('•');
  }

  // High-level actions
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async verifyLoginScreenLoaded() {
    const isDisplayed = await this.isLoginScreenDisplayed();
    if (!isDisplayed) {
      throw new Error('Login screen is not displayed');
    }
    return true;
  }

  async verifyLoginFormFields() {
    const usernameVisible = await this.isUsernameFieldVisible();
    const passwordVisible = await this.isPasswordFieldVisible();
    
    if (!usernameVisible || !passwordVisible) {
      throw new Error('Login form fields are not visible');
    }
    return true;
  }
}

module.exports = LoginPage;