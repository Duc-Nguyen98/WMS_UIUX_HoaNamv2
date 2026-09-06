import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_PREVIEW_FILTERS,
  PREVIEW_PRODUCTS,
  PREVIEW_CATEGORIES,
  PREVIEW_HOME_CATEGORIES,
  previewCategoriesForGroup,
  previewGroupFilters,
  filterPreviewProducts,
  parsePreviewLocation,
  previewHash,
} from '../lib/product-preview.ts';
import {
  validatePreviewRequest,
  sendPreviewRequest,
  rememberAcceptedRequest,
} from '../lib/preview-request.ts';
import {
  readDeviceLibrary,
  recordRecent,
  toggleSaved,
  comparisonSelection,
} from '../lib/preview-library.ts';

test('device lists tolerate corrupt storage and reject unknown, duplicate or non-string IDs', () => {
  assert.deepEqual(readDeviceLibrary('{broken', PREVIEW_PRODUCTS), {
    recent: [],
    saved: [],
  });
  const raw = JSON.stringify({
    recent: ['dczc02-26', 3, 'removed', 'dczc02-26'],
    saved: ['dzg02-15', null],
    phone: '0900000000',
  });
  assert.deepEqual(readDeviceLibrary(raw, PREVIEW_PRODUCTS), {
    recent: ['dczc02-26'],
    saved: ['dzg02-15'],
  });
});
test('recent products move to the front while saved IDs remain independent', () => {
  const source = { recent: ['dczc02-26', 'dzg02-15'], saved: ['dzg02-11'] };
  const next = recordRecent(source, 'dzg02-15', PREVIEW_PRODUCTS);
  assert.deepEqual(next, {
    recent: ['dzg02-15', 'dczc02-26'],
    saved: ['dzg02-11'],
  });
  assert.deepEqual(source.recent, ['dczc02-26', 'dzg02-15']);
  assert.deepEqual(toggleSaved(next, 'dzg02-11', PREVIEW_PRODUCTS).saved, []);
  assert.deepEqual(toggleSaved(next, 'unknown', PREVIEW_PRODUCTS).saved, [
    'dzg02-11',
  ]);
});
test('device lists resolve against current products rather than keeping a stale stock snapshot', () => {
  const changedCatalogue = PREVIEW_PRODUCTS.filter(
    (item) => item.id !== 'dzg02-15',
  );
  const value = readDeviceLibrary(
    JSON.stringify({ saved: ['dczc02-26', 'dzg02-15'] }),
    changedCatalogue,
  );
  assert.deepEqual(value.saved, ['dczc02-26']);
  assert.deepEqual(Object.keys(value), ['recent', 'saved']);
});
test('comparison prevents cross-category picks and a fourth product, but allows removing a selected model', () => {
  assert.ok(
    comparisonSelection(['dzg02-11'], 'dczc02-26', PREVIEW_PRODUCTS).error,
  );
  const three = ['dzg02-11', 'dzg02-15', 'dzg03-15'];
  assert.deepEqual(
    comparisonSelection(three, 'dzg06-15', PREVIEW_PRODUCTS).ids,
    three,
  );
  assert.ok(comparisonSelection(three, 'dzg06-15', PREVIEW_PRODUCTS).error);
  assert.deepEqual(
    comparisonSelection(three, 'dzg02-15', PREVIEW_PRODUCTS).ids,
    ['dzg02-11', 'dzg03-15'],
  );
});
test('all six added screens survive hash navigation', () => {
  for (const view of [
    'recent',
    'saved',
    'help',
    'selection',
    'requests',
    'compare',
  ]) {
    assert.equal(
      parsePreviewLocation(previewHash(view, DEFAULT_PREVIEW_FILTERS)).view,
      view,
    );
  }
});
test('multi-product requests reject empty, duplicate and invalid selections and transmit every valid product', async () => {
  const known = PREVIEW_PRODUCTS.map((item) => item.id);
  for (const productIds of [[], ['unknown'], ['dczc02-26', 'dczc02-26']])
    assert.ok(
      validatePreviewRequest({ ...requestDraft, productIds }, known).productIds,
    );
  const draft = { ...requestDraft, productIds: ['dczc02-26', 'dzg02-15'] };
  assert.deepEqual(validatePreviewRequest(draft, known), {});
  await sendPreviewRequest(
    '/local-test',
    draft,
    'multi-key',
    async (_url, options) => {
      assert.deepEqual(JSON.parse(options.body), draft);
      assert.equal('productId' in JSON.parse(options.body), false);
      return Response.json({ accepted: true, requestId: 'MULTI-ACCEPTED' });
    },
  );
});
test('accepted-request summaries are immutable and deduplicate the real receipt ID', () => {
  const record = {
    receipt: { accepted: true, requestId: 'ACCEPTED-1' },
    draft: { ...requestDraft, productIds: ['dczc02-26'] },
    products: [{ id: 'dczc02-26', name: 'Khoan', model: 'DCZC02-26' }],
  };
  const records = rememberAcceptedRequest([], record);
  record.draft.productIds.push('dzg02-15');
  record.products[0].name = 'changed';
  assert.deepEqual(records[0].draft.productIds, ['dczc02-26']);
  assert.equal(records[0].products[0].name, 'Khoan');
  assert.equal(rememberAcceptedRequest(records, records[0]).length, 1);
});

