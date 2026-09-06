# App Preview — giao diện chính thức bàn giao DEV

Cập nhật ngày 07/09/2026 theo yêu cầu áp dụng PV-01–PV-18. Điểm vào `/preview`. Danh sách màn chi tiết trong `PREVIEW_SCREEN_PLAN.md`; quy tắc câu chữ trong `AGENTS.md`.

## Thiết kế và phạm vi

- Nền sáng `#FAFCFC`, thẻ trắng; primary `#0C6286`, nhấn `#0C5D7D`, hỗ trợ `#5E93A7`. Public Sans, đường viền nhẹ, bố cục theo nhóm nội dung từ baseline Vuexy đã duyệt.
- Nhãn Sẵn hàng: `#216447` / `#EAF7F1`; Đặt trước: `#8A550C` / `#FFF3DF`. Có chữ và biểu tượng, không chỉ dùng màu.
- Không chèn logo. Tên Hoa Nam là văn bản. Không đưa ghi chú nội bộ, dữ liệu mẫu, API, publish hay nguồn ảnh vào màn khách hàng.
- Đã bỏ banner/footer theo ảnh `2.png`. Nút Tư vấn một hàng dẫn tới Liên hệ.
- Khách xem và nhập yêu cầu không cần đăng nhập. Không thêm giỏ hàng, số lượng, thanh toán, giao nhận, CRM hoặc màn quản trị sale.
- Mã/CSS Preview nằm riêng, không đổi các màn WMS.

## Điểm vào và điều hướng

| Địa chỉ sau `/preview`                                              | Màn                                                       |
| ------------------------------------------------------------------- | --------------------------------------------------------- |
| `#view=home`                                                        | Trang chủ                                                 |
| `#view=groups&group=machine`                                        | Nhóm máy; thay bằng `hand` hoặc `accessory` cho nhóm khác |
| `#view=catalog`                                                     | Tất cả sản phẩm                                           |
| `#view=catalog&group=machine&category=construction&status=preorder` | Danh sách lọc                                             |
| `#view=search`                                                      | Gợi ý tìm kiếm                                            |
| `#view=search&q=DCZC0226`                                           | Kết quả tìm model                                         |
| `#view=detail&product=dczc02-26`                                    | Chi tiết                                                  |
| `#view=contact`                                                     | Liên hệ                                                   |
| `#view=request&product=dczc02-26`                                   | Form điền sẵn sản phẩm                                    |

Lọc và xem ảnh là hộp tương tác; giải thích sử dụng thông tin mở cạnh form. Kết quả gửi là trạng thái trong luồng form, không có URL để tự bật thông báo thành công.

- Bộ lọc chọn nháp, chỉ cập nhật danh sách khi Áp dụng. Đóng không áp dụng thay đổi. Xóa bộ lọc giữ từ khóa tìm kiếm.
- Tên/model/công dụng hỗ trợ tiếng Việt không dấu. Model đầy đủ có thể bỏ dấu gạch; khớp model chính xác ưu tiên trong sắp xếp mặc định. Không đưa giải thích thuật toán vào app.
- Vị trí cuộn và bộ lọc được giữ trong phiên trang khi quay lại từ chi tiết. Không ghi thông tin form vào URL, localStorage hoặc log. Form được giữ trong bộ nhớ khi đổi màn/gửi lỗi, không bảo đảm còn sau khi tải lại trang hoặc đóng tab.
- Điện thoại: danh sách hai cột, bộ lọc từ dưới, chi tiết có CTA cố định; ẩn thanh điều hướng khi nhập. Chế độ desktop dùng không gian rộng cho ảnh/thông tin và form hai cột.
- Sửa PV-02: root Tabs chủ động `flex-direction: column`, tab `height: auto`, nội dung `min-width: 0; width: 100%`. Không phụ thuộc biến thể Tailwind không sinh đúng hướng xếp.

## Thành phần mã

