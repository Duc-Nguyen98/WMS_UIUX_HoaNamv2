# HOA NAM WMS — ĐÁNH GIÁ DASHBOARD & CÁC MÀN ACTION

Ngày khảo sát: 05/09/2026 · Ngôn ngữ: Tiếng Việt · Phạm vi thiết bị: tablet, laptop, desktop.

Hệ thống được khảo sát trực tiếp: https://khohoanamfe.bigk.click/dashboard

Ngữ cảnh đối chiếu: file `HOA_NAM_WMS_CONTEXT_05092026` do chủ dự án đính kèm. Baseline: [Vuexy Demo 1](https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-1/login?to=/dashboards/analytics).

## 1. Kết luận điều hành

**Điểm tổng hợp: 60/100 — hình thức đã đi đúng Vuexy, nhưng luồng từ cảnh báo đến xử lý chưa đủ tốt cho một Dashboard vận hành kho.**

Điểm cần sửa trước không phải là tăng độ phủ màu tím. Hệ thống đã dùng Public Sans, nền sáng, card trắng và màu tím nhấn. Các vướng mắc lớn hơn là mất bộ lọc khi chuyển màn, tràn ngang ở tablet/laptop, và số liệu khác phạm vi nhưng chưa giải thích đủ rõ.

Năm việc nên giao DEV trước:

1. Sửa hợp đồng điều hướng của toàn bộ action Dashboard: bấm một số đếm phải đến đúng tập bản ghi tạo nên số đó.
2. Sửa tràn ngang của vùng nội dung tại 1024px và 1280px; điều chỉnh sidebar và bộ lọc theo chiều rộng nội dung thực còn lại.
3. Chuẩn hóa định nghĩa KPI, phạm vi ngày, thời điểm chốt và trạng thái tồn; không dùng cùng một nhãn cho những số khác công thức.
4. Nâng màn chi tiết chênh lệch tồn thành nơi chẩn đoán được: phải nhìn thấy tồn ghi nhận, tồn theo sổ, chênh lệch và chứng từ liên quan.
5. Đưa công việc khẩn cấp lên sớm hơn, giảm lặp cảnh báo, tăng vùng chạm và sửa tương phản CTA.

Đây là đánh giá chuyên gia theo quan sát giao diện/hành vi, không phải kết quả nghiên cứu người dùng, kiểm toán sổ kho, kiểm thử bảo mật hay chứng nhận WCAG toàn hệ thống. Điểm số dùng để ưu tiên cải tiến, không có nghĩa là 60% chức năng hoạt động.

### 1.1. Những gì cần giữ

- Public Sans, nền sáng, card/sidebar trắng, tím dùng làm màu nhấn theo Vuexy.
- Phân chia KPI, ưu tiên vận hành, đối soát, phân tích và theo dõi chuyên biệt đã có cấu trúc.
- Có thời điểm dữ liệu và điều khiển làm mới.
- Có cách xem số liệu dạng bảng bên cạnh biểu đồ; dùng `details/summary` cho phần mở rộng.
- Bộ lọc mức độ ưu tiên có hoạt động: chọn Khẩn cấp thu gọn hàng đợi về nhóm đối soát.
- Bảo hành có màn chi tiết trước khi sửa, các tab nội dung, tiến trình trạng thái, lý do hiệu chỉnh và cảnh báo tác động nghiệp vụ.
- Báo cáo lỗi có chi tiết đến dòng Excel và giải thích bằng tiếng Việt.
- Báo cáo nhãn phân biệt tra cứu nhật ký với gửi lệnh in — nguyên tắc này nên được giữ.

### 1.2. Những điều không được suy diễn thành yêu cầu thay đổi

- Không đổi sang nền/sidebar tím toàn trang; bản phủ tím trước đây đã bị từ chối.
- Không sửa lại Đăng nhập/Quên mật khẩu trong đợt đánh giá Dashboard này.
- Không yêu cầu chuyển framework sang Vue chỉ vì dùng Vuexy làm baseline thị giác.
- Không tự tạo tên miền hoặc xuất bản dữ liệu nghiệp vụ lên website công khai.
- Không kết luận backend tính sai chỉ vì hai widget có số khác nhau khi chưa xác minh hợp đồng dữ liệu.

## 2. Phương pháp, độ phủ và giới hạn

### 2.1. Đã thực hiện

- Khảo sát qua phiên đăng nhập do người dùng cung cấp; vai trò đang hiển thị là Super Admin.
- Đọc nội dung thực tế, cây truy cập, trạng thái nút, đường dẫn sau thao tác và một số thông số CSS/DOM.
- Đo bố cục Dashboard ở 768×1024, 1024×768, 1280×720, 1440×900, 1920×1080 bằng viewport trình duyệt.
- Mở đủ 5 nhóm công việc ưu tiên, nút Xem tất cả, các nút cảnh báo và các nút xem bảo hành/báo cáo ngoại lệ.
- Xem danh sách và chi tiết tồn có chênh lệch; mở truy vết và tra cứu một SKU đã thấy trên màn.
- Xem danh sách bảo hành, chi tiết một hồ sơ đang sửa, form sửa thông tin, form xuất linh kiện, form cập nhật trạng thái; đều đóng mà không lưu.
- Xem báo cáo lỗi nhập, chi tiết một lô lỗi; mở hàng đợi SKU thiếu thông tin và form sửa của SKU đó.
- Mở báo cáo nhãn từ menu để xác minh quy tắc nghiệp vụ. Việc kiểm tra sâu nhật ký nhãn chưa hoàn tất.
- Mở bảng dữ liệu biểu đồ, thử bật/tắt một chuỗi, chuyển kỳ và loại hàng, quan sát trạng thái tải.
- Đối chiếu trực tiếp trang Vuexy tham chiếu và các token trong file ngữ cảnh.

### 2.2. Chưa kiểm chứng — phải giữ nguyên nhãn này khi giao DEV

- Chưa gửi thao tác lưu, tạo phiếu, ghi sổ, duyệt/hủy, in/in lại, cập nhật bảo hành hoặc thay đổi SKU.
- Chưa kiểm thử camera, máy quét vật lý, máy in, file xuất XLSX/PDF hoặc tải tệp lỗi.
- Chưa kiểm thử thành công/thất bại của API ghi, xung đột cập nhật, mất mạng, quyền theo từng vai trò, đăng nhập lại trong form đang sửa.
- Chưa kiểm thử đầy đủ các menu tìm kiếm, thông báo, tài khoản và đổi theme trong lượt này. Chỉ ghi nhận hiện diện và thông tin khảo sát trong ngữ cảnh cũ, không chấm điểm sâu các màn đó.
- Có thử nhập khoảng ngày không hợp lệ, nhưng chưa xác nhận được luồng sự kiện của date picker; không dùng lần thử này để kết luận validation đúng hoặc sai.
- Đây là kiểm tra bằng viewport giả lập, chưa thay thế kiểm tra trên iPad/Android tablet và Safari thực tế.
- Không đo Core Web Vitals, tải lớn, mức sử dụng CPU hoặc độ trễ API theo phương pháp chuẩn. Lỗi kết nối công cụ khi đọc báo cáo nhãn không được quy kết thành lỗi hiệu năng của ứng dụng.
- Cuối phiên, truy cập lại Dashboard bị chuyển sang Đăng nhập. Không xác định được nguyên nhân phiên kết thúc; không chủ động đăng xuất, không đọc hay sử dụng thông tin xác thực. Kích thước trình duyệt đã được khôi phục sau kiểm tra.

Số liệu dưới đây là ảnh chụp trạng thái giao diện tại thời điểm khảo sát. Nhiều bản ghi có tên mẫu/seed và ngày trong tương lai so với ngày khảo sát; không coi đây là bằng chứng về dữ liệu sản xuất. Báo cáo không sao chép tên, số điện thoại hoặc địa chỉ khách hàng.

## 3. Chấm điểm

### 3.1. Thang điểm tổng hợp Dashboard và hành trình action

