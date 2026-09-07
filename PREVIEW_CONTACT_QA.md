# Contact — triển khai và kiểm tra mobile

Phạm vi: yêu cầu `pasted-text.txt` người dùng cung cấp ngày 07/09/2026. Màn chính `/preview/#view=contact`, cùng primitive và token Preview cần thiết. Yêu cầu mới thay bảng màu Hoa Nam cũ bằng Vuexy tím; giữ giao diện sáng, không logo, không đăng nhập. Không chỉnh nội dung hoặc bố cục WMS.

## Source đã đối chiếu

- `app/preview/page.tsx`, `components/product-preview.tsx`: entry, hash navigation, focus/scroll restoration, bottom nav, Request state.
- `components/preview-contact.tsx`, `components/preview-request.tsx`, `lib/preview-request.ts`: Contact → Request, thông tin sản phẩm, validation, retry/idempotency, receipt và bản ghi trong bộ nhớ.
- `components/preview-catalog.tsx`: Base UI dialog có focus trap, Escape, title/description.
- `app/globals.css`, bốn stylesheet Preview: token override, ảnh hưởng shared classes, CSS mobile và reduced motion.
- Reference Vuexy Analytics đã mở và quan sát trực tiếp; dùng surface, typography, radius, elevation và violet, không lấy layout dashboard.

## File thay đổi

| File | Nội dung |
| --- | --- |
| `components/preview-contact.tsx` | Intro ngắn, Request nổi bật, hotline/copy, Zalo conditional, support hours, feedback, fallback dialog |
| `components/preview-contact.css` | Một nguồn style Contact, single column, card 8px, spacing 4/8px, controls 44–48px, snackbar |
| `lib/preview-clipboard.ts` | Clipboard helper chỉ trả thành công sau khi write hoàn tất; trả false khi bị chặn/thiếu API |
| `components/product-preview.tsx` | Header “Gửi yêu cầu” dùng `openRequest`; bottom nav vẫn “Liên hệ”; import Contact CSS |
| `components/product-preview.css` | Xóa các rule Contact cũ; primitive button/header/nav dùng token; wordmark đủ vùng bấm 44px |
| `components/preview-screens.css` | Xóa override Contact cũ; thay hardcode màu bằng token, giữ layout các màn khác |
| `components/preview-library.css`, `components/product-group-browser.css` | Chuẩn hóa các màu cũ về cùng token, giữ layout và behavior |
| `app/globals.css` | Chỉ đổi `.pv-theme`; không thay root token hay style WMS |
| `app/preview/page.tsx` | Viewport device-width, initialScale 1, viewport-fit cover; không chặn zoom |
| `tests/product-preview.test.mjs` | Thêm clipboard success/rejection/missing API; giữ test Request/navigation/library |
| `AGENTS.md` (checkout làm việc) | Ghi nhận yêu cầu màu và phạm vi mới đã được người dùng xác nhận |
| `docs/preview` | Bản build phục vụ URL HTTPS hiện có |

## Thiết kế và tương phản

Token primary `#7367F0`; nền CTA solid dùng `#675DD8` để chữ trắng thường đạt 5,08:1 (trắng trên `#7367F0` chỉ đạt 4,26:1). Chữ link dùng `#6255CF`, đạt 5,65:1 trên trắng và 4,85:1 trên tonal `#EEECFD`. Text phụ dùng alpha .70 để dễ đọc; card trắng, nền `#F8F7FA`, border neutral 12%, một shadow card, radius Contact 8px.

Intro H1 26px; card heading 17px; body 14px; CTA 15px/48px. Request solid là CTA chính, gọi hotline outline, Zalo tonal khi có cấu hình; chưa có URL thì hiển thị badge “Tạm thời chưa khả dụng”. Giờ hỗ trợ giữ nguyên dữ liệu. Không thêm logic đóng/mở giờ, giá, tồn kho hoặc điều khoản kinh doanh.

Header CTA sang Request qua hàm hiện tại, giữ draft khi không truyền product ID; bấm khi đang ở Request không reset receipt/draft. Bottom nav/skip link vẫn dùng hành vi hiện tại. Không thêm thư viện hoặc thay đổi cấu hình API/OA.

## Ma trận mobile — đã thực hiện trong trình duyệt

| Viewport | Overflow ngang | Vùng bấm Contact/header/nav | Modal copy | Snackbar | Focus form |
| --- | --- | --- | --- | --- | --- |
| 320×568 | Không | ≥44px | Vừa màn | Vừa màn, trên bottom nav | Nav ẩn, input 16px |
| 360×800 | Không | ≥44px | Vừa màn | Vừa màn, trên bottom nav | Nav ẩn, input 16px |
| 375×812 | Không | ≥44px | Vừa màn | Vừa màn, trên bottom nav | Nav ẩn, input 16px |
| 390×844 | Không | ≥44px | Vừa màn | Vừa màn, trên bottom nav | Nav ẩn, input 16px |
| 393×852 | Không | ≥44px | Vừa màn | Vừa màn, trên bottom nav | Nav ẩn, input 16px |
| 412×915 | Không | ≥44px | Vừa màn | Vừa màn, trên bottom nav | Nav ẩn, input 16px |
| 430×932 | Không | ≥44px | Vừa màn | Vừa màn, trên bottom nav | Nav ẩn, input 16px |

