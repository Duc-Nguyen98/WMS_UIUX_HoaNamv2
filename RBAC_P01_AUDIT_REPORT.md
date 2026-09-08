# RBAC — Prompt 01: Audit, Root Cause & IA Baseline

**PASS — P01** · Ngày 08/09/2026 · Audit only.

PASS này xác nhận hoàn thành **báo cáo audit**, không xác nhận UI đạt P0, không chấp thuận triển khai Prompt 02. Lỗi P0 mất tab quay lại và các discrepancy bên dưới vẫn tồn tại; không có thay đổi code/nghiệp vụ trong lượt audit.

## 0. Phạm vi, phương pháp và nguồn

Yêu cầu thực thi: `C:/Users/Admin/Downloads/01_RBAC_Audit_RootCause_IA.md`, chỉ PROMPT 01. Đối tượng hiện hành là **demo standalone** tại `http://127.0.0.1:5180`, được owner yêu cầu dựng riêng theo ảnh trước khi ghép WMS. Không nhầm demo này với component React RBAC đã tháo khỏi trang tổng.

Nguồn bằng chứng:

- **A — active implementation:** `standalone/rbac-baseline/server.mjs`, `users.html`, `detail.html`, `b2b.html`, `interaction.js`, `b2b-interaction.js`; đọc source và kiểm tra UI/DOM đang chạy ngày 08/09.
- **B — retained implementation:** `components/rbac-prototype.tsx`, `lib/rbac.ts`, `lib/rbac-cms-snapshot.ts`. Vẫn tồn tại nhưng không được `app/page.tsx` import/render; không phải logic đang chạy trong A.
- **C — historical design:** `standalone/rbac-baseline/roles.html` là ma trận hai pane cũ, **không được server map tới route**. Số 28 users, 9 roles, LEADERSHIP 58/64 thuộc C, không phải giá trị đang hiển thị trên `/roles` hiện tại.
- **D — approved CMS snapshot:** 77 accounts, 13 roles, 64 codes trong `lib/rbac-cms-snapshot.ts`, được owner xác nhận nguồn ở lượt trước. Đã đọc lại bằng module read-only trong lượt này. Là snapshot khảo sát 07/09, **không tuyên bố đây là dữ liệu live mới nhất ngày 08/09**.
- **E — historical live evidence:** `RBAC_DISCREPANCY_REGISTER.md`, đặc biệt D20 SUPER_ADMIN. Dùng làm bằng chứng có thời điểm, không giả vờ audit lại CMS vận hành trong lượt này.

Thực hiện: đọc files, HTTP GET route, browser navigation và DOM inspection. Không bấm Save/Delete/Reset quyền, không gọi API CMS, không sửa code, không publish hoặc commit. Không chụp/thu thập thêm password/token. Chỉ tạo file báo cáo này.

## 1. ROUTE MAP

Base URL của A: `http://127.0.0.1:5180`.

| Route/path | Page + script thực sự render | Sidebar active hiện tại | Tab hiện có | Deep-link / kiểm chứng |
|---|---|---|---|---|
| `/` | `users.html` + `interaction.js` | “Người dùng & phân quyền”, active bằng class trong HTML | Hai button: “Người dùng & phân quyền 22”, “Vai trò & ma trận quyền 9 vai trò”; không ARIA tablist | GET 200; alias của `/users`, không redirect canonical |
| `/users` | Như `/` | Như trên; không `aria-current` route-driven | Hai button tab giả lập | GET 200, browser mở được. Button Matrix chuyển full-document sang `/roles` |
| `/detail` | `detail.html` + `interaction.js` | Không sidebar thật; chỉ background giả bị blur/pointer-events-none | Không module tabs | GET 200; browser hiển thị cố định Ban lãnh đạo 02. Nút Đóng đã xác minh quay về `/users` |
| `/detail?user=viewer-01` | Vẫn `detail.html` | Như `/detail` | Không | Page deep-link 200 nhưng **entity deep-link FAIL**: vẫn Ban lãnh đạo 02; query không được dùng |
| `/roles` | **`b2b.html` + `b2b-interaction.js`**, không phải `roles.html` | “Phân quyền & Vai trò”, active bằng class trong HTML; link được script đổi thành `/users` | **0 User tab, 0 Matrix tab, 0 tablist** | GET 200; browser tái hiện mất tab từ `/users` |
| `/roles?role=LEADERSHIP` | Vẫn B2B | Như `/roles` | Không | Page deep-link 200 nhưng **role deep-link FAIL**: select vẫn WARRANTY_STAFF |
| `/roles/` | Không route | — | — | GET 404; router match exact pathname, không normalize slash |
| `/detail/leadership-02` | Không route | — | — | GET 404; chưa có route theo user identifier |
| `/roles.html` | Không route mặc dù file cùng tên tồn tại | — | — | GET 404, không có static-directory fallback |
| `/interaction.js`, `/b2b-interaction.js` | Assets, không màn hình | — | — | Được inject riêng theo filename; không phải module layout |

