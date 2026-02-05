'use client'; 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link'; // <--- PENTING: Import Link

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

  // LOGIKA WAKTU (Custom)
  const getTimeLabel = (dateStr) => {
    const uploadDate = new Date(dateStr);
    const now = new Date();
    // Hitung selisih dalam jam
    const diffHours = (now - uploadDate) / (1000 * 60 * 60); 

    if (diffHours < 24) {
        return "Baru diupload";
    } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} hari yang lalu`;
    }
  };

  return (
    <section style={{ padding: '80px 0', background: '#e5e5e5' }}>
      <div className="container">
        
        <h2 style={{ 
            textAlign: 'center', marginBottom: '50px', 
            fontWeight: '800', fontSize: '1.8rem', color:'#111', 
            textTransform:'uppercase', letterSpacing:'1px' 
        }}>
            Artikel
        </h2>

        {loading ? <p style={{textAlign:'center'}}>Memuat artikel...</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
            
            {news.map((item) => (
                // --- BUNGKUS DENGAN LINK AGAR BISA DIKLIK ---
                <Link 
                    href={`/news/${item.id_news}`} // Mengarah ke halaman detail berita
                    key={item.id_news}
                    style={{ textDecoration: 'none', color: 'inherit' }} // Hilangkan garis bawah default
                >
                    <div 
                        style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'opacity 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'} // Efek hover dikit
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                    
                    {/* Gambar Auto Crop (Square 1:1) */}
                    <div style={{ width: '100%', aspectRatio: '1/1', background: '#222', marginBottom: '15px' }}>
                        <img 
                            src={item.tbl_pict || 'https://placehold.co/400x400/1e1e1e/FFF?text=No+Image'} 
                            alt="News" 
                            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} 
                        />
                    </div>

                    {/* Judul & Waktu */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap:'10px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', lineHeight:'1.4', color:'#111', flex: 1 }}>
                            {item.tbl_title}
                        </h4>
                        <span style={{ fontSize: '10px', color: '#666', whiteSpace:'nowrap', marginTop:'3px' }}>
                            {getTimeLabel(item.tgl_upload)}
                        </span>
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