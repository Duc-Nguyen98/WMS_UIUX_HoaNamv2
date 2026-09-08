# P05 — System States, E2E Regression và Final Acceptance

## Executive summary / Kết luận

**BLOCKED — chưa đủ điều kiện kết luận PASS_FOR_UAT.**

Đã thực thi P05: kiểm tra gate, sửa regression contrast, bổ sung state offline/reconnect/storage/device, chạy luồng nhập→post→xuất, bảo hành/linh kiện/NFC và hồi quy trên 360×800, 390×844, 430×932. 28/28 unit/domain tests đạt; axe không còn violation tự động trên 63 lượt màn được quét sau sửa. Tuy nhiên chưa chứng minh toàn scope đạt WCAG AA, chưa có UAT thiết bị/API thật, điểm chuyên gia theo rubric gốc **85,7/100**, chưa đạt 90. Không tự nâng điểm hoặc gắn PASS cho phần chưa có evidence.

Đây là kết quả nghiệm thu preview, không sửa dữ liệu production. Tất cả ghi sổ/trừ tồn trong test dùng context trình duyệt riêng, fixture local. Lưu ý: không nhập thông tin thật vào adapter preview.

## Kết quả P01–P05

| Gate | Báo cáo có sẵn | Kết quả kiểm tra ở P05 |
|---|---|---|
| P01 Auth/session | PASS preview | Hồi quy 3 viewport đạt; private route, Shift, logout, draft reauth |
| P02 RBAC/kho | PASS domain mock | 24 role×state×viewport + cross-tab/post đạt; không đồng nghĩa backend authorization |
| P03 Hồ sơ/bảo mật | PASS mock | 3 viewport avatar/crop/OTP/password/dirty/profile đạt; SMS/upload thật chưa tích hợp |
| P04 Mobile | PASS emulation | 3 viewport geometry/scan/form/filters/safe simulation đạt; thiết bị OS thực chưa test |
| P05 Final | BLOCKED | Thiếu evidence AA toàn scope và readiness thực tế; điểm 85,7 <90 |

Gate trước hợp lệ để chạy P05 nhưng kết luận có giới hạn không tự động trở thành chứng nhận nghiệm thu cuối.

## P05 thay đổi gì

1. Axe trước sửa: 279 lần xuất hiện lỗi contrast qua 63 lượt (nhiều lỗi là cùng component lặp), header #5E93A7/white 3,38:1, nav #72858E/white 3,84:1, stepper 3,46:1, progress 4,1:1. Sửa text phụ các component này thành #526F7C, giữ palette primary Hoa Nam.
2. Chuyển chips container có nhãn thành fieldset; bỏ aria-label không phù hợp ở span fallback avatar. Giữ accessible name của button.
3. Thêm offline/online event và live output kết nối lại; thao tác ghi và scan kiểm tra navigator.onLine, không tự động gửi lại giao dịch khi reconnect.
4. Save localStorage hoàn tất trước khi cập nhật store UI/báo thành công; thất bại đưa thông báo có bước xử lý. Dữ liệu lỗi parse/schema không bị tự ghi đè bằng seed; cảnh báo tải lại và ngừng tạo giao dịch mới.
5. Device scenario riêng trong harness: camera permission denied → hướng dẫn + nhập mã thủ công; NFC denied/unsupported → hướng dẫn, đường về danh sách, không nút ghi ở state đó. Các trạng thái này là mock có chủ ý, không dùng để khẳng định trình duyệt đã xin quyền OS thật.
6. Button feedback 180ms, reduced-motion tắt animation/transition. Không redesign hoặc đổi nghiệp vụ.

## State coverage matrix

