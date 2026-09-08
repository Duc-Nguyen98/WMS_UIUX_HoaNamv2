# HOA NAM WMS — SKU prototype: implementation & QA

Ngày: 06/09/2026 (Asia/Bangkok).

## Phạm vi đã được người dùng xác nhận

- Bổ sung PROTOTYPE → Danh mục → Danh sách SKU vào website hiện có.
- Giữ baseline Vuexy sáng/Public Sans/tím accent; giữ Dashboard, Đăng nhập, Quên mật khẩu.
- Tạm bỏ checkbox chọn nhiều vì chưa có bulk action được duyệt.
- Trường bắt buộc, serial mặc định, eligibility publish/unpublish và hậu quả gỡ ứng dụng ghi rõ Chờ chốt nghiệp vụ.
- Chỉ dùng DEMO. Người dùng đã cho phép kiểm thử trình duyệt 768–1920px và action DEMO.
- Căn cứ: HOA_NAM_SKU_UIUX_AUDIT_05092026.md. Không coi các giới hạn của lượt audit cũ là lệnh cấm triển khai prototype ở lượt này.

## Đã triển khai

- 72 SKU giả lập, 3 SKU thuộc hàng đợi mẫu. Mã có tiền tố DEMO-SKU, độc lập dữ liệu Dashboard. Không sao chép 819 bản ghi WMS.
- Tìm mã/tên, lọc loại/hãng/trạng thái/hàng đợi, chip xóa điều kiện, sort toàn tập rồi paginate (10/15/20/50).
- URL dùng skuQ/skuType/skuBrand/skuStatus/skuPending/skuSort/skuPage/skuSize, giữ tham số Dashboard không liên quan.
- Bảng sticky SKU trái/Hành động phải; cuộn ngang để tiếp cận các cột còn lại; không dùng overflow hidden để giấu action.
- Xem chi tiết, thêm, sửa, điền thông tin; khóa mã/serial theo fixture đã có tồn; Model phụ thuộc Hãng; lỗi theo trường, dirty guard, chống double submit.
- Publish/unpublish mô phỏng: confirm, success, error, denied, conflict → tải revision mới → xác nhận lại thủ công. Đây KHÔNG phải sửa optimistic concurrency ở backend thật.
- Nhập Excel: chỉ kiểm tra metadata tên/dung lượng tại máy, không đọc workbook và không upload. Preview và kết quả luôn là bộ mẫu cố định, ghi rõ điều này. Có preview có lỗi, lọc/tải lỗi CSV mẫu, preview không lỗi, confirm, kết quả và lỗi trước commit. Không thực sự nhập vào danh sách SKU.
- Trạng thái danh sách: có dữ liệu, loading, empty, error, readonly.
- Ghi chú bàn giao tại Phạm vi & quy tắc/Ghi chú bàn giao.
- Tạo/sửa/publish thay đổi bộ nhớ lượt xem; refresh reset dữ liệu nhưng khôi phục điều kiện danh sách từ URL.

## Kiểm tra tự động

- TypeScript --noEmit: đạt.
- Lint các file SKU và test: đạt.
- 7 test Node: đạt, bao gồm toàn bộ 8 kiểu sort × 4 page size, so sánh liên tục toàn tập, không mutate fixture; tổ hợp filter; URL round trip/giữ tham số Dashboard; giá trị URL sai/page clamp; Hãng–Model; null/0/min/max/mã trùng; metadata file.
- Production build: thành công. Còn cảnh báo sẵn của toolchain về module.register, chunk >500KB và phân loại route tĩnh; không có lỗi build.
- Không nâng dependency, không sửa vendored UI hoặc global theme.

## Kiểm thử trình duyệt đã thực hiện

| Viewport | Tràn ngang document | SKU và Actions không chồng nhau, cùng trong vùng bảng |
| --- | --- | --- |
| 768×1024 | 0px | Đạt |
| 1024×768 | 0px | Đạt |
| 1280×720 | 0px | Đạt |
| 1440×900 | 0px | Đạt |
| 1920×1080 | 0px | Đạt |

