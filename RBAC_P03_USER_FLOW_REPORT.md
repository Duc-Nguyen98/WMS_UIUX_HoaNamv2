# RBAC — PROMPT 03: User List + User Detail + Data Consistency

## Kết quả hiện hành — Local Mapping V1 đã được owner duyệt

**PASS — P03 · 17/17 AC PASS · 34/34 automated tests PASS.**

Phần này thay thế trạng thái BLOCKED trong các mục lịch sử bên dưới. Owner xác nhận: **“Duyệt mapping local V1, gồm các điểm ①–⑥ và scope chỉ đọc”**; Matrix là prototype local, không yêu cầu backend IDs. Không chạy Prompt04, không publish hoặc ghép lại WMS.

### V1. Root cause và remediation đã áp dụng

Trước: B2B đọc checked/selectedIndex từ HTML, Save vào biến riêng `committed`; List/Detail đọc `/user-data`. Role/scope/counter của hai bên khác logical source.

Sau: một `dataset` trên **local Node server** được khởi tạo từ snapshot owner đã duyệt. `GET /user-data` trả users, đầy đủ roles/permissions và assignments từ dataset đó cho **cả ba màn**. `POST /role-permissions` chỉ cập nhật role.permissions theo mapping V1; dùng `saveRolePermissions` sẵn có, kiểm tra catalogue/restricted/locked, chặn sửa các code ngoài V1 và kiểm tra expected permissions để phát hiện bản lưu cũ. Scope, assignment, override không có đường ghi mới.

Khi Save thành công: Matrix nhận lại cùng projection; parent shell gửi refresh tới List/Detail. List giữ filter/page, Detail đọc lại effective từ union chuẩn. Ô dùng chung code đồng bộ trạng thái; quyền không có ô trong B2B vẫn giữ nguyên trong full role.permissions và xuất hiện ở Effective Permissions khi role có quyền đó.

**Local memory only:** bản lưu tồn tại trong tiến trình demo Node, dùng chung giữa các tab của server này; reload trình duyệt không reset dữ liệu đã lưu. Restart server mới khôi phục snapshot. Không có gọi API hay ghi CMS thật, không persistence production. Không gọi đây là hệ thống nhận quyền backend đã tích hợp.

### V2. Mapping local chuẩn sau sửa

Local keys: user=`username`, role=`role.code`, permission=`permission.code`; assignment giữ record `{username,roleCode,scope,validity}`. Không tạo user_id/role_id/permission_id backend giả. Đây là identifier contract **local do owner duyệt**, không còn là blocker backend cho prototype.

| Mã dòng UI | Cột | Canonical permission_code |
|---|---|---|
| warranty.receive | Xem / Thêm / Chỉnh sửa | warranty.view / warranty.temp_only / warranty.manage |
| warranty.component | Xem / Thêm | warranty.view / warranty.component_issue |
| scan.execute | Xem / Thêm | item_instance.view / scan.execute |
| inventory.trace | Xem | inventory.trace |
| inventory.transfer | Xem | inventory.view |
| inbound.return_part | Xem / Thêm | inbound.view / inbound.create |
| inbound.supplier | Xem / Thêm | inbound.view / inbound.create |
| report.sla | Xem / Xuất | report.view / report.export |

15 ô→12 permission codes duy nhất;27ô còn lại giữ checkbox disabled, tooltip “Catalogue hiện chưa có quyền tương ứng”; các dấu — không áp dụng giữ nguyên. Các dòng warranty.pricing/scan.batch không bị xóa và không được gán quyền giả. Tooltip các quyền tương ứng ghi đúng giải thích①–⑥ đã duyệt (tạo tạm,manage rộng,action đặt ở cộtThêm,tra cứu thiết bị,nhập kho chung,báo cáo chung).

Scope: `scopeForRole(assignments,roleCode)` derive scope chung; nếu khác nhau hiển thị “Nhiều phạm vi được gán”; nếu trống báo chưa có. Không chuyển “Theo chức năng” sang “Kho chi nhánh”. Radio/chip thêm kho khóa; row scope là text chỉ đọc từ cùng assignments. Không tạo quyền hay scope theo dòng.

### V3. Files changed cho V1

- Mới: `standalone/rbac-baseline/local-mapping-v1.mjs` (mapping/notes/scope projection), `matrix-local-v1.js` (data binding trên DOM B2B hiện có), `tests/rbac-v1.test.mjs` (5 tests).
- Sửa `server.mjs`: shared mutable local dataset, save endpoint giới hạn mapped permissions, serve V1 module; không còn chạy b2b-interaction.js cho Matrix hiện hành.
- Sửa `user-flow-model.mjs`: trả đầy đủ canonical roles và assignments, không chỉ `{code,name}`.
- Sửa `module-shell.js`, `user-flow.js`: thông báo/refresh nguồn sau local Save; không thay layout/tab/routing context P02.
- Sửa `rbac-module-shell.mjs`: note mô tả đúng ba màn dùng chung local source.
- Cập nhật báo cáo này. Original b2b.html, catalogue/role source `lib/rbac-cms-snapshot.ts`, domain Q04/Q05/Q06 `lib/rbac.ts` không bị sửa. Không thêm/xóa13roles hay64permissions.

