import type { Metadata } from 'next';
import { Geist_Mono, Public_Sans } from 'next/font/google';
import './globals.css';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hoa Nam WMS — UI/UX Review & Prototypes',
  description:
    'Review board Đăng nhập, Quên mật khẩu, Tổng quan vận hành và Danh sách SKU với các màn action DEMO; baseline Vuexy Demo 1 cho tablet và desktop.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${publicSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
