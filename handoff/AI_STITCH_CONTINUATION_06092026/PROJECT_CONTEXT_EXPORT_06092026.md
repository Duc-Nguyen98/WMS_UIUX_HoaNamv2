# HOA NAM WMS — PROJECT CONTEXT EXPORT

Snapshot: 06/09/2026 · Asia/Bangkok  
Mục đích: lưu toàn bộ ngữ cảnh cần thiết để một AI thiết kế tiếp quản đúng tiến độ mà không đánh đồng audit, prototype và production.

## 1. Phạm vi của bản export

Bản export gồm:

- yêu cầu hiện tại của chủ dự án;
- 10 tài liệu audit/QA được cung cấp;
- 3 handoff đang có trong repository;
- trạng thái source và GitHub Pages tại commit hiện tại;
- snapshot source đầy đủ bằng `git archive`;
- ma trận tiến độ, các quyết định đã khóa và câu hỏi BA/PO còn mở;
- master prompt dùng để tiếp tục trên AI Stitch.

Bản export **không** chứa:

- mật khẩu, OTP hoặc cookie đăng nhập;
- bản sao cơ sở dữ liệu WMS;
- dữ liệu khách hàng/địa chỉ/liên hệ sản xuất;
- bằng chứng rằng prototype đã sửa hệ thống production;
- quyết định nghiệp vụ chưa được chủ dự án xác nhận.

## 2. Yêu cầu hiện tại của chủ dự án

1. Export toàn bộ dữ liệu/ngữ cảnh và tiến trình thiết kế hiện tại thành một gói bàn giao.
2. Tạo một prompt chuyên sâu cho AI Stitch để không lệch ngữ cảnh và tiến độ.
3. Đối chiếu hệ thống đang chạy và giao diện đang nâng cấp.
4. Trước mắt phải hoàn thiện các màn UI/UX đã thiết kế trước đó.
5. Chỉ sau đó mới nhận yêu cầu thiết kế màn mới.
6. Tuyệt đối không khai man hoặc suy luận ngoài phạm vi dự án.
7. Khi có vấn đề/phát sinh/điểm chưa rõ, phải hỏi chủ dự án và chỉ tiếp tục sau khi được xác nhận.
8. Phải phân biệt chỉ dẫn trong tài liệu đính kèm với yêu cầu trực tiếp của chủ dự án.

## 3. Nguồn dự án hiện tại

| Nguồn | Giá trị |
| --- | --- |
| Production/reference UI | `https://khohoanamfe.bigk.click/login` |
| Prototype GitHub Pages hiện tại | `https://duc-nguyen98.github.io/WMS_UIUX_HoaNamv2/` |
| Git repository | `https://github.com/Duc-Nguyen98/WMS_UIUX_HoaNamv2.git` |
| Branch | `main` |
| Commit | `2e929b19e27cb79929c72e4d91cf23a9f4be59f2` |
| Commit time | `2026-09-06T17:08:14+07:00` |
| Commit message | `Sync SKU and catalog lists with agency UI and add catalog view actions` |

Source stack quan sát từ `package.json`:

- React 19.2.6, React DOM 19.2.6;
- Vinext 1.0.0-beta.5, Vite 8, TypeScript 5.9;
- Base UI, shadcn, Tailwind utilities, Lucide, Recharts;
- static build chuẩn bị cho GitHub Pages tại base path `/WMS_UIUX_HoaNamv2/`.

Vuexy Demo 1 là baseline thị giác. Source không phải ứng dụng Vue/Vuetify; không được dùng baseline làm lý do đổi framework.

## 4. Đối chiếu trực tiếp ngày 06/09/2026

### 4.1. Prototype GitHub Pages

Website đã truy cập được và hiển thị review board `Hoa Nam WMS — UI/UX Review & Prototypes` với navigation:

- Overview;
- Bằng chứng đánh giá;
- Đăng nhập;
- Quên mật khẩu;
- Tổng quan vận hành;
- Danh mục → Danh sách SKU;
- Danh mục → Danh mục sản phẩm;
- Danh mục → Đại lý / nơi nhận;
- DEV Specification;
- Acceptance Criteria.

Không có mục Danh mục bệnh/lỗi ở navigation/source hiện tại.

Trang đang tự ghi rõ dữ liệu Dashboard và master data là minh họa, không kết nối kho thật. Các trạng thái/action DEMO được trình bày trong cùng một review board.

### 4.2. Hệ thống đang chạy

Trang đăng nhập đã được mở và quan sát ở trạng thái signed-out. Bố cục hiện tại là hai cột: minh họa Vuexy ở trái và form Hoa Nam WMS ở phải, gồm Email, Mật khẩu, Ghi nhớ đăng nhập, Quên mật khẩu và CTA Đăng nhập.

