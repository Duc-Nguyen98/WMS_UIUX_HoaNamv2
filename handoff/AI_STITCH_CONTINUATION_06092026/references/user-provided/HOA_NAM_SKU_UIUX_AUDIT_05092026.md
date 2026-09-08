# HOA NAM WMS — ĐÁNH GIÁ DANH SÁCH SKU & CÁC MÀN ACTION

Ngày khảo sát: 05/09/2026 · Ngôn ngữ: Tiếng Việt · Phạm vi thiết bị: tablet, laptop, desktop.

Hệ thống được khảo sát trực tiếp: https://khohoanamfe.bigk.click/master-data/skus?screen=MST-01

Ngữ cảnh đối chiếu: file `HOA_NAM_WMS_CONTEXT_05092026` do chủ dự án đính kèm. Baseline thị giác: [Vuexy Demo 1](https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-1/login?to=/dashboards/analytics).

## 1. Kết luận điều hành

**Điểm tổng hợp: 63/100 — nền tảng Vuexy và cấu trúc CRUD đã khá rõ, nhưng bảng chưa tối ưu cho tablet, sắp xếp sai trên tập dữ liệu nhiều trang và một số action chưa đủ an toàn/rõ nghĩa để vận hành kho.**

Không cần đổi theme hoặc tăng độ phủ màu tím. Hệ thống hiện đã bám đúng hướng đã chốt: Public Sans, nền sáng, card trắng, màu tím làm màu nhấn. Phần cần đầu tư là hành vi của bảng, tính liên tục của bộ lọc, quan hệ dữ liệu trong form và phản hồi khi thao tác nghiệp vụ.

Tám việc nên giao DEV/BA trước:

1. Sửa sắp xếp thành sắp xếp toàn bộ tập dữ liệu trước khi phân trang; hiện trạng tái hiện được cho thấy mỗi trang bị sắp riêng.
2. Giữ đồng thời cột nhận diện SKU và cột Hành động khi cuộn ngang ở 768–1440px, hoặc chuyển sang chế độ bảng thích ứng phù hợp.
3. Sửa luồng bật/tắt hiển thị trên ứng dụng phân vùng: xung đột phiên phải có cách tải bản mới và thao tác lại thành công, không lặp cảnh báo vô hạn.
4. Đưa trạng thái tìm kiếm, lọc, sắp xếp, trang và số dòng vào URL để tải lại/chia sẻ/quay lại không mất ngữ cảnh.
5. Lọc và kiểm tra Model theo Hãng ở cả frontend lẫn backend; hiện chọn Hãng Hoa Nam vẫn nhìn thấy model của nhiều hãng.
6. Hoàn thiện chức năng chọn nhiều: hoặc xuất hiện thanh bulk action có phạm vi rõ, hoặc bỏ checkbox để tránh hứa một chức năng chưa tồn tại.
7. Làm rõ điều kiện được “Đưa lên ứng dụng”: SKU thiếu thông tin và SKU không hoạt động vẫn đang có nút action khả dụng trên giao diện.
8. Điều tra tính bền của phiên đăng nhập khi tải lại. Có lần tải lại từ bộ lọc SKU chờ điền bị chuyển về Đăng nhập; lần tải lại trong kiểm tra action hiển thị vẫn giữ phiên, nên chưa đủ căn cứ quy nguyên nhân.

Đây là đánh giá chuyên gia theo quan sát giao diện và hành vi trực tiếp, không phải nghiên cứu người dùng, kiểm thử bảo mật, kiểm toán dữ liệu kho hoặc chứng nhận WCAG toàn hệ thống. Điểm số dùng để ưu tiên cải tiến, không có nghĩa là 63% chức năng hoạt động.

### 1.1. Những gì cần giữ

- Public Sans, nền `#F8F7FA`, bề mặt trắng, chữ đậm gần `#2F2B3D` và tím `#7367F0`/`#675DD8` làm accent theo ngữ cảnh đã duyệt.
- Bố cục có tiêu đề trang, mô tả ngắn, tìm kiếm, bộ lọc, bảng và phân trang quen thuộc với phần mềm quản trị.
- Mỗi hàng có Xem, Sửa và action hiển thị ứng dụng; nhãn là động từ rõ, không chỉ dùng icon khó hiểu.
- Form Sửa khóa Mã SKU và chế độ quản lý serial khi bản ghi đã phát sinh tồn, kèm giải thích lý do.
- Modal Nhập Excel tách bước chọn tệp, kiểm tra trước và nhập dữ liệu; action chính bị khóa khi chưa có tệp.
- Cảnh báo import ghi rõ nguyên tắc nguyên tử: có lỗi thì không tạo/cập nhật SKU nào.
- Chi tiết và form hai cột vẫn dùng được ở viewport 768px trong trạng thái đã đo.
- Hộp xác nhận bật hiển thị nêu đúng SKU và hậu quả hiển thị trên ứng dụng phân vùng.

### 1.2. Những điều không được suy diễn thành yêu cầu thay đổi

- Không đổi sidebar/nền trang thành tím và không phủ tím toàn giao diện.
- Không yêu cầu đổi framework chỉ vì dùng Vuexy làm baseline thị giác.
- Không thiết kế cho điện thoại; phạm vi bắt đầu từ 768px theo yêu cầu chủ dự án.
- Không tự sửa dữ liệu SKU, không nhập Excel, không tạo mới và không lưu form trong lượt đánh giá này.
- Không kết luận backend chấp nhận Model sai Hãng; chỉ xác nhận danh sách chọn trên frontend chưa lọc. Việc submit tổ hợp sai chưa được thử.
- Không kết luận mọi lần tải lại đều mất phiên; hai lần quan sát cho kết quả khác nhau.
- Không gọi tên lỗi xung đột publish là lỗi cơ sở dữ liệu. Chỉ xác nhận action của đúng bản ghi đã bị từ chối hai lần với cùng thông báo.
- Không tự đặt quy tắc SKU nào được công khai trên ứng dụng phân vùng; BA/PO phải chốt điều kiện nghiệp vụ.

## 2. Phương pháp, độ phủ và giới hạn

### 2.1. Đã thực hiện

