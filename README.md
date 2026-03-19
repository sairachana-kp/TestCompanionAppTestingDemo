# Test Companion App Automate Tests

Automated mobile test suite for the BStackDemo app using direct WebdriverIO sessions on BrowserStack App Automate.

## Prerequisites

- Node.js 18+
- BrowserStack account with App Automate access
- BStackDemo app uploaded to BrowserStack (App URL in `browserstack.yml`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

Notes:
- Device and app settings are read from `browserstack.yml`.
- Test scripts create BrowserStack sessions directly via WebdriverIO `remote()`.

## Running Tests

Run all tests:

```bash
npm test
```

Run a single spec file:

```bash
npm run test:file -- test/specs/BStackDemo/login.test.js
```

Run individual suites:

```bash
npm run test:login
npm run test:add-to-cart
```

## Project Structure

```text
.
├── browserstack.yml
├── wdio.conf.js
├── run/
│   └── runTest.js
├── test/
│   ├── data/
│   ├── helpers/
│   ├── pages/
│   └── specs/
└── README.md
```

## Troubleshooting

1. Auth errors:
   - Verify `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` in `.env`.
2. App/device mismatch:
   - Confirm values in `browserstack.yml` are valid for your BrowserStack account.
3. Session startup issues:
   - Ensure outbound network access to `hub.browserstack.com`.