Phiên sâu hơn chưa được làm mới trong lượt export vì người dùng chưa đăng nhập lại tại thời điểm snapshot. Không có mật khẩu/OTP được đọc hoặc lưu. Các màn production còn lại được căn cứ vào báo cáo audit read-only ngày 05–06/09/2026.

## 5. Kiến trúc prototype hiện tại

### 5.1. Shell/review board

- `app/page.tsx`: navigation, Overview, Evidence, Auth prototypes, DEV Spec, Acceptance Criteria.
- `app/globals.css`: theme/layout chung của review board và Auth.
- `components/prototype-history.tsx` + bootstrap history: phục hồi state query/hash trong review board một trang.

### 5.2. Dashboard

- `components/dashboard-prototype.tsx`
- `components/dashboard-prototype.css`
- `components/dashboard-visuals.tsx`
- `components/dashboard-visuals.css`
- `lib/dashboard-demo.ts`

Fixture chính:

- 8 SKU stock DEMO;
- tổng tồn ghi nhận 674, khả dụng mẫu 647;
- kỳ mẫu 30/08–05/09/2026;
- phương trình đối soát `581 + 196 − 56 − 56 + 12 = 677`;
- warranty, label, import-error và pending-SKU đều synthetic.

Các action chi tiết chỉ mô phỏng. Công thức, SLA, quyền và mutation production chưa được xác nhận.

### 5.3. Danh sách SKU

- `components/sku-prototype.tsx`
- `components/sku-prototype.css`
- `components/sku-primitives.tsx`
- `components/sku-actions.tsx`
- `lib/sku-demo.ts`
- `tests/sku-demo.test.mjs`

Fixture:

- 72 SKU synthetic;
- 3 SKU pending;
- 3 Hãng mẫu, 6 Model theo Hãng;
- Add/Edit/Detail/Import/Publish chỉ ở memory/DEMO.

### 5.4. Danh mục sản phẩm

- `components/catalog-prototype.tsx`
- `components/catalog-prototype.css`
- `lib/catalog-demo.ts`
- `tests/catalog-demo.test.mjs`

5 tab và số fixture hiện tại:

| Tab | Số bản ghi DEMO |
| --- | ---: |
| Hãng | 18 |
| Nhóm hàng | 27 |
| Mẫu sản phẩm | 21 |
| Nguồn điện | 9 |
| Quy cách đóng gói | 8 |

Số này khác snapshot production trong audit và được ghi rõ là fixture; không dùng để suy ra tổng dữ liệu thật.

### 5.5. Đại lý / nơi nhận

- `components/agency-prototype.tsx`
- `components/agency-prototype.css`
- `components/agency-actions.tsx`
- `lib/agency-demo.ts`
- `tests/agency-demo.test.mjs`

Fixture:

- 26 nơi nhận synthetic;
- 11 Đại lý, 5 Nhà phân phối, 5 Khách công trình, 5 Khách lẻ;
- 21 đang dùng, 5 ngừng dùng;
- Tỉnh/Phường mẫu hoàn toàn hư cấu;
- phone/contact/address chỉ là dữ liệu minh họa.

### 5.6. Pattern master data dùng chung

- `components/master-data-list.css`
- `components/master-data-search.tsx`
- `components/master-data-demo.tsx`

Đã đồng bộ SKU/Catalog theo pattern Agency nhưng không ép các màn bỏ field nghiệp vụ riêng.

## 6. Trạng thái QA/source tại thời điểm export

Kiểm tra lại trong workspace:

- 23/23 Node unit tests của SKU, Catalog và Agency đạt.
- Các test xác nhận global sort trước pagination, URL/default 10, filter, Model–Hãng DEMO, validation synthetic, bảo toàn phone/legacy address và cờ thay đổi nhạy cảm.
- Lệnh TypeScript trong lượt export không chạy được vì binary compiler không hiện diện trong `node_modules` cục bộ, dù `package.json` khai báo TypeScript. Không tuyên bố TypeScript vừa được kiểm tra lại.
- Các handoff tại chính commit/source hiện tại ghi nhận TypeScript, scoped lint, build và kiểm tra GitHub Pages đã đạt trong lượt triển khai trước.
- Không thay dependencies hoặc chạy cài đặt package trong lượt export này.

Trạng thái git trước khi tạo gói bàn giao: `main` khớp `origin/main`; có thư mục `.codex/` untracked của môi trường, không thuộc source sản phẩm và không được đưa vào source snapshot.

## 7. Đối chiếu audit cũ với prototype hiện tại

### 7.1. Dashboard

Audit production ngày 05/09 chấm 60/100, nêu overflow 1024/1280, action không giữ đúng tập dữ liệu, metric/cutoff chưa rõ và hàng đợi nằm quá sâu.

Prototype QA sau đó ghi nhận:

- đã dựng Dashboard DEMO và action/modal liên quan;
- không tràn ngang ở 768/900/960/1024/1280/1440/1920 trong lượt QA;
- fixture/count/action nội bộ đã đối chiếu;
- visual refresh và khối đối soát đã cập nhật;
- vẫn giữ công thức thật, SLA, quyền, in và backend ở trạng thái chờ BA/PO.

Kết luận đúng: prototype đã mô phỏng phương án cải thiện; production chưa được khẳng định đã sửa.

### 7.2. SKU

Audit production ngày 05/09 chấm 63/100, xác nhận sort per-page, mất ngữ cảnh action tablet, URL không giữ state, Model chưa lọc theo Hãng, checkbox bulk không có tác vụ và conflict publish.

Prototype/QA hiện tại đã có:

- filter → global sort → pagination;
- URL state;
- sticky identity/action;
- bỏ checkbox bulk;
- Model theo Hãng ở DEMO;
- action conflict DEMO có tải revision và xác nhận lại;
- import chỉ metadata/fixture, không upload hoặc commit thật;
- tinh chỉnh bảng, STT, CTA và select.

Không được tuyên bố backend production đã sửa sort, conflict, eligibility hoặc import.

### 7.3. Catalog

Audit production ngày 06/09 chấm 64/100, xác nhận sort per-page, tablet tách đối tượng/action, thuật ngữ Mẫu/Model và Nguồn điện/Công suất mâu thuẫn, lifecycle/usage chưa rõ, error/empty trộn.

Prototype hiện tại đã dựng 5 tab, URL state, global sort, Detail/Add/Edit DEMO, bảng responsive/sticky và đồng bộ UI với Agency. Những rule thuật ngữ, usage, lifecycle, Hãng–Model production và cascade vẫn chưa được phép tự chốt.

### 7.4. Agency

Audit production ngày 06/09 chấm 61/100, xác nhận sort per-page, bảng tablet mất identity, phone có tín hiệu DOM/UI không nhất quán, legacy address và nguồn địa bàn chưa rõ.

Prototype hiện tại đã dùng synthetic data, global sort, URL state, sticky action, session-only Add/Edit/Detail, bảo toàn phone/legacy qua test và dependency địa bàn hư cấu. Tín hiệu DOM phone trong công cụ vẫn không đủ để tuyên bố production đã an toàn; rule phone/địa bàn/lifecycle vẫn chờ BA.

### 7.5. Defect

Audit production ngày 06/09 chấm 64/100, nêu sort per-page, regression 1024px, mô tả chỉ đọc qua hover, thiếu dirty guard, URL state và rule code/status chưa rõ.

Chưa có prototype Defect trong source hiện tại. Tài liệu này chỉ là đầu vào cho giai đoạn màn mới sau khi chủ dự án mở phase gate.

## 8. Quyết định visual và interaction đã giữ xuyên suốt

- Public Sans; nền `#F8F7FA`; card trắng; chữ chính gần `#2F2B3D`.
- `#7367F0` là accent; CTA chữ trắng dùng sắc đậm đủ tương phản như `#675DD8`/`#594FC7` theo context.
- Không phủ tím toàn màn, không chuyển sidebar/nền thành tím.
- Radius 6px; spacing có nhịp rõ.
- Tablet từ 768px; không thiết kế mobile.
- Touch target chính 44–48px; focus visible; không phụ thuộc hover.
- Bảng phân trang không có vertical scroll riêng; mặc định 10 dòng; sticky identity/action; horizontal scroll có chủ đích khi cần.
- Loading/empty/no-result/error/readonly/conflict tách riêng.
- Modal có dirty guard, validation, pending, focus trap và return focus.
- Dữ liệu public prototype phải synthetic.

## 9. Những giới hạn phải được kế thừa

- Không có nghiên cứu người dùng định lượng trong các báo cáo.
- Không có kiểm toán bảo mật hoặc chứng nhận WCAG toàn hệ thống.
- Viewport giả lập không thay thế iPad/Android/Safari thật.
- Không có kiểm chứng API mutation production, nhiều phiên thật, mất mạng, máy in, camera hoặc upload thật.
- Không có data dictionary nghiệp vụ cuối cùng cho tồn, SLA, serial, publish, lifecycle master data, địa bàn và Defect.
- Không được dùng audit score như KPI nghiệm thu tự động.

## 10. Trạng thái đích sau khi tiếp quản

AI tiếp quản phải giữ một ma trận sống gồm:

- màn đã có;
- version/design đang duyệt;
- phần giữ nguyên;
- phần đã được chủ dự án xác nhận sửa;
- câu hỏi đang chờ;
- bằng chứng QA;
- màn đã được chủ dự án nghiệm thu;
- phase gate cho màn mới.

Không chuyển màn hoặc phase dựa trên cảm nhận “đã đủ tốt”; chỉ dựa trên xác nhận trực tiếp của chủ dự án.
