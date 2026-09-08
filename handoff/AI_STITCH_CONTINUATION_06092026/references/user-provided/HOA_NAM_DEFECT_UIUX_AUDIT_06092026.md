# HOA NAM WMS — ĐÁNH GIÁ DANH MỤC BỆNH / LỖI & CÁC MÀN ACTION

Ngày khảo sát: 06/09/2026 · Ngôn ngữ: Tiếng Việt · Phạm vi thiết bị: tablet từ 768px, laptop và desktop.

Hệ thống được khảo sát trực tiếp: https://khohoanamfe.bigk.click/master-data/defects?screen=DEF-01

Tài liệu đối chiếu cách đánh giá: `HOA_NAM_SKU_UIUX_AUDIT_05092026.md` do chủ dự án đính kèm. Baseline thị giác được giữ theo ngữ cảnh dự án: Vuexy Demo 1, nền sáng, Public Sans, sắc tím dùng làm màu nhấn.

## 1. Kết luận điều hành

**Điểm tổng hợp: 64/100 — giao diện sạch, cấu trúc CRUD đơn giản và modal dùng tốt từ 768px, nhưng lỗi sắp xếp toàn tập, breakpoint 1024px làm mất khả năng đọc mô tả và thiếu cơ chế bảo vệ khi sửa dữ liệu danh mục đang được nghiệp vụ bảo hành sử dụng.**

Không cần đổi theme hoặc tăng độ phủ màu tím. Màn hiện tại đã đi đúng hướng thị giác Vuexy. Phần cần ưu tiên là tính đúng của danh sách, khả năng đọc trên tablet/laptop nhỏ, bảo toàn dữ liệu nhập và quy tắc an toàn khi thay đổi mã/trạng thái.

Bảy việc nên giao DEV/BA trước:

1. Sửa sắp xếp thành sắp xếp toàn bộ kết quả trước khi phân trang; hiện tại từng trang bị sắp riêng và thao tác sort không đưa người dùng về trang 1.
2. Sửa breakpoint 1024px: sidebar xuất hiện làm main chỉ còn 684px, vùng bảng hữu dụng khoảng 590px và cả 15 mô tả trên trang đều bị cắt.
3. Cung cấp cách đọc đầy đủ mô tả bằng chạm/bàn phím; thuộc tính `title` chỉ phù hợp chuột hover, không giải quyết tablet.
4. Chốt với BA/BE quy tắc thay đổi Mã lỗi và Ngừng sử dụng khi danh mục có thể đã được hồ sơ bảo hành tham chiếu; frontend hiện cho sửa cả hai.
5. Thêm cảnh báo thay đổi chưa lưu; đã tái hiện việc sửa mô tả rồi nhấn Escape và modal đóng ngay, không cảnh báo.
6. Đưa tìm kiếm, lọc, sort, trang và số dòng vào URL để reload/back/forward không làm mất ngữ cảnh.
7. Chuẩn hóa thuật ngữ “bệnh / lỗi”, “lỗi / bệnh”, “danh mục lỗi” và “Thêm lỗi” sau khi BA/PO chọn một cách gọi chính thức.

Đây là đánh giá chuyên gia dựa trên quan sát giao diện và hành vi trực tiếp. Đây không phải kiểm thử bảo mật, kiểm toán toàn bộ dữ liệu bảo hành, nghiên cứu người dùng hoặc chứng nhận WCAG. Điểm 64/100 dùng để ưu tiên cải tiến, không có nghĩa 64% chức năng hoạt động.

### 1.1. Những gì nên giữ

- Public Sans, nền `rgb(248, 247, 250)`, bề mặt trắng và tím làm màu nhấn.
- Breadcrumb Trang chủ → Danh mục → Danh mục bệnh / lỗi.
- Tiêu đề, mô tả ngắn, phạm vi Toàn hệ thống và vai trò Super Admin rõ.
- Cấu trúc danh sách gọn: tìm kiếm, lọc trạng thái, số dòng, Thêm và bảng.
- Trạng thái có text “Đang sử dụng”/“Ngừng sử dụng”, không phụ thuộc riêng màu.
- Modal rộng 576px, cao khoảng 369px; form Thêm/Sửa vừa ở 768×1024.
- Modal có `role="dialog"`, `aria-modal="true"`, ẩn nền khỏi cây truy cập, giữ focus trong modal và trả focus về nút mở khi đóng.
- Form dùng nhãn trường rõ, đánh dấu Mã lỗi và Tên lỗi / bệnh là bắt buộc.
- Không có action Xóa trực tiếp được quan sát. Với master data đã có khả năng được tham chiếu, tránh hard-delete là hướng an toàn cho tới khi nghiệp vụ xác nhận khác.

### 1.2. Những điều không được suy diễn thành yêu cầu thay đổi

