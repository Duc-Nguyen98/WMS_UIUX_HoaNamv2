# RBAC_DISCREPANCY_REGISTER

## Thay đổi ưu tiên từ owner sau QA

Owner yêu cầu tạm dừng nâng cấp/tích hợp, dựng demo standalone sát ảnh trước, màu Hoa Nam đồng bộ; Matrix thay bằng RBAC_B2B.png mới nhất. Đã gỡ RBAC khỏi trang tổng, không publish. Bản độc lập ở `standalone/rbac-baseline`, không phải UI nghiệp vụ đã PASS. Các nhãn/code/count của ảnh được giữ như bằng chứng thị giác, không thay dataset CMS đã được chốt. Q01–Q06 và D20 vẫn bảo lưu cho bước nghiệp vụ sau; chưa đề xuất cải thiện trước khi owner duyệt baseline. Xem README của standalone để biết các khác biệt/hạn chế chưa được tuyên bố 100%.

Ngày khảo sát: 07/09/2026. Cập nhật sau xác nhận owner: đã triển khai ba màn trong worktree `work/rbac-uiux`, chưa xuất bản. **Chưa PASS Definition of Done: D20 SUPER_ADMIN còn BLOCKED — NEED OWNER CONFIRMATION.** Các bảng khảo sát ban đầu bên dưới được giữ làm lịch sử; mục cập nhật này có ưu tiên về trạng thái hiện tại.

## Cập nhật sau xác nhận owner và triển khai

Owner đã xác nhận: “dùng dữ liệu và catalogue quyền CMS hiện tại làm nguồn chuẩn cho các mục mâu thuẫn trên”. Q01–Q06 vẫn cao hơn live UI. Không tự chuyển sự xác nhận nguồn dữ liệu thành quyền sửa CMS thật.

- Đã đọc đủ List và Detail của 77 username duy nhất, 13 role và 64 permission codes trên CMS; không lấy token/password/IP, không đưa số điện thoại vào snapshot prototype.
- Cả 77 bản ghi đều khớp phòng ban và Last Login giữa List/Detail tại lượt đọc. Mỗi bản ghi có một role assignment được quan sát; số assignment theo từng role khớp assignedUserCount trên 13 role cards. Không suy tổng bằng dữ liệu giả.
- D01–D07, D15: nguồn đã được owner chốt. Snapshot dùng email từ Detail CMS, department/status/audit display và role/scope đã quan sát. LEADERSHIP 12 quyền, 6 users; user total 77; role total 13; catalogue giữ `warranty.pii.view`, `warranty.pii.export`, không nhập hai mã cũ chỉ có ở thiết kế.
- D08–D13/D17: đã triển khai state/interaction/naming/layout; xem `work/rbac-uiux/RBAC_QA.md` cho kết quả thực chạy.
- D14/D16: không dựng system version, 2FA, email verified, IP hoặc management classification giả. Phân loại quản lý là trường độc lập, hiện “Chưa có dữ liệu phân loại” vì CMS không cung cấp; không gán Quản trị cấp cao từ role name.
- D18: giữ ba mã scan legacy disabled, nguyên trạng selected khi đã gán; SUPER_ADMIN bị khóa thao tác như live. Không áp IAM restriction giả từ ảnh cũ đối với context Super Admin đã khảo sát.
- D19: đã fetch source và tìm revision `e09d48e` trên origin/main; worktree riêng `codex/rbac-uiux` được tạo từ revision này, giữ Bệnh / lỗi và Preview. Không ghi đè worktree gốc đang dirty.
- Quan sát `keeper01`: lượt đọc đầu bị thiếu `report.export` trong nội dung accordion trong khi count là 42; đã mở lại và chờ UI ổn định, xác minh đủ 42 mã gồm `report.export`. Đây là trạng thái đọc chưa hoàn tất, **không phải discrepancy nghiệp vụ**. Prototype tính union của 41 role permissions và 1 override.

