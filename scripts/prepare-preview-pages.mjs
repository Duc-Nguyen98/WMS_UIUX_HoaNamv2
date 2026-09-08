import { readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

export async function preparePreviewPages(output, base) {
  const extensions = new Set(['.html', '.css', '.js', '.json', '.rsc', '.txt', '.svg']);
  async function walk(dir) {
    const files = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) files.push(...await walk(path));
      else files.push(path);
    }
    return files;
  }
  for (const file of await walk(output)) {
    if (!extensions.has(extname(file))) continue;
    const before = await readFile(file, 'utf8');
    const after = before
      .replaceAll(`${base.slice(1)}/_next/`, '__PREVIEW_ASSET__/')
      .replaceAll('/_next/', `${base}/_next/`)
      .replaceAll('__PREVIEW_ASSET__/', `${base.slice(1)}/_next/`)
      // Vite's preload map stores paths without the leading slash.
      .replaceAll('"_next/', `"${base.slice(1)}/_next/`)
      .replaceAll("'_next/", `'${base.slice(1)}/_next/`);
    if (after !== before) await writeFile(file, after);
  }
  const indexPath = join(output, 'index.html');
  let index = await readFile(indexPath, 'utf8');
  // Preview owns hash navigation; prevent the framework fetching RSC on Back.
  if (!index.includes('id="hn-preview-history"')) {
    const bootstrap = '<script id="hn-preview-history">window.addEventListener("popstate",function(e){e.stopImmediatePropagation()},true);</script>';
    index = index.replace('<head>', `<head>${bootstrap}`);
    await writeFile(indexPath, index);
  }
  await writeFile(join(output, '.nojekyll'), '');
}
