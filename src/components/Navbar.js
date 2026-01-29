'use client'; // WAJIB: Agar fitur klik & state berfungsi

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Cek Memory (LocalStorage) saat pertama kali loading
  useEffect(() => {
    // Cek apakah user pernah pilih dark mode sebelumnya
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // 2. Fungsi Tombol Switch
  const toggleTheme = () => {
    if (isDarkMode) {
      // Pindah ke LIGHT
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light'); // Simpan pilihan
      setIsDarkMode(false);
    } else {
      // Pindah ke DARK
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark'); // Simpan pilihan
      setIsDarkMode(true);
    }
  };

  return (
    <header>
      <div className="container header-content">
        {/* Logo Area */}
        <div className="logo-area">
          <Link href="/">
            <img 
              src="https://placehold.co/150x50/0088cc/white?text=LOGO+LSP" 
              alt="Logo LSP" 
              className="logo-img" 
            />
          </Link>
        </div>

        {/* Navigasi */}
        <nav>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            
            <li className="dropdown">
              <a href="#" className="dropbtn">Layanan ▾</a>
              <div className="dropdown-content">
                <a href="#">Skema Sertifikasi</a>
                <a href="#">Jadwal Asesmen</a>
              </div>
            </li>
            
            <li>
                <Link href="/testimoni/form" style={{ fontSize:'13px', color:'gray' }}>
                    Isi Testimoni
                </Link>
            </li>

            <li><Link href="/login" className="btn-login">Login</Link></li>
            
            {/* Tombol Dark Mode yang SUDAH BERFUNGSI */}
            <li>
                <button 
                    className="theme-toggle" 
                    onClick={toggleTheme}
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? '☀️' : '🌙'} 
                </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}