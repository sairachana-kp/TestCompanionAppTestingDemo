const requiredMajor = 20;
const requiredMinor = 20;
const requiredPatch = 1;

function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
}

function isSupported(current) {
  if (current.major > requiredMajor) return true;
  if (current.major < requiredMajor) return false;

  if (current.minor > requiredMinor) return true;
  if (current.minor < requiredMinor) return false;

  return current.patch >= requiredPatch;
}

const current = parseVersion(process.versions.node);

if (!isSupported(current)) {
  console.error('Unsupported Node.js version: ' + process.version);
  console.error('This project requires Node.js >= 20.20.1 for WDIO 9 compatibility.');
  console.error('Run: nvm use 20.20.1');
  process.exit(1);
}
