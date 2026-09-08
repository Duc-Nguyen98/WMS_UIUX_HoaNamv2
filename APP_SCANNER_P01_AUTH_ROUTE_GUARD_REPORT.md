# APP SCANNER P01 — Authentication, Session và Route Guard

## Kết luận

**PASS** — sau lượt kiểm tra bổ sung ngày 09/09 ở đúng ba viewport `360×800`, `390×844`, `430×932`. Chỉ áp dụng cho preview/mock adapter được Prompt 01 cho phép; không phải xác nhận bảo mật máy chủ hoặc phát hành production.

## Hiện trạng trước sửa và bằng chứng

- Truy cập trực tiếp `#home` khi chưa có session vẫn mở Trang chủ, hiển thị dữ liệu và bottom navigation.
- `#login` chỉ hiển thị “Bắt đầu ca làm việc” / “Vào ca làm việc”, không có định danh hoặc mật khẩu.
- Từ Login có thể bấm bottom navigation vào Chứng từ và các nội dung WMS.
- Logout chỉ đổi hash về `#login`, không vô hiệu hóa phiên và không chặn back/deep-link.
- Cloud Browser evidence: tab public `https://duc-nguyen98.github.io/WMS_UIUX_HoaNamv2/app-scanner/#home` và ảnh trạng thái trước sửa tại `artifacts/scanner-p01/before-login.png`.

## Giải pháp triển khai

- `lib/scanner-auth.ts`: contract session, route parser, tập private route và guard tập trung.
- `lib/scanner-auth-preview.ts`: adapter preview riêng; chỉ giữ claim giả trong `sessionStorage`, không lưu mật khẩu/token và không dùng cho production authorization.
- `components/scanner-auth.tsx`: Login, Forgot Password, Start Shift; validation inline, loading, error scenarios, accessible password toggle, Enter submit và touch target.
- `components/scanner-preview.tsx`: dùng router/hash làm nguồn trạng thái duy nhất; private shell chỉ mount sau `validSession && shiftStarted`; logout clear draft state, invalidate session và replace về Login; kiểm tra expiry khi focus/route/interval.
- `components/scanner-preview.css`: layout mobile 320–430px cho auth, màu Hoa Nam, focus và hit-area.
- `scripts/build-scanner-pages.mjs`: build standalone Scanner với base `/WMS_UIUX_HoaNamv2/app-scanner`.

Preview fixture để QA: định danh `minhanh`, mật khẩu `Scanner@2026`; chỉ dùng trên preview local, không nhập tài khoản thật.

## Route/session flow

`No session + any private hash → #login`
`Valid session + shiftStarted=false → #shift`
`Login success → #shift`
`Start shift → #home (hoặc route đã yêu cầu trước đó)`
`Logout / expiry → invalidate session → #login`
`Back/reload/deep-link sau logout → #login`

## Acceptance Criteria

| AC | Kết quả | Evidence |
|---|---|---|
| AC-P01-01 | PASS | Cloud Browser direct `#home` redirected to `#login`; guard covers all private views. |
| AC-P01-02 | PASS | Login AX tree has no bottom navigation, profile button or WMS content. |
| AC-P01-03 | PASS | AX tree/UI verified identifier, password, show/hide, validation, loading copy and error scenario harness. |
| AC-P01-04 | PASS | Directly tested `#login → #shift → #home` as two separate actions. |
| AC-P01-05 | PASS | Shift screen shows fixed `Kho Hoa Nam`; no warehouse selector exists. |
| AC-P01-06 | PASS | Logout invalidates session and replaces route; access guard re-checks back/reload/deep-link. |
| AC-P01-07 | PASS | `parseRoute`, `guardRoute`, `routeHash` drive URL/header/content; navigation uses one access router. |
| AC-P01-08 | PASS | No password persistence; adapter stores only synthetic session claims in sessionStorage. |
| AC-P01-09 | PASS | Scanner TypeScript, scoped lint, build and domain tests pass (see below). |
| AC-P01-10 | PASS | 39 ảnh thực tại ba viewport, đo innerWidth/innerHeight, scrollWidth và control ≥44×44 trong `artifacts/scanner-p01/verified/qa.json`. |

