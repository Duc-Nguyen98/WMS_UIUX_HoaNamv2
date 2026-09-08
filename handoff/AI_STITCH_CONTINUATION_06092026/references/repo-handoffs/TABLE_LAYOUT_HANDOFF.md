# Bảng danh mục — yêu cầu đã xác nhận 06/09/2026

## Quy ước UI

- Áp dụng cho **Danh sách SKU** và toàn bộ 5 tab **Danh mục sản phẩm**.
- Mặc định **10 bản ghi/trang**, thay thế mặc định 15. URL có lựa chọn 15/20/50 rõ ràng vẫn được khôi phục; URL mới hoặc giá trị không hợp lệ dùng 10.
- Không dùng chiều cao cố định, `max-height` hoặc vùng cuộn dọc riêng cho bảng phân trang. Chiều cao bảng theo số dòng thực tế; cuộn dọc thuộc về trang.
- Giữ phân trang ngay dưới bảng; chuyển trang đưa focus và vị trí xem về đầu bảng kết quả.
- STT theo vị trí trong kết quả đã lọc/sắp xếp, tiếp nối qua các trang; không phải “Thứ tự hiển thị”.
- Tablet từ 768px: chỉ cuộn ngang khi cần, cố định STT, Mã/Tên và Hành động. Desktop đủ rộng hiển thị toàn bộ cột.
- SKU: Xem / Sửa / menu tác vụ trên một hàng, giữ chữ và vùng bấm 44px; đóng action trả focus về nút đã mở.
- Hộp thoại vẫn có cuộn nội dung khi cần để giữ nút đóng/lưu trong viewport. Quy ước bỏ cuộn dọc áp dụng cho bảng danh sách, không xóa cơ chế cuộn của modal.

## Phạm vi chuyển nguồn đã được cho phép

GitHub baseline `ec6e2ba` chưa có Danh mục sản phẩm. Người dùng đã xác nhận chuyển riêng màn Danh mục đã duyệt, dữ liệu DEMO dùng chung với SKU và tích hợp menu sang repo này. Không thay Dashboard/Auth, dependency, lockfile hoặc dữ liệu kho thật bằng checkout cũ.

Các thuật ngữ, điều kiện ngừng sử dụng, thay đổi mã/Hãng/thứ tự, điều kiện publish vẫn theo phạm vi đã duyệt: chỉ xem trước khi còn chờ BA/PO. Không coi các thao tác DEMO là sửa lỗi backend thật.

## Kiểm chứng trong lần cập nhật

- 16/16 test logic SKU + Catalog: lọc/sort toàn tập trước phân trang, URL, mặc định 10, trang cuối, quan hệ và tác động DEMO.
- TypeScript và lint các component/helper danh mục đạt. Lint `app/page.tsx` còn 3 lỗi accessibility đã có ở phần Auth/sidebar ngoài phạm vi chỉnh lần này.
- Kiểm tra trình duyệt tại 768, 1024, 1280, 1440, 1920px: không tràn ngang trang; chiều cao nội dung và khung bảng bằng nhau, không có vùng cuộn dọc nội bộ.
- Kiểm tra STT 11–20, trang cuối, focus khi phân trang, menu SKU → modal → trả focus, các tab danh mục, chuyển 10/20 dòng, sửa tên Hãng DEMO phản ánh sang bảng SKU.

## Đích cập nhật

Repo: https://github.com/Duc-Nguyen98/WMS_UIUX_HoaNamv2

Preview: https://duc-nguyen98.github.io/WMS_UIUX_HoaNamv2/

Không xuất bản lên Sites cũ. Sau mỗi build cần chuẩn hóa asset/base path bằng script hiện có, kiểm tra bản static và chỉ báo hoàn tất sau khi GitHub Pages triển khai đúng commit thành công.

Base path của client được cấu hình ở `environments.client.define` trong `vite.config.ts` khi build; prerender vẫn ở `/` theo trình xuất static hiện tại. Không sửa một tên biến trong bundle minify: hằng base path còn bị inline vào các controller, gây lỗi lặp điều hướng khi bấm menu. Chỉ bật `next.config.basePath` ở phiên bản exporter hiện tại sẽ làm prerender `/` bị bỏ qua, thiếu `index.html`.

`PrototypeHistory` chuyển popstate cùng tài liệu thành sự kiện `hn:prototype-history` cho Dashboard/SKU/Catalog tự phục hồi bộ lọc. Đây là review board một trang, query/hash là state DEMO, không phải route server. Không yêu cầu tải lại RSC từ GitHub Pages khi đổi hash hoặc Back/Forward. Dashboard chỉ đổi tên sự kiện đăng ký/huỷ đăng ký, không đổi UI hoặc nghiệp vụ.

Khi xuất static, `prepare-github-pages.mjs` chèn bootstrap history đồng bộ từ `scripts/prototype-history-bootstrap.js` vào đầu `<head>`: cần đăng ký trước module router, không chỉ dựa vào React effect chạy sau hydration. Bootstrap không đọc/gửi dữ liệu ra ngoài.
