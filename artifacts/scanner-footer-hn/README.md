# Footer QR — phiên bản triển khai

Biểu tượng trung tâm: **QR/Scan màu trắng**, không dùng chữ “HN TOOL” trong vòng tròn nhỏ. Nhãn chức năng bên dưới là **Quét mã**.

Bố cục: Trang chủ → Chứng từ → HN / Quét mã → Lịch sử → Cá nhân.

- Thanh nền trắng có đường cong/lõm nhẹ ôm nút tròn nổi 54px.
- Giữ màu Hoa Nam #0C6286 / #0C5D7D, chữ trắng.
- Nút giữa mở `lookup` hiện có (tra cứu và chọn quét/nhập mã); không đổi API hoặc logic kho.
- Accessible name: “Quét mã — Hoa Nam Tool”; biểu tượng QR là phần trang trí, còn nhãn “Quét mã” là affordance chính.
- Có active state, focus visible, safe-area và reduced-motion.
- Đã đo navigation/orb/CTA theo 360/390/430px; reserved space bao phủ phần orb nhô lên và CTA không che nội dung.
- Scoped TypeScript và lint Scanner: PASS.

Ảnh `home-430.png` là màn hoàn chỉnh, `footer-detail.png` là ảnh crop footer trực tiếp từ preview. Đây là phương án UI, không phải logo thương hiệu đã được xác nhận.