| State | Coverage / evidence | Result / giới hạn |
|---|---|---|
| Initial loading | Auth gate chờ kiểm tra phiên; P01 loading screenshots | PASS mock; không có API load thật |
| Skeleton list/card | `.sc-skeleton` có aria-busy/nhãn, kết thúc khi đọc local store xong | IMPLEMENTED; thời gian quá ngắn, chưa có ảnh capture riêng list skeleton; không coi là PASS evidence |
| Empty | E2E search-no-result; P02 filter; P03 no-avatar fallback | PASS các state được thử; CTA quyền theo P02 |
| Inline validation | P01/P03/P04 regression | PASS visual/logic; association toàn bộ error field chưa audit đủ |
| Server error | e2e-final/13-submit-error-keeps-draft + P03 save error | PASS mock, no actual API |
| Offline/reconnect | states/{width}-offline,reconnect; context.setOffline thật trong browser | PASS browser network simulation, giữ draft, không autosubmit |
| Retry không trùng | Submit error→normal→dblclick gửi: 1 phiếu; domain idempotency | PASS |
| Locked/disabled account | regression-p01 error-locked/error-disabled | PASS fixture |
| Session expired | regression-p01 expiry-draft-reauth-resume | PASS draft phiếu trong lần mở, không persistence sau reload |
| Permission denied | regression-p02 direct action rejection | PASS local/domain |
| Warehouse suspended | regression-p02 paused matrices + draft cross-tab | PASS same-origin mock; no server push |
| No search result | e2e-final/05-search-no-result; reset filter | PASS |
| Avatar upload loading/error/success | regression-p03 crop/progress/retry/old preserved | PASS mock upload; crop thật, no media server |
| Camera denied/unsupported | states/camera-denied + manual-fallback | PASS harness scenario; camera decoder/OS integration NOT VERIFIED |
| NFC denied/unsupported | states/nfc-denied,nfc-unsupported | PASS harness scenario; hardware NOT VERIFIED |
| Draft restored/conflict | P01 restores RAM draft after reauth; P03 conflict scenario/unit revision | PASS trong contract RAM/profile; durable outbox/conflict cho warehouse draft N/A (chưa có contract) |
| Local storage lỗi | states/storage-error, assert corrupt data vẫn còn | PASS thêm P05 |
| Reduced motion | states/reduced-motion, computed transitionDuration=0s | PASS |

Các API/server success/error/OTP/NFC write không phải giao dịch thật. Không dùng toast chung: lỗi field, session, kho, network và device có ngữ cảnh riêng.

## RBAC / warehouse-state matrix

| Role | Active | Paused | Quản trị trạng thái kho |
|---|---|---|---|
| Nhân viên kho | Tạo/scan/submit/bảo hành/linh kiện/NFC theo permission; không post | Chỉ xem/tra cứu | Không |
| Người duyệt kho | Post/cancel theo permission; không tự tạo nếu thiếu grant | Chỉ xem/tra cứu | Không |
| Chỉ xem | Không action create/edit/write; xem/history/trace | Như active | Không |
| Super Admin | Theo keys, có post và thao tác khác | Mọi write nghiệp vụ bị chặn | warehouse.manage + SUPER_ADMIN + confirm + lý do/audit |

Evidence: `regression-p02/matrix.json`, 24 tổ hợp + 6 cross-tab/post assertions; `tests/scanner-policy.test.mjs` trực tiếp gọi domain. Client claims có thể chỉnh bằng DevTools; backend bắt buộc kiểm lại actor/state trong transaction. Không được gọi đây là bảo mật production.

## Viewport/device matrix

| Môi trường | Coverage |
|---|---|
| Chromium 360×800 | E2E, states, axe, P01–P04 regression |
| Chromium 390×844 | E2E, states, axe, P01–P04 regression |
| Chromium 430×932 | E2E, states, axe, P01–P04 regression |
| Safe 34px / landscape 667×375 / height450 / scale120% | P04 simulation regression; geometry CTA.bottom≤nav.top, last content cuộn trên actions |
| iPhone Safari/VoiceOver, Android TalkBack, OS keyboard | NOT VERIFIED; cần device UAT |
| Camera scanner/NFC vật lý | NOT VERIFIED; trạng thái hỗ trợ chỉ được mô phỏng |

## Accessibility checklist