- Khảo sát qua phiên đăng nhập do người dùng cung cấp; vai trò hiển thị là Super Admin.
- Đọc cây truy cập, nội dung thực tế, trạng thái nút, cấu trúc DOM/CSS và đường dẫn sau một số thao tác không ghi dữ liệu.
- Đo bố cục danh sách ở 768×1024, 900×768, 1024×768, 1280×720, 1440×900 và 1920×1080 bằng viewport trình duyệt.
- Thử tìm chính xác `HN-COMP-RPTW-001`, xóa tìm kiếm, lọc Loại, Hãng, Trạng thái, đổi số dòng/trang, phân trang và sắp xếp.
- Tái hiện lỗi sắp xếp toàn cục trên tập 59 SKU sau khi lọc Loại Sản phẩm + Không hoạt động.
- Mở hàng đợi “SKU chờ điền thông tin”; xem chi tiết và form sửa của bản ghi `HUNG`; đóng mà không lưu.
- Xem chi tiết `HN-COMP-RPTW-001`; mở form thêm mới; thử thay đổi Loại/Hãng để quan sát các giá trị phụ thuộc; đóng mà không lưu.
- Mở modal Nhập Excel, đọc toàn bộ giới hạn và trạng thái nút; không chọn, tải lên hoặc nhập tệp.
- Thử chọn một hàng và chọn tất cả trang, sau đó bỏ chọn toàn bộ; không có dữ liệu bị sửa.
- Với quyền người dùng đã cấp, thử “Đưa lên ứng dụng” cho `HN-COMP-RPTW-001`. Lần đầu bị cảnh báo xung đột; đã đóng cảnh báo, tải lại theo đúng hướng dẫn của hệ thống và thử lại. Lần thứ hai vẫn bị cùng cảnh báo. Bản ghi giữ nguyên “Chưa hiển thị”; không cần và không thực hiện hoàn nguyên.

### 2.2. Chưa kiểm chứng — phải giữ nguyên nhãn này khi giao DEV

- Chưa lưu Sửa SKU, chưa tạo SKU mới, chưa thử validation sau submit và chưa kiểm tra thông báo thành công/thất bại của hai form.
- Chưa chọn file Excel nên chưa xem màn preview, danh sách lỗi theo dòng, xác nhận nhập, kết quả import, tải template hoặc rollback thực tế.
- Chưa xác minh backend có chặn tổ hợp Hãng–Model không tương thích.
- Chưa xác minh quy tắc nghiệp vụ của checkbox quản lý serial đối với Linh kiện; chỉ ghi nhận mặc định quan sát được.
- Chưa hoàn thành một lần bật hiển thị thành công do xung đột phiên. Vì vậy chưa thử “Gỡ khỏi ứng dụng” và chưa đánh giá được thông báo thành công, nhật ký hay độ trễ đồng bộ.
- `SPR-HOA-0004` được quan sát ở trạng thái “Đang hiển thị” với action “Gỡ khỏi ứng dụng”, nhưng không bấm do vấn đề xung đột đã phát sinh ở SKU thử nghiệm đầu tiên và yêu cầu phải xin xác nhận trước khi mở rộng.
- Chưa kiểm thử quyền theo vai trò, nhiều tab/phiên thực tế, mất mạng, request chậm, dữ liệu rất dài, ký tự đặc biệt, bàn phím ảo tablet hoặc thiết bị iPad/Android thật.
- Chưa đo Core Web Vitals, tải lớn hoặc thời gian API bằng phương pháp hiệu năng chuẩn.
- Không kiểm toán chất lượng toàn bộ 819 SKU. Các ví dụ dữ liệu chỉ là bản ghi hiển thị trên màn tại thời điểm khảo sát.

Mọi đề xuất chức năng mới dưới đây đều được gắn là **đề xuất** hoặc **cần BA xác nhận**. Không coi chúng là mô tả chức năng hiện có.

## 3. Chấm điểm

### 3.1. Thang điểm tổng hợp

| Tiêu chí | Điểm | Căn cứ chính |
| --- | ---: | --- |
| Thị giác và nhất quán Vuexy | 17/20 | Font, màu và bề mặt đúng hướng; CTA/toolbar chưa có thứ bậc rõ |
| Rõ ràng thông tin và khả năng quét bảng | 11/20 | Dữ liệu cần thiết có đủ nhưng header gãy nhiều dòng, cột action mất khi cuộn |
| Tìm kiếm, lọc, sắp xếp, phân trang | 8/15 | Tìm/lọc hoạt động; lỗi sắp xếp toàn cục và trạng thái không vào URL |
| Chất lượng các hành trình action | 11/20 | View/Edit/Add/Import có cấu trúc; quan hệ dữ liệu và publish còn vấn đề |
| Responsive tablet/laptop/desktop | 6/10 | Có vùng cuộn bảng; chỉ 1920px mới nhìn đủ bảng, toolbar xuống dòng chưa tốt |
| Khả năng tiếp cận và thao tác | 7/10 | Nhãn điều khiển khá tốt; còn thiếu ngữ nghĩa sort/table và vùng chạm nhỏ |
| Phản hồi, an toàn và khôi phục lỗi | 3/5 | Có confirm/import guard; xung đột publish chưa tự phục hồi hoặc hướng dẫn đủ |
| **Tổng** | **63/100** | **Giữ theme, sửa hành vi và khả năng vận hành trước** |

### 3.2. Điểm theo màn/action đã xem

Các điểm dưới đây là heuristic riêng, không lấy trung bình để tạo tổng điểm bên trên.

| Màn/action | Điểm /10 | Nhận xét |
| --- | ---: | --- |
| Danh sách SKU — thị giác | 7.5 | Đúng baseline, sạch; toolbar và header bảng còn rối |
| Danh sách SKU — vận hành | 6.0 | Có đủ thao tác cơ bản; table chưa tốt cho tablet và chọn nhiều không có đích |
| Tìm kiếm/lọc | 7.0 | Dễ hiểu, phản hồi được; thiếu reset nhanh và trạng thái URL |
| Sắp xếp/phân trang | 4.5 | Sắp xếp tái hiện sai trên tập nhiều trang |
| Chi tiết SKU đầy đủ | 7.0 | Đọc rõ, vừa tablet; thiếu action Sửa trực tiếp và còn khoảng trống |
| Chi tiết SKU chờ điền | 6.0 | Thể hiện thiếu dữ liệu nhưng không chỉ ra checklist/độ hoàn thiện |
| Form Sửa SKU | 6.5 | Khóa trường nhạy cảm hợp lý; hai cột mất cân bằng và chưa dẫn nhiệm vụ hoàn thiện |
| Form Thêm SKU | 6.0 | Cấu trúc đủ; cần chốt mặc định serial và kiểm soát Hãng–Model |
| Nhập Excel — trước khi chọn file | 7.5 | Luồng an toàn và hướng dẫn tốt; native file control chưa đồng bộ ngôn ngữ |
| Chọn nhiều | 4.5 | Có checkbox nhưng không có selected count hoặc bulk action |
| Bật/tắt hiển thị ứng dụng | 4.0 | Confirm tốt; action bị chặn lặp bởi xung đột và chưa có đường phục hồi hiệu quả |

## 4. Ảnh chụp trạng thái dữ liệu và cấu trúc màn

Tại thời điểm khảo sát:

