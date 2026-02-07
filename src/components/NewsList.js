'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      // Ambil 4 berita terbaru
      const { data } = await supabase
        .from('tbl_m_news')
        .select('*')
        .order('tgl_upload', { ascending: false })
        .limit(4);
      
      setNews(data || []);
      setLoading(false);
    }
    fetchNews();
  }, []);

  return (
    <section style={{ padding: '80px 0', background: '#f8f8f8' }}>
      <div className="container">
        
        {/* JUDUL SECTION */}
        <h2 style={{ 
            textAlign: 'center', marginBottom: '50px', 
            fontWeight: '800', fontSize: '1.8rem', color:'#111', 
            textTransform:'uppercase', letterSpacing:'1px' 
        }}>
            Artikel Terbaru
        </h2>

        {loading ? <p style={{textAlign:'center'}}>Memuat artikel...</p> : (
            
            // GRID SYSTEM
            // Saya pakai minmax(280px) agar muat 4 kolom di layar laptop standar
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px'
            }}>
            
            {news.map((item, index) => (
                <Link 
                    href={`/news/${item.id_news}`} 
                    key={item.id_news}
                    style={{ textDecoration: 'none' }} 
                >
                    <div style={{ 
                        // --- STYLE DARI NEWS PAGE (PLEK KETIPLEK) ---
                        background: item.tbl_pict 
                            ? `url(${item.tbl_pict}) center/cover no-repeat` 
                            : (item.is_pinned ? '#222' : 'white'),
                        
                        color: item.tbl_pict ? 'white' : (item.is_pinned ? 'white' : 'black'),
                        
                        padding: '30px', 
                        aspectRatio: '1/1', // Kotak Sempurna
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '0' // Opsional: Tambah borderRadius:'12px' jika ingin tumpul
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {/* Overlay Gelap (Jika ada gambar) */}
                        {item.tbl_pict && (
                            <div style={{ 
                                position:'absolute', top:0, left:0, width:'100%', height:'100%', 
                                background:'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)' 
                            }}></div>
                        )}

                        {/* CONTENT */}
                        <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                            
                            {/* Kategori */}
                            <div style={{ textAlign: 'center', fontSize: '12px', opacity: 0.8, textTransform:'uppercase', letterSpacing:'1px' }}>
                                {item.category || 'News'}
                            </div>

                            {/* Judul */}
                            <h2 style={{ 
                                fontSize: '24px', fontWeight: '800', textAlign: 'center', lineHeight: '1.3',
                                margin: '0', // Reset margin
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
                                <span>{new Date(item.tgl_upload).toLocaleDateString('id-ID')}</span>
                                <span>{(index + 1).toString().padStart(2, '0')}</span>
                            </div>
                        </div>

                    </div>
                </Link>
            ))}

            </div>
        )}

      </div>
    </section>
  );
}