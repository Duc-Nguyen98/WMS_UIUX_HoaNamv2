# P03 — Hồ sơ, Avatar và Bảo mật tài khoản

## Kết luận

**PASS — phạm vi Scanner preview/mock**, không phải xác minh production auth/SMS/upload. P01 và P02 đã PASS trước triển khai. Không triển khai Prompt 04–05.

## Kiến trúc và screens

| Route / thành phần | Nội dung / action | Điều hướng |
|---|---|---|
| #profile | Avatar 96px + camera 44px, tên chính thức, biệt danh, role; 4 nhóm Hồ sơ / Công việc / Bảo mật / Hỗ trợ | Các màn con, logout cuối; không có nút Mở cá nhân trùng |
| #profile-edit | Họ tên, username, email readonly; biệt danh, số điện thoại; validation; lưu/hủy | Profile; dirty confirmation khi Back/footer/native Back |
| Xác minh số mới (section trong Edit) | Request challenge; code 6 số, xác minh; duplicate/error/expired/attempt limit | Chỉ save sau proof hợp lệ cùng số |
| #profile-avatar | Avatar cũ, JPG/PNG/WebP ≤2 MB; crop vuông, zoom/x/y, preview, save/retry | Sheet nguồn ảnh; hủy giữ ảnh cũ |
| Sheet nguồn avatar | Chụp ảnh / Chọn từ thư viện / Hủy | Native file input, capture=user cho camera; không gọi permission khi load |
| #profile-work | Họ tên/role/kho/scope/permission readonly, quyền post theo keys, lần đăng nhập | Back/Profile |
| #profile-security | Định danh, số login, lần đăng nhập, session policy | Đổi mật khẩu |
| #profile-password | Current/new/confirm, show/hide riêng, rule, inline errors, loading | Thành công → revoke phiên → Login với thông báo đổi mật khẩu |
| #profile-help | Accordion hướng dẫn nhập/xuất/bảo hành/NFC/ghi sổ/kho tạm dừng | Back/Profile |
| #profile-support | Hướng dẫn liên hệ quản trị viên, an toàn khi báo lỗi, version 0.1.0 | Back/Profile |
| Dirty confirmation | Browser-native confirmation rời thay đổi chưa lưu; cancel giữ form | Back/footer/hash; beforeunload warning cho reload |
| Logout confirmation | Giữ dialog P01; confirm clear draft và logout, cancel không kết thúc phiên | Login |
| Quản trị trạng thái kho | Giữ phần P02 riêng trên Profile, chỉ Super Admin | Native modal có reason/audit |

## Field / validation matrix

| Trường | Quy tắc | Thực thi |
|---|---|---|
| Tên chính thức / username / email | Readonly, không nằm trong allowlist update | UI + service chỉ nhận nickname/phone/revision |
| Nickname | Trim, 0–40 ký tự; chữ Unicode/dấu tiếng Việt/số/khoảng trắng và . _ - ’ ' | Inline + domain; không lưu HTML |
| Phone | type=tel/inputMode=tel; normalize +84 về 0, bỏ separator; regex 0 + 9 số như rule Scanner cũ | UI + service; backend cần chốt đầu số chi tiết |
| Phone đổi định danh | Challenge đúng số, TTL 120s, tối đa 5 lần, proof dùng một lần; duplicate fixture 0900000001 | Service recheck trước save; xác minh thành công không tự lưu số |
| Avatar input | MIME JPEG/PNG/WebP; size 1 byte–2MB; decode image; cap 40MP / chiều tối đa 12000px | Invalid file không thay ảnh hiện tại |
| Crop | Vuông, zoom 1–3, pan theo trục; canvas 512×512; JPEG quality .88, preview thật | Chỉ lưu data URL đã crop; ảnh cũ giữ tới save thành công |
| Password | Current required; new 12–128 chars + upper/lower/digit/symbol; khác current; confirm match | UI realtime và domain; verify current, PBKDF2 SHA256/120000 iterations + random salt trong mock |
| Revision | Optimistic revision check | Stale revision / scenario conflict từ chối, giữ draft |

Mật khẩu không đưa vào URL/log/storage dạng rõ. Hash+salt mock lưu sessionStorage; đây không phải thiết kế production credential store. Password change revoke session tab hiện tại; old password bị từ chối và new password đăng nhập được trong cùng tab. Closing tab reset fixture. Login dùng số đã xác minh mới; username/email fixture không đổi. Profile/secret synthetic storage tách store nghiệp vụ kho, không thay quyền, kho hoặc stock. Account-self-service không ghi nghiệp vụ kho; khi kho paused vẫn giữ nguyên P02 guard cho warehouse operations.

## Backend contracts / gaps

**Không có API thật** trong repo Scanner. `scanner-account-preview.ts` là mock adapter riêng; không network/SMS/upload thật. Các rule sau là thiết kế preview cần BA/backend xác nhận trước triển khai production:

1. GET /me: officialName, username/email, nickname, phone, avatarURL, revision, lastLogin từ User Master thật. Hiện dùng fixture Minh Anh; lastLogin ghi khi mock login thực sự thành công.
2. PATCH /me: allowlist nickname/phone; validate, duplicate lookup, If-Match/revision; phone login cần server-bound verification proof. Mock OTP 123456 chỉ hiện trong harness ngoài app; chưa gửi SMS. Cần rate limit request/resend, TTL/attempt policy, recovery và privacy thật.
3. Avatar: presign/upload hoặc multipart, content sniffing, decode/re-encode, antivirus/EXIF policy, size/resolution, version/retry và atomic URL replacement. Hiện file/crop thật trong browser, tiến độ upload mô phỏng vì không server. Camera mở input capture=user; desktop fallback file chooser là hành vi browser, chưa kiểm thử camera vật lý/permission OS trên iPhone/Android.
4. Password: current verification phía server, password policy chính thức, secure hash, server revoke/refresh. Session policy preview: revoke tab hiện tại sau đổi; không giả thao tác các thiết bị khác. **Đăng xuất các thiết bị khác không thêm vì thiếu endpoint/contract**, không báo hoàn tất.
5. Hỗ trợ: chưa có hotline/email/OA xác nhận; không tự chế contact, chỉ hướng dẫn liên hệ người cấp tài khoản.

## AC / evidence

Runtime script: `scripts/qa-scanner-p03.mjs`; log `artifacts/scanner-p03/verified/qa.json`. Lượt cuối chạy static export tại `http://127.0.0.1:4174/WMS_UIUX_HoaNamv2/app-scanner/`, 3/3 viewport **360×800,390×844,430×932**, 57 ảnh (19 trạng thái mỗi viewport). Ảnh full-page giữ đúng chiều rộng viewport nhưng chiều cao có thể dài hơn để thấy đầy đủ form; viewport trong log là kích thước thực thiết lập.

| AC | Kết quả | Evidence |
|---|---|---|
| AC-P03-01 | PASS | four-groups-no-duplicate-profile-action; profile screenshots |
| AC-P03-02 | PASS (preview) | camera-source-user-initiated-filechooser/capture=user; library chooser; type/size rejection; canvas crop/zoom; progress; uploaded và retry giữ ảnh cũ; hardware camera NOT VERIFIED |
| AC-P03-03 | PASS | readonly attributes và không select trong Work; service allowlist, role/scope không nhận từ profile form |
| AC-P03-04 | PASS | nickname invalid/trim; normal phone save; readonly identifiers; error/conflict preserves draft |
| AC-P03-05 | PASS (mock) | unverified save denied, duplicate phone denied, wrong code rejected, normalized verified phone saved; unit TTL/attempts/number-binding; không phải proof SMS thật |
| AC-P03-06 | PASS (mock) | required fields, wrong current, show/hide new, success relogin; old rejected/new accepted; unit weak/same/mismatch/no plaintext; session revoked |
| AC-P03-07 | PASS | Không có Mở cá nhân trên profile và profile-* |
| AC-P03-08 | PASS | dirty cancel/footer/native Back veto giữ input; beforeunload prompt implemented; loading ngăn rời qua router; cancel avatar không thay bản đã lưu |
| AC-P03-09 | PASS | P01 3 viewport + P02 24 role/state/viewport combos + cross-tab/authorized-post; kiểm tra local và static |
| AC-P03-10 | PASS | 28/28 unit tests; scoped tsc/lint exit 0; static build; không pageerror hoặc overflow tại cả 3 viewport |

## Build và kiểm thử

- `node --test tests/scanner-account.test.mjs tests/scanner-auth.test.mjs tests/scanner-policy.test.mjs tests/scanner-model.test.mjs`: 28/28.
- `node node_modules/typescript/bin/tsc -p tsconfig.scanner.json --pretty false`: exit 0.
- `npx oxlint --tsconfig tsconfig.scanner.json components/scanner-account.tsx components/scanner-auth.tsx components/scanner-preview.tsx lib/scanner-account-preview.ts lib/scanner-auth-preview.ts`: exit 0.
- `npm run build:scanner`: hoàn tất prerender/export. Có Windows Node 26 libuv assertion khi đóng prerender server như P02; đã kiểm tra artifact tĩnh trực tiếp. Không báo global lint/build của archive ngoài Scanner.
- P03 local có lượt bị HMR reload giữa upload; lượt static cuối không HMR đạt đầy đủ. Không dùng lượt chưa hoàn tất để kết luận.

## Files

Mới: `components/scanner-account.tsx`, `components/scanner-account.css`, `lib/scanner-account-preview.ts`, `tests/scanner-account.test.mjs`, `scripts/qa-scanner-p03.mjs`, báo cáo/evidence P03.

Sửa: `components/scanner-preview.tsx` (menu/profile screens/logout callback), `components/scanner-auth.tsx` (leave guard + message), `lib/scanner-auth.ts` (private routes), `lib/scanner-auth-preview.ts` (mock profile login/password), `scripts/build-scanner-pages.mjs` (isolated files), static Scanner artifact và evidence regression P01/P02. Không đổi framework, không thêm MUI vào stack React/Vite/CSS hiện hữu, không redesign WEB/customer Preview.

## Bàn giao

Chỉ sử dụng tài khoản fixture, không nhập dữ liệu thật. PASS ở đây là quality gate giao diện + local mock theo chuỗi prompt đã duyệt; production cần backend, kiểm thử bảo mật và thiết bị thật riêng. Không chạy Prompt 04.