### V4. Evidence Q01 và regression sau V1

Automated: `node --test tests/rbac.test.mjs tests/rbac-p02.test.mjs tests/rbac-p03.test.mjs tests/rbac-v1.test.mjs` → **34/34 PASS**. P02 test về b2b-interaction.js là kiểm bảo tồn file legacy, không phải bằng chứng active script vẫn chạy; active data/model integration được kiểm riêng ở V1 tests và browser.

Browser đã chạy trong lượt áp dụng:

1. Matrix catalogue selector=13roles; WARRANTY_STAFF=8assigned users,13/64permissions; scope “Theo chức năng”; đúng27ô unmapped disabled.
2. Chọn LEADERSHIP, tick `report.sla: export`→Save local→Matrix13/64, Save disabled sạch. Sang User→leadership-02→Detail hiện13/13, có exact `report.export`. Đây là bằng chứng end-to-end thay cho AC16 diagnostic FAIL cũ.
3. List/Detail leadership-02: email leadership-02@gmail.com,department Phòng hành chính - nhân sự,lastlogin05-09-2026 15:26,scopeTheo chức năng; tên/username/status/role khớp,User tab active. Close giữ filtered range1–1/1,total77.
4. Uncheck warranty.receive:view làm warranty.component:view cùng unchecked; Undo trả về committed. Một canonical code, không hai quyền độc lập.
5. Scope radio editable=0; row-scope select=0 (đã thay bằng text chỉ đọc). SUPER_ADMIN editable permission cells=0, scopeToàn hệ thống, effective copy “Quyền hệ thống — chưa xác minh phạm vi hiệu lực”, không false0/64.
6. Khôi phục QA: bỏ report.export vừa thêm cho LEADERSHIP và Save; không đổi giá trị source snapshot trên disk.
7. User pagination16–30/77; keeper01 override report.export và effective42/42 còn nguyên. Header chia Trạng thái tài khoản / Phân loại quản lý / Vai tròRBAC rõ ràng.
8. Filter Đã khóa có4rows và cả4status text Đã khóa; search absent-user có empty state; reset giữ đủ dataset.
9. Unit V1 kiểm mọi role/assignment join và scope giống User Detail, alias deduplicate, mapped save cập nhật effective của toàn assigned users, không mất quyền ngoài matrix, không đổi overrides/scopes/13roles/64codes, giữ Q06 predicates.

### V5. P03-AC01 → P03-AC17 — hiện hành

| AC | Kết quả | Evidence |
|---|---|---|
| P03-AC01 | PASS | List/Detail trong shell P02, không thay bố cục module |
| P03-AC02 | PASS | Detail User tab active;close giữ context |
| P03-AC03 | PASS | Shared account email projection77records;browser leadership-02 |
| P03-AC04 | PASS | Shared Department Assignment;browser khớp |
| P03-AC05 | PASS | Shared authAudit;timestamp giữ nguyên |
| P03-AC06 | PASS | User/Detail/Matrix derive cùng assignments.scope;read-only V1 |
| P03-AC07 | PASS | Không hardcode reconciliation;map tường minh đã được owner duyệt,values derive nguồn |
| P03-AC08 | PASS | Classification field riêng;null chưa xác minh,không thêm role |
| P03-AC09 | PASS | Role name/code riêng trong User Detail và canonical Matrix selector |
| P03-AC10 | PASS | Data Scope vẫn có ở List,Detail,Matrix;không loại bỏ |
| P03-AC11 | PASS | Additive union giữ nguyên;keeper01 override còn sau Save role khác |
| P03-AC12 | PASS | Effective searchable/scrollable;Matrix save phản ánh code mới ở Detail;SUPER_ADMIN unresolved rõ ràng |
| P03-AC13 | PASS | Xem/Sửa có nhãn,focusable,sticky;luồng Xem chạy đúng. Ghi user backend không nằm trong prototype |
| P03-AC14 | PASS | Status có chữ;locked4rows browser |
| P03-AC15 | PASS | Unknown metadata/classification/SUPER_ADMIN giữ NEED CONFIRMATION,không fabricate;scope/mapping đã được duyệt localV1 |
| P03-AC16 | PASS | Một shared source/store;Matrix↔role.permissions↔User Detail E2E đã kiểm. Q04/Q05/Q06 và catalogue không đổi |
| P03-AC17 | PASS | Báo cáo đã cập nhật root cause,mapping,files,evidence,17AC |

**PASS — P03** trong phạm vi prototype local đã duyệt. Backend mapping không còn là yêu cầu gate của prototype; các unknown về backend/classification/security không bị tự xác nhận. SUPER_ADMIN tiếp tục unresolved thống nhất cả Matrix/Detail, không tạo contradiction0/full. **Dừng: không chạy Prompt04.**

