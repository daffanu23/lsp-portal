'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NewsDetailPage() {
  const params = useParams(); 
  const { id } = params; 

  const [news, setNews] = useState(null);
  const [recentNews, setRecentNews] = useState([]); // Untuk Sidebar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);

      // 1. Ambil Detail Berita Ini
      const { data: currentNews, error } = await supabase
        .from('tbl_m_news')
        .select('*')
        .eq('id_news', id) 
        .single(); 

      if (error) console.error("Error detail:", error);
      else setNews(currentNews);

      // 2. Ambil 3 Berita Lain (Terbaru) untuk Sidebar
      const { data: otherNews } = await supabase
        .from('tbl_m_news')
        .select('id_news, tbl_title, tgl_upload')
        .neq('id_news', id) // Jangan ambil berita yg sedang dibuka
        .order('tgl_upload', { ascending: false })
        .limit(3);
        
      if (otherNews) setRecentNews(otherNews);

      setLoading(false);
    }

    fetchData();
  }, [id]);

  // Loading State
  if (loading) return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
        <Navbar />
        <div className="container" style={{ textAlign:'center', marginTop:'150px' }}>
            <p>Memuat artikel...</p>
        </div>
    </div>
  );

  if (!news) return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
        <Navbar />
        <div className="container" style={{ textAlign:'center', marginTop:'150px' }}>
            <h1>Artikel Tidak Ditemukan</h1>
            <Link href="/" style={{ color:'blue' }}>&larr; Kembali</Link>
        </div>
    </div>
  );

  return (
    <main style={{ background: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* NAVBAR (Otomatis Putih) */}
      <Navbar />

      {/* JARAK AMAN DARI NAVBAR (Ini Solusi 'Nabrak') */}
      <div style={{ marginTop: '120px' }}></div>

      {/* BREADCRUMB */}
      <div style={{ borderBottom:'1px solid #eee', paddingBottom:'20px', marginBottom:'40px' }}>
         <div className="container">
            <p style={{ fontSize:'12px', color:'#888', margin:0 }}>
                <Link href="/" style={{ textDecoration:'none', color:'#888' }}>Home</Link>
                <span style={{ margin:'0 10px' }}>/</span>
                <span style={{ color:'black', fontWeight:'600' }}>Artikel</span>
            </p>
         </div>
      </div>

      {/* KONTEN UTAMA (2 Kolom) */}
      <div className="container" style={{ marginBottom: '80px', flex: 1 }}>
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsif
            gap: '50px',
            alignItems: 'start'
        }}>

            {/* --- KOLOM KIRI: Isi Berita --- */}
            <div style={{ gridColumn: 'span 2' }}> 
                
                {/* Tanggal Upload */}
                <span style={{ fontSize:'13px', color:'#d32f2f', fontWeight:'600', display:'block', marginBottom:'10px' }}>
                    {new Date(news.tgl_upload).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>

                {/* Judul Besar */}
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111', lineHeight: '1.3', marginBottom: '20px' }}>
                    {news.tbl_title}
                </h1>

                {/* Gambar Utama (Hero Image Berita) */}
                <div style={{ width:'100%', height:'400px', background:'#eee', borderRadius:'12px', overflow:'hidden', marginBottom:'30px' }}>
                    <img 
                        src={news.tbl_pict || 'https://placehold.co/800x400?text=No+Image'} 
                        alt={news.tbl_title}
                        style={{ width:'100%', height:'100%', objectFit:'cover' }}
                    />
                </div>

                {/* Isi Artikel (Text) */}
                <div style={{ lineHeight: '1.8', color: '#333', fontSize: '18px', fontFamily: 'Georgia, serif' }}>
                     {/* Split paragraf biar rapi */}
                     {news.tbl_desc ? news.tbl_desc.split('\n').map((par, i) => (
                        <p key={i} style={{ marginBottom:'20px' }}>{par}</p>
                     )) : (
                        <p>Belum ada deskripsi konten untuk berita ini.</p>
                     )}
                </div>

            </div>

            {/* --- KOLOM KANAN: Sidebar (Berita Lainnya) --- */}
            <aside style={{ position: 'sticky', top: '120px' }}>
                
                {/* Judul Sidebar */}
                <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', borderLeft:'4px solid black', paddingLeft:'10px' }}>
                    Berita Terbaru
                </h4>

                {/* List Berita Kecil (Card Gelap) */}
                <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
                    {recentNews.map((item) => (
                        <Link 
                            href={`/news/${item.id_news}`} 
                            key={item.id_news}
                            style={{ textDecoration:'none' }}
                        >
                            <div style={{ 
                                background: '#1e1e1e', // Dark Card Style
                                color: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                transition: 'transform 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                            >
                                <h5 style={{ fontSize:'14px', fontWeight:'700', lineHeight:'1.4', marginBottom:'8px' }}>
                                    {item.tbl_title}
                                </h5>
                                <span style={{ fontSize:'11px', color:'#888' }}>
                                    {new Date(item.tgl_upload).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

            </aside>

        </div>
      </div>

      <Footer />
    </main>
  );
}