### D20 — P0, SUPER_ADMIN: cấu hình rỗng và quyền hiệu lực

| Màn / entity | Giá trị quan sát | Nguồn bind | Xử lý hiện tại |
|---|---|---|---|
| Live Matrix, role_code `SUPER_ADMIN` | Thông báo “Vai trò hệ thống luôn có toàn quyền; không cho phép đổi mã, xóa hoặc thay ma trận quyền”, nhưng heading 0/64, các checkbox disabled/unchecked | UI live; chưa biết backend evaluator/system bypass | Giữ locked. Không đổi rỗng thành 64 mã hoặc diễn giải là không có quyền. |
| Live Detail: `super-admin-01`, `super-admin-02`, `super-admin-03`, `test-super-admin`, `admin` | “Quyền hiệu lực (0)” và “Chưa có quyền nào từ các vai trò đang gắn.” | UI live; chưa xác định nguồn effective evaluator | Prototype dùng effective=null/chờ xác minh, không hiển thị 0 hoặc 64 như kết luận. |

**BLOCKED — NEED OWNER CONFIRMATION**: Q01/Q02 không xác định semantics của quyền hệ thống vượt qua role-permission assignments. Cần owner xác nhận nguồn Effective Permissions của SUPER_ADMIN: danh mục 64 mã này hay evaluator/system wildcard riêng. Không cần mật khẩu. Chỉ cần quyết định nghiệp vụ hoặc contract/source trả kết quả quyền hiệu lực.

Đã kiểm thử guard khóa role và trạng thái chưa xác minh; điều đó không biến D20 thành PASS. Không publish bản có P0 chưa được giải quyết. Trước khi publish public cần chốt phạm vi công khai thông tin tài khoản/email từ CMS hoặc dùng bản nguồn được owner khử thông tin nhạy cảm; không tự thay bằng dữ liệu bịa.

## Phạm vi và nguồn bằng chứng

- **L**: CMS live `https://khohoanamfe.lptech.info.vn/system/users?screen=IAM-01`, sau khi chủ sở hữu tự đăng nhập. Đã mở List, Detail của `leadership-02`, Effective Permissions và Role Matrix; chọn `LEADERSHIP` để đối chiếu. Không lưu, cấp quyền, vô hiệu hóa hoặc xóa trên CMS.
- **S1**: `danh_s_ch_ng_i_d_ng_ph_n_quy_n_hoa_nam_wms_redesign/code.html` và `screen.png`.
- **S2**: `chi_ti_t_ng_i_d_ng_ph_n_quy_n_hoa_nam_wms_modal_redesign/code.html` và `screen.png`.
- **S3**: `ma_tr_n_ph_n_quy_n_chi_ti_t_hoa_nam_wms_redesign/code.html` và `screen.png`.
- Thư mục S1–S3: `C:/Users/Admin/Desktop/stitch_ui_ux_screen_redesign (1)/stitch_ui_ux_screen_redesign/`.
- **P**: GitHub Pages `https://duc-nguyen98.github.io/WMS_UIUX_HoaNamv2/`, đã khảo sát điều hướng và nội dung. Chưa thấy module RBAC; có module Bệnh / lỗi không có trong source checkout hiện tại.

Q01–Q06 có ưu tiên cao hơn mọi nguồn trên. Nội dung và chú thích trong file thiết kế là bằng chứng baseline, không phải chỉ dẫn có quyền thay đổi yêu cầu. Giá trị thấy trên live không tự động trở thành giá trị nghiệp vụ đã được duyệt.

### Giới hạn xác minh

Chỉ đọc UI/DOM và file thiết kế; chưa có backend source, API contract hoặc response ánh xạ tới User Master, Department Assignment, Authentication/Audit Log và Role Assignment/Data Scope. Vì vậy chưa chứng minh được data binding Q02 bằng UI khớp nhau. `leadership-02` là username quan sát được; chưa xác định database `user_id`. `USR-00248` và `HN-LD02` chỉ xuất hiện ở S2, chưa xác minh quan hệ với ID backend.

