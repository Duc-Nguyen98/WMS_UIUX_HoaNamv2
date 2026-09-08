# Preview — banner Trang chủ theo ảnh tham chiếu

Ngày: 08/09/2026. Phạm vi: banner Home và giảm bóng dư trên ô tìm kiếm/card nhóm/card sản phẩm.

## Đối chiếu màu

Bốn mã người dùng gửi khớp chính xác token hiện có: Primary `#0C6286`, Primary Dark `#0C5D7D`, Support Blue `#5E93A7`, Near White `#FAFCFC`. Gradient CTA giữ nguyên `linear-gradient(135deg, #0C5D7D 0%, #0C6286 52%, #5E93A7 100%)`.

File token không thay đổi; SHA-256: `B4B94E5AA4126969F2AC03F73B368667D797EEF2716FF7355A2E01BD9376FFF8`.

## Thay đổi

- Banner dùng nền trắng; họa tiết dải cong nằm phía phải và chỉ dùng alpha/gradient đã duyệt.
- Tiêu đề lớn hơn, dòng “Làm tốt công việc.” dùng gradient headline 90° đã khóa, trải theo đúng chiều rộng dòng chữ. CTA dùng gradient chính 135°.
- Trên mobile, tiêu đề/nội dung dùng toàn chiều rộng; CTA và ảnh sản phẩm nằm ở hàng dưới. Ảnh sản phẩm giữ nguồn cũ, không chèn logo hay nội dung WMS từ ảnh tham chiếu.
- Bỏ bóng mặc định trên search, group và product cards để giảm ám xanh; giữ focus ring và bóng của CTA.
- Họa tiết chỉ trang trí, `aria-hidden`, không chặn thao tác, không thêm animation/cuộn hoặc thay đổi logic dữ liệu.

## Kiểm tra

- Audit 29 file Preview: PASS, không có literal màu/gradient ngoài source-of-truth.
- Build export: PASS.
- Mobile 320, 390, 430px: không tràn ngang; chữ và ảnh không chồng lấn. CTA 430px cao 48px.
- Nút “Khám phá sản phẩm” mở đúng Catalog; quay về Home vẫn hiển thị đúng banner.
- Ảnh: `handoff/preview-hero-refresh/home-390.png`, `home-430.png`.

Ảnh tham chiếu được dùng cho cách phối nền, kiểu chữ gradient và dải cong; đây không phải khẳng định khớp từng pixel của bitmap. Mã màu runtime tuân thủ token gốc người dùng khóa.
