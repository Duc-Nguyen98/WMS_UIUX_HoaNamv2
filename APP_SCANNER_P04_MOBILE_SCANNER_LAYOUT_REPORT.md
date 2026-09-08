# P04 — Mobile Layout, Scanner và Form Xuất kho

## Kết luận

**PASS trong phạm vi preview / Chromium mobile emulation**. Không phải xác nhận camera, bàn phím OS, iOS safe area hoặc haptic trên thiết bị thật. Không chạy Prompt 05. P01–P03 đã PASS trước sửa; giữ framework React/Vite hiện hữu, không thêm hoặc thay MUI.

## Nguyên nhân và giải pháp

Navigation trước đây có phần notch nhô lên 36px nhưng padding cuối chỉ 26px; sticky action có bottom:112px độc lập với navigation thực; error cũng sticky riêng. Chữ 6–11px và header button 42px/36px. Form Xuất kho nhập tay toàn bộ và báo lỗi tổng quát.

- `useScannerMobileLayout`: ResizeObserver đo navigation/CTA, ghi CSS variables dùng chung. requestAnimationFrame tránh vòng ResizeObserver. Chỉ một action region; error trả về normal flow.
- `--mobile-bottom-reserved-space = navHeight + actionHeight + 20px`; content padding cộng safe bottom. Nav fixed và CTA fixed ngay trên nav; chiều rộng/vị trí bám khung điện thoại, không tràn ngoài harness. Nội dung và harness cuộn được qua action; không hardcode 96px cho từng màn.
- Nút HN giữ giữa, hạ thành orb 44px trong thanh; bỏ SVG notch/elevation lớn. Active giữ icon/label + marker và aria-current. Header nút 48px, title 18px; metadata ≥12px, nội dung đoạn văn ≥14px, control nhập liệu 16px.
- visualViewport resize nhận biết keyboard khi đang focus input/textarea/select: ẩn nav, CTA bám phần viewport còn thấy. Landscape thấp dùng header normal flow. Safe inset lấy env; token có thể override trong test.
- Filter docs/warranty/NFC: chips ≥44px, scroll snap, scrollbar ẩn, fade nhẹ; thêm Xóa bộ lọc và số trạng thái đang áp dụng. Không đổi các tab nội dung bảo hành thành filter dữ liệu.
- Scanner: reticle 150px xuống 112px, margin giảm; khung tổng từ 337.39px xuống ~263.8px (~21.8%). Count mã/cái luôn có trong action; danh sách có đủ reserved space.
- Thành công có output trực quan; rung 25ms/âm nhẹ 70ms chỉ khi bật riêng trong harness; fallback im lặng nếu browser từ chối. Không khẳng định haptic/sound thật đã thử.
- Mã trùng được chặn cả validate và functional state update, không cộng hai lần. Offline báo chưa xác minh mã và giữ draft. Giữ các thông điệp sai loại/không tồn tại/reserved/P02 không quyền/kho paused.
- Xuất kho tách hai bước Người nhận & giao hàng / Số lượng, ghi chú & xác nhận. Search dialog lọc theo nhóm; chọn người nhận tự điền phone/address từ `createAgencyFixtures` dùng chung WEB. Manual edit chỉ khi có outbound.request.manual_create. Inline error và focus trường lỗi đầu tiên; số nguyên 1–99.999, min/max, tel/numeric.
- Cảnh báo rời draft ngay cả mới nhập tên (không cần đã có mã), tạo phiếu mới yêu cầu xác nhận bỏ phiếu cũ. Beforeunload cảnh báo reload khi draft; giữ draft trong RAM như P01, không giả định lưu bền qua đóng tab. Rời review về Home dùng router nên hash đồng bộ.

## Viewport / evidence

| Kích thước | Form hai bước | Scanner / overlay | Filter | Text + safe/keyboard mô phỏng | Kết quả |
|---|---|---|---|---|---|
| 360×800 | Đạt | Đạt | Đạt | Đạt | PASS |
| 390×844 | Đạt | Đạt | Đạt | Đạt | PASS |
| 430×932 | Đạt | Đạt | Đạt | Đạt | PASS |
| 667×375 landscape | Không overflow tại scan; header không sticky | CTA trên nav | Không đổi | Chiều cao nhỏ | PASS emulation |
| Portrait height 450 | Input/CTA vẫn truy cập trong viewport thu nhỏ | Không overlap | — | Giả lập vùng còn lại khi keyboard | PASS simulation |

Trước: `artifacts/scanner-p04/before/metrics.json` + `{width}-scan.png`, `{width}-outbound.png`.
Sau: `artifacts/scanner-p04/verified/qa.json`, ảnh `{width}-outbound-recipient`, `outbound-quantity`, `scan-after`, `scan-duplicate`, `scan-offline`, `scan-wrong-type`, `scan-reserved`, `docs-filters`, `warranty-filters`, `nfc-filters`, `safe-area`, `keyboard-resize`, `landscape`, `enlarged-text`.
Ảnh full-page có chiều rộng đúng viewport, chiều cao có thể dài hơn để thấy form; vị trí sticky trong full-page không đại diện toàn bộ trạng thái cuộn. Dùng geometry log làm evidence overlay.

## Overlay / safe area test

Script `qa-scanner-p04.mjs` kiểm tra trực tiếp:

