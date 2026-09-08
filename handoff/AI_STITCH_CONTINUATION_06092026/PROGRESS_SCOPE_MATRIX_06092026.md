# HOA NAM WMS — PROGRESS & SCOPE MATRIX

Snapshot: 06/09/2026 · commit `2e929b1`

## 1. Ma trận cấp dự án

| Hạng mục | Audit hệ thống thật | Prototype hiện tại | QA prototype | Trạng thái tiếp quản |
| --- | --- | --- | --- | --- |
| Đăng nhập | Có bằng chứng auth trong review/audit cũ | Có 4 state | Có acceptance/handoff auth cũ | Màn đã có; chỉ tinh chỉnh sau khi chủ dự án chọn |
| Quên mật khẩu | Có bằng chứng auth trong review/audit cũ | Có 4 state | Có acceptance/handoff auth cũ | Màn đã có; giữ security copy |
| Dashboard | Audit 60/100 | Đã dựng đầy đủ section/action DEMO | Đã QA + visual refresh + reconciliation refresh | Màn đã có; cần chủ dự án chọn phần tinh chỉnh tiếp |
| Danh sách SKU | Audit 63/100 | Đã dựng 72 SKU DEMO | QA triển khai + UI refinement; test logic hiện tại đạt | Màn đã có; nhiều lỗi audit đã được mô phỏng sửa |
| Danh mục sản phẩm | Audit 64/100 | Đã dựng 5 tab DEMO | Handoff table + UI sync; test logic hiện tại đạt | Màn đã có; glossary/lifecycle còn chờ BA |
| Đại lý / nơi nhận | Audit 61/100 | Đã dựng 26 bản ghi DEMO | Handoff prototype + UI sync; test logic hiện tại đạt | Màn đã có; địa bàn/phone/lifecycle còn chờ BA |
| Danh mục bệnh / lỗi | Audit 64/100 | Chưa có | Chưa có prototype QA | Audit-only; phase màn mới chưa được mở |

## 2. Thứ tự phase bắt buộc

### Phase 1 — hiện tại

Hoàn thiện và nhận nghiệm thu của chủ dự án cho các màn đã có:

1. Đăng nhập.
2. Quên mật khẩu.
3. Dashboard.
4. Danh sách SKU.
5. Danh mục sản phẩm.
6. Đại lý / nơi nhận.

Danh sách trên là inventory, không phải thứ tự tự động. Chủ dự án quyết định màn nào làm trước.

### Phase 2 — chưa được mở

- Danh mục bệnh / lỗi.
- Mọi màn khác của WMS.
- Mọi chức năng mới không có trong prototype hiện tại.

Chỉ mở khi chủ dự án xác nhận Phase 1 đã xong hoặc cho phép một màn mới cụ thể.

## 3. Trạng thái chi tiết các màn hiện có

### AUTH-01 — Đăng nhập

Đã có:

- default, validation, loading, auth failed;
- form Vuexy sáng, Public Sans, CTA tím;
- content review và acceptance về tablet/touch/autocomplete.

Không được tự thêm:

- SSO, social login, MFA, biometric, remember-device policy;
- quy tắc session/token;
- copy xác thực khác backend nếu chưa có yêu cầu.

Điểm cần chủ dự án chọn khi tinh chỉnh:

- có giữ nguyên layout split illustration hay rút gọn;
- mức bám hình thức hệ thống thật so với prototype;
- copy chính xác Email hay Email/tên đăng nhập.

### AUTH-02 — Quên mật khẩu

Đã có:

- default, validation, sending, OTP sent;
- security copy trung tính;
- layout/tablet requirement.

Không được tự thiết kế tiếp quy trình OTP/new password nếu chưa được yêu cầu.

### D01 — Dashboard

Đã có:

- header/filter/date/type;
- KPI và action detail;
- priority queue, attention panel;
- reconciliation equation/ledger;
- charts và alternate data tables;
- inventory state/type/threshold;
- warranty, label, import errors, pending SKU;
- form/modal DEMO với safe states.

QA/handoff đã ghi:

- viewport 768–1920 không tràn trong prototype được kiểm tra;
- số/count/action fixture nội bộ khớp;
- visual refresh và khối reconciliation đã xuất bản trong lịch sử;
- action không gọi production API.

Chưa được chốt:

- metric/data dictionary production;
- action contract backend, role, SLA, print, stock mutation;
- ưu tiên cuối cùng về thứ tự widget sau vòng phản hồi mới.

### MST-01 — Danh sách SKU

Đã có:

- 72 fixture, 3 pending;
- global sorting, filter, URL, pagination 10/15/20/50;
- sticky identity/action;
- Xem/Sửa/Điền/menu publish;
- Add/Edit, import preview metadata-only, readonly/error/conflict DEMO;
- UI đã đồng bộ pattern Agency.

Đã xử lý ở prototype, không nên lặp lại như lỗi hiện tại nếu chưa kiểm tra:

- sort per-page;
- URL không giữ state;
- checkbox bulk không có action;
- Model không lọc theo Hãng trong fixture;
- action mất identity khi cuộn;
- dirty guard và conflict recovery DEMO.

Chưa được chốt:

- required fields, serial, publish eligibility/unpublish impact;
- import thật, backend concurrency và production collation;
- điều kiện rời pending queue.

### MST-CAT-01 — Danh mục sản phẩm

Đã có:

- Hãng, Nhóm hàng, Mẫu sản phẩm, Nguồn điện, Quy cách đóng gói;
- 18/27/21/9/8 fixture;
- search/status/sort/page/URL;
- Xem/Sửa riêng, readonly mode;
- sticky identity/action và list pattern dùng chung;
- impact preview DEMO, không phải data contract thật.

Đã xử lý ở prototype:

- global sort và STT theo view;
- URL state;
- table responsive/sticky;
- Detail read-only cạnh Edit;
- loading state pattern rõ hơn audit production.

Chưa được chốt:

- tên màn và glossary Mẫu/Model, Nguồn điện/Công suất;
- order semantics;
- usage/lifecycle/cascade/merge/delete;
- quan hệ production giữa Brand–Model–SKU.

### AGY-01 — Đại lý / nơi nhận

Đã có:

- 26 fixture synthetic, 4 loại, 21 active/5 inactive;
- search/filter/global sort/page/URL;
- label địa bàn tiếng Việt ở UI;
- Xem/Thêm/Sửa session-only;
- legacy address preview, phone preservation test;
- error/conflict/dirty guard DEMO;
- table/list UI đồng bộ với SKU/Catalog.

Đã xử lý ở prototype:

- sort per-page;
- action mất identity khi cuộn;
- URL state;
- hiển thị code địa bàn kỹ thuật ở bề mặt;
- no-op/edit riêng không làm mất phone/legacy trong test fixture.

Chưa được chốt:

- nguồn dữ liệu địa giới và ý nghĩa Market/Area;
- phone validation;
- legacy migration/snapshot lịch sử;
- usage count, code/type/status lifecycle;
- backend/persistence/role.

## 4. Chất lượng nguồn và bằng chứng

| Loại bằng chứng | Có thể kết luận | Không thể kết luận |
| --- | --- | --- |
| Audit production | Hiện trạng đã quan sát tại thời điểm audit | Source/backend root cause hoặc production hiện tại đã sửa |
| Prototype source | UI/behavior DEMO đang có ở commit khóa | Backend production hỗ trợ giống prototype |
| Unit tests | Logic fixture/helper đã được test | API thật, thiết bị thật, WCAG/security/performance toàn hệ thống |
| Viewport QA | Không tràn và action dùng được ở state đã đo | Mọi thiết bị, mọi nội dung dài và mọi trạng thái đều đạt |
| GitHub Pages | Bản review board public có thể truy cập | Production WMS đã thay đổi |

## 5. Definition of ready cho một màn được tinh chỉnh tiếp

Trước khi AI Stitch tạo thiết kế:

- chủ dự án đã chọn đúng màn;
- current source/site đã được xem;
- audit cũ đã được phân biệt với prototype mới;
- mọi thay đổi đáng kể đã trình bày và được xác nhận;
- dữ liệu mẫu sẽ dùng DEMO;
- các câu hỏi nghiệp vụ ảnh hưởng thiết kế đã có câu trả lời hoặc phần đó được loại khỏi scope.

## 6. Definition of done cho một màn

Một màn chỉ được đánh dấu hoàn tất khi:

- có frame tablet dọc, tablet ngang/laptop thấp và desktop;
- có state cần thiết;
- có component/interaction/responsive specification;
- có copy tiếng Việt và không có dữ liệu thật;
- có acceptance criteria;
- không còn quyết định nghiệp vụ bị giả định trong thiết kế;
- owner đã xác nhận thiết kế;
- changelog nói đúng đây là thiết kế/prototype, không nói đã sửa production.

## 7. Definition of done cho Phase 1

Chỉ đóng Phase 1 khi chủ dự án xác nhận trạng thái của cả 6 màn đã có. Sau đó AI mới được hỏi:

> “Bạn có xác nhận mở Phase 2 và cho phép bắt đầu thiết kế màn mới cụ thể không?”

Nếu chưa có câu trả lời xác nhận, giữ Phase 2 ở trạng thái khóa.
