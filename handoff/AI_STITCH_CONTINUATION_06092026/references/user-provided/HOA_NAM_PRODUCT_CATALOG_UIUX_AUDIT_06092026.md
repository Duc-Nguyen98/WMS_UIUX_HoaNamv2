# HOA NAM WMS — ĐÁNH GIÁ DANH MỤC SẢN PHẨM & CÁC MÀN ACTION

Ngày khảo sát: 06/09/2026 · Ngôn ngữ: Tiếng Việt · Phạm vi thiết bị: tablet, laptop, desktop.

Hệ thống được khảo sát trực tiếp: https://khohoanamfe.bigk.click/master-data/catalog?screen=MST-CAT-01

Ngữ cảnh đối chiếu: báo cáo `HOA_NAM_SKU_UIUX_AUDIT_05092026.md` do chủ dự án đính kèm. Baseline thị giác giữ theo Vuexy Demo 1: Public Sans, nền sáng, bề mặt trắng và tím làm màu nhấn.

## 1. Kết luận điều hành

**Điểm tổng hợp: 64/100 — giao diện đã bám đúng baseline Vuexy và các form danh mục khá gọn, nhưng chưa đủ chặt cho một màn quản trị master data vì sort sai toàn cục, thuật ngữ giữa các màn chưa thống nhất, không thấy tác động của thay đổi lên SKU và trải nghiệm tablet còn mất đối tượng khi thao tác.**

Không cần thay theme hoặc tăng độ phủ màu tím. Các vấn đề lớn thuộc về hành vi dữ liệu và khả năng kiểm soát thay đổi, không phải trang trí.

Tám việc nên giao DEV/BA trước:

1. Sửa sort toàn bộ tập dữ liệu trước khi phân trang; hiện sort A→Z chỉ đúng trong từng trang và làm STT hiển thị lộn xộn.
2. Ở 768–1280px, giữ đồng thời Mã/Tên và cột Sửa khi cuộn ngang; thanh 5 tab cũng phải cho thấy rõ còn nội dung phía bên phải.
3. Chốt từ điển thuật ngữ dùng chung: “Mẫu sản phẩm” hay “Model”; “Nguồn điện” hay trường đang được gọi là “Công suất” trong form SKU. Dữ liệu quan sát không phù hợp để gọi đơn giản là Công suất.
4. Trước khi đổi mã, Hãng của Model hoặc trạng thái danh mục, hiển thị số SKU đang tham chiếu và hậu quả; backend vẫn phải bảo vệ toàn vẹn tham chiếu.
5. Sửa quan hệ Hãng–Model xuyên suốt: màn danh mục xác nhận có 18 model đang hoạt động; báo cáo SKU đã xác nhận chọn Hoa Nam vẫn thấy đủ 18 model của nhiều hãng.
6. Đưa tab, từ khóa, trạng thái, sort, trang và số dòng vào URL hoặc cơ chế khôi phục tương đương; hiện đổi tab rồi quay lại làm mất ngữ cảnh.
7. Tách đúng loading, empty, no-result và error; đã có một lần lỗi tải Nhóm hàng nhưng giao diện đồng thời nói “Chưa có nhóm hàng nào / Tổng 0” và không có nút thử lại.
8. Làm rõ “Thứ tự hiển thị”: form cho sửa nhưng danh sách không hiển thị cột này, không nói thứ tự mặc định dựa trên gì.

Đây là đánh giá chuyên gia dựa trên giao diện và hành vi quan sát trực tiếp. Không phải kiểm toán dữ liệu, kiểm thử bảo mật, nghiên cứu người dùng hoặc chứng nhận WCAG. Các submit Tạo/Sửa chưa được thực hiện, vì vậy mọi kết luận về validation sau submit, xung đột dữ liệu và tác động backend đều được giữ ở trạng thái chưa kiểm chứng.

### 1.1. Những gì cần giữ

- Public Sans, nền `#F8F7FA`, card trắng, chữ đậm và tím `#7367F0`/`#675DD8` làm accent.
- Gom 5 danh mục tham chiếu vào một màn giúp giảm số menu và giữ ngữ cảnh quản trị SKU.
- Tab, tìm kiếm, lọc trạng thái, page-size, bảng và phân trang có cấu trúc quen thuộc.
- Mỗi tab đổi đúng nhãn tìm kiếm và CTA Tạo theo loại danh mục.
- Không có action Xóa trên bề mặt đã xem; dùng Ngừng sử dụng phù hợp hơn cho master data đang được tham chiếu.
- Nút Sửa có accessible name chứa mã bản ghi, ví dụ “Sửa HUSQVARNA”.
- Form Tạo/Sửa có `role=dialog`, tiêu đề, Đóng, Hủy và Lưu; Escape/Hủy đóng được form và focus quay lại CTA mở form trong kịch bản đã thử.
- Form Sửa giải thích hệ thống không cho đổi mã nếu mã đã được SKU sử dụng.
- Form Mẫu sản phẩm chỉ liệt kê 10 Hãng đang sử dụng; con số khớp với tổng 12 Hãng trừ 2 Hãng ngừng sử dụng.
- Modal rộng khoảng 576px, cao khoảng 448px và vừa trong viewport 768×1024.

### 1.2. Không được suy diễn thành yêu cầu thay đổi

- Không đổi sidebar/nền trang thành tím, không phủ tím toàn màn.
- Không thiết kế cho điện thoại; phạm vi bắt đầu ở 768px.
- Không yêu cầu đổi framework chỉ vì dùng Vuexy làm baseline.
- Không tự đổi tên “Nguồn điện” thành một thuật ngữ cụ thể trước khi BA xác nhận ý nghĩa dữ liệu.
- Không kết luận backend cho phép đổi mã đang được sử dụng; form có cảnh báo rằng hệ thống sẽ chặn, nhưng chưa thử Lưu.
- Không kết luận backend thiếu validation vì nút Lưu đang enabled khi form trống; chưa submit.
- Không kết luận Ngừng sử dụng sẽ làm hỏng SKU; chưa thử lưu thay đổi trạng thái.
- Không coi lần lỗi tải Nhóm hàng là bằng chứng danh mục rỗng hoặc lỗi dữ liệu. Lần mở lại sau đó tải thành công 26 bản ghi.
- Không đề xuất xóa cứng danh mục. Nếu nghiệp vụ thực sự cần xóa, BA/PO phải chốt điều kiện và chiến lược tham chiếu trước.