Ngoài A:

- `http://localhost:5176/#rbac-prototype` là URL cũ của review board, không phải route RBAC standalone. Source `app/page.tsx` hiện không render `RbacPrototype`, nên hash không đại diện một RBAC module đang tích hợp. Không dùng tab cũ còn mở để kết luận current source có RBAC.
- CMS reference `/system/users?screen=IAM-01`: lượt khảo sát trước có hai tab trong một trang; đây là hệ thống tham chiếu, không phải file cần refactor của demo hiện tại. Không chỉnh CMS.

### Browser evidence tái hiện được

1. Mở `/users`: có hai button tab đúng nhãn trên.
2. Bấm “Vai trò & ma trận quyền 9 vai trò”: URL `/roles`; H1 đổi thành “Ma trận phân quyền vai trò & Phạm vi dữ liệu”. DOM trả `userTab=0`, `roleTab=0`, `tablist=0`.
3. Còn một link `/users` ở sidebar, label “Phân quyền & Vai trò”, `aria-current=null`. Link này quay về được nhưng **không phải tab User và không đáp ứng IA baseline**.
4. Direct `/detail?user=viewer-01`: DOM vẫn chứa identity Ban lãnh đạo 02; direct `/roles?role=LEADERSHIP`: selected role vẫn “Nhân viên bảo hành (WARRANTY_STAFF)”.
5. Direct `/detail` hoạt động, Đóng → `/users`. Hai lần thử từ Xem/tên trên tab List không ghi nhận URL đổi trong lần đọc; không suy đó là product failure chắc chắn. Source chỉ bind dòng index=0, chưa có generic entity flow; cần retest acceptance sau refactor, không tính PASS E2E List→Detail cho mọi user.

## 2. COMPONENT MAP

Hiện A là nhiều document HTML, **không có React/Vue RBAC shared-layout component**.

