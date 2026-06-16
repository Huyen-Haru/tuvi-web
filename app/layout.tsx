import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tử Vi AI — Luận Giải Lá Số Tử Vi',
  description: 'Tra cứu và luận giải lá số Tử Vi Đẩu Số theo hệ thống Nghê Hải Hà. Nhập ngày giờ sinh để nhận phân tích toàn diện.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
