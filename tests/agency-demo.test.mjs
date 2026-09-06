import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AGENCY_DEFAULT,
  AGENCY_SORTS,
  AGENCY_TYPES,
  createAgencyFixtures,
  queryAgencies,
  parseAgencyQuery,
  agencyUrl,
  agencyLabel,
  agencyAddress,
  emptyAgency,
  validateAgency,
  prepareAgencySave,
  agencyPendingChanges,
  demoWards,
} from '../lib/agency-demo.ts';
const records = createAgencyFixtures();
test('26 synthetic recipients match four type counts and five inactive records', () => {
  assert.equal(records.length, 26);
  assert.equal(records.filter((r) => !r.active).length, 5);
  assert.deepEqual(
    AGENCY_TYPES.map((t) => records.filter((r) => r.type === t.value).length),
    [11, 5, 5, 5],
  );
  assert.ok(records.every((r) => r.code.startsWith('DEMO-')));
});
test('sorting operates on the complete filtered set before every page slice', () => {
  const original = JSON.stringify(records);
  for (const sort of AGENCY_SORTS)
    for (const size of [10, 15, 20, 50]) {
      const q = { ...AGENCY_DEFAULT, sort, size };
      const all = queryAgencies(records, q);
      assert.deepEqual(
        Array.from(
          { length: all.pages },
          (_, i) => queryAgencies(records, { ...q, page: i + 1 }).rows,
        ).flat(),
        all.sorted,
      );
    }
  assert.equal(
    queryAgencies(records, AGENCY_DEFAULT).rows[0].code,
    'DEMO-AG-001',
  );
  assert.equal(
    queryAgencies(records, { ...AGENCY_DEFAULT, page: 2 }).rows[0].code,
    'DEMO-AG-091',
  );
  assert.equal(
    queryAgencies(records, { ...AGENCY_DEFAULT, page: 3 }).rows.length,
    6,
  );
  assert.equal(JSON.stringify(records), original);
});
test('type/status/search use user labels without searching contacts or phone', () => {
  assert.equal(
    queryAgencies(records, {
      ...AGENCY_DEFAULT,
      type: 'agency',
      status: 'inactive',
    }).total,
    2,
  );
  const byLabel = queryAgencies(records, {
    ...AGENCY_DEFAULT,
    q: 'miền bắc',
  }).sorted;
  assert.ok(
    byLabel.length > 0 && byLabel.every((r) => r.market === 'MIEN_BAC'),
  );
  assert.equal(
    queryAgencies(records, { ...AGENCY_DEFAULT, q: 'Người liên hệ mẫu' }).total,
    0,
  );
  assert.equal(
    queryAgencies(records, { ...AGENCY_DEFAULT, q: 'nothing matches' }).total,
    0,
  );
  assert.equal(agencyLabel('QUANG_NINH'), 'Quảng Ninh');
  assert.equal(agencyLabel('legacy free value'), 'legacy free value');
});
test('default ten and safe URL parsing retain unrelated prototype parameters', () => {
  assert.deepEqual(parseAgencyQuery(''), AGENCY_DEFAULT);
  assert.deepEqual(
    parseAgencyQuery(
      '?agencySize=0&agencyPage=-3&agencySort=no&agencyType=unknown',
    ),
    AGENCY_DEFAULT,
  );
  const q = {
    ...AGENCY_DEFAULT,
    q: 'Miền Bắc',
    status: 'inactive',
    page: 2,
    size: 15,
  };
  const u = agencyUrl(
    'https://example.test/WMS_UIUX_HoaNamv2/?skuPage=2&catalogType=model',
    q,
  );
  assert.deepEqual(parseAgencyQuery(u.search), q);
  assert.equal(u.searchParams.get('skuPage'), '2');
  assert.equal(u.searchParams.get('catalogType'), 'model');
  assert.equal(u.hash, '#agency-prototype');
  assert.equal(
    queryAgencies(records, { ...AGENCY_DEFAULT, page: 999 }).page,
    3,
  );
});
test('save no-op and unrelated edits preserve exact phone and legacy address', () => {
  const initial = {
    ...records.find((r) => r.code === 'DEMO-AG-090'),
    phone: '0900000090',
  };
  assert.deepEqual(prepareAgencySave(initial, { ...initial }), initial);
  for (const phone of [
    '',
    '0900000090',
    ' 090 000 0090 ',
    '+00 (DEMO) 123 ext 2',
  ]) {
    const source = { ...initial, phone };
    const payload = prepareAgencySave(source, {
      ...source,
      name: 'Tên DEMO đã sửa',
    });
    assert.equal(payload.phone, phone);
    assert.equal(payload.legacyAddress, initial.legacyAddress);
    assert.equal(agencyAddress(payload), initial.legacyAddress);
    assert.equal(validateAgency(payload, records).phone, undefined);
  }
});
test('sensitive changes are explicit review-only flags, never inferred usage counts', () => {
  const initial = records[0];
  assert.deepEqual(
    agencyPendingChanges(initial, { ...initial, name: 'Tên khác' }),
    [],
  );
  assert.deepEqual(
    agencyPendingChanges(initial, {
      ...initial,
      code: 'new',
      type: 'agency',
      active: !initial.active,
    }),
    ['code', 'type', 'active'],
  );
});
test('required fields/length/duplicate and synthetic province-ward relationship validate', () => {
  assert.deepEqual(Object.keys(validateAgency(emptyAgency(), records)), [
    'code',
    'name',
    'type',
  ]);
  const draft = {
    ...emptyAgency(),
    code: records[0].code.toLowerCase(),
    name: 'DEMO',
    type: 'agency',
  };
  assert.ok(validateAgency(draft, records).code);
  assert.equal(
    validateAgency(
      {
        ...draft,
        code: 'unique',
        province: 'Tỉnh mẫu A',
        ward: demoWards('Tỉnh mẫu B')[0],
      },
      records,
    ).ward,
    'Phường/Xã không thuộc Tỉnh mẫu đã chọn.',
  );
  assert.deepEqual(
    validateAgency(
      {
        ...draft,
        code: 'unique',
        province: 'Tỉnh mẫu A',
        ward: demoWards('Tỉnh mẫu A')[0],
      },
      records,
    ),
    {},
  );
});