Ở 320×568, CTA Request có bottom khoảng 362px; số hotline bottom khoảng 491px, phía trên nav khoảng 495px trong môi trường kiểm tra. Toàn bộ card không có overflow riêng. Quan sát screenshot toàn Contact tại 320px và 390px; không tạo layout tablet/desktop. Scrollbar của môi trường Windows chiếm 15px, phép đo dùng `clientWidth` thực tế.

Regression 12 tổ hợp: Home, Groups, Catalog, Detail, Search, Request ở 320px và 430px. Cả 12 không overflow ngang, không ảnh tải lỗi, header không tràn; h1 đúng màn. Không đổi cấu trúc layout của các màn này.

## Kiểm tra chức năng thực hiện

- Clipboard thường: bấm copy, clipboard đọc lại đúng `0986366675`; thông báo “Đã sao chép số điện thoại”; nút giữ nguyên width/height tại cả 7 kích thước. Timer 4 giây được dọn khi unmount; đã quan sát thông báo biến mất. Trình duyệt nền có thể throttle timer nên không cam kết thời gian hiển thị chính xác từng mili giây.
- Clipboard bị chặn bằng Permissions-Policy trong server QA cục bộ: mở dialog, textbox readonly có số đúng, Tab chọn đủ 10 ký tự, Escape đóng và focus quay lại nút copy. Đo modal vừa đủ ở cả 7 viewport; không dùng kỹ thuật bỏ qua quyền clipboard.
- Validation: gửi form rỗng báo lỗi và focus vào tên; error label/aria liên kết được giữ.
- Contact → Request → nhập tên/điện thoại/ghi chú → chọn hai sản phẩm → quay lại form: giữ dữ liệu và hai sản phẩm.
- Server QA cục bộ trả lỗi lần đầu: app giữ draft, hiển thị “Chưa gửi được yêu cầu” và “Gửi lại yêu cầu”. Gửi lại cùng idempotency key được server QA xác nhận `{accepted:true,requestId:"QA-CONTACT-001"}`: hiện receipt đúng, cả hai model, tên/điện thoại/ghi chú. PV-17 có một bản ghi đúng. Từ kết quả chọn “Tiếp tục xem sản phẩm” mở Catalog.
- Nhánh Zalo có URL: server QA thay đúng trường cấu hình bằng URL cục bộ; bấm “Mở Zalo OA” mở tab mới đúng URL. Nhánh không URL trong bản xuất bản giữ badge và không có link giả.
- Hotline: xác nhận hai native link có `href="tel:0986366675"`. Chưa thực hiện cuộc gọi mạng điện thoại.
- Back/Forward và nút Quay lại hoạt động trong các luồng đã kiểm tra; focus Contact heading được khôi phục, nav Liên hệ có `aria-current`.
- Console của bản build giữ cấu hình thật không có lỗi/warning mới trong lượt kiểm tra. Log 503/clipboard rejection ở các fixture là lỗi được chủ động tạo để kiểm tra nhánh thất bại, không phải lỗi production.

## Build / kiểm tra mã

Build tĩnh Preview riêng đạt bằng Node 24.19. TypeScript của bản build đạt. Lint các TS/TSX chỉnh sửa đạt sau khi feedback chuyển sang semantic `<output>`. Tổng 22 unit test đạt, gồm copy, state, retry, xác minh receipt, search và navigation.

`PREVIEW_CONTACT.requestEndpoint` và `zaloUrl` trong source/bản xuất bản vẫn `null`. Server `.codex/serve-contact-qa.mjs` và thay đổi response dành cho QA không được copy vào `docs`, không commit, không publish. Fixture chỉ lưu dữ liệu kiểm thử trong RAM localhost; không gửi sale hay nhắn người khác.

## Giới hạn còn lại — không ghi nhận PASS vượt bằng chứng

- Success end-to-end đã đạt với server QA cục bộ; **chưa kiểm chứng với nơi nhận sale thật** vì chưa có endpoint.
- Luồng Zalo khi có URL đã kiểm tra bằng URL cục bộ; **chưa xác minh Zalo OA thật** vì chưa được cung cấp.
- Safe area được nối bằng CSS `env(safe-area-inset-top/bottom)` và viewport-fit cover; trình duyệt QA trả inset 0. Chưa kiểm tra notch/Home Indicator và bàn phím ảo trên thiết bị iOS/Android thật. Ma trận ở trên xác nhận viewport, focus và layout trong trình duyệt, không thay thế kiểm tra thiết bị.
- Reduced motion có rule tắt animation/transition và đã xác nhận stylesheet chứa nhánh này; chưa đổi tùy chọn trợ năng hệ điều hành để kiểm tra trên thiết bị thật.
- Không tuyên bố toàn bộ nghiệm thu vận hành DONE/PASS cho các phần chưa có hệ thống hoặc thiết bị kiểm chứng. Phần UI được triển khai và bàn giao riêng với các giới hạn này.