- Tổng: **819 SKU**.
- Mặc định: **15 dòng/trang**, **55 trang**.
- Tùy chọn số dòng: 10, 15, 20, 50.
- Trường tìm kiếm: “Tìm mã / tên SKU”.
- Bộ lọc: Loại, Hãng, Trạng thái.
- Action cấp trang: SKU chờ điền thông tin, Nhập từ Excel, Thêm SKU.
- Cột bảng: chọn, STT, SKU/tên, Loại, Hãng, Nhóm hàng, Định mức tối thiểu, Định mức tối đa, Trạng thái, Ứng dụng phân vùng, Hành động.
- Action cấp hàng: Xem, Sửa, Đưa lên ứng dụng hoặc Gỡ khỏi ứng dụng.

Hai bản ghi được dùng để đọc chi tiết:

| SKU | Tên | Trạng thái hiển thị ban đầu | Mục đích quan sát |
| --- | --- | --- | --- |
| `HN-COMP-RPTW-001` | Bo mạch điều khiển thay thế (mẫu báo cáo bảo hành) | Chưa hiển thị | Chi tiết đầy đủ và thử action publish có xác nhận |
| `HUNG` | HUNG | Chưa hiển thị | Hàng đợi thiếu thông tin, chi tiết và form sửa |

`SPR-HOA-0004` được nhìn thấy ở trạng thái Đang sử dụng/Đang hiển thị, action Gỡ khỏi ứng dụng; chưa bấm.

## 5. Responsive từ tablet trở lên

Chiều rộng dưới đây là CSS pixel. Bảng có vùng cuộn ngang riêng, nên không nên đánh đồng với toàn trang tràn ngang.

| Viewport | Vùng main | Vùng nhìn thấy của bảng / độ rộng bảng | Quan sát |
| --- | ---: | ---: | --- |
| 768×1024 | 760px | 682 / 1194px | Cuộn ngang nhiều; toolbar chia hai hàng nhưng vẫn dùng được |
| 900×768 | 892px | 810 / 1194px | Chưa nhìn đủ các cột; chiều cao làm việc thấp |
| 1024×768 | 676px khi sidebar mở | 590 / 1194px | Toolbar xuống khoảng ba hàng; cột action ở rất xa bên phải |
| 1280×720 | 932px khi sidebar mở | 846 / 1194px | Vẫn phải cuộn; chiều cao chỉ cho ít dòng hữu ích |
| 1440×900 | 1092px | 1006 / 1194px | Vẫn cuộn ngang; action cấp trang xuống hàng, dư khoảng trắng |
| 1920×1080 | 1572px | 1486 / 1486px | Bảng vừa trọn trong trạng thái đo |

### 5.1. Vấn đề quan trọng nhất

Ở 1024px, khi cuộn bảng đến hết bên phải để thấy Trạng thái, Ứng dụng phân vùng và Hành động, cột SKU/tên đã rời khỏi màn. Nhân viên có thể bấm Sửa hoặc Gỡ/Đưa lên mà không còn nhìn thấy đối tượng đang thao tác. Đây là rủi ro nhận diện bản ghi, không chỉ là vấn đề thẩm mỹ.

Ở 1440px, các tiêu đề Định mức tối thiểu/tối đa gãy thành ba đến bốn dòng; cột Hành động bị cắt khỏi vùng nhìn ban đầu. Toolbar đặt “SKU chờ điền thông tin” xa về bên phải, còn Nhập Excel và Thêm SKU xuống hàng bên trái, tạo nhiều khoảng trống và làm mất thứ bậc.

### 5.2. Yêu cầu responsive giao DEV

- Giữ cột SKU/tên ở bên trái và Hành động ở bên phải bằng sticky columns khi bảng cuộn ngang. Checkbox/STT có thể cân nhắc gom hoặc thu hẹp.
- Sticky cần có nền, đường phân cách và `z-index` rõ để không chồng chữ khi cuộn.
- Ở 768–1024px, cho toolbar thành các hàng có ý nghĩa: tìm/lọc; trạng thái kết quả/hàng đợi; action nhập/thêm và số dòng/trang.
- Không sửa bằng `overflow-x: hidden`; phải giữ người dùng tiếp cận được toàn bộ dữ liệu/action.
- Rút nhãn header thành “Tồn min” và “Tồn max” nếu BA chấp nhận; phần giải thích đầy đủ có thể đặt trong trợ giúp không phụ thuộc hover.
- Với tablet dọc, cân nhắc chế độ “cột ưu tiên”: SKU/tên, trạng thái, hiển thị app và action luôn có; các trường hãng/nhóm/định mức nằm trong hàng mở rộng. Đây là đề xuất thay thế cho sticky, không bắt buộc làm cả hai.
- Footer cố định đang dùng khoảng 54px chiều cao; cân nhắc đưa cuối nội dung hoặc thu gọn ở màn hình thấp để tăng không gian bảng.
- QA phải kiểm tra ít nhất 768×1024, 1024×768, 1280×720, 1440×900 và 1920×1080 với sidebar mở/thu gọn, chuỗi tên SKU dài và 50 dòng/trang.

## 6. Đánh giá chi tiết màn Danh sách SKU

### 6.1. Header và định vị

Hiện trạng tốt:

- Breadcrumb Trang chủ → Danh mục → Danh sách SKU rõ.
- Tiêu đề và mô tả “Danh sách SKU và thao tác chỉnh sửa dữ liệu sản phẩm” đúng phạm vi.
- Nhãn “Toàn hệ thống” và vai trò giúp nhận biết phạm vi truy cập.

Cần cải thiện:

- Tên thương hiệu và tên trang đều có dấu hiệu được dùng như heading chính trong cây truy cập. Nên giữ tên trang là `h1`, nhận diện thương hiệu không cần là `h1` thứ hai.
- “Toàn hệ thống” là phạm vi quan trọng; nếu sau này có lọc kho/đơn vị, nó phải trở thành control rõ ràng thay vì chỉ là badge. Đây là yêu cầu dự phòng, chưa xác nhận hệ thống cần lọc phạm vi tại màn này.
- Có thể rút mô tả để dành chiều cao cho bảng ở laptop 720/768px; không cần xóa thông tin phạm vi.

### 6.2. Thanh tìm kiếm, bộ lọc và action cấp trang

Hiện trạng:

- Tìm theo mã/tên hoạt động; tìm chính xác `HN-COMP-RPTW-001` trả về một bản ghi.
- Bộ lọc Loại, Hãng, Trạng thái có giá trị rõ ràng. Danh sách hãng quan sát gồm Kubota, Yanmar, Honda, Husqvarna, Hoa Nam, DongCheng, Makita, Stihl, Mitsubishi và Total Tools.
- “SKU chờ điền thông tin” là checkbox/toggle có trợ giúp: chỉ Mã và Loại, chưa gán Hãng/Nhóm hàng/Model.
- Tất cả control dùng cùng phong cách nhẹ theo Vuexy.

