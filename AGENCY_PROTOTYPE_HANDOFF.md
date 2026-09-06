# Đại lý / nơi nhận — prototype AGY-01

Nguồn yêu cầu: báo cáo `HOA_NAM_AGENCY_RECIPIENT_UIUX_AUDIT_06092026.md` do người dùng cung cấp ngày 06/09/2026, cùng quy ước Vuexy/tablet/GitHub Pages và bảng mặc định 10 dòng đã chốt.

## Phạm vi

- Thêm vào PROTOTYPE → Danh mục → Đại lý / nơi nhận, hash `#agency-prototype`.
- 26 bản ghi tổng hợp hoàn toàn DEMO, 4 loại (11 Đại lý / 5 NPP / 5 Khách công trình / 5 Khách lẻ), 21 đang dùng và 5 ngừng dùng. Không sao chép tên người, số liên hệ hay địa chỉ thật từ báo cáo lên website công khai.
- Giữ Public Sans, nền sáng/card trắng, tím ở CTA/focus. Select/dialog/table/pagination dùng primitive đã có; không đổi framework hoặc dependency.
- Gộp Mã/Tên, Thị trường/Khu vực, Liên hệ/Điện thoại để giảm số cột. STT + Mã/Tên cố định trái; Xem/Sửa cố định phải; tên/địa chỉ đầy đủ trong Xem, chạm/bàn phím đều truy cập được.
- Bảng tăng chiều cao tự nhiên, chỉ có cuộn ngang khi cần; mặc định 10, tùy chọn 15/20/50. Modal vẫn cuộn nội dung để header/footer ở trong viewport.
- Tìm kiếm Mã/Tên/Thị trường/Khu vực bằng Enter/nút Tìm; không tìm theo số điện thoại/người liên hệ. Filter → global sort → pagination; STT theo vị trí kết quả. Nhãn địa bàn là trình bày, không đổi giá trị gốc.
- URL dùng prefix `agencyQ/Type/Status/Sort/Page/Size`, giữ tham số của các prototype khác. Back/Forward theo event lịch sử một tài liệu đã có. Không đưa payload liên hệ vào URL hoặc lưu persistent.
- Xem/Thêm/Sửa session-only; loading/no-results/empty/error riêng, reset/retry; dirty guard khi đóng/hủy/Escape/chuyển lịch sử; mô phỏng lỗi lưu và xung đột có đường thử lại, không ghi đè ngầm.

## Giới hạn BA/PO phải giữ nguyên

- Mã/Loại/Trạng thái của bản ghi đã có: editable để xem trước, không áp dụng thay đổi khi chưa chốt ảnh hưởng. Không coi đây là quyết định khóa trường ở sản phẩm thật.
- Số tham chiếu là **Chưa có dữ liệu**, không tự tạo count và không hiểu là 0. Không chốt loại chứng từ/ảnh hưởng snapshot, không cascade.
- Thị trường/Khu vực vẫn nhập tự do theo form khảo sát. Không tự suy ra từ Tỉnh, không xác nhận nguồn danh mục là chính thức.
- Tỉnh/Phường A/B là dữ liệu hư cấu phục vụ thử quan hệ. Chuẩn hóa địa chỉ cũ chỉ xem trước. Sửa trường khác giữ nguyên legacy; dừng xem trước trả các trường địa chỉ về bản gốc.
- Điện thoại luôn là chuỗi có kiểm soát từ React state; không tự trim/cắt 10 ký tự/xóa số 0 đầu/áp regex khi BA chưa xác nhận. Không khẳng định rule số Việt Nam, quốc tế hoặc số bàn đã chốt.
- Mã/Tên/Loại bắt buộc; giới hạn 50/255/120/120/200/200 dựa form khảo sát. Duplicate code so sánh trim + không phân biệt hoa/thường trong DEMO; không tự đổi nội dung. Collation tiếng Việt numeric + giữ dấu chỉ là hợp đồng minh họa để DEV/BA đối chiếu.
- Không thêm Xóa, bulk, Import/Export, saved view, audit log hoặc giả lập quyền production.

## Kiểm thử và diễn giải trung thực

- 23 test logic SKU/Catalog/Agency: phân bố, lọc/sort toàn tập qua nhiều trang, URL/default 10, mã trùng/required và quan hệ địa bàn giả lập, bảo toàn phone/legacy, flags thay đổi nhạy cảm.
- Kiểm thử trình duyệt DEMO: no-op save, sửa riêng tên giữ phone/legacy, thêm với địa chỉ A1, validation + focus đầu tiên, preview đổi mã không áp dụng, cảnh báo chưa lưu và return focus.
- Công cụ đọc DOM/AX trả rỗng cho input điện thoại trong khi ảnh hiển thị và payload DEMO có số. Vì vậy không ghi nhận tiêu chí “DOM value = state” là đã kiểm chứng; cần DEV kiểm tra trực tiếp trong DevTools/test runner. Đã kiểm chứng riêng dữ liệu hiển thị sau lưu no-op/sửa tên vẫn giữ số và địa chỉ cũ. Không quy nguyên nhân của tín hiệu mâu thuẫn và không kết luận mất dữ liệu thật.
- Responsive đo 768, 900, 1024, 1280, 1440, 1920px: kiểm tra không tràn ngang document, vertical range của table container bằng 0, nhận diện/action đồng thời. Đây là viewport trình duyệt, không phải tablet vật lý hoặc chứng nhận WCAG.
- Chưa kiểm thử API thật, backend validation, hợp đồng version/usage, concurrency nhiều người dùng thật, nguồn địa giới hành chính hoặc persistence sau reload (reload cố ý khôi phục mẫu).
- Kiểm thử bản static: lỗi lưu giữ dữ liệu, xung đột DEMO → cho thử lại → thành công; Back phục hồi trang 1 và Forward trang 2. Dropdown/combobox đã thử bằng bàn phím; không coi mô phỏng xung đột là kiểm thử hai phiên thật.
- Build Windows hoàn tất với exit 0 khi chạy PTY (`tty:true`), chuẩn hóa Pages thành công. Lần chạy pipe trước đó gặp assertion libuv lúc đóng tiến trình sau prerender; không thay dependency/config để né lỗi. TypeScript và lint các file mới đạt; cảnh báo chunk lớn/Recharts SSR của project vẫn còn.

Đích duy nhất: repo `Duc-Nguyen98/WMS_UIUX_HoaNamv2`, GitHub Pages `/WMS_UIUX_HoaNamv2/`. Không xuất bản Sites cũ và không chỉnh hệ thống kho thật.
