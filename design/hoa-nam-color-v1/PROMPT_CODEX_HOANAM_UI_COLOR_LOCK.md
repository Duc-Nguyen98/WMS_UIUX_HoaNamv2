# PROMPT — CODEX / GPT-5.6 SOL
## Hoa Nam WMS / App — Global UI Color Lock & Vuexy Alignment

### ROLE
Bạn là Senior Enterprise UI/UX Designer + Design System Architect + Senior React Front-End Architect + QA Reviewer.
Nhiệm vụ là cập nhật **toàn bộ giao diện hiện có** của WMS/App Hoa Nam để áp dụng chính xác 100% hệ màu Hoa Nam đã khóa, đồng thời giữ tinh thần Vuexy: sáng, sạch, nhiều khoảng thở, card rõ tầng, gradient nhẹ, interaction state nhất quán.

### SOURCE OF TRUTH — BẮT BUỘC
Đọc và áp dụng đúng các file:
- `HoaNam_UI_Color_System_v1.md`
- `HoaNam_UI_Color_Tokens_v1.json`
- `HoaNam_UI_Color_Variables_v1.css`

Nếu có xung đột giữa code hiện tại và các file này:
**các file Color System v1 được ưu tiên.**

### NON-NEGOTIABLE COLOR LOCK
Brand colors duy nhất:
- Primary: `#0C6286`
- Primary Dark: `#0C5D7D`
- Support Blue: `#5E93A7`
- Near White: `#FAFCFC`

Không được tự tạo thêm màu brand khác.
Không được dùng màu “gần giống”.
Không được thay đổi độ sáng bằng cách sinh HEX mới.
Không dùng lại purple / indigo Vuexy làm accent thương hiệu.

### APPROVED GRADIENTS
Chỉ được dùng đúng các gradient sau:

```css
/* Primary / CTA */
linear-gradient(135deg, #0C5D7D 0%, #0C6286 52%, #5E93A7 100%)

/* Sidebar / selected */
linear-gradient(135deg, #0C5D7D 0%, #0C6286 65%, #5E93A7 100%)

/* Hero */
linear-gradient(135deg, rgba(12, 98, 134, 0.10) 0%, rgba(94, 147, 167, 0.18) 48%, rgba(250, 252, 252, 0.96) 100%)

/* Card tint */
linear-gradient(180deg, #FAFCFC 0%, rgba(94, 147, 167, 0.08) 100%)

/* Headline accent */
linear-gradient(90deg, #0C5D7D 0%, #0C6286 55%, #5E93A7 100%)
```

### PHẠM VI ÁP DỤNG
Audit và cập nhật tất cả màn hình/component đang tồn tại, bao gồm tối thiểu:
- App shell / top bar / bottom navigation nếu có
- Sidebar / drawer / navigation
- Dashboard
- Login / forgot password / authentication
- Cards / KPI cards / metric cards
- Button / icon button / FAB
- Tabs / segmented controls
- TextField / Select / Search Select / Date Picker
- Checkbox / Radio / Switch
- DataGrid / Table / Pagination
- Filter bar / toolbar
- Dialog / modal / drawer / popover
- Stepper / timeline
- Badge / chip / status
- Alert / snackbar / toast
- Empty state / loading / skeleton
- Dropdown / menu
- Selected / hover / focus / pressed / disabled states
- Reports / inbound / outbound / inventory / warranty / RBAC / warehouse config
- Toàn bộ các màn hình app/mobile đang có

### QUY TẮC THIẾT KẾ
1. Giữ nguyên nghiệp vụ, dữ liệu, route, permission và business logic.
2. Không redesign layout chỉ để đổi màu; chỉ chỉnh layout nếu cần để đồng bộ design system.
3. Giữ phong cách Vuexy nhưng thay toàn bộ accent brand sang Hoa Nam.
4. UI phải sáng; không phủ xanh đậm diện rộng.
5. Gradient chỉ dùng như accent: hero, CTA quan trọng, active navigation, selected highlight.
6. Card chủ yếu dùng trắng / near-white + shadow rất nhẹ.
7. Text không được chuyển toàn bộ sang xanh; heading dùng neutral dark, accent mới dùng brand blue.
8. Semantic colors:
   - success `#28C76F`
   - warning `#FF9F43`
   - danger `#EA5455`
   - info `#00CFE8`
   Chỉ dùng đúng cho state ngữ nghĩa.
