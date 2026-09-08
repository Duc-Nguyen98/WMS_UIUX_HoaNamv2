# P02 — RBAC và Kho tạm dừng

## Kết luận

**PASS** trong phạm vi Scanner preview, mock session và domain cục bộ. Chưa kết nối API: không khẳng định server enforcement đã triển khai. Không triển khai P03–P05.

Điều kiện: P01 đã được xác minh đủ 3 viewport và chốt PASS trước khi sửa P02. Sau P02, đã chạy lại toàn bộ P01 trên local và static export.

## Root cause và bằng chứng trước sửa

`readOnly = role === 'Chỉ xem'` chỉ khóa một số nút cuối luồng; Home/start/action route không kiểm tra quyền; hàm domain không yêu cầu actor, không có trạng thái kho. `artifacts/scanner-p02/before/readonly-create.png` và `evidence.json`: tài khoản Chỉ xem mở thành công `#create`, trường Tên phiếu hiện diện. Rà soát source cũng phát hiện media save trực tiếp và quyền NFC phụ thuộc component.

## Giải pháp

- Session chứa permission keys + roleCode. Mapping fixture riêng trong `lib/scanner-policy.ts`; UI dùng `permitted/can`, không lấy tên hiển thị role để quyết định quyền.
- Chỉ xem/action không đủ quyền: không render form tạo/sửa/scan/review/intake/nfc-bind; render locked state với lý do. CTA read vẫn hoạt động.
- `createDocument`, `postDocument`, `changeCase` yêu cầu actor hợp lệ (thiếu/expired/chưa vào ca đều từ chối) và trạng thái kho active. `authorizeCommit` bảo vệ cancellation, media/intake, gán/thu hồi NFC và mọi commit store. `save` đọc lại kho/actor ngay trước commit; `run` kiểm tra phiên và trạng thái sau độ trễ.
- `warehouseStatus` mặc định active với dữ liệu legacy. Paused chặn mọi ghi, kể cả Super Admin; chỉ đổi trạng thái quản trị được phép. Banner icon + text không phủ nội dung.
- `changeWarehouse` chỉ cho SUPER_ADMIN có warehouse.manage, confirmation=true và lý do ≥5 ký tự. Dialog native modal, Escape/cancel không ghi. Audit gồm thời điểm, người thực hiện, hành động và lý do.
- Đồng bộ localStorage giữa hai tab: nhân viên đang soạn sẽ thấy locked state và không submit; draft RAM vẫn còn, kích hoạt lại thì tiếp tục. Không giả định đã có DB realtime/multi-client concurrency production.
- Gỡ reset store khỏi harness để không có đường ghi vượt policy. Bộ chọn vai trò QA vẫn ở preview harness, không phải tính năng tự cấp quyền của app thật.

## Permission matrix (fixture P02 đã duyệt theo yêu cầu)

| Chức năng/key | Nhân viên kho | Người duyệt kho | Chỉ xem | Super Admin |
|---|---|---|---|---|
| Xem/tra cứu/truy vết/history/report: *.view, inventory.trace | Có | Có | Có | Có |
| Nhập: inbound.create, inbound.scan | Có | Không | Không | Có |
| Xuất: outbound.request.manual_create, outbound.scan | Có | Không | Không | Có |
| Hủy: inbound.cancel, outbound.cancel | Có | Có | Không | Có |
| Ghi sổ: inbound.post, outbound.post | Không | Có | Không | Có |
| Bảo hành/ảnh: warranty.manage | Có | Không | Không | Có |
| Linh kiện: warranty.component_issue | Có | Không | Không | Có |
| NFC gán/thu hồi: physical_code.assign_rfid | Có | Không | Không | Có |
| Trạng thái kho: warehouse.manage + SUPER_ADMIN | Không | Không | Không | Có |

Tái sử dụng keys trong `lib/rbac-cms-snapshot.ts`, KHÔNG import dữ liệu tài khoản CMS vào bundle. Snapshot cũ có WAREHOUSE_STAFF sở hữu post và APPROVER ngừng dùng; fixture P02 tuân theo yêu cầu mới “nhân viên không tự ghi sổ”. Backend/BA phải chốt grants thực tế trước integration. Thu hồi NFC hiện dùng cùng assign_rfid do chưa có key riêng được xác nhận. Quyền report.view được giữ nhưng không tạo màn báo cáo mới ngoài phạm vi.

## Warehouse-state matrix

| Nhóm | Active | Paused |
|---|---|---|
| Nhập/Xuất tạo, scan, gửi, hủy, ghi sổ | Theo permission | Chặn tất cả |
| Bảo hành intake/media/chuyển trạng thái | Theo warranty.manage | Chặn |
| Linh kiện | Theo warranty.component_issue; post theo outbound.post | Chặn |
| NFC gán/thu hồi/đổi trạng thái | Theo physical_code.assign_rfid | Chặn |
| Xem/search/lookup/detail/tồn/truy vết/lịch sử | Cho xem trong phạm vi preview | Giữ nguyên |
| Đổi trạng thái kho | Chỉ Super Admin, xác nhận + lý do + audit | Chỉ Super Admin được kích hoạt lại, cùng confirmation |

