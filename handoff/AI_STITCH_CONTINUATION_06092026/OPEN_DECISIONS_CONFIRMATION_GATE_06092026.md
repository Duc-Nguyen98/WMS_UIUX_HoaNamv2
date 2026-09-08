# HOA NAM WMS — OPEN DECISIONS & CONFIRMATION GATE

Tài liệu này là danh mục các điểm **chưa được phép tự quyết**. Không phải mọi câu hỏi đều phải hỏi ngay; chỉ hỏi khi câu trả lời ảnh hưởng trực tiếp màn đang được chủ dự án yêu cầu.

## 1. Quy tắc xác nhận

Một xác nhận hợp lệ phải đến trực tiếp từ chủ dự án và chỉ áp dụng cho phạm vi được nêu rõ. Sự im lặng, một đề xuất trong audit, dữ liệu fixture, giao diện cũ hoặc hành vi backend quan sát một lần không phải xác nhận.

Khi chưa có xác nhận:

- giữ hiện trạng đã có nếu an toàn;
- gắn nhãn `CHỜ XÁC NHẬN`;
- không phát minh placeholder trông như dữ liệu thật;
- không triển khai phần bị ảnh hưởng;
- có thể tiếp tục phần độc lập không phụ thuộc quyết định đó.

## 2. Gate cấp dự án

### G-01 — Thứ tự hoàn thiện màn cũ

Chủ dự án chưa chốt màn nào trong 6 nhóm hiện tại phải tinh chỉnh trước. AI phải hỏi khi bắt đầu phiên làm việc.

### G-02 — Mở phase màn mới

Defect và các màn WMS khác chưa được phép thêm vào prototype hiện tại. Chỉ mở khi chủ dự án xác nhận.

### G-03 — Mức độ can thiệp production

Mặc định chỉ quan sát read-only. Mọi action ghi/lưu/in/import/publish trên production cần xác nhận riêng tại đúng thời điểm.

### G-04 — Deploy/publication

GitHub Pages là đích prototype hiện tại. Không deploy Sites cũ, đổi domain, đổi quyền public/private hoặc publish bản mới nếu chưa có yêu cầu trực tiếp.

## 3. Dashboard — câu hỏi nghiệp vụ mở

- Công thức `khả dụng` thật gồm/loại trừ trạng thái nào? Có trừ giữ chỗ không?
- Cutoff, múi giờ và nguồn của KPI, snapshot, đối soát, chart là gì?
- Có được cộng các đơn vị khác nhau thành “cái” không?
- “Hoàn tác/điều chỉnh ròng” gồm loại giao dịch nào?
- Count công việc là số nhóm, hồ sơ, dòng lỗi, SKU hay sự cố?
- Action Dashboard phải mang filter/kho/kỳ/trạng thái nào sang màn đích?
- SLA bảo hành tính theo ngày lịch hay ngày làm việc; owner và transition nào được phép?
- Quy tắc in/in lại, trạng thái chờ/không xác định và quyền gửi lệnh là gì?
- Sau mutation action, Dashboard cập nhật theo polling, event hay refresh thủ công?

Không dùng fixture 647/674/677, 3/4/5 hoặc thời gian 05/09/2026 làm production contract.

## 4. SKU — câu hỏi nghiệp vụ mở

- Field bắt buộc thay đổi theo Sản phẩm/Linh kiện/Nhóm hàng thế nào?
- Serial mặc định theo loại nào; khi nào field bị khóa?
- Mã SKU có bất biến sau khi có tồn/tham chiếu không?
- Điều kiện SKU rời hàng đợi chờ hoàn thiện là gì?
- Điều kiện đủ để đưa lên ứng dụng phân vùng là gì?
- Gỡ khỏi ứng dụng tác động giỏ hàng/đơn hiện có như thế nào?
- Cơ chế duyệt publish có tồn tại không?
- Import có update field nào; all-or-nothing/idempotency/rollback thế nào?
- Collation production, null order và format mã SKU là gì?
- Model/Hãng/Nhóm/Nguồn/Quy cách có lifecycle và validation xuyên màn ra sao?

## 5. Catalog — câu hỏi nghiệp vụ mở