9. Không thay đổi logo Hoa Nam.
10. Không dùng màu tím để “giữ chất Vuexy”.

### IMPLEMENTATION BẮT BUỘC
Tạo hoặc chuẩn hóa **một source-of-truth theme duy nhất**.

Ví dụ:
- `src/theme/hoaNamTheme.ts`
- hoặc `src/styles/hoa-nam-tokens.css`

Sau đó:
- map toàn bộ brand tokens vào theme;
- component chỉ gọi token/theme;
- không hardcode brand HEX lặp lại ở từng component;
- nếu đang dùng MUI: map vào `palette`, `components`, `MuiButton`, `MuiTabs`, `MuiChip`, `MuiTextField`, `MuiDataGrid`, focus states;
- nếu codebase có CSS/SCSS/Tailwind: map vào CSS variables/config tương ứng.

### REMOVE LEGACY COLORS
Search toàn repo và xử lý các purple/indigo legacy accent.
Đặc biệt kiểm tra các mã như:
- `#7367F0`
- `#8F85F3`
- `#9155FD`
- các màu tương tự đang dùng cho primary/active/CTA.

Không xóa màu nằm trong:
- ảnh bitmap;
- logo bên thứ ba;
- tài liệu demo tĩnh không render trong app;
trừ khi nó đang ảnh hưởng giao diện runtime.

### STATE MAPPING
Bắt buộc thống nhất:
- default
- hover
- focus
- active
- selected
- pressed
- disabled
- loading
- error
- success
- warning

Không để mỗi màn hình tự định nghĩa state màu khác nhau.

### VISUAL TARGET
Kết quả phải có cảm giác:
- Vuexy-like
- enterprise
- sạch
- hiện đại
- light premium
- gradient xanh nhẹ
- nhất quán với nhận diện Hoa Nam

Không được:
- xanh quá bão hòa;
- gradient quá mạnh;
- neon/cyan hóa toàn UI;
- thay mọi card bằng nền xanh;
- lạm dụng shadow;
- dùng nhiều hơn 1 accent brand system.

### ACCEPTANCE CRITERIA — PASS / FAIL

#### AC01 — Exact token match
PASS khi tất cả brand colors runtime khớp chính xác:
`#0C6286`, `#0C5D7D`, `#5E93A7`, `#FAFCFC`
hoặc alpha/gradient đã approved.

#### AC02 — No color drift
PASS khi không phát hiện brand HEX mới được tạo từ việc lighten/darken/mix ngoài token.

#### AC03 — No purple legacy
PASS khi purple/indigo không còn là CTA/active/selected/focus brand color.

#### AC04 — Single source of truth
PASS khi brand color chỉ được quản lý qua theme/token source chung.

#### AC05 — Component coverage
PASS khi button, sidebar/nav, forms, table/datagrid, dialog, tabs, chip/status, loading, empty state đã dùng cùng token system.

#### AC06 — Semantic isolation
PASS khi success/warning/danger/info chỉ dùng cho semantic state, không dùng làm brand accent.

#### AC07 — Gradient lock
PASS khi mọi gradient brand runtime khớp 1 trong các gradient approved.

#### AC08 — Existing business preserved
PASS khi không làm hỏng route, permission, API contract, validation, workflow, responsive behavior.

#### AC09 — QA evidence
Xuất báo cáo gồm:
- file theme/token đã tạo/sửa;
- danh sách file/component đã cập nhật;
- danh sách legacy colors đã remove;
- grep/search evidence cho HEX cũ;
- ảnh chụp các màn hình đại diện;
- PASS/FAIL từng AC01–AC09.

### FINAL GATE
Nếu còn bất kỳ màn hình/component nào dùng brand color ngoài source-of-truth:
**FAIL — chưa được phép kết thúc task.**

Chỉ được trả kết quả hoàn tất khi toàn hệ thống đạt color consistency 100% theo Hoa Nam Color System v1.
