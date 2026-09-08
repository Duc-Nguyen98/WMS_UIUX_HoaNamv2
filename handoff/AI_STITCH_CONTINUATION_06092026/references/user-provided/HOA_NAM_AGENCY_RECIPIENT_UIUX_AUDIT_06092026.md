# HOA NAM WMS — ĐÁNH GIÁ DANH MỤC ĐẠI LÝ / NƠI NHẬN & CÁC MÀN ACTION

Ngày khảo sát: 06/09/2026 · Ngôn ngữ: Tiếng Việt · Phạm vi thiết bị: tablet từ 768px, laptop và desktop.

Hệ thống được khảo sát trực tiếp: https://khohoanamfe.bigk.click/master-data/agencies?screen=AGY-01

Ngữ cảnh đối chiếu: `HOA_NAM_SKU_UIUX_AUDIT_05092026.md` do chủ dự án đính kèm. Baseline thị giác giữ theo Vuexy Demo 1: Public Sans, nền sáng, bề mặt trắng và tím làm màu nhấn.

## 1. Kết luận điều hành

**Điểm tổng hợp: 61/100 — giao diện đúng baseline đã chốt và luồng Thêm/Sửa tương đối gọn, nhưng chưa đủ an toàn cho một danh mục được dùng làm nơi nhận hàng: sắp xếp sai toàn tập, bảng tablet làm mất nhận diện đối tượng, dữ liệu địa bàn đang có hai nguồn nhập và form Sửa phát hiện tín hiệu không nhất quán ở trường điện thoại cần DEV xác minh ngay.**

Không cần đổi theme hoặc phủ thêm màu tím. Phần cần sửa chủ yếu là hành vi dữ liệu, khả năng kiểm soát master data, responsive và ngữ nghĩa trường.

Tám việc nên giao DEV/BA trước:

1. Sửa sort toàn bộ tập dữ liệu trước khi phân trang; hiện Mã A→Z đưa `AG-001…AG-091` sang trang 2 sau `KHDA/KHL/NPP` ở trang 1.
2. Ở 768–1440px, giữ Mã/Tên và cột Sửa cùng ngữ cảnh khi cuộn ngang; hiện muốn thấy Sửa phải làm Mã/Tên rời khỏi màn hình.
3. Điều tra trường Điện thoại trong form Sửa `AG-090`: ảnh giao diện thể hiện `0901234590`, nhưng DOM/cây truy cập của input trả giá trị rỗng. Phải xác minh state và payload trước khi cho phép lưu.
4. Chốt và bảo vệ luồng chuẩn hóa địa chỉ cũ: `AG-090` có địa chỉ tự do nhưng Tỉnh/Thành phố và Phường/Xã trống; không được làm mất địa chỉ cũ khi người dùng sửa trường không liên quan.
5. BA chốt nguồn sự thật cho “Thị trường”, “Khu vực” và địa chỉ chuẩn hóa; hai trường đầu đang cho nhập tự do trong khi địa chỉ dùng danh sách Tỉnh/Phường.
6. Hiển thị số chứng từ/đơn/phiếu đang tham chiếu và hậu quả trước khi đổi Mã, Loại hoặc Trạng thái; backend phải bảo vệ toàn vẹn tham chiếu theo quy tắc BA duyệt.
7. Đưa từ khóa, loại, trạng thái, sort, trang và số dòng vào URL hoặc cơ chế khôi phục tương đương; hiện URL không đổi khi thao tác.
8. Tách rõ mã kỹ thuật và nhãn người dùng: danh sách đang hiển thị `MIEN_BAC`, `HO_CHI_MINH`, `DAK_LAK` thay vì nhãn tiếng Việt dễ đọc.

Đây là đánh giá chuyên gia dựa trên quan sát trực tiếp giao diện và hành vi an toàn, không phải kiểm toán dữ liệu, kiểm thử backend, kiểm thử bảo mật, nghiên cứu người dùng hay chứng nhận WCAG toàn hệ thống.

### 1.1. Những gì nên giữ

- Public Sans, nền `#F8F7FA`, card trắng, chữ gần `#2F2B3D`; tím `#7367F0`/`#675DD8` chỉ làm accent.
- Breadcrumb, tiêu đề, mô tả, phạm vi “Toàn hệ thống” và vai trò hiển thị rõ.
- Search, hai bộ lọc, page-size, CTA Thêm và bảng nằm trong cùng một khu vực làm việc.
- Trạng thái có nhãn chữ “Đang sử dụng/Ngừng sử dụng”, không phụ thuộc riêng màu.
- Form hai cột vừa trong viewport 768px ở trạng thái đã xem.
- Phường/Xã bị khóa cho đến khi chọn Tỉnh/Thành phố; hành vi phụ thuộc này rõ và hợp lý.
- Form hiển thị chuỗi “Địa chỉ đầy đủ” sau khi chọn địa bàn.
- Bản ghi địa chỉ cũ có cảnh báo cần chuẩn hóa thay vì âm thầm coi dữ liệu cũ là dữ liệu mới.
- Không có action Xóa trực tiếp được quan sát; vòng đời đang dùng Ngừng sử dụng, phù hợp hướng an toàn cho master data.

### 1.2. Những điều không được suy diễn thành yêu cầu đã chốt

