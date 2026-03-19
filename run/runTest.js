const path = require('path');

async function main() {
  const targetSpec = process.argv[2];

  if (!targetSpec) {
    console.error('Usage: node run/runTest.js <spec-file-path>');
    process.exit(1);
  }

  const fullPath = path.resolve(process.cwd(), targetSpec);
  const specModule = require(fullPath);

  if (!specModule || typeof specModule.run !== 'function') {
    console.error(`Spec file must export an async run() function: ${targetSpec}`);
    process.exit(1);
  }

  try {
    await specModule.run();
    console.log(`PASS: ${targetSpec}`);
  } catch (error) {
    console.error(`FAIL: ${targetSpec}`);
    console.error(error && error.stack ? error.stack : error);
    process.exit(1);
  }
}

main();