| Tiêu chí | Điểm | Căn cứ chính |
| --- | ---: | --- |
| Thị giác và nhất quán Vuexy | 16/20 | Đúng font/màu/bề mặt; còn dư trang trí, nhãn và khoảng trống |
| Thứ bậc thông tin, tốc độ tìm việc | 12/20 | Có nhóm ưu tiên nhưng xuống sâu, cảnh báo lặp và cách đếm nhóm chưa rõ |
| Điều hướng từ cảnh báo đến xử lý | 8/20 | Nhiều action mở danh sách tổng; Xem tất cả không mở toàn bộ nhóm việc |
| Rõ nghĩa dữ liệu và hỗ trợ quyết định | 12/20 | Có công thức/đơn vị, nhưng phạm vi KPI–đối soát–snapshot chưa đủ minh bạch |
| Responsive tablet/laptop/desktop | 5/10 | Không tràn ở 768/1440/1920 trong trạng thái đo; tràn nội dung tại 1024/1280 |
| Khả năng tiếp cận và thao tác | 7/10 | Có nhãn, trạng thái nút, bảng thay thế; vùng chạm nhỏ và CTA chưa đủ tương phản |
| **Tổng** | **60/100** | **Cần ưu tiên sửa luồng và responsive trước khi tinh chỉnh thẩm mỹ** |

### 3.2. Điểm theo màn/phần đã xem

Các điểm dưới đây là điểm heuristic riêng từng màn, không cộng trung bình để tạo điểm tổng hợp bên trên.

| Màn/phần | Điểm /10 | Nhận xét |
| --- | ---: | --- |
| Dashboard — hình thức riêng | 8.0 | Đã nhận diện được Vuexy; không cần làm lại theme |
| Dashboard — trải nghiệm vận hành tổng thể | 6.0 | Nút cảnh báo chưa dẫn đúng công việc, phân cấp và phạm vi số liệu cần sửa |
| Tra cứu tồn & đối soát — danh sách | 6.0 | Nhiều cột hữu ích nhưng nặng; thiếu ngữ cảnh đến từ Dashboard |
| Chi tiết dòng tồn có chênh lệch | 5.5 | Thiếu phép so sánh quan trọng ngay trong màn chi tiết; còn mã lỗi kỹ thuật |
| Truy vết mã SKU | 6.0 | Tìm được dữ liệu và lịch sử; nhãn kết quả còn chung chung, danh sách dài |
| Danh sách bảo hành | 6.0 | Chưa phục vụ trực tiếp nhóm quá hạn; nhãn Sửa không khớp màn chi tiết mở ra |
| Chi tiết bảo hành | 7.0 | Có tiến trình/tab rõ, nhưng SLA và trách nhiệm xử lý chưa nổi bật |
| Form sửa thông tin bảo hành | 6.5 | Có lý do hiệu chỉnh; còn thuật ngữ nội bộ, cần kiểm thử giữ nháp/validation |
| Form cập nhật trạng thái bảo hành | 7.5 | Có cảnh báo tác động và kết quả xử lý bắt buộc; chưa thử gửi |
| Form xuất linh kiện từ bảo hành | 7.0 | Có kho và mã hồ sơ; cần rõ số lượng khả dụng, tác động của tạo nháp |
| Nhập liệu, đối chiếu & lỗi | 7.0 | Có nhiều lát cắt và drill-down; chưa khớp phạm vi action 75 lỗi |
| Chi tiết lô dữ liệu lỗi | 7.0 | Có dòng, mã và nội dung lỗi; tên cột và trạng thái tổng cần rõ hơn |
| Danh sách/hàng đợi SKU thiếu thông tin | 6.5 | Đã có bộ lọc đúng nhưng Dashboard chưa bật sẵn |
| Form sửa SKU thiếu thông tin | 6.5 | Có nhóm trường; chưa chỉ rõ checklist cần hoàn thiện theo nhiệm vụ |
| Báo cáo nhãn và action in/in lại | Chưa đủ dữ liệu | Đã xác minh nơi thực hiện lệnh in; chưa xem hết chi tiết hoặc thử gửi lệnh |

## 4. Bằng chứng responsive

Đo ở chế độ mặc định 7 ngày qua, Toàn bộ loại hàng, cấu trúc đã tải. Chiều rộng là CSS pixel, không phải pixel vật lý của thiết bị.

| Viewport | Vùng main: rộng nhìn thấy / rộng nội dung | Cao vùng main / cao nội dung | Vị trí đầu khối ưu tiên, trước khi cuộn | Kết luận |
| --- | ---: | ---: | ---: | --- |
| 768×1024 | 760 / 760 | 894 / 5296 | y≈1083 | Không tràn ngang main; hàng đợi chưa xuất hiện ở màn hình đầu |
| 1024×768 | 676 / 1056 | 626 / 5037 | y≈868 | Tràn ngang main khoảng 380px; sidebar mở làm nội dung quá hẹp |
| 1280×720 | 932 / 1064 | 578 / 3523 | y≈854 | Tràn ngang main khoảng 132px |
| 1440×900 | 1092 / 1092 | 766 / 3187 | y≈655 | Không tràn main trong trạng thái đo; mới thấy đầu khối ưu tiên |
| 1920×1080 | 1572 / 1572 | 946 / 3131 | y≈643 | Dư không gian hơn nhưng trang vẫn dài, thông tin lặp |

Không được chỉ kiểm tra `document.documentElement.scrollWidth`: toàn tài liệu không tràn nhưng `main` vẫn tràn và có thanh cuộn ngang bên trong.

Tại 1024px, sidebar chiếm khoảng 340px. Nhóm Loại hàng kéo đến x≈1085, khối Làm mới kéo đến x≈1385, ngoài mép viewport x=1024. Đây là lỗi tái hiện được, không chỉ là cảm nhận card chật.

### Yêu cầu sửa bố cục

- Bộ lọc cần tự xuống hàng theo container thực tế; dùng kích thước co giãn, `min-width: 0`, `minmax(0, 1fr)` và kiểm soát min-content của con.
- Không sửa bằng cách đặt `overflow-x: hidden` để che mất nút.
- Đề xuất sidebar 240–260px khi đủ chỗ; chuyển rail/drawer khi phần nội dung không còn đủ. Đây là thông số đề xuất, không phải token đã được chủ dự án duyệt.
- KPI dùng lưới co giãn, không ép 5 card trên hàng khi thiếu chỗ; giữ thống nhất vị trí các chỉ số khi đổi loại hàng.
- Header/bộ lọc gọn hơn. Không cần đồng thời quá nhiều dòng “trung tâm điều hành”, mô tả, vai trò, dữ liệu mới và giải thích lặp.
- Mục tiêu sản phẩm: công việc khẩn cấp đầu tiên nhìn thấy và chạm được trên màn hình đầu ở 768×1024 và 1024×768, thay vì nằm sau toàn bộ cụm KPI.
- Bảng dữ liệu rộng có thể cuộn ngang trong vùng riêng có gợi ý; giữ cột nhận diện và action quan trọng. Không áp dụng ngoại lệ này cho toàn Dashboard hoặc toolbar.
- Modal: header/footer giữ dễ tiếp cận, nội dung cuộn; kiểm tra thêm bàn phím ảo tablet. Modal tồn đã đo rộng 704px trong viewport 768px, không tràn chính nó ở trạng thái đó; chưa đủ để kết luận mọi modal đều tốt.

## 5. Đánh giá chi tiết Dashboard

### 5.1. Header, điều hướng và vùng giới thiệu

Hiện trạng: có tìm chức năng, ngôn ngữ, theme, lối tắt, thông báo, tài khoản; sidebar khá rộng. Tên logo và tên trang đều là heading cấp 1 trong DOM quan sát.

Đề xuất:

- Giữ nhận diện và thứ tự điều hướng Vuexy; giảm chiều rộng sidebar và phân biệt thao tác chức năng với điều hướng.
- Rút vùng giới thiệu về tên trang + phạm vi kho + thời điểm cập nhật. Vai trò tài khoản không cần chiếm nhiều chỗ trong mọi section.
- Trong heading structure, dùng tên trang làm h1 chính, tên thương hiệu không cần h1 thứ hai. Đây là cải tiến ngữ nghĩa, không phải kết luận tự động vi phạm WCAG.
- Tìm kiếm phải ghi rõ tìm chức năng, không để nhân viên hiểu nhầm là tìm SKU/chứng từ. Nếu bổ sung tìm nghiệp vụ cần phân nhóm kết quả và quyền truy cập; chưa có yêu cầu triển khai chức năng mới này.
- Footer bản quyền đang chiếm phần chiều cao cố định. Cân nhắc đưa xuống cuối nội dung để tăng diện tích làm việc ở laptop thấp.