test('search finds exact models without punctuation and ranks them above description matches', () => {
  const records = [
    {
      ...PREVIEW_PRODUCTS[0],
      id: 'description-match',
      model: 'OTHER',
      description: 'Compatible with DZG02-15',
    },
    PREVIEW_PRODUCTS[2],
  ];
  for (const query of ['DZG02-15', 'dzg0215']) {
    assert.equal(
      filterPreviewProducts(records, { ...DEFAULT_PREVIEW_FILTERS, query })[0]
        .id,
      'dzg02-15',
    );
  }
});

test('new screens preserve navigation and unknown detail links reach the unavailable state', () => {
  for (const view of ['search', 'detail', 'request']) {
    assert.equal(
      parsePreviewLocation(
        previewHash(view, DEFAULT_PREVIEW_FILTERS, 'dczc02-26'),
      ).view,
      view,
    );
  }
  assert.equal(
    parsePreviewLocation('#view=detail&product=retired-product').productId,
    'retired-product',
  );
});

const requestDraft = {
  name: 'Kiểm thử',
  phone: '0900000000',
  productIds: ['dczc02-26'],
  note: '',
};
test('request validation rejects missing fields and invalid products without mutating entered data', () => {
  const ids = PREVIEW_PRODUCTS.map((product) => product.id);
  assert.deepEqual(validatePreviewRequest(requestDraft, ids), {});
  assert.deepEqual(
    validatePreviewRequest({ ...requestDraft, phone: '+84 900 000 000' }, ids),
    {},
  );
  const invalid = {
    name: ' ',
    phone: '123',
    productIds: ['unknown'],
    note: 'a'.repeat(1001),
  };
  const before = { ...invalid };
  assert.deepEqual(Object.keys(validatePreviewRequest(invalid, ids)), [
    'name',
    'phone',
    'productIds',
    'note',
  ]);
  assert.deepEqual(invalid, before);
});

test('missing sales destination never sends a request or creates a receipt', async () => {
  let calls = 0;
  await assert.rejects(
    sendPreviewRequest(null, requestDraft, 'test-key', async () => {
      calls++;
      return Response.json({ accepted: true, requestId: 'test' });
    }),
    /unavailable/,
  );
  assert.equal(calls, 0);
});

test('request requires explicit acceptance and a receipt, even when HTTP status is successful', async () => {
  for (const payload of [
    {},
    { success: true },
    { accepted: false, requestId: 'test' },
    { accepted: true },
    { accepted: true, requestId: '' },
  ]) {
    await assert.rejects(
      sendPreviewRequest('/local-test', requestDraft, 'test-key', async () =>
        Response.json(payload),
      ),
      /unconfirmed/,
    );
  }
  await assert.rejects(
    sendPreviewRequest(
      '/local-test',
      requestDraft,
      'test-key',
      async () => new Response(null, { status: 503 }),
    ),
    /not-accepted/,
  );
  await assert.rejects(
    sendPreviewRequest('/local-test', requestDraft, 'test-key', async () => {
      throw new Error('network');
    }),
    /network/,
  );
});

test('confirmed requests forward a stable idempotency key and return only the actual receipt', async () => {
  const calls = [];
  const transport = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ accepted: true, requestId: 'TEST-RECEIPT' });
  };
  for (let i = 0; i < 2; i++)
    assert.deepEqual(
      await sendPreviewRequest(
        '/local-test',
        requestDraft,
        'same-key',
        transport,
      ),
      { accepted: true, requestId: 'TEST-RECEIPT' },
    );
  assert.equal(
    calls[0].options.headers['Idempotency-Key'],
    calls[1].options.headers['Idempotency-Key'],
  );
  assert.deepEqual(JSON.parse(calls[0].options.body), requestDraft);
});

test('guest catalog searches Vietnamese without accents and combines words across model and name', () => {
  const records = filterPreviewProducts(PREVIEW_PRODUCTS, {
    ...DEFAULT_PREVIEW_FILTERS,
    query: '  KHOAN   dczc02-26 ',
  });
  assert.deepEqual(
    records.map((item) => item.id),
    ['dczc02-26'],
  );
  // The drill also supports demolition; its supplied description must remain searchable.
  assert.equal(
    filterPreviewProducts(PREVIEW_PRODUCTS, {
      ...DEFAULT_PREVIEW_FILTERS,
      query: 'bua pha do dien',
    }).length,
    7,
  );
  assert.equal(
    filterPreviewProducts(PREVIEW_PRODUCTS, {
      ...DEFAULT_PREVIEW_FILTERS,
      query: 'khong choi than',
    }).length,
    1,
  );
});