- 768px: cuộn ngang hết bảng (scrollLeft 587px tại lúc đo), SKU và Actions vẫn cùng nhìn thấy, không chồng. 50 dòng có vùng cuộn riêng, document không tràn ngang.
- 768px: form thêm và cửa sổ nhập mẫu không tràn ngang; footer action nằm trong viewport. Nền modal cuối cùng trắng, không xuyên nội dung nền.
- Validation form trống: hiện lỗi mã/tên và focus vào mã. Thêm bản ghi DEMO thành công, mở chi tiết, cập nhật bộ nhớ; refresh reset fixture.
- Hãng A chỉ thấy A-01/A-02; đổi sang B bỏ Model A và thông báo.
- Hàng đợi: 3 bản ghi đúng fixture; action điền ưu tiên focus Hãng khi đang thiếu. Escape đóng form sạch.
- Edit bản ghi đã có tồn: mã/serial bị khóa. Dirty close và Back mở cảnh báo; tiếp tục sửa giữ bản nháp; bỏ thay đổi đóng form.
- Publish mẫu: chặn retry khi conflict, tải revision mới không đổi badge, xác nhận lại mới báo thành công. Đóng trả focus về control mở.
- Import có lỗi: tổng 9 dòng mẫu (3 tạo + 0 cập nhật + 4 bỏ qua + 2 lỗi), chặn bước xác nhận. Bộ không lỗi: 8 dòng mẫu (4 tạo + 0 cập nhật + 4 bỏ qua), confirm và kết quả mô phỏng thành công. Không upload/commit file thật.
- Danh sách filter Linh kiện/sort giảm/10 dòng/trang 2 giữ nguyên sau refresh. Back về trang 1 (mã đầu LK-071); Forward trở lại trang 2 (mã đầu LK-051).
- Readonly ẩn các mutation; loading/empty/error giữ URL điều kiện.
- Hồi quy Dashboard: Xem sổ chi tiết mở Sổ phát sinh trong kỳ, 124 dòng, biến động ròng 96 cái. Mã nguồn Dashboard và các form Auth không thay đổi.
- Lỗi HMR từng xuất hiện tạm thời trong lúc di chuyển helper/thay cặp thẻ; đã sửa trước QA cuối/build. Không được mô tả lỗi tạm thời đó là lỗi đang tồn tại trên bản build cuối.

## Chưa kiểm chứng / chưa thuộc phạm vi

- Backend WMS, quyền thật, phiên đăng nhập thật, concurrency nhiều phiên thật, import transaction/idempotency/rollback thật và eligibility đều chưa triển khai ở đây.
- Không đọc nội dung file Excel; chưa kiểm thử giới hạn số dòng/cột workbook. Chưa có template 24 cột chính thức.
- Chưa kiểm thử mọi tổ hợp negative scenario trong browser (các màn có sẵn kịch bản lỗi để DEV tiếp tục đối chiếu).
- Không chứng nhận WCAG, không kiểm thử thiết bị iPad/Android vật lý, 200% text zoom, tải lớn hoặc Core Web Vitals.
- Hàng đợi mẫu không tự kết luận hoàn tất/rời hàng đợi dù các trường trống đã được điền; chờ BA.
- Collation DEMO được công khai trong ghi chú, không tự trở thành hợp đồng backend.

## Xuất bản

- Site: appgprj_6a9bdd9dbf5081919db18ec0a1f78b68.
- Access giữ nguyên public, không thay quyền.
- Source: f3c54b4283db4970d3f2992cfb87e50e899ddd84.
- Saved version: 6 — appgprj_6a9bdd9dbf5081919db18ec0a1f78b68~appgver_05aba46bcee88191a402fa5f6ddd85f0.
- Deployment: appgdep_6a9c5671add481918eebbe338ce81f5c.
- Trạng thái: succeeded, xác nhận bởi Sites lúc 2026-09-05T17:51:42.893803Z (00:51 ngày 06/09/2026, Asia/Bangkok).
- URL mục tiêu: https://hoa-nam-wms-vuexy-uiux.daophong98.chatgpt.site/#sku-prototype