### 5.2. Bộ lọc kỳ và loại hàng

Hiện trạng: Kỳ KPI có Hôm nay, 7 ngày qua, Trong tháng, Tùy chọn; bộ lọc Loại hàng; ngày thực tế và nút Làm mới. Bộ lọc Linh kiện thay đổi tồn khả dụng/nhập và bỏ KPI Xuất sản phẩm. Các nhóm công việc vẫn giữ số đếm; biểu đồ luồng tiếp tục là 7 ngày. Widget cơ cấu loại hàng đã ghi rõ không theo bộ lọc loại hàng.

Vấn đề: bộ lọc nằm ở cấp trang nhưng các widget phản ứng khác nhau. Dù có một số giải thích, người dùng vẫn phải nhớ “cái gì đổi/cái gì không”. Khi chuyển sang Tùy chọn, khoảng mặc định quan sát là 29/08–05/09, tức 8 ngày, khác kỳ 7 ngày trước đó.

Đề xuất:

- Phân biệt rõ bộ lọc “Số liệu trong kỳ” với “Tình trạng hiện tại”; mỗi widget ghi rõ phạm vi nếu không theo bộ lọc chung.
- Tùy chọn mở với khoảng đang áp dụng, trừ khi có quy tắc khác được PO chốt.
- Nếu có bước áp dụng, dùng nút “Áp dụng bộ lọc”; “Làm mới” chỉ tải lại phạm vi đã áp dụng. Không để hai ý nghĩa nhập nhằng.
- Bộ lọc cần được khôi phục khi quay lại Dashboard; đường dẫn có thể chia sẻ/tải lại mà vẫn giữ phạm vi không nhạy cảm.
- QA cần xác minh ngày bắt đầu/kết thúc, múi giờ, ngày tương lai, kỳ dài, kỳ rỗng và biên qua tháng/năm. Không đặt giới hạn kỳ tùy tiện trước khi thống nhất yêu cầu nghiệp vụ.

### 5.3. KPI: đẹp nhưng chưa đủ rõ nghĩa

| Chỉ số hiển thị | Giá trị quan sát | Cần làm rõ |
| --- | ---: | --- |
| Tổng tồn khả dụng | 7201; +1624 so với đầu kỳ | Tồn tại thời điểm nào? Loại trừ các trạng thái nào? Có trừ giữ chỗ không? |
| SKU đang có hàng | 134; +1 | Đếm distinct SKU nào, trong kho nào, theo trạng thái nào? Có theo Loại hàng không? |
| Nhập đã ghi sổ | 2872; +5,6% | Dựa trên dòng chứng từ hay sổ cái? Cutoff nào? |
| Xuất sản phẩm đã ghi sổ | 557; +2,4% | Đã loại hủy/hoàn tác chưa? |
| Xuất linh kiện bảo hành | 691; +6,8% | Chỉ bảo hành hay mọi loại xuất linh kiện? |

Đề xuất:

- Đặt đơn vị cạnh số, không chỉ ở một khối khác. Không cộng các đơn vị tính khác nhau thành “cái” nếu chưa chuẩn hóa được.
- Tách rõ số tồn tại thời điểm chốt và dòng phát sinh trong kỳ. Cụm “Tổng tồn khả dụng · 7 ngày qua” dễ khiến người dùng hiểu là tổng cộng tồn trong 7 ngày.
- Bổ sung giải thích ngắn hoặc popover cho công thức, phạm vi và thời điểm tính. Tooltip không được là cách duy nhất để người dùng tablet đọc định nghĩa quan trọng.
- Màu tăng/giảm phải theo ý nghĩa nghiệp vụ: xuất nhiều hơn hay nhập nhiều hơn không mặc nhiên là tốt. Dùng màu trung tính cho biến động nếu chưa có quy tắc đánh giá.
- KPI cần có drill-down xem danh sách/sổ tương ứng nếu đã thể hiện là thành phần có thể bấm. Hiện các KPI quan sát là article hiển thị, không phải nút; đây là đề xuất bổ sung chứ không phải lỗi nút hỏng.
- Trường hợp kỳ trước bằng 0 cần diễn giải “Mới phát sinh” hoặc cách tính đã chốt, không đưa phần trăm vô nghĩa.

### 5.4. Công việc ưu tiên và Điểm cần chú ý

Hiện trạng: 5 nhóm có số đếm 6, 15, 6, 75, 1. Hai nhóm đối soát/bảo hành lặp lại ở cột cảnh báo; bảo hành và chất lượng dữ liệu tiếp tục lặp ở cuối trang.

Vấn đề:

- “Xem tất cả 5 công việc” đang đếm nhóm, không phải 5 bản ghi. Khi lọc Khẩn cấp, nút thành “Xem tất cả 1 công việc” dù nhóm có 6 sự cố.
- Nút Xem tất cả dẫn đến riêng báo cáo nhập liệu/lỗi, không thể hiện toàn bộ các loại công việc.
- Action chỉ nằm ở chip số 62×34px; nội dung tên việc và mô tả dài nhưng không phải toàn hàng đều là action.
- Chưa thấy người phụ trách, hạn xử lý hoặc cách xếp thứ tự bên trong từng nhóm.

Đề xuất:

- Đổi thành “5 nhóm cần xử lý”; không tự cộng số đếm thành một tổng việc duy nhất trước khi bảo đảm đơn vị, phạm vi và chống đếm trùng.
- Nếu chưa có trung tâm công việc chung, bỏ/đổi nút Xem tất cả; không đặt tên bao quát cho một đích chỉ chứa lỗi dữ liệu.
- Mỗi hàng gồm: tên nhóm, số bản ghi, mức độ, ảnh hưởng ngắn, action “Xem 6 sự cố” hoặc “Xử lý 15 hồ sơ quá hạn”. Vùng action đủ lớn cho tablet.
- Gộp cảnh báo trùng với hàng đợi hoặc để khối tín hiệu bổ sung thông tin khác: mức thiếu hàng, tác động, thời hạn; không chỉ lặp cùng con số.
- Quy định ưu tiên dựa trên ảnh hưởng vận hành, hạn và quyền người dùng; không mặc định mọi vai trò nhìn cùng mọi công việc chỉ vì bản khảo sát là Super Admin.

### 5.5. Đối soát tồn theo kỳ

Phép tính quan sát: `5113 + 2838 − 556 − 685 + 1224 = 7934`. Phép cộng khớp. Tuy nhiên, việc phương trình số học khớp không chứng minh mọi sự cố đối soát tồn đã được đóng.

| Cùng/khác tên gần nhau | KPI | Khối đối soát/snapshot | Nhận xét |
| --- | ---: | ---: | --- |
| Nhập đã ghi sổ | 2872 | 2838 | Khác 34; cần chỉ ra phạm vi/công thức |
| Xuất sản phẩm | 557 | 556 | Khác 1 |
| Xuất linh kiện | 691 | 685 | Khác 6; nhãn KPI còn giới hạn bảo hành |
| Tồn cuối kỳ và tổng tồn snapshot | — | 7934 / 8231 | Khác thời điểm/trạng thái có thể hợp lệ; chưa giải thích đủ |
| Tồn khả dụng và tổng tồn snapshot | 7201 | 8231 | Các trạng thái còn lại cộng 1030, khớp phần chênh |

DEV/BA cần xác minh, không sửa số để làm chúng trông giống nhau:

- Chốt hợp đồng của từng metric: nguồn, kho, loại hàng, trạng thái, thời gian, đơn vị, công thức, quy tắc hoàn tác.
- Nếu cùng định nghĩa thì phải dùng cùng bộ tổng hợp hoặc có test đối chiếu; nếu khác thì đổi nhãn/giải thích đúng sự khác biệt.
- Đổi badge “Đã khớp” thành diễn giải có phạm vi, ví dụ “Cân bằng Nhập–Xuất–Tồn trong kỳ: chênh 0”; đặt tách biệt “6 sự cố tồn đang mở”.
- Làm rõ “Hoàn tác có dấu” là thuật ngữ nghiệp vụ nào. Có thể hiển thị “Điều chỉnh/hoàn tác ròng”, nhưng chỉ sau khi BA xác nhận nhóm này thực sự bao gồm gì.
- Nếu tổng hợp nhiều SKU có chênh lệch dương/âm, cần báo cả số dòng có lệch và tổng trị tuyệt đối; tổng chênh lệch bằng 0 có thể che các sai lệch bù nhau. Đây là yêu cầu kiểm tra, chưa kết luận hệ thống đang gặp lỗi này.
- Cho mở các dòng sổ tạo nên từng thành phần của công thức, với đúng cutoff và bộ lọc.