| Trách nhiệm | File / vị trí cụ thể | Shared hay duplicated |
|---|---|---|
| HTTP route dispatcher | `server.mjs:6–12` map pathname → filename; `:15–23` inject theme/script | Shared transport + theme, không shared DOM shell |
| Hoa Nam theme / tỷ lệ | `server.mjs:16–21`; List/B2B zoom 1.25, Detail 1; footer rule B2B | Shared palette đúng yêu cầu, geometry riêng; comment “Matrix uses 100%” ở :14 đã lỗi thời so với logic B2B |
| User page shell/sidebar | `users.html:54–161` | Copy riêng của List, không reused ở Matrix |
| User topbar/breadcrumb/header | `users.html:164–251` | Brand, search, profile và context hardcoded |
| User/Matrix tabs | `users.html:252–262`; handlers `interaction.js:9–11` | Chỉ tồn tại trong List; active style viết sẵn, không derive từ route |
| User filters/table/pagination | `users.html:263–711`; `interaction.js:18–42` | Đọc/filter DOM rows; 8 rows literal, không dùng userView/shared dataset |
| User Detail backdrop/identity | `detail.html:50–184` | Background giả + article styled modal, không overlay lên List thật |
| Detail role/scope | `detail.html:186–245` | Một assignment literal, không lookup user_id |
| Custom Override/Effective | `detail.html:248–356` | 0 overrides và 12 label literal; accordion native `<details>` |
| Detail close/actions | `detail.html:360–389`; `interaction.js:45–48,64–68` | Đóng/Escape navigation; các action còn lại chủ yếu alert chưa triển khai |
| B2B shell/sidebar | `b2b.html:57–157` | Copy thứ hai, khác nhãn/brand context/active item |
| B2B topbar/breadcrumb | `b2b.html:158–184` | Breadcrumb tách khỏi List |
| B2B module header/role selector | `b2b.html:185–232` | Thay chỗ module header/tabs bằng role-context + stats; **không tabs** |
| B2B Data Scope + toolbar | `b2b.html:233–314` | Radio scope/chips/search/filter/save, chỉ DOM state |
| Tree permission matrix | `b2b.html:315–890`; `b2b-interaction.js:6–55` | Parent/child phân bằng có/không có `<code>`; 5 groups, 10 child rows; 42 checkbox leaf, 15 checked ban đầu |
| B2B Save/Undo/footer | `b2b.html:894–918`; `b2b-interaction.js:18–28,56–60` | Hai nút Save cùng `committed=state()` trong RAM của document; không persistence/API |
| Sidebar return link | `b2b-interaction.js:61` | Rewrite href của label “Phân quyền & Vai trò”; không mount module nav |
| React version giữ lại | `components/rbac-prototype.tsx:114–226,262–285,488,800`; `lib/rbac.ts:168–193` | Có provider-like state trong component, shared projection, tabs và beforeunload; **không được dùng bởi A**. Tabs cũng đang state-driven, chưa route-driven |

Các phần thực sự shared ở A: theme injection, HTTP server và file `interaction.js` giữa List/Detail. **Không shared**: sidebar, header, breadcrumb, tab DOM, user data, role data, draft lifecycle. Font/config Tailwind bị lặp theo HTML; màu được server override Hoa Nam nên giống màu không chứng minh cùng module.

## 3. ROOT CAUSE — vì sao Matrix mất User tab

Chuỗi nguyên nhân cụ thể:

1. `users.html:252–262` chứa trọn khối hai nút tab. Nó là nội dung của document List, không phải template/layout được dùng chung.
2. `interaction.js:10` bind nút Matrix tới `go('/roles')`; `go` ở :6 gán `location.href`. Đây là **full-page navigation**, hủy DOM và JavaScript state của List.
3. `server.mjs:6` map `/roles` sang **`b2b.html`**; :9–12 chỉ đọc document đó. Không render `users.html` làm parent và không compose `RbacModuleLayout`.
4. `b2b.html:158–232` có topbar, breadcrumb, H1, role selector và stats rồi chuyển thẳng xuống Data Scope. File không có khối hai tabs. Không phải tabs bị CSS hide hay active-state chọn sai: DOM hoàn toàn không có chúng.
5. Server chỉ inject `b2b-interaction.js` cho B2B (`server.mjs:23`). Vì vậy các tab handlers của `interaction.js:9–11` không chạy tại `/roles`; dù có chạy cũng không thể tạo nút không tồn tại.
6. `b2b-interaction.js:61` chỉ đổi một sidebar link thành `/users`. Đây là lối quay lại khác cấp, khác tên, không duy trì module tab navigation.

**Kết luận: P0 Information Architecture / Navigation Consistency defect đã xác minh.** Root cause là composition/routing full-document thay toàn shell sang B2B template không có module tabs, không phải lỗi màu sắc, token hay CSS.

Không dùng ma trận cũ `roles.html` để phản biện rằng “Matrix đã có tabs”: file đó có tabs nhưng không reachable trong map hiện hành.

## 4. RBAC_DISCREPANCY_REGISTER — trạng thái audit hiện tại

Đây là register của **P01 hiện tại**, giữ nguyên register lịch sử bên ngoài. Mỗi dòng có đúng một classification. AUTO-FIXABLE là có thể giải quyết bằng Q01–Q06/source owner đã chốt hoặc IA trong Prompt 01; **không có nghĩa được sửa trong lượt audit này**. Những thay đổi vượt visual baseline vẫn chờ bước triển khai được owner yêu cầu.

