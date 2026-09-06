import assert from 'node:assert/strict';
import test from 'node:test';

test('catalog defaults to ten rows without invalidating explicit shared page sizes', () => {
  assert.equal(CATALOG_DEFAULT.size, 10);
  for (const search of ['', '?catalogSize=999', '?catalogSize=bogus'])
    assert.equal(parseCatalogQuery(search).size, 10);
  assert.equal(parseCatalogQuery('?catalogSize=15').size, 15);
});
import {
  SKU_FIXTURES,
  SKU_BRANDS,
  SKU_MODELS,
  emptySku,
  validateSku,
  parseSkuQuery,
} from '../lib/sku-demo.ts';
import {
  CATALOG_TYPES,
  CATALOG_SORTS,
  CATALOG_DEFAULT,
  createCatalogFixtures,
  queryCatalog,
  parseCatalogQuery,
  catalogUrl,
  referencedSkus,
  catalogImpact,
  validateCatalog,
  emptyCatalog,
} from '../lib/catalog-demo.ts';

const records = createCatalogFixtures(SKU_BRANDS, SKU_MODELS);
test('all five synthetic catalogs support global sorting before pagination without mutating seeds', () => {
  const original = JSON.stringify(records);
  for (const type of CATALOG_TYPES)
    for (const size of [10, 15, 20, 50])
      for (const sort of CATALOG_SORTS) {
        const q = { ...CATALOG_DEFAULT, type, size, sort };
        const result = queryCatalog(records, q);
        const pages = Array.from(
          { length: result.pages },
          (_, i) => queryCatalog(records, { ...q, page: i + 1 }).rows,
        ).flat();
        assert.deepEqual(pages, result.sorted);
        assert.equal(new Set(pages.map((r) => r.id)).size, result.all);
        const [field, direction] = sort.split('.');
        const collator = new Intl.Collator('vi', {
          numeric: true,
          sensitivity: 'accent',
        });
        for (let i = 1; i < pages.length; i++) {
          const a = pages[i - 1][field],
            b = pages[i][field];
          const delta = field === 'order' ? a - b : collator.compare(a, b);
          assert.ok(direction === 'asc' ? delta <= 0 : delta >= 0);
        }
      }
  assert.equal(JSON.stringify(records), original);
  assert.equal(queryCatalog(records, CATALOG_DEFAULT).rows.length, 10);
});
test('filtering precedes sorting and pagination, with distinct total and filtered counts', () => {
  const result = queryCatalog(records, {
    ...CATALOG_DEFAULT,
    q: '  thử nghiệm  ',
    status: 'inactive',
  });
  assert.ok(result.total > 0 && result.total < result.all);
  assert.ok(
    result.rows.every((r) => !r.active && r.name.includes('thử nghiệm')),
  );
  const none = queryCatalog(records, {
    ...CATALOG_DEFAULT,
    q: 'no-such-demo-code',
  });
  assert.equal(none.total, 0);
  assert.ok(none.all > 0);
  assert.equal(queryCatalog([], CATALOG_DEFAULT).all, 0);
});
test('catalog URL restores tab/filter/sort/page/size and retains SKU and Dashboard query', () => {
  const q = {
    type: 'model',
    q: 'Mẫu A',
    status: 'active',
    sort: 'order.desc',
    page: 2,
    size: 10,
  };
  const url = catalogUrl(
    'https://example.com/?skuPage=2&skuSize=15&demoType=all#sku-prototype',
    q,
  );
  assert.deepEqual(parseCatalogQuery(url.search), q);
  assert.equal(url.searchParams.get('skuPage'), '2');
  assert.equal(url.searchParams.get('demoType'), 'all');
  assert.equal(url.hash, '#catalog-prototype');
  assert.deepEqual(
    parseCatalogQuery(
      '?catalogType=x&catalogStatus=x&catalogSort=x&catalogPage=-1&catalogSize=999',
    ),
    CATALOG_DEFAULT,
  );
  assert.equal(
    queryCatalog(records, { ...CATALOG_DEFAULT, page: 999 }).page,
    2,
  );
  assert.equal(queryCatalog([], { ...CATALOG_DEFAULT, page: 999 }).page, 1);
});
test('references use actual shared DEMO keys; unknown power-source mapping is null, never invented zero', () => {
  for (const r of records) {
    const related = referencedSkus(r, SKU_FIXTURES);
    if (r.type === 'source') assert.equal(related, null);
    else {
      const field = {
        brand: 'brand',
        model: 'model',
        group: 'group',
        packaging: 'packaging',
      }[r.type];
      assert.deepEqual(
        related,
        SKU_FIXTURES.filter((s) => s[field] === r.reference),
      );
      assert.deepEqual(
        referencedSkus({ ...r, name: 'Renamed DEMO label' }, SKU_FIXTURES),
        related,
      );
    }
  }
});
test('brand impact deduplicates direct and model-linked SKU; unknown rules are preview-only', () => {
  const before = records.find((r) => r.type === 'brand' && r.reference === 'a');
  const impact = catalogImpact(
    before,
    { ...before, active: !before.active },
    records,
    SKU_FIXTURES,
  );
  assert.ok(impact.models.length > 0);
  const ids = new Set(
    [
      ...referencedSkus(before, SKU_FIXTURES),
      ...impact.models.flatMap((m) => referencedSkus(m, SKU_FIXTURES)),
    ].map((s) => s.id),
  );
  assert.equal(impact.affected.length, ids.size);
  assert.equal(impact.blocked, true);
  for (const patch of [{ code: 'NEW' }, { active: false }, { order: 99 }])
    assert.ok(
      catalogImpact(before, { ...before, ...patch }, records, SKU_FIXTURES)
        .blocked,
    );
  assert.equal(
    catalogImpact(
      before,
      { ...before, name: 'New DEMO name', description: 'Updated' },
      records,
      SKU_FIXTURES,
    ).blocked,
    false,
  );
  const model = records.find((r) => r.type === 'model' && r.brand === 'a');
  assert.ok(
    catalogImpact(model, { ...model, brand: 'b' }, records, SKU_FIXTURES)
      .blocked,
  );
  assert.ok(
    catalogImpact(
      undefined,
      { ...emptyCatalog('brand'), active: false },
      records,
      SKU_FIXTURES,
    ).blocked,
  );
  assert.ok(
    catalogImpact(
      undefined,
      { ...emptyCatalog('brand'), order: 1 },
      records,
      SKU_FIXTURES,
    ).blocked,
  );
  assert.equal(
    catalogImpact(undefined, emptyCatalog('brand'), records, SKU_FIXTURES)
      .blocked,
    false,
  );
});
test('validation enforces observed field lengths and active brand options, not an invented required Model brand', () => {
  const valid = { ...emptyCatalog('model'), code: 'QA-NEW', name: 'Mẫu QA' };
  assert.deepEqual(validateCatalog(valid, records), {});
  assert.ok(validateCatalog({ ...valid, brand: 'missing' }, records).brand);
  assert.deepEqual(validateCatalog({ ...valid, brand: 'a' }, records), {});
  const inactive = records.find((r) => r.type === 'brand' && !r.active);
  assert.ok(
    validateCatalog({ ...valid, brand: inactive.reference }, records).brand,
  );
  for (const [key, value] of [
    ['code', 'x'.repeat(81)],
    ['name', 'x'.repeat(201)],
    ['description', 'x'.repeat(2001)],
    ['order', NaN],
  ])
    assert.ok(validateCatalog({ ...valid, [key]: value }, records)[key]);
  assert.ok(validateCatalog({ ...valid, code: '  a-01  ' }, records).code);
});
test('SKU form can validate newly created catalog Model/Brand references and share their filters in URL', () => {
  const newModel = { value: 'DEMO-NEW-MODEL', brand: 'DEMO-NEW-BRAND' };
  const sku = {
    ...emptySku(),
    code: 'QA-SKU',
    name: 'Mẫu QA',
    brand: newModel.brand,
    model: newModel.value,
  };
  assert.deepEqual(
    validateSku(sku, SKU_FIXTURES, [...SKU_MODELS, newModel]),
    {},
  );
  assert.ok(
    validateSku({ ...sku, brand: 'a' }, SKU_FIXTURES, [...SKU_MODELS, newModel])
      .model,
  );
  assert.equal(parseSkuQuery('?skuBrand=DEMO-NEW-BRAND').brand, newModel.brand);
});
