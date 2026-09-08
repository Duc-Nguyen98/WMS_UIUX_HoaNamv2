import test from 'node:test';
import assert from 'node:assert/strict';
import { createCmsSnapshot } from '../lib/rbac-cms-snapshot.ts';
import {
  selectionState,
  displayedPermissions,
  applyVisibleSelection,
  sameCodes,
  canDeleteRole,
  deleteRole,
  saveRolePermissions,
  addOverrides,
  userView,
  normalizeSearch,
} from '../lib/rbac.ts';

test('CMS snapshot has 77 unique accounts, 13 roles, 64 original codes and exact assignment counts', () => {
  const d = createCmsSnapshot();
  assert.equal(d.accounts.length, 77);
  assert.equal(d.roles.length, 13);
  assert.equal(d.permissions.length, 64);
  assert.equal(new Set(d.accounts.map((a) => a.username)).size, 77);
  assert.equal(new Set(d.permissions.map((p) => p.code)).size, 64);
  for (const r of d.roles) {
    assert.equal(
      d.assignments.filter((a) => a.roleCode === r.code).length,
      r.assignedUserCount,
    );
    assert.equal(new Set(r.permissions).size, r.permissions.length);
    assert.ok(
      r.permissions.every((c) => d.permissions.some((p) => p.code === c)),
    );
  }
  assert.ok(d.permissions.some((p) => p.code === 'warranty.pii.view'));
  assert.ok(d.permissions.some((p) => p.code === 'warranty.pii.export'));
  assert.ok(
    !d.permissions.some((p) =>
      ['warranty.pl.view', 'warranty.export'].includes(p.code),
    ),
  );
});
test('Q01/Q02 every account projects the same identity, department, audit and assignment for List/Detail', () => {
  const d = createCmsSnapshot();
  for (const a of d.accounts) {
    const u = userView(d, a.username);
    assert.equal(u.email, a.email);
    assert.equal(u.department, d.departments[a.username]);
    assert.equal(u.lastLogin, d.authAudit[a.username]);
    assert.deepEqual(
      u.assignments,
      d.assignments.filter((x) => x.username === a.username),
    );
  }
  const u = userView(d, 'leadership-02');
  assert.equal(u.email, 'leadership-02@gmail.com');
  assert.equal(u.department, 'Phòng hành chính - nhân sự');
  assert.equal(u.lastLogin, '05-09-2026 15:26');
  assert.equal(u.assignments[0].scope, 'Theo chức năng');
  assert.equal(u.effective.length, 12);
  assert.equal(userView(d, 'unknown'), null);
});
test('Q03 classification neither creates roles nor changes effective permissions', () => {
  const d = createCmsSnapshot(),
    before = userView(d, 'leadership-02').effective;
  d.accounts.find(
    (a) => a.username === 'leadership-02',
  ).managementClassification = 'Quản trị cấp cao';
  assert.deepEqual(userView(d, 'leadership-02').effective, before);
  assert.ok(!d.roles.some((r) => r.name === 'Quản trị cấp cao'));
});
test('Q05 exhaustive parent states for every group and empty group', () => {
  const d = createCmsSnapshot();
  for (const g of new Set(d.permissions.map((p) => p.group))) {
    const codes = d.permissions.filter((p) => p.group === g).map((p) => p.code);
    for (let n = 0; n <= codes.length; n++) {
      const s = selectionState(codes, codes.slice(0, n));
      assert.equal(s.checked, n === codes.length);
      assert.equal(s.indeterminate, n > 0 && n < codes.length);
      assert.equal(s.count, n);
    }
  }
  assert.deepEqual(selectionState([], []), {
    count: 0,
    total: 0,
    checked: false,
    indeterminate: false,
  });
});
test('Q04 bulk applies to filter/search intersection and preserves all hidden and restricted states', () => {
  const d = createCmsSnapshot();
  for (const r of d.roles) {
    for (const group of ['', ...new Set(d.permissions.map((p) => p.group))])
      for (const q of ['', 'view', 'scan', 'no-match'])
        for (const checked of [true, false]) {
          const visible = displayedPermissions(d.permissions, q, group);
          const result = applyVisibleSelection(
            r.permissions,
            visible,
            checked,
            !!r.locked,
          );
          for (const p of d.permissions) {
            const mutable =
              !r.locked &&
              !p.restricted &&
              visible.some((v) => v.code === p.code);
            assert.equal(
              result.includes(p.code),
              mutable ? checked : r.permissions.includes(p.code),
            );
          }
        }
  }
});
test('save and undo semantics: reordered/no-change sets clean, change returns immutable commit and updates every assigned user', () => {
  const d = createCmsSnapshot(),
    r = d.roles.find((r) => r.code === 'LEADERSHIP'),
    snapshot = JSON.stringify(d);
  assert.ok(sameCodes(r.permissions, [...r.permissions].reverse()));
  const draft = [...r.permissions, 'report.export'];
  assert.ok(!sameCodes(draft, r.permissions));
  const next = saveRolePermissions(d, r.code, draft);
  assert.equal(JSON.stringify(d), snapshot);
  assert.equal(
    next.roles.find((r) => r.code === 'LEADERSHIP').permissions.length,
    13,
  );
  for (const a of next.assignments.filter((a) => a.roleCode === 'LEADERSHIP'))
    assert.ok(userView(next, a.username).effective.includes('report.export'));
  assert.throws(() =>
    saveRolePermissions(d, r.code, [...draft, 'invented.permission']),
  );
  assert.throws(() => saveRolePermissions(d, 'SUPER_ADMIN', draft));
});
test('restricted legacy codes cannot be granted or removed by save', () => {
  const d = createCmsSnapshot(),
    keeper = d.roles.find((r) => r.code === 'WAREHOUSE_KEEPER'),
    lead = d.roles.find((r) => r.code === 'LEADERSHIP');
  assert.throws(() =>
    saveRolePermissions(
      d,
      keeper.code,
      keeper.permissions.filter((p) => p !== 'scan.inbound'),
    ),
  );
  assert.throws(() =>
    saveRolePermissions(d, lead.code, [...lead.permissions, 'scan.inbound']),
  );
});
test('Q06 all assigned roles fail delete in UI predicate and command guard, even on stale zero count', () => {
  const d = createCmsSnapshot();
  for (const r of d.roles) {
    assert.equal(canDeleteRole(r, d.assignments), false);
    assert.throws(() => deleteRole(d, r.code));
    assert.equal(
      canDeleteRole({ ...r, assignedUserCount: 0 }, d.assignments),
      false,
    );
  }
  const empty = {
    ...d,
    assignments: [],
    roles: d.roles.map((r) => ({ ...r, assignedUserCount: 0 })),
  };
  assert.equal(deleteRole(empty, 'LEADERSHIP').roles.length, 12);
  assert.throws(() => deleteRole(empty, 'SUPER_ADMIN'));
  assert.throws(() => deleteRole(d, 'missing'));
});
test('additive overrides remain after removing same code from role, never revoke inherited rights', () => {
  let d = createCmsSnapshot();
  assert.equal(userView(d, 'keeper01').effective.length, 42);
  assert.ok(userView(d, 'keeper01').effective.includes('report.export'));
  d = addOverrides(d, 'leadership-02', ['report.export', 'report.view']);
  d = addOverrides(d, 'leadership-02', ['report.export']);
  assert.equal(d.overrides['leadership-02'].length, 2);
  const lead = d.roles.find((r) => r.code === 'LEADERSHIP');
  d = saveRolePermissions(
    d,
    lead.code,
    lead.permissions.filter((c) => c !== 'report.view'),
  );
  assert.ok(userView(d, 'leadership-02').effective.includes('report.view'));
  assert.ok(userView(d, 'leadership-02').effective.includes('report.export'));
  assert.throws(() => addOverrides(d, 'leadership-02', ['scan.inbound']));
  assert.throws(() => addOverrides(d, 'missing', ['report.view']));
});
test('E2E all resolved users equal role permission union custom overrides; unresolved SUPER_ADMIN is not fabricated zero/full', () => {
  const d = createCmsSnapshot();
  for (const a of d.accounts) {
    const u = userView(d, a.username);
    if (u.roles.some((r) => r.code === 'SUPER_ADMIN')) {
      assert.equal(u.effective, null);
      assert.equal(u.effectiveUnresolved, true);
    } else {
      assert.deepEqual(
        u.effective,
        [
          ...new Set([
            ...u.roles.flatMap((r) => r.permissions),
            ...u.overrides,
          ]),
        ].sort(),
      );
    }
  }
});
test('Vietnamese search matches accents and uppercase Đ; snapshot factory is isolated', () => {
  assert.equal(normalizeSearch(' ĐẶT '), 'dat');
  const a = createCmsSnapshot(),
    b = createCmsSnapshot();
  a.roles[0].permissions.push('local-only');
  assert.ok(!b.roles[0].permissions.includes('local-only'));
});