| ID | Màn / entity | Observed A | Observed B | Nguồn / bằng chứng | Severity | Classification | Recommended treatment |
|---|---|---|---|---|---|---|---|
| IA01 | List↔Matrix, module RBAC | List có 2 button tabs | Matrix không có cả 2 | users:252–262; server:6; browser DOM | P0 | AUTO-FIXABLE | Shared module header/tabs trên tất cả RBAC routes; Matrix vẫn tab 02 của cùng module |
| IA02 | Detail, username/user_id | URL cho phép `?user=viewer-01` | Vẫn identity leadership-02; chỉ dòng đầu bind /detail | interaction:38–40; server chỉ đọc pathname; browser | P0 | AUTO-FIXABLE | Parse identity, lookup shared data; unknown user báo không tìm thấy. Không tự tạo user_id từ `USR-00248` |
| IA03 | Matrix, role_code | URL `?role=LEADERSHIP`, selector có 8 lựa chọn | Luôn WARRANTY_STAFF; change reset selectedIndex=0 | b2b-interaction:60; browser | P0 | AUTO-FIXABLE | Route-driven role selection bằng catalogue đã duyệt; không gắn ma trận WARRANTY_STAFF vào role khác |
| IA04 | Detail↔List context | Detail trông như modal trong WMS | Là document độc lập trên background giả, mất List tabs/filter/page | detail:50–75; interaction:45–48 | P0 | AUTO-FIXABLE | Giữ modal visual nhưng nằm trên User tab thật, restore list context/focus khi đóng |
| DT01 | List/Detail; leadership-02; email | `leadership-02@hoanam.vn` | Detail và snapshot: `leadership-02@gmail.com` | users:345; detail:154; D User Master snapshot | P0 | AUTO-FIXABLE | Cùng source account đã được owner chốt; không suy email bằng suffix |
| DT02 | List/Detail; leadership-02; department | Chưa có phòng ban | Detail Ban Giám Đốc; snapshot Phòng hành chính - nhân sự | users:349; detail:166; D departments | P0 | AUTO-FIXABLE | Bind Department Assignment chung theo Q02; không chọn giá trị của ảnh |
| DT03 | List/Detail; leadership-02; Last Login | Chưa đăng nhập | Detail 05-09-2026 17:59; snapshot 05-09-2026 15:26 | users:364; detail:174; D authAudit | P0 | AUTO-FIXABLE | Dùng cùng Audit source/display formatter; không tự chuyển timezone chưa xác định |
| DT04 | List/Detail; leadership-02; Data Scope | Theo chức năng | Detail Toàn hệ thống (tất cả kho/chi nhánh); snapshot Theo chức năng | users:356; detail:225; D assignments | P0 | AUTO-FIXABLE | Bind cùng Role Assignment + Scope; không suy scope từ LEADERSHIP |
| DT05 | User count/List | Badge 22, footer 1–15/22 | Chỉ 8 rows DOM; snapshot 77; C từng ghi 28 | users:256,690; browser; C roles:209 | P0 | AUTO-FIXABLE | Separate total/filtered/page range từ dataset; không hardcode 22/28/77 để che lệch |
| DT06 | Role count/List↔Matrix | List ghi 9 roles | B2B 8 options, chỉ một role có ma trận; snapshot 13 roles | users:260; b2b:200–208; D | P0 | AUTO-FIXABLE | Counter/selector cùng catalogue; không tự thêm role thứ 9 |
| DT07 | WARRANTY_STAFF; assigned users | B2B 3 nhân viên | Snapshot 8 assignments/users | b2b:214; D role assignedUserCount | P0 | AUTO-FIXABLE | Lấy số đếm từ assignments đồng nhất; không dùng 3 như số thực |
| DT08 | Matrix permission counter | Header 11/48 (23%) | DOM có 42 leaf checkboxes, 15 checked, 10 modules con; snapshot role có 13/64 mã | b2b:223; browser DOM; D | P0 | NEED CONFIRMATION | Chốt đơn vị đếm ô/module/action vs permission và mapping. Không đổi header thành 15/42 rồi gọi là 15 permission |
| DT09 | B2B module/action↔CMS codes | `warranty.receive`, `warranty.component`, `warranty.pricing`, `scan.batch`, `inventory.transfer`, `report.sla` | Catalogue CMS có warranty.temp_only/component_issue/pii.*, scan.execute/classify, inventory.trace...; không có mapping cell→permission | b2b code tags; D 64 codes | P0 | NEED CONFIRMATION | Owner/DEV cấp mapping cho từng ô được áp dụng. Giữ nguyên permission codes; không append .view/.create tự tạo |
| DT10 | LEADERSHIP; Effective permissions | Detail ghi 12 nhãn gồm phê duyệt nhập/xuất, quản trị user, ERP | D có 12 mã cụ thể không tương đương nhãn; C ghi 58/64; A B2B không chuyển được sang LEADERSHIP | detail:282–351; D; C roles:295 | P0 | AUTO-FIXABLE | Derive effective từ union role+override đã duyệt. Không ánh xạ nhãn suy đoán sang code |
| DT11 | B2B Role Scope/Row Scope/warehouse | Kho chi nhánh, 2 kho có tên, thêm kho 2/5, scope theo hàng | Snapshot cùng module chỉ có scope Theo chức năng/Toàn hệ thống; không có mapping row-scope/warehouse IDs/giới hạn 5 | b2b:233–276,442–483; D assignments | P0 | NEED CONFIRMATION | Giữ visual, chưa persist hoặc tự tạo rule mới; chốt mapping UI scope↔assignment và nguồn kho |
| DT12 | Detail management classification | Badge Quản trị cấp cao đứng cạnh status | Role thật Ban lãnh đạo; D classification=null | detail:121,186; D Account | P0 | NEED CONFIRMATION | Q03 bắt buộc classification riêng, không role; owner cấp assignment classification nếu cần hiển thị giá trị cho user |
| DT13 | SUPER_ADMIN; effective | Historical live alert luôn toàn quyền | Historical live Detail/Matrix 0; D effectiveUnresolved=true | E D20; lib/rbac.ts:178–180 | P0 | NEED CONFIRMATION | Giữ unresolved, không giả 0/64; cần evaluator/contract nguồn effective. Không kết luận mới từ lần audit này |
| ST01 | Module title + sidebar | List: Danh sách người dùng & phân quyền / Người dùng & phân quyền | B2B: Ma trận phân quyền vai trò & Phạm vi dữ liệu / Phân quyền & Vai trò | users:219–262; b2b:124,192 | P0 | AUTO-FIXABLE | Một tên module “Người dùng & Phân quyền”, hai nhãn tab nguyên IA; screen heading phụ được giữ |
| ST02 | Breadcrumb | List: Trang chủ/Hệ thống/Danh sách người dùng & phân quyền | B2B: Trang chủ/Hệ thống/Cấu hình phân quyền & Phạm vi dữ liệu; Detail không breadcrumb thật | users:210–217; b2b:158–184; detail background | P1 | AUTO-FIXABLE | Derive breadcrumb từ route metadata chung; Detail thuộc User tab |
| ST03 | Version/system context | List v3.4.2 Enterprise, Kho vận thông minh | B2B v2.4 Kho Tổng; Detail record v1.4 (Rev.1) | users:155; b2b:69; detail:170 | P1 | NEED CONFIRMATION | Chốt system metadata; record version khác system version, không ép bằng nhau |
| ST04 | Active semantics / alias | Active classes viết sẵn, `/` và `/users` cùng nội dung | Không aria-current/aria-selected; `/roles/`404; role sidebar href /users | server:6–10; A DOM | P1 | AUTO-FIXABLE | Normalize routes; sidebar một mục RBAC active trên cả hai tabs; aria-current/selected đúng |
| ST05 | Shared shell/style | Màu được override chung | 3 shell riêng, 2 kiểu topbar, zoom List/B2B 1.25 vs Detail 1; comment Matrix100% sai | server:13–23; component map | P1 | AUTO-FIXABLE | Reuse shell/theme, bảo toàn geometry approved; không redesign hoặc đổi màu Hoa Nam |
| BH01 | Dirty navigation protection | B2B có dirty badge, Save/Hủy trong document RAM | Không beforeunload/navigation guard; full reload/return link hủy document state; React retained có guard nhưng không được mount | b2b-interaction:25–28,57–61; interaction:6; React:225 | P0 | AUTO-FIXABLE | Store draft theo role ở module shell + guard all exit/back/reload; không coi Save trong RAM là server save |
| BH02 | Matrix count/state after interaction | Change/Save cập nhật checks và badge | 11/48,23%,group badge,row-scope text không derive từ committed | b2b-interaction:25–39,57; b2b literals | P0 | NEED CONFIRMATION | Chốt mapping/đơn vị DT08–09 trước khi nối counter; draft và saved labels phải phân biệt |
| BH03 | Parent checkbox Q05 | Native input có checked/indeterminate | Một số partial parent là div role=checkbox; checked true vẽ inset-square thay check; khi không có child hiện không disable custom div | b2b-interaction:29–38,47–50 | P1 | AUTO-FIXABLE | Một checkbox primitive ba trạng thái, keyboard/focus/disabled đồng nhất; không đổi tập quyền |
| BH04 | Filter/search ↔ selection | Bulk Xem chỉ leaf rows !hidden (đúng hướng Q04), state không reset bởi search | Filter theo trạng thái không recompute khi child change (sync không gọi filter); collapsed parent giữ dù query không khớp; chưa có empty row UI | b2b-interaction:43,53,55–56 | P1 | AUTO-FIXABLE | Derive displayed set một lần từ draft+search/filter/collapse; test group và bulk trên chính tập đó |
| BH05 | Unchecked vs deny | Source option ghi quyền “bị từ chối” | JS đổi thành “chưa chọn”; không có deny evaluator | b2b:293; b2b-interaction:17 | P1 | AUTO-FIXABLE | Giữ thuật ngữ không-deny ngay ở shared view; không bổ sung revoke/deny |
| BH06 | Save/Reset/Audit | Hai Save gọi cùng local commit, Undo về committed | Khôi phục mặc định về HTML initial, không role default backend; raw HTML footer tuyên bố sync IAM nhưng JS thay copy | b2b-interaction:18–28,57–59; b2b:894–918 | P1 | AUTO-FIXABLE | Reuse một save command cho cả hai vị trí; giữ copy demo, không server-success giả; reset operational vẫn cần contract |
| BH07 | Q06 delete | A B2B không có Delete role action | C/source React từng có guard; nhánh /roles trong interaction.js không được load bởi A | server:23; interaction:53–61; lib/rbac.ts:86–110 | P0 | AUTO-FIXABLE | Không thêm workflow ngoài scope; khi reuse role actions phải giữ predicate+handler assigned count >0 blocked. Không báo Q06 backend PASS chỉ vì không có nút |
| BH08 | Detail override/actions | Nội dung nói additive-only, 0 overrides | Cấp quyền/chỉnh sửa/reset/chuyển role là alert, không shared effective calculator | detail:248–356; interaction:64–68 | P1 | AUTO-FIXABLE | Preserve hierarchy/visual; nối union từ shared state cho flow đã được duyệt. Không tự dựng thêm form ở P01 |
| BH09 | User filters/pagination | Option “Chưa gán phòng ban”, “Phòng kỹ thuật & bảo hành” | Row text “Chưa có phòng ban”, “Trung tâm Kỹ thuật”; filter substring toàn row, paginator/số dòng chỉ alert | users:286–288,349,690; interaction:24–42 | P1 | AUTO-FIXABLE | Filter theo IDs/fields từ source đã duyệt; derive range/count; không synonym-map bằng suy đoán |
| BH10 | Detail identity/security | USR-00248, HN-LD02, email verified icon, IP, 2FA, password age | Không xác minh được nguồn backend/identity mapping; D không cung cấp metadata đó | detail:87,125,154–181,footer | P1 | NEED CONFIRMATION | Không dùng literal làm security truth; owner cung cấp mapping, giữ metadata không biết ở trạng thái chưa xác minh |
| RT01 | Legacy route/source | File roles.html còn có 28 users/two-pane tabs | Active `/roles` b2b.html không tabs; dormant interaction.js có branch old Matrix | server:6,23; roles.html; interaction:53 | P1 | AUTO-FIXABLE | Có một canonical active Matrix, ghi rõ legacy evidence; không nối nhầm branch cũ hoặc khôi phục 28/58 |
| RT02 | Root integration | URL cũ #rbac-prototype/tab cache | app/page.tsx không mount RBAC theo yêu cầu tách riêng | source scan app/page.tsx | P2 | AUTO-FIXABLE | Handoff URL standalone rõ ràng; không tự ghép lại WMS |

