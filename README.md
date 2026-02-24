# Bluesky iOS Login Flow Test

Automated test suite for testing the Bluesky iOS app login flow using Appium and BrowserStack.

## Prerequisites

- Node.js (v14 or higher)
- BrowserStack account with credentials
- Bluesky iOS app uploaded to BrowserStack (App ID: `bs://8be1a1d73549a6999f971bfacc1f07dfba0b17e2`)

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

1. **Welcome Screen Display** - Verifies the app launches and displays the welcome screen
2. **Navigation to Login** - Tests navigation from welcome screen to login screen
3. **Login Form Elements** - Validates all login form elements are present
4. **Credential Entry** - Tests entering username and password
5. **Error Handling** - Verifies error message display for invalid credentials
6. **Form Persistence** - Ensures form remains accessible after error

## Test Results

Test results will be available in:
- BrowserStack dashboard: https://app-automate.browserstack.com/
- Console output during test execution

## Configuration

### BrowserStack Settings
Edit `browserstack.yml` to modify:
- Device selection (currently iPhone 15, iOS 17)
- Parallel execution settings
- Project and build names

### Test Timeout
Default timeout is 5 minutes per test. Modify in `test/specs/login.test.js`:
```javascript
this.timeout(300000); // milliseconds
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
   - Elements use accessibility IDs (e.g., `~signInButton`)
   - Verify element selectors match the app's accessibility identifiers

## Helper Functions

The `test/helpers/driver.js` module provides:
- `createDriver()` - Initialize WebDriver session
- `safeClick(selector)` - Click with automatic wait
- `safeType(selector, text)` - Type text with clear and wait
- `getText(selector)` - Get element text
- `elementExists(selector)` - Check element presence

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Use helper functions for common operations
3. Add descriptive test names and assertions
4. Update this README with new test coverage