- Không đổi sidebar/nền trang thành tím và không đổi framework.
- Không thiết kế cho điện thoại; phạm vi bắt đầu từ 768px.
- Không khẳng định `Thị trường` phải được tự động suy ra từ Tỉnh/Thành phố; BA phải định nghĩa hai khái niệm.
- Không khẳng định mọi trường liên hệ/địa chỉ là bắt buộc; giao diện quan sát chỉ đánh dấu Mã, Tên và Loại là bắt buộc.
- Không kết luận việc lưu `AG-090` sẽ xóa số điện thoại; chỉ xác nhận tín hiệu hiển thị và giá trị input đọc được đang mâu thuẫn.
- Không kết luận danh sách 34 Tỉnh/Thành phố và các Phường/Xã là đúng/sai so với dữ liệu hành chính chính thức; tính chính xác dữ liệu nguồn chưa được kiểm toán.
- Không tự đặt điều kiện được Ngừng sử dụng, đổi Loại hoặc đổi Mã nơi nhận.
- Không kết luận backend cho phép mã trùng, số điện thoại sai hoặc tổ hợp địa bàn sai; chưa submit form.
- Không yêu cầu thêm Xóa, Import hoặc bulk action khi chưa có nghiệp vụ được PO xác nhận.

## 2. Phương pháp, độ phủ và giới hạn

### 2.1. Đã thực hiện

- Khảo sát bằng phiên đăng nhập sẵn có; vai trò hiển thị là Super Admin.
- Đọc nội dung, cây truy cập, DOM/CSS, kích thước control và URL sau các thao tác không ghi dữ liệu.
- Đo danh sách tại 768×1024, 900×768, 1024×768, 1280×720, 1440×900 và 1920×1080.
- Quan sát cuộn ngang bảng ở tablet để đối chiếu cột nhận diện và action.
- Tìm chính xác `AG-001`, tìm chuỗi không tồn tại `ZZZ-KHONG-TON-TAI`, sau đó xóa tìm kiếm.
- Mở các lựa chọn Loại, Trạng thái và số dòng/trang.
- Lọc theo loại và đọc toàn bộ 26 bản ghi qua hai trang; lọc Ngừng sử dụng để xác định tập năm bản ghi.
- Sắp Mã A→Z, đọc trang 1 và trang 2 để kiểm chứng thứ tự toàn tập và STT.
- Mở form Thêm, đọc toàn bộ trường, giới hạn ký tự, trạng thái mặc định và danh sách Loại.
- Chọn thử Tỉnh/Thành phố Hà Nội trong form Thêm để quan sát danh sách Phường/Xã và chuỗi địa chỉ đầy đủ; đóng form, không lưu.
- Mở form Sửa `AG-090`, đọc dữ liệu, trạng thái địa chỉ cũ và kiểm tra trường Điện thoại; đóng bằng Escape, không lưu.
- Kiểm tra không còn modal, search/filter về mặc định, trang 1 và viewport đã reset ở cuối phiên.

### 2.2. Chưa kiểm chứng — phải giữ nguyên nhãn này khi giao DEV

- Chưa bấm Lưu ở form Thêm/Sửa; chưa kiểm tra validation sau submit, thông báo thành công/thất bại hay chống double-submit.
- Chưa thay đổi nội dung form rồi đóng nên chưa xác minh cảnh báo unsaved changes.
- Chưa xác minh payload mạng hoặc dữ liệu sau lưu của trường Điện thoại.
- Chưa xác minh mã nơi nhận có bị khóa theo lịch sử tham chiếu hay backend có chặn đổi mã/loại/trạng thái không.
- Chưa kiểm tra bản ghi đang được phiếu nhập/xuất/đơn hàng tham chiếu, vì vậy không khẳng định tác động nghiệp vụ của Ngừng sử dụng.
- Chưa kiểm thử quyền theo vai trò khác Super Admin.
- Chưa kiểm thử mất mạng, request chậm, hai phiên cùng sửa, dữ liệu tên/địa chỉ cực dài hoặc ký tự đặc biệt.
- Chưa kiểm thử thiết bị tablet vật lý, bàn phím ảo, trình đọc màn hình hoặc contrast bằng thiết bị đo chuẩn.
- Chưa kiểm toán tính đúng đắn của danh sách địa giới hành chính.

Mọi chức năng bổ sung dưới đây được ghi là **đề xuất** hoặc **cần BA/PO xác nhận**, không phải mô tả chức năng hiện có.

## 3. Chấm điểm

### 3.1. Điểm tổng hợp

| Tiêu chí | Điểm | Căn cứ chính |
| --- | ---: | --- |
| Thị giác và nhất quán Vuexy | 17/20 | Font, màu, bề mặt đúng baseline; CTA/action chưa phân cấp tối ưu |
| Rõ ràng thông tin và khả năng quét | 11/20 | Đủ trường nhưng hiển thị mã nội bộ, tên/địa chỉ bị rút gọn và action xa nhận diện |
| Search, filter, sort, pagination | 8/15 | Search/filter hoạt động; sort sai toàn tập và state không vào URL |
| Chất lượng action Thêm/Sửa | 10/20 | Form gọn, địa chỉ phụ thuộc rõ; còn rủi ro hydrate điện thoại, migration địa chỉ và impact |
| Responsive tablet/laptop/desktop | 6/10 | Có cuộn bảng; 768–1440px vẫn mất ngữ cảnh, 1024px là trường hợp xấu nhất |
| Accessibility và thao tác | 6/10 | Nhiều control có tên; table/sort thiếu semantic và target nhỏ |
| Phản hồi, an toàn, khôi phục | 3/5 | Có trạng thái/legacy warning; chưa có bằng chứng submit và conflict handling |
| **Tổng** | **61/100** | **Giữ theme; sửa hành vi dữ liệu và responsive trước** |

### 3.2. Điểm theo khu vực/action

