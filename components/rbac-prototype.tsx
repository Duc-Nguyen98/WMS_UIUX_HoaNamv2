'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  LockKeyhole,
  Search,
  ShieldCheck,
  Trash2,
  Undo2,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { createCmsSnapshot } from '@/lib/rbac-cms-snapshot';
import {
  addOverrides,
  applyVisibleSelection,
  canDeleteRole,
  deleteRole,
  displayedPermissions,
  normalizeSearch,
  sameCodes,
  saveRolePermissions,
  selectionState,
  userView,
  type Permission,
} from '@/lib/rbac';
import './rbac-prototype.css';

function Status({ value }: { value: string }) {
  return (
    <span
      className={`rb-status ${value === 'Đang hoạt động' ? 'active' : value === 'Đã khóa' ? 'locked' : 'paused'}`}
    >
      <i />
      {value}
    </span>
  );
}
function SearchField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rb-search">
      <Search aria-hidden="true" />
      <Input
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label={`Xóa ${label.toLowerCase()}`}
          onClick={() => onChange('')}
        >
          <X />
        </button>
      )}
    </label>
  );
}
function GroupCheckbox({
  permissions,
  selected,
  locked,
  label,
  onChange,
}: {
  permissions: Permission[];
  selected: string[];
  locked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  const state = selectionState(
    permissions.map((p) => p.code),
    selected,
  );
  return (
    <Checkbox
      className="rb-check"
      checked={state.checked}
      indeterminate={state.indeterminate}
      aria-label={label}
      disabled={locked || !permissions.some((p) => !p.restricted)}
      onCheckedChange={(value) => onChange(value)}
    />
  );
}

export default function RbacPrototype() {
  const [dataset, setDataset] = useState(createCmsSnapshot);
  const [tab, setTab] = useState('users');
  const [userSearch, setUserSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [effectiveSearch, setEffectiveSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [roleCode, setRoleCode] = useState('LEADERSHIP');
  const [permissionSearch, setPermissionSearch] = useState('');
  const [group, setGroup] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string[]>>({});
  const [saveCode, setSaveCode] = useState<string | null>(null);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [overrideSearch, setOverrideSearch] = useState('');
  const [overrideDraft, setOverrideDraft] = useState<string[]>([]);
  const users = useMemo(
    () => dataset.accounts.map((a) => userView(dataset, a.username)!),
    [dataset],
  );
  const filtered = users.filter(
    (u) =>
      normalizeSearch(`${u.name} ${u.username} ${u.email}`).includes(
        normalizeSearch(userSearch),
      ) &&
      (!department || u.department === department) &&
      (!status || u.status === status) &&
      (!roleFilter || u.roles.some((r) => r.code === roleFilter)),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pages);
  const currentRows = filtered.slice(
    (currentPage - 1) * size,
    currentPage * size,
  );
  const role = dataset.roles.find((r) => r.code === roleCode);
  const selected = role ? (drafts[role.code] ?? role.permissions) : [];
  const dirty = !!role && !sameCodes(selected, role.permissions);
  const dirtyRoles = dataset.roles.filter(
    (r) => drafts[r.code] && !sameCodes(drafts[r.code], r.permissions),
  );
  const shown = displayedPermissions(
    dataset.permissions,
    permissionSearch,
    group,
  );
  const groups = [...new Set(dataset.permissions.map((p) => p.group))];
  const detail = detailId ? userView(dataset, detailId) : null;
  const effective = detail?.effective
    ? dataset.permissions.filter(
        (p) =>
          detail.effective!.includes(p.code) &&
          normalizeSearch(`${p.code} ${p.name} ${p.group}`).includes(
            normalizeSearch(effectiveSearch),
          ),
      )
    : [];
  const saveRole = dataset.roles.find((r) => r.code === saveCode);
  const savingDraft = saveRole
    ? (drafts[saveRole.code] ?? saveRole.permissions)
    : [];
  const additions = saveRole
    ? savingDraft.filter((p) => !saveRole.permissions.includes(p))
    : [];
  const removals = saveRole
    ? saveRole.permissions.filter((p) => !savingDraft.includes(p))
    : [];
  const openDetail = (username: string) => {
    setDetailId(username);
    setEffectiveSearch('');
    setOverrideOpen(false);
    setOverrideDraft([]);
    setOverrideSearch('');
  };
  const updateFilter = (set: (value: string) => void, value: string) => {
    set(value);
    setPage(1);
  };
  const changeSelection = (permissions: Permission[], checked: boolean) => {
    if (!role) return;
    setDrafts((previous) => ({
      ...previous,
      [role.code]: applyVisibleSelection(
        previous[role.code] ?? role.permissions,
        permissions,
        checked,
        !!role.locked,
      ),
    }));
    setMessage('');
  };
  const selectRole = (code: string) => {
    setRoleCode(code);
    setTab('roles');
    setPermissionSearch('');
    setGroup('');
    setRoleSearch('');
  };
  useEffect(() => {
    const preventLoss = (e: BeforeUnloadEvent) => {
      if (dirtyRoles.length || overrideDraft.length) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', preventLoss);
    return () => window.removeEventListener('beforeunload', preventLoss);
  }, [dirtyRoles.length, overrideDraft.length]);

  return (
    <section
      id="rbac-prototype"
      className="content-section rb-module"
      aria-labelledby="rb-heading"
    >
      <div className="rb-intro">
        <div>
          <span className="rb-eyebrow">PROTOTYPE / HỆ THỐNG / RBAC</span>
          <h2 id="rb-heading">Người dùng & Phân quyền</h2>
          <p>Quản lý tài khoản, phạm vi dữ liệu và quyền truy cập.</p>
        </div>
        <span className="rb-source">
          <ShieldCheck />
          Nguồn CMS đã được duyệt
        </span>
      </div>
      <div className="rb-handoff-note">
        Bản thiết kế tương tác · Thay đổi chỉ lưu trong lần mở trang này, không
        cập nhật CMS thật.{' '}
        <strong>
          Chưa nghiệm thu P0: quyền hiệu lực SUPER_ADMIN chờ xác nhận.
        </strong>
      </div>
      <div className="rb-surface">
        <div className="rb-topline">
          <span>
            Hệ thống <ChevronRight /> Người dùng & Phân quyền
          </span>
          <span>
            <LockKeyhole /> Quản trị truy cập
          </span>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
          <TabsList
            className="rb-tabs"
            variant="line"
            aria-label="Màn hình Người dùng & Phân quyền"
          >
            <TabsTrigger value="users">
              <Users />
              Danh sách người dùng{' '}
              <span className="rb-count">{dataset.accounts.length}</span>
            </TabsTrigger>
            <TabsTrigger value="roles">
              <ShieldCheck />
              Vai trò & ma trận quyền{' '}
              <span className="rb-count">{dataset.roles.length}</span>
              {dirtyRoles.length > 0 && (
                <span
                  className="rb-dirty-dot"
                  title={`${dirtyRoles.length} vai trò chưa lưu`}
                />
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <div className="rb-title">
              <div>
                <h3>Danh sách người dùng</h3>
                <p>
                  Trạng thái tài khoản và phân quyền được quản lý riêng biệt.
                </p>
              </div>
              <span>
                {filtered.length} kết quả / {dataset.accounts.length} người dùng
              </span>
            </div>
            <div className="rb-filters">
              <SearchField
                label="Tìm tên, tài khoản hoặc email"
                value={userSearch}
                onChange={(v) => updateFilter(setUserSearch, v)}
              />
              <label>
                Vai trò
                <select
                  aria-label="Lọc vai trò người dùng"
                  value={roleFilter}
                  onChange={(e) => updateFilter(setRoleFilter, e.target.value)}
                >
                  <option value="">Tất cả vai trò</option>
                  {dataset.roles.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Phòng ban
                <select
                  value={department}
                  onChange={(e) => updateFilter(setDepartment, e.target.value)}
                >
                  <option value="">Tất cả phòng ban</option>
                  {[...new Set(users.map((u) => u.department))].map((d) => (
                    <option key={d} value={d ?? ''}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Trạng thái tài khoản
                <select
                  value={status}
                  onChange={(e) => updateFilter(setStatus, e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  {[...new Set(users.map((u) => u.status))].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <div
              className="rb-table-scroll"
              role="region"
              aria-label="Danh sách người dùng, cuộn ngang khi cần"
              tabIndex={0}
            >
              <table className="rb-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Phòng ban</th>
                    <th>Vai trò RBAC</th>
                    <th>Phạm vi dữ liệu</th>
                    <th>Trạng thái</th>
                    <th>Đăng nhập cuối</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((u) => (
                    <tr key={u.username}>
                      <td>
                        <button
                          className="rb-user-link"
                          onClick={() => openDetail(u.username)}
                        >
                          <span className="rb-avatar">
                            {u.name
                              .split(' ')
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join('')}
                          </span>
                          <span>
                            <strong>{u.name}</strong>
                            <small>@{u.username}</small>
                            <small>{u.email}</small>
                          </span>
                        </button>
                      </td>
                      <td>{u.department ?? 'Chưa có dữ liệu'}</td>
                      <td>
                        {u.roles.map((r) => (
                          <button
                            key={r.code}
                            className="rb-role-link"
                            onClick={() => selectRole(r.code)}
                          >
                            {r.name}
                            <ArrowRight />
                          </button>
                        ))}
                      </td>
                      <td>
                        {u.assignments.map((a, i) => (
                          <span className="rb-scope" key={i}>
                            {a.scope}
                          </span>
                        ))}
                      </td>
                      <td>
                        <Status value={u.status} />
                      </td>
                      <td className="rb-date">
                        {u.lastLogin ?? 'Chưa có dữ liệu'}
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          aria-label={`Xem ${u.username}`}
                          onClick={() => openDetail(u.username)}
                        >
                          <Eye />
                          Xem
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!currentRows.length && (
                <div className="rb-empty">
                  <Search />
                  <h4>Không tìm thấy người dùng</h4>
                  <p>Thử từ khóa khác hoặc bỏ bớt bộ lọc.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUserSearch('');
                      setDepartment('');
                      setStatus('');
                      setRoleFilter('');
                      setPage(1);
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
            <div className="rb-pagination">
              <label>
                Dòng / trang
                <select
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
              <span>
                {filtered.length ? (currentPage - 1) * size + 1 : 0}–
                {Math.min(currentPage * size, filtered.length)} /{' '}
                {filtered.length}
              </span>
              <div>
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  aria-label="Trang người dùng trước"
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft />
                </Button>
                <span>
                  Trang {currentPage} / {pages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === pages}
                  aria-label="Trang người dùng sau"
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="roles">
            <div className="rb-role-layout">
              <aside className="rb-role-pane" aria-label="Danh sách vai trò">
                <h3>
                  Danh sách vai trò <span>{dataset.roles.length}</span>
                </h3>
                <SearchField
                  label="Tìm tên hoặc mã vai trò"
                  value={roleSearch}
                  onChange={setRoleSearch}
                />
                <div className="rb-role-cards">
                  {dataset.roles
                    .filter((r) =>
                      normalizeSearch(`${r.name} ${r.code}`).includes(
                        normalizeSearch(roleSearch),
                      ),
                    )
                    .map((r) => (
                      <button
                        key={r.code}
                        className={`rb-role-card ${roleCode === r.code ? 'selected' : ''}`}
                        aria-pressed={roleCode === r.code}
                        onClick={() => {
                          setRoleCode(r.code);
                          setMessage('');
                        }}
                      >
                        <strong>
                          {r.name}
                          {r.locked && <LockKeyhole />}
                        </strong>
                        <code>{r.code}</code>
                        <span>
                          <span>
                            <Users />
                            {r.assignedUserCount} người dùng
                          </span>
                          <b>
                            {r.effectiveUnresolved
                              ? 'Chờ xác minh'
                              : `${r.permissions.length} quyền`}
                          </b>
                        </span>
                        {drafts[r.code] &&
                          !sameCodes(drafts[r.code], r.permissions) && (
                            <em>Chưa lưu</em>
                          )}
                      </button>
                    ))}
                  {!dataset.roles.some((r) =>
                    normalizeSearch(`${r.name} ${r.code}`).includes(
                      normalizeSearch(roleSearch),
                    ),
                  ) && <p className="rb-empty">Không tìm thấy vai trò.</p>}
                </div>
              </aside>
              <div className="rb-matrix">
                {role ? (
                  <>
                    <div className="rb-matrix-title">
                      <div>
                        <span className="rb-eyebrow">
                          VAI TRÒ & MA TRẬN QUYỀN
                        </span>
                        <h3>{role.name}</h3>
                        <code>{role.code}</code>
                      </div>
                      <div className="rb-role-stat">
                        <strong>
                          {role.effectiveUnresolved ? '—' : selected.length}
                          <small> / {dataset.permissions.length}</small>
                        </strong>
                        <span>
                          {role.effectiveUnresolved
                            ? 'Quyền hiệu lực chờ xác minh'
                            : 'quyền được chọn'}
                        </span>
                      </div>
                    </div>
                    <div className="rb-impact">
                      <Users />
                      <span>
                        <strong>{role.assignedUserCount} người dùng</strong>{' '}
                        đang được gán vai trò này.
                      </span>
                      <button
                        className="rb-text-button"
                        onClick={() => {
                          setRoleFilter(role.code);
                          setUserSearch('');
                          setDepartment('');
                          setStatus('');
                          setPage(1);
                          setTab('users');
                        }}
                      >
                        Xem người dùng <ArrowRight />
                      </button>
                    </div>
                    {role.effectiveUnresolved && (
                      <div className="rb-warning" role="status">
                        <LockKeyhole />
                        <span>
                          Vai trò hệ thống không cho phép sửa ma trận. CMS đang
                          hiển thị thông tin quyền hiệu lực chưa thống nhất;
                          chưa xác nhận số quyền.
                        </span>
                      </div>
                    )}
                    <div className="rb-permission-filter">
                      <SearchField
                        label="Tìm tên hoặc mã quyền"
                        value={permissionSearch}
                        onChange={setPermissionSearch}
                      />
                      <label>
                        Nhóm quyền
                        <select
                          aria-label="Lọc nhóm quyền"
                          value={group}
                          onChange={(e) => setGroup(e.target.value)}
                        >
                          <option value="">
                            Tất cả nhóm ({dataset.permissions.length})
                          </option>
                          {groups.map((g) => (
                            <option key={g}>{g}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="rb-bulk">
                      {!role.effectiveUnresolved && (
                        <GroupCheckbox
                          permissions={shown}
                          selected={selected}
                          locked={!!role.locked}
                          label="Chọn tất cả quyền đang hiển thị"
                          onChange={(v) => changeSelection(shown, v)}
                        />
                      )}
                      <span>
                        <strong>{shown.length}</strong> quyền đang hiển thị
                      </span>
                      <Button
                        variant="ghost"
                        disabled={
                          !!role.locked ||
                          !shown.some(
                            (p) => !p.restricted && !selected.includes(p.code),
                          )
                        }
                        onClick={() => changeSelection(shown, true)}
                      >
                        Chọn tất cả
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={
                          !!role.locked ||
                          !shown.some(
                            (p) => !p.restricted && selected.includes(p.code),
                          )
                        }
                        onClick={() => changeSelection(shown, false)}
                      >
                        Bỏ chọn tất cả
                      </Button>
                    </div>
                    <p className="rb-help">
                      Chỉ áp dụng cho kết quả tìm kiếm và nhóm đang lọc. Quyền
                      bị hạn chế giữ nguyên.
                    </p>
                    <div className="rb-permission-groups">
                      {groups
                        .filter((g) => shown.some((p) => p.group === g))
                        .map((g) => {
                          const items = shown.filter((p) => p.group === g),
                            state = selectionState(
                              items.map((p) => p.code),
                              selected,
                            );
                          return (
                            <section className="rb-permission-group" key={g}>
                              <div className="rb-group-header">
                                {!role.effectiveUnresolved && (
                                  <GroupCheckbox
                                    permissions={items}
                                    selected={selected}
                                    locked={!!role.locked}
                                    label={`Chọn nhóm ${g}`}
                                    onChange={(v) => changeSelection(items, v)}
                                  />
                                )}
                                <h4>{g}</h4>
                                <span>
                                  {role.effectiveUnresolved ? '—' : state.count}
                                  /{state.total}
                                </span>
                              </div>
                              <div className="rb-permission-items">
                                {items.map((p) => (
                                  <label
                                    className={`rb-permission ${selected.includes(p.code) ? 'selected' : ''} ${p.restricted ? 'restricted' : ''}`}
                                    key={p.code}
                                  >
                                    {role.effectiveUnresolved ? (
                                      <LockKeyhole aria-label="Quyền hiệu lực chưa xác minh" />
                                    ) : (
                                      <Checkbox
                                        className="rb-check"
                                        checked={selected.includes(p.code)}
                                        disabled={p.restricted || !!role.locked}
                                        aria-label={p.code}
                                        onCheckedChange={(v) =>
                                          changeSelection([p], v)
                                        }
                                      />
                                    )}
                                    <span>
                                      <strong>{p.name}</strong>
                                      <code>{p.code}</code>
                                      {p.restricted && (
                                        <small>
                                          <LockKeyhole />
                                          {p.reason}
                                        </small>
                                      )}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </section>
                          );
                        })}
                      {!shown.length && (
                        <div className="rb-empty">
                          <Search />
                          <h4>Không tìm thấy quyền</h4>
                          <p>Các quyền đã chọn vẫn được giữ nguyên.</p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setPermissionSearch('');
                              setGroup('');
                            }}
                          >
                            Xóa bộ lọc quyền
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="rb-savebar">
                      <span className={dirty ? 'rb-dirty' : 'rb-clean'}>
                        {dirty
                          ? '● Có thay đổi chưa lưu'
                          : '✓ Không có thay đổi chưa lưu'}
                      </span>
                      <div>
                        <Button
                          variant="outline"
                          disabled={!dirty || !!role.locked}
                          onClick={() => {
                            setDrafts((d) => ({
                              ...d,
                              [role.code]: [...role.permissions],
                            }));
                            setMessage(
                              'Đã hoàn tác về lần lưu gần nhất trong phiên.',
                            );
                          }}
                        >
                          <Undo2 />
                          Hoàn tác
                        </Button>
                        <Button
                          disabled={!dirty || !!role.locked}
                          onClick={() => setSaveCode(role.code)}
                        >
                          <Check />
                          Lưu ma trận
                        </Button>
                      </div>
                    </div>
                    <div className="rb-delete">
                      <span>
                        {role.assignedUserCount > 0
                          ? 'Cần gỡ hoặc chuyển toàn bộ người dùng trước khi xóa vai trò.'
                          : role.locked
                            ? 'Vai trò hệ thống được bảo vệ.'
                            : 'Chỉ xóa vai trò chưa được gán cho người dùng.'}
                      </span>
                      <Button
                        variant="outline"
                        disabled={!canDeleteRole(role, dataset.assignments)}
                        aria-label={`Xóa vai trò ${role.code}`}
                        onClick={() => setDeleteCode(role.code)}
                      >
                        <Trash2 />
                        Xóa vai trò
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="rb-empty">
                    Chọn một vai trò để xem ma trận quyền.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {message && (
          <p className="rb-feedback" role="status">
            {message}
          </p>
        )}
      </div>

      <Dialog
        open={!!detail}
        onOpenChange={(open) => {
          if (!open && !overrideDraft.length) setDetailId(null);
        }}
      >
        <DialogContent className="rb-dialog rb-module" showCloseButton={false}>
          <div className="rb-dialog-heading">
            <div>
              <span className="rb-eyebrow">NGƯỜI DÙNG & PHÂN QUYỀN</span>
              <DialogTitle>Chi tiết người dùng & phân quyền</DialogTitle>
            </div>
            <Button
              variant="ghost"
              aria-label="Đóng chi tiết người dùng"
              disabled={overrideDraft.length > 0}
              onClick={() => setDetailId(null)}
            >
              <X />
            </Button>
          </div>
          <DialogDescription>
            Thông tin tài khoản, vai trò và quyền hiệu lực của người dùng.
          </DialogDescription>
          {detail && (
            <div className="rb-detail-body">
              <section className="rb-identity">
                <span className="rb-avatar large">
                  {detail.name
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')}
                </span>
                <div>
                  <h3>{detail.name}</h3>
                  <code>@{detail.username}</code>
                </div>
                <Status value={detail.status} />
              </section>
              <section className="rb-detail-section">
                <h4>Thông tin tài khoản</h4>
                <dl className="rb-account-grid">
                  <div>
                    <dt>Email</dt>
                    <dd>{detail.email}</dd>
                  </div>
                  <div>
                    <dt>Phòng ban</dt>
                    <dd>{detail.department ?? 'Chưa có dữ liệu'}</dd>
                  </div>
                  <div>
                    <dt>Đăng nhập cuối</dt>
                    <dd>{detail.lastLogin ?? 'Chưa có dữ liệu'}</dd>
                  </div>
                  <div>
                    <dt>Phân loại quản lý</dt>
                    <dd>
                      {detail.managementClassification ??
                        'Chưa có dữ liệu phân loại'}
                    </dd>
                  </div>
                </dl>
                <p className="rb-help">
                  Phân loại quản lý không phải vai trò RBAC và không cấp quyền
                  truy cập.
                </p>
              </section>
              <section className="rb-detail-section">
                <h4>
                  Vai trò & phạm vi dữ liệu{' '}
                  <span className="rb-count">{detail.assignments.length}</span>
                </h4>
                {detail.assignments.map((a) => (
                  <div className="rb-assignment" key={a.roleCode}>
                    <div>
                      <strong>
                        {detail.roles.find((r) => r.code === a.roleCode)?.name}
                      </strong>
                      <code>{a.roleCode}</code>
                    </div>
                    <div>
                      <small>Phạm vi dữ liệu</small>
                      <span>{a.scope}</span>
                    </div>
                    <div>
                      <small>Hiệu lực</small>
                      <span>{a.validity}</span>
                    </div>
                    <Button
                      variant="outline"
                      disabled={overrideDraft.length > 0}
                      onClick={() => {
                        setDetailId(null);
                        selectRole(a.roleCode);
                      }}
                    >
                      Xem ma trận <ArrowRight />
                    </Button>
                  </div>
                ))}
              </section>
              <section className="rb-detail-section">
                <div className="rb-inline-heading">
                  <h4>
                    Quyền cấp riêng{' '}
                    <span className="rb-count">{detail.overrides.length}</span>
                  </h4>
                  <Button
                    variant="outline"
                    disabled={detail.effectiveUnresolved}
                    onClick={() => {
                      setOverrideOpen(!overrideOpen);
                      setOverrideDraft([]);
                      setOverrideSearch('');
                    }}
                  >
                    Cấp quyền riêng
                  </Button>
                </div>
                <p className="rb-help">
                  Chỉ cộng thêm vào quyền theo vai trò. Không thu hồi hoặc từ
                  chối quyền của vai trò.
                </p>
                {detail.overrides.length ? (
                  <div className="rb-code-list">
                    {detail.overrides.map((code) => (
                      <code key={code}>{code}</code>
                    ))}
                  </div>
                ) : (
                  <p className="rb-empty compact">
                    Chưa cấp quyền riêng. Quyền hiện tại được kế thừa từ vai
                    trò.
                  </p>
                )}
                {overrideOpen && (
                  <div className="rb-override-editor">
                    <SearchField
                      label="Tìm quyền cấp thêm"
                      value={overrideSearch}
                      onChange={setOverrideSearch}
                    />
                    <div className="rb-override-options">
                      {displayedPermissions(
                        dataset.permissions,
                        overrideSearch,
                        '',
                      ).map((p) => (
                        <label key={p.code}>
                          <Checkbox
                            className="rb-check"
                            aria-label={`Cấp thêm ${p.code}`}
                            checked={
                              detail.effective?.includes(p.code) ||
                              overrideDraft.includes(p.code)
                            }
                            disabled={
                              p.restricted ||
                              !!detail.effective?.includes(p.code)
                            }
                            onCheckedChange={(v) =>
                              setOverrideDraft((d) =>
                                v
                                  ? [...d, p.code]
                                  : d.filter((c) => c !== p.code),
                              )
                            }
                          />
                          <span>
                            {p.name}
                            <code>{p.code}</code>
                          </span>
                          {detail.effective?.includes(p.code) && (
                            <small>Đã có</small>
                          )}
                          {p.restricted && <small>Hạn chế</small>}
                        </label>
                      ))}
                    </div>
                    <div className="rb-override-actions">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOverrideDraft([]);
                          setOverrideOpen(false);
                        }}
                      >
                        Hủy cấp thêm
                      </Button>
                      <Button
                        disabled={!overrideDraft.length}
                        onClick={() => {
                          try {
                            setDataset((d) =>
                              addOverrides(d, detail.username, overrideDraft),
                            );
                            setOverrideDraft([]);
                            setOverrideOpen(false);
                            setMessage(
                              'Đã cấp thêm quyền trong phiên thiết kế. CMS thật không thay đổi.',
                            );
                          } catch (e) {
                            setMessage((e as Error).message);
                          }
                        }}
                      >
                        Cấp thêm {overrideDraft.length} quyền
                      </Button>
                    </div>
                    <p className="rb-help">
                      Thao tác chỉ áp dụng trong phiên thiết kế.
                    </p>
                  </div>
                )}
              </section>
              <section className="rb-detail-section">
                <h4>
                  Quyền hiệu lực{' '}
                  <span className="rb-count">
                    {detail.effective?.length ?? 'Chờ xác minh'}
                  </span>
                </h4>
                {detail.effectiveUnresolved ? (
                  <p className="rb-warning">
                    Chưa xác minh quyền hiệu lực của vai trò hệ thống. Không
                    diễn giải danh sách cấu hình trống thành không có quyền.
                  </p>
                ) : (
                  <>
                    <SearchField
                      label="Tìm quyền hiệu lực"
                      value={effectiveSearch}
                      onChange={setEffectiveSearch}
                    />
                    <div className="rb-effective-list">
                      {effective.map((p) => (
                        <div key={p.code}>
                          <Check />
                          <span>
                            <strong>{p.name}</strong>
                            <code>{p.code}</code>
                            {p.restricted && <small>{p.reason}</small>}
                          </span>
                          <small>
                            {detail.overrides.includes(p.code)
                              ? 'Cấp riêng'
                              : 'Theo vai trò'}
                          </small>
                        </div>
                      ))}
                      {!effective.length && (
                        <p className="rb-empty compact">
                          {effectiveSearch
                            ? 'Không có quyền phù hợp với từ khóa.'
                            : 'Chưa có quyền được cấp.'}
                        </p>
                      )}
                    </div>
                    <p className="rb-help">
                      Hiển thị {effective.length} / {detail.effective?.length}{' '}
                      quyền · Quyền theo vai trò ∪ quyền cấp riêng.
                    </p>
                  </>
                )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!saveRole}
        onOpenChange={(open) => {
          if (!open) setSaveCode(null);
        }}
      >
        <DialogContent className="rb-confirm rb-module" showCloseButton={false}>
          <DialogTitle>Lưu ma trận quyền?</DialogTitle>
          <DialogDescription>
            {saveRole?.name} · {saveRole?.assignedUserCount} người dùng đang
            được gán. Thay đổi chỉ áp dụng trong phiên thiết kế.
          </DialogDescription>
          <div className="rb-diff">
            <h4>Cấp thêm ({additions.length})</h4>
            {additions.map((p) => (
              <code key={p}>+ {p}</code>
            ))}
            <h4>Bỏ khỏi vai trò ({removals.length})</h4>
            {removals.map((p) => (
              <code key={p}>− {p}</code>
            ))}
            <p>Quyền cấp riêng của từng người dùng giữ nguyên.</p>
          </div>
          <div className="rb-confirm-actions">
            <Button variant="outline" onClick={() => setSaveCode(null)}>
              <ArrowLeft />
              Tiếp tục chỉnh sửa
            </Button>
            <Button
              disabled={!saveRole || (!additions.length && !removals.length)}
              onClick={() => {
                if (!saveRole) return;
                try {
                  const next = saveRolePermissions(
                    dataset,
                    saveRole.code,
                    savingDraft,
                  );
                  setDataset(next);
                  setDrafts((d) => ({
                    ...d,
                    [saveRole.code]: [...savingDraft],
                  }));
                  setMessage(
                    'Đã lưu ma trận trong phiên thiết kế. CMS thật không thay đổi.',
                  );
                  setSaveCode(null);
                } catch (e) {
                  setMessage((e as Error).message);
                }
              }}
            >
              Xác nhận lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deleteCode}
        onOpenChange={(open) => {
          if (!open) setDeleteCode(null);
        }}
      >
        <DialogContent className="rb-confirm rb-module" showCloseButton={false}>
          <DialogTitle>Xóa vai trò?</DialogTitle>
          <DialogDescription>
            Vai trò {deleteCode}. Không thể xóa nếu có người dùng được gán.
          </DialogDescription>
          <div className="rb-confirm-actions">
            <Button variant="outline" onClick={() => setDeleteCode(null)}>
              Giữ lại
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteCode) return;
                try {
                  const next = deleteRole(dataset, deleteCode);
                  setDataset(next);
                  setRoleCode(next.roles[0]?.code ?? '');
                  setDeleteCode(null);
                  setMessage('Đã xóa vai trò trong phiên thiết kế.');
                } catch (e) {
                  setMessage((e as Error).message);
                  setDeleteCode(null);
                }
              }}
            >
              Xác nhận xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
