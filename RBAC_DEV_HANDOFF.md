# Người dùng & Phân quyền — DEV handoff

## Trạng thái bàn giao

Source RBAC đã tích hợp cả checkout root (giữ thay đổi hiện có) và worktree `work/rbac-uiux` (giữ source deployment mới nhất). Không publish từ root cũ vì thiếu module Defect đã xuất bản. Worktree commit `c26e8f0` lưu implementation/QA ban đầu; không có push public. Sổ discrepancy tại `RBAC_DISCREPANCY_REGISTER.md` ở root.

## Phạm vi

Chỉ User List, User Detail & Permissions, Role & Permission Matrix. Hệ thống → Người dùng & Phân quyền. Snapshot nguồn CMS được owner duyệt trong task, 77 users/13 roles/64 codes. Không kết nối API ghi, không thay đổi CMS thật, không tự gán lại user.

## Data contract Q01/Q02

- Account/User Master → `accounts`: username quan sát làm join key prototype; DEV thay bằng user_id thật từ contract, không coi username hay ID từ ảnh là database ID.
- Department Assignment → `departments`.
- Authentication/Audit → `authAudit`. Snapshot giữ nguyên text timestamp trên CMS, không tự sửa timezone. Khi tích hợp dùng timestamp/timezone do backend chốt.
- Role Assignment + Data Scope → `assignments`. Cùng projection `userView()` cho List/Detail; không tính Data Scope từ tên role.
- Role permissions → `roles`; permission catalogue → `permissions`; additive overrides → `overrides`.

Snapshot là transcription đã đối chiếu, không phải API adapter hoặc dữ liệu live cập nhật liên tục. Không claim đã xác minh internal CMS binding vì chưa có backend source/API responses. Không thêm user/role/code để đủ số đếm.

## State contract

Role drafts được giữ theo roleCode khi chuyển role/tab và tìm/lọc. Số quyền role card là **đã lưu trong phiên**, Matrix là draft; badge Chưa lưu phân biệt. Save mở diff additions/removals và assigned users, chỉ commit vai trò đang xác nhận. Undo về committed của role đó. All restrictions được guard ở bulk và save, không chỉ disabled UI.

Parent checkbox dùng toàn bộ nhóm quyền đang hiển thị: 0/N unchecked, partial mixed, N/N checked. Khi nhóm có quyền restricted chưa chọn, chọn mọi quyền editable vẫn có thể partial; UI giải thích restricted giữ nguyên. Bulk chỉ intersection active group/search, không reset state.

Q06: delete yêu cầu assignedUserCount=0 và không còn assignment, role không locked. Guard kiểm lại lúc hành động. Backend thực tế cần kiểm tra nguyên tử để tránh race reassignment/delete; UI guard không thay thế authorization.

Account Status, Management Classification, RBAC Role độc lập. Quản trị cấp cao là classification, không role. CMS chưa có giá trị classification được đọc nên null có copy thiếu dữ liệu, không đoán.

Effective = union role permissions + overrides (deduplicate). Không thêm deny/revoke semantics. Các mã legacy đã gán vẫn giữ nguyên; disabled để không thay đổi, kèm nhãn ngừng hiệu lực quan sát trên CMS. Đây không phải xác nhận permission legacy được backend thực thi.

## Blocker cần chốt

SUPER_ADMIN live ghi luôn toàn quyền nhưng Detail/Matrix có 0 configured/effective permissions. Chưa rõ evaluator bypass hay explicit catalogue assignments. Prototype khóa toàn bộ chỉnh sửa, effective=null và hiển thị chờ xác minh, không chọn 0 hoặc 64. Xem D20 trong `../../RBAC_DISCREPANCY_REGISTER.md` và `RBAC_QA.md`.

Chỉ publish sau khi P0 được chốt và QA lại. GitHub Pages public không có auth; trước publish cần xác nhận công khai dataset chứa tên, username, email hoặc owner cung cấp dữ liệu đã khử thông tin. Không đưa phone/IP/token/log raw lên public. Preserve existing docs/preview output; không rebuild/overwrite từ checkout main cũ.
