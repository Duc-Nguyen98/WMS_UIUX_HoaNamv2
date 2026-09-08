# RBAC — PROMPT 02: Shared Module Shell, Tabs & Routing

**PASS — P02** · 08/09/2026.

Phạm vi nghiệm thu: shared module shell/header, hai route-aware tabs, sidebar/module navigation và Detail context. **Không phải PASS toàn bộ nghiệp vụ RBAC**. Không publish, không ghép WMS, không tiếp tục Prompt 03.

## 1. Dependency và findings được reuse

Đã đọc đầy đủ `C:/Users/Admin/Downloads/02_RBAC_SharedShell_Tabs_Routing.md` và `RBAC_P01_AUDIT_REPORT.md` trước implementation. P01 ghi rõ **PASS — P01**. Reuse route/component maps, root cause và toàn bộ 34 records trong register P01; không khảo sát lại CMS hoặc audit lại từ đầu.

Phần xử lý: IA01, IA04 context, ST01/ST02/ST04/shared chrome của ST05, navigation-state portion BH01, module-counter portion DT05/DT06 và canonical route RT01. Không dùng bộ quyền/ma trận React cũ để thay thiết kế B2B.

## 2. Files changed

Trong `standalone/rbac-baseline/`:

| File | Thay đổi |
|---|---|
| `rbac-module-shell.mjs` — mới | Một `RbacModuleHeader()` sở hữu title, description, breadcrumb, counts, hai tabs và route-derived active; `RbacModuleShell()` tạo shared sidebar/header/content panels; `moduleCounts()` derive counts |
| `module-shell.css` — mới | Hoa Nam palette/Inter, shared spacing/tab height/borders/container; không CSS redesign cells/fields của ba view |
| `module-shell.js` — mới | Route/location, pushState/popstate, tab keyboard, trusted same-origin iframe messages, Detail close/focus context, beforeunload khi matrix dirty |
| `view-composer.mjs` — mới | Extract view content theo boundaries từ original HTML; bỏ duplicated chrome/tabs, reuse sidebar từ List; giữ bảng/code/checkbox/fields nguyên vẹn |
| `server.mjs` | Public routes render cùng shell; embedded view qua query kỹ thuật; counts derive từ approved snapshot; canonical slash/root |
| `interaction.js` | Navigate qua parent shell thay reload document; Detail focus/close/Escape integration; List footer phân biệt số dòng thiết kế thực có và total CMS, không hardcode 22/15 |
| `b2b-interaction.js` | **Chỉ thêm notification dirty tới parent**. Logic checkbox/filter/scope/save/undo/reset giữ nguyên; kiểm chứng bằng hash sau bỏ notification |

Ngoài thư mục standalone: `tests/rbac-p02.test.mjs` (mới), báo cáo này. Không sửa `app/page.tsx`, không mount lại RBAC; không sửa `lib/rbac.ts`, `lib/rbac-cms-snapshot.ts`, không sửa HTML nguồn `users.html`, `detail.html`, `b2b.html`. Không đổi file thiết kế Desktop.

## 3. Routes và shared architecture

| Route | Kết quả |
|---|---|
| `/users` | Shared shell + User tab active + List content |
| `/roles` | Cùng shared shell + Role tab active + B2B content |
| `/detail` | Cùng shell, User tab active phía sau, original Detail modal nằm trên List panel, không third tab |
| `/` | Redirect `/users`, giữ compatibility entry |
| Trailing slash public route | Normalize về `/users`, `/roles`, `/detail` |
| `?embedded=1` | View-document nội bộ same-origin dùng trong iframe; không phải tab/màn nghiệp vụ mới |

Hai document List/Matrix được **mount một lần** trong panels; chuyển tab chỉ cập nhật parent URL/active state/visibility. Lựa chọn kỹ thuật này giữ nguyên Tailwind v3 typography/geometry và DOM handlers của bản baseline, tránh rewrite/redesign các view. Shell là document dùng chung, không phải chèn hai bản tab HTML vào hai trang. Direct public URL render shell ngay ở server; client `location.pathname` tiếp tục là nguồn active tab, `popstate` xử lý back/forward.

Sidebar có đúng một active item “Người dùng & Phân quyền” với `aria-current="page"` trên cả hai screens. Shared title: “Người dùng & Phân quyền”; description đúng Prompt 02. Tabs: “Người dùng & phân quyền” và “Vai trò & ma trận quyền”. Heading B2B bên trong vẫn là screen-specific heading, không tạo module thứ hai.

