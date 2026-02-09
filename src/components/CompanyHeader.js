'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CompanyHeader() {
  const pathname = usePathname();
  const getLinkStyle = (path) => {
    const isActive = pathname.startsWith(path);
    return {
      textDecoration: 'none',
      color: isActive ? 'black' : '#888',
      fontWeight: isActive ? 'bold' : '500',
      borderBottom: isActive ? '2px solid black' : 'none',
      paddingBottom: '2px',
      transition: '0.3s'
    };
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '120px' }}>
        <h1 style={{ fontSize:'48px', fontWeight:'900', marginBottom:'10px', textTransform:'uppercase' }}>UNI</h1>
        <div style={{ display:'flex', gap:'20px', justifyContent:'center', fontSize:'14px' }}>
            <Link href="/about" style={getLinkStyle('/about')}>About</Link>
            <Link href="/history" style={getLinkStyle('/history')}>History</Link>
            <Link href="/news" style={getLinkStyle('/news')}>News</Link>
            <Link href="/contact" style={getLinkStyle('/contact')}>Contact</Link>
        </div>
    </div>
  );
}