## 2. Phương pháp, độ phủ và giới hạn

### 2.1. Đã thực hiện

- Khảo sát bằng phiên đăng nhập do người dùng cung cấp; vai trò hiển thị là Super Admin.
- Đọc nội dung, cây truy cập, cấu trúc DOM/CSS, trạng thái control, URL và log trình duyệt mức error/warning.
- Mở đủ 5 tab: Hãng, Nhóm hàng, Mẫu sản phẩm, Nguồn điện, Quy cách đóng gói.
- Đọc tổng số, phân trang, trạng thái đang/ngừng sử dụng và các ví dụ dữ liệu trên từng tab.
- Thử tìm `HOANAM`, thử một từ khóa không tồn tại và xóa tìm kiếm.
- Thử lọc Ngừng sử dụng, đổi tab rồi quay lại để quan sát việc mất trạng thái.
- Tái hiện sort Mã hãng A→Z qua hai trang và ghi nhận STT sau sort.
- Mở Tạo/Sửa Hãng; Tạo/Sửa Mẫu sản phẩm; Tạo Nhóm hàng; Tạo Nguồn điện; Tạo Quy cách đóng gói; mở Sửa một Nhóm hàng đã ngừng sử dụng.
- Mở dropdown Hãng trong form Mẫu sản phẩm và dropdown Trạng thái; không chọn giá trị làm thay đổi dữ liệu.
- Kiểm tra đóng form bằng nút Đóng, Hủy và Escape; không lưu.
- Kiểm tra điều hướng tab bằng ArrowRight rồi Enter; hoạt động theo cơ chế focus trước, kích hoạt sau.
- Đo responsive ở 768×1024, 900×768, 1024×768, 1280×720, 1440×900 và 1920×1080.
- Cuộn ngang bảng tại 1024px để xác minh khi thấy Trạng thái/Sửa thì Mã và Tên đã rời khỏi màn.
- Khôi phục tab Hãng, trang 1, trạng thái Tất cả; đóng mọi modal và reset viewport trước khi kết thúc.

### 2.2. Chưa kiểm chứng — phải giữ nguyên nhãn này khi giao DEV

- Chưa bấm Lưu ở form Tạo/Sửa; chưa thử validation trống, trùng mã, sai định dạng, max-length hoặc lỗi API.
- Chưa đổi mã, Hãng của Model, thứ tự hiển thị hoặc trạng thái của bất kỳ bản ghi nào.
- Chưa xác minh cảnh báo/confirm và số SKU bị ảnh hưởng khi Ngừng sử dụng danh mục.
- Chưa xác minh backend bảo vệ quan hệ Hãng–Model, quan hệ với SKU hoặc xung đột cập nhật nhiều phiên.
- Chưa kiểm thử quyền của vai trò ngoài Super Admin.
- Chưa kiểm thử mất mạng, request chậm, bàn phím ảo, iPad/Android tablet thật, Safari hoặc dữ liệu vượt quy mô hiện tại.
- Chưa xác minh người dùng có thực sự cần nhập/xuất hàng loạt cho các danh mục này; các ý tưởng bulk chỉ là P3 cần nghiên cứu.
- Chưa xác định quy tắc hợp lệ của Mã danh mục và Thứ tự hiển thị; form không trình bày đủ để suy ra.
- Không đo Core Web Vitals hoặc tải API bằng phương pháp hiệu năng chuẩn.

## 3. Chấm điểm

### 3.1. Thang điểm tổng hợp

| Tiêu chí | Điểm | Căn cứ chính |
| --- | ---: | --- |
| Thị giác và nhất quán Vuexy | 17/20 | Đúng font/màu/bề mặt; CTA và màu Sửa chưa phân cấp tối ưu |
| Kiến trúc thông tin và thuật ngữ | 11/20 | Gom tab tốt; Mẫu/Model và Nguồn điện/Công suất chưa thống nhất |
| Tìm kiếm, lọc, sort, phân trang | 8/15 | Search/filter hoạt động; sort toàn cục sai, state không lưu |
| Chất lượng form và kiểm soát master data | 12/20 | Form gọn, có helper; thiếu tác động tham chiếu và quy tắc hiển thị |
| Responsive tablet/laptop/desktop | 6/10 | Bảng cuộn nội bộ; Mã/Tên và Sửa tách rời ở 768–1280px |
| Khả năng tiếp cận và thao tác | 7/10 | Tab/đối thoại/nhãn khá tốt; bảng thiếu ngữ nghĩa sort/caption, target nhỏ |
| Loading, lỗi và khôi phục | 3/5 | Có loading; error/no-result/empty bị trộn và không có retry |
| **Tổng** | **64/100** | **Giữ theme; sửa hành vi dữ liệu, responsive và thuật ngữ trước** |

### 3.2. Điểm theo phần/màn action

Các điểm dưới đây là heuristic riêng, không lấy trung bình để tạo điểm tổng hợp.