| Khu vực/action | Điểm /10 | Nhận xét |
| --- | ---: | --- |
| Danh sách — thị giác | 7.5 | Sạch, đúng Vuexy; nhiều cột và mã kỹ thuật làm giảm khả năng đọc |
| Danh sách — vận hành | 5.5 | Action đơn giản nhưng tách xa Mã/Tên trên tablet |
| Search/filter | 7.0 | Dễ hiểu, trả kết quả đúng ví dụ đã thử; thiếu reset nhanh và URL state |
| Sort/pagination | 4.0 | Sort A→Z sai qua ranh giới trang; STT không theo thứ tự nhìn thấy |
| Form Thêm | 7.0 | Cấu trúc rõ, phụ thuộc Tỉnh→Phường tốt; thiếu hướng dẫn format/rule |
| Form Sửa | 5.5 | Địa chỉ cũ được cảnh báo; cần làm rõ phone hydration, đổi mã/loại và impact |
| Responsive | 5.5 | Modal vừa 768px; bảng cần cuộn rất nhiều và mất đối tượng thao tác |
| Accessibility | 6.0 | Có accessible labels cơ bản; bảng/header sort chưa đầy đủ |

## 4. Ảnh chụp trạng thái dữ liệu và cấu trúc màn

Tại thời điểm khảo sát:

- Tổng: **26 nơi nhận**.
- Mặc định: **15 dòng/trang**, **2 trang**.
- Số dòng/trang: 10, 15, 20, 50.
- Search hiển thị: “Tìm mã / tên / thị trường / khu vực”.
- Bộ lọc Loại: Nhà phân phối, Đại lý, Khách công trình, Khách lẻ.
- Bộ lọc Trạng thái: Đang sử dụng, Ngừng sử dụng.
- Cột: STT, Mã, Tên nơi nhận, Loại nơi nhận, Thị trường, Khu vực, Người liên hệ, Điện thoại, Địa chỉ, Trạng thái và cột action.
- Action cấp trang quan sát được: Thêm nơi nhận.
- Action cấp hàng quan sát được: Sửa.
- Không thấy action Xem, Xóa, Import hoặc bulk trong phạm vi màn đã quan sát.

### 4.1. Phân bố dữ liệu đã quan sát

| Loại | Tổng | Ngừng sử dụng | Đang sử dụng | Căn cứ |
| --- | ---: | ---: | ---: | --- |
| Đại lý | 11 | 2 | 9 | `AG-001…AG-009`, `AG-090`, `AG-091` |
| Nhà phân phối | 5 | 1 | 4 | `NPP-001…NPP-004`, `NPP-090` |
| Khách công trình | 5 | 1 | 4 | `KHDA-001…KHDA-004`, `KHDA-090` |
| Khách lẻ | 5 | 1 | 4 | `KHL-001…KHL-004`, `KHL-090` |
| **Tổng** | **26** | **5** | **21** | Tập 26 hàng và filter Ngừng sử dụng đã đọc trực tiếp |

Năm bản ghi Ngừng sử dụng được quan sát: `AG-090`, `AG-091`, `KHDA-090`, `KHL-090`, `NPP-090`.

Nhiều tên đã chứa trạng thái vòng đời trong ngoặc — “ngừng hợp tác”, “đã kết thúc”, “ngừng giao dịch” — đồng thời có badge Ngừng sử dụng. Đây chưa phải lỗi dữ liệu, nhưng BA cần chốt trạng thái có đủ biểu đạt lý do hay tên phải mang thông tin lịch sử. Nếu cho kích hoạt lại, tên có thể trở nên mâu thuẫn với badge.

## 5. Responsive từ tablet trở lên

Chiều rộng dưới đây là CSS pixel. Bảng có vùng cuộn ngang riêng; toàn document không tràn ngang trong các trạng thái đo.

| Viewport | Vùng main | Vùng nhìn bảng / độ rộng bảng | Quan sát |
| --- | ---: | ---: | --- |
| 768×1024 | 768px | 682 / 1223px | Chỉ thấy khoảng nửa bảng; sidebar chuyển sang nút mở; form 576px vẫn vừa |
| 900×768 | 900px | 810 / 1223px | CTA xuống hàng; bảng và nội dung phải cuộn dọc nhiều |
| 1024×768 | 684px, sidebar 340px | 590 / 1223px | Trường hợp xấu nhất; vùng nhìn chưa bằng nửa bảng |
| 1280×720 | 940px, sidebar 340px | 846 / 1223px | Vẫn chưa thấy Trạng thái và Sửa ở vùng ban đầu |
| 1440×900 | 1100px, sidebar 340px | 1006 / 1223px | Vẫn cần cuộn ngang; action nằm ngoài vùng nhìn ban đầu |
| 1920×1080 | 1580px, sidebar 340px | 1486 / 1486px | Bảng giãn và vừa trọn trong trạng thái đo |

### 5.1. Rủi ro nhận diện đối tượng

Ở 768px, vùng bảng ban đầu hiển thị STT, Mã, Tên, Loại, Thị trường và một phần Khu vực. Khi cuộn sang phải để thấy Trạng thái và Sửa, Mã/Tên đã rời khỏi màn hình; người dùng chỉ còn địa bàn, liên hệ, địa chỉ và nút Sửa. Đây là rủi ro thao tác nhầm hàng, không chỉ là vấn đề thẩm mỹ.

Ở 1024px với sidebar mở, bảng chỉ có 590px vùng nhìn cho bảng 1223px. Việc mở sidebar ở một breakpoint vốn thường dùng cho tablet ngang/laptop nhỏ làm nội dung hẹp hơn 768px dọc.

### 5.2. Yêu cầu responsive giao DEV

