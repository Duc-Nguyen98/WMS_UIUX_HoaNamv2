import type { Metadata } from 'next';
import WarrantyScannerApp from '@/components/warranty-scanner-app';

export const metadata: Metadata = {
  title: 'Hoa Nam Scanner · Vận hành kho',
  description: 'Nhập xuất kho, tra cứu, bảo hành và NFC trong một ứng dụng vận hành.',
  robots: { index: false, follow: false },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function ScannerPage() {
  return <WarrantyScannerApp />;
}
