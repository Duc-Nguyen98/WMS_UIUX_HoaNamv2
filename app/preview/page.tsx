import type { Metadata } from 'next';
import ProductPreview from '@/components/product-preview';

export const metadata: Metadata = {
  title: 'Xem sản phẩm · Hoa Nam',
  description:
    'Khám phá sản phẩm Hoa Nam, xem tình trạng sẵn hàng hoặc đặt trước và liên hệ tư vấn sản phẩm.',
  robots: { index: false, follow: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Public prototype: deliberately independent of the WMS review/auth screens.
export default function PreviewPage() {
  return <ProductPreview />;
}