- Không đổi sidebar hoặc toàn bộ màn thành màu tím; tím chỉ là accent theo baseline đã duyệt.
- Không yêu cầu đổi framework chỉ vì dùng Vuexy làm baseline thị giác.
- Không thiết kế cho điện thoại; phạm vi bắt đầu từ 768px.
- Không kết luận Mã lỗi chắc chắn là khóa tham chiếu trong cơ sở dữ liệu. Chỉ xác nhận UI cho sửa và màn tự mô tả danh mục được dùng cho bảo hành.
- Không kết luận thay đổi trạng thái hiện tại sẽ làm hỏng hồ sơ cũ; hậu quả phải do BA/BE xác nhận.
- Không kết luận hệ thống thiếu validation chỉ vì nút Lưu đang bật khi form trống; chưa bấm Lưu nên chưa kiểm chứng validation submit.
- Không tự đặt quy tắc mã, chuẩn viết hoa, quy tắc trùng, cách gộp mã hoặc điều kiện Ngừng sử dụng.
- Không tự đổi tên các bản ghi có hậu tố “(ngừng dùng)”; đây có thể là dữ liệu lịch sử.
- Không yêu cầu View, Import, Export, gộp mã hoặc audit history như chức năng bắt buộc nếu PO chưa xác nhận nhu cầu.

## 2. Phương pháp, độ phủ và giới hạn

### 2.1. Đã thực hiện

- Khảo sát trong phiên đăng nhập do người dùng cung cấp; vai trò hiển thị là Super Admin.
- Đọc nội dung thực tế, cây truy cập, cấu trúc DOM/CSS, thuộc tính trường và trạng thái nút.
- Đo bố cục tại 768×1024, 900×768, 1024×768, 1280×720, 1440×900 và 1920×1080.
- Kiểm tra trang 1 và trang 2, tổng số bản ghi, số dòng/trang và tùy chọn phân trang.
- Tìm chính xác `DEF-001` và thử một từ khóa không tồn tại để xem empty state.
- Lọc Ngừng sử dụng và ghi nhận ba bản ghi trả về.
- Sắp Mã lỗi A → Z trên trang 2, sau đó đối chiếu trang 1 để kiểm tra sort toàn tập.
- Mở form Thêm, đọc toàn bộ trường, giới hạn ký tự, mặc định trạng thái và trạng thái nút.
- Mở form Sửa của `DEF-901`, đọc dữ liệu và quyền chỉnh sửa của từng trường.
- Thay đổi cục bộ Mô tả bằng hậu tố `[KHÔNG LƯU]`, nhấn Escape để kiểm tra dirty guard; mở lại và xác minh dữ liệu gốc còn nguyên.
- Kiểm tra chuỗi focus trong modal, focus trap, `aria-modal`, trạng thái nền và return focus.
- Đọc console cảnh báo/lỗi trong phiên; không thấy warning/error tại thời điểm kiểm tra.
- Kết thúc ở trạng thái mặc định và reset viewport thử nghiệm.

### 2.2. Không thực hiện và chưa kiểm chứng

- Không bấm Lưu ở form Thêm hoặc Sửa; không tạo, sửa, đổi mã hoặc đổi trạng thái dữ liệu thật.
- Không kiểm tra lỗi bắt buộc/format/trùng mã sau submit và không kiểm tra thông báo thành công/thất bại.
- Không thử double-submit, mất mạng, request chậm, lỗi server hoặc xung đột hai phiên.
- Không kiểm tra quyền theo vai trò khác Super Admin.
- Không xác minh danh mục nào đang được phiếu/hồ sơ bảo hành tham chiếu.
- Không kiểm tra màn chọn bệnh/lỗi bên trong hành trình tạo/sửa hồ sơ bảo hành.
- Không kiểm toán độ đúng nghiệp vụ của 18 bản ghi, nội dung mô tả hoặc quan hệ “đã gộp vào”.
- Không đo Core Web Vitals, API latency hay hiệu năng dữ liệu lớn.
- Không thử dữ liệu dài tới giới hạn 80/200/2000 ký tự hoặc ký tự đặc biệt.

Mọi đề xuất chưa được chứng minh là chức năng hiện có đều được ghi là **đề xuất** hoặc **cần BA/PO xác nhận**.

## 3. Chấm điểm

### 3.1. Thang điểm tổng hợp

| Tiêu chí | Điểm | Căn cứ chính |
| --- | ---: | --- |
| Thị giác và nhất quán Vuexy | 17/20 | Font, nền, card và màu nhấn đúng hướng; CTA chính còn nhạt |
| Rõ ràng thông tin và khả năng quét bảng | 11/20 | Cột ít, trạng thái rõ; mô tả bị cắt nghiêm trọng ở 1024px |
| Tìm kiếm, lọc, sắp xếp, phân trang | 7/15 | Tìm/lọc hoạt động; sort sai toàn tập và state không vào URL |
| Chất lượng hành trình Thêm/Sửa | 12/20 | Form gọn, vừa tablet; thiếu dirty guard và chưa rõ an toàn thay mã/trạng thái |
| Responsive tablet/laptop/desktop | 7/10 | 768/900 dùng được; 1024 bị thoái lùi do sidebar chiếm chỗ |
| Khả năng tiếp cận và thao tác | 7/10 | Modal/focus tốt; table semantics, tooltip và target size còn thiếu |
| Phản hồi, an toàn và khôi phục lỗi | 3/5 | Có loading/empty; chưa kiểm chứng submit, chưa bảo vệ mất thay đổi |
| **Tổng** | **64/100** | **Giữ theme, sửa logic và khả năng đọc trước** |

### 3.2. Điểm theo màn/action đã xem

