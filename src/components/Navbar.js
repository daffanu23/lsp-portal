'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. STATE & LOGIKA SCROLL
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Cek apakah sedang di Homepage ('/')
  const isHomepage = pathname === '/';

  // 2. DETEKSI SCROLL
  useEffect(() => {
    const handleScroll = () => {
      // Jika scroll lebih dari 50px, ubah state jadi true
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. LOGIKA "GHOST" (Hilang di halaman Admin)
  if (pathname?.startsWith('/admin')) return null;

  // 4. LOGIKA WARNA DINAMIS
  // Transparan HANYA JIKA: di Homepage DAN belum di-scroll
  const isTransparent = isHomepage && !isScrolled;

  const navBg = isTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.95)';
  const navTextColor = isTransparent ? 'white' : 'black';
  const navShadow = isTransparent ? 'none' : '0 4px 20px rgba(0,0,0,0.05)';
  const navBackdrop = isTransparent ? 'none' : 'blur(10px)'; // Efek kaca

  // Helper untuk Menu Overlay (Tetap Hitam/Putih biasa karena backgroundnya putih)
  const getLinkStyle = (path) => {
    const isActive = pathname === path;
    return {
      textDecoration: 'none',
      color: 'black', // Di dalam overlay menu selalu hitam
      fontWeight: isActive ? '900' : 'normal',
      borderBottom: isActive ? '2px solid black' : 'none',
      paddingBottom: '2px',
      transition: '0.3s'
    };
  };

  return (
    <>
      <nav style={{ 
          position: 'fixed', 
          top: 0, 
          width: '100%', 
          padding: isScrolled ? '15px 40px' : '25px 40px', // Animasi padding mengecil
          background: navBg, 
          color: navTextColor,
          boxShadow: navShadow,
          backdropFilter: navBackdrop,
          zIndex: 100, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          transition: 'all 0.3s ease' // Animasi transisi warna halus
      }}>
        
        {/* LOGO */}
        <Link href="/" style={{ 
            fontSize: '32px', 
            fontWeight: '900', 
            color: navTextColor, // Warna logo ikut berubah
            textDecoration: 'none', 
            letterSpacing: '-1px' 
        }}>
          UNI
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* USER INFO */}
          {!user ? (
            <Link href="/login" style={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', color: navTextColor }}>
                Login
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '15px', alignItems:'center' }}>
                {role === 'admin' && (
                    <Link href="/admin" style={{ 
                        fontSize:'12px', fontWeight:'bold', 
                        background: isTransparent ? 'rgba(255,255,255,0.2)' : 'black', // Background tombol menyesuaikan
                        color: 'white', 
                        padding:'5px 10px', borderRadius:'4px', textDecoration:'none' 
                    }}>
                        Dashboard
                    </Link>
                )}
                
                {/* Tombol Logout */}
                <button 
                    onClick={logout} 
                    style={{ background:'none', border:'none', cursor:'pointer', color: isTransparent ? 'white' : 'red' }} 
                    title="Logout"
                >
                    <LogOut size={20}/>
                </button>
            </div>
          )}

          {/* HAMBURGER ICON */}
          <button onClick={() => setIsOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={32} color={navTextColor} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* FULLSCREEN MENU OVERLAY (TIDAK PERLU DIUBAH WARNANYA) */}
      <div style={{ 
          position: 'fixed', top: 0, right: isOpen ? 0 : '-100%', width: '100%', height: '100vh', 
          background: 'white', zIndex: 200, display: 'flex', flexDirection: 'column', padding: '40px',
          transition: 'right 0.5s cubic-bezier(0.77, 0, 0.175, 1)'
      }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '32px', fontWeight: '900', color: 'black' }}>UNI</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={32} color="black" />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '40px', fontSize: '32px' }}>
            <Link href="/" onClick={() => setIsOpen(false)} style={getLinkStyle('/')}>Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} style={getLinkStyle('/about')}>About</Link>
            <Link href="/history" onClick={() => setIsOpen(false)} style={getLinkStyle('/history')}>History</Link>
            <Link href="/news" onClick={() => setIsOpen(false)} style={getLinkStyle('/news')}>News</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} style={getLinkStyle('/contact')}>Contact</Link>
          </div>
      </div>
    </>
  );
}