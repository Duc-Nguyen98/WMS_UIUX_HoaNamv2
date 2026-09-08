export type Permission = {
  code: string;
  name: string;
  group: string;
  restricted: boolean;
  reason: string;
};
export type Role = {
  code: string;
  name: string;
  assignedUserCount: number;
  permissions: string[];
  locked?: boolean;
  effectiveUnresolved?: boolean;
};
export type Account = {
  username: string;
  name: string;
  email: string;
  status: string;
  managementClassification: string | null;
};
export type Assignment = {
  username: string;
  roleCode: string;
  scope: string;
  validity: string;
};
export type RbacDataset = {
  accounts: Account[];
  departments: Record<string, string>;
  authAudit: Record<string, string>;
  assignments: Assignment[];
  overrides: Record<string, string[]>;
  roles: Role[];
  permissions: Permission[];
};

export const normalizeSearch = (value: string) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
export const sameCodes = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length &&
  new Set(a).size === new Set(b).size &&
  a.every((code) => b.includes(code));
export function selectionState(
  codes: readonly string[],
  selected: readonly string[],
) {
  const count = codes.filter((code) => selected.includes(code)).length;
  return {
    count,
    total: codes.length,
    checked: codes.length > 0 && count === codes.length,
    indeterminate: count > 0 && count < codes.length,
  };
}
export function displayedPermissions(
  catalogue: Permission[],
  query: string,
  group: string,
) {
  const q = normalizeSearch(query);
  return catalogue.filter(
    (p) =>
      (!group || p.group === group) &&
      normalizeSearch(`${p.code} ${p.name} ${p.group}`).includes(q),
  );
}
// Only the displayed, editable intersection is mutable. Restricted selections survive unchanged.
export function applyVisibleSelection(
  selected: readonly string[],
  visible: readonly Permission[],
  checked: boolean,
  locked = false,
): string[] {
  if (locked) return [...selected];
  const result = new Set(selected);
  for (const p of visible)
    if (!p.restricted) {
      if (checked) result.add(p.code);
      else result.delete(p.code);
    }
  return [...result];
}
export function canDeleteRole(role: Role, assignments: Assignment[]) {
  return (
    !role.locked &&
    Number.isFinite(role.assignedUserCount) &&
    role.assignedUserCount === 0 &&
    !assignments.some((a) => a.roleCode === role.code)
  );
}
export function deleteRole(
  dataset: RbacDataset,
  roleCode: string,
): RbacDataset {
  const role = dataset.roles.find((r) => r.code === roleCode);
  if (!role || !canDeleteRole(role, dataset.assignments))
    throw new Error(
      'Phải gỡ hoặc chuyển toàn bộ người dùng trước khi xóa vai trò.',
    );
  return {
    ...dataset,
    roles: dataset.roles.filter((r) => r.code !== roleCode),
  };
}
export function saveRolePermissions(
  dataset: RbacDataset,
  code: string,
  draft: string[],
): RbacDataset {
  const role = dataset.roles.find((r) => r.code === code);
  if (!role || role.locked)
    throw new Error('Vai trò này không cho phép chỉnh sửa ma trận.');
  const catalog = new Set(dataset.permissions.map((p) => p.code));
  if (
    new Set(draft).size !== draft.length ||
    draft.some((p) => !catalog.has(p))
  )
    throw new Error('Mã quyền không hợp lệ.');
  if (
    dataset.permissions.some(
      (p) =>
        p.restricted &&
        role.permissions.includes(p.code) !== draft.includes(p.code),
    )
  )
    throw new Error('Không thể thay đổi quyền bị hạn chế.');
  return {
    ...dataset,
    roles: dataset.roles.map((r) =>
      r.code === code ? { ...r, permissions: [...draft] } : r,
    ),
  };
}
export function addOverrides(
  dataset: RbacDataset,
  username: string,
  codes: string[],
) {
  if (!dataset.accounts.some((a) => a.username === username))
    throw new Error('Không tìm thấy người dùng.');
  if (
    codes.some(
      (code) =>
        !dataset.permissions.some((p) => p.code === code && !p.restricted),
    )
  )
    throw new Error(
      'Không thể cấp quyền bị hạn chế hoặc chưa có trong danh mục.',
    );
  return {
    ...dataset,
    overrides: {
      ...dataset.overrides,
      [username]: [
        ...new Set([...(dataset.overrides[username] ?? []), ...codes]),
      ],
    },
  };
}
// List and Detail consume exactly this projection; no duplicate screen-specific account values.
export function userView(dataset: RbacDataset, username: string) {
  const account = dataset.accounts.find((a) => a.username === username);
  if (!account) return null;
  const assignments = dataset.assignments.filter(
    (a) => a.username === username,
  );
  const roles = assignments
    .map((a) => dataset.roles.find((r) => r.code === a.roleCode))
    .filter((r): r is Role => !!r);
  const overrides = dataset.overrides[username] ?? [];
  const effectiveUnresolved = roles.some((r) => r.effectiveUnresolved);
  const effective = effectiveUnresolved
    ? null
    : [
        ...new Set([...roles.flatMap((r) => r.permissions), ...overrides]),
      ].sort();
  return {
    ...account,
    department: dataset.departments[username] ?? null,
    lastLogin: dataset.authAudit[username] ?? null,
    assignments,
    roles,
    overrides,
    effective,
    effectiveUnresolved,
  };
}