| Hạng mục | Kết quả |
|---|---|
| Automated WCAG 2A/AA + 2.1AA tags (axe-core) | 21 màn × 3 viewport =63; 0 automated violation sau fix. `a11y-before` và `a11y-final/audit.json` |
| Contrast chữ header/nav/stepper/progress | Lỗi xác nhận trước đã sửa, axe không còn báo |
| Gradient HN/TOOL | Axe yêu cầu manual review; không tự tính như đã PASS từ 0 violation |
| Button label, field label, native modal | Có trong UI và kiểm thử thao tác; không đủ thay cho toàn bộ AT audit |
| Focus validation Login/outbound/profile | Có evidence các regression; browser Back/dirty đã thử |
| Mọi lỗi liên kết field / screen reader announce | Chưa test đủ: intake/case/NFC còn thông báo tổng; cần kiểm tra target field + association khi validation thất bại |
| Dynamic states | output/alert cho network/scan/session/errors; không chỉ màu |
| Touch/text/scroll | P04 assertions đúng các target được thử, không tuyên bố mọi control ở mọi dialog |
| Reduced motion | Computed transition=0s; 180ms mặc định |
| Full WCAG AA claim | NOT VERIFIED, không chứng nhận bởi axe hoặc screenshots |

## End-to-end regression: 13 nhóm

| # | Flow | Result / evidence |
|---|---|---|
| 1 | Login→Shift→Home→logout | PASS regression-p01; e2e-final/01 |
| 2 | Private deep-link chưa phiên | PASS P01, P03 new profile routes |
| 3 | Nhập thông tin→NEW-001→review→submit | PASS 03; stock vẫn Chờ nhập cho tới post |
| 4 | Xuất recipient master→qty→NEW-001→submit | PASS 04; retry chỉ 1 doc; stock vẫn Trong kho trước post |
| 5 | Docs search/filter/detail/status/post | PASS 05 + P02/P04; PN/PX statuses/storage assertions |
| 6 | Warranty→case→tabs→Đang sửa chữa | PASS 06; domain transition kiểm quyền |
| 7 | BH-001→LK-001+BOX-001×3→submit→post | PASS 07; box20→17, linked case; paused/roles P02 |
| 8 | NFC lookup/bind/revoke | PASS 08/09, hardware simulated; one uid, status Ngừng dùng sau revoke |
| 9 | History/trace | PASS NEW-001 qty0 và docs liên quan, NFC revoke history |
| 10 | Profile/avatar/phone/password/support/logout | PASS regression-p03 mock |
| 11 | Staff/approver/viewer | PASS regression-p02 |
| 12 | Kho active/paused | PASS regression-p02 |
| 13 | Offline/server/expiry cùng draft | PASS states, submit-error retry, regression-p01 expiry |

Lượt E2E cuối không pageerror/console error mới. Mã test fixture không chia sẻ production DB. Không có live e2e backend để đối soát tồn thật.

## P0/P1/P2/P3 còn mở / quyết định cần có

Không khẳng định “0 P0/P1 toàn app” chỉ vì regression pass.

| ID | Mức | Trạng thái | Vấn đề / tiếp theo |
|---|---|---|---|
| F01 | P1 nghiệm thu | OPEN — evidence gap | Chưa đủ AA toàn scope (dialog, validation error association, gradient/manual AT). Hoàn tất manual checklist và sửa phát hiện trước chốt UAT |
| F02 | P1 integration nếu UAT vận hành thật | OPEN — thiếu integration | Auth/token/permission API/DB, SMS/upload/camera/NFC thật chưa có; cần contract và test env. Không coi mock PASS là backend PASS |
| F03 | P2 | OPEN | Skeleton card chưa có ảnh evidence riêng, logic local load quá nhanh; cần capture deterministic loading fixture |
| F04 | P2 | OPEN | Persistent warehouse draft/outbox/multi-client revision chưa có contract; chỉ RAM + localStorage |
| F05 | P2 | OPEN | Full touch/text/overlay ngoài các màn đã đo + keyboard OS trên điện thoại cần UAT |
| F06 | P3 | OPEN | Audit scripts dùng runtime path của máy và axe cài riêng work/scanner-qa-deps; cần chuẩn hóa CI/dependencies nếu muốn tái chạy liên tục |

Lỗi P1 contrast đã sửa. P0 mới: không phát hiện trong các test đã chạy; không là cam kết không tồn tại trên các nhánh chưa kiểm.