- Giữ Mã + Tên ở trái và Hành động ở phải bằng sticky columns, hoặc dùng hàng mở rộng/card-table ở 768–1024px.
- Sticky phải có nền đặc, đường phân cách, shadow nhẹ và `z-index` đúng; test khi hover/focus/scroll.
- Không sửa bằng `overflow-x: hidden`; người dùng phải tiếp cận được mọi trường và action.
- Có chỉ báo cuộn ngang ở tablet: gradient mép phải hoặc thông điệp ngắn, biến mất khi đã cuộn hết.
- Ưu tiên cột Mã, Tên, Loại, Trạng thái, Sửa. Người liên hệ, Điện thoại, Địa chỉ có thể đưa vào hàng mở rộng trên tablet nếu chọn phương án responsive table.
- Toolbar ở 768–1024px chia nhóm: search; Loại + Trạng thái; page-size + Thêm. Giữ CTA ở vị trí ổn định giữa các breakpoint.
- Tên/địa chỉ bị truncate phải có cách xem đủ bằng focus/chạm hoặc hàng mở rộng; không phụ thuộc riêng hover/title.
- QA tối thiểu các viewport đã đo, với sidebar mở/thu gọn, 50 dòng/trang, tên 255 ký tự và địa chỉ 200 ký tự.

## 6. Kiến trúc thông tin và thuật ngữ

### 6.1. “Đại lý / nơi nhận” đang bao phủ nhiều loại đối tượng

Danh mục hiện chứa Đại lý, Nhà phân phối, Khách công trình và Khách lẻ. Tiêu đề “Danh mục đại lý / nơi nhận” có thể hiểu được nhờ dấu “/”, nhưng mô tả “Danh mục đại lý / nơi nhận hàng” chưa giải thích rõ đây là master data dùng ở bước nghiệp vụ nào.

Đề xuất copy, chỉ triển khai sau khi BA xác nhận phạm vi dùng:

- Giữ tiêu đề hiện tại để không đổi thuật ngữ đã quen.
- Mô tả rõ hơn: “Quản lý các đơn vị và cá nhân có thể được chọn làm nơi nhận trong nghiệp vụ xuất/chuyển hàng.” Cụm nghiệp vụ chính xác phải do BA chốt.

### 6.2. “Thị trường”, “Khu vực” và địa chỉ

Quan sát trực tiếp:

- Bảng hiển thị Thị trường dạng `MIEN_BAC`, `MIEN_TRUNG`, `MIEN_NAM`.
- Khu vực hiển thị dạng mã như `HA_NOI`, `HO_CHI_MINH`, `DAK_LAK`, `QUANG_NINH`.
- Trong form, Thị trường và Khu vực là text field tự do, tối đa 120 ký tự.
- Tỉnh/Thành phố và Phường/Xã là combobox phụ thuộc.
- Chọn Thành phố Hà Nội mở danh sách 126 Phường/Xã trong snapshot đã xem; danh sách Tỉnh/Thành phố hiển thị 34 lựa chọn.

Vấn đề là một bản ghi có thể mang địa bàn ở cả trường text tự do lẫn selector chuẩn hóa. Chưa có thông tin để kết luận ba trường phải đồng nhất hay có ý nghĩa khác nhau.

Yêu cầu BA/DEV:

- BA định nghĩa từng trường, chủ sở hữu dữ liệu và trường nào là nguồn sự thật.
- Nếu Thị trường là vùng kinh doanh, dùng danh mục có mã + nhãn, không cho gõ tùy ý.
- Nếu Khu vực đồng nghĩa Tỉnh/Thành phố, bỏ nhập trùng hoặc tự điền có kiểm soát sau khi BA duyệt.
- Nếu Khu vực là vùng bán hàng riêng, đổi nhãn/mô tả để không bị hiểu là địa giới.
- UI hiển thị nhãn “Miền Bắc”, “Hồ Chí Minh”, “Đắk Lắk”; mã kỹ thuật chỉ dùng cho tích hợp/export khi cần.
- Backend validate quan hệ theo hợp đồng BA chốt; frontend không tự suy ra bằng chuỗi.

### 6.3. Vòng đời Ngừng sử dụng

Không thấy action Xóa là điểm tốt. Tuy nhiên, form cho đổi cả Mã, Loại và Trạng thái mà không thấy usage count/impact hoặc helper về dữ liệu đã tham chiếu.

Cần BA xác nhận:

- Ngừng sử dụng chặn chọn cho chứng từ mới hay còn tác động nào khác?
- Chứng từ cũ phải luôn đọc được tên/địa chỉ snapshot hay đọc master data hiện tại?
- Có cho kích hoạt lại không; tên chứa “ngừng hợp tác/đã kết thúc” được xử lý thế nào?
- Khi đổi địa chỉ nơi nhận, chứng từ cũ giữ địa chỉ đã giao hay đổi theo master data?
- Có cho đổi Mã hoặc Loại sau khi đã phát sinh chứng từ không?

Không tự triển khai cascade, đổi snapshot lịch sử hoặc khóa trường cho tới khi BA/PO duyệt.

## 7. Danh sách, search, filter, sort và pagination

### 7.1. Điểm tốt

- Search và filter đặt trước bảng, đúng mental model danh sách quản trị.
- Search chính xác `AG-001` trả một bản ghi đúng.
- Empty state ghi “Không có nơi nhận phù hợp bộ lọc.”, không nói sai rằng hệ thống chưa có dữ liệu.
- Filter loại và trạng thái có nhãn đầy đủ; tổng kết quả cập nhật theo điều kiện.
- Số dòng/trang có bốn lựa chọn quen thuộc.
- Badge Loại và Trạng thái giúp quét nhanh.

### 7.2. Điểm cần cải thiện

- Empty state không có “Xóa tìm kiếm/Xóa bộ lọc”. Người dùng phải tự tìm control gây rỗng.
- Không có chip điều kiện đang áp dụng hoặc nút Xóa tất cả.
- Search input có `maxlength=2000`, quá rộng so với tác vụ tìm mã/tên và không có lợi ích rõ trên UI; DEV nên chốt giới hạn hợp lý theo API, không chỉ giảm tùy ý ở frontend.
- URL luôn là `?screen=AGY-01`; search, loại, trạng thái, sort, page và page-size không được phản ánh.
- Mã nội bộ ở Thị trường/Khu vực làm bảng giống dữ liệu kỹ thuật hơn giao diện vận hành.
- Tên và địa chỉ rút gọn nhưng chưa có affordance rõ để xem đầy đủ trên tablet.
- Chỉ có Sửa, không có Xem. Với dữ liệu liên hệ/địa chỉ, PO cân nhắc row detail/read-only view nếu người dùng chỉ cần tra cứu; đây là đề xuất, không phải thiếu sót bắt buộc.

