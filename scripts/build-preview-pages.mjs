import { cp, mkdir, readFile, readdir, writeFile, symlink, lstat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preparePreviewPages } from './prepare-preview-pages.mjs';

// Build a separate static entry point, preserving the WMS deployment at /docs.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildRoot = join(root, 'work', `preview-pages-${Date.now()}`);
const base = '/WMS_UIUX_HoaNamv2/preview';
await mkdir(buildRoot, { recursive: true });

async function copy(file, destination = file) {
  const target = join(buildRoot, destination);
  await mkdir(dirname(target), { recursive: true });
  await cp(join(root, file), target, { recursive: true });
}
for (const folder of ['components', 'lib']) {
  for (const name of await readdir(join(root, folder))) {
    if (/^(preview-|product-preview\.|product-group-browser\.)/.test(name)) {
      await copy(`${folder}/${name}`);
    }
  }
}
for (const file of [
  'components/ui/button.tsx', 'components/ui/tabs.tsx', 'lib/utils.ts',
  'app/globals.css', 'app/layout.tsx', 'next.config.ts', 'tsconfig.json',
  'package.json', 'public/preview',
]) await copy(file);
await copy('app/preview/page.tsx', 'app/page.tsx');
// Use Preview's customer-facing metadata for the isolated layout too.
const page = await readFile(join(buildRoot, 'app/page.tsx'), 'utf8');
const metadata = page.match(/export const metadata: Metadata = \{[\s\S]*?\n\};/)[0];
const layoutPath = join(buildRoot, 'app/layout.tsx');
await writeFile(layoutPath, (await readFile(layoutPath, 'utf8')).replace(
  /export const metadata: Metadata = \{[\s\S]*?\n\};/, metadata,
));
await symlink(join(root, 'node_modules'), join(buildRoot, 'node_modules'), 'junction');
await writeFile(join(buildRoot, 'vite.config.ts'), `
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  define: { 'process.env.NEXT_PUBLIC_PREVIEW_ASSET_BASE': ${JSON.stringify(JSON.stringify(base))} },
  environments: { client: { define: {
    'process.env.__NEXT_ROUTER_BASEPATH': ${JSON.stringify(JSON.stringify(base))}
  } } },
  plugins: [vinext()],
});
`);
execFileSync(process.execPath, [join(root, 'node_modules/vinext/dist/cli.js'), 'build'], {
  cwd: buildRoot, stdio: 'inherit',
});

const output = join(buildRoot, 'dist/client');
await preparePreviewPages(output, base);
const indexPath = join(output, 'index.html');
await mkdir(join(root, 'work'), { recursive: true });
await writeFile(join(root, 'work/preview-pages-latest.json'), JSON.stringify({ base, output }, null, 2));
if (!(await lstat(indexPath)).isFile()) throw new Error('Preview export missing');
console.log(`Preview export ready: ${output}`);
