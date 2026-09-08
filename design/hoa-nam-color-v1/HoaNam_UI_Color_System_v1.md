# Hoa Nam WMS — UI Color System v1 (LOCKED)

## 1. Mục tiêu
Đây là **source of truth** cho toàn bộ màu sắc giao diện WMS / App Hoa Nam.
Mọi màn hình, component, state và gradient phải tham chiếu các token trong tài liệu này.
**Không tự suy diễn thêm màu brand mới. Không chỉnh “gần giống”. Không dùng tím/indigo làm accent chính.**

## 2. Brand colors — LOCKED

| Token | HEX | Vai trò |
|---|---|---|
| `hn.primary` | `#0C6286` | Màu chủ đạo: CTA, active state, link chính, icon nhấn |
| `hn.primaryDark` | `#0C5D7D` | Hover/pressed, headline đậm, điểm bắt đầu gradient |
| `hn.supportBlue` | `#5E93A7` | Màu hỗ trợ, tint, gradient end, decorative surface |
| `hn.nearWhite` | `#FAFCFC` | Nền sáng thương hiệu |

## 3. UI neutrals — LOCKED

| Token | HEX |
|---|---|
| `text.primary` | `#1D2939` |
| `text.secondary` | `#475467` |
| `text.muted` | `#667085` |
| `border.default` | `#E4ECEF` |
| `surface.default` | `#FFFFFF` |

## 4. Semantic status colors — chỉ dùng đúng ngữ nghĩa

| Token | HEX | Chỉ dùng cho |
|---|---|---|
| `success` | `#28C76F` | Thành công / hoàn tất |
| `warning` | `#FF9F43` | Cảnh báo / cần chú ý |
| `danger` | `#EA5455` | Lỗi / nguy hiểm / destructive |
| `info` | `#00CFE8` | Trạng thái thông tin |

> Các màu semantic **không được dùng thay cho màu brand** ở CTA, sidebar, tab active, header, selected state.

## 5. Approved alpha/tint values

- `rgba(12, 98, 134, 0.06)`
- `rgba(12, 98, 134, 0.10)`
- `rgba(12, 98, 134, 0.14)`
- `rgba(12, 98, 134, 0.20)`
- `rgba(12, 98, 134, 0.28)`
- `rgba(94, 147, 167, 0.08)`
- `rgba(94, 147, 167, 0.12)`
- `rgba(94, 147, 167, 0.18)`
- `rgba(12, 93, 125, 0.12)`

## 6. Approved gradients — LOCKED

### Primary / CTA
```css
linear-gradient(135deg, #0C5D7D 0%, #0C6286 52%, #5E93A7 100%)
```

### Sidebar / selected active
```css
linear-gradient(135deg, #0C5D7D 0%, #0C6286 65%, #5E93A7 100%)
```

### Hero / premium surface
```css
linear-gradient(
  135deg,
  rgba(12, 98, 134, 0.10) 0%,
  rgba(94, 147, 167, 0.18) 48%,
  rgba(250, 252, 252, 0.96) 100%
)
```

### Card tint
```css
linear-gradient(
  180deg,
  #FAFCFC 0%,
  rgba(94, 147, 167, 0.08) 100%
)
```

### Headline accent
```css
linear-gradient(90deg, #0C5D7D 0%, #0C6286 55%, #5E93A7 100%)
```

## 7. Mapping bắt buộc

- Primary button → `hn.gradient.primary`
- Secondary / outlined button → border + text `hn.primary`
- Active sidebar/menu/tab → `hn.gradient.sidebarActive`
- Selected row / selected card → `hn.primary` + approved alpha tint
- Focus ring → `rgba(12, 98, 134, 0.28)`
- Hero / high-level summary → `hn.gradient.hero`
- Decorative light-blue surfaces → chỉ dùng approved `supportBlue` alpha
- Cards → trắng / near-white, không tô xanh đậm toàn card
- Heading chính → `text.primary`; headline accent có thể dùng approved gradient
- Body text → `text.secondary`
- Muted/help text → `text.muted`
- Border/divider → `border.default`

## 8. Forbidden

Không được dùng lại các accent tím/indigo cũ của Vuexy làm màu thương hiệu, ví dụ các màu dạng:
- `#7367F0`
- `#8F85F3`
- `#9155FD`
- hoặc bất kỳ màu tím/indigo tương tự nào cho CTA, sidebar active, tab active, link chính.

Không:
- generate thêm HEX “gần giống” từ brand palette;
- dùng `lighten()` / `darken()` runtime làm thay đổi brand;
- hardcode màu brand rải rác trong component;
- dùng gradient mới ngoài danh sách approved;
- thay đổi giá trị token nếu chưa có phê duyệt.

## 9. Implementation rule

Mọi component phải tham chiếu token từ **một theme/source-of-truth duy nhất**.
Nếu framework là React/MUI, map token vào `theme.palette`, `components`, `sx` helpers hoặc CSS variables.
Nếu là CSS/Tailwind, map token vào root variables/config và cấm hardcode brand literal ở component.

## 10. QA rule

PASS chỉ khi:
1. Không còn purple/indigo accent ngoài nội dung ảnh/logo bên thứ ba.
2. Brand colors trong computed style khớp đúng token.
3. Không có brand HEX mới ngoài danh sách đã duyệt.
4. Gradient khớp đúng chuỗi approved.
5. Semantic colors chỉ xuất hiện ở semantic states.
6. Visual consistency được xác minh trên tất cả màn hình chính.
