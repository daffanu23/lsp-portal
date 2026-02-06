'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    const { data } = await supabase.from('tbl_m_news').select('*').order('tgl_upload', { ascending: false });
    if (data) {
        const sorted = data.sort((a, b) => (a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1));
        setNews(sorted);
    }
  }

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        
        {/* Header Nav */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '10px' }}>UNI</h1>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '14px', color: '#666' }}>
                <Link href="/about" style={{ textDecoration:'none', color:'#666' }}>About</Link>
                <Link href="/history" style={{ textDecoration:'none', color:'#666' }}>History</Link>
                <span style={{ borderBottom: '2px solid black', color: 'black', fontWeight: 'bold' }}>News</span>
                <Link href="/contact" style={{ textDecoration:'none', color:'#666' }}>Contact</Link>
            </div>
        </div>

        {/* GRID LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {news.map((item, index) => (
                <Link 
                    href={`/news/${item.id_news}`} 
                    key={item.id_news}
                    style={{ textDecoration: 'none' }} 
                >
                    <div style={{ 
                        // Jika Pinned dan TIDAK ADA gambar -> Hitam
                        // Jika Tidak Pinned dan TIDAK ADA gambar -> Putih
                        // Jika ADA gambar -> Background Image
                        background: item.tbl_pict 
                            ? `url(${item.tbl_pict}) center/cover no-repeat` 
                            : (item.is_pinned ? '#222' : 'white'),
                        
                        // Warna Text Logic
                        color: item.tbl_pict ? 'white' : (item.is_pinned ? 'white' : 'black'),
                        
                        padding: '30px', 
                        aspectRatio: '1/1', 
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden' // Supaya gambar tidak bocor
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {/* Jika ada gambar, kasih Overlay Gelap sedikit di bawah supaya tulisan terbaca */}
                        {item.tbl_pict && (
                            <div style={{ 
                                position:'absolute', top:0, left:0, width:'100%', height:'100%', 
                                background:'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)' 
                            }}></div>
                        )}

                        {/* CONTENT (Relative agar di atas overlay) */}
                        <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                            
                            {/* Kategori */}
                            <div style={{ textAlign: 'center', fontSize: '12px', opacity: 0.8, textTransform:'uppercase', letterSpacing:'1px' }}>
                                {item.category || 'News'}
                            </div>

                            {/* Judul */}
                            <h2 style={{ 
                                fontSize: '24px', fontWeight: '800', textAlign: 'center', lineHeight: '1.3',
                                // Jika ada gambar, kasih text-shadow biar makin jelas
                                textShadow: item.tbl_pict ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                            }}>
                                {item.tbl_title}
                            </h2>

                            {/* Footer (Tanggal & Index) */}
                            <div style={{ 
                                display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.7, 
                                borderTop: (item.tbl_pict || item.is_pinned) ? '1px solid rgba(255,255,255,0.3)' : '1px solid #eee', 
                                paddingTop: '15px' 
                            }}>
                                <span>{item.tgl_upload}</span>
                                <span>{(index + 1).toString().padStart(2, '0')}</span>
                            </div>
                        </div>

                    </div>
                </Link>
            ))}
        </div>

      </div>
      <Footer />
    </div>
  );
}