Không thêm adjustment/reversal mới. Domain từ chối chỉnh tồn tùy ý không qua posting.

## AC / kiểm thử

| AC | Kết quả | Evidence |
|---|---|---|
| AC-P02-01 | PASS | Home CTAs disabled; direct-create-scan-review-intake-nfc-action-denial: không có input form khi bị khóa |
| AC-P02-02 | PASS (domain mock) | 22 unit tests gồm thiếu actor, expired, viewer; direct domain + authorizeCommit đều từ chối; chưa có API thật |
| AC-P02-03 | PASS | Session permissions, permission checker dùng literal keys; test bỏ permission dù role Super Admin vẫn bị chặn |
| AC-P02-04 | PASS | 4 roles × paused × tất cả writes domain + UI; admin không được ghi nghiệp vụ khi paused |
| AC-P02-05 | PASS | Runtime lookup/docs/warranty/history/product còn truy cập; unit tests read permissions trong paused |
| AC-P02-06 | PASS | Mọi role đều test management CTA; native dialog yêu cầu lý do, domain test thiếu confirm/không Super Admin bị từ chối; audit checked |
| AC-P02-07 | PASS | Hai tab cùng origin: admin pause khi staff nhập Tên phiếu, form bị khóa; unpause giữ đúng tên draft |
| AC-P02-08 | PASS | `artifacts/scanner-p02/verified/matrix.json`: 24 tổ hợp (4×2×3), 6 kiểm thử cross-tab/post; 12 ảnh |
| AC-P02-09 | PASS | `artifacts/scanner-p01/verified/qa.json`: chạy lại 3/3 viewport Login/Shift/guards/expiry/logout; 39 ảnh |
| AC-P02-10 | PASS | Scoped TS/lint exit 0; 22/22 tests; standalone build; Chromium đúng 360×800,390×844,430×932 |

Scripts: `scripts/qa-scanner-p01.mjs`, `scripts/qa-scanner-p02.mjs`, `scripts/qa-scanner-p02-before.mjs`. Các script dùng Playwright bundled của môi trường này (đường dẫn máy cục bộ); DEV đổi import khi tái chạy ở máy khác. Truyền `SCANNER_QA_URL` để kiểm tra static mount. `scripts/serve-scanner-artifact.mjs` phục vụ static export tại 127.0.0.1:4174; không giả lập fallback về Next server.

## Build/test

`node --test tests/scanner-auth.test.mjs tests/scanner-model.test.mjs tests/scanner-policy.test.mjs`: 22/22.

`node node_modules/typescript/bin/tsc -p tsconfig.scanner.json --pretty false`: exit 0.

`npx oxlint --tsconfig tsconfig.scanner.json components/scanner-preview.tsx components/scanner-auth.tsx lib/scanner-policy.ts lib/scanner-model.ts lib/scanner-auth-preview.ts lib/scanner-auth.ts`: exit 0.

`npm run build:scanner`: export hoàn tất. Một lượt Windows Node 26 assert libuv khi đóng server sau prerender; đã kiểm tra static bundle trực tiếp. Không tuyên bố global tsc/lint vì repo có archived source ngoài Scanner.

## File thay đổi

- Policy/domain: `lib/scanner-policy.ts`, `lib/scanner-model.ts`.
- Auth/permissions: `lib/scanner-auth.ts`, `lib/scanner-auth-preview.ts`, `components/scanner-auth.tsx`.
- UI: `components/scanner-preview.tsx`, `components/scanner-preview.css`.
- Build/TS: `scripts/build-scanner-pages.mjs`, `tsconfig.scanner.json`, `tsconfig.json` (cho phép explicit .ts imports phục vụ node test; không đổi framework).
- Tests: `tests/scanner-auth.test.mjs`, `tests/scanner-policy.test.mjs`, `tests/scanner-model.test.mjs`, QA scripts và evidence.
- Hai báo cáo P01/P02; Scanner static artifact. Không sửa customer Preview hoặc màn quản lý WEB.

## Giới hạn bàn giao DEV

Client session/permissions/localStorage có thể sửa bằng DevTools: không phải security boundary. Backend phải dùng actor và warehouse state tin cậy, enforce tại transaction, lưu audit bền vững, xử lý revision/concurrency, hồi tố permission và revoke session. Đồng bộ hai tab ở đây không tương đương thiết bị thật/DB chung. Không kết nối hoặc sửa production. Không tuyên bố test camera/NFC thật, keyboard OS hoặc tương thích iOS chỉ từ Chromium emulation.