| File                                     | Trách nhiệm                                                    |
| ---------------------------------------- | -------------------------------------------------------------- |
| `components/product-preview.tsx`         | Khung, điều hướng hash, lưu vị trí, tìm kiếm, giữ dữ liệu form |
| `components/product-group-browser.*`     | Nhóm và danh mục                                               |
| `components/preview-home.tsx`            | Trang chủ đã duyệt                                             |
| `components/preview-products.tsx`        | Thẻ, ảnh, nhãn, loading/fallback ảnh                           |
| `components/preview-catalog.tsx`         | Danh sách, gợi ý, lọc, skeleton, khung modal                   |
| `components/preview-detail.tsx`          | Chi tiết, ảnh lớn, thông số có nguồn, sản phẩm cùng danh mục   |
| `components/preview-contact.tsx`         | Ba kênh liên hệ, giờ hỗ trợ, sao chép số                       |
| `components/preview-request.tsx`         | Form, lỗi/đang gửi/kết quả, sử dụng thông tin                  |
| `components/preview-screen-boundary.tsx` | Khi nội dung không tải được: Thử lại và hotline                |
| `components/preview-screens.css`         | Bố cục màn mới, giới hạn trong Preview                         |
| `lib/product-preview.ts`                 | Dữ liệu thiết kế, nhóm/danh mục, tìm/lọc/hash                  |
| `lib/preview-request.ts`                 | Cấu hình liên hệ, kiểm tra form, hợp đồng nhận yêu cầu         |

## Nguồn dữ liệu và giới hạn tích hợp — chỉ dành cho DEV

Dữ liệu hiện có 7 bản ghi từ ảnh 04 và 07; không có API tồn kho. Hai bản ghi DZG02-15 và DZG06-15 có trạng thái đặt trước theo dữ liệu thiết kế đã duyệt, không phải tồn kho được xác minh (ảnh nguồn ghi còn hàng). Khi tích hợp, thay bằng trạng thái công bố từ nguồn chính thức; không suy ra từ hình hoặc số lượng.

Sáu danh mục máy và sáu danh mục dụng cụ cầm tay được chép từ phần nhìn thấy trong ảnh 02/03. Chưa có danh mục con phụ kiện hoặc sản phẩm cho nhóm hand/accessory, nên hiển thị rỗng. Không khẳng định đây là toàn bộ phân loại vận hành.

Hai ảnh nguồn ở `public/preview/` được cắt vùng hiển thị bằng CSS từ screenshot 720×1600. Không tạo hình sản phẩm mới. Cần ảnh sản phẩm riêng chất lượng cao để thay nguồn khi đưa vào app vận hành. Hiện mỗi sản phẩm có một ảnh; hỗ trợ `images` để DEV cấp nhiều ảnh sau này. Chuyển ảnh chỉ hiện khi có từ hai ảnh. Thông số chỉ hiển thị khi có `specifications`; chưa có nguồn thì dẫn tới tư vấn, không tự đặt thông số kỹ thuật.

Hotline `098 636 6675` và giờ hỗ trợ lấy từ ảnh 13. Không thực hiện cuộc gọi kiểm thử hoặc gửi tin. Zalo OA chưa có URL: `zaloUrl: null`, giao diện có lựa chọn nhưng thông báo kênh chưa khả dụng và dẫn sang cách liên hệ còn lại.

## Hợp đồng gửi yêu cầu

`PREVIEW_CONTACT.requestEndpoint` hiện là `null`: không phát sinh mạng, không gửi dữ liệu ra ngoài, không tạo xác nhận tiếp nhận. Nút gửi kiểm tra trường trước; khi chưa gửi được, giữ form và cho gọi hotline. Người dùng đã được hỏi về nơi tiếp nhận và địa chỉ OA; chưa nhận thông tin trả lời.

Khi bên vận hành cung cấp endpoint, DEV nối giao thức đã chuẩn bị:

- `POST` JSON gồm `name`, `phone`, `productIds: string[]`, `note`.
- Header `Idempotency-Key`: giữ cùng khóa khi gửi lại cùng nội dung trong phiên, kể cả rời form rồi quay lại. Máy chủ phải thực thi chống trùng, không chỉ dựa vào khóa ở giao diện.
- Xác nhận chỉ khi HTTP thành công và body có `accepted: true` cùng `requestId` là chuỗi không rỗng. HTTP 200 hoặc `{success: true}` đơn thuần không được coi là tiếp nhận.
- Timeout 15 giây/lỗi mạng/phản hồi không hợp lệ đều giữ dữ liệu. Không tự retry nền; người dùng chủ động gửi lại.
- Form một hoặc nhiều sản phẩm; tên, số điện thoại, sản phẩm bắt buộc; ghi chú tùy chọn tối đa 1.000 ký tự. Số điện thoại nhận dạng 10 chữ số bắt đầu 0 hoặc +84 và 9 chữ số, cho phép dấu cách/dấu phân tách. Kiểm tra này không xác minh chủ sở hữu số.
- Không tự cam kết thời gian gọi lại, giữ hàng, giá hoặc đơn bán hàng. Nội dung sử dụng thông tin cần bên vận hành rà soát trước khi kích hoạt thu nhận thật.
- Màn kết quả được lập trình nhưng chưa kiểm thử tiếp nhận với hệ thống sale thật; unit test dùng transport giả lập riêng, không nằm trong ứng dụng khách hàng.