---

## Lịch sử trước khi owner duyệt Local V1 (không phải trạng thái hiện hành)

## Remediation giới hạn AC16/Q01 — kết quả kiểm tra bổ sung 08/09/2026

**NEED CONFIRMATION — remediation chưa thể áp dụng an toàn. AC16 vẫn FAIL/BLOCKED. Chưa đạt 17/17; không cập nhật gate thành PASS.**

Owner đã cho phép nối Matrix ở mức data binding, nhưng chưa cung cấp mapping ô→permission hoặc identity/scope contract còn thiếu. Quyền thực hiện remediation không đồng nghĩa xác nhận một mapping nghiệp vụ cụ thể. Đã đọc lại đầy đủ báo cáo P01/P02/P03, reuse bằng chứng và kiểm tra trực tiếp source hiện hành. Không audit lại CMS hoặc tự thay đổi bản thiết kế.

### R1. Root cause xác định ở source

- `server.mjs:11–18`: một `dataset=createCmsSnapshot()` dùng cho `/user-data`.
- `user-flow-model.mjs:8–10`: List/Detail nhận các `userView(dataset,key)`, catalogue permission và role metadata từ dataset đó.
- `server.mjs:40`: Matrix được cấp **b2b-interaction.js**, không phải user-flow.js. `window.rbacModuleCounts` chỉ là tổng số trên shell, không phải role/permission/assignment model.
- `b2b-interaction.js:6–14`: Matrix lấy rows, leaves, radio, selects trực tiếp từ DOM của b2b.html.
- `b2b-interaction.js:25–27`: `checks` là mảng boolean theo thứ tự DOM; `scope` là index radio; `rows` là mảng selectedIndex của row-scope. Không có foreign key tới canonical permission/assignment/scope.
- `b2b-interaction.js:57`: Save chỉ thay `committed=state()` trong document, không cập nhật dataset của `/user-data`.
- `b2b-interaction.js:60`: chọn role khác bị reset về option0; không lookup role_code.

Vì vậy việc chỉ fetch cùng endpoint, đổi counter3→8 hoặc đổi dropdown thành13roles **không đủ** đáp ứng Q01: các ô quyền và scope vẫn chưa liên kết với canonical records. Không thực hiện vá bề mặt đó để gọi remediation hoàn tất.

### R2. Canonical source/model hiện có — đã kiểm tra

Canonical ở đây là **snapshot CMS được owner duyệt cho demo**, không phải dữ liệu production mới nhất hay backend schema đã xác minh.

| Entity / relationship | Nguồn chính xác | Key hiện có | Phần còn thiếu |
|---|---|---|---|
| User Account | `lib/rbac-cms-snapshot.ts`, `createCmsSnapshot().accounts` | 77 username duy nhất | `user_id` backend chưa có, không tự alias username thành user_id |
| Role catalogue | Cùng file, `roleRows` tại :166; `dataset.roles` | 13 `code` duy nhất; code được dùng như role_code | `role_id` chưa có; vẫn có thể join role_code đã duyệt ở mức snapshot |
| Permission catalogue | `permissionRows` tại :98; `dataset.permissions` | 64 `code` duy nhất; giữ tên/group/restricted/reason | `permission_id` chưa có; permission_code có sẵn nhưng chưa map vào ô B2B |
| Role→Permission | `dataset.roles[].permissions` | Danh sách exact permission_code | Không có mapping ngược từ B2B module/action tới code hoặc tập code |
| User→Role assignment | `createCmsSnapshot().assignments` tại :209–214 | `{username,roleCode,scope,validity}`, 77 assignments | Không có assignment_id/user_id/role_id |
| Data Scope assignment | `assignments[].scope` trên cùng record | Hai giá trị quan sát: “Theo chức năng”, “Toàn hệ thống” | Không có scope_id/type/warehouse_id hoặc row-scope override |
| Department | `dataset.departments[username]` | Snapshot user key | Department ID/backend assignment contract chưa cung cấp |
| Overrides | `dataset.overrides[username]` | Exact additive permission_code | Không được suy ra revoke/deny |

Đã kiểm tra role catalogue và số assignment thực join:

| role_code | assignedUserCount | Số assignment join | Số explicit permission codes |
|---|---:|---:|---:|
| INBOUND_ONLY_TEST | 4 | 4 | 24 |
| NO_PERMISSION | 4 | 4 | 0 |
| SKU_MANAGER | 6 | 6 | 3 |
| MASTER_MANAGER | 5 | 5 | 2 |
| WAREHOUSE_MANAGER | 6 | 6 | 17 |
| WAREHOUSE_KEEPER | 6 | 6 | 41 |
| WARRANTY_STAFF | 8 | 8 | 13 |
| LEADERSHIP | 6 | 6 | 12 |
| VIEWER | 8 | 8 | 14 |
| WAREHOUSE_APPROVER | 6 | 6 | 19 |
| ADMIN | 6 | 6 | 60 |
| SUPER_ADMIN | 5 | 5 | 0 explicit; **không kết luận effective0** |
| WAREHOUSE_STAFF | 7 | 7 | 30 |