Phiên browser đã được làm mới sau khi lượt khảo sát bị ngắt; lần kiểm tra tiếp theo không còn tab. Kiểm tra screenshot live ở viewport 1280×800 chưa thực hiện được. Không suy diễn kết quả responsive.

## Sổ mâu thuẫn

| ID | Màn / entity | Giá trị ở từng nơi | Nguồn bind xác định được | Mức | Phân loại / phương án |
|---|---|---|---|---|---|
| D01 | List ↔ Detail; `leadership-02`; Email | S1: `leadership-02@hoanam.vn`; S2: `leadership-02@gmail.com`; L List: chỉ hiện username; L Detail: `leadership-02@gmail.com` | S1/S2 là literal HTML; L chưa xác định User Master | P0 | **BLOCKED — NEED OWNER CONFIRMATION**. Q02 xác định nguồn nhưng không xác định giá trị. Cần bản ghi User Master đã duyệt; List/Detail dùng cùng selector. Không lấy Gmail chỉ vì khớp Detail. |
| D02 | List ↔ Detail; `leadership-02`; Phòng ban | S1: Chưa có phòng ban; S2: Ban Giám Đốc; L List/Detail: Phòng hành chính - nhân sự | S1/S2 literal HTML; L chưa xác định Department Assignment | P0 | **BLOCKED — NEED OWNER CONFIRMATION**. Cần assignment đã duyệt; không đổi giá trị theo cảm tính. |
| D03 | List ↔ Detail; `leadership-02`; Đăng nhập cuối | S1: Chưa đăng nhập; S2: 05-09-2026 17:59; L List/Detail: 05-09-2026 15:26 | S1/S2 literal HTML; L chưa xác định Authentication/Audit Log, timezone | P0 | **BLOCKED — NEED OWNER CONFIRMATION**. Cần log/timestamp và timezone chuẩn; dùng một formatter và cùng nguồn. |
| D04 | List ↔ Detail; `leadership-02`; Phạm vi dữ liệu | S1: Theo chức năng; S2: Toàn hệ thống (Tất cả tổng kho & chi nhánh); L List/Detail: Theo chức năng | S1/S2 literal HTML; L chưa xác định Role Assignment + Data Scope | P0 | **BLOCKED — NEED OWNER CONFIRMATION**. Cần assignment/scope đã duyệt. Không suy phạm vi từ tên vai trò. |
| D05 | List ↔ Matrix; tổng người dùng | S1: 22; S3: 28; L không lọc: 77; L tìm Ban lãnh đạo 02: 1 kết quả | S1/S3 literal HTML; L hiện total theo kết quả lọc, chưa xác định backend total contract | P0 | **BLOCKED — NEED OWNER CONFIRMATION** cho population chuẩn. **AUTO-FIXABLE** về cơ chế: tách tổng dataset, số kết quả lọc và số dòng trang; không hardcode 22/28/77 hoặc tạo đủ dòng giả. |
| D06 | Detail ↔ Matrix; `LEADERSHIP`; quyền | S2: 12 quyền với nhãn như phê duyệt nhập/xuất, quản trị người dùng, đồng bộ ERP; S3: 58/64; L Detail và Matrix: cùng 12 mã liệt kê dưới đây | S2/S3 literal HTML; L backend binding chưa xác định | P0 | **BLOCKED — NEED OWNER CONFIRMATION**. Không chọn 12 hay 58 làm bộ quyền chuẩn, không ánh xạ nhãn S2 sang mã tự đoán. Đây là mâu thuẫn baseline và baseline/live; không phải bằng chứng live List/Detail/Matrix đang mâu thuẫn. |
| D07 | Matrix; danh mục permission bảo hành | S3: có `warranty.pl.view`, `warranty.export`; L: có `warranty.pii.view`, `warranty.pii.export`, không thấy hai mã S3 trong 64 quyền hiện trên UI | S3 literal HTML; L danh sách permission UI | P0 | **BLOCKED — NEED OWNER CONFIRMATION**. Giữ nguyên tất cả mã quan sát trong bằng chứng; cần catalogue/version chuẩn. Không thay mã, alias hoặc gộp hai cặp. |
| D08 | Matrix; parent checkbox | S3: Bảo hành 3/6 nhưng ảnh có dấu checked; Quét mã 2/5 nhưng unchecked. L nhóm Báo cáo 1/2: DOM `aria-checked="mixed"`, `data-indeterminate="true"` | S3 HTML/ảnh; L DOM input | P0 | **AUTO-FIXABLE — Q05**. 0/N unchecked; 1..N−1/N mixed; N/N checked. Live có bằng chứng partial ARIA đúng; chưa kiểm tra đủ chuỗi chuyển trạng thái. Không kết luận lỗi live từ AX Value 0 vì AX giản lược partial. |
| D09 | Matrix; Select All / tìm kiếm | S3 có Chọn tất cả / Bỏ chọn tất cả, bộ lọc và ô tìm quyền nhưng không có interaction thực thi được xác minh; L thấy chọn theo nhóm và tìm vai trò, chưa thấy tìm/lọc permission hay Select All toàn kết quả | S3 static HTML; L UI | P0 | **AUTO-FIXABLE — Q04**. Bulk action chỉ chạm tập quyền đang hiện theo filter/search và được phép sửa; giữ state ngoài tập đó. Filter/search không reset draft. Quyền restricted không bị bulk bật/tắt. |
| D10 | Matrix; xóa role có người dùng | S3 `WARRANTY_STAFF`: 3 nhân viên, có icon xóa; L `LEADERSHIP`: 6 nhân viên, nút Xóa bật; L các role khác có người dùng cũng có nút Xóa | Static/DOM; chưa kiểm tra backend guard | P0 | **AUTO-FIXABLE — Q06**: disable Xóa kèm lý do khi assigned_user_count > 0; chặn cả handler, không tự reassignment. Backend phải kiểm lại khi thực thi. Chưa thử xóa trên live, không kết luận backend cho phép xóa. |
| D11 | Detail; account status / management classification / role | S2 có Đang hoạt động, Quản trị cấp cao và Ban lãnh đạo ở các vị trí khác nhau; L có trạng thái và Ban lãnh đạo, chưa thấy classification | S2 literal HTML; nguồn classification live chưa xác định | P0 | **AUTO-FIXABLE — Q03** về schema/label: ba trường độc lập; Quản trị cấp cao không vào catalogue RBAC role. Giá trị classification gán cho user vẫn cần nguồn đã duyệt, không suy ra từ LEADERSHIP. |
| D12 | Matrix; Save / Undo / Dirty | S3 có Lưu ma trận và Cập nhật ma trận vai trò cùng lúc; thông báo không có thay đổi nhưng CTA vẫn mang kiểu enabled; có Khôi phục mặc định. L Hoàn tác/Lưu ma trận disabled khi chưa thay đổi | S3 HTML/ảnh; L UI | P0 | **AUTO-FIXABLE**. Một hành động Lưu ma trận; dirty theo diff của draft với committed, không theo filter; Undo về committed. Không thêm reset default khi chưa có rule/default dataset. Dirty/pending/error/success cần QA trên prototype, không lưu thử live. |
| D13 | Điều hướng / tiêu đề cả 3 màn | S1/S2/S3 trộn Người dùng & phân quyền, Chi tiết tài khoản & Phân quyền, Phân quyền & Vai trò, Vai trò & ma trận quyền; L tiêu đề List vẫn giữ khi mở Matrix | UI/literal HTML | P1 | **AUTO-FIXABLE**. Module: Người dùng & Phân quyền; màn: Danh sách người dùng; Chi tiết người dùng & phân quyền; Vai trò & ma trận quyền. Gắn trong Hệ thống trên prototype, không đổi module khác. |
| D14 | Shell; system/version context | S1: v3.4.2 Enterprise; S3: v2.4 Kho Tổng; L đã đọc: Hoa Nam, không thấy hai version này | Literal HTML; deployment metadata chưa cung cấp | P1 | **BLOCKED — NEED OWNER CONFIRMATION**. Không chọn version tùy ý. Cần metadata chung đã duyệt; không coi record version là system version. |
| D15 | Matrix; số role / assigned users | S1/S3: 9 vai trò nhưng S3 chỉ có 8 card; S3 LEADERSHIP 3 người, WARRANTY_STAFF 3 người; L: 13 role, LEADERSHIP 6, WARRANTY_STAFF 8 | Static HTML vs L role list; chưa có assignment dataset | P0 | **BLOCKED — NEED OWNER CONFIRMATION**. Cần dataset đầy đủ, thống nhất thời điểm và quy tắc đếm assigned users. Không nhân bản role/user hoặc suy tổng users bằng cộng role counts vì user có thể nhiều assignment. |
| D16 | Detail; identity/security metadata | S2: `USR-00248`, `HN-LD02`, điện thoại, IP, dấu email xác thực, 2FA, lần đổi mật khẩu; L không xác minh phần lớn trường này, điện thoại và record version khác S2 | S2 literal HTML; L UI, backend identity chưa biết | P1 | **BLOCKED — NEED OWNER CONFIRMATION**. Không thêm/security-claim các giá trị chưa được xác minh. Không xuất thông tin audit riêng tư lên site public từ việc được quyền khảo sát. |
| D17 | List/Matrix; horizontal clipping | Ảnh S1 cắt phía phải bảng, không thấy đầy đủ Đăng nhập cuối và Thao tác; S3 các CTA bị xuống dòng nhiều và hai pane chật | Ảnh baseline | P1 | **AUTO-FIXABLE** bố cục: giảm padding/trường trùng, giữ Data Scope riêng, action đọc được, vùng overflow có chủ đích. Chưa có kiểm thử viewport cho UI nâng cấp. |
| D18 | Matrix; restricted permissions | S3 nhóm IAM có Hạn chế; L có một số quyền IAM enabled và các mã `scan.inbound`, `scan.outbound`, `scan.warranty` disabled với giải thích ngừng hiệu lực | S3 baseline; L UI theo tài khoản Super Admin hiện tại | P0 | **BLOCKED — NEED OWNER CONFIRMATION** cho capability/restriction mapping. Không suy restriction toàn cục chỉ từ một phiên Super Admin. Cơ chế giữ disabled khi bulk là **AUTO-FIXABLE**; không tự tạo deny/revoke logic. |
| D19 | Deployment P ↔ checkout | P có Bệnh / lỗi và link `#defect-prototype`; checkout đã đọc không có component/module đó, HEAD `2e929b1`; worktree có nhiều thay đổi Preview có sẵn | Browser P và source/git đọc tại chỗ | P1 | Cần tìm đúng revision/source deployment trước khi build/publish để không làm mất module có sẵn. Không overwrite docs/public deployment từ checkout hiện tại và không đụng thay đổi Preview không liên quan. |