### 5.6. Biểu đồ và widget cuối trang

- Luồng nhập–xuất: giữ nút bật/tắt chuỗi và bảng số liệu đã hoạt động. Bổ sung tương tác chạm/keyboard để đọc điểm dữ liệu, không chỉ hướng dẫn “di chuột”. Nếu cố định 7 ngày, đặt khoảng ngày ngay trên chart và ghi rõ độc lập với Kỳ KPI.
- Không cần cùng lúc nhiều lớp mô tả/eyebrow/chip trên mỗi card. Giảm khoảng trống của card biểu đồ tròn khi hàng bên cạnh cao hơn.
- Tồn theo loại hàng: tổng 8231 = 2599 sản phẩm + 5632 linh kiện; hiển thị tên và giá trị rõ là điểm tốt. Nhãn “Ảnh chụp” nên đổi thành “Tồn hiện tại lúc HH:mm” cho người vận hành.
- Cơ cấu trạng thái: 7201 khả dụng, 381 chờ kiểm tra, 349 không thể bán/xuất, 300 hàng lỗi. Giữ nhãn chữ đi cùng màu; đưa mã AVAILABLE/QUARANTINE… vào phần kỹ thuật thay vì mặt chính.
- Cảnh báo định mức: 135 dưới ngưỡng, 44 vượt ngưỡng; hiện là số và đồ họa, chưa có action trực tiếp cho từng nhóm. Cần danh sách có tồn, min/max, mức thiếu/dư và vị trí; chưa tự động tạo đề nghị mua/nhập khi nghiệp vụ chưa yêu cầu.
- Bảo hành: 82 mở, 15 quá hạn, tuổi cao nhất 3 ngày. Phân biệt “tuổi hồ sơ” và “số ngày quá hạn”; không dùng thay nhau. Action phải rõ xem tất cả đang mở hay chỉ quá hạn.
- Top 5 SKU: hiện chỉ có mã và số lượng. Thêm tên ngắn, đơn vị và phạm vi loại hàng. “Xem bảng xếp hạng” có cấu trúc mở rộng tại chỗ `details/summary`; chưa thao tác mở mục này trong lượt audit. QA cần xác minh nội dung mở ra; nếu chỉ là bảng của 5 dòng hiện tại, đổi thành “Xem dạng bảng” sẽ rõ hơn.
- Chất lượng dữ liệu: cần đếm rõ số dòng lỗi, lô lỗi, hồ sơ hay sự cố; không gom tất cả vào “75 công việc” nếu người dùng không thể truy nguyên tập dữ liệu.

## 6. Bản đồ action: hiện tại và hành vi cần đạt

Các URL trong cột hiện tại là đường dẫn đã quan sát. Query/filter ở cột đề xuất là hợp đồng cần DEV thiết kế, không khẳng định hệ thống đã hỗ trợ chúng.

| Action tại Dashboard | Kết quả quan sát | Vấn đề / hành vi đích cần đạt |
| --- | --- | --- |
| 6 sự cố đối soát tồn | `/inventory`, mọi trạng thái, tổng 310 dòng; có cả dòng khớp | Vào tập sự cố đang mở/có chênh lệch, không bắt tự lọc lại; phân biệt đơn vị sự cố và dòng tồn |
| Mở đối soát tồn | URL `/inventory` | Dùng cùng hợp đồng với action 6 sự cố; không tạo hai đường dẫn khác ngữ nghĩa |
| 15 hồ sơ bảo hành cần xử lý | `/warranty`, bộ lọc tất cả, tổng 186 hồ sơ | Mở danh sách quá hạn/đang xử lý đúng định nghĩa số 15; ưu tiên hồ sơ quá hạn lâu nhất |
| Mở hồ sơ bảo hành | URL `/warranty` | Giữ tập quá hạn của cảnh báo |
| Xem hồ sơ bảo hành ở widget 82 mở | URL `/warranty` | Tên action phải nói rõ xem 82 hồ sơ mở hay 15 quá hạn; có thể tách hai action |
| 6 nhãn cần xử lý | `/outbound`, mọi trạng thái, tổng 128 phiếu xuất | Phiếu xuất là nơi gửi lệnh in theo mô tả hệ thống, nên không kết luận sai module. Lỗi là thiếu bộ lọc/định vị đúng nhãn lỗi và không giải thích 6 nhãn nằm trong phiếu nào |
| 75 lỗi nhập liệu/đối chiếu | `/reports/import-quality`; mặc định 01–05/09, tab nhập/chuyển đổi, 8 lô; 7 dòng lỗi và 10 trùng | Số 75 chưa truy nguyên được từ màn đến. Giữ phạm vi/nhóm lỗi; giải thích nếu số đó bao gồm nhiều luồng khác nhau |
| 1 sản phẩm chờ bổ sung | `/master-data/skus`, mọi trạng thái, tổng 819 SKU | Bật sẵn chế độ SKU chờ điền thông tin. Khi bật thủ công, hệ thống còn đúng 1 SKU |
| Xem tất cả 5 công việc | `/reports/import-quality` | Không thể đại diện mọi nhóm. Cần trung tâm công việc chung hoặc bỏ/đổi tên action |
| Mở tồn kho từ 135 SKU dưới ngưỡng | `/inventory`, mọi trạng thái, tổng 310 dòng | Mở tập SKU dưới min hợp lệ, đúng kho/phạm vi; không dùng số dòng trạng thái để đại diện số SKU |
| Xem báo cáo ngoại lệ | URL `/reports/import-quality` | Làm rõ xem lỗi nhập/đối chiếu hay cả SKU thiếu thông tin; nếu chỉ một loại phải đổi tên |
| Kỳ/loại hàng | Thay KPI; loại Linh kiện làm giảm số card còn 4 | Hiển thị phạm vi từng widget và tránh thay đổi bố cục đột ngột |
| Khẩn cấp | Còn nhóm 6 sự cố; footer ghi 1 công việc | Lọc hoạt động; sửa đơn vị đếm thành nhóm |
| Bật/tắt Nhập trên chart | `aria-pressed` chuyển false/true | Giữ hành vi; bổ sung kiểm thử tương tác chạm và trạng thái không chọn chuỗi nào |
| Xem bảng dữ liệu thay thế | Mở bảng 7 ngày ngay dưới chart | Giữ; tăng vùng chạm, tên nút gọn và rõ |
| Xem bảng xếp hạng | Đã kiểm tra cấu trúc `details/summary`; chưa thử mở nội dung | QA xác minh nội dung và đặt tên phù hợp; không hứa danh sách đầy đủ nếu chỉ mở 5 dòng |

### Hợp đồng điều hướng chung cần thống nhất

Mỗi action phải mang được: loại công việc, phạm vi kho, loại hàng nếu áp dụng, kỳ hoặc thời điểm snapshot, trạng thái cần xử lý, cách sắp xếp và nguồn quay lại Dashboard. Không bắt buộc mọi giá trị đều đưa lên URL; không đưa dữ liệu cá nhân lên URL.

Màn đến phải có chip/breadcrumb giải thích “Từ Dashboard · Đang xem hồ sơ quá hạn”, số kết quả và nút xóa lọc. Browser Back cần phục hồi bộ lọc và vị trí cuộn.

Nếu số đếm thay đổi vì dữ liệu mới, hiển thị thời điểm và thông báo hợp lý; không cố giữ số cũ để tạo cảm giác khớp. Nếu quyền làm số ở màn đến ít hơn Dashboard, phải sửa phạm vi đếm theo quyền hoặc giải thích rõ, không lộ bản ghi trái quyền.

## 7. Đánh giá từng màn action và yêu cầu DEV

### A1. Tra cứu tồn & đối soát — `/inventory`

**Đã thấy:** tab Tồn kho hiện tại/Lịch sử biến động; tìm kiếm, loại hàng, trạng thái, số dòng, truy vết. Bảng có khoảng 12 cột. Một SKU có thể xuất hiện nhiều dòng theo trạng thái.

