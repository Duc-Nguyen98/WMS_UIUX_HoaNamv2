# App Preview — triển khai HTTPS phục vụ audit

Người dùng đã yêu cầu đưa App Preview lên URL public/staging ngày 07/09/2026 và yêu cầu tiếp tục triển khai. Quyền xuất bản này áp dụng cho Preview. Không thay thế giao diện WMS hiện có.

## Địa chỉ và phạm vi

- URL: https://duc-nguyen98.github.io/WMS_UIUX_HoaNamv2/preview/
- GitHub Pages đã cấu hình sẵn cho `Duc-Nguyen98/WMS_UIUX_HoaNamv2`, nhánh `main`, thư mục `/docs`.
- Preview được xuất riêng vào `docs/preview`; các file WMS hiện có trong `docs` được giữ nguyên.
- Không cần đăng nhập. Metadata đặt `noindex, nofollow`; đây là hướng dẫn cho công cụ tìm kiếm, không phải kiểm soát quyền truy cập.
- Các màn dùng fragment như `#view=catalog`, `#view=detail&product=dczc02-26`, `#view=request&product=dczc02-26`.

## Giới hạn tích hợp

Đây là bản UI để audit, chưa phải hệ thống vận hành đã được xác minh. Bảy sản phẩm và trạng thái giữ theo nguồn thiết kế hiện tại; chưa đồng bộ hoặc xác minh tồn kho thật. Nội dung nguồn và giới hạn này chỉ thuộc tài liệu DEV.

`PREVIEW_CONTACT.requestEndpoint` và `zaloUrl` vẫn `null`. Không tạo nơi nhận thay thế; chỉ hiển thị tiếp nhận thành công sau phản hồi thật chứa `accepted: true` và `requestId`. Hotline giữ theo ảnh đã cung cấp; không thực hiện cuộc gọi trong kiểm tra.

Đã xem/đã lưu nằm trên trình duyệt đang sử dụng, ở origin GitHub Pages; dữ liệu lưu tại localhost không chuyển theo. Form và bản ghi tiếp nhận chỉ giữ trong bộ nhớ lần mở trang. Không đưa thông tin liên hệ vào URL hoặc storage.

## Build và cập nhật

1. Dùng Node.js 24 LTS và cài dependency theo lockfile.
2. Chạy `node scripts/build-preview-pages.mjs` tại gốc repo.
3. Đọc `work/preview-pages-latest.json` để lấy đường dẫn output. Build chỉ bao gồm route Preview cùng các component cần thiết; không xuất route WMS vào thư mục này.
4. Kiểm tra output ở mount `/WMS_UIUX_HoaNamv2/preview/`, bao gồm CSS lazy load, ảnh, font và nút Back/Forward.
5. Cập nhật riêng `docs/preview` từ output đã kiểm tra; rà soát diff trước commit/push vào `main`. Giữ file `docs/.nojekyll` hiện có.
6. Chờ Pages build cho đúng commit đạt và kiểm tra lại URL HTTPS cùng các tài nguyên.

Build tách biệt trong `work/preview-pages-<timestamp>` để không ảnh hưởng dev server. Script dùng metadata Preview, cấu hình base path, tiền tố ảnh qua `NEXT_PUBLIC_PREVIEW_ASSET_BASE`, và chuẩn hóa đường dẫn preload Vite. History bootstrap để Preview tiếp tục tự quản lý hash khi Back/Forward trên hosting tĩnh. Không có bước tải `.env`, cấu hình credential, server bundle hoặc dữ liệu WMS vào output công khai.

Node 26.5 trên máy đã phát sinh assertion libuv khi kết thúc build; Node 24.19 hoàn thành bình thường. Không coi lượt build lỗi là lượt đạt.

## Kiểm tra trước xuất bản

- Build tĩnh riêng Preview và TypeScript đạt.
- 21 unit test đạt, bao gồm gửi nhiều sản phẩm, từ chối tiếp nhận giả, lịch sử thiết bị và điều hướng.
- Pages API xác nhận `built` cho commit `41d4904946ced5376f1931d72bd2a958ee63dc31`; URL HTTPS trả 200 và HTML trùng bản build đã kiểm tra. Cả 32 tài nguyên kiểm tra đều trả 200.
- Kiểm tra trình duyệt HTTPS: Trang chủ → Danh sách → Chi tiết → Form yêu cầu; tải lại deep link form giữ đúng sản phẩm. Kiểm tra Back/Forward ở bản tĩnh trước xuất bản. Đã sửa vùng tóm tắt sản phẩm trên mobile dùng đủ chiều rộng, không tràn ngang trang.

## Trạng thái checkout sau triển khai

Commit được tạo tại worktree `work/preview-staging-publish`, nhánh `codex/preview-staging`, dựa trên `origin/main` mới nhất lúc triển khai (`3624b55`), rồi push fast-forward tới `main`. Checkout làm việc ban đầu giữ các chỉnh sửa đang có của người dùng; không reset, không ghi đè các thay đổi WMS mới hơn trên remote. Trước lần cập nhật tiếp theo, đối chiếu với remote mới nhất và chỉ đưa phần Preview đã duyệt vào bản xuất bản.