Không thêm/xóa role hoặc permission. Canonical permissions vẫn đúng64mã trong source; không tái tạo catalogue từ ảnh B2B.

### R3. Mapping cũ → mapping chuẩn: khoảng trống cụ thể

Đã trích 10 child rows và **42 ô checkbox** từ b2b.html. Cột hành động là nhãn UI, chưa phải permission_code.

| B2B module code | Các ô có checkbox trong nguồn | Có exact code trong catalogue? | Mapping chuẩn của từng ô |
|---|---|---|---|
| warranty.receive | Xem,Thêm,Chỉnh sửa,Xóa,Xuất | Không | NEED CONFIRMATION — 5 ô |
| warranty.component | Xem,Thêm,Chỉnh sửa,Xóa,Xuất | Không | NEED CONFIRMATION — 5 ô |
| warranty.pricing | Xem,Thêm,Chỉnh sửa,Xóa,Phê duyệt,Xuất | Không | NEED CONFIRMATION — 6 ô |
| scan.execute | Xem,Thêm | Có exact `scan.execute` | NEED CONFIRMATION — code trùng không chứng minh code ứng với ô Xem hay Thêm, hoặc một mapping khác |
| scan.batch | Xem,Thêm,Chỉnh sửa | Không | NEED CONFIRMATION — 3 ô |
| inventory.trace | Xem,Xuất | Có exact `inventory.trace` | NEED CONFIRMATION — chưa có bằng chứng mapping hai hành động này |
| inventory.transfer | Xem,Thêm,Chỉnh sửa,Xóa,Phê duyệt,Xuất | Không | NEED CONFIRMATION — 6 ô |
| inbound.return_part | Xem,Thêm,Chỉnh sửa,Xóa,Xuất | Không | NEED CONFIRMATION — 5 ô |
| inbound.supplier | Xem,Thêm,Chỉnh sửa,Xóa,Phê duyệt,Xuất | Không | NEED CONFIRMATION — 6 ô |
| report.sla | Xem,Xuất | Không | NEED CONFIRMATION — 2 ô |

Không suy `warranty.receive.create` từ tên module+cột, không thay `warranty.receive` bằng `warranty.temp_only`, không cho một ô điều khiển `warranty.manage` chỉ vì nhãn gần giống. Không dùng một map tự bịa để phủ hết64permissions vào42ô. Những dấu “—” không tự chuyển thành permission mới.

**Mapping chuẩn sau sửa: CHƯA ÁP DỤNG** vì thiếu evidence ở bảng trên. Đã xác định canonical model đích tại R2 nhưng chưa có mapping nối có thẩm quyền.

Data Scope cũ dùng3radio (Kho cá nhân/Kho chi nhánh/Toàn hệ thống),2chip kho theo tên,giới hạn2/5 và2row-scope selects. Nguồn chuẩn không có IDs hay quan hệ kho đó. Không tự chuyển “Theo chức năng” thành “Kho chi nhánh” và không suy scope của role từ một user assignment. Cần xác định cách trình bày khi các users cùng role có assignment scope khác nhau.

Đã kiểm tra thêm `DESIGN.md` đi kèm ảnh lần(2): chỉ mô tả token/layout/components, không có cell-permission/identity/scope mapping. Nội dung màu/thiết kế trong tài liệu đó không được dùng để override màu Hoa Nam đã xác nhận. Tìm kiếm ở lib/standalone/handoff không tìm thấy mapping contract có thẩm quyền cho các mã thiếu trên.

### R4. Files changed trong remediation này

**Chỉ cập nhật `RBAC_P03_USER_FLOW_REPORT.md`.** Không sửa UI, source dataset, Q04/Q05/Q06, Matrix handlers, shell hoặc routing. Không tạo bảng mapping thực thi với giá trị suy đoán. Không publish/commit/chạy Prompt04.

### R5. Re-run AC16 và regression

Đã chạy lại `node --test tests/rbac.test.mjs tests/rbac-p02.test.mjs tests/rbac-p03.test.mjs`: **29/29 PASS**. Đây là regression source/model và shared-shell tests; **không đủ chứng minh Q01 Matrix**.

Chạy riêng diagnostic AC16 trên active source:

```json
{"AC16":"FAIL","sharedEndpoint":true,"matrixUsesSource":false,"privateMatrixState":true,"privateScope":true}
```

Diagnostic trả exit1 đúng blocker. `matrixUsesSource=false` dựa trên kiểm tra script Matrix không có fetch/shared-model consumption, kết hợp root cause R1; không dùng riêng regex như bằng chứng business đầy đủ.

Regression review toàn bộ AC: source/UI không đổi trong lượt này; PASS visual/browser của lượt P03 trước được kế thừa, không tuyên bố đã chạy mới toàn bộ browser E2E. Các checks logic/source tương ứng được rerun bằng29tests trên.

