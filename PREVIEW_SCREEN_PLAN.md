# App Preview — trạng thái bàn giao các màn

Người dùng đã duyệt phạm vi PV-01 đến PV-18 (PV-13–18 được duyệt tiếp trong yêu cầu bổ sung) ngày 07/09/2026. Các màn đã được áp dụng trong `/preview`, dùng chung nền sáng, bảng màu Hoa Nam và câu chữ dành cho khách hàng. Không chèn logo, banner/footer đã loại bỏ, ghi chú nội bộ hay cổng đăng nhập.

## Danh sách triển khai

| Mã    | Màn / bề mặt              | Nội dung đã áp dụng                                                                                                                                                                          |
| ----- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PV-01 | Trang chủ                 | Giữ bố cục đã duyệt; nút Tư vấn một hàng; dẫn vào nhóm, tìm kiếm, danh sách và chi tiết mới.                                                                                                 |
| PV-02 | Danh mục theo nhóm        | Ba tab máy / dụng cụ cầm tay / phụ kiện. Sửa lỗi flex khiến tab kéo dài và danh mục tràn ngang. Nhãn xuống dòng ở màn nhỏ.                                                                   |
| PV-03 | Danh sách sản phẩm        | Hai cột trên điện thoại, bốn cột trên máy tính; ảnh có khung, loading và fallback; tên/model tách riêng; Sẵn hàng / Đặt trước; lưu bộ lọc và vị trí trong phiên.                             |
| PV-04 | Lọc và sắp xếp            | Bảng từ dưới trên điện thoại; nhóm, danh mục, trạng thái và tên A–Z; chọn nháp rồi Áp dụng; Xóa bộ lọc; giữ lựa chọn đang áp dụng khi mở lại.                                                |
| PV-05 | Tìm kiếm                  | Gợi ý có model và trạng thái; tìm không dấu, model không có dấu gạch; ưu tiên model chính xác; một nút xóa từ khóa; kết quả rỗng có lối xử lý; thanh điều hướng ẩn khi nhập trên điện thoại. |
| PV-06 | Chi tiết                  | Trang riêng: ảnh, model/tên, tình trạng, đặc điểm, thông tin, thông số nếu có, sản phẩm cùng danh mục. Thanh hành động gửi yêu cầu, gọi và liên hệ.                                          |
| PV-07 | Ảnh lớn                   | Hộp xem ảnh nền trắng; phóng 100–300%, thu nhỏ, vừa màn hình, đóng/Escape. Chuyển ảnh chỉ khi sản phẩm có nhiều ảnh được cung cấp.                                                           |
| PV-08 | Liên hệ                   | Ba lựa chọn: gửi yêu cầu, hotline, Zalo OA; giờ hỗ trợ bằng tiếng Việt; sao chép số.                                                                                                         |
| PV-09 | Chuyển sang gọi / OA      | Liên kết tel theo số trong ảnh. OA sẵn điểm cấu hình nhưng chưa kích hoạt vì chưa có địa chỉ. Không dựng lại màn gọi của hệ điều hành.                                                       |
| PV-10 | Gửi yêu cầu đặt hàng      | Tên, điện thoại, danh sách sản phẩm, ghi chú. Điền sẵn từ chi tiết, có thể đổi; lỗi ngay dưới trường; giữ dữ liệu khi quay lại/gửi lỗi; chặn nhấn gửi lặp trong form.                              |
| PV-11 | Kết quả                   | Component xác nhận tiếp nhận và tóm tắt; chỉ xuất hiện sau phản hồi hợp lệ của nơi nhận. Khi lỗi giữ form và có Gửi lại/hotline.                                                             |
| PV-12 | Sử dụng thông tin liên hệ | Nội dung ngắn cạnh nút gửi và bảng giải thích tên/điện thoại/sản phẩm/ghi chú được dùng cho tư vấn. Không tự thêm điều khoản pháp lý hoặc cam kết vận hành.                                  |

## Các màn bổ sung PV-13–PV-18

