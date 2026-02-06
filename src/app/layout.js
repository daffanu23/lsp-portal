import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext'; // Import ini
import Navbar from '@/components/Navbar'; // 1. Import Navbar di sini
import Footer from '@/components/Footer'; // 2. (Opsional) Footer juga biar statik

const inter = Inter({ subsets: ['latin'] });

export const metadata = { title: 'LSP Teknologi Digital', description: 'Platform Sertifikasi' };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider> {/* Bungkus di sini */}
          {/* 2. PASANG TAG-NYA DI SINI */}
          {/* Ini akan memunculkan Navbar di SEMUA halaman */}
          <Navbar /> 
          
          {/* Main Content (Ini yang bakal ganti-ganti isinya + ada animasinya) */}
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>

          {/* 3. PASANG FOOTER JUGA */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}