# Preview — sửa lỗi header/tìm kiếm khi cuộn

Ngày: 08/09/2026. Bản trước thay đổi: `c97a316`.

## Nguyên nhân đã tái hiện

Header thường trôi khỏi viewport, trong khi search ở trong main dùng sticky độc lập. Vùng sticky bị giới hạn theo chiều rộng main và có margin âm/padding, khiến nội dung phía sau hiện qua khoảng hở. Ảnh user được chụp trong trình duyệt Android có thanh tiêu đề riêng của trình duyệt; thanh đen đó không phải header của app.

Trước sửa: ở scrollY 1688px, header.top = -1688px; search.top = 0 và form.top = 8px. Header công ty mất khỏi màn hình và search nổi một mình trên danh sách.

## Thay đổi

- Một `pv-topbar` sticky native chứa cả header và search, là sibling của main. Nền trắng kín toàn chiều rộng. Search về normal flow, không còn sticky/offset riêng hoặc margin âm.
- Giữ logo 160–168px và action 48×48px. Không thay giao diện banner, dữ liệu sản phẩm hoặc card.
- Placeholder ngắn “Tìm sản phẩm”; accessible label vẫn diễn tả tìm theo tên/model/công dụng. Giữ ô nhập, clear và submit có kích thước ổn định cùng debounce/IME hiện có.
- ResizeObserver chỉ đo chiều cao khối đầu trang khi thay kích thước để tạo scroll-margin cho phần tử được focus; không ghi transform/offset trong mỗi lần cuộn.
- Điều chỉnh chức năng đưa phần tử vào tầm nhìn để tính theo chiều cao header thực và thanh điều hướng đang hiển thị.
- Sửa nhánh quay từ Detail về Search: khôi phục vị trí kết quả khi không gõ trong input, vẫn giữ focus và hình học của input khi đang nhập.

## Kết quả QA

- Build export, TypeScript, lint và 25 tests hiện có: PASS. Audit màu 29 file: PASS.
- Home cuộn tới scrollY 2908px: header.top = 0, search.top = 68px, form.top = 76px; topbar màu trắng, không tràn ngang. Header ở đúng vị trí xuyên suốt cuộn.
- Gõ DCZC02-26 từ cuối Home: nhận một kết quả, input bounds trước/sau giống hệt (x=71, y=81.8, width=185, height=46 tại 390px).
- Search một kết quả, kết quả rỗng, chuyển sang Detail không có search và quay lại: PASS. Vị trí quay lại 116px so với 121px trước đó (giới hạn cuộn do nội dung/thanh điều hướng cập nhật), không quay về đầu trang 0px như trước.
- Mobile 320/390/430px: không tràn ngang. Viewport 390×480 khi input focus: form vẫn hiện đầy đủ, bottom navigation ẩn. Đây là kiểm tra viewport thu thấp; chưa phải xác minh bàn phím IME thực trên đúng máy Android của user.
- Menu mở khi cuộn: dialog z-index 81, topbar 30; body khóa cuộn, Escape đóng được. Header không đè dialog.

Ảnh và số đo trong `handoff/preview-scroll-fix/`: before-scrolled.png, after-home-scrolled-390.png, after-one-result.png, after-empty-320.png, after-short-viewport.png, after-catalog-scrolled-430.png, geometry.json. Log có các mẫu trung gian trước bản sửa khôi phục scroll; mẫu `final-return-restoration` là lần xác minh sau sửa.