### 7.3. Lỗi sort toàn tập — P1

Kịch bản tái hiện trực tiếp:

1. Trạng thái mặc định, 26 bản ghi, 15 dòng/trang.
2. Bấm Mã để sắp A→Z; aria-label đổi sang hành động kế tiếp Z→A.
3. Trang 1 hiển thị `KHDA-001…KHDA-090`, `KHL-001…KHL-090`, `NPP-001…NPP-090`.
4. Trang 2 mới hiển thị `AG-001…AG-091`.

Nếu sort toàn bộ 26 mã A→Z, nhóm `AG-...` phải đứng trước `KHDA-...`. Quan sát này đủ để xác nhận sort đang áp dụng theo trang hoặc sort/pagination không dùng cùng tập dữ liệu.

STT sau sort trang 1 lần lượt gồm `14, 3, 15, 2, 1, 6…`; trang 2 gồm `18, 26, 20, 19…`. STT giữ thứ tự cũ thay vì phản ánh vị trí hiện tại, dễ bị hiểu nhầm là thứ tự bản ghi.

Yêu cầu sửa:

- Pipeline phải là filter → sort toàn tập → paginate.
- Hợp đồng API có sort field/direction hoặc cơ chế tương đương; frontend không sort riêng mảng của trang.
- Sau sort, trở về trang 1 và cập nhật URL/state.
- STT hiển thị `(page-1)*pageSize + rowIndex + 1` theo tập đã sort, hoặc bỏ STT nếu không có giá trị nghiệp vụ.
- Test tích hợp tối thiểu hai trang với prefix đảo thứ tự như `AG`, `KHDA`, `KHL`, `NPP`.
- BA chốt collation cho mã, dấu tiếng Việt, chữ/số/null; DEV không dùng thứ tự ngầm khác nhau giữa FE và BE.

### 7.4. Trạng thái URL

Đề xuất hợp đồng URL về mặt ý nghĩa:

`?screen=AGY-01&q=...&type=...&status=...&sort=code.asc&page=2&pageSize=15`

Tên tham số do DEV chốt. Tiêu chí là refresh, back, forward, chia sẻ nội bộ và quay lại từ Sửa khôi phục đúng view; không đưa thông tin liên hệ hay dữ liệu nhạy cảm vào URL.

## 8. Đánh giá màn action Thêm nơi nhận

### 8.1. Cấu trúc quan sát

Form gồm:

| Trường | Bắt buộc trên UI | Kiểu/giới hạn quan sát | Mặc định/hành vi |
| --- | --- | --- | --- |
| Mã nơi nhận | Có | Text, tối đa 50 | Rỗng |
| Tên nơi nhận | Có | Text, tối đa 255 | Rỗng |
| Loại nơi nhận | Có | Select 4 loại | “Chọn loại nơi nhận” |
| Thị trường | Không | Text, tối đa 120 | Rỗng |
| Khu vực | Không | Text, tối đa 120 | Rỗng |
| Người liên hệ | Không | Text, tối đa 200 | Rỗng |
| Điện thoại | Không | Text, `inputmode=numeric`, tối đa 10 | Rỗng |
| Trạng thái | Không có dấu * | Select | Đang sử dụng |
| Tỉnh/Thành phố | Không có dấu * | Combobox | Rỗng |
| Phường/Xã | Không có dấu * | Combobox | Khóa trước khi chọn Tỉnh |
| Địa chỉ cụ thể | Không có dấu * | Text, tối đa 200 | Rỗng |

Loại nơi nhận gồm Nhà phân phối, Đại lý, Khách công trình, Khách lẻ. Modal có Đóng, Hủy và Lưu nơi nhận. Nút Lưu đang enabled khi ba trường bắt buộc còn rỗng; chưa submit nên không kết luận validation thiếu.

### 8.2. Điểm tốt

- Hai cột giúp form gọn trên desktop/tablet ngang.
- Dấu * xuất hiện ở ba trường bắt buộc quan sát được.
- Trạng thái mặc định Đang sử dụng được thể hiện rõ.
- Luồng Tỉnh→Phường có disabled state và đổi trạng thái ngay sau khi chọn.
- Địa chỉ cụ thể chiếm toàn chiều rộng, đúng với chuỗi dài.
- Chọn Tỉnh tạo preview “Địa chỉ đầy đủ”, giúp người dùng kiểm tra kết quả tổng hợp.

### 8.3. Điểm cần cải thiện

- Không có helper về format Mã: ký tự được phép, tự chuyển uppercase, khoảng trắng, duy nhất hay ví dụ theo loại.
- Thị trường/Khu vực cho nhập tự do trong khi dữ liệu đang dùng code; nguy cơ phát sinh biến thể chính tả hoặc mã ngoài danh mục.
- Điện thoại giới hạn 10 số và input numeric nhưng không có helper format. Nếu dự án chỉ dùng số Việt Nam, BA xác nhận; nếu có số bàn/quốc tế/extension, rule hiện tại cần xem lại.
- Không thấy gợi ý liệu Người liên hệ/Điện thoại/Địa chỉ có bắt buộc theo từng Loại hay không.
- Save enabled trước khi form hợp lệ có thể chấp nhận nếu submit đưa lỗi inline; QA phải kiểm tra focus lỗi đầu tiên, giữ dữ liệu và chống submit lặp.
- CTA Lưu là tím nhạt giống kiểu secondary; trong modal, nên dùng primary tím đặc nếu phù hợp design token đã chốt, Hủy là text/secondary.
- Nút Đóng 34px, Hủy/Lưu 38px; với tablet nên hướng tới vùng chạm 44–48px như mục tiêu sản phẩm, không đồng nghĩa hiện trạng chắc chắn vi phạm WCAG.
- Chưa thấy cảnh báo dirty form; cần QA thay đổi dữ liệu rồi thử Đóng/Hủy/Escape.

