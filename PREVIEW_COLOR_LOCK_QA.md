# App Preview — Hoa Nam UI Color System v1 QA

Ngày kiểm tra: 08/09/2026
Phạm vi: `app/preview`, các component Preview và các module dữ liệu/hành vi của Preview. Phần WMS vận hành ngoài Preview không thuộc thay đổi này.

## Kết quả

Color lock đã đạt trong Preview. `scripts/audit-preview-colors.mjs` kiểm tra 29 file runtime và trả về:

```text
PASS: 29 Preview files use the exact locked token source.
No color literals, unknown colors or unapproved gradients.
failures: []
```

File token CSS runtime có SHA-256 giống bản source-of-truth được cung cấp:

```text
B4B94E5AA4126969F2AC03F73B368667D797EEF2716FF7355A2E01BD9376FFF8
```

Runtime scan trên bản export đã kiểm tra màu hiển thị của các phần tử có kích thước thực và trạng thái đang hiển thị. Các kích thước đã ổn định sau đều `failures: []` và `overflow: false`: 320×568, 360×800, 375×812, 390×844, 430×932. Log ghi nhận thêm viewport thực 394×852 nhưng không xác nhận breakpoint 393/412/440 do thời điểm lấy mẫu resize khác nhau. Chi tiết trong `handoff/color-lock-v1/runtime-mobile-runs.json`.

## Acceptance criteria

| Tiêu chí | Kết quả | Bằng chứng |
| --- | --- | --- |
| AC01 — Exact token match | PASS | `styles/hoa-nam-color-tokens.css` giữ đúng 13 token màu, 9 alpha và 5 gradient từ Color System v1; runtime đọc `--hn-primary: #0c6286`. |
| AC02 — No color drift | PASS | Audit tĩnh chặn HEX/RGB/HSL/OKLCH/gradient rải trong 29 file Preview; `failures: []`. |
| AC03 — No purple legacy | PASS | Preview không còn dùng purple/indigo làm CTA, active, selected, link hoặc focus. Màu legacy còn lại ở các prototype WMS ngoài phạm vi Preview không được đóng gói vào export Preview. |
| AC04 — Single source of truth | PASS | Các component chỉ tham chiếu alias trong `styles/preview-theme.css`; literal màu chỉ nằm trong `styles/hoa-nam-color-tokens.css`. |
| AC05 — Component coverage | PASS | Shell, top/bottom navigation, nút, form, filter, dialog, tabs, chip/status, loading/skeleton, empty state, request flow, saved/recent/compare và related products dùng cùng token map. |
| AC06 — Semantic isolation | PASS | Success `#28C76F`, warning `#FF9F43`, danger `#EA5455`, info `#00CFE8` chỉ dùng cho trạng thái tương ứng; CTA/active/selected dùng primary gradient. |
| AC07 — Gradient lock | PASS | CTA, active, hero, card tint và headline chỉ dùng 5 gradient được khóa; audit kiểm tra chuỗi gradient và không tìm thấy gradient khác. |
| AC08 — Existing business preserved | PASS | Build production thành công; 25 unit tests pass; QA đã kiểm tra điều hướng, nhóm/danh mục, filter, tìm kiếm, chi tiết, contact, request retry/receipt, saved, recent, compare, image viewer và related products. |
| AC09 — QA evidence | PASS | Ảnh đại diện và dữ liệu scan nằm trong `outputs/color-lock-v1/`; report này ghi source, phạm vi file, audit và kết quả từng AC. |

## Source và file chính

- `styles/hoa-nam-color-tokens.css`: source-of-truth runtime, sao chép nguyên văn từ `HoaNam_UI_Color_Variables_v1.css`.
- `styles/preview-theme.css`: alias theme và state contract của Preview.
- `styles/preview-base.css`: base CSS standalone cho export Preview, không kéo theme WMS vào Preview.
- `scripts/audit-preview-colors.mjs`: kiểm tra token, literal, alias, gradient và dependency scope.
- `scripts/build-preview-pages.mjs`: chạy audit trước khi export và chỉ đóng gói dependency của Preview.
- `components/preview-primitives.tsx`: primitives tabs native Base UI, không dùng màu từ shared WMS UI.

Ảnh QA đại diện: [01-home.png](handoff/color-lock-v1/01-home.png), [03-filter-dialog.png](handoff/color-lock-v1/03-filter-dialog.png), [08-compare.png](handoff/color-lock-v1/08-compare.png), [13-success.png](handoff/color-lock-v1/13-success.png). Bằng chứng nguồn và runtime được lưu cùng trong `handoff/color-lock-v1/`.

Kích thước mobile chỉ được coi là xác nhận khi giá trị viewport thực đã ổn định; các dòng có kích thước yêu cầu và thực tế khác nhau trong log không chứng minh breakpoint yêu cầu. Màn lỗi gửi, thành công và lịch sử có dữ liệu được kiểm tra bằng endpoint fixture local, không gửi tới sale thật. Cấu hình API/OA public vẫn giữ nguyên; thay đổi màu không xác nhận tích hợp vận hành.

## Final gate

Public deployment đã xác minh: commit `c9f4f2007735b8bea2498f3317f43ce69c02abb4`, GitHub Pages trạng thái `built`, HTML public khớp bản export, toàn bộ 38 file export trả HTTP 200. Runtime public trên Home, Contact, Catalog và dialog Filter đều `failures: []`; xem `handoff/color-lock-v1/runtime-public.json`.

**PASS cho phạm vi App Preview.** Không còn màn hình/component Preview dùng brand color ngoài source-of-truth. Các màu trong prototype WMS hoặc bitmap/tài liệu ngoài Preview không được dùng trong export Preview và không thuộc phạm vi thay đổi này.
