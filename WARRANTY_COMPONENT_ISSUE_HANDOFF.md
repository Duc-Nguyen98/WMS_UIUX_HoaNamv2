# Bổ sung màn “Xuất linh kiện cho bảo hành”

## Căn cứ

Ảnh xác nhận `C:/Users/Admin/Desktop/4.jpg` nêu rõ: khi phiếu bảo hành ở **Đang kiểm tra** hoặc **Đang sửa chữa**, nhân viên chọn một phiếu và bấm **Xuất linh kiện**. Linh kiện có mã thì quét mã từng linh kiện; linh kiện không dán mã và đựng trong hộp thì quét mã hộp rồi nhập số lượng. Sau đó xác nhận xuất để phục vụ bảo hành.

Đã bổ sung prototype vào luồng chi tiết bảo hành của WMS web tại action `components`, nhưng đây là giao diện độc lập dành cho nghiệp vụ; chưa kết nối API/DB và không thay đổi UI tổng thể.

## Các màn hình và trạng thái bổ sung

| ID | Màn hình/trạng thái | Chức năng | Modal/dialog |
|---|---|---|---|
| WI-01 | Chọn linh kiện cần xuất | Chọn SKU linh kiện, xem tồn khả dụng theo kho, đi tiếp | Không |
| WI-02A | Quét linh kiện có mã | Quét từng mã vật lý, chống trùng, hiển thị danh sách mã đã quét | Không |
| WI-02B | Hộp linh kiện không dán mã | Quét mã hộp, nhập số lượng thực tế cần xuất | Không; vùng cảnh báo inline |
| WI-03 | Kiểm tra trước khi xuất | Đối chiếu hồ sơ, SKU, số lượng, kho xuất và ghi chú | Không |
| WI-04 | Xác nhận xuất linh kiện | Xác nhận hành động có tác động nghiệp vụ | Nên triển khai thêm confirmation dialog trước API thật |
| WI-05 | Kết quả tiếp nhận | Hiển thị phiếu/đề nghị đang chờ xử lý và quay lại hồ sơ | Không |

Prototype hiện cho phép đi qua WI-01 → WI-02A/WI-02B → WI-03 → WI-04 → WI-05 bằng dữ liệu cục bộ để duyệt bố cục. Nút xác nhận hiện chỉ chuyển trạng thái giao diện; không tạo phiếu, không trừ tồn, không ghi DB.

## Luồng thực tế đề xuất

```text
Hồ sơ bảo hành (Đang kiểm tra | Đang sửa chữa)
  → chọn 1 phiếu
  → Xuất linh kiện
  → WI-01 Chọn linh kiện
  → [có mã] WI-02A Quét từng linh kiện
    hoặc [không dán mã] WI-02B Quét hộp + nhập SL
  → WI-03 Kiểm tra
  → confirmation dialog: “Xác nhận xuất linh kiện?”
  → API/app scanner tạo yêu cầu xuất
  → nhận acknowledgement thật
  → WI-05 Kết quả
  → quay lại hồ sơ, tab/chi tiết Linh kiện cập nhật
```

Ứng dụng Scanner và web dùng chung DB nhưng chạy độc lập/song song: Scanner chỉ đọc/ghi qua API hợp đồng; web hiển thị trạng thái và kết quả từ DB/API. Không dùng local state của web làm nguồn sự thật.

## Quy tắc nghiệp vụ cần BA/DEV chốt

1. Một hồ sơ chỉ được xuất linh kiện khi trạng thái là `Đang kiểm tra` hoặc `Đang sửa chữa`.
2. Một lần xuất gắn với `warranty_case_id`, `warehouse_id`, người thao tác và idempotency key.
3. Linh kiện có mã: mỗi mã vật lý chỉ được nhận một lần; API xác nhận đúng SKU, trạng thái khả dụng và kho.
4. Linh kiện trong hộp: mã hộp phải resolve đúng SKU; số lượng là số nguyên > 0 và không vượt số lượng còn khả dụng.
5. Cần chốt xuất ngay hay tạo phiếu chờ duyệt; quyền nào được xác nhận/Post; khi lỗi một dòng thì xử lý partial hay rollback toàn bộ.
6. Kết quả chỉ báo thành công sau acknowledgement từ nơi nhận thật; offline/timeout phải hiển thị `Chờ đồng bộ`, không báo thành công giả.
7. Sau khi thành công, hồ sơ bảo hành cần hiển thị lịch sử xuất linh kiện, mã phiếu và số lượng; không tự chuyển trạng thái bảo hành nếu chưa được chốt.

## Hợp đồng tích hợp đề xuất (chưa triển khai)

```ts
POST /warranty-cases/{caseId}/component-issues
{
  "warehouse_id": "...",
  "lines": [
    { "sku_code": "HN-LK-001", "codes": ["..."], "box_code": null, "quantity": 1 }
  ],
  "note": "...",
  "idempotency_key": "..."
}
→ { "request_id": "...", "status": "PENDING_APPROVAL|CONFIRMED|REJECTED", "document_no": "..." }
```

Tên route, status và field chỉ là đề xuất để BA/DEV rà soát, không phải API đã có. Cần mapping với quyền `warranty.component_issue`, `outbound.scan`, `outbound.request.confirm` và quyền Post thực tế.

## Bằng chứng trong bộ output

- Màn bổ sung nằm trong code: `components/warranty-component-issue.tsx` và `components/warranty-component-issue.css`.
- Điểm vào hiện tại: chi tiết bảo hành → **Xuất linh kiện** (`route.action = components`).
- Ảnh 4 là căn cứ nghiệp vụ do người dùng cung cấp; không phải ảnh runtime của prototype.
- Chưa chụp runtime cho màn mới trong lượt này; cần vòng duyệt riêng để chụp WI-01…WI-05 sau khi xác nhận wording/flow.

## Lưu ý phạm vi

Đây là bổ sung màn và luồng, không phải nâng cấp UI/UX tổng thể. Không tự sửa palette, navigation, API, DB, WMS web hiện tại hoặc App Scanner native ngoài phạm vi xác nhận này.
