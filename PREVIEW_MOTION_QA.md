# Preview — bộ lọc, tìm kiếm, tải thêm và chuyển động

## Phạm vi và quyết định

Áp dụng yêu cầu người dùng về bộ lọc bên trái, tải thêm, sản phẩm liên quan và chuyển động cho toàn App Preview. Giữ màu Hoa Nam, luồng khách không đăng nhập, dữ liệu sản phẩm và cấu hình sale/OA hiện có. Không đổi WMS.

- Bộ lọc nằm bên trái một thanh công cụ riêng dưới tiêu đề, số kết quả bên phải; vùng bấm ít nhất 44px. Trạng thái hàng ở hàng kế tiếp.
- Tìm kiếm tách giá trị đang gõ khỏi truy vấn đã áp dụng. Debounce 220ms, hỗ trợ composition, hủy timer khi chuyển màn/unmount; Enter áp dụng ngay. Không cập nhật URL từng phím và không chèn/xóa dòng báo tải làm đổi chiều cao. Icon đầu/cuối giữ chỗ cố định. Không remount ô nhập. Khi focus từ vị trí cuộn sâu, đưa về đầu một lần trước khi gõ để kết quả ngắn không kẹp scroll gây nhảy.
- Danh sách/Home/Search/đã xem/đã lưu: hiển thị 4 sản phẩm trước, thêm tối đa 4 khi sentinel gần viewport hoặc bấm “Xem thêm sản phẩm”. Có số đã hiển thị/tổng; hết dữ liệu thì bỏ nút tải thêm. Bảy sản phẩm hiện tại không được nhân bản hoặc gán dữ liệu mới.
- Ghi nhớ số sản phẩm đã mở theo bộ kết quả và thứ tự trong RAM của lần mở app để quay lại giữ chiều cao danh sách. Tối đa 60 bộ nhớ trang; không ghi thông tin khách.
- Chi tiết: thông tin/thông số dựng khi gần viewport, có nút mở bằng bàn phím. Sản phẩm liên quan ưu tiên cùng danh mục, nếu không có thì cùng nhóm; loại sản phẩm đang xem. Mô tả ghi rõ quan hệ thực tế. Mỗi đợt liên quan 2 sản phẩm, không cắt mất phần còn lại như trước.
- Sửa thẻ sản phẩm: card flex-column, phần link cao tự nhiên thay `height:100%`; vùng Lưu/So sánh không bị đẩy khỏi thẻ và giảm khoảng trắng lớn.

## Cách phối hợp các thư viện được yêu cầu

| Thành phần | Cách dùng thực tế |
| --- | --- |
| Motion 13.2.0 (Framer Motion hiện tại) | `LazyMotion`, `MotionConfig`, `m` cho chuyển màn opacity 160ms; không chạy animation theo mỗi ký tự tìm kiếm; gesture nhấn nút |
| SmoothUI | Đọc registry `@smoothui/smooth-button`, chuyển thể primitive thủ công trong `SmoothPreviewButton`; giữ button semantics, loading slot, reduced-motion, dùng màu Hoa Nam và vùng bấm hiện có. Không nhập toàn bộ theme hoặc thay Base UI bằng thư viện khác |
| GSAP 3.15.0 | Lazy import để hiện các thẻ mới bằng opacity/translate nhỏ trong 180ms; cleanup `gsap.context().revert()`. Nội dung vẫn nhìn được nếu tải animation thất bại |
| Locomotive Scroll 5.0.1 + Lenis 1.3.17 | Một instance Locomotive dùng Lenis tích hợp bên trong. Không khởi tạo hai bộ điều khiển cuộn. Vuốt cảm ứng/scroll-wheel giữ native (`syncTouch:false`, `smoothWheel:false`); smooth scroll chỉ cho thao tác chủ động mở thêm bằng bàn phím. Đồng bộ khi đổi route và giữ các modal/input ngoài interception |
| TanStack React Virtual 3.14.10 | Lazy chunk dùng cho tập danh sách từ 80 sản phẩm; hai cột mobile, đo chiều cao hàng, overscan và giữ hàng đang có focus. Tập 7 sản phẩm dùng DOM thường, tránh overhead không cần thiết |