**Vấn đề đã xác nhận:** action Dashboard không lọc chênh lệch hoặc dưới ngưỡng. Cột “Khả dụng” vẫn có số lượng ở dòng “Hàng lỗi”, “Chờ kiểm tra”, “Không thể bán/xuất”. Ví dụ một dòng Hàng lỗi hiển thị 8 cái ở cả Khả dụng và Tồn hiện có. Đây là mâu thuẫn về nhãn, cần xác minh định nghĩa dữ liệu; không tự sửa quy tắc xuất kho chỉ dựa trên giao diện.

**DEV sửa:**

- Tạo các chế độ xem có tên: Có chênh lệch, Dưới định mức, Vượt định mức, Tất cả. Chế độ đến từ Dashboard phải chọn sẵn.
- Nếu số ở cột là lượng trong trạng thái, đổi thành “SL theo trạng thái”. Nếu đúng là lượng có thể xuất, phải tính theo quy tắc khả dụng và loại trừ đúng các trạng thái khóa.
- Hàng mặc định ưu tiên SKU/tên, trạng thái, tồn ghi nhận, tồn sổ, delta, vị trí, action. Cột phụ có thể tùy chỉnh ẩn, nhưng delta không bị ẩn khi đang đối soát.
- Căn phải số lượng, giữ dấu ±, hiển thị đơn vị; giữ cột nhận diện/action khi bảng cuộn ngang.
- Bộ lọc và phân trang reset/restore nhất quán. Hiển thị rõ số SKU và số dòng trạng thái nếu cả hai đơn vị được dùng.

**Nghiệm thu:** từ cảnh báo chỉ một lần bấm đến tập đúng; có chip lọc; các dòng khóa không bị diễn giải là hàng được phép xuất; tablet vẫn nhìn và bấm được action.

### A2. Chi tiết tồn có chênh lệch

**Mẫu đã mở:** SKU HN-COMP-BASE-002. Danh sách có tồn ghi nhận 148, sổ 150, delta −2. Modal hiển thị số 148, nhưng không đưa phép so sánh 148/150/−2 lên rõ trong phần tổng quan. Có mã `BALANCE_NOT_EQUAL_SIGNED_LEDGER_SUM` và timestamp ISO. Phần tổng quan ghi “Biến động gần nhất: Chưa có” trong khi bảng liên quan đã có 10 biến động.

**DEV sửa:**

- Header: SKU + tên, kho, trạng thái, thời điểm. Banner: “Tồn ghi nhận thấp hơn sổ 2 cái” hoặc diễn giải đúng dấu delta.
- Ba ô trọng tâm: Tồn ghi nhận / Tồn theo sổ / Chênh lệch, cùng đơn vị và cutoff.
- Mã lỗi kỹ thuật và raw timestamp vào phần “Thông tin kỹ thuật”; mặt chính dùng tiếng Việt và giờ địa phương.
- Phân biệt dữ liệu chưa tải, không có biến động và không lấy được biến động; không cùng lúc kết luận “Chưa có” khi đã có danh sách.
- Chuẩn hóa Hộp/Khay: mẫu có mã TRAY được gọi là Hộp ở một nơi, nhưng bảng vật chứa cho loại Khay. Cần tên dựa trên loại vật chứa, không đoán từ mã.
- Cho mở sổ/chứng từ gây lệch hoặc chuyển đến quy trình kiểm tra/điều chỉnh đã tồn tại, có phân quyền. Không thêm nút “Sửa tồn cho khớp” cập nhật thẳng số lượng.

**Nghiệm thu:** người kiểm kho xác định được lệch bao nhiêu, phía nào thấp hơn, ở đâu, thời điểm nào và nên kiểm tra chứng từ nào mà không phải đóng modal quay lại bảng.

### A3. Truy vết mã

**Đã thấy:** hỗ trợ nhập mã, action Quét camera và Tra cứu; khi tra SKU HN-COMP-BASE-002 có tên SKU và 50 biến động. Header kết quả vẫn ghi “Mã vật lý: -”, “Loại mã khác”, “Trạng thái: Chưa xác định”; nhiều chứng từ hiển thị dấu “-”.

**DEV sửa:**

- Thay template kết quả theo loại đối tượng tìm thấy: SKU, serial, hộp, khay, chứng từ. Với SKU, không coi việc thiếu mã vật lý riêng là kết quả lỗi.
- Có tổng hợp kho/trạng thái và bộ lọc ngày/loại biến động; phân trang hoặc tải thêm nếu lịch sử dài, hiển thị tổng thật nếu chỉ trả 50 dòng đầu.
- Với chứng từ thiếu: nêu “Biến động điều chỉnh không có phiếu nguồn” hoặc lý do đúng, không dùng dấu “-” cho mọi trường hợp.
- Các đường dẫn chứng từ cần mở ở ngữ cảnh có thể quay lại kết quả tra cứu.
- QA riêng camera: xin quyền, từ chối quyền, không tìm thấy, nhiều kết quả, mã sai định dạng, mất mạng. Các trạng thái này chưa được thực hiện trong audit.

### A4. Danh sách bảo hành — `/warranty`

**Đã thấy:** 186 hồ sơ ở bộ lọc mặc định; có cả hoàn tất/hủy. Toolbar chưa có bộ lọc Quá hạn/SLA trực tiếp. Action trên dòng tên “Sửa” nhưng mở màn chi tiết có action sửa riêng.

**DEV sửa:**

- Tạo view Quá hạn, Sắp đến hạn, Đang mở, Tất cả; từ Dashboard vào sẵn đúng view.
- Bảng ưu tiên: mã hồ sơ + serial, trạng thái, hạn xử lý, quá hạn bao lâu, người phụ trách nếu nghiệp vụ có phân công, lỗi chính và Xem chi tiết.
- Đổi action “Sửa” hiện tại thành “Xem chi tiết” hoặc “Mở hồ sơ”; chỉ dùng Sửa cho form chỉnh dữ liệu.
- Giảm dữ liệu khách hàng không cần thiết trong danh sách, theo quyền; vẫn hỗ trợ tìm kiếm bằng thông tin được cấp quyền.
- SLA sort tăng mức quá hạn, có tie-breaker ổn định; không chỉ sort theo ngày nhận.

**Nghiệm thu:** từ số 15 đến đúng tập quá hạn theo thời điểm/phạm vi; nhìn thấy hạn và độ trễ mà không mở từng hồ sơ.

### A5. Chi tiết bảo hành

**Đã thấy:** tiến trình tiếp nhận → kiểm tra → sửa → hoàn tất → trả khách; Tổng quan, Ảnh & video, Linh kiện, Lịch sử; thông tin tiếp nhận và chẩn đoán. Có action Sửa thông tin, Xuất linh kiện, Cập nhật trạng thái.

**DEV sửa:**

- Đặt SLA, hạn dự kiến và mức quá hạn cạnh trạng thái, không chôn trong nhóm thông tin dưới.
- Phân biệt trạng thái hồ sơ và trạng thái hiện vật. Không dùng màu hoàn tất để ngụ ý hàng đã quay lại tồn khả dụng.
- Nhóm thông tin khách hàng có thể thu gọn; vùng chẩn đoán/công việc tiếp theo ưu tiên hơn với kỹ thuật viên.
- Số đếm tab phải có loading riêng, không nháy 0 khiến người dùng tưởng không có lịch sử trước khi tải xong.
- Một action chính phù hợp trạng thái; action khác ở cấp phụ. Không dùng bước tiến trình như nút thay đổi trạng thái nếu chưa có form kiểm soát.
- Kiểm tra thứ tự ngày: mẫu khảo sát có ngày dự kiến hoàn thành trước ngày nhận và nhiều bản ghi tương lai. Có thể là dữ liệu mẫu; cần QA xác minh quy tắc ngày và cảnh báo, chưa kết luận lỗi dữ liệu sản xuất.

### A6. Sửa thông tin bảo hành

**Đã thấy:** lỗi danh mục, ngày dự kiến, ngày mua, thông tin khách, địa bàn, địa chỉ, lý do hiệu chỉnh. Label chứa “Tên khách gửi (PII)”, “Số điện thoại (PII)”.

