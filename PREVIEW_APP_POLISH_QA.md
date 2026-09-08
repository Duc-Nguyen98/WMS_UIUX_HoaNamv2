# Preview — So sánh, header và Tiện ích trên app

Ngày: 08/09/2026. Phạm vi: App Preview trên điện thoại. Giữ nguyên WMS, token Hoa Nam, dữ liệu và hợp đồng gửi yêu cầu.

## Vấn đề và giải pháp

- Bảng so sánh cũ có min-width 670px và cột nhãn sticky với nền alpha, làm nội dung phía sau hiện xuyên khi vuốt ngang. Thay bằng roster model và từng nhóm tiêu chí đọc dọc. Không có cột cố định hoặc bảng tràn màn hình.
- Model, ảnh, tình trạng, nút bỏ và tư vấn riêng đặt trong cùng card. Nút tư vấn cả danh sách bám phía trên điều hướng; thêm model thứ hai/thứ ba bằng bộ chọn cùng danh mục.
- Nếu thiếu thông số/công dụng, hiển thị một thông báo ngắn trong nhóm tương ứng; không tạo dữ liệu để lấp bảng. Khi có thông số, từng giá trị gắn nhãn model rõ ràng.
- Header: HOA NAM là tên chính, “Dụng cụ & thiết bị” là dòng phụ. Giữ nút Tiện ích và Gửi yêu cầu riêng, không thêm logo.
- Tiện ích: bottom sheet có ba nhóm Xem lại, Lựa chọn & tư vấn, Hỗ trợ; bốn tile chính và hai hàng hỗ trợ. Sáu chức năng, count và active state giữ đúng dữ liệu.

## QA

- Build export và TypeScript: PASS.
- 25 kiểm tra hiện có: PASS, gồm giới hạn 3 model, cùng danh mục, route và yêu cầu nhiều sản phẩm.
- Audit 29 file màu: PASS, không thêm literal/gradient/token màu.
- So sánh 0 → 1 → 2 → 3 model; thêm qua modal, bỏ 3 → 2: PASS.
- Tư vấn hai model sau khi bỏ: Selection và Request giữ đúng DZG07-6, DZG06-6S. Không gửi form ra hệ thống ngoài.
- Mobile 320, 390, 430px: không tràn ngang. 320px có 0 bảng so sánh cũ, nút bỏ 44×44px, CTA 48px.
- Tiện ích 320px: đủ 6 lựa chọn; không tràn ngang, bottom sheet nằm trong viewport; Escape và nút đóng hoạt động.
- Header brand link về Home; Tiện ích mở So sánh đúng route; count 3/3 hiển thị đúng.

Ảnh được lưu tại `handoff/preview-app-polish/`: `header-home-390.png`, `utilities-320.png`, `utilities-390.png`, `comparison-320.png`, `comparison-390.png`, `comparison-430.png`.

Public đã cập nhật commit `789eeeb884dd3f552ed715c62e33389414afa5a5`: GitHub Pages `built`, HTTP 200 và HTML khớp export. Runtime public Tiện ích và so sánh hai model đều không có vi phạm màu/gradient hoặc tràn ngang.