| Màn/action | Điểm /10 | Nhận xét |
| --- | ---: | --- |
| Danh sách — thị giác | 7.5 | Sạch, ít nhiễu, đúng baseline |
| Danh sách — vận hành | 6.0 | Action rõ nhưng thiếu xem chi tiết và mô tả khó đọc ở breakpoint xấu |
| Tìm kiếm/lọc | 7.0 | Hoạt động đúng với kịch bản đã thử; empty state thiếu lối thoát |
| Sắp xếp/phân trang | 4.0 | Sort theo từng trang, không reset trang và STT thiếu nhất quán |
| Form Thêm | 6.5 | Gọn, required rõ; chưa có hướng dẫn mã và validation submit chưa kiểm chứng |
| Form Sửa | 5.5 | Dữ liệu rõ; mã/trạng thái đều sửa được và Escape làm mất thay đổi cục bộ không cảnh báo |
| Modal/accessibility | 7.5 | Role, modal semantics, focus trap/return focus tốt; initial focus chưa tối ưu tác vụ |

## 4. Ảnh chụp dữ liệu và cấu trúc màn

Tại thời điểm khảo sát:

- Tổng: **18 lỗi / bệnh**.
- Mặc định: **15 dòng/trang**, **2 trang**.
- Tùy chọn số dòng: 10, 15, 20, 50.
- Tìm kiếm: placeholder “Tìm mã / tên lỗi”; accessible name “Tìm lỗi/bệnh”.
- Bộ lọc trạng thái: Tất cả, Đang sử dụng, Ngừng sử dụng.
- Kết quả lọc Ngừng sử dụng: **3 bản ghi** — `DEF-901`, `DEF-902`, `DEF-903`.
- Theo phép trừ từ tổng và tập Ngừng sử dụng đã quan sát: còn **15 bản ghi không thuộc tập Ngừng sử dụng**; đây là suy ra từ hai số quan sát, không phải kiểm toán dữ liệu nguồn.
- Cột: STT, Mã lỗi, Tên lỗi / bệnh, Mô tả, Trạng thái, Hành động.
- Action cấp trang: Thêm lỗi.
- Action cấp hàng quan sát với Super Admin: Sửa.
- Không quan sát thấy Xem chi tiết, Xóa, Import, Export hoặc bulk action.

Ba bản ghi lịch sử hiển thị đồng thời hậu tố trong tên và trạng thái:

| Mã | Tên | Mô tả | Trạng thái |
| --- | --- | --- | --- |
| `DEF-901` | Lỗi tem nhãn (ngừng dùng) | Mã lỗi cũ, đã gộp vào “Thiếu linh kiện” từ 06/2026. | Ngừng sử dụng |
| `DEF-902` | Lỗi bao bì (ngừng dùng) | Mã lỗi cũ dùng cho khiếu nại bao bì, không còn áp dụng. | Ngừng sử dụng |
| `DEF-903` | Lỗi không xác định (ngừng dùng) | Mã tạm thời thời kỳ đầu, đã thay bằng bộ mã chi tiết. | Ngừng sử dụng |

Không tự động coi hậu tố là lỗi dữ liệu. BA cần xác định liệu tên phải là định danh lịch sử bất biến hay có thể tách hoàn toàn vòng đời sang trường Trạng thái.

## 5. Responsive từ tablet trở lên

### 5.1. Số đo thực tế

Kích thước là CSS pixel. Trang không tạo horizontal overflow ở cấp `body` trong các viewport đã đo.

| Viewport | Sidebar | Main | Vùng bảng hữu dụng / table | Quan sát |
| --- | ---: | ---: | ---: | --- |
| 768×1024 | Ẩn | 768px | 682 / 682px | Tất cả cột và Sửa cùng xuất hiện; mô tả bị giới hạn hai dòng |
| 900×768 | Ẩn | 900px | 810 / 810px | Toolbar một hàng, bảng dùng được |
| 1024×768 | 340px | 684px | 590 / 609px | Breakpoint xấu nhất; Add xuống hàng, action phải cuộn nhẹ, mô tả bị ép rất hẹp |
| 1280×720 | 340px | 940px | 846 / 846px | Bảng vừa, nhưng chiều cao làm việc thấp |
| 1440×900 | 340px | 1100px | 1006 / 1006px | Bảng vừa trọn, bố cục ổn |
| 1920×1080 | 340px | 1580px | 1486 / 1486px | Dư không gian; bảng dễ đọc |

### 5.2. Thoái lùi tại breakpoint 1024px — P1

Ở 900px, sidebar ẩn và bảng có khoảng 810px. Tăng viewport lên 1024px làm sidebar 340px xuất hiện, khiến bảng chỉ còn khoảng 590px. Đây là hiện tượng **viewport rộng hơn nhưng nội dung nghiệp vụ hẹp hơn khoảng 220px**.

Tại 1024px:

- Cột Mô tả chỉ còn khoảng 72px ở cấp cell và khoảng 52px cho nội dung sau padding.
- Cả **15/15 mô tả đang hiển thị** bị cắt theo phép đo `scrollHeight > clientHeight`.
- Table rộng 609px trong vùng cuộn hữu dụng 590px; phần cuối cột Hành động cần cuộn nhẹ để nhìn đầy đủ.
- Nút Thêm lỗi bị đẩy xuống hàng riêng bên trái, tạo thứ bậc toolbar không ổn định so với 900/1280px.

Tại 768px, phần nội dung mô tả rộng khoảng 120px nhưng **14/15 mô tả trên trang đo** vẫn bị cắt. Phần text đầy đủ tồn tại trong thuộc tính `title`; cách này dùng được bằng hover chuột nhưng không phải cơ chế đáng tin cậy cho chạm hoặc bàn phím.