**DEV sửa:** dùng nhãn tiếng Việt bình thường; đưa giải thích bảo vệ dữ liệu vào quyền/tooltip phù hợp. Lý do hiệu chỉnh có hướng dẫn ngắn, rõ khi nào bắt buộc. Khi đổi Tỉnh/Thành phố phải xử lý giá trị Phường/Xã không còn hợp lệ. Ghi nhận trước/sau trong timeline theo quyền, không chỉ lưu lời lý do.

**Nghiệm thu cần QA:** sai ngày, thiếu trường, số điện thoại, đổi địa bàn, đóng khi có sửa, lỗi API giữ nội dung, double-submit, xung đột phiên bản. Audit chỉ mở/đóng form, chưa thử lưu.

### A7. Cập nhật trạng thái bảo hành

**Điểm tốt:** form nói rõ cập nhật trạng thái không tự làm hàng trở lại tồn có thể bán; chuyển Đã trả khách đánh dấu giao lại. Có trạng thái mới, lỗi/chẩn đoán tùy chọn và kết quả xử lý bắt buộc.

**DEV hoàn thiện:**

- Hiển thị rõ trạng thái hiện tại → trạng thái sẽ chuyển; chỉ đưa chuyển tiếp được phép, giải thích khi bị khóa.
- Ngày hoàn tất/trả khách, người thực hiện và nội dung kết quả theo quy tắc nghiệp vụ; không mặc định mọi bước đều cùng bộ trường.
- Xác nhận tác động trước thao tác quan trọng, nhưng không thêm confirm dư thừa cho mọi click.
- Lỗi API giữ nguyên nội dung, nút có loading và chặn gửi lặp; phát hiện hồ sơ đã bị người khác cập nhật.
- Form mở trên modal chi tiết cần quản lý focus, Escape đóng tầng trên trước và trở về đúng action đã mở.

### A8. Xuất linh kiện từ hồ sơ bảo hành

**Đã thấy:** kho xuất, mã hồ sơ, SKU linh kiện, số lượng, thêm dòng, ghi chú, “Tạo phiếu DRAFT”. Không thực hiện tạo phiếu.

**DEV hoàn thiện:**

- Đổi nhãn thành “Tạo phiếu nháp”; nói rõ bước này đã/ chưa giữ chỗ hoặc trừ tồn theo nghiệp vụ thật.
- Mỗi dòng có tên SKU, đơn vị, lượng khả dụng của đúng kho và trạng thái; không chỉ hiện tổng tồn.
- Kiểm tra số lượng hợp lệ, SKU lặp, linh kiện ngừng dùng và thay đổi tồn sau khi mở form.
- Hiển thị lý do không đủ tồn và hướng đi được phép; không tự thay kho hoặc tự cho xuất âm.
- Sau tạo thành công trong môi trường QA, giữ mã hồ sơ và đưa tới đúng phiếu nháp, tránh tạo hai phiếu do gửi lại.

### A9. Nhãn cần xử lý và báo cáo nhãn

**Đã xác minh:** Dashboard mở `/outbound` với tất cả 128 phiếu. Màn `/reports/packing-label?screen=RPT-05` tự mô tả là chỉ đọc; lệnh in/in lại thực hiện tại phiếu xuất, không phát sinh từ báo cáo và không tác động tồn kho.

**Kết luận đúng phạm vi:** đích phiếu xuất có cơ sở nghiệp vụ. Chưa tốt ở chỗ chưa giới hạn/định vị đúng 6 nhãn cần xử lý. Không yêu cầu biến báo cáo chỉ đọc thành màn gửi lệnh in nếu chưa được PO duyệt.

**DEV sửa/thiết kế luồng:**

1. Dashboard → danh sách 6 nhãn/lần in cần xử lý, hoặc phiếu xuất được lọc và mở đúng vùng nhãn.
2. Mỗi dòng: mã nhãn, phiếu, trạng thái, lần thử gần nhất, máy in, nguyên nhân và action được phép.
3. Chi tiết: bản xem trước đúng phiên bản nhãn, dữ liệu nguồn và lịch sử thử/in lại.
4. Nếu được cấp quyền in: đi tới action tại phiếu xuất; xác nhận máy in, số bản và lý do in lại theo nghiệp vụ.
5. Kết quả phải phân biệt đã gửi lệnh, đang chờ, thành công, thất bại, chưa xác định. Không tự thử lại khi chưa biết máy in đã nhận hay chưa.

Màn báo cáo đang ghi “In lỗi” gồm cả lượt chờ máy in phản hồi. Nên tách Chờ phản hồi và Thất bại để nhân viên không in lại trùng. Tooltip/diễn giải kỹ thuật như “hợp đồng RPT-LABEL-01”, “bản lưu bất biến” nên chuyển sang cách gọi phù hợp người vận hành; vẫn giữ bằng chứng kỹ thuật ở chi tiết.

**Giới hạn:** phần chi tiết nhãn, preview, form in/in lại và kết quả gửi chưa được kiểm chứng; 5 bước trên là đặc tả đề xuất, không phải mô tả chức năng đã có đủ.

### A10. Nhập liệu, đối chiếu & lỗi — `/reports/import-quality`

**Đã thấy:** 2 tab nghiệp vụ, kỳ riêng, nhiều bộ lọc, KPI/charts, nhóm mã lỗi và nhật ký. Tại kỳ mặc định 01–05/09 có 8 lô, 260 dòng, 243 hợp lệ, 7 lỗi, 10 trùng. Dashboard trước đó là 75 lỗi và kỳ 30/08–05/09; chưa thể đối chiếu trực tiếp.

**DEV sửa:**

- Action Dashboard phải chọn đúng tab, kỳ và nhóm lỗi. Nếu 75 là tổng nhiều nguồn, cần phân rã đến từng nguồn để người dùng truy nguyên.
- Giữ bộ lọc toàn trang và bộ lọc trong bảng nếu thực sự cần, nhưng phải nêu rõ cái nào tác động KPI, cái nào chỉ lọc bảng. Tránh hai ô tìm kiếm trông giống nhau mà phạm vi khác nhau.
- Mã lỗi phổ biến cần nhãn tiếng Việt trước, mã kỹ thuật sau.
- Một lô có 2 lỗi +3 trùng nhưng badge “Hợp lệ” dễ bị hiểu là toàn bộ lô sạch. Phân biệt trạng thái xử lý lô với chất lượng dòng: ví dụ “Đã kiểm tra · Có 5 dòng cần xử lý”, nếu đúng semantics.
- Từ lỗi ưu tiên đưa đến ngay nhật ký đã lọc, không bắt đi qua nhiều màn hình phân tích rồi mới thấy action.

### A11. Chi tiết lô dữ liệu lỗi

**Đã thấy:** tổng dòng, tỷ lệ hợp lệ, các nhóm lỗi/trùng, tải tệp lỗi, thời gian, người thực hiện, checksum, phiên bản và bảng lỗi theo dòng. Nội dung lỗi tiếng Việt đủ hữu ích.

**DEV sửa:**

- Cột “SKU / khóa nghiệp vụ” đang chứa `sku_code`, `sku_name`, `category_code` ở mẫu quan sát; đây giống tên trường lỗi hơn là giá trị SKU. Đổi tên cột theo dữ liệu thật, tách giá trị lỗi nếu có và được phép hiển thị.
- Mỗi lỗi nên có dòng Excel, tên trường, giá trị đã nhập, nguyên nhân và cách sửa có thể thực hiện.
- Checksum/phiên bản để trong vùng kỹ thuật gọn; ưu tiên phần người dùng cần sửa.
- Làm rõ tải tệp lỗi chứa tất cả hay chỉ lỗi đang lọc; sau khi nhập lại phải phân biệt sửa lô cũ hay tạo lần nhập mới, chống ghi trùng. Không khẳng định cơ chế này đã được kiểm thử.

### A12. SKU chờ bổ sung và form sửa — `/master-data/skus`

**Đã thấy:** Dashboard đến 819 SKU. Bấm “SKU chờ điền thông tin” trong danh sách còn 1 SKU. SKU đó thuộc Linh kiện, trong khi Dashboard gọi nhóm là “Sản phẩm chờ bổ sung thông tin”. Form có mã/tên/loại/đơn vị, danh mục tham chiếu, đóng gói, định mức và lựa chọn quản lý serial.

**DEV sửa:**

