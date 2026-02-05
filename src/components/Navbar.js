'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Panggil Context
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, role, logout } = useAuth(); // Ambil data user & role
  const [isPastHero, setIsPastHero] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // ... (Kode scroll effect TETAP SAMA seperti sebelumnya, copy paste saja bagian useEffect scrollnya) ...
  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        const threshold = window.innerHeight - 100;
        setIsPastHero(window.scrollY > threshold);
      } else {
        setIsPastHero(true);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navBackground = (isHomePage && !isPastHero) ? 'transparent' : 'white';
  const navTextColor = (isHomePage && !isPastHero) ? 'white' : 'black';

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, padding: '20px 0', background: navBackground, transition: '0.4s', boxShadow: (isHomePage && !isPastHero) ? 'none' : '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link href="/" style={{ color: navTextColor, fontSize: '24px', fontWeight: '900', textDecoration:'none' }}>UNI</Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* LOGIKA TAMPILAN BUTTON */}
            
            {!user ? (
                // 1. BELUM LOGIN
                <Link href="/login" style={{ padding:'8px 20px', background:'black', color:'white', borderRadius:'30px', textDecoration:'none', fontSize:'14px', fontWeight:'600' }}>
                    Login
                </Link>
            ) : (
                // 2. SUDAH LOGIN
                <div style={{ display:'flex', gap:'20px', alignItems:'center' }}>
                    
                    {/* MENU KHUSUS ADMIN */}
                    {role === 'admin' && (
                        <Link href="/admin" style={{ color: navTextColor, textDecoration:'none', fontSize:'14px', fontWeight:'600' }}>
                            Dashboard Admin
                        </Link>
                    )}

                    {/* MENU KHUSUS USER BIASA */}
                    {role === 'user' && (
                         <Link href="/profile" style={{ color: navTextColor, textDecoration:'none', fontSize:'14px', fontWeight:'600' }}>
                            Profile Saya
                        </Link>
                    )}

                    {/* TOMBOL LOGOUT */}
                    <button onClick={logout} style={{ background:'transparent', border:'1px solid red', color:'red', padding:'6px 15px', borderRadius:'20px', cursor:'pointer', fontSize:'12px' }}>
                        Logout
                    </button>
                    
                    {/* Avatar Kecil (Opsional) */}
                    {user.user_metadata?.avatar_url && (
                        <img src={user.user_metadata.avatar_url} style={{ width:'30px', borderRadius:'50%' }} />
                    )}
                </div>
            )}

        </div>
      </div>
    </nav>
  );
}