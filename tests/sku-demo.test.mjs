import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SKU_FIXTURES,
  SKU_DEFAULT_QUERY,
  parseSkuQuery,
  querySkus,
  skuUrl,
  modelsFor,
  emptySku,
  validateSku,
  checkImportFile,
} from '../lib/sku-demo.ts';

test('global sorting precedes slicing across every page, all supported sorts/sizes', () => {
  const original = SKU_FIXTURES.map((s) => s.id);
  for (const size of [10, 15, 20, 50])
    for (const sort of [
      'code.asc',
      'code.desc',
      'name.asc',
      'name.desc',
      'min.asc',
      'min.desc',
      'max.asc',
      'max.desc',
    ]) {
      const q = { ...SKU_DEFAULT_QUERY, size, sort };
      const whole = querySkus(SKU_FIXTURES, q);
      const paginated = Array.from(
        { length: whole.pages },
        (_, i) => querySkus(SKU_FIXTURES, { ...q, page: i + 1 }).rows,
      ).flat();
      assert.deepEqual(
        paginated.map((s) => s.id),
        whole.sorted.map((s) => s.id),
      );
      assert.equal(new Set(paginated.map((s) => s.id)).size, 72);
      const [field, direction] = sort.split('.');
      const collator = new Intl.Collator('vi', {
        numeric: true,
        sensitivity: 'accent',
      });
      for (let i = 1; i < whole.sorted.length; i++) {
        const a = whole.sorted[i - 1][field],
          b = whole.sorted[i][field];
        if (b === null) continue;
        assert.notEqual(a, null);
        const delta = typeof a === 'number' ? a - b : collator.compare(a, b);
        assert.ok(direction === 'asc' ? delta <= 0 : delta >= 0);
      }
    }
  assert.deepEqual(
    SKU_FIXTURES.map((s) => s.id),
    original,
  );
});
test('filter by q/type/brand/status/pending then sort and paginate', () => {
  const q = {
    ...SKU_DEFAULT_QUERY,
    type: 'component',
    brand: 'a',
    status: 'inactive',
    q: '  demo-sku-lk  ',
  };
  const result = querySkus(SKU_FIXTURES, q);
  assert.ok(result.total > 0);
  assert.ok(
    result.sorted.every(
      (s) => s.type === 'component' && s.brand === 'a' && !s.active,
    ),
  );
  assert.equal(
    querySkus(SKU_FIXTURES, { ...SKU_DEFAULT_QUERY, pending: true }).total,
    3,
  );
  assert.equal(
    querySkus(SKU_FIXTURES, { ...SKU_DEFAULT_QUERY, q: 'no-such-sku' }).total,
    0,
  );
});
test('URL round trip retains SKU query and unrelated Dashboard parameters', () => {
  const q = {
    q: 'Bộ mẫu',
    type: 'component',
    brand: 'b',
    status: 'active',
    pending: true,
    sort: 'name.desc',
    page: 2,
    size: 20,
  };
  const url = skuUrl(
    'https://example.com/?demoFrom=2026-08-30&demoType=all#dashboard-prototype',
    q,
  );
  assert.deepEqual(parseSkuQuery(url.search), q);
  assert.equal(url.searchParams.get('demoFrom'), '2026-08-30');
  assert.equal(url.hash, '#sku-prototype');
});
test('invalid URL values recover safely and pages are clamped to dataset', () => {
  assert.deepEqual(
    parseSkuQuery('?skuType=bogus&skuSort=injection&skuPage=-8&skuSize=999'),
    SKU_DEFAULT_QUERY,
  );
  assert.equal(
    querySkus(SKU_FIXTURES, { ...SKU_DEFAULT_QUERY, page: 999 }).page,
    5,
  );
  assert.equal(querySkus([], { ...SKU_DEFAULT_QUERY, page: 99 }).page, 1);
});
test('model options/validation respect selected brand without inventing required rules', () => {
  assert.equal(modelsFor('').length, 0);
  assert.deepEqual(
    modelsFor('a').map((m) => m.value),
    ['A-01', 'A-02'],
  );
  const s = {
    ...emptySku(),
    code: 'DEMO-NEW',
    name: 'Mẫu',
    brand: 'a',
    model: 'B-01',
  };
  assert.ok(validateSku(s, SKU_FIXTURES).model);
  assert.deepEqual(validateSku({ ...s, model: '' }, SKU_FIXTURES), {});
  assert.equal(emptySku().serial, null);
});
test('DEMO validation distinguishes zero/null, max>min and duplicate code', () => {
  const s = { ...emptySku(), code: 'DEMO-NEW', name: 'Mẫu', min: 0, max: 1 };
  assert.deepEqual(validateSku(s, SKU_FIXTURES), {});
  assert.deepEqual(
    validateSku({ ...s, min: null, max: null }, SKU_FIXTURES),
    {},
  );
  assert.ok(validateSku({ ...s, min: 2, max: 2 }, SKU_FIXTURES).max);
  assert.ok(
    validateSku(
      { ...s, code: SKU_FIXTURES[0].code.toLowerCase() },
      SKU_FIXTURES,
    ).code,
  );
});
test('file metadata validation only: extension, emptiness, size', () => {
  assert.equal(checkImportFile({ name: 'mau.xlsx', size: 1000 }), '');
  assert.ok(checkImportFile({ name: 'mau.exe', size: 1000 }));
  assert.ok(checkImportFile({ name: 'mau.xlsx', size: 0 }));
  assert.ok(checkImportFile({ name: 'mau.xls', size: 10 * 1024 * 1024 + 1 }));
});