## 9. Đánh giá màn action Sửa nơi nhận

### 9.1. Bản ghi kiểm tra

`AG-090 — Đại lý Hoa Nam Quảng Ninh (ngừng hợp tác)`:

- Loại: Đại lý.
- Thị trường: `MIEN_BAC`.
- Khu vực: `QUANG_NINH`.
- Người liên hệ: Trịnh Văn Hải.
- Điện thoại trên bảng: `0901234590`.
- Địa chỉ: `12 Trần Phú, TP. Hạ Long, Quảng Ninh`.
- Trạng thái: Ngừng sử dụng.

Mã, Tên, Loại, Thị trường, Khu vực, Người liên hệ, Điện thoại, Trạng thái và Địa chỉ cụ thể được trình bày trên form. Tỉnh/Thành phố trống, Phường/Xã bị khóa, kèm cảnh báo: “Địa chỉ cũ nhập tự do — chọn tỉnh / thành và phường / xã để chuẩn hoá theo địa giới mới.”

### 9.2. Tín hiệu không nhất quán ở Điện thoại — cần điều tra P1

Trong cùng trạng thái form:

- Ảnh giao diện thể hiện `0901234590` trong vùng trường Điện thoại.
- Cây truy cập không công bố Value cho trường này.
- Thuộc tính/value đọc trực tiếp từ input `#agency-phone` trả chuỗi rỗng.
- Bảng nền vẫn có `0901234590`.

Không bấm Lưu nên **không kết luận dữ liệu sẽ bị xóa**. DEV cần tái hiện bằng React state/form library và xem request payload trong môi trường test.

Tiêu chí nghiệm thu:

- Input DOM value, form state, giá trị nhìn thấy và payload phải giống nhau.
- Mở Sửa rồi Lưu mà không đổi gì phải giữ nguyên số điện thoại.
- Sửa một trường không liên quan không được xóa Điện thoại.
- Nếu dữ liệu không hợp lệ theo rule mới, hiển thị cảnh báo/migration rõ; không âm thầm bỏ giá trị cũ.
- Test các trường hợp rỗng, 10 số, số bắt đầu bằng 0, paste có khoảng trắng và dữ liệu legacy; rule cuối cùng do BA duyệt.

### 9.3. Chuẩn hóa địa chỉ cũ

Cảnh báo migration là điểm tốt, nhưng chưa rõ khi người dùng Lưu mà không chọn Tỉnh/Phường thì hệ thống giữ, xóa hay chuyển địa chỉ cũ.

Yêu cầu DEV/BA:

- Giữ nguyên chuỗi legacy nếu người dùng sửa trường không liên quan.
- Không ghép `Địa chỉ cụ thể` legacy với Tỉnh/Phường mới gây lặp địa danh.
- Nếu bắt buộc chuẩn hóa, nêu rõ trước khi submit và cung cấp lựa chọn có kiểm soát; không chặn mơ hồ.
- Preview địa chỉ đầy đủ phải cho thấy chính xác dữ liệu sẽ lưu.
- Cần kế hoạch migration hàng loạt riêng nếu số bản ghi legacy nhiều; không biến từng lần Sửa thành quy trình ngầm chưa được duyệt.
- Chứng từ lịch sử phải giữ địa chỉ theo rule snapshot/reference do BA chốt.

### 9.4. Đổi Mã, Loại và Trạng thái

Ba trường đều có vẻ editable trong form đã quan sát; Mã và Loại không bị disabled và không có helper về tham chiếu.

Trước khi cho lưu thay đổi nhạy cảm:

- Hiển thị usage count theo các loại chứng từ mà API thực sự hỗ trợ.
- Nếu khóa, nói rõ lý do và đường xử lý; backend cũng phải khóa.
- Nếu cho đổi Mã, bảo đảm link/reference dùng ID bất biến, không làm gãy lịch sử.
- Nếu đổi Loại, BA xác nhận ảnh hưởng đến nghiệp vụ và báo cáo.
- Nếu Ngừng sử dụng, nêu tác động với chứng từ mới, chứng từ nháp và dữ liệu cũ.
- Không tự cascade hoặc sửa chứng từ lịch sử.

## 10. Thị giác và baseline Vuexy

### 10.1. Đúng hướng

- Body quan sát dùng Public Sans, nền `rgb(248,247,250)` và chữ gần `rgba(47,43,61,.9)`.
- CTA Thêm dùng tím `rgb(103,93,216)` trên nền tím nhạt, bo 6px.
- Card/bảng trắng, khoảng cách và form outline đồng nhất với ngữ cảnh SKU.
- Badge trạng thái xanh/cam có text rõ.

### 10.2. Cần tinh chỉnh

- “Thêm nơi nhận” là action chính nhưng đang dùng bề mặt tím nhạt; dùng primary tím đặc để tăng thứ bậc nếu toàn hệ thống thống nhất token này.
- Nút Sửa dùng nền cam và chữ nâu — màu warning cho một action bình thường. Nên chuyển secondary/neutral hoặc tím outline; giữ cam cho cảnh báo.
- Mã Thị trường/Khu vực uppercase có underscore phá vỡ nhịp đọc tiếng Việt; render label, giữ code ở tầng dữ liệu.
- Tên và địa chỉ truncate khá sớm ở 1440px dù bảng vẫn cuộn; cần cân bằng lại width/cột ưu tiên.
- Không tăng độ phủ tím ở sidebar, nền hoặc status badge; sửa hierarchy bằng màu ở CTA/focus, không “tím hóa” toàn màn.