- Bật sẵn chế độ chờ điền từ Dashboard; giữ filter khi đóng form/quay lại.
- Đổi tên nhóm thành “SKU chờ hoàn thiện thông tin” nếu bao gồm cả sản phẩm và linh kiện.
- Hiển thị “Còn thiếu: Hãng, Nhóm hàng, …” ngay trong hàng đợi; form mở từ nhiệm vụ cần highlight các trường làm bản ghi chưa hoàn thiện.
- Điều kiện bắt buộc Hãng/Model/Nguồn điện cần theo loại hàng/quy tắc đã chốt; không mặc định mọi linh kiện đều có cùng yêu cầu như sản phẩm hoàn chỉnh.
- Phân biệt thiếu dữ liệu bắt buộc với chưa cấu hình định mức tùy chọn. Không bắt điền min/max chỉ để hết cảnh báo nếu nghiệp vụ cho phép để trống.
- Mã SKU đang được tham chiếu và cờ quản lý serial cần có quy tắc sửa rõ; không cho đổi dễ dàng nếu ảnh hưởng truy vết đang tồn tại.
- Sau lưu thành công trong QA, chỉ loại SKU khỏi hàng đợi khi thỏa điều kiện đầy đủ thực sự; báo thành công và giữ vị trí làm việc.

## 8. Hệ thống thị giác và accessibility

### 8.1. Token nên dùng khi DEV sửa

| Thành phần | Hiện trạng / ngữ cảnh | Đề xuất |
| --- | --- | --- |
| Font | Public Sans | Giữ, không thay font toàn hệ thống |
| Màu nhấn thương hiệu | #7367F0 | Giữ ở accent/active/icon phù hợp |
| CTA nền đặc + chữ trắng | Nút Làm mới: #7367F0, chữ trắng, 15px/500 | Dùng #675DD8 như biến thể trong ngữ cảnh, kiểm tra đủ hover/focus/disabled |
| Nền / card | Sáng, card trắng | Giữ #F8F7FA và trắng; không phủ tím |
| Chữ chính | #2F2B3D | Giữ phân cấp; hạn chế quá nhiều chữ mảnh/nhạt |
| Heading | h1 24px, h2 18px đo được | Hợp lý; giảm lớp nhãn lặp hơn là tăng kích thước |
| Chữ body | 15px; một số nhãn 12.5–13px | Nội dung thao tác thường xuyên ưu tiên 14–15px; chữ phụ nhỏ dùng có chọn lọc |
| Touch target | Nhiều nút 32–38px, chip công việc 34px, summary 18px | Mục tiêu sản phẩm 44–48px cho thao tác chính trên tablet |
| Spacing / radius | Ngữ cảnh ghi radius phổ biến 6px | Giữ hệ token nhất quán; chọn nhịp 8/12/16/24, giảm padding không có giá trị |

### 8.2. Vấn đề tương phản đã tính từ CSS thực tế

Nút Làm mới khi enabled: chữ #FFFFFF trên nền #7367F0, font 15px, weight 500. Tỷ lệ tương phản tính theo relative luminance khoảng **4,26:1**, thấp hơn ngưỡng **4,5:1** cho chữ thường. Đổi nền CTA thành #675DD8 với chữ trắng cho khoảng **5,08:1**, vẫn cùng họ tím và phù hợp token trong file ngữ cảnh. Tham chiếu [WCAG 2.2 — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Đây là phát hiện ở cặp màu/control đã đo, không phải kết luận mọi nút tím hay toàn bộ theme đều không đạt. Không dùng ảnh chụp bị làm mờ để đo tương phản.

### 8.3. Touch và keyboard

