const fs = require('fs');
const path = require('path');

const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'ICRegistry.sol', 'ICRegistry.json');
const outDir = path.join(__dirname, '..', 'src', 'abi');
const outFile = path.join(outDir, 'ICRegistry.json');

function main() {
  if (!fs.existsSync(artifactPath)) {
    console.error('Artifact not found. Did you run `npm run hh:compile`?');
    process.exit(1);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const abi = artifact.abi;

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(outFile, JSON.stringify(abi, null, 2));
  console.log('ABI exported to', outFile);
}

main();