Vấn đề:

- Chưa có action “Xóa bộ lọc”. Trạng thái rỗng chỉ hiển thị “Không có SKU phù hợp bộ lọc.” mà không có lối phục hồi trực tiếp.
- Search/filter/sort/page/page-size không được phản ánh vào URL quan sát; tải lại hoặc chia sẻ đường dẫn không giữ tác vụ đang làm.
- Action Nhập Excel và Thêm SKU đều dùng bề mặt tím nhạt, nên action chính không nổi bật hơn action phụ.
- Checkbox “SKU chờ điền thông tin” có ý nghĩa như một view nghiệp vụ nhưng bị đặt lẫn trong toolbar và dễ bị đẩy xa ở 1440px.

Đề xuất:

- Thêm chip bộ lọc đang áp dụng và nút “Xóa tất cả” chỉ xuất hiện khi có điều kiện lọc.
- Tìm kiếm debounce 250–400ms là khoảng **đề xuất**, không phải đo hiện tại; khi đang tải cần giữ layout và thông báo đủ cho screen reader.
- Đặt Thêm SKU là CTA chính màu tím đặc; Nhập Excel là secondary; SKU chờ điền là saved view/filter có badge số lượng nếu API hỗ trợ.
- Giữ màu tím làm accent, không đổi toàn bộ control thành tím. Nút nguy hiểm hoặc trạng thái cảnh báo phải theo ngữ nghĩa riêng.
- Cấu trúc gợi ý desktop: hàng 1 gồm search + 3 filter; hàng 2 trái là kết quả/saved view, phải là số dòng + Nhập Excel + Thêm SKU. Ở tablet cho các nhóm xuống hàng nhưng giữ nguyên thứ tự.

### 6.3. Bảng và mật độ dữ liệu

Hiện trạng tốt:

- SKU và tên được đặt chung giúp quét mã lẫn mô tả.
- Trạng thái sử dụng và hiển thị app được tách, tránh đồng nhất hai khái niệm.
- Action dùng chữ Xem/Sửa/Đưa lên/Gỡ khỏi thay vì icon-only.

Vấn đề:

- Header Hành động quan sát không có text hiển thị trong `innerText` dù cây truy cập có tên “Hành động”. Cần sửa để người dùng thị giác cũng thấy nhãn.
- Các header dài gãy dòng quá nhiều. Định mức min/max chiếm chiều cao nhưng không tăng khả năng hiểu.
- Khi cuộn ngang, cột nhận diện và action không còn cùng màn hình.
- Bảng chưa có tên/caption được quan sát; `th` không có `aria-sort` và `scope` trong DOM đã đọc. Các nút sort có `aria-label` mô tả action tiếp theo, đây là điểm tốt nhưng chưa thay thế đầy đủ trạng thái sắp xếp của cột.
- Số thứ tự theo trang ít giá trị hơn SKU; ở tablet không nên để STT cạnh tranh không gian với nhận diện/action.

Đề xuất:

- Cung cấp caption/accessible name cho bảng, khai báo header cell và `aria-sort="ascending|descending|none"` theo trạng thái hiện tại.
- Hiển thị dấu sort rõ trên cột đang sắp; tooltip/aria-label phải nói cả trạng thái hiện tại và thao tác kế tiếp.
- Rút header, căn phải số định mức, dùng font số tabular nếu hệ thống hỗ trợ.
- Chọn độ cao hàng khoảng 56–64px là **đề xuất sản phẩm** để vừa tablet và vẫn đọc được tên hai dòng; không phải token đã được chốt.
- Giới hạn tên hai dòng với cách mở xem đầy đủ khi focus/chạm; không dựa riêng vào hover.
- Không dùng màu là tín hiệu duy nhất cho Đang sử dụng/Không hoạt động hoặc Đang hiển thị/Chưa hiển thị; giữ text như hiện tại.

## 7. Tìm kiếm, lọc, sắp xếp và phân trang

### 7.1. Tìm kiếm và empty state

Tìm chính xác theo mã hoạt động. Khi kết hợp điều kiện không có kết quả, màn hiển thị “Không có SKU phù hợp bộ lọc.” Đây là thông báo đúng nhưng chưa đủ hành động.

Tiêu chí nghiệm thu đề xuất:

- Tìm không phân biệt hoa/thường và bỏ khoảng trắng đầu/cuối; BA xác nhận có bỏ dấu hay không.
- Trong empty state hiển thị các điều kiện đang áp dụng và action “Xóa bộ lọc”/“Xóa tìm kiếm”.
- Khi API đang tải, không nhấp nháy qua “0 kết quả” rồi mới có dữ liệu; dùng loading state ổn định.
- Khi quay lại từ Chi tiết/Sửa, giữ từ khóa, bộ lọc, trang và vị trí cuộn.

### 7.2. Lỗi sắp xếp toàn cục — P1

Kịch bản tái hiện:

1. Lọc Loại = Sản phẩm.
2. Lọc Trạng thái = Không hoạt động.
3. Tổng kết quả còn 59 SKU.
4. Sắp SKU A → Z; nhãn sort đổi sang hành động kế tiếp Z → A, cho biết trạng thái hiện tại đang tăng dần.
5. Trang 1 bắt đầu bằng `GARD-MAK-S01`, `GARD-MIT-Q02`, sau đó các mã `MSPR...`.
6. Trang 2 bắt đầu bằng `CARB-HOA-Q02`, `CARB-HOA-S01`, `CARB-HON...`.

`CARB...` phải đứng trước `GARD...` nếu toàn bộ 59 kết quả được sắp A → Z. Quan sát này cho thấy sort đang áp dụng trên dữ liệu của từng trang hoặc sort/pagination không dùng cùng hợp đồng. Đây là lỗi chức năng ảnh hưởng tìm bản ghi và đối chiếu.

Yêu cầu sửa:

- Thứ tự xử lý phải là filter → sort toàn tập → paginate.
- API nhận `sortField`/`sortDirection` hoặc hợp đồng tương đương; frontend không sort riêng chỉ trên mảng của trang hiện tại.
- Thêm test tích hợp ít nhất ba trang với dữ liệu cố ý đảo thứ tự giữa trang.
- Khi đổi sort, quay về trang 1; trạng thái sort hiển thị trong URL và `aria-sort`.
- Xử lý thứ tự null/“Chưa có” và collation tiếng Việt/mã SKU theo quy tắc BA chốt; không tự chọn quy tắc ngầm.

### 7.3. Phân trang và trạng thái URL

Đi từ trang 1 sang trang 2 giữ bộ lọc trên giao diện, nhưng URL vẫn chỉ là `?screen=MST-01`. Tương tự, saved view SKU chờ điền không tạo tham số quan sát được.

