// src/components/Navbar.js
import Link from 'next/link'; // Pengganti <a> agar loading instan

export default function Navbar() {
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
            <li><Link href="/" className="active">Home</Link></li>
            
            <li className="dropdown">
              <a href="#" className="dropbtn">Layanan ▾</a>
              <div className="dropdown-content">
                <a href="#">Skema Sertifikasi</a>
                <a href="#">Jadwal Asesmen</a>
              </div>
            </li>
            
            <li><Link href="/login" className="btn-login">Login</Link></li>
            
            {/* Tombol Dark Mode nanti kita pasang lagi */}
            <li>
                <button className="theme-toggle">🌙</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}