### 5.3. Yêu cầu responsive giao DEV

- Không để sidebar mở 340px ở breakpoint khiến main giảm mạnh. Chọn một trong hai hướng và kiểm thử:
  - giữ sidebar dạng overlay/thu gọn đến khi viewport đủ rộng; hoặc
  - giữ sidebar nhưng chuyển bảng 768–1199px sang cột ưu tiên.
- Hướng cột ưu tiên được khuyến nghị cho màn này: Mã, Tên, Trạng thái, Hành động luôn hiển thị; Mô tả nằm trong hàng mở rộng hoặc drawer đọc chi tiết.
- Nếu giữ Mô tả trong bảng, đặt min-width hợp lý và cho cuộn ngang có chủ đích; không ép mô tả xuống vùng 52px.
- Không dùng `overflow: hidden` như cách duy nhất để “vừa màn”. Nội dung cắt phải có đường đọc bằng chạm/focus.
- Ở 1024px, gom toolbar thành hai nhóm rõ: hàng tìm/lọc; hàng tổng kết quả + page size + action Thêm. CTA chính nên ở cuối hàng, không rơi riêng về trái.
- QA tối thiểu tại 768×1024, 900×768, 1024×768, 1280×720, 1440×900, 1920×1080; kiểm tra cả sidebar mở/thu gọn và chuỗi 200/2000 ký tự.

## 6. Đánh giá màn danh sách

### 6.1. Header và định vị

Điểm tốt:

- Breadcrumb, tiêu đề và mô tả ngắn xác định rõ phạm vi.
- Badge Toàn hệ thống và Super Admin giúp nhận biết ngữ cảnh quyền/phạm vi.
- Nhãn section “DANH MỤC” phù hợp hệ thống quản trị.

Cần cải thiện:

- Ở desktop, logo “Hoa Nam WMS” và tên trang đều xuất hiện như heading cấp 1 trong cây truy cập. Nên giữ tên trang là `h1`; thương hiệu không cần là `h1` thứ hai.
- Mô tả “Danh mục bệnh / lỗi dùng cho bảo hành.” có giá trị, nhưng thuật ngữ không đồng nhất với “Tên lỗi / bệnh” trong bảng.

### 6.2. Thuật ngữ cần BA/PO chốt

Các biến thể đã quan sát:

- Tên trang: “Danh mục bệnh / lỗi”.
- Cột/form: “Tên lỗi / bệnh”.
- CTA: “Thêm lỗi”.
- Modal: “Thêm lỗi / bệnh”, “Sửa lỗi / bệnh”.
- Nút Lưu: “Lưu danh mục lỗi”.
- Tổng: “Tổng 18 lỗi / bệnh”.
- Empty state: “Không có danh mục lỗi phù hợp bộ lọc.”

Không tự chọn thay BA. Yêu cầu BA/PO đưa ra một thuật ngữ chuẩn và áp dụng cho menu, breadcrumb, title, CTA, table, form, empty state, thông báo và tài liệu nghiệp vụ.

### 6.3. Tìm kiếm, lọc và empty state

Đã xác minh:

- Tìm `DEF-001` trả về đúng một bản ghi.
- Từ khóa không tồn tại hiển thị “Không có danh mục lỗi phù hợp bộ lọc.” và “Tổng 0 lỗi / bệnh”.
- Lọc Ngừng sử dụng trả về `DEF-901`, `DEF-902`, `DEF-903`.
- Xóa tìm kiếm/đổi filter phục hồi danh sách.

Vấn đề:

- Empty state không có nút Xóa tìm kiếm/Xóa bộ lọc.
- Không hiển thị chip điều kiện đang áp dụng.
- Khi đổi trang/filter, màn tạm thời hiển thị “Đang tải dữ liệu...” nhưng tổng chuyển thành 0; đây là giá trị giả trong lúc loading, dễ gây nhấp nháy và hiểu nhầm.
- URL vẫn chỉ có `?screen=DEF-01`; từ khóa, filter, sort, trang và page size không được phản ánh.

Đề xuất/tiêu chí:

- Empty state nêu điều kiện đang áp dụng và có action “Xóa tìm kiếm” hoặc “Xóa tất cả”.
- Trong loading, giữ tổng trước đó kèm trạng thái “Đang cập nhật”, hoặc dùng skeleton; không hiển thị tổng 0 trước khi response mới hoàn tất.
- Khi quay lại từ màn/form khác, giữ q/filter/sort/page/page-size và vị trí cuộn.
- Hợp đồng URL gợi ý về mặt ý nghĩa: `?screen=DEF-01&q=...&status=...&sort=code.asc&page=1&pageSize=15`. Tên tham số cụ thể do DEV chọn.
- BA xác nhận search có cần bao gồm Mô tả hay chỉ Mã + Tên như placeholder hiện tại.
- Chưa kiểm thử bỏ dấu/hoa thường/khoảng trắng; đưa vào test sau khi BA chốt quy tắc tìm kiếm.

## 7. Lỗi sắp xếp và STT

### 7.1. Lỗi sort toàn tập — P1

Kịch bản tái hiện:

1. Mặc định có 18 bản ghi, 15 dòng/trang.
2. Đi trang 2; dữ liệu mặc định là `DEF-003`, `DEF-002`, `DEF-001`.
3. Bấm Mã lỗi A → Z khi đang ở trang 2.
4. Trang vẫn ở trang 2 và chỉ ba dòng được đổi thành `DEF-001`, `DEF-002`, `DEF-003`.
5. Đi về trang 1; trang này bắt đầu `DEF-004`, `DEF-005`, `DEF-006` và kết thúc `DEF-901`, `DEF-902`, `DEF-903`.

Nếu sort toàn bộ 18 bản ghi A → Z, trang 1 phải bắt đầu từ `DEF-001`; không thể để `DEF-001` ở trang 2. Quan sát xác nhận sort đang áp dụng trong từng trang hoặc sort/pagination không dùng cùng một hợp đồng.

Yêu cầu sửa:

- Thứ tự xử lý: filter → sort toàn tập → paginate.
- Khi đổi sort, quay về trang 1.
- Backend nhận `sortField`/`sortDirection` hoặc hợp đồng tương đương; frontend không sort riêng mảng trang hiện tại.
- Thêm integration test ít nhất hai trang với dữ liệu đảo thứ tự qua ranh giới trang.
- Chốt collation cho mã, tiếng Việt, null và số; không tự ngầm chọn quy tắc.

### 7.2. STT thiếu nhất quán

Sau sort A → Z, STT vẫn giữ thứ tự cũ: trang 2 lần lượt 18, 17, 16; trang 1 bắt đầu 15, 14, 1. Khi tìm riêng `DEF-001`, STT lại hiển thị 1.

Điều này làm STT lúc là vị trí trong danh sách gốc, lúc là vị trí trong tập lọc. DEV/PO cần chọn một nghĩa:

- Nếu STT là số dòng trong view hiện tại: tính `(page - 1) × pageSize + rowIndex + 1` sau filter/sort.
- Nếu cần số nhận diện bền vững: không dùng STT, vì Mã lỗi đã là trường nhận diện.

Với tablet, có thể bỏ STT để trả không gian cho Mô tả hoặc Tên.

## 8. Đánh giá bảng dữ liệu

Điểm tốt:

- Chỉ sáu cột, không quá tải về số lượng trường.
- Mã, tên, mô tả và trạng thái đặt gần nhau theo logic đọc.
- Trạng thái dùng badge có chữ và màu ngữ nghĩa.
- Action Sửa dùng text, không phải icon-only.

Vấn đề:

- Mô tả bị giới hạn hai dòng; tại 1024px toàn bộ 15 dòng đang xem bị cắt.
- Text đầy đủ chỉ qua `title`, không dùng được ổn định với chạm/focus.
- Header Hành động có `aria-label="Hành động"` nhưng `innerText` rỗng; người dùng thị giác không thấy nhãn cột.
- Bảng không có `caption`, `aria-label` hoặc `aria-labelledby` được quan sát.
- Các `th` không có `scope`; cột sort không có `aria-sort` trạng thái hiện tại.
- Nút sort có aria-label mô tả thao tác kế tiếp, đây là điểm tốt nhưng chưa thay thế `aria-sort`.
- Mũi tên sort nhỏ và cả hai chiều cùng hiện, làm trạng thái hiện tại khó quét bằng mắt.

Yêu cầu:

- Cung cấp tên truy cập cho bảng và `scope="col"` cho header.
- Đặt `aria-sort="none|ascending|descending"` trên cột sort hiện tại.
- Hiển thị text Hành động bằng mắt.
- Cho người dùng mở Mô tả bằng row expansion/drawer hoặc control focusable; không dựa riêng vào hover.
- Nếu mô tả chỉ mang tính hỗ trợ, ưu tiên Mã + Tên + Trạng thái + Action ở tablet và chuyển Mô tả ra khỏi bảng chính.
- Không dùng màu làm tín hiệu duy nhất; giữ text trạng thái như hiện tại.

## 9. Đánh giá các màn action

### 9.1. Phạm vi action quan sát

- Cấp trang: Thêm lỗi.
- Cấp hàng: Sửa.
- Không có action Xem hoặc Xóa được quan sát với Super Admin.

Không coi thiếu Xóa là khuyết điểm. Ngừng sử dụng thường an toàn hơn xóa master data, nhưng quy tắc thực tế phải do BA/BE xác nhận.

### 9.2. Form Thêm lỗi / bệnh

Form tại 768px rộng khoảng 576px, cao 369px và vừa viewport.

| Trường | Trạng thái quan sát |
| --- | --- |
| Mã lỗi | Bắt buộc, text, tối đa 80 ký tự |
| Tên lỗi / bệnh | Bắt buộc, text, tối đa 200 ký tự |
| Mô tả | Không bắt buộc ở DOM, textarea, tối đa 2000 ký tự |
| Trạng thái | Mặc định Đang sử dụng; có Đang sử dụng/Ngừng sử dụng |

Điểm tốt:

- Chỉ bốn trường, tác vụ ngắn và dễ hiểu.
- Mã/Tên cùng hàng; Mô tả toàn chiều rộng; Trạng thái riêng.
- Nút Hủy và Lưu có nhãn rõ.
- Hai trường bắt buộc có dấu `*` và thuộc tính `required`.

Điểm cần cải thiện/kiểm chứng:

- Nút Lưu đang enabled khi form trống. Chưa bấm nên không kết luận thiếu validation; QA cần kiểm tra lỗi inline và focus lỗi đầu tiên.
- Không có helper về format Mã lỗi, viết hoa/thường, khoảng trắng, ký tự cho phép hoặc quy tắc trùng.
- Không có bộ đếm ký tự cho Mô tả 2000 ký tự; đây là đề xuất nếu người dùng thường nhập dài.
- Trạng thái mặc định Đang sử dụng cần BA xác nhận: bản ghi mới có được dùng ngay hay cần nháp/duyệt.
- Cần chống double-submit, giữ dữ liệu khi lỗi server và thông báo thành công chứa Mã + Tên vừa tạo.

### 9.3. Form Sửa lỗi / bệnh

Đã kiểm tra `DEF-901`:

- Mã lỗi: `DEF-901` — đang editable.
- Tên: `Lỗi tem nhãn (ngừng dùng)` — đang editable.
- Mô tả: `Mã lỗi cũ, đã gộp vào "Thiếu linh kiện" từ 06/2026.` — đang editable.
- Trạng thái: Ngừng sử dụng — đang editable.

Rủi ro cần làm rõ:

- Mã và trạng thái đều có thể đổi trên cùng form mà không thấy thông tin mức ảnh hưởng.
- Màn mô tả danh mục “dùng cho bảo hành”, nhưng chưa biết backend tham chiếu bằng ID hay bằng code.
- Bản ghi có thông tin “đã gộp vào” chỉ nằm trong text mô tả; chưa có bằng chứng hệ thống lưu quan hệ thay thế có cấu trúc.

Yêu cầu BA/BE trước khi DEV chốt:

- Mã có được đổi sau khi đã phát sinh tham chiếu không?
- Ngừng sử dụng chỉ ngăn chọn cho hồ sơ mới hay tác động cả hồ sơ cũ?
- Khi ngừng một mã, có bắt buộc chọn mã thay thế không?
- Hệ thống cần giữ tên lịch sử hay bỏ hậu tố “(ngừng dùng)”?
- Có cần hiển thị số hồ sơ đang dùng mã trước khi thay đổi không?

Đề xuất an toàn sau khi có câu trả lời:

- Nếu code là định danh nghiệp vụ đã được tham chiếu, khóa code khi sửa và giải thích lý do; backend cũng phải chặn.
- Nếu cho đổi code, dùng API kiểm tra trùng và hiển thị tác động; ghi audit code trước/sau.
- Khi đổi Active → Inactive, confirm phải mô tả hậu quả đúng theo rule BA, không dùng cảnh báo chung.
- Dữ liệu lịch sử phải tiếp tục đọc được sau khi ngừng sử dụng.
- Xử lý optimistic concurrency để không ghi đè im lặng thay đổi từ phiên khác.

### 9.4. Mất thay đổi khi đóng — đã tái hiện

Kịch bản:

1. Mở Sửa `DEF-901`.
2. Thêm hậu tố `[KHÔNG LƯU]` vào Mô tả ở trạng thái cục bộ.
3. Nhấn Escape.
4. Modal đóng ngay, không có cảnh báo.
5. Mở lại `DEF-901`; dữ liệu gốc vẫn nguyên, xác nhận không có thay đổi được lưu.

Đây là lỗi bảo vệ thao tác, không phải lỗi mất dữ liệu server. Người dùng có thể vô tình mất nội dung đang soạn.

Tiêu chí nghiệm thu:

- Khi form dirty, Escape, nút Đóng, Hủy và điều hướng phải dùng cùng một guard.
- Nội dung: “Bạn có thay đổi chưa lưu. Thoát và bỏ thay đổi?” với hai action rõ “Tiếp tục chỉnh sửa” và “Bỏ thay đổi”.
- Không cảnh báo khi form chưa dirty hoặc giá trị đã quay về đúng ban đầu.
- Sau lỗi lưu, modal còn mở và giữ dữ liệu người dùng.

### 9.5. Xem chi tiết

Không quan sát thấy action Xem. Hiện người dùng phải mở Sửa để đọc đầy đủ mô tả nếu nội dung bị cắt.

Đề xuất P2/P3, cần PO xác nhận:

- Cho click hàng hoặc action Xem để mở drawer read-only với Mã, Tên, Mô tả, Trạng thái và metadata nếu API có.
- Nếu người dùng không có quyền sửa, họ vẫn cần đường đọc đầy đủ dữ liệu.
- Chỉ hiển thị Sửa trong drawer khi có quyền; đóng drawer phải giữ filter/page/scroll.

## 10. Accessibility và thao tác tablet

### 10.1. Điểm tốt đã kiểm chứng

- Search và hai combobox có accessible name.
- Modal là dialog, `aria-modal="true"`, có heading liên kết và nền `aria-hidden`.
- Focus bị giữ trong modal.
- Chuỗi Tab quan sát: Đóng → Mã → Tên → Mô tả → Trạng thái → Hủy → Lưu → Đóng.
- Đóng modal đưa focus về đúng nút Thêm hoặc Sửa đã mở modal.
- Trạng thái có text; không phụ thuộc riêng màu.

### 10.2. Điểm cần sửa

