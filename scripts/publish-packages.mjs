import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const packageDirs = ['shared', 'db'];
const registry = 'https://npm.pkg.github.com';

for (const packageDir of packageDirs) {
  const cwd = join(rootDir, packageDir);
  const manifest = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
  const spec = `${manifest.name}@${manifest.version}`;

  try {
    execFileSync('npm', ['view', spec, 'version', '--registry', registry], {
      cwd,
      stdio: 'ignore',
    });
    console.log(`${spec} already exists; skipping publish.`);
    continue;
  } catch {
    console.log(`${spec} not found; publishing.`);
  }

  execFileSync('pnpm', ['publish', '--no-git-checks'], {
    cwd,
    stdio: 'inherit',
  });
}