Chrome mới không chọn v3.4.2 hay v2.4 làm version chuẩn. Metadata mâu thuẫn ST03 vẫn lưu nguyên trong original HTML/P01; shared chrome không công bố version chưa được xác nhận.

## 4. Trước / sau root cause

**Trước:** button trong users.html → `location.href='/roles'` → server thay toàn document bằng b2b.html không chứa tabs → chỉ còn sidebar link khác tên để quay lại.

**Sau:** `/users`, `/roles`, `/detail` đều dùng `RbacModuleShell` → `RbacModuleHeader` render một cặp tabs → navigation đọc URL và chuyển panel. Tab User luôn có trên Role; không cần browser Back hoặc sidebar. Detail close không tải lại List document, nên các hidden rows/filter/scroll vẫn được giữ.

## 5. Counts, invariants và phạm vi chưa xử lý

### Counts trong shell

`moduleCounts(createCmsSnapshot())` dùng `.accounts.length` và `.roles.length`: hiện **77 / 13** từ snapshot owner đã duyệt, không có literal 77/13 trong template. Test dataset rỗng →0/0; dataset 2 accounts/1 role →2/1. Footer List count được derive từ số rows visible/actual DOM và total CMS, ghi rõ **dòng thiết kế** thay vì làm giả 77 rows.

Đây không phải tích hợp lại toàn dataset vào baseline view. Entity data của ảnh và permission/assigned-user counters B2B còn trong nội dung mẫu thiết kế, được giữ ngoài phạm vi header/tab counter của AC14; không tự chuyển 11/48 thành 15/42 hoặc map module-action thành CMS permissions để làm nhất quán giả.

### NEED CONFIRMATION được giữ nguyên, không tự xử lý

DT08/DT09 (đơn vị đếm/mapping module×action), DT11 (scope/warehouse), DT12 (classification assignment), DT13 (SUPER_ADMIN), ST03 (system version), BH02 (counter semantics), BH10 (security/identity metadata): **vẫn NEED CONFIRMATION** như P01. Không sửa value, không thêm role/code/deny/revoke/reassignment.

Các AUTO-FIXABLE nghiệp vụ DT01–04/DT07/DT10 và full dataset binding không được kéo vào scope P02. Entity-specific query `?user=`/`?role=` còn như baseline; P02 deep-link nghiệm thu **screen route**, không claim đã xử lý IA02/IA03 entity mapping. Vai trò khác WARRANTY_STAFF vẫn theo giới hạn hiện có của B2B, không tự tạo ma trận mới. Q01/Q02 còn nợ binding trong baseline như P01, không diễn giải AC16 thành toàn bộ Q01–Q06 đã được triển khai.

### Q01–Q06 không đổi

Q01 một RBAC logical dataset; Q02 Email→User Master, Department→Assignment, Last Login→Audit, Scope→Role Assignment/Data Scope; Q03 classification không role; Q04 chỉ tập displayed; Q05 ba trạng thái; Q06 chặn xóa role còn users. Giữ additive-only overrides, code và restrictions. Source domain và HTML business giữ SHA-256 đúng P01. Demo chỉ local; không quyền thật bị thay đổi.

## 6. Test evidence

### Automated

- `node --test tests/rbac-p02.test.mjs`: **9/9 PASS**; test gates, shared two-tab rendering mọi route, route-driven active, counts dynamic, single sidebar item, extraction giữ nguyên số bảng/code/checkbox, Detail thuộc User, navigation origin guards/beforeunload, source hashes. Kiểm tra file báo cáo riêng: exists=true, 18 AC rows, 18 PASS rows.
- `node --check` cho server/module-shell/interaction: PASS.
- HTTP public `/users`, `/roles`, `/detail`: **200**, mỗi response có một shared header và **2** `role="tab"`.
- Không chạy build WMS hoặc deploy vì standalone server dùng ES modules trực tiếp.

### Browser execution (08/09)