Đề xuất hợp đồng URL không nhạy cảm, ví dụ về mặt ý nghĩa:

`?screen=MST-01&q=...&type=...&brand=...&status=...&pending=1&sort=sku.asc&page=2&pageSize=15`

Tên tham số cụ thể do DEV chọn. Tiêu chí chính là refresh/back/forward/chia sẻ nội bộ khôi phục đúng view. Không đưa token, quyền hay dữ liệu nhạy cảm vào URL.

## 8. Đánh giá từng màn action

### 8.1. Xem chi tiết SKU đầy đủ

`HN-COMP-RPTW-001` hiển thị các nhóm thông tin: mã, tên, loại Linh kiện, đơn vị cái, Hãng Hoa Nam, Nhóm hàng, Model, công suất, quy cách đóng gói, phiên bản, định mức min/max, quản lý serial, trạng thái và hiển thị ứng dụng phân vùng.

Modal ở 1440px đo khoảng 760×586px; ở 768px khoảng 704×586px, không tràn trong trạng thái đã xem. Lưới hai cột rõ nhưng còn khoảng trắng lớn. Chỉ có Đóng, không có Sửa trực tiếp.

Điểm cần sửa:

- Thêm action “Sửa SKU” ở footer/header nếu người dùng có quyền; hiện phải đóng modal rồi tìm lại hàng.
- Nhóm dữ liệu theo ý nghĩa: nhận diện, phân loại, tồn kho, kiểm soát, kênh hiển thị. Không chỉ xếp trường theo thứ tự form.
- Hiển thị ai/cập nhật lúc nào nếu API có audit metadata; đây là đề xuất, chưa thấy trên màn và chưa xác nhận nguồn dữ liệu.
- Chuẩn hóa cách dịch giá trị danh mục. Danh sách đang hiển thị “Phụ tùng” trong khi chi tiết đã quan sát giá trị `Parts`; cần xác minh có phải cùng một mã danh mục rồi dùng một nhãn tiếng Việt nhất quán.
- Nút đóng khoảng 34px; tăng vùng chạm mà không nhất thiết tăng icon thị giác.

### 8.2. Xem chi tiết SKU chờ điền

`HUNG` có Mã/Tên, Loại Linh kiện, Đơn vị `cai`, Phiên bản V1, quản lý serial Không, trạng thái Đang sử dụng, hiển thị app Chưa hiển thị; Hãng/Nhóm hàng/Model/Công suất/Quy cách/định mức là “Chưa có”.

Vấn đề và đề xuất:

- “Chưa có” lặp nhiều nhưng không tổng hợp vì sao bản ghi nằm trong hàng đợi. Thêm khối “Cần hoàn thiện: Hãng, Nhóm hàng, Model, Công suất…” và action Sửa.
- Chuẩn hóa đơn vị `cai` và `cái` ở tầng danh mục/dữ liệu; không chỉ sửa text riêng modal.
- Hiển thị tiến độ, ví dụ “4/8 trường bắt buộc”, chỉ khi BA chốt đúng tập trường bắt buộc.
- Không cho publish nếu thiếu dữ liệu bắt buộc, nếu đó là quy tắc nghiệp vụ được duyệt. Hiện nút Đưa lên ứng dụng vẫn khả dụng với `HUNG`; đây là hiện trạng UI, không chứng minh backend sẽ chấp nhận.

### 8.3. Sửa SKU

Form Sửa `HUNG` có hai nhóm: Thông tin SKU và Danh mục tham chiếu. Các trường quan sát gồm Mã SKU, Tên, Loại, Đơn vị, Trạng thái, hiển thị app, Hãng, Nhóm hàng, Model, Công suất, Quy cách, Phiên bản, định mức min/max và quản lý serial.

Điểm tốt:

- Mã SKU bị khóa với giải thích đã phát sinh tồn nên không thể đổi.
- Quản lý serial bị khóa với giải thích đã phát sinh tồn nên không thể đổi chế độ.
- Helper của min nói rõ nhập 0 để cảnh báo khi hết hàng; để trống là không đặt ngưỡng.
- Helper của max ghi điều kiện >=1 và lớn hơn min; để trống là không đặt ngưỡng.

Điểm cần sửa:

- Với nhiệm vụ “SKU chờ điền”, form phải đánh dấu chính xác trường nào đang thiếu và trường nào chặn hoàn tất; hiện người dùng phải tự so sánh.
- Lưới hai cột ở 768px vẫn vừa nhưng cột trái có khoảng trống lớn trong khi cột phải dày. Cân bằng nhóm hoặc chuyển thứ tự theo nhiệm vụ.
- Label checkbox dài bị xuống dòng. Tách mô tả hỗ trợ khỏi label chính, giữ vùng bấm bao trọn cả label.
- Validation min/max phải có lỗi inline cạnh trường, giữ dữ liệu người dùng và focus trường đầu tiên sai khi submit.
- Có cảnh báo thay đổi chưa lưu khi đóng/back nếu form đã dirty. Chưa kiểm thử hiện trạng này nên đây là tiêu chí bổ sung.
- Nút Lưu SKU cao khoảng 38px; với tablet nên có vùng chạm 44–48px theo mục tiêu sản phẩm.

### 8.4. Thêm SKU

Mặc định quan sát: Loại Sản phẩm, đơn vị `cái`, trạng thái Đang sử dụng, hiển thị app chưa chọn, Phiên bản V1 và quản lý serial được chọn. Khi đổi Loại thành Linh kiện, quản lý serial vẫn được chọn.

Cần BA xác nhận:

- Linh kiện có luôn quản lý theo serial/mã vật lý không, hay mặc định phải phụ thuộc Loại/Nhóm hàng?
- SKU có được phép tạo ở trạng thái Đang sử dụng khi chưa đủ toàn bộ danh mục tham chiếu không?
- Hãng, Nhóm hàng, Model, Công suất có bắt buộc cho mọi loại SKU hay thay đổi theo loại?
- Có được bật hiển thị app ngay khi tạo hay phải qua trạng thái hoàn thiện/duyệt?

Quan hệ Hãng–Model:

- Khi chọn Hãng Hoa Nam, dropdown Model vẫn hiển thị 18 model của nhiều hãng, gồm Kubota, Yanmar, Honda, Husqvarna, Hoa Nam và các hãng khác.
- Không thử lưu tổ hợp sai; chưa kết luận backend chấp nhận dữ liệu không tương thích.

Yêu cầu sửa:

- Dropdown Model chỉ trả về model tương thích với Hãng, hoặc yêu cầu chọn Hãng trước rồi mới bật Model.
- Khi đổi Hãng, nếu Model cũ không còn hợp lệ, xóa lựa chọn và thông báo ngắn; không âm thầm giữ dữ liệu sai.
- Backend phải kiểm tra lại quan hệ, không tin riêng frontend.
- Nút Lưu có thể luôn bật rồi hiện lỗi inline hoặc chỉ bật khi đủ điều kiện; cả hai mẫu đều chấp nhận nếu nhất quán và dễ sửa lỗi. Vì chưa submit, không kết luận nút hiện tại đang thiếu validation.
- Sau khi tạo thành công, thông báo phải có Mã SKU và action Xem/Sửa bản ghi vừa tạo; chống double-submit.

### 8.5. Nhập danh sách SKU từ Excel

Thông tin quan sát trong modal:

- Quy trình: Chọn tệp → Kiểm tra trước → sửa lỗi nếu có → Nhập dữ liệu.
- Nguyên tắc: bất kỳ lỗi nào thì không SKU nào được tạo/cập nhật.
- Dung lượng tối đa 10MB; định dạng `.xlsx`/`.xls`.
- Tối đa 1.000 dòng dữ liệu, hỗ trợ tối đa 24 cột; worksheet không vượt 20.040 dòng kể cả dòng trống.
- Có switch “Cho phép cập nhật SKU đã tồn tại”.
- Cột tối thiểu: Mã và Tên SKU. Các cột khác được mô tả là tùy chọn.
- Nút Kiểm tra trước và Nhập dữ liệu bị khóa khi chưa chọn file.
- Native file input hiển thị tiếng Anh “Choose File / No file chosen” trong giao diện tiếng Việt.

Điểm tốt:

- Tách preflight và commit giúp giảm rủi ro import hàng loạt.
- Mô tả all-or-nothing rõ hơn nhiều form import thông thường.
- Có template và giới hạn trước khi chọn file.

Điểm cần cải thiện/tiêu chí chưa kiểm chứng:

- Đồng bộ ngôn ngữ control chọn file; hiển thị tên, dung lượng, loại tệp và action bỏ tệp sau khi chọn.
- Giải thích rõ 1.000 dòng dữ liệu so với 20.040 dòng worksheet để người dùng hiểu vì sao file có nhiều dòng trống vẫn bị từ chối.
- Khi bật cập nhật SKU tồn tại, hiển thị cảnh báo về trường nào được phép ghi đè và trường nào bị khóa do đã có tồn/serial.
- Sau preflight, cần tổng hợp: số tạo mới, số cập nhật, số bỏ qua, số lỗi, số cảnh báo; cho lọc và tải danh sách lỗi.
- Mỗi lỗi cần số dòng, tên cột, giá trị nhận được, lý do tiếng Việt và hướng sửa. Không hiển thị chỉ mã lỗi kỹ thuật.
- Chặn Import nếu còn lỗi; cảnh báo có thể cho phép tiếp tục chỉ theo quy tắc BA chốt, không tự chuyển lỗi thành warning.
- Bảo đảm import lặp cùng file không tạo bản ghi trùng; ghi audit người thực hiện, thời gian và kết quả. Đây là đề xuất nghiệp vụ, chưa kiểm tra hiện trạng backend.
- Sau lỗi server/mất mạng, không để người dùng không biết dữ liệu đã ghi một phần hay chưa. Kết quả phải khẳng định commit toàn bộ hay rollback toàn bộ.
- Nút “Làm lại” đang khả dụng cả khi chưa có file; nên ẩn/khóa cho tới khi có trạng thái cần reset hoặc đổi nhãn phù hợp.

### 8.6. SKU chờ điền thông tin

Bật bộ lọc này đưa danh sách về một bản ghi `HUNG` trong lần khảo sát. URL không thay đổi. Đây là một saved view hữu ích nhưng chưa hoàn chỉnh thành luồng công việc.

Đề xuất:

- Hiển thị số lượng chờ ngay trên nhãn nếu số được lấy cùng snapshot.
- Thêm cột/khối “Thiếu thông tin” liệt kê trường còn thiếu thay vì bắt người dùng mở từng bản ghi.
- Cho action “Hoàn thiện” thay vì Sửa chung, mở form với trường thiếu được ưu tiên.
- Định nghĩa rõ điều kiện thoát hàng đợi; nếu chỉ Mã và Loại là mô tả nhận diện, chưa đủ để suy ra toàn bộ quy tắc hoàn tất.
- Khi lưu đủ điều kiện, bản ghi rời view ngay và thông báo “Đã hoàn thiện”; khi không còn bản ghi, empty state dẫn về tất cả SKU.

### 8.7. Chọn một/chọn tất cả

Quan sát:

- Chọn một hàng không xuất hiện số lượng đã chọn hoặc thanh action hàng loạt.
- Chọn tất cả trên trang làm 15 checkbox hàng được chọn; không có action tiếp theo.
- Đã bỏ chọn toàn bộ trước khi kết thúc.

Yêu cầu:

- Nếu chưa có nghiệp vụ hàng loạt, bỏ checkbox để giảm nhiễu và tránh hiểu nhầm.
- Nếu có, hiển thị sticky bulk toolbar: “Đã chọn 15 SKU trên trang này”, action được phép theo quyền, và nút bỏ chọn.
- Không dùng nhãn “Chọn tất cả 819” khi mới chỉ chọn trang hiện tại. Nếu hỗ trợ chọn toàn bộ kết quả, cần bước riêng “Chọn tất cả 819 kết quả phù hợp bộ lọc”.
- Các action bulk làm thay đổi hiển thị/trạng thái phải có preview số bản ghi hợp lệ, bị chặn và lý do; không áp dụng mù cho tập hỗn hợp.

### 8.8. Đưa lên/Gỡ khỏi ứng dụng phân vùng

#### Bằng chứng đã quan sát

- Bản ghi Chưa hiển thị có nút “Đưa lên ứng dụng”; bản ghi Đang hiển thị có “Gỡ khỏi ứng dụng”.
- `HUNG` thiếu nhiều trường vẫn có nút Đưa lên ứng dụng.
- Trong tập Sản phẩm + Không hoạt động, các hàng quan sát vẫn có nút Đưa lên ứng dụng khả dụng.
- Khi bấm `HN-COMP-RPTW-001`, modal xác nhận ghi: “Đưa SKU lên ứng dụng phân vùng?” và “SKU HN-COMP-RPTW-001 sẽ hiển thị trên ứng dụng phân vùng.”
- Sau xác nhận, hệ thống báo: “Hồ sơ App PV đã được cập nhật bởi phiên khác; tải lại trước khi bật/tắt publish.”
- Sau khi đóng cảnh báo và tải lại, bản ghi vẫn Chưa hiển thị. Thử lại theo đúng hướng dẫn vẫn nhận cùng cảnh báo.
- Sau hai lần, bản ghi vẫn Chưa hiển thị, action vẫn là Đưa lên ứng dụng; không có thay đổi dữ liệu và không cần hoàn nguyên.