test('availability combines with category and can return an honest empty result', () => {
  const preorder = filterPreviewProducts(PREVIEW_PRODUCTS, {
    ...DEFAULT_PREVIEW_FILTERS,
    availability: 'preorder',
    category: 'construction',
  });
  assert.deepEqual(
    preorder.map((item) => item.id),
    ['dzg02-15', 'dzg06-15'],
  );
  assert.equal(
    filterPreviewProducts(PREVIEW_PRODUCTS, {
      ...DEFAULT_PREVIEW_FILTERS,
      group: 'hand',
    }).length,
    0,
  );
  assert.equal(
    filterPreviewProducts(PREVIEW_PRODUCTS, {
      ...DEFAULT_PREVIEW_FILTERS,
      availability: 'preorder',
      category: 'drilling',
    }).length,
    0,
  );
  assert.equal(
    filterPreviewProducts(PREVIEW_PRODUCTS, DEFAULT_PREVIEW_FILTERS).length,
    7,
  );
});

test('a product deep link restores the originating filtered catalog and safely encodes text', () => {
  const filters = {
    query: 'điện & khoan #1',
    group: 'machine',
    category: 'construction',
    availability: 'preorder',
    sort: 'name',
  };
  const hash = previewHash('catalog', filters, 'dzg02-15');
  assert.deepEqual(parsePreviewLocation(hash), {
    view: 'catalog',
    filters,
    productId: 'dzg02-15',
  });
});

test('invalid links fall back to available views and never fabricate a product', () => {
  assert.deepEqual(
    parsePreviewLocation(
      '#view=admin&group=unknown&category=other&status=unknown&sort=price&product=secret',
    ),
    {
      view: 'home',
      filters: DEFAULT_PREVIEW_FILTERS,
      productId: null,
    },
  );
});

test('sorting and filtering do not mutate source screenshot records', () => {
  const before = JSON.stringify(PREVIEW_PRODUCTS);
  const sorted = filterPreviewProducts(PREVIEW_PRODUCTS, {
    ...DEFAULT_PREVIEW_FILTERS,
    sort: 'name',
  });
  assert.equal(JSON.stringify(PREVIEW_PRODUCTS), before);
  assert.equal(sorted.length, PREVIEW_PRODUCTS.length);
  assert.equal(new Set(sorted.map((item) => item.id)).size, 7);
});

test('group navigation retains the selected group in shareable URLs and resets unrelated filters', () => {
  for (const group of ['machine', 'hand', 'accessory']) {
    const parsed = parsePreviewLocation(
      previewHash('groups', previewGroupFilters(group)),
    );
    assert.equal(parsed.view, 'groups');
    assert.deepEqual(parsed.filters, { ...DEFAULT_PREVIEW_FILTERS, group });
    assert.equal(parsed.productId, null);
  }
  const drillLink = previewHash(
    'catalog',
    previewGroupFilters('machine', 'drilling'),
  );
  assert.equal(parsePreviewLocation(drillLink).filters.category, 'drilling');
  assert.equal(
    filterPreviewProducts(
      PREVIEW_PRODUCTS,
      parsePreviewLocation(drillLink).filters,
    )[0].id,
    'dczc02-26',
  );
});

test('group/category links do not leak machine categories into hand tools or accessories', () => {
  assert.ok(
    previewCategoriesForGroup('machine').every(
      (item) => item.group === 'machine',
    ),
  );
  assert.ok(
    previewCategoriesForGroup('hand').every((item) => item.group === 'hand'),
  );
  assert.deepEqual(previewCategoriesForGroup('accessory'), []);
  assert.equal(
    new Set(PREVIEW_CATEGORIES.map((item) => item.id)).size,
    PREVIEW_CATEGORIES.length,
  );
  assert.deepEqual(previewGroupFilters('hand', 'construction'), {
    ...DEFAULT_PREVIEW_FILTERS,
    group: 'hand',
  });
  assert.equal(
    parsePreviewLocation('#view=catalog&group=hand&category=construction')
      .filters.category,
    'all',
  );
  assert.deepEqual(
    PREVIEW_HOME_CATEGORIES.map((item) => item.id),
    ['clamping', 'construction', 'cutting', 'drilling'],
  );
});

test('all products in a group includes both availability states and does not invent records for empty categories', () => {
  const allMachine = filterPreviewProducts(
    PREVIEW_PRODUCTS,
    previewGroupFilters('machine'),
  );
  assert.deepEqual(
    new Set(allMachine.map((item) => item.availability)),
    new Set(['ready', 'preorder']),
  );
  for (const category of previewCategoriesForGroup('machine')) {
    const result = filterPreviewProducts(
      PREVIEW_PRODUCTS,
      previewGroupFilters('machine', category.id),
    );
    assert.ok(
      result.every(
        (item) => item.group === 'machine' && item.category === category.id,
      ),
    );
  }
  assert.equal(
    filterPreviewProducts(
      PREVIEW_PRODUCTS,
      previewGroupFilters('machine', 'garden-power'),
    ).length,
    0,
  );
  assert.equal(
    filterPreviewProducts(PREVIEW_PRODUCTS, previewGroupFilters('accessory'))
      .length,
    0,
  );
});
