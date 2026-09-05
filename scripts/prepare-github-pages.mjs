import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const outputRoot = resolve('dist/client');
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.map', '.svg', '.txt']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (textExtensions.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await walk(outputRoot);
let rewritten = 0;

for (const file of files) {
  const before = await readFile(file, 'utf8');
  const after = before
    .replaceAll('/_next/', './_next/')
    .replaceAll('"/favicon.svg"', '"./favicon.svg"')
    .replaceAll("'/favicon.svg'", "'./favicon.svg'");

  if (after !== before) {
    await writeFile(file, after);
    rewritten += 1;
  }
}

await writeFile(join(outputRoot, '.nojekyll'), '');
console.log(`Prepared ${relative(process.cwd(), outputRoot)} for GitHub Pages; rewrote ${rewritten} text assets.`);
