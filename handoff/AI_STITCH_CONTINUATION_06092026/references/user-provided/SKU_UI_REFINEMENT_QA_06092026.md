# SKU prototype — tinh chỉnh UI/UX ngày 06/09/2026

## Phạm vi

Website đích: https://hoa-nam-wms-vuexy-uiux.daophong98.chatgpt.site/#sku-prototype

Chỉ tinh chỉnh màn Danh mục → Danh sách SKU. Không đổi Dashboard, Đăng nhập, Quên mật khẩu, dữ liệu fixture, API hoặc quy tắc nghiệp vụ.

- Bổ sung STT theo vị trí trong kết quả lọc/sắp xếp; liên tục qua phân trang.
- Nút Xem có viền, Sửa/Điền có nền tím nhạt, menu dấu ba chấm chứa tác vụ đưa/gỡ SKU khỏi ứng dụng. Menu có mã SKU để đối chiếu trước khi thao tác.
- Select dùng ngôn ngữ hình ảnh Vuexy: nền trắng, radius 6px, bóng nhẹ, trạng thái chọn tím nhạt, focus rõ, option và nút ít nhất 44px cao.
- Bảng giảm chiều cao hàng thông thường, phân cấp mã/tên/thông tin phụ, header gọn, giữ STT/SKU/Hành động khi cuộn ngang; có hướng dẫn cuộn trên màn thu gọn.
- Mặc định 15 dòng/trang. Bộ dữ liệu vẫn có 72 SKU giả lập để kiểm thử phân trang. Giá trị số dòng được chọn rõ trong URL vẫn được tôn trọng.

## Baseline đối chiếu trực tiếp

Vuexy Vue demo-1: trang login do người dùng cung cấp, sau đó trang Forms → Select và bảng Project List tại Analytics. Select mẫu có option 15px, radius 6px, trạng thái chọn màu tím với overlay 16%, menu nền trắng và bóng 0 4px 18px.

Prototype hiện có dùng React/Base UI, không phải ứng dụng Vue/Vuetify. Lần này đồng bộ cách trình bày tại lớp SKU, không thay framework hoặc sửa các UI primitive dùng chung.

## Kết quả kiểm thử trình duyệt trên bản local đã chỉnh

| Viewport | Tràn ngang toàn trang | STT/SKU/Hành động không chồng lấn |
| --- | --- | --- |
| 768 × 1024 | 0px | Đạt, đã cuộn bảng tới cuối ngang |
| 1024 × 768 | 0px | Đạt |
| 1280 × 720 | 0px | Đạt |
| 1440 × 900 | 0px | Đạt |
| 1920 × 1080 | 0px | Đạt |

Đo sau khi layout ổn định. Bảng có cuộn ngang nội bộ ở màn hẹp; không tuyên bố mọi cột cùng hiện tại 768px.

- Fresh view: 15 dòng, STT 1–15. Trang sau: 15 dòng, STT 16–30. Tải lại khôi phục URL trang 2.
- Lọc Hãng mẫu A: 24 kết quả, trang 1 có STT 1–15 và query URL tương ứng.
- Nút Xem mở đúng DEMO-SKU-LK-001. Nút Sửa mở đúng bản ghi.
- Menu tác vụ mở không bị cắt khi bấm vào nút đang nằm trong viewport ở tablet và desktop. Escape đóng và trả focus về nút.
- Menu Đưa lên ứng dụng mở đúng màn xác nhận của SKU; Hủy trả focus về menu trigger. Không có yêu cầu gửi tới kho thật.
- Form Sửa tại 768px: không tràn ngang. Select Hãng mở trong viewport. Đổi B sang A xóa Model không hợp lệ và chỉ còn A-01/A-02.
- Hủy form đã đổi dữ liệu yêu cầu xác nhận Bỏ thay đổi.
- Bộ unit test: 8/8 đạt, gồm mặc định 15 dòng, sort toàn tập trước phân trang, URL, bộ lọc, Model theo Hãng, validation và metadata import.
- TypeScript, lint các file thay đổi, formatting và git diff check: đạt.

## Giới hạn bằng chứng

Đây là kiểm thử prototype với dữ liệu giả lập, không phải kiểm thử nghiệp vụ/API WMS thật. Các luồng xử lý xung đột, import và quy tắc đủ điều kiện publish không được thiết kế lại trong lần tinh chỉnh giao diện này.

## Đóng gói

- Build với Node 26.5.0 hoàn tất biên dịch nhưng tiến trình thoát lỗi `UV_HANDLE_CLOSING` trên Windows. Không dùng lần chạy này để xuất bản.
- Chạy lại cùng source bằng runtime Node 24.19.0 có sẵn: exit code 0. Không đổi dependencies, lockfile hoặc script dự án.
- Source commit đã push: `9dce20ed97a4491bb4136ef81e1163c035f53ffa`.
- Archive build đã xác minh có hosting metadata và Worker entrypoint. Sites lưu thành version 7.
- Deployment version 7 thành công lúc 01:22:01 ngày 06/09/2026 (UTC+7), giữ nguyên Site và audience public hiện tại.