1. Reload public `/users`: shared H1/description, hai tabs 77/13, User selected. List bảng/filter/action hiện như view baseline.
2. Click tab Role → URL `/roles`, `aria-selected=true` tại Role, **2 tabs**, sidebar vẫn “Người dùng & Phân quyền”. Không browser Back/sidebar trong bước này.
3. Uncheck `warranty.receive: Thêm mới Create` trong B2B demo → dirty. Click User tab → `/users`; quay lại Role → ô còn unchecked, Save vẫn enabled. **Không mất draft** khi tab hidden.
4. User search leadership-02 → còn **1 visible row**. Mở Detail → parent URL `/detail`, User `aria-selected=true`, detail-layer visible. Đóng → `/users`, List còn **1 visible row**; giữ nguyên document/ngữ cảnh. Tool read-only input-value mirror trả empty cả trước/sau, vì vậy bằng chứng context dùng visible row-set trước/sau, không bịa giá trị input từ mirror.
5. Direct reload `/roles`: shared H1 và hai tabs, Role active. Direct `/detail`: dialog visible, User selected, DOM vẫn đúng 2 tabs, không third tab.
6. Matrix Save đã kiểm: change → Lưu → “Đã lưu trong demo”; change lần nữa → Hủy về committed. Không CMS request.
7. Matrix search `warranty.receive`: **2 visible rows** (parent+child); Ctrl+A/Backspace clear → **15 rows**. Collapse group1 → **12 visible rows**; expand khôi phục. Chọn Data Scope Kho cá nhân → dirty; Hủy hoạt động. Các controls/row-scope inputs vẫn còn.
8. Tab keyboard ArrowRight chọn Role đúng URL/state.
9. Screenshot shared shell tại 1600px cho thấy List và Matrix cùng sidebar/header/tabs; B2B Data Scope/grid/toolbar không bị thay bằng UI khác.

### Layout stability

| Viewport | User header | Role header | Kết quả |
|---|---|---|---|
| 1600px | shell x=320, y=0, w=1280, h=186.8; H1 x=350,y=61 | Cùng giá trị | PASS không jump chrome |
| 1280px | shell left=320, height=186.8 | Cùng giá trị | PASS không jump chrome |

Một số browser calls timeout; đã đọc trạng thái và retry đúng bước, không tính timeout thành PASS. Chưa có kết quả đo thêm 1024/768 ở lượt P02, không claim đã đo. AC15 được kiểm bằng same mounted shell và browser metrics hai kích thước trên; screen-specific content height khác nhau là nội dung của tab, không phải layout jump shell.

## 7. P02-AC01 → P02-AC18

| AC | PASS/FAIL | Bằng chứng |
|---|---|---|
| P02-AC01 User List always both tabs | PASS | One RbacModuleHeader, direct /users browser + HTTP2tabs |
| P02-AC02 Role Matrix always both tabs | PASS | Direct /roles và click từ User vẫn 2tabs |
| P02-AC03 User active trên List | PASS | routeView('/users'), aria-selected=true browser |
| P02-AC04 Role active trên Matrix | PASS | routeView('/roles'), aria-selected=true browser |
| P02-AC05 User→Role bằng tab | PASS | Browser click đổi URL /roles |
| P02-AC06 Role→User bằng tab | PASS | Browser click đổi URL /users |
| P02-AC07 Không cần Back/sidebar | PASS | Cả hai bước trên chỉ dùng tab |
| P02-AC08 Direct Role có shared header/tabs | PASS | Reload /roles, shared H1,2tabs, Role selected |
| P02-AC09 Direct User có shared header/tabs | PASS | Reload /users, shared H1,2tabs, User selected |
| P02-AC10 Sidebar active nhất quán | PASS | Một same mounted sidebar link aria-current=page, cùng label |
| P02-AC11 Terminology nhất quán | PASS | Module title/sidebar/breadcrumb thống nhất; hai nhãn tab đúng spec, screen heading B2B subordinate |
| P02-AC12 Detail thuộc User tab | PASS | Open/direct /detail → User active phía sau; close giữ visible row set |
| P02-AC13 Không third tab | PASS | DOM/template exact 2tabs trên cả 3 routes |
| P02-AC14 User/role counts không hardcoded | PASS | Shared counters nhận derived .length; test varying datasets; footer rows derive từ DOM/source, không còn counter 22 ở rendered List footer |
| P02-AC15 Không significant layout jump | PASS | Header metrics bằng nhau tại1600/1280; same shell/panels |
| P02-AC16 Q01–Q06 không thay đổi | PASS | Domain/source HTML hashes giữ nguyên; không sửa codes/roles/override/scope rules. Đây là preservation, không nghiệm thu các nợ P01 |
| P02-AC17 Matrix function không bị bỏ/redesign | PASS | Tables/codes/checkbox count preservation tests; script chỉ thêm dirty bridge; Save/Undo/search/collapse/scope browser retested |
| P02-AC18 Report tồn tại | PASS | File RBAC_P02_IMPLEMENTATION_REPORT.md này |

## 8. Stop condition

**PASS — P02** cho shared shell/tab/navigation scope. **Dừng ở Prompt 02.** Các mục NEED CONFIRMATION không được giải quyết bằng suy luận và không bị chuyển thành PASS nghiệp vụ. Không tự chạy Prompt 03, không xuất bản hoặc ghép lại WMS.
