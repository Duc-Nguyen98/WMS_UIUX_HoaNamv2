# HOA NAM WMS — SOURCE & DOCUMENT MANIFEST

Snapshot: 06/09/2026 · Asia/Bangkok

## 1. Source provenance

| Trường | Giá trị |
| --- | --- |
| Repository | `https://github.com/Duc-Nguyen98/WMS_UIUX_HoaNamv2.git` |
| Branch | `main` |
| Full commit | `2e929b19e27cb79929c72e4d91cf23a9f4be59f2` |
| Short commit | `2e929b1` |
| Commit time | `2026-09-06T17:08:14+07:00` |
| Commit message | `Sync SKU and catalog lists with agency UI and add catalog view actions` |
| Public preview | `https://duc-nguyen98.github.io/WMS_UIUX_HoaNamv2/` |

Source snapshot được tạo bằng `git archive HEAD`, nên chỉ chứa file được Git theo dõi tại commit trên; không chứa `.git`, credential, cookie hoặc `.codex/` untracked.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `source-snapshot/WMS_UIUX_HoaNamv2_source_2e929b1.zip` | 2,444,043 | `50a24a23e8637846d4a63c243bd2f3f7e85543aebabf4b6b7df434331f6ff461` |

## 2. Tài liệu do chủ dự án cung cấp

Các bản sao trong `references/user-provided/` giữ nguyên nội dung và checksum của file nguồn.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `HOA_NAM_DASHBOARD_VISUAL_REFRESH_QA_05092026.md` | 2,174 | `d36eba4a9a1528abff6acb7061c23e55865af3ef5daffe9de26c3a03e6e389b9` |
| `HOA_NAM_PRODUCT_CATALOG_UIUX_AUDIT_06092026.md` | 40,814 | `07fb7725bbd8dfddedbac4548f1e6f87850baf4fa1e5f1718ac17b55c4831926` |
| `HOA_NAM_RECONCILIATION_REFRESH_STATUS_05092026.md` | 1,731 | `5bb64e70e8875542def2d0dc95013159f50dd9a0b4ea0923c5c12106cb191696` |
| `HOA_NAM_SKU_PROTOTYPE_QA_06092026.md` | 6,867 | `5f83c97232d50a9de4194d75a44d98198661bd28116dfa8510a35edcc3f0f83a` |
| `HOA_NAM_SKU_UIUX_AUDIT_05092026.md` | 47,966 | `700891d0d1a5f678a31f7c5f7033d111a401c76cc96b5fd149369327f06868dc` |
| `HOA_NAM_DASHBOARD_PROTOTYPE_QA_05092026.md` | 3,732 | `b0662e59f876c00b80a5ad00d92e50668ec02a125c0534bcde882f78a2384f0c` |
| `HOA_NAM_DASHBOARD_UIUX_AUDIT_05092026.md` | 58,628 | `a1b143d739fa6197d2d9c25968efc2f3eb079d42797d948a55cd6df01557ed97` |
| `HOA_NAM_DEFECT_UIUX_AUDIT_06092026.md` | 36,741 | `93a1d9446b3dcac7589c3089b5e8e99f6ad4c742ce187621698a58262eea5877` |
| `SKU_UI_REFINEMENT_QA_06092026.md` | 4,222 | `86d7a2f83065687d9c5eaa5eea846fa608b41f41b22b8bb87ced6e11ca7d63cf` |
| `HOA_NAM_AGENCY_RECIPIENT_UIUX_AUDIT_06092026.md` | 39,946 | `eba9dda37596d12ab1fb9e6f062d462090b38f4a1c22e448f3a17df40d746de8` |

## 3. Handoff từ repository

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `AGENCY_PROTOTYPE_HANDOFF.md` | 8,001 | `d97cf463f0723221d24da2046181e5684176cc7267418fb29ea9c612bfcc06ec` |
| `MASTER_DATA_UI_SYNC_HANDOFF.md` | 4,571 | `8eb4961dd5bbdf9d95593154c18b6b97fb90068289ccdf72f8d6865ff6431f1f` |
| `TABLE_LAYOUT_HANDOFF.md` | 4,298 | `d45c062812a92d5f3fb0fe015c88debe8e06ef214ee4acc11245cd17f30bb189` |

## 4. Tài liệu tổng hợp mới

Checksum ghi dưới đây được tính trước khi tạo manifest này.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `AI_STITCH_MASTER_PROMPT_06092026.md` | 24,227 | `31199053e95010388f6b1be2627842b4ccd722544f5731553599c29ce8b63343` |
| `PROJECT_CONTEXT_EXPORT_06092026.md` | 12,668 | `e37bbfae3feb3cdb1b322ee993e156083fb5ff548f5a1e694648359f5c324b17` |
| `PROGRESS_SCOPE_MATRIX_06092026.md` | 8,438 | `ebb8c87444ad60a6a548e422c4e85b2a921035ff976e3f03c5a7590f9ac923d4` |
| `OPEN_DECISIONS_CONFIRMATION_GATE_06092026.md` | 7,705 | `3de85dc915635a5ddc1a0d7812d33a267cf1c974259e9ec85890136e1d62c44d` |
| `README.md` | 2,449 | `d9634035f9c52bc137ba351fbb71acb888f73b32a2ca25074e4450bc3a58d1f9` |

## 5. Kiểm tra đã thực hiện trong lượt export

| Kiểm tra | Kết quả | Diễn giải đúng |
| --- | --- | --- |
| Truy cập GitHub Pages | Đạt | Review board và 6 nhóm màn hiện tại tải được |
| Truy cập production login | Đạt ở trạng thái signed-out | Chỉ quan sát màn login; chưa refresh audit các màn sâu |
| SKU/Catalog/Agency unit tests | 23/23 đạt | Chỉ xác nhận logic fixture/helper hiện tại |
| TypeScript trong workspace hiện tại | Không chạy được | Local compiler binary không hiện diện; không ghi là pass trong lượt này |
| TypeScript/lint/build lịch sử tại commit | Handoff ghi nhận đạt | Bằng chứng từ lượt triển khai trước, không phải lần chạy mới |
| Production mutation | Không thực hiện | Không lưu/tạo/import/in/publish dữ liệu thật |

## 6. Quy tắc kiểm tra integrity

Ví dụ PowerShell để kiểm tra một file:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '<duong-dan-file>'
```

Nếu checksum tài liệu tham chiếu thay đổi, phải coi đó là một phiên bản nguồn mới và đối chiếu lại trước khi tiếp tục thiết kế.