## Bằng chứng live E2E giới hạn — LEADERSHIP

Detail `leadership-02` có 1 vai trò Ban lãnh đạo, phạm vi Theo chức năng, Vô thời hạn, 0 Custom Overrides, 12 Effective Permissions. Matrix chọn `LEADERSHIP` cũng hiện 12/64, 6 nhân viên và cùng 12 permission checked:

```
agency.view
catalog.view
defect.view
inbound.view
inventory.trace
inventory.view
outbound.view
putaway.view
report.view
sku.view
warehouse.view
warranty.view
```

Đây là **quan sát live khớp cho một user/role**, không phải bộ dữ liệu thay thế đã được owner phê duyệt, không chứng minh backend source mapping hoặc consistency của toàn bộ users.

## Acceptance status — chưa có UI nâng cấp để nghiệm thu

PASS yêu cầu cả implementation và verification; “chưa kiểm chứng” không được tính PASS.

| Tiêu chí | Trạng thái hiện tại | Bằng chứng / phần còn thiếu |
|---|---|---|
| 1. Q01–Q06 | BLOCKED / NOT PASS | Nguồn dataset, restriction còn cần owner; chưa triển khai. |
| 2. Không inconsistency List/Detail | BLOCKED / NOT PASS | Một bản ghi live khớp ba trường; baseline vẫn mâu thuẫn, email List live không hiển thị. |
| 3. Parent 3-state | NOT VERIFIED cho deliverable | Live có mixed ARIA; chưa QA đủ unchecked → partial → checked trên UI nâng cấp. |
| 4. Select All theo filter/search | NOT VERIFIED | Chưa triển khai hoặc kiểm thử. |
| 5. Role có user không xóa được | NOT VERIFIED | UI live cho thấy nút enabled; không thực thi delete để kiểm backend. |
| 6. Naming thống nhất | FAIL baseline | D13; chưa sửa. |
| 7. Save/Undo/Dirty rõ ràng | FAIL baseline; live no-change quan sát đúng | D12; chưa test dirty/undo/save trên prototype. |
| 8. Không đổi permission code | Chưa có thay đổi; catalogue chuẩn BLOCKED | D07. Không thay cặp mã đang mâu thuẫn. |
| 9. Không thêm business logic | Chưa có thay đổi | Không tạo roles/permissions, deny/revoke/reassignment hay workflow mới. |
| 10. Không critical horizontal clipping | FAIL baseline; deliverable NOT VERIFIED | Ảnh S1; chưa QA UI nâng cấp. |
| 11. Empty/disabled/selected/partial | NOT VERIFIED đầy đủ | Quan sát live: override empty, selected role, restricted scan disabled, partial ARIA, Save/Undo no-change disabled. Chưa đủ state coverage. |
| 12. E2E User → Role → Permission không contradiction | BLOCKED / NOT PASS toàn phạm vi | Một user/role live khớp; D01–D07/D15/D18 chưa giải quyết. |