### Q02 binding conclusion

A không import `lib/rbac*`, không fetch User Master/Department Assignment/Audit/Role Assignment. List đọc literal HTML, Detail đọc literal HTML riêng, Matrix đọc literal/DOM cell states riêng. **Q01/Q02 chưa được triển khai trong active standalone**. Source D đã được owner duyệt giải quyết giá trị lịch sử DT01–07; vẫn cần dùng một logical adapter/model thay vì copy giá trị sang từng HTML. Q02 backend provenance không thể được chứng minh chỉ bằng việc UI trùng số.

### Những nội dung không bị thay đổi trong audit

Q01 shared logical dataset; Q02 mapping nguồn; Q03 management classification không role; Q04 bulk chỉ displayed/filtered; Q05 3-state; Q06 assigned users chặn delete. Giữ nguyên additive-only Custom Override, permission codes, không thêm roles/permissions/deny/revoke/reassignment. Bảng B2B chưa phải bằng chứng cho phép tạo các permission mới từ module-code × action.

## 5. SHARED-COMPONENT PLAN — nhỏ nhất, chưa triển khai

### IA bắt buộc

```text
Người dùng & Phân quyền — một module shell/sidebar active duy nhất
├── Người dùng & phân quyền — tab 01
│   ├── /users: danh sách
│   └── /detail + định danh user: modal trên cùng ngữ cảnh danh sách
└── Vai trò & ma trận quyền — tab 02
    └── /roles + định danh role: selector + ma trận B2B + Data Scope
```

