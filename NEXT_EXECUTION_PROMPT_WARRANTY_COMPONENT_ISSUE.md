# Prompt thực thi tiếp theo — triển khai luồng xuất linh kiện bảo hành

Bạn là DEV/BA triển khai luồng đã được duyệt trong `WARRANTY_COMPONENT_ISSUE_HANDOFF.md`.

## Mục tiêu

Hoàn thiện WI-01…WI-05 trên web và App Scanner độc lập, dùng chung DB qua API; không redesign các màn khác.

## Bắt buộc

- Chỉ cho xuất khi hồ sơ ở Đang kiểm tra hoặc Đang sửa chữa.
- Có hai nhánh: mã vật lý từng linh kiện; hoặc mã hộp + số lượng.
- Có validation trùng mã, SKU không khớp, hộp không khớp, số lượng <= 0/vượt khả dụng, hồ sơ không đúng trạng thái, thiếu kho.
- Có confirmation dialog trước hành động tạo yêu cầu thật.
- Chỉ báo thành công sau acknowledgement thật; timeout/offline là Chờ đồng bộ.
- Idempotency cho mọi lần submit; retry không nhân đôi phiếu.
- Web không giữ source of truth cục bộ; sau khi Scanner ghi, web refresh từ API/DB.
- Giữ câu chữ hướng khách hàng/vận hành, tiếng Việt; không chèn giải thích nội bộ vào UI.
- Không thực hiện test trên production, không xóa/huỷ/Post dữ liệu thật khi chưa có tài khoản sandbox và phê duyệt.

## Deliverables

1. UI WI-01…WI-05 trên web.
2. Scanner flow tương ứng: chọn hồ sơ, scan item/box, nhập quantity, review, confirm, result, retry.
3. API contract + migration/DB mapping (nếu cần) được BA duyệt.
4. Permission matrix và audit event.
5. Unit/integration/E2E tests cho pass, duplicate, mismatch, unavailable, offline, timeout, retry/idempotency.
6. Screenshot evidence từng màn và cập nhật Screen/Function Inventory, E2E Matrix.
7. Ghi chú các phần chưa có API/OA/quyền thật; không xác nhận giả.

## Acceptance criteria

- Hồ sơ ngoài hai trạng thái không nhìn thấy CTA hoặc CTA bị khóa có lý do.
- Item có mã: scan 2 mã khác nhau → 2 dòng hợp lệ; scan lặp → không tăng số lượng.
- Item không mã: scan box → nhập 0/âm/chữ/vượt khả dụng → lỗi tại trường; số hợp lệ → review đúng.
- Mismatch SKU/warehouse/case → chặn trước submit.
- Confirm hiển thị hồ sơ, kho, SKU, mã/hộp, số lượng và người thao tác.
- Response thành công có request/document number; timeout hiển thị chờ đồng bộ và cho retry an toàn.
- Web thấy trạng thái/phiếu mới sau refresh từ API; Scanner và web không phụ thuộc cùng một local state.
- Không có thao tác irreversible nào trong test tự động production.
