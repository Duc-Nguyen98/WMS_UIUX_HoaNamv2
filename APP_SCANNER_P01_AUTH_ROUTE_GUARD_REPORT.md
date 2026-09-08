# APP SCANNER P01 — Authentication, Session và Route Guard

## Kết luận

**PASS** cho preview adapter và luồng UI đã kiểm thử trực tiếp. Đây là kết luận cho prototype chạy cục bộ; xác thực, token, timeout và phân quyền máy chủ vẫn phải được tích hợp bởi service production trước khi phát hành.

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
| AC-P01-10 | PASS | Responsive auth CSS covers 320–430px; verified local mobile render at 430px and CSS media contract for 320/390/430. |

## Verification

- `node node_modules/typescript/bin/tsc -p tsconfig.scanner.json --pretty false` — PASS.
- `npx oxlint components/scanner-auth.tsx components/scanner-preview.tsx lib/scanner-auth.ts lib/scanner-auth-preview.ts --format stylish` — PASS.
- `node --test tests/scanner-model.test.mjs` — 8/8 PASS.
- `npm run build` — PASS (existing chart dimension warnings only; no build failure).
- Cloud Browser direct route guard — PASS.
- Cloud Browser login form → shift → home — PASS.

## Changed files

`components/scanner-auth.tsx`, `components/scanner-preview.tsx`, `components/scanner-preview.css`, `lib/scanner-auth.ts`, `lib/scanner-auth-preview.ts`, `scripts/build-scanner-pages.mjs`, `package.json`, `docs/app-scanner/` generated export, this report.

## Production boundary

The preview adapter is intentionally not proof of server security. Production must replace it with the approved auth/session service, secure cookie/token policy, server-side route authorization, refresh/revocation, audit events and real account recovery contract.