| Phần/action | Điểm /10 | Nhận xét |
| --- | ---: | --- |
| Khung trang và nhận diện | 8.0 | Bám Vuexy tốt, mô tả rõ đây là dữ liệu dùng tạo SKU |
| Hệ thống 5 tab | 6.5 | Gom hợp lý, bàn phím dùng được; tràn ngang và không lưu tab |
| Danh sách/bảng | 5.5 | Gọn ở desktop; action mất khỏi vùng nhìn tablet, header cuối để trống |
| Tìm kiếm/lọc | 6.5 | Hoạt động; no-result sai ngữ cảnh, thiếu clear/retry và URL state |
| Sort/phân trang | 4.5 | Lỗi sort per-page và STT không phản ánh thứ tự đang thấy |
| Tạo/Sửa Hãng | 7.0 | Form rõ, helper đổi mã; thiếu usage impact và quy tắc mã |
| Tạo/Sửa Nhóm hàng | 6.5 | Dùng chung form tốt; lifecycle/ảnh hưởng SKU chưa hiện |
| Tạo/Sửa Mẫu sản phẩm | 6.0 | Có lọc Hãng active; Hãng không bắt buộc và ràng buộc xuyên màn chưa chặt |
| Tạo/Sửa Nguồn điện | 5.5 | Form ổn; tên loại danh mục chưa khớp nghĩa dữ liệu/SKU |
| Tạo/Sửa Quy cách đóng gói | 6.0 | CRUD rõ; BODY_ONLY/BARE cần BA làm rõ khác biệt |
| Modal tablet | 7.5 | Vừa 768px, Escape/Hủy hoạt động; vùng chạm còn nhỏ |

## 4. Ảnh chụp trạng thái dữ liệu

Số liệu tại thời điểm khảo sát:

| Tab | Tổng | Ngừng sử dụng đã xác minh | Phân trang mặc định | Ghi chú |
| --- | ---: | ---: | ---: | --- |
| Hãng | 12 | 2 | 2 trang | ROBIN, SUMO ngừng sử dụng |
| Nhóm hàng | 26 | 3 | 3 trang | MANUAL_SPRAYER, CARBURETOR_ENGINE, LEGACY_ACCESSORY |
| Mẫu sản phẩm | 21 | 3 | 3 trang | MDL-RB-EY, MDL-SM-QB, MDL-HN-V1 |
| Nguồn điện | 9 | 1 | 1 trang | KEROSENE ngừng sử dụng |
| Quy cách đóng gói | 8 | 1 | 1 trang | REFURB ngừng sử dụng |

Số đang sử dụng được tính từ tổng trừ số Ngừng sử dụng đã xác minh: Hãng 10, Nhóm hàng 23, Mẫu sản phẩm 18, Nguồn điện 8, Quy cách đóng gói 7.

Điểm đối chiếu quan trọng với màn SKU:

- Form Tạo Mẫu sản phẩm hiển thị 10 Hãng đang sử dụng, khớp số Hãng active ở màn hiện tại.
- Có 18 Mẫu sản phẩm đang sử dụng.
- Báo cáo SKU đính kèm đã xác nhận sau khi chọn Hãng Hoa Nam, dropdown Model vẫn liệt kê đủ 18 model của nhiều Hãng.
- Vì vậy lỗi “Model chưa lọc theo Hãng” có bằng chứng chéo từ hai màn, không phải suy đoán dựa trên tên dữ liệu.

Hai model ngừng sử dụng `MDL-RB-EY` và `MDL-SM-QB` hiển thị Hãng là “—”; `MDL-HN-V1` còn Hãng Hoa Nam. Đây là dữ liệu quan sát, không kết luận mô hình quan hệ đúng hay sai.

## 5. Responsive từ tablet trở lên

Chiều rộng là CSS pixel. Bảng dùng vùng cuộn ngang riêng; toàn document không tràn ngang trong các kích thước đã đo.

Đo trên tab Mẫu sản phẩm, 10 dòng/trang:

| Viewport | Vùng main | Vùng nhìn thấy bảng / độ rộng bảng | Vùng nhìn thấy tab / nội dung tab | Kết luận |
| --- | ---: | ---: | ---: | --- |
| 768×1024 | 760px | 652 / 952px | 572 / 693px | Bảng và tab đều cuộn; action Sửa ở ngoài màn ban đầu |
| 900×768 | 892px | 780 / 952px | 780 / 780px | Bảng vẫn cuộn; chiều cao làm việc thấp |
| 1024×768 | 676px khi sidebar mở | 560 / 952px | 480 / 693px | Trường hợp xấu nhất: sidebar làm cả tab và bảng rất hẹp |
| 1280×720 | 932px khi sidebar mở | 816 / 952px | 816 / 816px | Bảng vẫn cuộn ngang |
| 1440×900 | 1092px | 976 / 974px | 976 / 976px | Bảng vừa trong vùng nội dung |
| 1920×1080 | 1572px | 1456 / 1454px | 1456 / 1456px | Dư không gian, không cuộn bảng |

### 5.1. Rủi ro thao tác tại tablet/laptop nhỏ

Ở 1024×768, lúc bảng ở đầu bên trái người dùng thấy STT, Mã, Tên, Hãng và một phần Mô tả nhưng không thấy Trạng thái/Sửa. Sau khi cuộn sang phải để thấy Trạng thái và Sửa, Mã và Tên đã rời khỏi màn; chỉ còn một phần Hãng/Mô tả. Nhân viên có thể sửa nhầm bản ghi vì đối tượng và action không xuất hiện cùng lúc.

Tại 768px, tablist có vùng nhìn 572px nhưng nội dung 693px; “Quy cách đóng gói” bị cắt một phần. Tại 1024px với sidebar mở, vùng tab chỉ còn 480px. Tab vẫn điều hướng được bằng bàn phím, nhưng dấu hiệu còn tab bên phải chưa đủ rõ bằng mắt/chạm.

Footer cố định cao khoảng 54px làm giảm vùng làm việc. Ở 1440×900, main cao khoảng 766px trong khi nội dung cao khoảng 1006px; cần cuộn để thấy cuối danh sách/phân trang.

### 5.2. Yêu cầu responsive giao DEV