| AC | Kết quả sau remediation attempt | Evidence |
|---|---|---|
| P03-AC01 | PASS | P02 shell regression; không thay shell |
| P03-AC02 | PASS | Direct Detail/User tab regression |
| P03-AC03 | PASS | Same shared userView email77records; source mutation test |
| P03-AC04 | PASS | Department Assignment projection test |
| P03-AC05 | PASS | Audit projection test |
| P03-AC06 | PASS | List/Detail assignment scope projection test |
| P03-AC07 | PASS | Không sửa/hardcode value; source-driven regression |
| P03-AC08 | PASS | Classification độc lập roles/effective |
| P03-AC09 | PASS | Separate role data/render source không đổi; browser evidence P03 giữ nguyên |
| P03-AC10 | PASS | Scope field/cột không đổi; source regression |
| P03-AC11 | PASS | Additive union regression, không deny/revoke |
| P03-AC12 | PASS | Known effective/empty/unresolved regression; browser evidence trước |
| P03-AC13 | PASS | User action source/sticky layout không đổi; browser evidence trước |
| P03-AC14 | PASS | Status text render không đổi; browser evidence trước |
| P03-AC15 | PASS | R2/R3 ghi NEED CONFIRMATION cụ thể |
| P03-AC16 | **FAIL / BLOCKED** | Active Matrix vẫn private DOM model; thiếu mapping có bằng chứng, chưa nối Q01 |
| P03-AC17 | PASS | Báo cáo tồn tại và đã cập nhật remediation |

**Kết quả: 16/17 PASS; không đóng gate P03.**

### R6. Bằng chứng cần owner/DEV cung cấp để thực thi phần bị chặn

1. Mapping cho42ô: `B2B module code + cột thao tác → exact canonical permission_code (hoặc tập code với điều kiện ALL/ANY được xác nhận)`, chỉ rõ ô không áp dụng. Không điền mapping chỉ bằng tên gần giống.
2. Quan hệ identity: `user_id↔username`, `role_id↔role_code`, `permission_id↔permission_code` nếu backend dùng ID; assignment cùng user/role/scope key. Không cần password/token.
3. Data Scope: scope type/key, assigned warehouse IDs và row-scope relation với assignment; cách thể hiện nhiều scope khi một role gán cho nhiều user. Nếu row scope chỉ là nhãn UI, cần xác nhận rõ không phải một assignment/permission mới.

Có thể cung cấp API contract/export đã khử secrets hoặc source backend chứa các mapping. Khi đủ evidence, remediation chỉ nối model và re-run gate; **không được dùng xác nhận chung “dùng CMS” thay cho cell mapping còn chưa tồn tại trong nguồn đã đọc**.

---

Ngày 08/09/2026. **Gate: BLOCKED — chưa PASS — P03.**

Đã triển khai phần User List/Detail trong scope và kiểm thử. **16/17 AC PASS; AC16 FAIL/BLOCKED ở điều kiện Q01 toàn module**, không phải do thay đổi business rule. Matrix B2B vẫn sử dụng logical data/template riêng chưa map với nguồn CMS; đây là nợ P01 ngoài phạm vi sửa Matrix ở P03. Không được bỏ qua STOP condition để gọi P03 PASS. Không chạy Prompt 04.

## 1. Dependencies và scope

Đã đọc đầy đủ Prompt 03 đính kèm, `RBAC_P01_AUDIT_REPORT.md`, `RBAC_P02_IMPLEMENTATION_REPORT.md` trước implementation. Dependency gate được xác nhận: **PASS — P01**, **PASS — P02**.

Reuse shell/header/tabs/sidebar/routing P02; không rollback, không redesign lại shell hoặc Matrix. Changes vào routing chỉ để mang đúng khóa người dùng tới Detail và giữ User tab active. Không audit lại CMS từ đầu. Nguồn đã xác nhận vẫn là snapshot CMS 07/09/2026 được owner duyệt, không phải API CMS live ngày 08/09.

## 2. Files changed

| File | Thay đổi P03 |
|---|---|
| `standalone/rbac-baseline/user-flow-model.mjs` — mới | `userFlowData(dataset)` gọi shared `userView` cho toàn accounts; validate unique username; filter/page helpers cho test |
| `standalone/rbac-baseline/user-flow.js` — mới | List/Detail lấy cùng `/user-data`; render các trường từ projection, full dataset search/filter/pagination; generic per-user Detail, additive override display, effective search/empty/unresolved states |
| `standalone/rbac-baseline/user-flow.css` — mới | CSS giới hạn user-flow: padding bảng gọn, account/email đọc được, Data Scope giữ riêng, Xem/Sửa sticky, status có chữ, Detail giữ card/border/hierarchy Hoa Nam |
| `standalone/rbac-baseline/server.mjs` | Khởi tạo một dataset, read-only GET `/user-data`, inject user-flow assets cho List/Detail; truyền selected user query vào shell |
| `standalone/rbac-baseline/module-shell.js` | Validate same-origin path; giữ `?user=` trong history; đổi src Detail đúng key khi mở người khác; vẫn chỉ hai tab P02 |
| `standalone/rbac-baseline/rbac-module-shell.mjs` | Direct Detail nhận userKey an toàn qua encoded query; note nguồn được cập nhật, không thay cấu trúc shell/header/tab |
| `tests/rbac-p03.test.mjs` — mới | 9 tests về dependency, projection toàn 77 tài khoản, source mutation, pagination/filter, classification/additive, unresolved, deep-link và Matrix preservation |
| `RBAC_P03_USER_FLOW_REPORT.md` | Báo cáo này |