## 11. Accessibility và thao tác bàn phím/tablet

### 11.1. Hiện trạng tốt

- Search, filter, CTA và nút Sửa có tên truy cập.
- Nút sort có aria-label mô tả thao tác kế tiếp.
- Modal có `role=dialog`, tiêu đề và `aria-labelledby`.
- Escape đóng modal và focus quay lại nút Sửa đã mở form trong lần kiểm tra.
- Trạng thái có text bên trong badge.

### 11.2. Điểm cần sửa/test

- Table không có caption, `aria-label` hoặc `aria-labelledby`.
- Các `th` không có `scope`; không có `aria-sort` để công bố trạng thái sort hiện tại.
- Header action có `aria-label="Hành động"` nhưng `innerText` rỗng; người dùng thị giác không thấy nhãn cột.
- Sort button chỉ cao khoảng 19px; cần vùng click bao trọn header cell, không chỉ phần chữ/icon.
- Pagination quan sát khoảng 26×26px, nút đóng modal 34×34px, action/form button 38px. WCAG 2.2 AA quy định target tối thiểu 24×24 CSS px với ngoại lệ; không kết luận tự động vi phạm. Với tablet, mục tiêu 44–48px cho action thường dùng là đề xuất sản phẩm để giảm bấm nhầm.
- Cần kiểm tra focus trap, thứ tự Tab, focus ring, lỗi validation/live region và tooltip bằng bàn phím; chưa kiểm thử đầy đủ.
- Tên/địa chỉ đầy đủ phải truy cập được bằng chạm và focus, không chỉ hover.
- Đo contrast token thực tế cho chữ phụ, viền input, disabled ward và badge; không kết luận bằng cảm nhận.