Skeleton danh sách/chi tiết và ảnh được nối với quá trình tải giao diện/ảnh; tìm kiếm dùng deferred render. Chưa có phân trang hoặc API sản phẩm, nên không giả lập tải thêm và lỗi mạng kho dữ liệu. DEV cần nối các trạng thái này khi có nguồn và hợp đồng dữ liệu.

## Kiểm tra

- TypeScript, oxlint các file Preview và production build đều đạt. Build vẫn có cảnh báo kích thước bundle và biểu đồ thuộc WMS hiện hữu; không phát hiện lỗi build của Preview.
- 21 unit test đạt: tìm không dấu/model, ưu tiên model, lọc kết hợp/rỗng, URL hợp lệ/sai/chi tiết không còn, phân loại theo nhóm, không đổi nguồn; kiểm tra form, không gửi khi thiếu endpoint, từ chối phản hồi chưa xác nhận, receipt và idempotency.
- Kiểm tra trình duyệt: 320px / 390px / 1280px; sửa tràn tab; cả ba nhóm; áp dụng lọc Đặt trước; tìm không dấu/model và rỗng; chi tiết; mở/phóng/đóng ảnh; form điền sẵn, lỗi bắt buộc, giữ nội dung khi quay lại/gửi lỗi; bảng thông tin liên hệ; ba kênh và giờ hỗ trợ.
- Back từ sản phẩm cuối trả về đúng danh sách `group=machine` và vị trí cuộn 977px trong lượt kiểm tra.
- Không có lỗi console trong lượt kiểm tra desktop. Đã kiểm tra điều hướng khách không qua đăng nhập.
- Chưa kiểm thử trên thiết bị điện thoại thật, mở ứng dụng gọi/Zalo thật hoặc gửi vào hệ thống sale. Không có số liệu chứng minh tăng giữ chân khách hàng.

Lệnh kiểm tra: `node --test tests/product-preview.test.mjs`, `npx tsc --noEmit --incremental false`, oxlint các file Preview, `npm run build`.

Chưa thay cấu hình GitHub Pages hoặc Sites. Sites project ID hiện hữu trước đó trả `project_not_found`; không tự tạo hosting khác, không xuất bản hay thay quyền truy cập. Dev server dùng `http://localhost:3000/preview`.


## Bổ sung PV-13–PV-18

Người dùng đã duyệt triển khai sáu màn. Các URL thêm: `#view=recent`, `#view=saved`, `#view=help`, `#view=selection`, `#view=requests`, `#view=compare`. Menu tiện ích trên header mở cả sáu; Trang chủ bổ sung các đường dẫn và khối vừa xem.

- `components/preview-library-state.tsx`: state/context, đồng bộ lưu trình duyệt qua useSyncExternalStore; snapshot SSR không đọc dữ liệu thiết bị. Sự kiện storage hỗ trợ đồng bộ giữa tab. Khi storage bị chặn, giữ tạm trong lần mở trang và hiển thị giới hạn.
- `lib/preview-library.ts`: xác thực và loại bỏ mã không tồn tại/trùng, đọc storage hỏng an toàn, ghi nhận đã xem và giới hạn so sánh.
- `components/preview-library-screens.tsx`, `components/preview-library.css`: sáu màn và các trạng thái trống, danh sách chọn, bảng so sánh, FAQ.
- `components/preview-products.tsx`: thẻ có nút Lưu và So sánh; chi tiết tái sử dụng các nút.

### Lưu trên thiết bị và quyền riêng tư

`localStorage` chỉ ghi key `hoanam.preview.library.v1` với hai mảng `recent` (tối đa 30 ID) và `saved` (tối đa 100 ID). Không ghi tồn kho/ảnh/thông số/tên khách/điện thoại/ghi chú/mã yêu cầu; sản phẩm và trạng thái được giải từ tập dữ liệu hiện tại mỗi lần render. Đã xem/đã lưu không đồng bộ giữa thiết bị; câu chữ này được hiển thị ngay trên màn. Xóa lịch sử xem không xóa đã lưu.