- Sticky Mã + Tên bên trái và Sửa bên phải; nền/viền/z-index phải ngăn chữ chồng khi cuộn.
- Nếu không dùng sticky, chuyển 768–1024px sang hàng mở rộng: dòng chính gồm Mã, Tên, Trạng thái, Sửa; Hãng/Mô tả nằm trong phần mở rộng.
- Không dùng `overflow-x: hidden` để che cột.
- Tab 5 mục có thể cuộn nhưng phải có gradient/chevron rõ, nút cuộn có accessible name và tự đưa tab đang chọn vào vùng nhìn.
- Phương án thay thế: 768–1024px dùng select “Loại danh mục” hoặc tab hai hàng, nhưng chỉ chọn một mẫu sau kiểm thử thực tế; không triển khai đồng thời nhiều cơ chế.
- Toolbar tại 768–1024px chia nhóm có chủ đích: search + trạng thái; page-size + CTA Tạo. Không để CTA trôi thành hàng riêng không liên hệ.
- QA với tên dài, mô tả 2.000 ký tự, trạng thái ngừng sử dụng và 50 dòng/trang.

## 6. Kiến trúc thông tin và thuật ngữ

### 6.1. Tên màn “Danh mục sản phẩm”

Mô tả trang nói rõ đây là Hãng, Nhóm hàng, Mẫu sản phẩm, Nguồn điện và Quy cách đóng gói dùng khi tạo SKU. Vì vậy tên màn có thể bị hiểu nhầm là danh sách sản phẩm/SKU thay vì các danh mục tham chiếu.

Đề xuất BA/UX cân nhắc một trong các hướng:

- Giữ tên hiện tại nhưng đổi subtitle nổi bật thành “Danh mục tham chiếu dùng khi tạo và sửa SKU”.
- Hoặc đổi tên thành “Danh mục thuộc tính SKU”/“Danh mục tham chiếu SKU”.

Không tự đổi tên trước khi PO xác nhận vì thuật ngữ có thể đã được dùng trong tài liệu đào tạo.

### 6.2. Mẫu sản phẩm và Model

Màn hiện tại dùng “Mẫu sản phẩm”; màn SKU trong báo cáo đính kèm dùng “Model”. Hai nhãn chỉ nên cùng tồn tại nếu hệ thống giải thích chúng là một khái niệm.

Yêu cầu:

- Chốt một nhãn chính; có thể hiển thị lần đầu “Mẫu sản phẩm (Model)” rồi dùng nhất quán.
- API/DB có thể giữ tên kỹ thuật, nhưng UI, template Excel, validation và báo cáo phải dùng cùng từ điển.
- Search, header, form và thông báo lỗi phải theo nhãn đã chốt.

### 6.3. Nguồn điện và Công suất — cần BA xác nhận trước khi sửa

Danh mục “Nguồn điện” quan sát gồm: Điện lưới trực tiếp, Pin/ắc quy, Dầu diesel, Xăng, Năng lượng mặt trời, Hybrid xăng–điện, Khí nén, Cơ tay và Dầu hỏa. Đây là tập nguồn năng lượng/cơ chế vận hành, không phải chỉ điện.

Báo cáo SKU đính kèm ghi nhận trường tương ứng trong form/chi tiết được gọi là “Công suất”, nhưng giá trị ví dụ lại là Manual/Cơ tay. Công suất thường cần đơn vị định lượng; dữ liệu hiện tại là loại nguồn/cơ chế. Đây là mâu thuẫn ngữ nghĩa quan sát được, chưa phải quyết định đổi tên.

BA cần trả lời:

- Đây là Nguồn năng lượng, Kiểu động lực, Kiểu vận hành hay một khái niệm khác?
- Hệ thống có cần trường công suất riêng theo HP/kW/V không?
- Một SKU có thể có nhiều nguồn/cơ chế không?
- Linh kiện không có động cơ nên dùng giá trị Cơ tay, Không áp dụng hay để trống?

Sau khi chốt, đồng bộ màn danh mục, SKU, Excel, báo cáo và API contract. Không chỉ sửa label riêng frontend.

### 6.4. Trạng thái trong tên dữ liệu

Nhiều tên chứa “(ngừng KD)” đồng thời có Trạng thái = Ngừng sử dụng, ví dụ Robin, Sumo, MDL-HN-V1, MANUAL_SPRAYER và REFURB.

Điểm cần BA xem lại:

- Nếu trạng thái là nguồn sự thật, không nên bắt người dùng tự duy trì thêm “ngừng KD” trong tên; khi kích hoạt lại có thể tạo mâu thuẫn.
- Nếu “ngừng kinh doanh” khác “ngừng sử dụng”, cần hai khái niệm/trường riêng và giải thích rõ.
- Lý do/ngày ngừng có thể ở metadata thay vì nhúng vào tên; đây là đề xuất, không phải yêu cầu đã duyệt.

### 6.5. BODY_ONLY và BARE

Hai quy cách quan sát có mô tả gần nhau:

- BODY_ONLY: chỉ thân máy, không kèm pin và bộ sạc.
- BARE: chỉ thân máy, không kèm phụ kiện/pin/sạc.

Có thể có khác biệt nghiệp vụ về phụ kiện, nhưng UI hiện không làm nổi bật. BA cần định nghĩa tiêu chí phân biệt; nếu khác nhau, tên/mô tả phải giúp người tạo SKU chọn đúng. Nếu đồng nghĩa, cần kế hoạch hợp nhất có kiểm tra SKU đang tham chiếu, không xóa tùy tiện.

## 7. Đánh giá danh sách, search, filter, sort và pagination

### 7.1. Cấu trúc chung của 5 tab

Mỗi tab có:

- Search theo mã/tên.
- Lọc trạng thái Tất cả/Đang sử dụng/Ngừng sử dụng.
- Số dòng 10/20/50.
- CTA Tạo theo loại.
- Bảng STT, Mã, Tên, Mô tả, Trạng thái và Sửa; Mẫu sản phẩm thêm cột Hãng.
- Tổng số và pagination.

Điểm tốt là cấu trúc nhất quán. Tuy nhiên, cột action cuối không có nhãn hiển thị hoặc accessible name quan sát được; cần ghi “Hành động”.

### 7.2. Search và no-result