Không sửa `b2b.html`, `b2b-interaction.js`, `module-shell.css`, `view-composer.mjs`, `lib/rbac.ts`, `lib/rbac-cms-snapshot.ts`, `app/page.tsx` hoặc module WMS khác. HTML List/Detail gốc giữ nguyên trên disk như reference; runtime không còn lấy literal nghiệp vụ trong chúng để render data.

## 3. Data binding thực tế

```text
createCmsSnapshot() — nguồn đã được owner duyệt
       ↓ một dataset trên local server
userFlowData(dataset) → userView(dataset, username)
       ↓ GET /user-data (read-only)
       ├── User List: tìm/lọc/phân trang các projection
       └── User Detail: lookup chính projection đó bằng username
```

| Trường | Nguồn Q02 / code | Hiển thị |
|---|---|---|
| Name / Username / Email / Account Status | `accounts` từ User Master snapshot | Cùng property ở List và Detail, không ghép email từ username |
| Department | `departments[username]`, Department Assignment snapshot | Cùng giá trị, filter theo field chính xác |
| Last Login | `authAudit[username]`, Audit display snapshot | Giữ text timestamp đã quan sát, không tự chuyển timezone |
| Role / Data Scope | `assignments` join `roles` | Role riêng và scope riêng, không suy phạm vi từ tên role |
| Classification | `accounts.managementClassification` | null → “Chưa xác minh phân loại”; không suy Quản trị cấp cao từ LEADERSHIP |
| Custom Overrides | `overrides[username]` | Cộng thêm, không thêm revoke/deny UI |
| Effective Permissions | `userView()` có sẵn: union role permissions + overrides | Deduplicate; giữ nguyên code; null cho effective chưa xác minh, khác với [] không có quyền |

### Identifier limitation — NEED CONFIRMATION

Snapshot có **77 username duy nhất**, chưa có database `user_id` xác minh. P03 dùng username làm **snapshot join key công khai và minh bạch**, không tự tạo ID, không coi `USR-00248`/`HN-LD02` từ ảnh là backend user_id. Same-record consistency được kiểm tra trên join key này. Khi tích hợp backend cần mapping user_id thật từ User Master; không giả vờ đã kiểm thử production-ID binding.

### No hardcoded reconciliation

Không có case `if username === leadership-02` trong rendering để ép giá trị. `/user-data` tạo mọi bản ghi bằng cùng hàm `userView`; List/Detail cùng lookup object. Test đổi email/department/audit/scope ở **test-only source** làm cả hai projection đổi theo. Không sửa dữ liệu snapshot, không tạo thêm rows để đủ 77, không bỏ Data Scope.

Template literal cũ bị giữ invisible đến khi fetch/bind xong để không lóe dữ liệu sai. Nếu read endpoint lỗi, render lỗi tải dữ liệu và nút thử lại, không fallback sang literal của ảnh.

## 4. Discrepancies resolved trong User flow

| P01 ID | Entity | Trước | Sau / nguồn |
|---|---|---|---|
| DT01 | leadership-02 email | List @hoanam.vn, Detail @gmail.com | Cả hai `leadership-02@gmail.com` từ account snapshot đã duyệt |
| DT02 | leadership-02 department | List chưa có, Detail Ban Giám Đốc | Cả hai Phòng hành chính - nhân sự từ Department Assignment snapshot |
| DT03 | leadership-02 Last Login | Chưa đăng nhập vs 05-09-2026 17:59 | Cả hai 05-09-2026 15:26 từ Audit display snapshot |
| DT04 | leadership-02 scope | Theo chức năng vs Toàn hệ thống | Cả hai Theo chức năng từ role assignment |
| IA02 | Detail route | `?user=viewer-01` vẫn hiện Ban lãnh đạo 02 | Lookup viewer-01 đúng; unknown/missing key có empty state, không fallback người khác |
| DT05/BH09 | List count/filter/page | 8 literal rows,22 total, giả range1–15 | 77 source records; global filtering; page15/25/50; visible range thực; reset hoạt động |
| DT10/BH08 (read portion) | Effective | 12 nhãn suy diễn theo ảnh | Cùng union từ catalogue/role/override đã duyệt; LEADERSHIP12, keeper01=42, code nguyên vẹn |
| IA04 | Detail context | Có shell P02 nhưng một user cố định | Mỗi selected user đúng URL; cùng User tab, close giữ filtered list và mounted document |

