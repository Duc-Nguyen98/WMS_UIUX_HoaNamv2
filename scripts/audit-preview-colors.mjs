import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(
  await readFile(
    join(root, 'design/hoa-nam-color-v1/HoaNam_UI_Color_Tokens_v1.json'),
    'utf8',
  ),
);
const tokenFile = 'styles/hoa-nam-color-tokens.css';
const themeFile = 'styles/preview-theme.css';
const tokenTree = postcss.parse(await readFile(join(root, tokenFile), 'utf8'));
const normalized = (value) => value.toLowerCase().replace(/\s/g, '');
const tokenMapping = {
  brand: {
    primary: 'primary',
    primaryDark: 'primary-dark',
    supportBlue: 'support-blue',
    nearWhite: 'near-white',
  },
  neutral: {
    textPrimary: 'text-primary',
    textSecondary: 'text-secondary',
    textMuted: 'text-muted',
    border: 'border',
    surface: 'surface',
  },
  semantic: {
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info',
  },
  alpha: {
    primary06: 'primary-a06',
    primary10: 'primary-a10',
    primary14: 'primary-a14',
    primary20: 'primary-a20',
    primary28: 'primary-a28',
    support08: 'support-a08',
    support12: 'support-a12',
    support18: 'support-a18',
    dark12: 'dark-a12',
  },
  gradients: {
    primary: 'gradient-primary',
    sidebarActive: 'gradient-sidebar-active',
    heroSurface: 'gradient-hero',
    cardTint: 'gradient-card-tint',
    headlineAccent: 'gradient-headline',
  },
};
const failures = [];
const variables = new Map();
tokenTree.walkDecls((d) => variables.set(d.prop, d.value));
for (const [category, mapping] of Object.entries(tokenMapping))
  for (const [key, suffix] of Object.entries(mapping)) {
    const prop = '--hn-' + suffix;
    if (
      normalized(variables.get(prop) ?? '') !==
      normalized(tokens[category][key])
    )
      failures.push({ file: tokenFile, reason: `Token mismatch ${prop}` });
  }
const expectedNames = new Set(
  Object.values(tokenMapping).flatMap((m) =>
    Object.values(m).map((s) => '--hn-' + s),
  ),
);
for (const [name, value] of Object.entries({
  '--hn-focus-ring': '0 0 0 3px rgba(12, 98, 134, 0.28)',
  '--hn-card-shadow': '0 8px 28px rgba(12, 93, 125, 0.12)',
})) {
  expectedNames.add(name);
  if (normalized(variables.get(name) ?? '') !== normalized(value))
    failures.push({ file: tokenFile, reason: `Effect token mismatch ${name}` });
}
for (const name of variables.keys())
  if (!expectedNames.has(name))
    failures.push({ file: tokenFile, reason: `Unapproved token ${name}` });
const allowed = new Set([...variables.keys()]);
const sourceFiles = [];
for (const dir of ['components', 'lib'])
  for (const name of await readdir(join(root, dir))) {
    if (
      /^(preview-|product-preview\.|product-group-browser\.)/.test(name) &&
      /\.(css|tsx?|mjs)$/.test(name)
    )
      sourceFiles.push(dir + '/' + name);
  }
sourceFiles.push('app/preview/page.tsx', themeFile, 'styles/preview-base.css');
const themeTree = postcss.parse(await readFile(join(root, themeFile), 'utf8'));
themeTree.walkDecls((d) => {
  if (d.prop.startsWith('--')) allowed.add(d.prop);
});
const literal =
  /#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})\b|(?:rgba?|hsla?|oklch|oklab|color-mix|linear-gradient|radial-gradient)\(/i;
for (const file of sourceFiles) {
  const source = await readFile(join(root, file), 'utf8');
  if (extname(file) === '.css') {
    const tree = postcss.parse(source);
    tree.walkDecls((d) => {
      if (literal.test(d.value))
        failures.push({
          file,
          line: d.source.start.line,
          reason: `Color literal or derived gradient: ${d.prop}: ${d.value}`,
        });
      if (
        /^(color|background.*|border.*|outline.*|.*shadow|fill|stroke)$/.test(
          d.prop,
        ) &&
        /\b(white|black|red|blue|purple|indigo|violet|green|cyan|orange)\b/i.test(
          d.value.replace(/var\([^)]*\)/g, ''),
        )
      )
        failures.push({
          file,
          line: d.source.start.line,
          reason: `Named color outside tokens: ${d.value}`,
        });
      for (const match of d.value.matchAll(/var\((--[\w-]+)/g))
        if (
          !allowed.has(match[1]) &&
          !['--font-public-sans', '--font-geist-mono'].includes(match[1])
        )
          failures.push({
            file,
            line: d.source.start.line,
            reason: `Unknown token: ${match[1]}`,
          });
    });
  } else {
    const withoutComments = source
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    if (literal.test(withoutComments))
      failures.push({
        file,
        reason: 'Hardcoded color or color derivation in runtime component',
      });
    if (
      /(?:bg|text|border|ring|fill|stroke)-(?:purple|indigo|violet|blue|cyan|teal)-\d/.test(
        withoutComments,
      )
    )
      failures.push({ file, reason: 'Color utility outside theme' });
  }
}
// Detect a future imported component escaping the color audit's known runtime surface.
const shared = ['lib/utils.ts'];
for (const file of sourceFiles.filter((f) => /\.[jt]sx?$/.test(f))) {
  const source = await readFile(join(root, file), 'utf8');
  for (const m of source.matchAll(
    /(?:from\s*|import\s*\()['"]@\/([^'"]+)['"]/g,
  )) {
    const target = m[1];
    if (
      !sourceFiles.some(
        (f) => f === target || f.replace(/\.[^.]+$/, '') === target,
      ) &&
      !shared.some((f) => f.replace(/\.[^.]+$/, '') === target)
    )
      failures.push({
        file,
        reason: `Unreviewed runtime dependency: ${target}`,
      });
  }
}
const report = {
  scope:
    'App Preview only; unrelated WMS code, bitmap colors and non-rendered documents excluded',
  tokenFile,
  sourceFiles,
  sharedComponents: shared,
  checks: {
    exactTokens: failures.every((f) => f.file !== tokenFile),
    noRuntimeColorLiterals: failures.length === 0,
  },
  failures,
};
await mkdir(join(root, 'work'), { recursive: true });
await writeFile(
  join(root, 'work/preview-color-audit.json'),
  JSON.stringify(report, null, 2),
);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else
  console.log(
    `PASS: ${sourceFiles.length} Preview files use the exact locked token source. No color literals, unknown colors or unapproved gradients.`,
  );
