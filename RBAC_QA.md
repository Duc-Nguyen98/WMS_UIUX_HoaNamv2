# RBAC QA — 07/09/2026

Trạng thái: **PARTIAL PASS — NOT DONE**. Chưa xuất bản GitHub Pages. SUPER_ADMIN còn mâu thuẫn P0 D20, không tự chọn 0/64/toàn quyền.

## Kết quả cuối lượt

- Build worktree cuối cùng PASS với Node bundled v24.19.0; Node v26 có một lần assertion libuv lúc thoát sau prerender, không bỏ qua lỗi: đã chạy lại thành công với runtime bundled.
- Đã sao chép phần RBAC vào checkout root bằng patch, thêm import/navigation/render hẹp trong app/page.tsx và giữ thay đổi Preview sẵn có. Không merge/cherry-pick lên dirty root: Git đã từ chối trước khi áp dụng; sau đó chỉ áp patch RBAC.
- Root `node --test tests/rbac.test.mjs`: 11/11 PASS; root `npm run build`: PASS, exit 0.
- Root `tsc` chưa PASS toàn repo vì include cả các thư mục work/ với alias trỏ về root (các lỗi Preview/Defect của bản sao build/worktree); không sửa cấu hình ngoài scope. Typecheck chạy trong worktree RBAC độc lập PASS.
- Bản QA browser đầy đủ là worktree tại localhost:5175. Bản root tại localhost:5176 có RBAC cùng source, nhưng không dùng để publish vì root còn revision cũ của module khác.

## Implementation

Source: `codex/rbac-uiux`, dựa trên origin/main `e09d48e`, không sửa checkout gốc và không thay Preview/Bệnh-lỗi.

Ba màn: `components/rbac-prototype.tsx`; CSS giới hạn `.rb-*`; data/logic: `lib/rbac-cms-snapshot.ts`, `lib/rbac.ts`. Điểm vào: Hệ thống → Người dùng & Phân quyền, `#rbac-prototype`.

## Automated verification

`node --test tests/rbac.test.mjs`: **11/11 PASS**. Bao gồm exhaustive 0..N trạng thái checkbox trên tất cả nhóm; tích filter/search/bulk cho mọi role, hidden/restricted preservation; Q06 UI predicate + command guard và stale zero count; additive union; immutable save; 77 account projections; 13 assignment counts; 64 unique unchanged CMS codes. Test-only mutation không thêm role/code vào dataset app.

`npx tsc --noEmit --incremental false --pretty false`: PASS.

Production `npm run build`: PASS trước sửa CSS checkbox, sau đó chạy lại để kiểm cuối. Cảnh báo kích thước bundle và chart sizing thuộc shell/dashboard sẵn có; không tự redesign module ngoài phạm vi.

## Browser checks — localhost:5175

| Check | Kết quả |
|---|---|
| List search leadership-02 → Detail | PASS: email, department, last login, role/scope khớp; 12 effective permissions ban đầu |
| Detail → Xem ma trận | PASS: chọn LEADERSHIP |
| Save disabled khi sạch | PASS |
| Xóa LEADERSHIP có 6 users | PASS disabled; không xóa thật |
| Group Báo cáo partial → checked → unchecked → Undo | PASS: aria-checked mixed → true → false → mixed |
| Search report.export → Select All | PASS sau xóa search qua nút X: 12 quyền cũ giữ nguyên, thêm duy nhất report.export |
| Group Báo cáo + search report.export → Bỏ chọn tất cả | PASS report.view ngoài search giữ checked |
| Search không khớp | PASS empty, draft được giữ |
| Search scan. → Select All | PASS chỉ hai mã editable thay đổi, scan.inbound/outbound/warranty vẫn restricted |
| Đổi role rồi quay lại | PASS draft LEADERSHIP giữ nguyên |
| Lưu có confirmation/diff | PASS hiển thị +report.export, 6 assigned users; Save xong role card 13 quyền, clean |
| Save → user list → Detail | PASS report.export xuất hiện trong effective permissions |
| Empty user search | PASS |
| Pagination | PASS 11–20/77, trang 2/8 |
| Existing keeper01 overrides | PASS 41 role + report.export = 42 effective |
| Add agency.view cho keeper01 trong phiên thiết kế | PASS 43 effective, report.export giữ nguyên |
| Empty role search | PASS |
| SUPER_ADMIN | PASS locked/unresolved UI; không có checkbox grant giả; nghiệp vụ **BLOCKED** |

Một lần script dùng `fill('')` chưa làm UI bỏ filter và đã đọc khi vẫn chỉ có 1 kết quả; không tính false result đó là product failure. Đã xác minh search còn giá trị report.export, dùng nút X của UI, kiểm lại đủ 13 checked. Một số click timeout do browser; đều đọc trạng thái trước khi thử lại, không double-commit.

## Responsive/layout checks

| Viewport width | Document scrollWidth | Matrix clientWidth/scrollWidth | Detail horizontal overflow |
|---|---:|---:|---|
| 1440 | 1425 | 855/855 | Không, width/scrollWidth 900/900 |
| 1280 | 1265 | 695/695 | Không, 900/900 |
| 1024 | 1009 | 729/729 | Không, 900/900 |
| 768 | 753 | 473/473 | Không, 736/736 |

Ở 768px, bảng rộng 960 trong vùng cuộn 703px `overflow-x:auto`; action sticky nằm trong viewport (right=728px). Đây là cuộn có chủ đích, không clipping không thể truy cập. Modal giữ body scroll dọc; Matrix hai pane từ 768px; không sửa shell ngoài RBAC.

QA phát hiện Base UI checkbox dùng span bị dính `.rb-group-header>span {margin-left:auto}`; đã sửa riêng checkbox. Kiểm lại left group=570, checkbox=585, đúng padding 15px. Screenshot công cụ trả hơi mờ; kết luận hình học dựa cả DOM bounding boxes, không khẳng định pixel-perfect từ ảnh mờ.

## Acceptance / Definition of Done

1. Q01–Q06: PASS mechanics của prototype, nhưng overall BLOCKED D20 và backend binding chưa tích hợp.
2. List/Detail consistency: PASS shared projection + audited 77 records.
3. 3-state group: PASS unit + browser.
4. Select All filter/search: PASS unit + browser.
5. Assigned role cannot delete: PASS local UI/handler; backend thật chưa test destructive.
6. Naming thống nhất 3 màn: PASS.
7. Save/Undo/Dirty: PASS local synchronous session; không giả server persistence.
8. Permission codes: PASS 64 mã từ CMS được owner duyệt; không rename/alias.
9. Không thêm business logic: PASS; không role/deny/reassignment/reset-default/workflow ngoài phạm vi.
10. Critical clipping: PASS tại 4 widths đã kiểm, bảng có overflow region chủ đích.
11. Empty/disabled/selected/partial: PASS các case ghi trên.
12. E2E no contradiction: PASS cho 72 users non-SUPER_ADMIN trong model; **BLOCKED** cho 5 SUPER_ADMIN.

Không được trình bày 11 unit tests PASS thành PASS toàn bộ P0. Không được công bố hoàn thành hoặc đã cập nhật URL public.