#### Đánh giá

Confirm trước thay đổi là tốt. Tuy nhiên, thông báo xung đột chưa cung cấp thời điểm phiên bản mới, ai/nguồn nào cập nhật, nút “Tải dữ liệu mới” hay cách giải quyết. Hướng dẫn tải lại không giúp hành động thành công trong kịch bản đã thử. Đây là điểm nghẽn P1 cho nghiệp vụ publish.

#### Yêu cầu DEV/BA

- Khi phát hiện optimistic concurrency conflict, cung cấp action “Tải bản mới” ngay trong cảnh báo; sau tải phải dùng version/ETag mới nhất.
- Nếu hồ sơ app được một tiến trình đồng bộ cập nhật liên tục, backend cần tách version của dữ liệu publish khỏi version không liên quan hoặc định nghĩa cơ chế retry an toàn. Đây là hướng điều tra, không phải kết luận nguyên nhân.
- Cảnh báo cần nói rõ trạng thái hiện tại trên server và thay đổi người dùng đang yêu cầu.
- Không tự động retry mutation nếu không bảo đảm idempotent; không để toast biến mất trước khi người dùng đọc.
- Sau thành công, cập nhật badge và nút theo response server, thông báo có Mã SKU; khi API thất bại, giữ trạng thái cũ.
- Chốt điều kiện publish: trạng thái sử dụng, tập trường bắt buộc, ảnh/tài liệu nếu có, quyền vai trò và quy trình duyệt. Không cho frontend tự suy ra.
- Nếu SKU thiếu điều kiện, disable action và chỉ rõ “Thiếu Hãng, Nhóm hàng, Model…” thay vì cho bấm rồi mới lỗi chung.
- Xác định “Gỡ khỏi ứng dụng” chỉ ẩn khỏi kênh hay ảnh hưởng giỏ hàng/đơn đang mở; nội dung confirm phải nói đúng hậu quả sau khi BA xác nhận.
- Có lịch sử thay đổi publish theo SKU và quyền truy cập phù hợp. Chưa kiểm tra màn audit nên đây là đề xuất.

## 9. Khả năng tiếp cận và thao tác tablet

### 9.1. Điều đã làm tốt

- Search, filter, checkbox và phần lớn button có tên truy cập mô tả đúng mục đích.
- Nút sort có nhãn “Nhấp để sắp xếp…” theo cột.
- Trạng thái hiển thị có text, không phụ thuộc riêng màu.
- Modal có tiêu đề và action rõ; form quan sát có liên kết nhãn với trường trong cây truy cập.

### 9.2. Điểm cần sửa