Nguồn kỹ thuật: [Motion](https://motion.dev/docs/react), [SmoothUI installation](https://smoothui.dev/docs/guides/installation), [SmoothUI registry](https://smoothui.dev/r/smooth-button.json), [GSAP context](https://gsap.com/docs/v3/GSAP/gsap.context()/), [Locomotive v5](https://scroll.locomotive.ca/docs), [TanStack window virtualizer](https://tanstack.com/virtual/latest/docs/framework/react/examples/window).

## File triển khai

`components/product-preview.tsx`, `preview-catalog.tsx`, `preview-detail.tsx`, `preview-products.tsx`, `preview-library-screens.tsx`; thêm `preview-progressive.tsx`, `preview-motion.tsx`, `preview-motion.css`, `preview-virtual-products.tsx`; thêm helper `lib/preview-progressive.ts`; cập nhật `tests/product-preview.test.mjs`, `package.json`, `package-lock.json`. Không thay nguồn `lib/product-preview.ts` hoặc endpoint nhận yêu cầu.

## Kết quả kiểm tra

- Build tĩnh riêng Preview đạt. TypeScript và lint scoped đạt.
- 25 unit test đạt: có kiểm tra batch cuối/empty/end, key nhớ phân trang, quan hệ cùng danh mục/cùng nhóm và các test search/Request/receipt/library trước đây.
- Trình duyệt đã xác nhận 4 → 7 sản phẩm khi cuộn, không tạo thẻ trùng; cuối danh sách ghi 7/7.
- Chi tiết DZG06-15: thông tin/thông số xuất hiện khi cuộn; 5 sản phẩm cùng danh mục được chia đợt, có nút mở phần còn lại. Trở lại Catalog giữ 7 sản phẩm đã mở.
- Tìm kiếm gõ từng ký tự `bua pha`: x/y/width/height ô nhập giữ nguyên, scroll 0, focus không mất. Từ khóa dài không có kết quả rồi đổi sang `DCZC02-26` trả đúng một sản phẩm, không overflow. Nhập liệu không bị đổi vị trí khi cập nhật kết quả.
- Lọc Đặt trước kết hợp model đang sẵn hàng trả rỗng; “Xem tất cả sản phẩm” xóa truy vấn và khôi phục 7 sản phẩm.

| Viewport kiểm chứng | Bộ lọc căn trái | Tràn ngang | Search giữ hình học/focus |
| --- | --- | --- | --- |
| 320×568 | Đạt | Không | Đạt |
| 360×800 | Đạt | Không | Đạt |
| 375×812 | Đạt | Không | Đạt |
| 390×844 | Đạt | Không | Đạt |
| 393×852 | Đạt | Không | Đạt |
| 412×915 | Đạt | Không | Đạt |
| 430×932 | Đạt | Không | Đạt |
| 440×956 | Đạt | Không | Đạt |

Ma trận được đo lại sau khi phát hiện công cụ viewport đang nhắm nhầm tab fixture. Chỉ lần có `innerWidth` khớp kích thước yêu cầu mới được ghi nhận. Vùng bấm bộ lọc cao 44px; thẻ khoảng 353–381px tùy viewport/text. Đã quan sát screenshot mobile mới.

TanStack Virtual được kiểm tra riêng với 120 dòng QA tại localhost, không đưa vào source dữ liệu hay public build: lúc đầu khoảng 14 thẻ trong DOM, cuộn xuống còn khoảng 22 thẻ với model bắt đầu QA-28; không render 120 thẻ cùng lúc, không overflow, không console error/warning trong fixture. File `.codex/build-virtual-qa.mjs`, `.codex/serve-virtual-qa.mjs` và output fixture không được publish.

## Giới hạn và bảo toàn

- Đây là tải thêm từ nguồn hiện có, chưa phải API pagination vì dự án chưa được cung cấp API catalogue/total/cursor. Không hiển thị spinner giả trong thời gian cố định; frame chờ chỉ phục vụ append/render, ảnh vẫn có skeleton và native lazy loading.
- Không cam kết FPS hoặc hiệu năng trên mọi điện thoại. Đã kiểm tra geometry, interaction và DOM trong Chromium; bàn phím IME iOS/Android, native momentum, notch/safe-area và reduced-motion trên máy thật vẫn cần audit thiết bị.
- CSS/JS tôn trọng `prefers-reduced-motion`; giữ native buttons/links, aria, live status và focus khi bấm tải thêm. Không animation transform trên wrapper của thanh CTA fixed.
- Dependency audit báo 11 advisory trong stack cũ (vinext/vite/Cloudflare/RSC/transitive); không thuộc motion/gsap/locomotive/tanstack mới thêm. Không tự chạy nâng cấp major hoặc audit fix force ngoài phạm vi. Bản Pages chỉ gồm static client output.
- Giữ nguyên yêu cầu không xác nhận tiếp nhận sale giả, OA chưa có URL và không gọi hotline/nhắn OA trong QA.