- Desktop có hai heading cấp 1: thương hiệu và tên trang.
- Table thiếu accessible name/caption, `scope` và `aria-sort`.
- Header Hành động không có text nhìn thấy.
- Mô tả đầy đủ chỉ trong `title`; không bảo đảm dùng bằng bàn phím/chạm.
- Pagination có accessible label tiếng Anh: “Go to previous page”, “Go to page 2”, “Go to next page” trong UI tiếng Việt.
- Kích thước quan sát: Thêm/Sửa/Lưu khoảng 38px cao; nút Đóng 34px; pagination 26px. Không tự kết luận vi phạm chỉ từ kích thước, nhưng mục tiêu 44–48px cho thao tác chạm chính sẽ giảm bấm nhầm trên tablet.
- Initial focus của modal nằm ở container dialog; Tab đầu tiên đến nút Đóng. Với form Thêm, có thể đưa focus vào Mã lỗi; với Edit, có thể focus heading hoặc trường đầu tiên theo quyết định accessibility.
- Toast/thông báo submit chưa kiểm chứng; cần live region và thời gian hiển thị đủ đọc.

## 11. Backlog giao DEV/BA

### P0 — Chưa ghi nhận

Không ghi nhận dữ liệu thật bị thay đổi hoặc mất trong phạm vi thử. Điều này không chứng minh luồng submit không có rủi ro, vì chưa bấm Lưu.

### P1 — Cần sửa/xác nhận trước khi coi màn ổn định

| ID | Hạng mục | Chủ trì gợi ý | Tiêu chí nghiệm thu tối thiểu |
| --- | --- | --- | --- |
| DEF-P1-01 | Sort toàn tập trước pagination | BE + FE + QA | A→Z cho DEF-001…DEF-903 liên tục qua ranh giới trang; đổi sort về trang 1; test ≥2 trang |
| DEF-P1-02 | Responsive regression tại 1024px | FE + UI/UX | Viewport rộng hơn không cho vùng nghiệp vụ hẹp hơn bất hợp lý; mô tả không bị ép còn ~52px |
| DEF-P1-03 | Đọc đầy đủ mô tả trên tablet | FE + UI/UX | Có row expansion/drawer/control chạm-focus; không phụ thuộc riêng `title`/hover |
| DEF-P1-04 | Quy tắc sửa Mã và Trạng thái | BA + BE + FE | BA tài liệu hóa hậu quả; FE/BE cùng chặn hoặc confirm; lịch sử không bị mất |
| DEF-P1-05 | Dirty form guard | FE + QA | Escape/Đóng/Hủy/navigation cảnh báo khi dirty; giữ dữ liệu khi lỗi lưu |
| DEF-P1-06 | State danh sách trong URL | FE | q/status/sort/page/pageSize khôi phục đúng bằng refresh/back/forward |
| DEF-P1-07 | Validation và duy nhất Mã lỗi | BA + BE + FE | Chốt format/case/trim; FE lỗi theo trường; BE kiểm tra duy nhất; chống double-submit |

### P2 — Cải thiện hiệu suất và nhất quán

| ID | Hạng mục | Tiêu chí nghiệm thu tối thiểu |
| --- | --- | --- |
| DEF-P2-01 | Chuẩn hóa thuật ngữ | Một glossary được BA duyệt và dùng đồng nhất ở menu/title/table/form/message |
| DEF-P2-02 | Loading không báo tổng 0 giả | Loading giữ tổng cũ hoặc hiển thị trạng thái cập nhật; không nhấp nháy empty |
| DEF-P2-03 | Empty state có lối thoát | Hiển thị điều kiện áp dụng và nút xóa phù hợp |
| DEF-P2-04 | STT có nghĩa nhất quán | Tính lại sau filter/sort hoặc bỏ cột; không hiển thị 15,14,1 khi sort tăng dần |
| DEF-P2-05 | Table semantics | Caption/name, scope, aria-sort và header Hành động nhìn thấy được test |
| DEF-P2-06 | Localize pagination | Accessible label tiếng Việt cho trước/sau/trang N |
| DEF-P2-07 | CTA hierarchy | Thêm lỗi là primary tím đặc; Sửa giữ treatment phụ, không phủ tím toàn màn |
| DEF-P2-08 | Vùng chạm tablet | Action chính/hàng/close hướng tới 44–48px; pagination đạt target và spacing phù hợp |
| DEF-P2-09 | Focus khởi tạo modal | Add đưa focus đến Mã hoặc vị trí được quyết định; Edit không làm người dùng mất ngữ cảnh |
| DEF-P2-10 | Feedback submit | Success có Mã/Tên; error giữ dữ liệu; không đổi bảng trước response server |
| DEF-P2-11 | Concurrency | Hai phiên sửa cùng bản ghi không ghi đè im lặng; có tải bản mới/so sánh phù hợp |
| DEF-P2-12 | Hậu tố vòng đời trong tên | Chỉ chuẩn hóa sau BA; name/status/search/report dùng một quy tắc |
| DEF-P2-13 | Search contract | Tài liệu hóa tìm Mã/Tên/Mô tả, hoa thường, dấu và trim; test tương ứng |

### P3 — Chỉ làm sau khi PO xác nhận nhu cầu

| ID | Đề xuất | Điều kiện |
| --- | --- | --- |
| DEF-P3-01 | Drawer/Xem chi tiết read-only | Cần cho vai trò không sửa hoặc cần đọc mô tả/audit |
| DEF-P3-02 | Hiển thị số hồ sơ đang dùng mã | API có dữ liệu tác động và quyền phù hợp |
| DEF-P3-03 | Audit history | Có metadata người/thời gian/giá trị trước-sau và chính sách truy cập |
| DEF-P3-04 | Quan hệ mã thay thế khi ngừng/gộp | BA xác nhận đây là quan hệ nghiệp vụ, không chỉ ghi chú tự do |
| DEF-P3-05 | Import/Export danh mục | Chỉ khi có khối lượng và quyền nghiệp vụ thực sự cần |