- Kích thước quan sát: filter/action chính khoảng 38px; Xem/Sửa và publish khoảng 38px; nút đóng khoảng 34px; pagination khoảng 26px. WCAG 2.2 mức AA quy định target tối thiểu 24×24 CSS px với các ngoại lệ, nên không được kết luận mọi nút dưới 44px tự động vi phạm. Tuy nhiên, với sản phẩm tablet, mục tiêu 44–48px cho action chính/row/close là hợp lý để giảm bấm nhầm. Tham khảo [W3C Understanding Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Pagination 26px cần kiểm tra cả khoảng cách giữa target, focus ring và khả năng bấm bằng ngón tay; kích thước đơn lẻ chưa đủ kết luận đạt/không đạt.
- Bảng cần accessible name/caption, header scope và `aria-sort` trạng thái hiện tại.
- Header Hành động phải hiển thị bằng mắt, không chỉ có accessible name.
- Focus phải bị giữ trong modal, quay lại đúng nút mở khi đóng, Escape chỉ đóng modal trên cùng; chưa kiểm thử bàn phím đầy đủ nên cần QA.
- Toast/cảnh báo xung đột cần role/live region phù hợp, không tự mất quá nhanh và không cướp focus ngoài dự kiến.
- Màu chữ phụ, viền input và trạng thái disabled cần đo contrast trên token thực tế; không dùng cảm nhận để kết luận. Tham khảo [W3C Understanding Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- Tooltip trợ giúp không được chỉ hoạt động bằng hover; tablet và bàn phím phải mở được bằng chạm/focus.

## 10. Backlog giao DEV/BA theo mức ưu tiên

### P0 — Chưa ghi nhận

Không ghi nhận mất dữ liệu, sai đối tượng sau thao tác hoặc thay đổi không thể hoàn tác trong phạm vi đã thử. Không được suy từ đây rằng toàn màn không có rủi ro P0; các submit chính chưa được thực hiện.

### P1 — Sửa trước khi coi màn ổn định cho vận hành

| ID | Hạng mục | Chủ trì gợi ý | Tiêu chí nghiệm thu tối thiểu |
| --- | --- | --- | --- |
| SKU-P1-01 | Sort toàn tập trước pagination | BE + FE + QA | Kịch bản 59 kết quả A→Z cho thứ tự liên tục qua ranh giới trang; có test 3+ trang |
| SKU-P1-02 | Nhận diện/action trên bảng tablet | FE + UI/UX | 768–1440px luôn biết SKU nào đang được action; không che cột bằng overflow hidden |
| SKU-P1-03 | Khôi phục xung đột publish | BE + FE | Tải version mới rồi retry một lần có kiểm soát; trạng thái server/UI nhất quán; lỗi nói cách xử lý |
| SKU-P1-04 | State vào URL | FE | Refresh/back/forward khôi phục q/filter/pending/sort/page/size; không chứa dữ liệu nhạy cảm |
| SKU-P1-05 | Ràng buộc Hãng–Model | BA + BE + FE | Model lọc theo Hãng; đổi Hãng xử lý Model cũ; backend từ chối tổ hợp sai có lỗi theo trường |
| SKU-P1-06 | Hoàn thiện chọn nhiều hoặc bỏ | PO + FE | Không còn checkbox không có tác dụng; nếu có bulk phải rõ phạm vi trang/toàn kết quả và quyền |
| SKU-P1-07 | Điều kiện publish | BA + BE + FE | Quy tắc được tài liệu hóa; hàng thiếu/không hợp lệ nêu lý do; backend kiểm tra cùng quy tắc |
| SKU-P1-08 | Điều tra phiên khi reload | FE + BE/Platform | Test reload ở default/filter/pending/form; không mất công việc bất ngờ; nếu hết phiên có phục hồi hợp lý |

### P2 — Cải thiện hiệu suất thao tác và tính nhất quán

| ID | Hạng mục | Tiêu chí nghiệm thu tối thiểu |
| --- | --- | --- |
| SKU-P2-01 | Phân cấp toolbar/CTA | Thêm SKU là primary; Nhập Excel secondary; saved view và page-size đúng nhóm |
| SKU-P2-02 | Header bảng | Hành động có text thị giác; min/max không gãy 3–4 dòng; sort state rõ |
| SKU-P2-03 | Empty state có lối thoát | Hiển thị điều kiện đang lọc và nút xóa phù hợp |
| SKU-P2-04 | Chi tiết có Sửa trực tiếp | Chỉ hiển thị theo quyền; đóng/quay lại giữ ngữ cảnh danh sách |
| SKU-P2-05 | Checklist SKU chờ điền | Màn danh sách và form nói chính xác trường còn thiếu theo rule BA |
| SKU-P2-06 | Chuẩn hóa đơn vị/nhãn danh mục | Không còn `cai`/`cái` và `Parts`/`Phụ tùng` không nhất quán cho cùng mã |
| SKU-P2-07 | Cân bằng form tablet | Trường theo nhiệm vụ, label không vỡ khó đọc, footer action dễ chạm |
| SKU-P2-08 | Chốt default serial | Rule theo loại/nhóm được BA duyệt; add/edit/import dùng cùng rule |
| SKU-P2-09 | Preview import | Có new/update/skip/error/warning, lỗi theo dòng/cột và kết quả all-or-nothing |
| SKU-P2-10 | Localize file input | Toàn bộ chọn tệp và trạng thái file dùng tiếng Việt nhất quán |
| SKU-P2-11 | Feedback action | Toast có SKU, trạng thái, action tiếp; lỗi giữ dữ liệu và không đổi badge giả |
| SKU-P2-12 | Vùng chạm tablet | Action chính/hàng/close hướng tới 44–48px; pagination đảm bảo target/spacing |
| SKU-P2-13 | Ngữ nghĩa bảng/modal | Caption, scope, aria-sort, focus trap, return focus được test bàn phím |
| SKU-P2-14 | Tối ưu chiều cao làm việc | Footer/intro không chiếm quá nhiều vùng; 720/768px vẫn thấy đủ hàng và action |

### P3 — Tối ưu sau khi P1/P2 ổn định

| ID | Hạng mục | Ghi chú |
| --- | --- | --- |
| SKU-P3-01 | Saved views cá nhân | Chỉ triển khai nếu người dùng thực sự có nhiều lát cắt lặp lại |
| SKU-P3-02 | Mật độ compact/comfortable | Có thể hữu ích desktop; tablet mặc định không nên quá compact |
| SKU-P3-03 | Audit history tại chi tiết | Cần quyền, nguồn metadata và giới hạn dữ liệu trước khi thiết kế |
| SKU-P3-04 | Cấu hình cột | Chỉ sau khi có cột ưu tiên mặc định tốt; không đẩy trách nhiệm thiết kế sang người dùng |
| SKU-P3-05 | Xuất danh sách đang lọc | Chưa có yêu cầu nghiệp vụ; cần xác nhận quyền và giới hạn dữ liệu trước |

## 11. Tiêu chí nghiệm thu end-to-end đề xuất

### Danh sách

- Ở mọi viewport hỗ trợ, không có action bị mất hoàn toàn; người dùng luôn nhận diện được SKU trước khi thao tác.
- q/filter/sort/page/page-size/pending khôi phục đúng khi refresh, back và forward.
- Sort đúng toàn tập với null, tiếng Việt, số và mã hỗn hợp theo quy tắc đã chốt.
- Loading, empty, error và retry không làm mất điều kiện tìm/lọc.
- Trở lại từ View/Sửa giữ trang, vị trí cuộn và SKU vừa thao tác.

### View/Edit/Add

- Quyền chỉ đọc không thấy action sửa; quyền sửa có đường vào rõ.
- Validation hiển thị theo trường, giữ giá trị đã nhập, focus lỗi đầu tiên và không submit hai lần.
- Trường bị khóa có lý do; backend cũng chặn thay đổi bất hợp lệ.
- Quan hệ Loại–Hãng–Nhóm–Model–Công suất dùng chung rule ở Add, Edit và Import.
- Đóng form dirty có cảnh báo; lưu thành công cập nhật đúng hàng và chi tiết.

### Import

- File sai loại/dung lượng/số dòng cho lỗi trước upload/commit đúng thời điểm.
- Preview đếm khớp tổng; lỗi có thể lọc, tải và sửa.
- Bật cập nhật tồn tại chỉ thay các trường được phép; SKU có tồn/serial không bị ghi đè trường khóa.
- Commit all-or-nothing được kiểm thử bằng lỗi giữa lô và mất mạng.
- Retry không tạo trùng; kết quả có ID lô/audit nếu nghiệp vụ yêu cầu.

### Publish/unpublish

- Eligibility giống nhau giữa UI/backend; lý do bị chặn cụ thể.
- Confirm chứa mã/tên SKU, trạng thái trước/sau và hậu quả đã được BA duyệt.
- Xung đột phiên cho tải bản mới; retry dùng version mới và không ghi đè âm thầm.
- Sau success, badge/nút dựa trên response server; refresh vẫn giữ trạng thái.
- Sau error, trạng thái cũ còn nguyên; thông báo không biến mất trước khi đọc.
- Kiểm thử hai phiên cùng sửa, SKU thiếu dữ liệu, SKU không hoạt động, mất mạng và người dùng không đủ quyền.

## 12. Gói yêu cầu ngắn để giao DEV

> Giữ nguyên baseline Vuexy hiện tại: Public Sans, nền sáng, card trắng, tím chỉ dùng làm accent. Không đổi theme. Ưu tiên sửa danh sách SKU theo thứ tự: (1) sort toàn tập trước pagination; (2) responsive 768px+ với SKU và action luôn nhận diện cùng lúc; (3) xử lý optimistic conflict của publish; (4) đồng bộ trạng thái danh sách vào URL; (5) ràng buộc Hãng–Model FE+BE; (6) hoàn thiện hoặc bỏ chọn nhiều; (7) chốt eligibility publish; (8) kiểm tra phiên khi reload. Sau đó mới chỉnh toolbar, header bảng, checklist SKU chờ điền, detail/edit shortcut, preview import, vùng chạm và accessibility. Mọi rule serial, field bắt buộc, publish và hậu quả unpublish phải được BA/PO xác nhận trước khi DEV triển khai.

## 13. Trạng thái cuối phiên khảo sát

- Đang ở đúng màn Danh sách SKU.
- Không còn modal/cảnh báo mở.
- Không còn checkbox hàng được chọn.
- Không lưu, tạo hoặc import SKU.
- `HN-COMP-RPTW-001` vẫn ở trạng thái **Chưa hiển thị**, action **Đưa lên ứng dụng**.
- Không thử `SPR-HOA-0004` sau khi phát sinh xung đột.
- Không cập nhật website prototype, tên miền hoặc file ngữ cảnh dự án trong lượt này.