Name, username, role và account status cũng lấy cùng projection. Filter role chứa catalogue13 role từ nguồn; department/status option derive từ dataset, không dùng synonym heuristic từ label ảnh.

## 5. NEED CONFIRMATION / phần không tự xử lý

| ID | Vấn đề | Xử lý trong P03 / ảnh hưởng gate |
|---|---|---|
| P03-ID01 / P01 BH10 | backend user_id mapping chưa có | Dùng observed username join key; document source.backendUserId=null; chưa claim backend integration |
| P01 DT12 | classification assignment cho từng user | Giữ field nguồn null, copy chưa xác minh; Quản trị cấp cao không thành role. Không sửa source/ảnh gốc |
| P01 BH10 | phone,record version,2FA,IP,email verified,password age trong ảnh chưa có nguồn đã xác minh | Không lấy literal làm dữ liệu thật; giữ vị trí trường phone/version/2FA với copy chưa có dữ liệu; không vẽ verified/IP/security claim giả |
| P01 DT13 / historical D20 | SUPER_ADMIN luôn toàn quyền vs effective0 | Giữ effective=null và thông báo NEED CONFIRMATION; không chọn0 hoặc64. User không có quyền thật NO_PERMISSION vẫn []/0 riêng biệt |
| P01 DT08/DT09/BH02 | B2B11/48, cell/module/action codes chưa map catalogueCMS64 | **Không đổi Matrix.** Không tự rename/append permission codes hoặc đổi counter thành15/42 |
| P01 DT11 | row-scope,warehouse IDs/giới hạn kho trong B2B chưa map assignments | **Không thay nghiệp vụ scope/kho** |
| P01 ST03 | metadata/version hệ thống | Shared shell P02 tiếp tục không chọn version tùy ý |
| Q01 cross-screen debt | List/Detail hiện sourceCMS77/13/64; B2B vẫn template riêng (WARRANTY_STAFF3 users,11/48; source role8 users,13/64) | **Blocker để kết luận đầy đủ P03 theo STOP condition**. Không được coi hai dataset này là một logical dataset đã đồng bộ. Việc sửa/nối Matrix nằm ngoài scope P03 và cần mapping xác nhận; dừng đúng phần này |

Không thay đổi các rule Q01–Q06; nhưng **rule không đổi ≠ implementation toàn module đã tuân thủ**. Unresolved classification/null metadata không tự vi phạm Q03 vì không cấp quyền; unresolved mapping Matrix chưa cho phép xác nhận Q01 toàn module. Không tự gỡ blocker này bằng caveat rồi gắn nhãn PASS.

## 6. Verification đã chạy

### Automated / source

`node --test tests/rbac.test.mjs tests/rbac-p02.test.mjs tests/rbac-p03.test.mjs` → **29/29 PASS** (11 domain +9 P02 regression +9 P03).

- Full 77 projections đều deep-equal shared userView; unique keys; source mutation changes values, không fixed literals.
- Filter role LEADERSHIP=6; email search exact=1; unknown=0; page sizes15/25/50 không mất/nhân đôi accounts; page clamp/empty.
- Classification không thay roles/effective; additive test giữ mọi inherited permissions.
- SUPER_ADMIN null khác NO_PERMISSION []; keeper01 report.export union=42.
- P02 shared two tabs, route-aware selection, origin guards, shape-preserving composition giữ PASS.
- JS syntax checks server/user-flow/module-shell PASS; git diff --check không có lỗi whitespace mới.

Không chạy build/deploy WMS vì đây là standalone Node demo. Không sửa CMS, không tạo user/role/quyền, không lưu dữ liệu nhạy cảm mới từ hệ thống khác.

### Browser E2E

1. `/users` trong shell P02: đủ search,role/department/status filters,rows/page,reset,table9 columns có Data Scope và actions,pagination; header counts77/13, hai tabs.
2. Search leadership-02 →1 row; Xem → URL `/detail?user=leadership-02`, User tab active. List/Detail cùng tên,username,email,department,role,scope,status,last login theo bảng phía trên; Detail12 quyền.
3. Close Detail → List còn1 filtered result (`Hiển thị1–1/1 · Tổng77`). Không mất shell hoặc Matrix document.
4. Chọn keeper01 → Detail đúng key, override `report.export`, effective42/42; search report.export hiện đúng1 permission nhãn Cấp riêng, không đổi code.
5. Role filter LEADERSHIP →6 rows,range1–6/6. Reset phục hồi toàn bộ dataset.
6. Next page →16–30/77. Chọn50 dòng →50 rows. Next→51–77/77.
7. Direct `/detail?user=viewer-01` → key viewer-01, email viewer-01@gmail.com, department Phòng kinh doanh, lastlogin06-09-2026 15:13; không hiện leadership-02.
8. Unknown `/detail?user=missing-user` →Không tìm thấy người dùng; không fallback. `/detail` không key →chọn từ List (source/model path).
9. Direct super-admin-01 →effective Chờ xác minh/NEED CONFIRMATION; direct no-permission-01 →0/0, chưa có quyền được cấp.
10. Filter Đã khóa →4 rows, cả4 có text “Đã khóa”, không color-only. Search absent-user→empty. Reset→List đủ dữ liệu.
11. Chuyển Role tab rồi User tab →Role active đúng khi /roles, vẫn2tabs; không redesign B2B.
12. Screenshot Detail xác minh Identity→Account Info→Role/Scope→Overrides→Effective; ba nhãn Trạng thái tài khoản/Phân loại quản lý/Vai tròRBAC tách rõ trong phần đầu.
13. Mật độ List: tại top viewport1600 và1280, iframe content tương ứng1280/960; table scroll container client953/697 CSSpx,table990,overflow:auto; actions position:sticky, cột “Phạm vi dữ liệu” còn. Không kết luận bảng không cần cuộn; cuộn có chủ đích để giữ thông tin và actions.