Khuyến nghị vùng chạm 44–48px là mục tiêu thao tác tablet cho sản phẩm này. Không được ghi rằng mọi nút dưới 44px vi phạm WCAG AA: tiêu chí Target Size Minimum của WCAG 2.2 dùng 24×24 CSS px hoặc các ngoại lệ về khoảng cách/tương đương. Tham chiếu [WCAG 2.2 — Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

Checklist bổ sung:

- Nút icon có tên truy cập; trạng thái chọn có semantics như aria-pressed, không chỉ màu.
- Vùng focus rõ, không bị header/footer che; kiểm tra mở/đóng modal và focus trả về đúng nơi.
- Không dựa vào hover để xem dữ liệu chart hoặc định nghĩa số quan trọng.
- Loading dùng aria-busy/status phù hợp; không liên tục đọc lại toàn bộ số liệu mỗi 60 giây.
- Ngôn ngữ trợ năng của bảng/chart nên theo locale; báo cáo lỗi có legend trợ năng lẫn tiếng Anh trong màn tiếng Việt.
- Summary bảng thay thế đã có cấu trúc HTML phù hợp, nhưng vùng cao 18px khó chạm. Tăng padding, không cần thay bằng div giả nút.

## 9. Backlog ưu tiên giao DEV

P1: cản trở tìm/xử lý đúng việc hoặc tạo nguy cơ đọc sai số quan trọng. P2: nâng hiệu quả, khả năng tiếp cận và độ nhất quán. P3: tinh chỉnh sau. Đây là mức ưu tiên audit, không phải mã P0/P1/P2 của công việc nghiệp vụ trên Dashboard. Chưa có bằng chứng để gán lỗi P0 gây mất dữ liệu/ngừng hệ thống.

| ID | Ưu tiên | Đầu việc | Chủ trì đề xuất | Tiêu chí nghiệm thu chính |
| --- | --- | --- | --- | --- |
| D01 | P1 | Deep-link 6 sự cố đối soát | FE + BE/BA | Một click đến đúng tập; chip phạm vi; phân biệt sự cố/dòng tồn |
| D02 | P1 | Deep-link 15 bảo hành quá hạn | FE + BE/BA | Có view SLA, số khớp cùng cutoff/quyền, không hiện hồ sơ đóng không liên quan |
| D03 | P1 | Deep-link nhãn cần xử lý | FE + BA | Định vị đúng nhãn/phiếu; không gửi in từ báo cáo chỉ đọc |
| D04 | P1 | Deep-link lỗi nhập/đối chiếu | FE + BE/BA | Truy nguyên được số 75 qua đúng nguồn/kỳ/nhóm lỗi |
| D05 | P1 | Deep-link SKU thiếu thông tin | FE | Vào sẵn chế độ 1 SKU thiếu, không mở 819 SKU mặc định |
| D06 | P1 | Deep-link SKU dưới ngưỡng | FE + BE/BA | Đúng tập distinct SKU với min hợp lệ; có tồn/min/mức thiếu |
| D07 | P1 | Sửa Xem tất cả và đơn vị đếm | FE + UX | Không gọi 5 nhóm là 5 việc; action không dẫn riêng báo cáo lỗi |
| D08 | P1 | Sửa overflow main/filter 1024/1280 | FE | Không mất Loại hàng/Làm mới; main không cuộn ngang ngoài bảng riêng |
| D09 | P1 | Hợp đồng metric và phạm vi đối soát | BE + BA + FE | Mọi chênh lệch KPI/snapshot truy nguyên được, nhãn phản ánh đúng |
| D10 | P1 | Sửa nghĩa Khả dụng trong bảng tồn | BA + BE + FE | Không diễn giải hàng lỗi/khóa là có thể xuất nếu quy tắc không cho |
| D11 | P1 | Chi tiết chênh lệch 148/150/−2 | FE + BE | Có comparator, cutoff, chứng từ và trạng thái tải nhất quán |
| D12 | P2 | Nén đầu trang, ưu tiên việc sớm | UX + FE | Việc khẩn cấp đầu tiên nhìn/chạm được trên 2 viewport tablet mục tiêu |
| D13 | P2 | Giảm cảnh báo trùng | UX + FE | Một nguồn đếm, không lặp cùng thông tin ở 3 khối |
| D14 | P2 | Nêu phạm vi bộ lọc từng widget | FE + BA | Phân biệt hiện tại/trong kỳ/7 ngày; Tùy chọn kế thừa kỳ phù hợp |
| D15 | P2 | Đổi nhãn Sửa thành Xem chi tiết | FE | Tên action bảo hành đúng loại màn mở |
| D16 | P2 | SLA trên list/detail bảo hành | FE + BA | Hạn, độ quá hạn và trách nhiệm rõ; không nhầm tuổi hồ sơ |
| D17 | P2 | Bảo vệ form và trạng thái ghi | FE + BE | Giữ dữ liệu khi lỗi, chặn gửi lặp, xử lý stale version, dirty-close |
| D18 | P2 | Form nháp xuất linh kiện | FE + BA | Nhãn tiếng Việt, rõ tác động tồn, đúng kho/đơn vị/khả dụng |
| D19 | P2 | Phân loại trạng thái in | FE + BE/BA | Tách chờ/thất bại/chưa rõ; chống in lại trùng khi kết quả không chắc |
| D20 | P2 | Trạng thái lô và cột lỗi nhập | FE + BA | Không gọi lô có lỗi là sạch; tên trường/giá trị lỗi tách đúng |
| D21 | P2 | Checklist hoàn thiện SKU | FE + BA | Nêu trường còn thiếu và điều kiện theo loại; giữ ngữ cảnh sau lưu |
| D22 | P2 | Việt hóa thông tin kỹ thuật | FE + UX | Mã lỗi, PII, DRAFT, enum và timestamp có trình bày dễ hiểu |
| D23 | P2 | CTA đủ tương phản | FE | Cặp màu enabled ≥4,5:1 cho chữ thường, giữ họ tím Vuexy |
| D24 | P2 | Touch target và keyboard | FE + QA | Action chính 44–48px theo mục tiêu; focus/modal/summary dùng được |
| D25 | P2 | Truy vết theo loại đối tượng | FE + BA | SKU không bị mô tả như mã vật lý chưa xác định; lịch sử có cách lọc |
| D26 | P2 | Loading/empty/stale/error rõ nghĩa | FE + BE | Không hiển thị 0/Chưa có cho dữ liệu chưa tải; trạng thái theo từng widget |
| D27 | P3 | Chart và Top SKU gọn hơn | UX + FE | Thêm tên/đơn vị; giảm khoảng trống; bảng và chart cùng phạm vi |
| D28 | P3 | Header/footer/heading semantics | FE + UX | Giảm chiếm chỗ; tên trang là h1 chính; giữ đầy đủ điều hướng |

Không coi cột Chủ trì là kết luận nguyên nhân trong mã nguồn; audit chưa truy cập repository của ứng dụng thật. FE/BE/BA cần cùng xác định ranh giới sửa.

### Thứ tự triển khai đề xuất

1. Chốt data dictionary và hợp đồng action; viết test từ ví dụ quan sát, không khóa số fixture vào test production.
2. Sửa các deep-link, cách đếm và responsive đang che control.
3. Sửa comparator tồn, nghĩa Khả dụng, SLA và thông tin xử lý nhãn/lỗi/SKU.
4. Tinh gọn bố cục, tăng touch target/tương phản, chuẩn hóa trạng thái form.
5. Regression toàn bộ ma trận tablet–desktop và quyền trên staging; sau đó mới cập nhật prototype/triển khai khi được yêu cầu.

## 10. Định hướng bố cục để DEV/UX thống nhất trước khi dựng

Đây là định hướng đề xuất, chưa phải thiết kế đã được chủ dự án duyệt.

| Thứ tự | Nội dung | Vai trò |
| --- | --- | --- |
| 1 | Tên trang + kho + cập nhật; bộ lọc gọn | Biết đang xem phạm vi nào |
| 2 | Công việc khẩn cấp/cần xử lý, action rõ | Bắt đầu vận hành ngay |
| 3 | Tồn hiện tại và luồng trong kỳ, phân biệt hai nhóm | Nắm tình hình không lẫn đơn vị/thời điểm |
| 4 | Đối soát gọn, có mở sổ chi tiết | Kiểm chứng số liệu |
| 5 | Chart xu hướng + cơ cấu trạng thái | Phân tích nguyên nhân |
| 6 | Top SKU và phân tích bổ sung | Theo dõi chuyên sâu, không lặp cảnh báo đầu trang |

Ở desktop có thể bố trí KPI và hàng đợi cạnh nhau nếu đủ rộng, nhưng ưu tiên công việc phải xuất hiện sớm. Ở tablet dọc, dùng thứ tự tuyến tính và không đẩy hàng đợi xuống dưới nhiều hàng KPI. Không chuyển thành landing page marketing, không thêm hero/illustration lớn vào màn vận hành.

## 11. Checklist nghiệm thu cho QA

### Điều hướng và dữ liệu

- [ ] Mỗi action số đếm có tập dữ liệu đích truy nguyên được cùng kho, cutoff, trạng thái và quyền.
- [ ] D01–D07 qua test với 0, 1, nhiều bản ghi; count thay đổi trong lúc chuyển màn được xử lý rõ.
- [ ] Back/reload/direct URL giữ bộ lọc và ngữ cảnh; không lộ dữ liệu cá nhân trong URL.
- [ ] Tồn hiện tại, tồn cuối kỳ, khả dụng, ghi sổ, điều chỉnh/hoàn tác có định nghĩa đã duyệt.
- [ ] Tổng phương trình khớp không che sự cố đang mở hoặc lệch bù trừ.
- [ ] Các chỉ số khác loại hàng/đơn vị không bị cộng tùy tiện.

### Responsive và accessibility

- [ ] 768×1024, 1024×768, 1280×720, 1440×900, 1920×1080: kiểm tra cả body và main, không chỉ screenshot.
- [ ] Thêm 900×768 và 960×768 để bắt vùng đổi breakpoint; chưa được đo trong audit này.
- [ ] Drawer/rail/sidebar đều mở, đóng và điều hướng được; bộ lọc tùy chọn không đẩy nút ra ngoài.
- [ ] Chữ/số dài, số lớn, tên SKU dài, tiếng Việt không bị cắt mất thông tin bắt buộc.
- [ ] Touch target theo mục tiêu tablet, keyboard Tab/Enter/Escape, focus restore và chart không phụ thuộc hover.
- [ ] Tương phản màu tính từ CSS ở enabled/hover/focus và nền thực; không chỉ dùng màu thương hiệu để suy ra đạt chuẩn.
- [ ] Safari/iPadOS và tablet Android thực tế, xoay ngang/dọc, bàn phím ảo, zoom người dùng.

### Màn action và an toàn nghiệp vụ — thực hiện ở staging

- [ ] Modal tồn giữ comparator và không mâu thuẫn trạng thái loading/empty.
- [ ] Bảo hành: các transition được phép/không phép; hoàn tất khác trả khách; không tự quay lại tồn bán.
- [ ] Xuất linh kiện: kho, đơn vị, tồn thay đổi, số lượng không hợp lệ, nhấp gửi hai lần.
- [ ] Nhãn: chờ phản hồi, timeout chưa rõ, lỗi, retry, reprint; không in lại trùng; báo cáo vẫn chỉ đọc.
- [ ] Nhập lỗi: có hướng sửa từng dòng; nhập lại không vô tình ghi trùng; tệp tải đúng phạm vi.
- [ ] SKU: điều kiện đủ dữ liệu đúng loại; sau lưu hàng đợi cập nhật và giữ vị trí.
- [ ] Mọi form: lỗi API giữ dữ liệu; xung đột cập nhật; quyền bị thay đổi; mất phiên; đóng khi có sửa.
- [ ] Loading/empty/error/stale/không đủ quyền được tách biệt, không dùng số 0 giả hoặc thông báo “Chưa có” gây hiểu sai.

## 12. Brief có thể sao chép để giao DEV

> Sửa Dashboard và các action theo backlog D01–D28 trong báo cáo này. Giữ baseline Vuexy đã chốt: Public Sans, nền #F8F7FA, card/sidebar trắng, tím nhấn #7367F0; CTA chữ trắng dùng biến thể đủ tương phản như #675DD8. Không đổi theme toàn trang hoặc sửa auth. Ưu tiên deep-link đến đúng tập việc, overflow 1024/1280, định nghĩa metric và chi tiết chênh lệch. Mọi thay đổi nghiệp vụ/công thức cần BA/PO xác nhận. Kiểm thử thao tác ghi trên staging; không in, ghi sổ hoặc sửa dữ liệu thật để demo. Nộp ảnh/video và kết quả QA từng viewport, từng action, cùng danh sách giới hạn còn lại. Những đề xuất chưa có trong hệ thống phải được ghi là bổ sung, không mô tả như chức năng đã triển khai.

---

Tài liệu này là báo cáo riêng cho đợt audit Dashboard. Không thay thế/xóa file ngữ cảnh đã chốt, không cập nhật website prototype và không triển khai thay đổi lên hệ thống thật.
