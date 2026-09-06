# Đồng bộ SKU / Danh mục sản phẩm theo Đại lý / nơi nhận

Yêu cầu ngày 06/09/2026: đồng bộ UI/UX hai màn theo Agency đã duyệt và thêm **Xem** cạnh **Sửa** trên Danh mục sản phẩm. Baseline trước sửa: `bcbc7ca`. Đích: GitHub Pages `Duc-Nguyen98/WMS_UIUX_HoaNamv2`; không cập nhật Sites hoặc kho thật.

## Thay đổi

- Hai section dùng modifier `hn-master-list` và lớp trình bày chung `components/master-data-list.css`; không áp dụng lên Agency, Dashboard, Auth hay dialog. Giữ khung ngoài toàn chiều rộng đã chốt.
- Card radius 6px, viền #E6E4ED, heading 20px + bộ đếm tím, spacing 20/24px (lề card 16px ở 768px), table header 56px/14px và dòng tối thiểu 90px theo Agency. Nội dung dài vẫn được phép tăng chiều cao, không cắt dòng bằng chiều cao cố định.
- Giữ các tab và chức năng hiện có. SKU có hàng tiêu đề/bộ đếm và CTA như Agency; bộ lọc 768–1400px có tìm kiếm toàn hàng rồi 3 select bằng nhau. Catalog có tìm kiếm toàn hàng rồi 2 select. Không bỏ sort hoặc trường nghiệp vụ để ép hai màn giống hệt nhau.
- `MasterDataSearch` tái sử dụng Input/Button hiện có: kính lúp bấm được 44px, input chừa 48px, nút xóa bên phải khi có từ khóa. Giữ debounce và URL của từng màn, hỗ trợ thêm Enter/nút Tìm tức thì; không thay trường hoặc thuật toán tìm kiếm.
- Catalog có Xem + Sửa tại từng dòng của cả 5 loại. Xem mở detail hiện có, không mở form editable. Chế độ chỉ đọc chỉ hiển thị Xem; detail cũng không có Sửa. Không tạo API, dữ liệu hoặc quy tắc tác động mới.
- Cột action Catalog rộng 164px, Mã/Tên 272px và STT 48px; min-width 1100px (Model 1244px) để thêm Xem mà không ép mô tả quá hẹp. Sticky trái/phải giữ nhận diện và action đồng thời trên tablet. SKU giữ thêm nút ba chấm, chuẩn hóa nút này về 44×44px.
- Xem nền trắng/viền nhẹ; Sửa tím nhạt. Hover/focus/active Sửa có chữ/icon trắng trên #594FC7 theo Agency. Bảng không có cuộn dọc bên trong; mặc định 10, giữ tùy chọn 15/20/50 và URL đã chỉ rõ page size.

## Kiểm thử đã thực hiện trên bản phát triển

- Xem ở Hãng, Nhóm hàng, Mẫu sản phẩm, Nguồn điện, Quy cách đóng gói mở đúng chi tiết. Xem và Sửa Hãng/SKU là hai action riêng; đóng/Escape trả lại màn bảng. Đã đo hover/focus Sửa: trắng trên rgb(89,79,199).
- Chế độ Catalog chỉ đọc: hàng bảng chỉ có Xem, detail không có nút Sửa.
- Tìm SKU bằng nút, Catalog bằng Enter, xóa từ khóa, chọn Hãng mẫu A (24 SKU), xóa bộ lọc, SKU trang 2 STT 11–20; Catalog Hãng trang 2 STT 11–18/18.
- Đo 768/1024/1280/1440/1920px: document không tràn ngang, table container không có khoảng cuộn dọc. Tại 768px SKU cuộn ngang tới 677px và Catalog tới 397px: Mã/Tên x73–345; action SKU x498–728 và Catalog x564–728; nút cao 44px, không đè nhận diện. Header 56px, dòng thường 90px ở cả ba bảng tại desktop.
- Chi tiết Hãng ở 768px không tràn ngang. Không thay nghiệp vụ, không kiểm thử API kho thật, không coi QA giới hạn này là chứng nhận WCAG hoặc bao phủ mọi tổ hợp trạng thái.

## Kiểm tra trước xuất bản

- 23/23 unit test của SKU, Catalog và Agency đạt; TypeScript và lint các tệp TSX thay đổi đạt.
- Build và bước chuẩn bị GitHub Pages kết thúc với exit code 0. Lần build đầu gặp lỗi libuv khi thoát tiến trình trên Windows; chạy lại cùng mã nguồn thành công, không đổi dependency hoặc cấu hình.
- Kiểm tra bản tĩnh tại base path `/WMS_UIUX_HoaNamv2/`: Xem/Sửa Hãng mở đúng dialog; phân trang Hãng sang 11–18/18 và lưu URL. Ở 768px hai bảng đều có 10 dòng, nút cao 44px, không tràn ngang document hoặc cuộn dọc trong bảng. Ở 1920px ba section SKU/Catalog/Agency đều rộng 1597px, x284, header 56px và dòng thường 90px.

Giữ nguyên những điểm BA/PO chưa chốt trong các báo cáo/handoff trước (thuật ngữ, Hãng–Model, tác động đổi mã/trạng thái, điều kiện lên ứng dụng). Chỉ dữ liệu DEMO trong lượt xem; không thực hiện lưu trên hệ thống kho thật.