## Điểm trước/sau — cùng rubric ban đầu

Nguồn gốc: `artifacts/mobile-audit-2026-09-08/audit-data.json`, 14 dimensions trọng số bằng nhau, điểm chuyên gia không phải tỷ lệ pass. Baseline 52/100 là live app khác (appqr); hiện tại là preview mới. Giữ rubric nhưng **không suy luận production live đã tăng điểm**.

| Tiêu chí | Trước | Sau tạm thời | Căn cứ / khoản trừ |
|---|---:|---:|---|
| Information Architecture |62|92|Nhóm kho và profile rõ; inventory/screens có báo cáo |
| Navigation |42|88|Routes/Back/guards test, hạn chế state persistence |
| Visual consistency |68|90|Palette/layout shared; vài đặc thù form |
| Typography |52|90|P04 min12/14/16, contrast fix; coverage không toàn bộ dialog |
| Spacing |62|88|Geometry 3 viewport, thiếu device OS |
| Form UX |64|86|Master autofill/two steps/profile; lỗi tổng còn cần review |
| Data presentation |40|90|Fixture đồng nhất post/trace, chưa live schema |
| Search/Filter |48|85|Local query/reset đúng; không server pagination |
| Feedback & system states |58|82|Network/device/storage cải thiện; skeleton evidence chưa đủ |
| Error prevention |55|85|Idempotency/domain guards; chưa transaction backend |
| Accessibility |42|82|Automated clean nhưng manual AA chưa đủ |
| Mobile usability |56|84|3 emulation viewports, chưa hardware/OS |
| Business-flow usability |45|86|E2E mock đầy đủ nghiệp vụ chính; policy backend cần BA |
| E2E completeness |40|72|UI/domain mock đạt; hardware/backend thực chưa có |
| **Trung bình** |**52**|**85,7**|**Chưa đạt 90** |

## Acceptance P05

| AC | Kết quả |
|---|---|
| AC-P05-01 | PARTIAL — matrix có đủ hàng, thiếu skeleton evidence riêng, không dùng N/A để che thiếu |
| AC-P05-02 | PASS mock —13 nhóm theo evidence trên; không production |
| AC-P05-03 | NOT VERIFIED toàn scope AA |
| AC-P05-04 | NOT MET — còn F01/F02 verification/integration gate |
| AC-P05-05 | PASS cho regression suite P01–P04 |
| AC-P05-06 | PASS scoped tests/type/lint/static; final E2E không console error |
| AC-P05-07 | NOT MET —85,7/100 |
| AC-P05-08 | PASS — known limitations được trình bày, không gắn PASS_FOR_UAT |

## Build / file thay đổi

`node --test tests/scanner-account.test.mjs tests/scanner-auth.test.mjs tests/scanner-policy.test.mjs tests/scanner-model.test.mjs`:28/28. Scoped tsc `-p tsconfig.scanner.json --pretty false` và oxlint Scanner modules exit0. `npm run build:scanner` xuất artifact hoàn tất; Node26 Windows có libuv assertion sau prerender như các gate trước, bundle được phục vụ/test riêng tại port4174. Không tuyên bố global lint/tsc toàn repo có archive.

Code P05: `components/scanner-preview.tsx`, `components/scanner-mobile-layout.css`, `components/scanner-account.tsx`. QA mới: `scripts/qa-scanner-p05-a11y.mjs`, `scripts/qa-scanner-p05-e2e.mjs`, `scripts/qa-scanner-p05-states.mjs`. QA03/04 cho phép SCANNER_QA_OUTPUT riêng. Evidence mới nằm `artifacts/scanner-p05/` (a11y-before/a11y-final, e2e-final, states, regression-p01…p04). Chỉ publish static preview nếu cần review; không coi publication là nghiệm thu.

### Bước cần trước chốt

Hoàn thành evidence skeleton/validation-dialog AA; xác nhận UAT chỉ review mock hay vận hành tích hợp; cung cấp môi trường API/hardware và thiết bị iOS/Android để xác minh phần phụ thuộc. Chỉ cập nhật kết luận sau khi evidence mới đáp ứng 100% AC và điểm ≥90.
