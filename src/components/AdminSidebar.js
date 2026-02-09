'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  LayoutDashboard, Calendar, Settings, History, 
  Mail, ShieldCheck, LogOut, Sun, Moon, User, Users
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    async function getUser() {
        const { data: { session } } = await supabase.auth.getSession();
        if(session) setUserEmail(session.user.email);
    }
    getUser();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getLinkStyle = (path) => {
    const isActive = pathname === path; 
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px 25px',
      borderRadius: '12px',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: isActive ? '700' : '500',
      transition: '0.3s',
      background: isActive ? 'black' : 'transparent',
      color: isActive ? 'white' : '#666',
      marginBottom: '8px' 
    };
  };

  return (
    <div style={{ 
        width: '300px', 
        height: '100vh', 
        position: 'fixed', 
        left: 0, top: 0, 
        borderRight: '1px solid #eee', 
        background: isDarkMode ? '#1a1a1a' : 'white',
        display: 'flex', flexDirection: 'column', 
        padding: '40px 30px',
        zIndex: 50
    }}>
      <div style={{ marginBottom: '60px' }}>
         <h1 style={{ fontSize:'32px', fontWeight:'900', margin:0, letterSpacing:'-1px' }}>UNI</h1>
         <span style={{ fontSize:'12px', fontWeight:'bold', color:'#999', textTransform:'uppercase', letterSpacing:'2px' }}>Admin Panel</span>
      </div>
      <nav style={{ flex: 1 }}>
        <Link href="/profile" style={getLinkStyle('/profile')}>
            <User size={20} /> Profile Saya
        </Link>
        <Link href="/admin" style={getLinkStyle('/admin')}>
            <LayoutDashboard size={20} /> Dashboard Berita
        </Link>
        <Link href="/admin/event" style={getLinkStyle('/admin/event')}>
            <Calendar size={20} /> Manajemen Event
        </Link>
        <Link href="/admin/settings" style={getLinkStyle('/admin/settings')}>
            <Settings size={20} /> Pengaturan Halaman
        </Link>
        <Link href="/admin/history" style={getLinkStyle('/admin/history')}>
            <History size={20} /> Kelola History
        </Link>
        <Link href="/admin/messages" style={getLinkStyle('/admin/messages')}>
            <Mail size={20} /> Kotak Masuk Pesan
        </Link>
        <Link href="/admin/verifikasi" style={getLinkStyle('/admin/verifikasi')}>
            <ShieldCheck size={20} /> Verifikasi Akun
        </Link>
        <Link href="/admin/participants" style={getLinkStyle('/admin/participants')}>
            <Users size={20} /> Data Peserta
        </Link>
      </nav>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '30px' }}>
         <button onClick={toggleTheme} style={{ 
            width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ddd', background:'transparent',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', cursor:'pointer', marginBottom:'15px',
            color: isDarkMode ? 'white' : 'black'
         }}>
             {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
             {isDarkMode ? 'Light Mode' : 'Dark Mode'}
         </button>
         
         <div style={{ fontSize:'12px', color:'#888', marginBottom:'15px', textAlign:'center' }}>{userEmail}</div>

         <button onClick={handleLogout} style={{ 
            width:'100%', padding:'12px', borderRadius:'8px', border:'none', background:'#ffecec', color:'#d32f2f',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', cursor:'pointer', fontWeight:'bold'
         }}>
             <LogOut size={18} /> Logout
         </button>
      </div>
    </div>
  );
}