## 12. Câu hỏi bắt buộc BA/PO xác nhận

1. Thuật ngữ chính thức là “Bệnh/lỗi”, “Lỗi/bệnh”, “Danh mục lỗi” hay tên khác?
2. Mã lỗi có bất biến sau khi phát sinh hồ sơ bảo hành không? Backend tham chiếu bằng ID hay code?
3. Quy tắc format/độ dài thực tế/viết hoa và duy nhất của Mã lỗi là gì?
4. Mô tả có bắt buộc không? Có cần search theo Mô tả không?
5. Ngừng sử dụng có tác động gì đến hồ sơ cũ, hồ sơ đang xử lý và danh sách chọn cho hồ sơ mới?
6. Khi mã cũ “đã gộp vào” mã mới, có cần quan hệ thay thế có cấu trúc và chuyển hướng người dùng không?
7. Hậu tố “(ngừng dùng)” trong Tên phải giữ vì lịch sử hay cần tách khỏi tên hiển thị?
8. Vai trò nào được Thêm/Sửa/Xem? Người không có quyền sửa có cần đọc đầy đủ mô tả không?
9. Có yêu cầu duyệt trước khi bản ghi mới chuyển sang Đang sử dụng không?

Không triển khai các rule trên bằng suy đoán. Chỉ sau khi BA/PO trả lời mới chuyển thành acceptance criteria nghiệp vụ cuối cùng.

## 13. Tiêu chí nghiệm thu end-to-end đề xuất

### Danh sách

- Sort toàn tập đúng qua nhiều trang; đổi sort quay về trang 1.
- STT đúng nghĩa đã chốt hoặc được bỏ.
- q/filter/sort/page/page-size tồn tại trong URL và khôi phục khi refresh/back/forward.
- Loading/empty/error/retry không làm mất điều kiện hiện tại và không hiển thị tổng sai tạm thời.
- 768–1920px không làm mất Mã, Trạng thái hoặc Hành động; mô tả đầy đủ truy cập được bằng chạm/bàn phím.
- 1024px không bị thoái lùi nghiêm trọng so với 900px do sidebar.

### Thêm/Sửa

- Required/format/duplicate validation hiển thị inline, focus lỗi đầu tiên và giữ dữ liệu.
- Backend kiểm tra lại format, uniqueness và quyền; không tin riêng frontend.
- Chống double-submit; loading trên nút không làm layout nhảy.
- Thành công cập nhật/tạo đúng hàng theo response server; thông báo có Mã và Tên.
- Lỗi server/mất mạng giữ modal và dữ liệu; retry không tạo trùng.
- Dirty guard hoạt động trên Escape, Đóng, Hủy và điều hướng.
- Quy tắc sửa code/status giống nhau ở FE và BE.
- Hai phiên sửa cùng bản ghi không ghi đè âm thầm.

### Accessibility

- Một `h1` chính cho trang.
- Dialog có tên, modal semantics, focus trap và return focus; hiện đã đạt phần lớn, cần giữ qua refactor.
- Table có accessible name, scope và aria-sort.
- Tooltip/nội dung đầy đủ dùng được bằng focus/chạm, không chỉ hover.
- Pagination và trạng thái loading/error được đọc bằng tiếng Việt.
- QA bàn phím: Tab/Shift+Tab, Enter/Space, Escape và focus sau đóng.

## 14. Gói yêu cầu ngắn để giao DEV

> Giữ nguyên baseline Vuexy: Public Sans, nền sáng, card trắng, tím chỉ làm accent. Không đổi theme và không mở phạm vi xuống điện thoại. Ưu tiên DEF-01 theo thứ tự: (1) sửa sort toàn tập trước pagination và reset trang khi sort; (2) xử lý responsive regression 1024px, không ép Mô tả còn khoảng 52px; (3) cung cấp đường đọc Mô tả bằng chạm/focus; (4) BA/BE chốt và bảo vệ thay đổi Mã/Trạng thái; (5) thêm dirty guard; (6) đồng bộ state danh sách vào URL; (7) validation/uniqueness FE+BE. Sau đó mới chuẩn hóa thuật ngữ, loading/empty state, STT, table semantics, CTA, vùng chạm và feedback. Không tự đổi tên bản ghi lịch sử, không tự đặt rule ngừng sử dụng hoặc quan hệ mã thay thế.

## 15. Trạng thái cuối phiên khảo sát

- URL đúng màn Danh mục bệnh / lỗi.
- Trang 1, 15 dòng/trang.
- Tìm kiếm trống.
- Trạng thái: Tất cả.
- Sort đã về trạng thái mặc định; nhãn thao tác là Mã lỗi A → Z.
- Bảng có 15 dòng ở trang 1; dòng đầu `DEF-006`.
- Không còn modal mở.
- Thay đổi thử `[KHÔNG LƯU]` không được lưu; mở lại đã xác minh dữ liệu gốc còn nguyên.
- Không tạo, sửa, đổi trạng thái hoặc xóa dữ liệu thật.
- Viewport thử nghiệm đã được reset.
- Không chỉnh source code, không push repo và không triển khai preview trong lượt đánh giá này.
