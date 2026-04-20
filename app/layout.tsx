import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HUBEKS HIMSI — Internal Management System',
  description:
    'Internal management system for HIMSI external relations division. Manage media partners, MoU documents, and more.',
  robots: 'noindex, nofollow', // Internal tool — not for search engines
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
