'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();

  // Logika "Ghost": Footer hilang di halaman admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer style={{ 
        background: 'white', 
        color: 'black', 
        borderTop: '1px solid #e5e5e5', // Garis pemisah dari konten utama halaman
        padding: '30px 0', // Padding atas bawah dibuat seimbang
        marginTop: 'auto' 
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* BOTTOM BAR (Copyright) - Langsung ditampilkan tanpa wrapper grid */}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            fontSize: '12px',
            color: '#888'
        }}>
            <div>
                &copy; 2026 LSP Teknologi Digital. All Rights Reserved.
            </div>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link href="#" style={bottomLinkStyle}>Privacy Policy</Link>
                <Link href="#" style={bottomLinkStyle}>Terms of Service</Link>
                <Link href="#" style={bottomLinkStyle}>Verifikasi Sertifikat</Link>
            </div>
        </div>

      </div>
    </footer>
  );
}

// --- STYLES HELPER ---
// Style lain (headingStyle, linkStyle) sudah saya hapus karena tidak dipakai lagi.

const bottomLinkStyle = {
    textDecoration: 'none',
    color: '#888',
    transition: 'color 0.2s'
};