Tìm `HOANAM` trong Hãng trả về đúng một bản ghi. Tìm `ZZZ-KHONG-TON-TAI` trả “Chưa có hãng nào. Tổng 0 hãng”. Nội dung này giống trạng thái hệ thống chưa có dữ liệu, không phải không khớp điều kiện tìm kiếm.

Yêu cầu:

- Không có dữ liệu gốc: “Chưa có hãng nào” + CTA Tạo nếu có quyền.
- Không khớp tìm kiếm: “Không tìm thấy hãng phù hợp ‘…’” + Xóa tìm kiếm.
- Không khớp bộ lọc: nêu trạng thái đang lọc + Xóa bộ lọc.
- Error: thông báo lỗi + Thử lại; không hiển thị Tổng 0 như dữ liệu hợp lệ.
- Loading: giữ vùng bảng ổn định, không nhấp nháy “Tổng 0” trước khi response về.

### 7.3. Lỗi tải Nhóm hàng

Lần đầu mở tab Nhóm hàng, giao diện lần lượt hiển thị “Đang tải… Tổng 0”, sau đó đồng thời “Không tải được danh mục.” và “Chưa có nhóm hàng nào. Tổng 0 nhóm hàng”. Không có nút Thử lại quan sát được. Khi chuyển qua tab khác rồi quay lại, tải thành công 26 nhóm hàng. Log trình duyệt mức error/warning tại cuối khảo sát không còn bản ghi hỗ trợ xác định nguyên nhân.

Kết luận đúng phạm vi: frontend đã trộn error với empty state và không có recovery action rõ. Không kết luận API hay database là nguyên nhân.

### 7.4. Lỗi sort toàn tập và STT

Kịch bản tái hiện trên Hãng:

1. Mặc định 10 dòng/trang, tổng 12 Hãng.
2. Bấm Mã hãng A→Z; nhãn sort đổi thành hành động kế tiếp Z→A.
3. Trang 1: DONGCHENG, HOANAM, HONDA, HUSQVARNA, KUBOTA, MAKITA, MITSUBISHI, STIHL, TOTAL, YANMAR.
4. Trang 2: ROBIN, SUMO.

Nếu sort toàn bộ 12 Hãng A→Z, ROBIN/SUMO phải đứng trước một số mã STIHL/TOTAL/YANMAR ở trang 1. Vì vậy sort đang áp dụng theo trang hoặc sort/pagination không dùng cùng hợp đồng.

STT trang 1 sau sort hiển thị 3, 2, 6, 1, 4, 7, 9, 8, 10, 5 thay vì 1–10 theo vị trí đang thấy. Điều này làm cột STT mất nghĩa đối với người dùng.

Yêu cầu DEV:

- Thứ tự xử lý: filter → sort toàn tập → paginate.
- Backend/API nhận field/direction hoặc hợp đồng tương đương; frontend không sort riêng mảng trang.
- Khi đổi sort, về trang 1; STT tính lại theo `(page−1)×pageSize+index+1` của thứ tự sau sort.
- Thêm test qua ranh giới trang cho Hãng, Nhóm hàng và Mẫu sản phẩm.
- Chốt null/“—”, tiếng Việt, chữ hoa/thường và mã có số.
- Cập nhật `aria-sort` trên header đang sort.

### 7.5. Trạng thái tab và URL

URL giữ nguyên `?screen=MST-CAT-01` khi đổi tab, search, filter, sort hoặc trang. Khi lọc Nhóm hàng = Ngừng sử dụng, chuyển sang Hãng rồi quay lại Nhóm hàng, filter trở về Tất cả và trang về 1.

Yêu cầu:

- URL hoặc state restoration phải giữ `catalogType`, `q`, `status`, `sort`, `page`, `pageSize`.
- Back/forward phải chuyển đúng view, không chỉ đổi URL.
- Có thể giữ state riêng theo từng tab trong session; hành vi cụ thể cần PO chọn, nhưng không nên mất ngữ cảnh âm thầm.
- Không đưa token/quyền/dữ liệu nhạy cảm vào URL.

### 7.6. Thứ tự hiển thị bị ẩn khỏi danh sách

Mọi form có trường “Thứ tự hiển thị”; Tạo mặc định 0. HUSQVARNA quan sát là 0; MANUAL_SPRAYER là 90. Bảng không có cột này và không có sort theo Thứ tự hiển thị.

Đề xuất:

- Nếu thứ tự là nghiệp vụ thật, hiển thị cột “Thứ tự” và cho sort; mô tả 0 có ý nghĩa gì, số nhỏ/lớn ưu tiên ra sao và phạm vi hợp lệ.
- Hoặc dùng drag/drop có số thứ tự và xác nhận lưu hàng loạt nếu quy mô nhỏ.
- Nếu trường chỉ phục vụ kỹ thuật và người dùng không cần quản trị, bỏ khỏi form để tránh thay đổi không hiểu hậu quả.

## 8. Đánh giá các form Tạo/Sửa

### 8.1. Form dùng chung

Hãng, Nhóm hàng, Nguồn điện và Quy cách đóng gói dùng cùng cấu trúc:

- Mã — bắt buộc; `maxlength=80` quan sát trong DOM.
- Tên — bắt buộc; `maxlength=200`.
- Mô tả — tùy chọn; `maxlength=2000`.
- Thứ tự hiển thị — mặc định 0.
- Trạng thái — bắt buộc theo nhãn; mặc định Đang sử dụng.
- Đóng, Hủy, Lưu.

Form Mẫu sản phẩm thêm Hãng và helper “Chỉ hiển thị các hãng đang sử dụng.” Hãng không có dấu bắt buộc quan sát được.

Điểm cần sửa:

- Không có helper nhìn thấy cho quy tắc Mã: có tự viết hoa không, cho dấu cách/ký tự Việt/underscore/hyphen không, unique không phân biệt hoa thường hay không.
- Thứ tự hiển thị đang là input text, không có min/max/range helper quan sát được. Dùng numeric input hoặc validation số rõ; range do BA chốt.
- Mô tả tối đa 2.000 ký tự nhưng không có character counter quan sát được.
- Nút Lưu đang enabled khi trường bắt buộc trống. Có thể vẫn hợp lệ nếu submit hiển thị lỗi tốt; vì chưa submit, không kết luận thiếu validation.
- CTA Lưu dùng tím nhạt tương tự secondary; nên tăng phân cấp cho action chính trong modal mà không phủ tím toàn màn.
- Vùng chạm Lưu/Hủy khoảng 38px và Đóng 34px; mục tiêu tablet nên 44–48px.

### 8.2. Sửa mã danh mục

Trong form Sửa, Mã vẫn là text field có thể nhập. Helper ghi “Nếu mã đã được SKU sử dụng thì hệ thống sẽ không cho phép đổi.” Đây là safeguard tốt về ý tưởng nhưng người dùng chỉ biết khi mở form; chưa thấy trạng thái đã/không được phép đổi.

Đề xuất:

- API trả `usageCount`/`canChangeCode` hoặc tín hiệu tương đương.
- Nếu không được đổi, disable field ngay và nêu “Đang được 125 SKU sử dụng”; số chỉ là ví dụ UI, không phải dữ liệu thực.
- Nếu được đổi, cảnh báo mã là khóa nghiệp vụ và hiển thị nơi sẽ thay đổi; backend giao dịch nguyên tử.
- Không dựa vào helper rồi chờ submit thất bại nếu frontend đã có thể biết trước.

### 8.3. Sửa trạng thái và tác động tham chiếu

Dropdown Trạng thái có Đang sử dụng/Ngừng sử dụng. Không có usage count hoặc khối tác động trong form đã xem. Chưa bấm Lưu nên chưa biết hệ thống có confirm sau đó hay không.

BA/DEV cần chốt:

- Ngừng sử dụng có chỉ ngăn chọn cho SKU mới hay ảnh hưởng SKU hiện có?
- SKU hiện có vẫn hiển thị tên cũ hay chuyển thành “không hợp lệ”?
- Có cho kích hoạt lại không?
- Model của Hãng ngừng sử dụng xử lý thế nào?
- Danh mục đang dùng trên ứng dụng phân vùng có cần đồng bộ lại không?

Tiêu chí UI: trước Lưu, hiển thị số đối tượng tham chiếu và hậu quả cụ thể; không dùng cảnh báo chung “Bạn có chắc?”.

### 8.4. Hãng

Tạo/Sửa Hãng có Mã, Tên, Mô tả, Thứ tự và Trạng thái. HUSQVARNA được mở để xem Sửa, không thay đổi.

Đề xuất:

- Giữ mã ổn định; tên là nhãn người dùng có thể điều chỉnh.
- Nếu Hãng ngừng sử dụng, form Mẫu sản phẩm đã loại khỏi dropdown tạo mới — đây là hành vi tốt cần duy trì.
- Khi sửa/ngừng Hãng, hiển thị số Model và SKU liên quan; chưa thấy tại surface hiện tại.

### 8.5. Nhóm hàng

Nhóm hàng có tổng 26, trong đó 3 ngừng sử dụng. Form của MANUAL_SPRAYER quan sát Thứ tự hiển thị 90 và Trạng thái Ngừng sử dụng; không có usage count hay lịch sử.

Đề xuất:

- Nếu Nhóm hàng quyết định quy tắc serial, định mức, báo cáo hoặc hiển thị app, phải nêu tác động; chưa có bằng chứng hiện tại nên cần BA xác nhận.
- Không nhúng lifecycle vào tên nếu status đã là nguồn sự thật, trừ khi BA xác định “ngừng KD” là khái niệm khác.
- Thêm link xem SKU đang dùng danh mục nếu quyền cho phép; đây là đề xuất tăng khả năng kiểm tra trước thay đổi.

### 8.6. Mẫu sản phẩm

Mẫu có Mã, Tên, Hãng, Mô tả, Thứ tự và Trạng thái. Dropdown tạo mới chỉ có 10 Hãng active. Có 3 Mẫu ngừng sử dụng; hai bản ghi hiển thị Hãng “—”.

Điểm cần BA/DEV xử lý:

- Hãng có bắt buộc cho Mẫu active không? Form hiện không đánh dấu bắt buộc.
- Có cho đổi Hãng của Model đã được SKU dùng không? Nếu có, SKU đang tham chiếu Model và Hãng riêng có thể trở nên không nhất quán.
- Khi Hãng ngừng sử dụng, Model active của Hãng đó có tự ngừng hay chỉ bị chặn tạo mới?
- SKU form phải lọc Model theo Hãng và backend kiểm tra lại quan hệ.

Không đề xuất tự động cascade trạng thái trước khi BA chốt, vì có thể ảnh hưởng nhiều SKU.

### 8.7. Nguồn điện

Form CRUD giống các danh mục đơn giản và có một bản ghi KEROSENE ngừng sử dụng. Vấn đề chính là semantic, không phải bố cục form.

Yêu cầu ưu tiên: chốt tên khái niệm và đồng bộ với SKU trước khi thêm trường/option mới. Nếu tồn tại Công suất định lượng, tách khỏi danh mục nguồn/cơ chế.

### 8.8. Quy cách đóng gói

Có 8 quy cách, 1 ngừng sử dụng. BODY_ONLY và BARE gần nghĩa; cần BA xác nhận tiêu chí chọn. Không hợp nhất/xóa khi chưa biết SKU đang tham chiếu.

Đề xuất form bổ sung ví dụ chọn hoặc trường cấu trúc như có pin/có sạc/có phụ kiện chỉ khi nghiệp vụ cần báo cáo hoặc validation; không tạo thêm dữ liệu chỉ để làm UI phức tạp.

## 9. Thị giác và baseline Vuexy

Token quan sát:

- Body: Public Sans, nền `rgb(248,247,250)`, chữ gần `rgba(47,43,61,.9)`.
- Tab chọn: tím `rgb(115,103,240)`.
- CTA Tạo: chữ/viền `rgb(103,93,216)`, nền tím alpha, radius 6px.
- Nút Sửa: chữ/viền nâu cam `rgb(152,82,14)`, nền cam alpha, radius 6px.

