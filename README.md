# BStackDemo Android Login Flow Test

Automated test suite for testing the BStackDemo Android app login flow using Appium and BrowserStack.

## Prerequisites

- Node.js (v14 or higher)
- BrowserStack account with credentials
- BStackDemo Android app uploaded to BrowserStack (App ID: `bs://f0579d931c6ecfc4221769c3d03c6d6f3b92a6f1`)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set BrowserStack credentials as environment variables:
```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

Or create a `.env` file (not recommended for production):
```
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

## Project Structure

```
.
├── browserstack.yml          # BrowserStack configuration
├── package.json              # Project dependencies
├── test/
│   ├── helpers/
│   │   └── driver.js        # WebDriver helper functions
│   └── specs/
│       └── login.test.js    # Login flow test cases
└── README.md
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run All Specs (Explicit)
```bash
npm run test:all
```

### Run Locally (requires local Appium server)
```bash
npm run test:local
```

## Running Individual Test Files

Run a single test file:
```bash
npm run test:file -- test/specs/BStackDemo/login.test.js
```

Run a single test by name:
```bash
npm run test:grep -- "Exact test title"
```

Tip: If you want to use npm test with a file path, pass arguments after `--`:
```bash
npm test -- test/specs/BStackDemo/login.test.js
```

## Test Coverage

The test suite covers the following scenarios:

1. **Welcome Screen Display** - Verifies the app launches and displays the BStackDemo login screen
2. **Username Field Verification** - Validates the username field is visible and ready for input
3. **Password Field Verification** - Ensures the password field is visible and accessible
4. **Valid Credential Entry** - Tests entering valid username (demouser) and password (testpass123)
5. **Successful Login** - Verifies the app successfully logs in and redirects to the product catalog
6. **Product Catalog Display** - Confirms the product search field and product count are displayed
7. **Navigation State** - Validates Products, Cart, and Profile tabs are visible in authenticated state
8. **Session Authentication** - Ensures the user session is properly authenticated with full navigation access

## Test Results

Test results will be available in:
- BrowserStack dashboard: https://app-automate.browserstack.com/
- Console output during test execution

## Configuration

### BrowserStack Settings
Edit `browserstack.yml` to modify:
- Device selection (currently Samsung Galaxy S23, Android 13)
- Parallel execution settings
- Project and build names
- Platform settings (android or ios)

### Test Timeout
Default timeout is 2 minutes per test. Modify in `test/specs/BStackDemo/login.test.js`:
```javascript
this.timeout(120000); // milliseconds
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY are set correctly
   - Check credentials at https://www.browserstack.com/accounts/settings

2. **App Not Found**
   - Ensure the app ID in `browserstack.yml` matches your uploaded app
   - Upload app using BrowserStack REST API or dashboard

3. **Element Not Found**
   - Android elements use UiSelector format (e.g., `android=new UiSelector().text("Username")`)
   - Elements can also be referenced by accessibility IDs (e.g., `~Login`)
   - Verify element selectors match the app's UI elements

## Helper Functions

The `test/helpers/driver.js` module provides:
- `createDriver(platformType)` - Initialize WebDriver session for specified platform (android/ios)
- `waitForElement(driver, selector, timeout)` - Wait for element to be displayed
- `safeClick(driver, selector, timeout)` - Click element with automatic wait
- `safeType(driver, selector, text, timeout)` - Type text with clear and wait
- `getText(driver, selector, timeout)` - Get element text
- `elementExists(driver, selector)` - Check if element is displayed

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Use helper functions for common operations
3. Add descriptive test names and assertions
4. Update this README with new test coverage