### Refactor tối thiểu được đề nghị

1. **Giữ các URL hiện hành làm entry/compatibility, không tạo product module mới.** Server phục vụ một RBAC document shell cho `/`, `/users`, `/detail`, `/roles`; route parser canonicalize `/`→users và normalize trailing slash. Không dùng server string-replace để vá thêm tab riêng lẻ ở Matrix.
2. **Tách chrome một lần:** `RbacModuleShell` + `RbacModuleHeader` + `RbacModuleTabs` + `RbacSidebar`. Đây là tên thành phần đề nghị, chưa tồn tại. Giữ màu Hoa Nam và layout/typography đã duyệt; tạo header/sidebar metadata một nguồn, không copy version từ ảnh.
3. **Giữ ba view thay nội dung bên trong shell:** `UserListView`, `UserDetailDialog`, `RoleMatrixView`. Giữ matrix B2B Data Scope/Row Scope, columns, sticky toolbar/footer, search/collapse; không quay về ma trận hai pane cũ chỉ vì file cũ có tabs.
4. **Active tab derive từ route:** `/users` và `/detail` → tab01; `/roles` → tab02. Cả hai tab luôn hiện; dùng links đúng href, `aria-current` hoặc tabs pattern chuẩn, keyboard/back/forward. Sidebar luôn một item RBAC active, không đổi label khi tab đổi.
5. **Identity và shared data:** giữ user/role key trong route state; unknown key không fallback sang người khác. Một logical data adapter theo Q02, reuse/test `userView` từ B nếu thích hợp; không render literal account riêng. Chưa map B2B cells sang CMS codes khi DT08–09/11 chưa được xác nhận.
6. **Draft lifecycle không phụ thuộc view DOM:** module state keyed roleCode giữ dirty drafts và committed separately, giữ filter/collapse/scope state khi đổi tabs; guard trước rời route/document/back/reload, offer giữ/sửa tiếp/hủy rõ. Hai Save positions gọi cùng command; preserve restrictions và additive overrides. Không thêm backend persistence hay API giả.
7. **Detail không regression:** mở overlay thật trên User tab, giữ scroll/filter/page, close/Escape trả focus trigger, focus trap/aria-modal/title; deep-link trực tiếp khởi tạo User tab background đúng. Không mất Identity → Account Info → Role/Data Scope → Overrides → Effective hierarchy.
8. **Verification gate của bước sau:** direct entry và chuyển qua lại mọi route; cả hai tabs luôn hiện; entity route đúng; browser back/forward; dirty→tab→return không mất draft; close Detail giữ filter; group mixed/full/none và filtered bulk; role-user counts và effective union; Q06 blocked delete; scope/restriction mapping owner-confirmed; visual regression đúng màu/layout. Đừng sửa nghiệp vụ bị block chỉ để test PASS.

