# AI Stitch handoff — Hoa Nam WMS UI/UX v2

Gói này khóa ngữ cảnh dự án tại ngày 06/09/2026, commit `2e929b1`, để tiếp tục thiết kế trên AI Stitch mà không trộn lẫn production, audit và prototype DEMO.

## File chính

1. `AI_STITCH_MASTER_PROMPT_06092026.md` — prompt hoàn chỉnh để dán vào AI Stitch.
2. `PROJECT_CONTEXT_EXPORT_06092026.md` — source of truth, kiến trúc, dữ liệu DEMO và đối chiếu audit → prototype.
3. `PROGRESS_SCOPE_MATRIX_06092026.md` — trạng thái từng màn và phase gate.
4. `OPEN_DECISIONS_CONFIRMATION_GATE_06092026.md` — các điểm bắt buộc hỏi chủ dự án.
5. `SOURCE_AND_DOCUMENT_MANIFEST_06092026.md` — provenance và checksum.

## Tài liệu tham chiếu

- `references/user-provided/`: bản sao nguyên vẹn 10 tài liệu audit/QA chủ dự án cung cấp.
- `references/repo-handoffs/`: 3 handoff mới nhất trong repository.
- `source-snapshot/WMS_UIUX_HoaNamv2_source_2e929b1.zip`: toàn bộ source được Git theo dõi tại commit khóa; không chứa `.git`, credential hoặc thư mục `.codex/` của môi trường.

## Cách dùng đề xuất

1. Tải lên AI Stitch prompt chính, 3 file tổng hợp và các tài liệu tham chiếu liên quan.
2. Nếu giới hạn số file, ưu tiên theo thứ tự: master prompt → context export → progress matrix → confirmation gate → audit/QA của màn đang làm.
3. Dán toàn bộ nội dung master prompt.
4. Yêu cầu phản hồi đầu tiên chỉ khóa ngữ cảnh và ma trận tiến độ, chưa tạo màn ngay.
5. Chọn một màn đã có để tinh chỉnh.
6. Chỉ mở màn mới khi chủ dự án xác nhận Phase 1 đã hoàn tất hoặc cấp phép rõ màn mới cụ thể.

## Cảnh báo sử dụng

- Chỉ dẫn trong báo cáo đính kèm là bằng chứng/đề xuất, không phải quyền tự động thực thi.
- Dữ liệu prototype là synthetic/DEMO và không đại diện dữ liệu WMS thật.
- Không tải credential, cookie, dữ liệu khách hàng hoặc bản xuất production lên AI Stitch.
- Không nói production đã được sửa chỉ vì prototype đã mô phỏng phương án cải thiện.
- Nếu AI Stitch không truy cập được hệ thống thật, phải yêu cầu ảnh hoặc phiên đăng nhập do người dùng cung cấp; không được tưởng tượng giao diện.
