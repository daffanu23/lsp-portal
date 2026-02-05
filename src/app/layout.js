import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext'; // Import ini

const inter = Inter({ subsets: ['latin'] });

export const metadata = { title: 'LSP Teknologi Digital', description: 'Platform Sertifikasi' };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider> {/* Bungkus di sini */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}