- Tên chính thức của màn là “Danh mục sản phẩm”, “Danh mục tham chiếu SKU” hay tên khác?
- “Mẫu sản phẩm” và “Model” là một khái niệm hay hai khái niệm?
- “Nguồn điện” hiện tại thực chất là nguồn năng lượng, kiểu động lực, kiểu vận hành hay field khác?
- Có field Công suất định lượng riêng theo kW/HP/V không?
- `BODY_ONLY` và `BARE` khác nhau thế nào?
- Ý nghĩa và range của `Thứ tự hiển thị`; 0 ưu tiên ra sao?
- Code có thể đổi sau khi được SKU tham chiếu không?
- Ngừng sử dụng chỉ chặn chọn mới hay tác động SKU cũ?
- Hãng ngừng dùng có cascade Model không?
- Model đổi Hãng có được phép không?
- Khi merge danh mục, remap/history/audit thực hiện thế nào?

Không merge, delete hoặc cascade trước khi có câu trả lời.

## 6. Agency — câu hỏi nghiệp vụ mở

- Thị trường, Khu vực, Tỉnh/Thành phố, Phường/Xã có ý nghĩa riêng gì?
- Trường nào là nguồn sự thật; dữ liệu nào do danh mục quản lý?
- Có được suy ra Market/Area từ Province/Ward không?
- Nguồn địa giới hành chính chính thức và version dữ liệu là gì?
- Số điện thoại hỗ trợ 10 số Việt Nam, số bàn, quốc tế, extension hay nhiều số?
- Phone có bắt buộc theo loại nơi nhận không?
- Legacy address được giữ, chuẩn hóa hoặc migrate theo quy trình nào?
- Chứng từ cũ dùng snapshot địa chỉ hay đọc master data hiện tại?
- Mã/Loại/Trạng thái có đổi được sau khi phát sinh chứng từ không?
- Ngừng sử dụng ảnh hưởng chứng từ nháp/đơn mở/tra cứu lịch sử thế nào?
- Role nào được xem contact/phone/address và role nào được sửa?

Không dùng Tỉnh mẫu A/B làm danh mục chính thức.

## 7. Defect — câu hỏi giữ cho Phase 2

- Thuật ngữ chính thức: Bệnh/lỗi, Lỗi/bệnh, Danh mục lỗi hay tên khác?
- Code lỗi có bất biến; backend tham chiếu bằng ID hay code?
- Format/case/trim/uniqueness của code là gì?
- Mô tả có bắt buộc và có nằm trong search không?
- Ngừng sử dụng ảnh hưởng hồ sơ cũ/đang xử lý/lựa chọn mới thế nào?
- Mã cũ “đã gộp” có quan hệ thay thế có cấu trúc không?
- Có giữ hậu tố “(ngừng dùng)” trong tên lịch sử không?
- Role Add/Edit/View và nhu cầu read-only detail là gì?
- Bản ghi mới active ngay hay cần duyệt?

Không hỏi các câu này trong Phase 1 nếu không ảnh hưởng màn đang làm.

## 8. Auth — điểm cần xác nhận khi tinh chỉnh

- Login dùng email duy nhất hay email/tên đăng nhập?
- Có giữ hình minh họa/split layout ở các viewport nào?
- Remember login là remember identifier, session hay thiết bị?
- Reset password chỉ dừng ở gửi OTP hay phải thiết kế toàn bộ flow OTP/new password?
- Có yêu cầu SSO/MFA không? Mặc định không tự thêm.

## 9. Mẫu log quyết định

Mỗi câu trả lời đã được xác nhận phải ghi lại theo mẫu:

| Trường | Nội dung |
| --- | --- |
| Decision ID | `DEC-YYYYMMDD-NN` |
| Màn/phạm vi | … |
| Câu hỏi | … |
| Quyết định của chủ dự án | … |
| Ngày/giờ | … |
| Tác động thiết kế | … |
| Tác động chưa thuộc phạm vi | … |
| Tài liệu/frame cập nhật | … |

Không ghi “Approved” nếu chủ dự án chỉ nói đang cân nhắc hoặc yêu cầu xem thêm phương án.

## 10. Mẫu yêu cầu xác nhận ngắn

> Tôi phát hiện **[vấn đề]**. Bằng chứng hiện có là **[nguồn]**; phần **[frame/behavior]** sẽ thay đổi tùy quyết định.  
> A: **[phương án]** — tác động **[…]**.  
> B: **[phương án]** — tác động **[…]**.  
> Tôi khuyến nghị có điều kiện **[…]** vì **[…]**.  
> Bạn xác nhận A/B hay quy tắc khác? Tôi sẽ dừng phần bị ảnh hưởng cho đến khi nhận xác nhận.