Plan này **không được triển khai trong P01**. Không cần cập nhật WMS tổng, hosting hoặc module ngoài RBAC để giải quyết IA01.

## 6. PASS GATE — PROMPT 01

| Criterion | Kết quả | Evidence |
|---|---|---|
| P01-AC01 Relevant routes identified | PASS | Route map; GET200/404, entity query mismatch browser |
| P01-AC02 Components identified | PASS | Component map chỉ rõ HTML + script đang chạy, React dormant |
| P01-AC03 Concrete root cause | PASS | users tab DOM → location.href → server b2b mapping → absent tabs → sidebar-only return |
| P01-AC04 Shared/duplicated layout identified | PASS | Shared theme/transport vs duplicated DOM chrome |
| P01-AC05 Register complete for known inconsistencies | PASS | DT01–13, ST01–05, BH01–10, RT01–02, IA01–04; lịch sử 22/28,58/64,version phân biệt active/dormant |
| P01-AC06 Every discrepancy classified | PASS | Mỗi record có AUTO-FIXABLE hoặc NEED CONFIRMATION; không dùng classification mơ hồ |
| P01-AC07 No code/business rule modified | PASS | Audit read-only; chỉ thêm báo cáo; hash source trước/sau đối chiếu ở dưới |
| P01-AC08 Q01–Q06 explicitly preserved | PASS | Mapping Q02, invariant section, plan không thay codes/rules |
| P01-AC09 Minimal shared plan documented | PASS | Section 5, không triển khai |
| P01-AC10 Report exists and contains evidence | PASS | File này; source anchors + browser/HTTP observations |

