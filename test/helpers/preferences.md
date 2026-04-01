# Test Execution Preferences

## Command Style
- Run tests WITHOUT `--loglevel error` so step-by-step logs are visible in real time.
- Use `npm run test:spec -- <file>` to run a single spec file.
- Use `npm test` to run all specs.
- Do NOT use `npx --loglevel error wdio run ...` — this suppresses real-time logs.