Đánh giá:

- Theme đã đúng baseline; không đổi sang nền/sidebar tím.
- CTA Tạo là action chính nhưng dùng style khá nhẹ. Có thể dùng tím đặc cho CTA cấp trang, giữ filter/tab nhẹ.
- Sửa đang dùng màu cam gần warning dù đây là action bình thường. Nên dùng neutral/primary secondary; dành cam cho cảnh báo hoặc thay đổi có rủi ro.
- Badge xanh cho Đang sử dụng và text “Ngừng sử dụng” giữ được ý nghĩa không phụ thuộc riêng màu.
- Cột Mô tả dài nên truncation nhất quán và có cách đọc đầy đủ bằng focus/chạm hoặc modal/row expand; không chỉ hover.

## 10. Khả năng tiếp cận và thao tác

### 10.1. Điều làm tốt

- Tablist có tên “Loại danh mục”; mỗi tab có role/selected/tabindex phù hợp cơ bản.
- ArrowRight chuyển focus sang tab kế tiếp; Enter kích hoạt tab trong kịch bản đã thử.
- Search/filter/page-size có accessible name theo loại.
- Nút Sửa chứa mã bản ghi trong accessible name.
- Dialog có role, heading cấp 2 và action rõ.
- Escape/Hủy đóng dialog; focus quay lại CTA mở form.

### 10.2. Cần cải thiện

