import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefectFixtures, DEFECT_DEFAULT, DEFECT_SORTS, defectUrl, parseDefectQuery, queryDefects, emptyDefect, validateDefect, defectPendingChanges, prepareDefectSave } from '../lib/defect-demo.ts';
const records = createDefectFixtures();
test('18 synthetic defects, 15 active and 3 inactive; default ten', () => {
  assert.equal(records.length, 18);
  assert.equal(records.filter(r => !r.active).length, 3);
  assert.ok(records.every(r => r.code.startsWith('DEMO-DEF-')));
  assert.equal(queryDefects(records, DEFECT_DEFAULT).rows.length, 10);
});
test('filter then global sort then pagination, never mutate input', () => {
  const original = JSON.stringify(records);
  for (const { value: sort } of DEFECT_SORTS) for (const size of [10, 15, 20, 50]) {
    const q = { ...DEFECT_DEFAULT, sort, size }, result = queryDefects(records, q);
    assert.deepEqual(Array.from({ length: result.pages }, (_, i) => queryDefects(records, { ...q, page: i + 1 }).rows).flat(), result.sorted);
  }
  assert.equal(queryDefects(records, DEFECT_DEFAULT).rows[0].code, 'DEMO-DEF-001');
  assert.equal(queryDefects(records, { ...DEFECT_DEFAULT, page: 2 }).rows[0].code, 'DEMO-DEF-011');
  assert.equal(queryDefects(records, { ...DEFECT_DEFAULT, sort: 'code.desc' }).rows[0].code, 'DEMO-DEF-903');
  assert.equal(queryDefects(records, { ...DEFECT_DEFAULT, status: 'inactive' }).total, 3);
  assert.equal(JSON.stringify(records), original);
});
test('DEMO search only code/name, accent retained and case ignored', () => {
  assert.equal(queryDefects(records, { ...DEFECT_DEFAULT, q: '  demo-def-001  ' }).total, 1);
  assert.equal(queryDefects(records, { ...DEFECT_DEFAULT, q: 'KHÔNG KHỞI ĐỘNG' }).total, 1);
  assert.equal(queryDefects(records, { ...DEFECT_DEFAULT, q: 'khong khoi dong' }).total, 0);
  assert.equal(queryDefects(records, { ...DEFECT_DEFAULT, q: 'tooltip' }).total, 0);
  assert.equal(queryDefects(records, { ...DEFECT_DEFAULT, q: 'does not exist' }).total, 0);
});
test('URL roundtrip preserves other prototypes and rejects malformed state', () => {
  assert.deepEqual(parseDefectQuery(''), DEFECT_DEFAULT);
  assert.deepEqual(parseDefectQuery('?defectStatus=no&defectPage=-1&defectSize=999&defectSort=bad'), DEFECT_DEFAULT);
  const q = { ...DEFECT_DEFAULT, q: 'mẫu & thử', status: 'inactive', sort: 'name.desc', page: 2, size: 15 };
  const u = defectUrl('https://example.test/WMS_UIUX_HoaNamv2/?v=demo&skuPage=2&agencyQ=Hà+Nội#catalog-prototype', q);
  assert.deepEqual(parseDefectQuery(u.search), q);
  assert.equal(u.searchParams.get('skuPage'), '2'); assert.equal(u.searchParams.get('agencyQ'), 'Hà Nội');
  assert.equal(u.hash, '#defect-prototype');
  assert.equal(queryDefects(records, { ...DEFECT_DEFAULT, page: 999 }).page, 2);
});
test('required/duplicate/length DEMO validation, no new regex or coercion', () => {
  assert.deepEqual(Object.keys(validateDefect(emptyDefect(), records)), ['code', 'name']);
  assert.ok(validateDefect({ ...emptyDefect(), code: ' demo-def-001 ', name: 'Mẫu' }, records).code);
  const valid = { ...emptyDefect(), code: 'ký hiệu tự do — DEMO', name: 'Tên mẫu', description: '' };
  assert.deepEqual(validateDefect(valid, records), {});
  for (const [key, size] of Object.entries({ code: 81, name: 201, description: 2001 })) assert.ok(validateDefect({ ...valid, [key]: 'x'.repeat(size) }, records)[key]);
  assert.deepEqual(validateDefect(records[0], records), {});
});
test('sensitive edits block entire save; name/description and historical suffix stay exact', () => {
  const initial = records[0];
  const draft = { ...initial, name: initial.name + ' thử', description: '  ghi chú\nDEMO  ' };
  assert.deepEqual(defectPendingChanges(initial, draft), []);
  assert.deepEqual(prepareDefectSave(initial, draft), draft);
  assert.equal(prepareDefectSave(initial, { ...draft, active: !initial.active }), null);
  assert.equal(prepareDefectSave(initial, { ...draft, code: 'DEMO-new' }), null);
  assert.deepEqual(defectPendingChanges(initial, { ...draft, code: 'DEMO-new', active: true }), ['code', 'active']);
  assert.deepEqual(prepareDefectSave(initial, { ...initial }), initial);
  assert.ok(prepareDefectSave(emptyDefect(), { ...emptyDefect(), code: 'new', name: 'new', active: false }));
});