## Verification

- `node node_modules/typescript/bin/tsc -p tsconfig.scanner.json --pretty false` — PASS.
- `npx oxlint components/scanner-auth.tsx components/scanner-preview.tsx lib/scanner-auth.ts lib/scanner-auth-preview.ts --format stylish` — PASS.
- `node --test tests/scanner-model.test.mjs` — 8/8 PASS.
- `npm run build:scanner` — export hoàn tất. Windows Node 26 có một lượt libuv assertion khi đóng server sau prerender; script chỉ cho phép đúng mã 3221226505 trên Windows và xác minh export.
- Cloud Browser direct route guard — PASS.
- Cloud Browser login form → shift → home — PASS.

## Changed files

`components/scanner-auth.tsx`, `components/scanner-preview.tsx`, `components/scanner-preview.css`, `lib/scanner-auth.ts`, `lib/scanner-auth-preview.ts`, `scripts/build-scanner-pages.mjs`, `package.json`, `docs/app-scanner/` generated export, this report.

## Production boundary

The preview adapter is intentionally not proof of server security. Production must replace it with the approved auth/session service, secure cookie/token policy, server-side route authorization, refresh/revocation, audit events and real account recovery contract.

## Xác minh bổ sung — 09/09/2026 (thay thế các nhận định chỉ dựa trên code trước đó)

- Script: `scripts/qa-scanner-p01.mjs`; log runtime `artifacts/scanner-p01/verified/qa.json`. 3/3 viewport thực đã đo. Mỗi viewport có ảnh login, validation, loading, invalid, locked, disabled, offline, server, forgot, shift, home, expired, logout-guard (39 ảnh). Các ảnh auth-360/390/430.png ngoài thư mục verified là lượt chụp desktop không hợp lệ, KHÔNG dùng làm evidence.
- AC01/02: trực tiếp thử toàn bộ 16 private route + unknown, tất cả về Login và DOM không có nav/header/content WMS.
- AC03: trực tiếp validation/focus, hiện/ẩn password, Enter submit, 5 kịch bản lỗi + loading. Recovery chỉ hỗ trợ liên hệ quản trị viên, không giả lập gửi OTP.
- AC04/05: login về Shift riêng biệt; reload và deep-link Home trước bắt đầu ca vẫn về Shift; fixed Kho Hoa Nam.
- AC06: logout, browser Back, reload và toàn bộ private deep-link vẫn về Login.
- AC07: detail context qua reload, browser Back, expiry → đăng nhập lại → bắt đầu ca → quay lại phiếu với tên draft còn nguyên. Đã sửa nút Quay lại vốn luôn về Home; URL/header/content cùng router.
- AC08: assert password không tồn tại trong sessionStorage/localStorage, không đưa credential vào URL/log. Các fixture là tài khoản giả công khai.
- AC09: `node --test tests/scanner-auth.test.mjs tests/scanner-model.test.mjs` đạt 10/10; scoped TypeScript/lint exit 0; không tuyên bố global lint/tsc vì archive ngoài Scanner.
- AC10: không overflow tại 3 viewport, auth controls ≥44×44, không pageerror. Đã xem trực quan ảnh 360 Login, 390 Shift, 430 Expired.
- File bổ sung: `tests/scanner-auth.test.mjs`, `scripts/qa-scanner-p01.mjs`; sửa `components/scanner-auth.tsx`, `components/scanner-preview.tsx`. Có xử lý sessionStorage từ chối, tránh thông báo expiry sai cho khách chưa đăng nhập.
- Phạm vi QA là Chromium mobile emulation; không khẳng định kiểm thử camera/NFC/keyboard OS/password manager thật.