- Tab không có `id`/`aria-controls` liên kết với tabpanel quan sát được. Bổ sung panel semantics nếu dùng pattern tab chuẩn.
- Table không có caption/`aria-label`/`aria-labelledby` quan sát được.
- Header không có `scope` và không có `aria-sort`; nút sort chỉ mô tả thao tác kế tiếp.
- Header action cuối để trống cả text thị giác lẫn accessible name trong snapshot DOM; thêm “Hành động”.
- Kích thước quan sát: tab 48px; search khoảng 36px; filter khoảng 39px; Tạo/Sửa/Lưu/Hủy 38px; Đóng 34px; pagination 26px. WCAG 2.2 AA dùng ngưỡng target tối thiểu 24×24 CSS px với ngoại lệ, nên không kết luận mọi control dưới 44px là vi phạm. Tuy nhiên, mục tiêu sản phẩm tablet 44–48px cho action chính/row/close sẽ giảm bấm nhầm. Tham khảo [W3C Understanding Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Pagination 26px cần kiểm tra khoảng cách, focus ring và thao tác ngón tay.
- Tab cuộn phải dùng được bằng chạm/bàn phím và có dấu hiệu còn nội dung; không dựa riêng vào gesture ngang.
- Kiểm tra focus trap trong dialog, lỗi validation được announce và focus trường đầu tiên sai. Chưa thực hiện submit nên chưa chấm phần này.

## 11. Backlog giao DEV/BA

### P0 — Chưa ghi nhận

Không ghi nhận mất dữ liệu hoặc thay đổi không thể hoàn tác vì không submit. Không được suy ra toàn bộ CRUD không có rủi ro P0.

### P1 — Sửa trước khi coi màn ổn định cho quản trị master data

| ID | Hạng mục | Chủ trì gợi ý | Tiêu chí nghiệm thu tối thiểu |
| --- | --- | --- | --- |
| CAT-P1-01 | Sort toàn tập và STT đúng | BE + FE + QA | Filter→sort→paginate; Hãng A→Z liên tục qua trang; STT 1–10/11–12 theo thứ tự thấy |
| CAT-P1-02 | Responsive nhận diện/action | FE + UX | 768–1280px luôn biết Mã/Tên nào đang Sửa; tab cuối có thể tìm/chạm rõ |
| CAT-P1-03 | Từ điển thuật ngữ | BA + UX + FE | Chốt Mẫu/Model và Nguồn điện/Công suất; đồng bộ Catalog, SKU, Excel, report |
| CAT-P1-04 | Tác động tham chiếu trước thay đổi | BE + FE + BA | Hiển thị usage count/canChange; backend chặn đổi mã/quan hệ/trạng thái không hợp lệ |
| CAT-P1-05 | Ràng buộc Hãng–Model xuyên màn | BE + FE | Model lọc theo Hãng ở SKU; đổi Hãng xử lý Model; API từ chối tổ hợp sai |
| CAT-P1-06 | Khôi phục state tab/list | FE | URL/back/forward hoặc cơ chế tương đương giữ tab, q, status, sort, page, size |
| CAT-P1-07 | Tách error/empty/no-result | FE + QA | Lỗi có Retry; không hiện “Chưa có/Tổng 0” như dữ liệu hợp lệ khi request thất bại |
| CAT-P1-08 | Chốt lifecycle danh mục | BA + BE + FE | Quy tắc Ngừng sử dụng, kích hoạt lại, parent/child và SKU hiện có được tài liệu hóa/test |

### P2 — Cải thiện hiệu quả và nhất quán

| ID | Hạng mục | Tiêu chí nghiệm thu tối thiểu |
| --- | --- | --- |
| CAT-P2-01 | Hiển thị/loại bỏ Thứ tự hiển thị | Người dùng hiểu và kiểm soát thứ tự; không còn field ẩn ý nghĩa |
| CAT-P2-02 | Phân cấp CTA | Tạo/Lưu là primary phù hợp; Sửa không dùng màu warning nếu không có rủi ro |
| CAT-P2-03 | Header Hành động | Có text thị giác và accessible name ở mọi bảng |
| CAT-P2-04 | Search recovery | No-result nêu từ khóa, có Xóa tìm kiếm/Xóa lọc |
| CAT-P2-05 | Quy tắc Mã | Helper format/unique/case; validation inline, backend thống nhất |
| CAT-P2-06 | Numeric order | Input số, range/helper theo rule BA; không nhận chuỗi mơ hồ |
| CAT-P2-07 | Character counter | Mô tả dài có counter và lỗi max-length rõ |
| CAT-P2-08 | Xem tham chiếu | Từ Hãng/Nhóm/Model mở danh sách SKU đang dùng nếu quyền cho phép |
| CAT-P2-09 | Làm rõ BODY_ONLY/BARE | Tên/mô tả hoặc cấu trúc dữ liệu giúp chọn đúng; không hợp nhất âm thầm |
| CAT-P2-10 | Lifecycle không nhúng vào tên | Nếu status là nguồn sự thật, lý do/ngày ngừng tách riêng sau BA duyệt |
| CAT-P2-11 | Tab semantics | id/aria-controls/tabpanel và điều khiển cuộn được test bàn phím/screen reader |
| CAT-P2-12 | Table semantics | Caption/name, scope, aria-sort và action header đúng |
| CAT-P2-13 | Vùng chạm tablet | Tạo/Sửa/Lưu/Hủy/Đóng hướng tới 44–48px; pagination có spacing phù hợp |
| CAT-P2-14 | Loading ổn định | Không nhấp nháy Tổng 0; giữ layout và announce trạng thái |
| CAT-P2-15 | Tối ưu chiều cao | Footer/intro không che hoặc chiếm quá nhiều vùng bảng ở 720/768px |

### P3 — Chỉ làm khi có nhu cầu đã xác nhận

| ID | Hạng mục | Điều kiện |
| --- | --- | --- |
| CAT-P3-01 | Drag/drop sắp thứ tự | Chỉ khi thứ tự hiển thị có nghiệp vụ và người dùng cần chỉnh thường xuyên |
| CAT-P3-02 | Audit history | Có metadata, quyền và nhu cầu tra cứu thay đổi master data |
| CAT-P3-03 | Bulk import/export | BA xác nhận quy mô, quyền, rollback và kiểm tra trùng |
| CAT-P3-04 | Merge danh mục trùng | Có công cụ remap SKU và preview ảnh hưởng; tuyệt đối không xóa trực tiếp |
| CAT-P3-05 | Count badge trên tab | API trả count cùng snapshot và count hữu ích cho công việc |

## 12. Tiêu chí nghiệm thu end-to-end đề xuất

### Danh sách và tab

- Mọi tab tải đúng tổng; error/no-result/empty/loading không chồng thông điệp.
- Tab, filter, sort, page và page-size khôi phục đúng qua back/forward/reload.
- Sort đúng qua ranh giới trang; STT khớp vị trí hiển thị.
- 768–1280px luôn thấy đối tượng và action cùng lúc hoặc có row detail rõ.
- Tab cuối truy cập được bằng chạm và bàn phím, có dấu hiệu cuộn.

### Tạo mới

- Mã/Tên/Trạng thái và Hãng của Model theo rule BA có required state nhất quán.
- Mã trùng/sai format cho lỗi theo trường, không mất dữ liệu đã nhập.
- Thứ tự chỉ nhận giá trị hợp lệ; Mô tả có max-length/counter.
- Chống double-submit; success chứa loại, mã, tên và action xem/sửa.
- Model chỉ nhận Hãng active nếu đó là rule; backend kiểm tra lại.

### Sửa và Ngừng sử dụng

- API trả số tham chiếu và khả năng đổi mã/trạng thái/parent.
- Field không được đổi bị disable từ đầu với lý do cụ thể.
- Trước Ngừng sử dụng, hiển thị hậu quả lên SKU hiện tại, SKU mới, Model con và ứng dụng phân vùng theo rule đã chốt.
- Không cascade âm thầm; nếu có cascade phải preview và xác nhận riêng.
- Lỗi xung đột phiên giữ dữ liệu form và cho tải bản mới/so sánh.
- Sau Lưu, bảng cập nhật từ response server; reload vẫn đúng.

### Quan hệ Catalog ↔ SKU

- Chọn Hãng Hoa Nam chỉ hiển thị Model hợp lệ của Hoa Nam.
- Đổi Hãng xóa/cảnh báo Model cũ không tương thích.
- Model ngừng sử dụng không được chọn cho SKU mới nhưng SKU cũ vẫn hiển thị nhãn đúng theo rule BA.
- Ngừng Nhóm/Nguồn/Quy cách không làm mất khả năng đọc SKU cũ.
- Các label Mẫu/Model và Nguồn/Công suất thống nhất trên form, chi tiết, bảng, import và report.

## 13. Gói yêu cầu ngắn để giao DEV

> Giữ nguyên baseline Vuexy hiện tại: Public Sans, nền sáng, card trắng, tím chỉ làm accent. Không đổi theme. Ưu tiên: (1) sort toàn tập trước pagination và tính lại STT; (2) responsive 768px+ để Mã/Tên và Sửa luôn nhận diện cùng lúc, tab cuối không bị che; (3) BA chốt từ điển Mẫu/Model và Nguồn điện/Công suất rồi đồng bộ toàn hệ thống; (4) API/UI cung cấp usage count và impact trước đổi mã/Hãng/trạng thái; (5) lọc/validate Model theo Hãng ở Catalog và SKU; (6) lưu tab/filter/sort/page vào URL hoặc state phục hồi; (7) tách loading/error/empty/no-result và thêm Retry; (8) làm rõ Thứ tự hiển thị và lifecycle Ngừng sử dụng. Không tự cascade, merge hoặc xóa danh mục trước khi BA/PO duyệt quy tắc tham chiếu.

## 14. Trạng thái cuối phiên khảo sát

- Đang ở đúng URL Danh mục sản phẩm.
- Tab Hãng, trang 1, Trạng thái Tất cả, search rỗng.
- Không còn modal/dropdown/cảnh báo mở.
- Không tạo, sửa, xóa hoặc đổi trạng thái bản ghi nào.
- Không bấm Lưu ở bất kỳ form nào.
- Viewport đã được reset về kích thước trình duyệt mặc định.
- Không cập nhật prototype, tên miền hoặc báo cáo SKU đính kèm.