Form và yêu cầu tiếp nhận chỉ ở bộ nhớ trang. PV-17 hiển thị yêu cầu đã xác nhận trong lần mở trang, có thể mở chi tiết/sao chép mã/xóa khỏi màn hình. Tải lại hoặc đóng trang sẽ mất danh sách này, được giải thích rõ trong app. Không tạo endpoint tra cứu theo số điện thoại hay ID dễ đoán. Tra cứu dài hạn/thiết bị khác cần phía vận hành cung cấp hệ thống và duyệt phương án truy cập riêng tư; chưa triển khai token/OTP hoặc cam kết tiến độ sale.

### Hợp đồng nhiều sản phẩm

`RequestDraft.productId` được thay bằng `productIds: string[]` (ít nhất một mã hợp lệ, không trùng). Body gửi là `{name, phone, productIds, note}`. Endpoint vẫn `null`; chưa gửi dữ liệu ra bên ngoài. Bên nhận phải thống nhất hợp đồng mảng này trước khi cấu hình; không tự tách thành nhiều yêu cầu hoặc chỉ gửi sản phẩm đầu tiên. URL chi tiết/form một sản phẩm vẫn dùng `product=...` để điền sẵn một phần tử. Không đưa tên/điện thoại/ghi chú lên URL.

Số lượng chưa triển khai: bảng đề xuất yêu cầu xác nhận riêng; đã hỏi lựa chọn trong lượt này, chưa có phản hồi. Chọn “Gửi yêu cầu cho danh sách” từ Đã lưu hoặc từ So sánh mở màn rà soát; khách có thể thay đổi trước khi sang form. Chỉnh sửa danh sách không làm mất thông tin liên hệ. Sau tiếp nhận thật, lưu một snapshot nội dung yêu cầu và tên/model sản phẩm trong bộ nhớ; khóa receipt ID ngăn bản ghi lặp khi cùng yêu cầu được trả lại.

### So sánh và FAQ

So sánh giữ 2–3 ID trong lần mở trang, cùng group và category; từ chối model thứ tư hoặc khác danh mục bằng thông báo khách hàng. Bảng có khung cuộn ngang dùng bàn phím được; các nhãn thông số là tập hợp trường thực sự có trong dữ liệu. Không tạo thông số mới hoặc thay thông tin thiếu bằng số 0. FAQ không bổ sung điều khoản giao hàng, bảo hành, thời gian giao/giữ hàng hoặc thời gian phản hồi chưa được xác nhận.

### Kiểm tra bổ sung

Bảy unit test bổ sung: storage hỏng/giá trị không hợp lệ, thứ tự đã xem và bỏ lưu, loại mã đã gỡ khỏi nguồn, so sánh cùng nhóm/tối đa ba, hash sáu màn, gửi đủ mảng sản phẩm và từ chối trùng/rỗng, snapshot yêu cầu bất biến/chống lặp receipt. Tổng 21 test.


Kiểm tra trình duyệt lượt PV-13–PV-18: chọn hai sản phẩm → form → nhập thông tin kiểm thử → sửa/bỏ/thêm sản phẩm → trở lại form giữ nội dung; gửi khi endpoint null không có receipt. Đã lưu hai model còn nguyên sau reload; Đã xem ghi đúng model vừa mở. Menu dẫn cả sáu màn, FAQ mở được nội dung; lọc Đã lưu kết hợp tìm model không dấu gạch trả đúng sản phẩm. Bảng so sánh ba model hiển thị trạng thái, có khung vuốt ngang trên 390px. Màn yêu cầu đã gửi rỗng hiển thị rõ giới hạn riêng tư. Kiểm tra 320px/390px/1280px không tràn ngang toàn trang ở các màn đã kiểm tra. Không có lỗi/warning trong console tab kiểm tra.

Build và TypeScript đạt; lint các file Preview đạt. Dev server có cảnh báo multiple renderers của môi trường SSR khi tải/HMR; không ghi nhận lỗi UI tương ứng trong lượt kiểm tra. Production build còn cảnh báo bundle/WMS chart có sẵn. Không gọi hotline, nhắn OA hay gửi thông tin vào hệ thống sale thật. Không tạo dữ liệu tiếp nhận giả trong app để chụp màn PV-17; logic snapshot/receipt được kiểm tra bằng unit test. Không kiểm thử truy cập lại lịch sử trên máy chủ hoặc điện thoại thật vì chưa có tích hợp này.