**PASS — P01. Dừng tại đây. Không tự chạy Prompt 02.** UI nghiệp vụ chưa PASS: P0 IA01 và các NEED CONFIRMATION được ghi nhận, không che bằng PASS của audit.

### Source integrity fingerprint (SHA-256)

Đường dẫn tương đối repository. Hash lấy trước và đối chiếu sau audit; mọi file sau giữ nguyên:

```text
standalone/rbac-baseline/server.mjs       2C557452098D5C49977D1E983CE1E8CC99513279229DBA197C0AD4CCAD1F70FF
standalone/rbac-baseline/interaction.js   2CAA97145007F1CAB833FC80AA8BEAE036D962994D51E08449C76A516AB856D3
standalone/rbac-baseline/b2b-interaction.js EB9D409C26C9204B26CCC4020B7C6C2B3B25F26829CDEFA2A8CCE615DFC269A8
standalone/rbac-baseline/users.html       854684E2A27235C0330AC83AC2E4D86977B74A480775582EAC80CD311F3871B4
standalone/rbac-baseline/detail.html      DA34A24CF33A2F4AE5306972F4ECB1424FAFB838611AB543F4A0B67BDA7E720D
standalone/rbac-baseline/b2b.html         9F89748D6DF25453AAA11E94E15B27A696B0104D8021E5BE8CAB8F1F50B507D2
app/page.tsx                            0D56513D66A693EF00EA34740983ACBB3D1AC4943A5E07997950D584A8A3CFF7
components/rbac-prototype.tsx            5633E0F78DC7E1ED96F208F547C1495D384BBC3C2803D26B2A2FABA0BB18892D
lib/rbac.ts                             DA5FBC1A5458219B2219F627524C7A9CF747822F45DE624574EA56F5B5ACDC90
lib/rbac-cms-snapshot.ts                 1F7818351E12E86A8EAAE5C46F52EDF3550250D50F23BD1AAC6F6D4EC82E00F7
```