1. CTA.bottom ≤ nav.top (sai số 1px), padding reserved ≥ nav+CTA.
2. Phần tử nội dung cuối đã cuộn có bottom ≤ action/nav.top; không chỉ so chiều cao padding.
3. scrollWidth ≤ innerWidth ở cả ba portrait, landscape 667×375, viewport thu nhỏ, nội dung tăng font 120%.
4. Safe bottom giả lập 34px bằng token; nav được đo lại, nội dung vẫn cuộn trên CTA.
5. Các nút visible trong scan ≥44×44; text node visible trong phone ≥12px. Body/paragraph có CSS min 14px, input 16px. Chưa có pixel audit mọi node ở mọi trạng thái app.

Không có thiết bị vật lý: keyboard focus/resize visualViewport, font scaling và safe area iPhone thực tế vẫn phải UAT trên iOS/Android. Không dùng ảnh desktop đổi tên để chứng minh viewport.

## Scanner-state / route tests

| Trạng thái | Evidence |
|---|---|
| Thành công MAY-001 | output Đã thêm; 1 mã/1 cái; list count=1 |
| Quét lại MAY-001 | Mã đã có; count không tăng |
| UNKNOWN | Không tìm thấy mã |
| MAY-002 trong xuất linh kiện | Máy, không phải linh kiện |
| NEW-002 trong nhập kho | Mã đang thuộc phiếu chờ duyệt |
| Offline | Chưa xác minh được mã, giữ nội dung |
| Chỉ xem / paused | P02 action guard không render form; domain từ chối ghi |
| Review → cảnh báo rời → Home | hash #home; Tiếp tục quét về #scan còn 1 dòng |
| Reload/Back/private | P01 regression, profile dirty giữ nguyên qua P03 |

## AC

| AC | Kết quả | Căn cứ |
|---|---|---|
| AC-P04-01 | PASS preview | Shared geometry + final element scroll + CTA/nav boundary trên form/scan/list/detail trong QA |
| AC-P04-02 | PASS simulation | Safe token 34px, viewport thu nhỏ và landscape; thiết bị/keyboard OS NOT VERIFIED |
| AC-P04-03 | PASS | Metadata min12, body14, input16; scan text measurements + CSS token |
| AC-P04-04 | PASS | Header48/CTA48/chips44; scan visible buttons đo ≥44×44 |
| AC-P04-05 | PASS | scrollbar-width:none, webkit hidden, snap, reset trong docs/warranty/NFC |
| AC-P04-06 | PASS | Camera giảm ~22%, count trong action, list cuộn trên CTA |
| AC-P04-07 | PASS mock | Trạng thái mã thực test; P02 permission/state; haptic/sound opt-in, hardware không xác minh |
| AC-P04-08 | PASS mock | Master fixtures dùng chung, auto-fill, 2 bước, inline validation/focus, tel/numeric; không API WEB thật |
| AC-P04-09 | PASS | Cảnh báo không xóa draft; hash review→home→scan; P01/P03 regression |
| AC-P04-10 | PASS | 28/28 unit/domain; scoped tsc/lint; P01–P03 regression và static build |

## Build / regression

- `node --test tests/scanner-account.test.mjs tests/scanner-auth.test.mjs tests/scanner-policy.test.mjs tests/scanner-model.test.mjs`: 28/28.
- `node node_modules/typescript/bin/tsc -p tsconfig.scanner.json --pretty false`: exit0.
- `npx oxlint --tsconfig tsconfig.scanner.json components/scanner-outbound.tsx components/scanner-mobile-layout.tsx components/scanner-preview.tsx`: exit0.
- `npm run build:scanner`: static export hoàn tất; Windows Node26 có libuv assertion khi đóng prerender như P03, artifact kiểm thử trực tiếp.
- Final P04 dùng `SCANNER_QA_URL=http://127.0.0.1:4174/WMS_UIUX_HoaNamv2/app-scanner/`, 3/3 viewport.
- P01 final hồi quy: `artifacts/scanner-p04/regression-p01/qa.json` (3 viewport, riêng để tránh file locking khi ghi đè ảnh cũ).
- P02/P03: script hồi quy ở static mount, logs trong `artifacts/scanner-p04/regression-p02/matrix.json`, `artifacts/scanner-p03/verified/qa.json`. Không dùng các lượt bị HMR/rebuild/file-lock gián đoạn để kết luận. P02 dùng output riêng vì file matrix cũ bị khóa khi ghi.

## File thay đổi và integration gaps

Mới: `components/scanner-mobile-layout.tsx/.css`, `components/scanner-outbound.tsx`, `scripts/qa-scanner-p04-before.mjs`, `scripts/qa-scanner-p04.mjs`, báo cáo và evidence.
Sửa: `components/scanner-preview.tsx/.css`, `scripts/build-scanner-pages.mjs` (copy dependency riêng), `scripts/qa-scanner-p01.mjs` (output override), Scanner static artifact. Không đổi master fixture/WEB/Customer Preview, API hoặc domain nghiệp vụ kho.

Danh mục người nhận là fixture WEB có cả bản thiếu phone: không tự chế phone; validation yêu cầu bổ sung nếu có quyền. Backend cần cung cấp searchable master endpoint, quyền sửa delivery snapshot, data rule min/max (99.999 hiện là giới hạn UX preview), concurrency và persistence draft thật. Tìm kiếm lọc fixture cục bộ, không phải request API. Quét camera vẫn là UI như baseline; chưa có decoder/hardware API. Không tuyên bố production readiness từ PASS preview.
