'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { usePathname } from 'next/navigation'; // <--- Tambah ini

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // <--- Ambil URL sekarang (misal: '/about')

  // Helper function biar kodingan di bawah gak ribet
  const getLinkStyle = (path) => {
    const isActive = pathname === path;
    return {
      textDecoration: 'none',
      color: 'black',
      fontWeight: isActive ? '900' : 'normal', // Tebal kalau aktif
      borderBottom: isActive ? '2px solid black' : 'none', // Garis bawah kalau aktif
      paddingBottom: '2px',
      transition: '0.3s'
    };
  };

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '20px 40px', background: 'white', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s' }}>
        {/* LOGO */}
        <Link href="/" style={{ fontSize: '32px', fontWeight: '900', color: 'black', textDecoration: 'none', letterSpacing: '-1px' }}>
          UNI
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* USER INFO */}
          {!user ? (
            <Link href="/login" style={{ fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', color: 'black' }}>Login</Link>
          ) : (
            <div style={{ display: 'flex', gap: '15px', alignItems:'center' }}>
                {role === 'admin' && (
                    <Link href="/admin" style={{ fontSize:'12px', fontWeight:'bold', background:'black', color:'white', padding:'5px 10px', borderRadius:'4px', textDecoration:'none' }}>
                        Dashboard
                    </Link>
                )}
                <button onClick={logout} style={{background:'none', border:'none', cursor:'pointer', color:'red'}} title="Logout">
                    <LogOut size={20}/>
                </button>
            </div>
          )}

          {/* HAMBURGER ICON */}
          <button onClick={() => setIsOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={32} color="black" strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* FULLSCREEN MENU OVERLAY */}
      {/* Kita kasih animasi dikit biar menunya juga smooth */}
      <div style={{ 
          position: 'fixed', top: 0, right: isOpen ? 0 : '-100%', width: '100%', height: '100vh', 
          background: 'white', zIndex: 200, display: 'flex', flexDirection: 'column', padding: '40px',
          transition: 'right 0.5s cubic-bezier(0.77, 0, 0.175, 1)' // Animasi geser smooth
      }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '32px', fontWeight: '900' }}>UNI</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={32} color="black" />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '40px', fontSize: '32px' }}>
            {/* Aplikasikan Style Aktif di sini */}
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