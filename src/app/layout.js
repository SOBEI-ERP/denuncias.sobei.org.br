import './globals.css';
import { Inter } from 'next/font/google';
import QueryProvider from '@/components/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'SOBEI - Portal de Denúncias',
  description:
    'Canal de comunicação e denúncias da Sociedade Beneficente Equilíbrio de Interlagos. Relatar condutas inadequadas, violações éticas ou irregularidades de forma segura e confidencial.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

