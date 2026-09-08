# Dashboard prototype — biên bản kiểm tra 05/09/2026

## Phạm vi

Bổ sung PROTOTYPE → Tổng quan vận hành vào website Vuexy hiện có theo hai tài liệu người dùng cung cấp và xác nhận triển khai. Dữ liệu tổng hợp mang mã DEMO; không dùng hồ sơ thật, API WMS, camera, máy in hoặc quyền thật. Không thay đổi mã giao diện Đăng nhập/Quên mật khẩu và app/globals.css.

## Đã kiểm tra

- TypeScript toàn dự án: đạt. Build sản xuất: đạt. Lint hai file TypeScript mới: đạt.
- Lint toàn kho mã còn lỗi có sẵn ở component nền và auth; không sửa ngoài phạm vi. Không tuyên bố toàn dự án đã đạt lint.
- Kích thước Dashboard: 768×1024, 900×768, 960×768, 1024×768, 1280×720, 1440×900, 1920×1080. Đo DOM sau vẽ: không tràn ngang toàn trang hoặc vùng Dashboard; không có nút Dashboard đang hiển thị cao dưới 44px.
- Xem trực quan Dashboard desktop, chi tiết tồn 768×1024 và form linh kiện 1024×768. Không phải chứng nhận mọi action ở mọi thiết bị vật lý.
- Đối soát tồn: 3 dòng đúng số đếm; mở chi tiết, truy vết, trang 2, Browser Back và tải lại URL chi tiết thành công.
- Bảo hành: 4 hồ sơ quá hạn; xem chi tiết, tab linh kiện, sửa thông tin, đổi trạng thái và form xuất linh kiện.
- Form: cảnh báo đóng khi đang nhập; tiếp tục nhập giữ nội dung. Có phản hồi thành công/lỗi/xung đột; ca lỗi giữ nội dung; nút gửi bị khóa khi pending. Linh kiện thêm dòng được; số lượng 999 bị chặn, số lượng hợp lệ có phản hồi mô phỏng.
- Nhãn: 3 nhãn cần kiểm tra; phân biệt thất bại/chờ phản hồi; mở đúng nhãn và phiếu mẫu. Nút gửi lệnh in bị khóa.
- Lỗi nhập: 5 dòng thuộc 2 lô; vào lô DEMO-LO-01 thấy đúng 2 dòng, tách trường/giá trị/lý do/cách sửa.
- SKU: chặn gửi khi thiếu Hãng/Nhóm hàng; chọn đủ có phản hồi thành công mô phỏng.
- Bộ lọc: sản phẩm + hôm nay cho nhập 15, bảng chi tiết 4 dòng tổng 15; các KPI/sổ/chart dùng chung dữ liệu. Khoảng ngày đảo ngược hiển thị lỗi. Đã thử đủ trạng thái có dữ liệu/tải/trống/lỗi/cũ/không quyền.
- Kiểm tra bằng mã: tổng khả dụng mẫu 647; số đếm các nhóm; 15 phương trình sổ theo ba loại hàng và năm ngày cuối kỳ đều khớp.

## Giới hạn cần giữ trong các prompt sau

- Đây là prototype giao diện, không phải triển khai WMS sản xuất. Phản hồi lưu thành công không sửa fixture gốc; hàng đợi không giả vờ đã được giải quyết.
- Công thức thật/cutoff/giữ chỗ/đơn vị, SLA/ngày làm việc, quyền chuyển trạng thái, in lại và các trường bắt buộc theo loại SKU vẫn chờ BA/PO xác nhận.
- Không tích hợp upload/tải Excel, ảnh/video, camera, máy in, phân quyền hoặc backend thật.
- URL giữ kỳ/loại hàng/nhánh và bộ lọc danh sách; ô tìm kiếm và phân trang chi tiết chỉ ở trạng thái màn, không được lưu trong URL.
- Cảnh báo nháp áp dụng Quay lại/Đóng trong giao diện và beforeunload. Browser Back rời form không giữ nháp; đã nêu trong bàn giao trên website.
- Bộ chọn trạng thái mô phỏng áp dụng toàn Dashboard, chưa mô phỏng lỗi độc lập từng widget.
- Không suy ra điểm nghiệm thu 92/100 của Dashboard từ điểm mục tiêu auth cũ. Điểm audit 60/100 là kết quả khảo sát hệ thống cũ.
