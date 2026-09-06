# DEF-01 — Danh mục Bệnh / lỗi

## Phạm vi

- Bổ sung PROTOTYPE → Danh mục → Bệnh / lỗi, hash `#defect-prototype`.
- Dùng baseline Vuexy tím và component danh mục hiện có; không thiết kế lại các màn đã duyệt.
- 18 bản ghi tổng hợp DEMO, 10 dòng mặc định. Không kết nối API hoặc dữ liệu kho/bảo hành thật.
- Không thêm Xóa, Import/Export, gộp mã, bulk action hoặc nhật ký giả.

## Đối chiếu các vấn đề trong audit

| Vấn đề | Prototype |
| --- | --- |
| Sort chỉ trong từng trang | Filter → sort toàn bộ kết quả → phân trang; sort Mã/Tên hai chiều. STT tính sau sort. |
| Tablet hẹp, mất mô tả hoặc hành động | Không khóa chiều cao bảng. Mã/Tên, trạng thái và Xem/Sửa luôn cùng hiển thị từ 768px. Dưới 1200px, mô tả chuyển thành nút “Xem mô tả”; desktop có trích đoạn và “Đọc đầy đủ”. |
| Chỉ đọc được bằng hover | Chi tiết read-only hiển thị đầy đủ, xuống dòng nguyên bản, mở bằng chạm hoặc bàn phím; không phụ thuộc tooltip. |
| Escape làm mất draft | Cảnh báo chưa lưu cho Escape, nút đóng/Hủy, điều hướng; lưu lỗi giữ nguyên draft. |
| Đổi mã/trạng thái chưa rõ tác động | So sánh trước/sau và chặn toàn bộ lượt lưu khi sửa hai trường này trên bản ghi có sẵn. Có nút khôi phục hai trường, giữ các nội dung khác đang nhập. |
| Thiếu URL state | `defectQ`, `defectStatus`, `defectSort`, `defectPage`, `defectSize`; giữ tham số của các prototype khác. |
| Thuật ngữ không nhất quán | Nhãn màn/action dùng “Bệnh / lỗi” theo yêu cầu; không tự thay glossary toàn hệ thống hoặc hậu tố lịch sử. |
| Accessibility bảng | Caption, scope, aria-sort, nút sort có tên/trạng thái, nhãn Hành động và Xem/Sửa nhìn thấy được; target action cao 44px. |

## Thêm/Sửa và mô phỏng

- Trường Mã, Tên, Mô tả, Trạng thái theo audit; giới hạn 80/200/2.000 ký tự.
- Required Mã/Tên, kiểm tra trùng mã trong DEMO, lỗi inline và focus lỗi đầu tiên.
- Thêm mới/Sửa tên và mô tả chỉ lưu trong bộ nhớ phiên trang; tải lại khôi phục fixtures.
- Có mô phỏng lưu thành công/lỗi/xung đột, khóa double submit; không khẳng định backend đã được sửa.
- Có trạng thái đang tải, lỗi tải/thử lại, chưa có dữ liệu, không có kết quả và chỉ xem. “Chưa có dữ liệu” là một tình huống trình bày, không xóa fixtures.
- Số hồ sơ bảo hành tham chiếu là **Chưa có dữ liệu**, không phải 0. Không tạo số tác động giả.

## Điểm còn chờ BA/PO/BE

- Quy tắc thay mã, ngừng sử dụng, mã thay thế, ảnh hưởng hồ sơ cũ/mới và quyền thao tác thực tế.
- Glossary nghiệp vụ chính thức và hợp đồng API, collation/search/unique phía server.
- Trim và so sánh mã không phân biệt hoa/thường chỉ là validation DEMO; giá trị lưu không tự ép chữ hoa hoặc regex mới.
- Mặc định Đang sử dụng khi Thêm chỉ phản ánh form khảo sát, không đồng nghĩa đã duyệt sử dụng trong bảo hành.

## Kiểm thử trước xuất bản

- 29 unit tests qua, gồm 6 nhóm mới cho DEF-01 và 23 nhóm hồi quy các danh mục hiện có.
- TypeScript và lint các file mới qua.
- Browser responsive: 768, 900, 1024, 1280, 1440, 1920px; 10 dòng, không tràn ngang trang/bảng hoặc cuộn dọc nội bộ. Nút Xem/Sửa cao 44px.
- Browser: sort từ trang 2 trả trang 1 đúng toàn tập; tìm mã và lọc 3 bản ghi ngừng sử dụng; không có kết quả tách biệt lỗi tải.
- Browser: mở mô tả đầy đủ bằng bàn phím ở 768px; Escape/đóng/Hủy có dirty guard, tiếp tục giữ draft, bỏ thay đổi trả focus về nút Sửa.
- Browser: required/trùng mã, lưu lỗi giữ draft rồi retry thành công, reload khôi phục fixtures; đổi mã chỉ xem trước, khôi phục đúng giá trị cũ.
- Bản xuất tĩnh đúng base path: Back/Forward khôi phục trang 1/2; Back khi form dirty có xác nhận và giữ draft khi tiếp tục. Chọn 15 dòng rồi reload khôi phục 15; mặc định vẫn là 10.
- Bản xuất tĩnh: lỗi tải → thử lại có 10 dòng; empty, loading (aria-busy) và chỉ xem được kiểm tra riêng. Chế độ chỉ xem có 10 nút Xem, không có nút Sửa.
- Kiểm tra lại overflow trên bản xuất ở 768/1024/1920px đều bằng 0; không có console error được ghi nhận trong lượt QA bản xuất. Build/export kết thúc thành công (exit 0).

## Nguồn và xuất bản

- Nguồn: `HOA_NAM_DEFECT_UIUX_AUDIT_06092026.md`, yêu cầu trực tiếp và xác nhận phạm vi trong task; SKU audit làm tham chiếu nhất quán, không mở rộng nghiệp vụ DEF-01.
- Repo `Duc-Nguyen98/WMS_UIUX_HoaNamv2`, GitHub Pages từ `docs/` sau build và `scripts/prepare-github-pages.mjs`.
- Không xuất bản lên Sites cũ. Không đổi dependency, cấu hình build hoặc các nguồn dữ liệu màn khác.
