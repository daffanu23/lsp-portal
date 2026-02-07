import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '80px', fontWeight: '900', margin: 0, color: '#ddd' }}>404</h1>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 20px 0' }}>Halaman Tidak Ditemukan</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      
      <Link href="/" style={{ 
        padding: '12px 30px', 
        background: 'black', 
        color: 'white', 
        borderRadius: '50px', 
        textDecoration: 'none',
        fontWeight: 'bold'
      }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
}