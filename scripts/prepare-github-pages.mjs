import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const outputRoot = resolve('dist/client');
const githubBasePath = '/WMS_UIUX_HoaNamv2';
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
  let after = before
    .replaceAll(`${githubBasePath}/_next/`, './_next/')
    .replaceAll('/_next/', './_next/')
    .replaceAll('"_next/', '"./_next/')
    .replaceAll("'_next/", "'./_next/")
    .replaceAll(`"${githubBasePath}/favicon.svg"`, '"./favicon.svg"')
    .replaceAll(`'${githubBasePath}/favicon.svg'`, "'./favicon.svg'")
    .replaceAll('"/favicon.svg"', '"./favicon.svg"')
    .replaceAll("'/favicon.svg'", "'./favicon.svg'");

  // Vinext's client router is emitted with an empty base path by default.
  // GitHub Pages project sites are mounted below /<repo>, so teach the
  // generated navigation runtime to strip that prefix from location paths.
  if (file.endsWith('.js') && file.includes(`${join('_next', 'static', 'chunks')}${process.platform === 'win32' ? '\\' : '/'}`)) {
    after = after.replace('Xn=``', `Xn=\`${githubBasePath}\``);
  }

  if (after !== before) {
    await writeFile(file, after);
    rewritten += 1;
  }
}

await writeFile(join(outputRoot, '.nojekyll'), '');
console.log(`Prepared ${relative(process.cwd(), outputRoot)} for GitHub Pages; rewrote ${rewritten} text assets.`);