## Đề nghị owner xác nhận để tiếp tục

1. Chỉ định bộ dữ liệu chuẩn được duyệt cho prototype: User Master, Department Assignment, Auth/Audit timestamp/timezone, Role Assignments/Data Scopes, roles và permission catalogue/version, role-permission associations, assigned-user counts, restricted capabilities. Có thể owner xác nhận dùng dữ liệu CMS hiện tại cho các mục cụ thể trong sổ, nhưng việc tự đăng nhập không thay thế sự xác nhận đó.
2. Chốt giữ hai mã `warranty.pl.view`/`warranty.export` trong baseline hay dùng catalogue chứa `warranty.pii.view`/`warranty.pii.export`; không tự coi chúng là đổi tên tương đương.
3. Với site GitHub Pages public, cần bộ dữ liệu đã được duyệt để công khai hoặc nguồn đã khử thông tin nhạy cảm do owner cung cấp. Không tự bịa dữ liệu để lấp chỗ thiếu, không đưa thông tin tài khoản/audit live ra public chỉ vì được cấp quyền đọc.

Sau khi đủ bằng chứng: lập shared data layer đúng Q02; thực hiện AUTO-FIXABLE trong đúng 3 màn; giữ nguyên code/restriction/additive overrides; QA E2E và viewport; cập nhật từng tiêu chí bằng kết quả thực chạy trước khi tuyên bố hoàn thành.