Tham khảo kỹ thuật: [W3C WCAG 2.2 — Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## 12. Backlog giao DEV/BA

### P0 — chưa ghi nhận

Không ghi nhận thay đổi dữ liệu sai hoặc mất dữ liệu thực tế vì không action nào được lưu. Điều này không chứng minh submit không có lỗi; các mutation nằm ngoài phạm vi khảo sát an toàn.

### P1 — sửa/điều tra trước khi coi màn ổn định

| ID | Hạng mục | Chủ trì gợi ý | Tiêu chí nghiệm thu tối thiểu |
| --- | --- | --- | --- |
| AGY-P1-01 | Sort toàn tập trước pagination | BE + FE + QA | Mã A→Z bắt đầu AG rồi KHDA/KHL/NPP qua ranh giới trang; có test 2+ trang |
| AGY-P1-02 | Nhận diện và action trên tablet | FE + UI/UX | 768–1440px luôn biết Mã/Tên nào đang được Sửa; không che action bằng overflow hidden |
| AGY-P1-03 | Điều tra hydrate/payload Điện thoại | FE + BE + QA | DOM/form state/ảnh/payload nhất quán; save no-op không xóa phone; có regression test `AG-090` |
| AGY-P1-04 | Bảo toàn địa chỉ legacy | BA + BE + FE | Sửa trường khác không xóa/ghép lặp địa chỉ; migration có preview và quy tắc rõ |
| AGY-P1-05 | Chốt nguồn sự thật địa bàn | BA + Data + BE + FE | Thị trường/Khu vực/Tỉnh/Phường có định nghĩa, input và validation thống nhất |
| AGY-P1-06 | An toàn khi đổi master data | BA + BE + FE | Mã/Loại/Trạng thái có usage/impact; backend bảo vệ tham chiếu; không cascade ngầm |
| AGY-P1-07 | Khôi phục state danh sách | FE | Refresh/back/forward giữ q/type/status/sort/page/size; không đưa PII vào URL |

### P2 — cải thiện hiệu suất và tính nhất quán

| ID | Hạng mục | Tiêu chí nghiệm thu tối thiểu |
| --- | --- | --- |
| AGY-P2-01 | Render nhãn thay mã nội bộ | Bảng hiển thị Miền Bắc/Hồ Chí Minh; code vẫn sẵn cho tích hợp nếu cần |
| AGY-P2-02 | Header Hành động thị giác | Có text hoặc mẫu header dễ hiểu; accessible name vẫn đúng |
| AGY-P2-03 | Semantic table/sort | Caption/label, header scope, aria-sort và focus state được test |
| AGY-P2-04 | Empty state có lối thoát | Hiển thị điều kiện áp dụng và nút Xóa tìm kiếm/Xóa bộ lọc |
| AGY-P2-05 | Filter chips/Xóa tất cả | Chỉ xuất hiện khi có điều kiện; reset về trang 1 |
| AGY-P2-06 | Chuẩn hóa STT | STT theo view đã sort hoặc bỏ nếu không có nghĩa nghiệp vụ |
| AGY-P2-07 | Xem đủ tên/địa chỉ | Chạm/focus/hàng mở rộng xem đủ; không dựa riêng hover |
| AGY-P2-08 | Helper Mã nơi nhận | Format, ví dụ, uniqueness và auto-normalization theo rule BA |
| AGY-P2-09 | Validation Điện thoại | Inline error, không mất số 0 đầu; rule số Việt Nam/quốc tế do BA chốt |
| AGY-P2-10 | Dirty-form guard | Đóng/Hủy/Escape khi có thay đổi phải cảnh báo; không cảnh báo nếu no-op |
| AGY-P2-11 | Phân cấp CTA | Lưu/Thêm primary; Sửa neutral/secondary; cam chỉ dùng cho warning |
| AGY-P2-12 | Vùng chạm tablet | Action chính/hàng/close hướng tới 44–48px; pagination có đủ target/spacing |
| AGY-P2-13 | Feedback sau Lưu | Thông báo có Mã/Tên, bảng cập nhật từ response server; lỗi giữ dữ liệu |
| AGY-P2-14 | Chống ghi đè hai phiên | Có version/conflict handling hoặc hợp đồng tương đương; không silent overwrite |
| AGY-P2-15 | Search contract | Chốt trường search, trim/case/diacritics và maxlength theo API; có test |

### P3 — chỉ làm khi có nhu cầu đã xác nhận

| ID | Hạng mục | Ghi chú |
| --- | --- | --- |
| AGY-P3-01 | Read-only detail/row expand | Hữu ích cho tra cứu nhưng cần PO xác nhận tần suất |
| AGY-P3-02 | Saved views | Chỉ khi người dùng thường xuyên lọc theo Loại/Thị trường |
| AGY-P3-03 | Audit history | Cần quyền, nguồn metadata và retention trước khi thiết kế |
| AGY-P3-04 | Import/Export | Chưa thấy yêu cầu nghiệp vụ; xác nhận quyền và quy mô dữ liệu trước |
| AGY-P3-05 | Bulk status change | Chỉ khi có nghiệp vụ; cần preview, impact và audit, không thêm checkbox trước |

## 13. Tiêu chí nghiệm thu end-to-end đề xuất

### Danh sách

- 26 bản ghi đúng tổng, filter theo bốn Loại và hai Trạng thái không sai count.
- Sort áp dụng trên toàn tập trước pagination; STT không gây hiểu nhầm.
- q/type/status/sort/page/size khôi phục khi refresh, back, forward và quay lại từ form.
- Loading, no-result, empty và error là bốn trạng thái riêng; error có Retry, no-result có Clear.
- 768–1440px người dùng luôn nhận diện được bản ghi trước khi bấm Sửa.
- Tên/địa chỉ dài không làm mất action; xem được đầy đủ bằng touch/keyboard.

### Thêm nơi nhận

- Validation Mã/Tên/Loại hiển thị inline, focus lỗi đầu tiên, giữ mọi giá trị và chống double-submit.
- Mã trùng/format sai trả lỗi đúng trường; frontend/backend cùng rule.
- Tỉnh phải tải Phường tương ứng; đổi Tỉnh xóa/cảnh báo Phường cũ không hợp lệ.
- Preview địa chỉ đầy đủ khớp payload và dữ liệu hiển thị sau reload.
- Rule Thị trường/Khu vực không cho dữ liệu ngoài danh mục nếu BA đã chốt là danh mục.
- Tạo thành công hiển thị Mã/Tên và action Xem/Sửa; bảng cập nhật từ response server.

### Sửa nơi nhận

- Mở mọi bản ghi phải hydrate đầy đủ Mã, Tên, Loại, thị trường, khu vực, liên hệ, phone, trạng thái và địa chỉ.
- Save no-op không thay đổi bất kỳ field nào; đặc biệt không xóa phone/legacy address.
- Sửa một field không ghi đè field khác bằng giá trị rỗng/stale.
- Đổi Mã/Loại/Trạng thái theo đúng rule usage và quyền; backend từ chối thay đổi không hợp lệ bằng lỗi dễ hiểu.
- Legacy address được giữ cho đến khi người dùng thực hiện migration hợp lệ theo rule BA.
- Hai phiên cùng sửa không silent overwrite; lỗi giữ dữ liệu và cho tải bản mới/so sánh.
- Sau thành công, badge/bảng dùng response server; reload vẫn đúng.

### Accessibility và responsive

- Modal focus trap, Escape, return focus và thứ tự Tab hoạt động.
- Table có accessible name, header scope, aria-sort; sort button có target đủ dùng.
- Tablet 768×1024 và 1024×768 không mất action hoặc đối tượng; modal không tràn viewport.
- Trạng thái, lỗi và disabled không phụ thuộc màu; contrast được đo trên token thực.

## 14. Gói yêu cầu ngắn để giao DEV

> Giữ nguyên baseline Vuexy hiện tại: Public Sans, nền sáng, card trắng, tím chỉ làm accent. Không đổi theme và không mở rộng xuống mobile. Ưu tiên màn Đại lý/Nơi nhận theo thứ tự: (1) sort toàn tập trước pagination và làm rõ STT; (2) responsive 768px+ để Mã/Tên và Sửa luôn cùng ngữ cảnh; (3) điều tra ngay sự không nhất quán của phone `AG-090` giữa hiển thị và input/form state/payload; (4) bảo toàn địa chỉ legacy khi sửa và chốt luồng chuẩn hóa; (5) BA định nghĩa nguồn sự thật Thị trường/Khu vực/Tỉnh/Phường rồi đồng bộ FE+BE; (6) usage/impact và backend guard trước đổi Mã/Loại/Trạng thái; (7) lưu state danh sách vào URL hoặc cơ chế phục hồi; (8) hiển thị nhãn tiếng Việt thay mã nội bộ. Không tự cascade, xóa, đổi snapshot chứng từ hoặc áp quy tắc địa bàn trước khi BA/PO duyệt.

## 15. Trạng thái cuối phiên khảo sát

- Đang ở đúng URL Danh mục đại lý / nơi nhận.
- Search rỗng; Loại và Trạng thái = Tất cả; 15 dòng/trang; trang 1.
- Sort đã trở về trạng thái mặc định chưa chọn.
- Không còn modal/dropdown/cảnh báo mở.
- Không tạo, sửa, xóa hoặc đổi trạng thái bản ghi nào.
- Không bấm Lưu ở bất kỳ form nào.
- Viewport đã reset về kích thước trình duyệt mặc định.
- Không cập nhật prototype, repo, GitHub Pages hoặc file SKU đính kèm.