| Mã | Màn | Đã áp dụng và giới hạn |
| --- | --- | --- |
| PV-13 | Sản phẩm đã xem | Khối Trang chủ và màn danh sách; mới xem lên trước, tối đa 30 mã; xóa lịch sử có xác nhận. |
| PV-14 | Sản phẩm đã lưu | Lưu/bỏ lưu từ thẻ và chi tiết, mở lại sau khi tải trang, gửi danh sách sang chọn nhiều sản phẩm. Chỉ lưu trên trình duyệt/thiết bị này, có giải thích giới hạn. |
| PV-15 | Hướng dẫn & FAQ | Hướng dẫn gửi nhu cầu, tư vấn, trạng thái hàng, đã lưu và sử dụng thông tin. Chưa thêm chính sách giao hàng/bảo hành chưa được cung cấp. |
| PV-16 | Yêu cầu nhiều sản phẩm | Tìm/chọn/bỏ sản phẩm, lọc Đã lưu, rà soát danh sách, chuyển sang form chung và sửa mà giữ tên/điện thoại/ghi chú. Chưa thêm số lượng vì chưa nhận lựa chọn xác nhận. |
| PV-17 | Xem lại yêu cầu đã gửi | Danh sách/chi tiết chỉ được tạo sau xác nhận tiếp nhận thật, sao chép mã, xóa khỏi màn hình mà không hủy yêu cầu. Chỉ giữ trong bộ nhớ lần mở trang; không tra cứu máy chủ, không hiển thị tiến độ chưa được cung cấp. |
| PV-18 | So sánh | Chọn 2–3 model cùng danh mục, thêm/bỏ, bảng cuộn ngang, chuyển sang yêu cầu. Chỉ dùng thông tin hiện có; chưa có thông số thì dẫn tư vấn. |

Menu “Tiện ích sản phẩm” ở đầu trang dẫn tới cả sáu màn; Trang chủ có lối vào Đã xem, Đã lưu và Hướng dẫn.

## Trạng thái dữ liệu

- Danh mục phụ kiện và các nhóm chưa có sản phẩm hiển thị rỗng; không tự thêm bản ghi để lấp chỗ trống.
- Ảnh tải chậm giữ nguyên khung và có skeleton; ảnh lỗi có biểu tượng thay thế.
- Nội dung lazy-load có skeleton danh sách/chi tiết đúng loại. Tìm kiếm cập nhật bằng deferred render, giữ kết quả cũ trong lúc tính kết quả mới.
- Link chi tiết không tồn tại hiển thị “Sản phẩm hiện không khả dụng”.
- Form có đang gửi, lỗi trường, chưa gửi được và tiếp nhận thành công. Không dùng thời gian chờ giả để báo thành công.
- Dữ liệu hiện là bộ cục bộ đã được duyệt làm thiết kế, không có API phân trang. Trạng thái tải thêm/lỗi mạng dữ liệu sẽ được nối khi DEV nhận nguồn dữ liệu; không giả lập kết nối trong app.

## Phần vận hành còn cần cung cấp

1. API/hệ thống nhận yêu cầu của sale và phản hồi xác nhận tiếp nhận.
2. URL Zalo OA chính thức; xác nhận tiếp tục dùng hotline `098 636 6675` và giờ hỗ trợ từ ảnh.
3. Nguồn sản phẩm/ảnh/thông số/tình trạng vận hành để thay bản ghi thiết kế. Hiện không có đủ thông số hoặc ảnh bổ sung của từng sản phẩm.
4. Bên vận hành rà soát nội dung sử dụng thông tin trước khi đưa dịch vụ nhận yêu cầu vào sử dụng thật.

Phạm vi form hiện tại cho phép một hoặc nhiều sản phẩm mỗi yêu cầu; tên/điện thoại/danh sách sản phẩm bắt buộc, ghi chú tùy chọn. Chưa bổ sung số lượng (đã hỏi, chưa nhận lựa chọn), thanh toán, giao nhận, CRM hoặc tài khoản. Tra cứu yêu cầu sau khi đóng trang cần hệ thống tiếp nhận và cơ chế truy cập riêng tư được bên vận hành cung cấp/duyệt.