Read endpoint/source snapshot local, không kiểm chứng backend audit timezone hoặc user_id thật. Điều này được giữ rõ trong acceptance “where source truth is available”.

## 7. P03 acceptance — từng AC

| AC | Kết quả | Evidence / giới hạn |
|---|---|---|
| P03-AC01 List/Detail trong shared shell | PASS | Same P02 shell/panels; regression tests +browser |
| P03-AC02 Detail thuộc User tab | PASS | /detail?user=… User active, đóng về List context |
| P03-AC03 Không contradictory email khi có source | PASS | Shared77 projections và browser leadership/viewer; source snapshot approved, username join key được khai báo |
| P03-AC04 Không contradictory department khi có source | PASS | Shared departments source, browser leadership/viewer |
| P03-AC05 Không contradictory Last Login khi có source | PASS | Shared authAudit text; không timezone inference |
| P03-AC06 Không contradictory Data Scope khi có source | PASS | Same assignments; leadership Theo chức năng ở cảhai |
| P03-AC07 Không hardcode để giấu discrepancy | PASS | No per-user display overrides; source mutation test; literal ảnh không fallback |
| P03-AC08 Quản trị cấp cao là classification | PASS | Separate classification field; null chưa xác minh; test không đổi roles/effective |
| P03-AC09 Role hiển thị riêng | PASS | Header semantics +role/scope table hiển thị tên/code |
| P03-AC10 Data Scope không bị bỏ | PASS | Cột riêng ở List, field riêng ở Detail |
| P03-AC11 Overrides additive-only | PASS | Union logic nguyên trạng; keeper01 report.export, no revoke/deny introduced |
| P03-AC12 Effective Permissions available | PASS | Searchable/scrollable section,known users code chính xác; null unresolved được ghi rõ, không biến thành0 |
| P03-AC13 Actions accessible | PASS | Xem/Sửa có nhãn theo user,button focusable,sticky; Xem generic hoạt động. Ghi/sửa backend vẫn chưa kết nối, không success giả |
| P03-AC14 Status không color-only | PASS | Text Đang hoạt động/Tạm ngưng/Đã khóa ở hai màn, browser locked4rows |
| P03-AC15 Unresolved recorded NEED CONFIRMATION | PASS | Section5 liệt kê source/mapping/evaluator/identity/metadata |
| P03-AC16 Q01–Q06 unchanged | FAIL / BLOCKED ở full gate | Domain rule/code không bị sửa (hash giữ nguyên). Tuy nhiên chưa thể xác nhận Q01 thực thi xuyên cảmodule khi Matrix giữ logical template riêng; STOP condition không cho giữ unresolved vi phạm Q01 rồi kết luận PASS |
| P03-AC17 Report exists | PASS | File này |

## 8. Handoff / STOP

Demo: `http://127.0.0.1:5180/users`.

**Chưa kết luận PASS — P03; không chuyển Prompt04.** Phần User flow đã được triển khai và verified như trên. Để đóng gate đầy đủ cần owner/DEV cung cấp mapping các ô B2B/role/scope sang catalogue và assignments chuẩn, cùng phạm vi cho phép nối data Matrix; không cần password. Không tự mở rộng P03 để sửa Matrix hoặc tự giải thích SUPER_ADMIN.

### Integrity

Các hash vẫn bằng source đã có:

```text
lib/rbac.ts                 DA5FBC1A5458219B2219F627524C7A9CF747822F45DE624574EA56F5B5ACDC90
lib/rbac-cms-snapshot.ts     1F7818351E12E86A8EAAE5C46F52EDF3550250D50F23BD1AAC6F6D4EC82E00F7
b2b.html                    9F89748D6DF25453AAA11E94E15B27A696B0104D8021E5BE8CAB8F1F50B507D2
b2b-interaction.js          265431B10B4A496FDB6D1CE0D254FE6DAEAABA0060193251204857F6332570A4
module-shell.css            F264B172BFFA25F18B6DB02DEDF58DE9F67A204E0367E99AC204D78A340C822E
```
