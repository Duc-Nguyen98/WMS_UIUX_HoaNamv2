# Footer HN — phương án đề xuất

Chữ trung tâm: **HN** (Hoa Nam), dòng phụ **TOOL**. Không dùng toàn bộ HoaNamTool trong vòng tròn nhỏ và không sao chép logo Viettel.

Bố cục: Trang chủ → Chứng từ → HN / Quét mã → Lịch sử → Cá nhân.

- Thanh nền trắng có đường lõm ôm nút tròn nổi 58px.
- Giữ màu Hoa Nam #0C6286 / #0C5D7D, chữ trắng.
- Nút giữa mở `lookup` hiện có (tra cứu và chọn quét/nhập mã); không đổi API hoặc logic kho.
- Accessible name: “Quét mã — Hoa Nam Tool”. Chữ HN/TOOL trang trí được ẩn khỏi screen reader.
- Có active state, focus visible, safe-area và reduced-motion.
- Đã quan sát 320/390/430px; đã bấm nút giữa và xác nhận mở màn Tra cứu sản phẩm.
- Scoped TypeScript và lint Scanner: PASS.

Ảnh `home-430.png` là màn hoàn chỉnh, `footer-detail.png` là ảnh crop footer trực tiếp từ preview. Đây là phương án UI, không phải logo thương hiệu đã được xác nhận.
