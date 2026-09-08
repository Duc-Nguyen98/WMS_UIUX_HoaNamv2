# Preview — header căn giữa, chỉ thay đổi bốn yêu cầu

Ngày: 08/09/2026. Bản đối chiếu trước thay đổi: `789eeeb`.

| Kiểm tra | Kết quả |
| --- | --- |
| Logo giới hạn 160–168px | 320px: 160px; 390px: 163.80px; 430px: 168px |
| Hai action 48×48px | Menu và Gửi yêu cầu đều 48×48px tại cả ba viewport |
| Căn giữa bằng grid | `48px 1fr 48px`; sai lệch tâm logo so với header 0–0.008px do làm tròn subpixel |
| Hai chức năng khác nhau | Icon máy bay giấy → `#view=request`, form Gửi yêu cầu đặt hàng; Bottom Navigation Liên hệ → `#view=contact`, màn Liên hệ & tư vấn |

Header dùng trực tiếp biểu tượng oval trong ảnh người dùng cung cấp, trình bày bằng SVG viewport để chỉ hiển thị logo; chữ HOA NAM / TOOLS được render sắc nét bằng typography của app. File gốc được giữ nguyên tại `public/preview/hoa-nam-brand-source.jpg`.

Chỉ thay JSX trong `<header>` của `components/product-preview.tsx`, CSS có selector dành riêng cho header trong `styles/preview-theme.css` và thêm asset logo. Đối chiếu tự động xác nhận code ngoài header và CSS ngoài nhóm header giữ nguyên. Banner, nội dung bên dưới, Bottom Navigation và các màn khác không thay đổi. Header mobile giữ chiều cao phần nội dung 68px; không làm dịch vị trí phần bên dưới.

Build export, TypeScript và audit 29 file màu: PASS. Mobile 320/390/430px không tràn ngang. Đã bấm thật ba action: menu mở Tiện ích, máy bay giấy mở Request và Bottom Navigation mở Contact; không gửi form hay gọi hotline. Hai icon có tên truy cập và tooltip.

Ảnh và số đo: `handoff/preview-centered-header/header-320.png`, `header-390.png`, `header-430.png`, `geometry.json`.
