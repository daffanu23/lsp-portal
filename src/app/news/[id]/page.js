'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // <--- 1. Import Footer

export default function NewsDetail() {
  const params = useParams(); 
  const { id } = params; 

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNewsDetail() {
      if (!id) return;

      const { data, error } = await supabase
        .from('tbl_m_news')
        .select('*')
        .eq('id_news', id)
        .single(); 

      if (error) {
        console.error("Gagal ambil berita:", error);
      } else {
        setNews(data);
      }
      setLoading(false);
    }

    getNewsDetail();
  }, [id]);

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <Navbar />
        <div className="container" style={{ textAlign:'center', marginTop:'100px', flex:1 }}>
          <p>Sedang memuat berita...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // --- TAMPILAN 404 ---
  if (!news) {
    return (
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <Navbar />
        <div className="container" style={{ textAlign:'center', marginTop:'100px', flex:1 }}>
          <h1>404 - Berita Tidak Ditemukan</h1>
          <Link href="/" style={{ color:'var(--primary)' }}>&larr; Kembali ke Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // --- TAMPILAN UTAMA ---
  return (
    <main style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      
      <article className="article-container" style={{ flex: 1 }}> 
        {/* 1. Judul */}
        <h1 className="article-title">{news.tbl_title}</h1>

        {/* 2. Meta Info */}
        <div className="article-meta">
          <div className="meta-left">
            <span className="author-name">{news.author || 'Admin'}</span>
            <span className="separator">•</span>
            <span className="publish-date">
                {new Date(news.tgl_upload).toLocaleDateString('id-ID', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                })}
            </span>
          </div>
          
          <div className="meta-right">
            <button 
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link tersalin!');
                }} 
                className="share-btn"
            >
              Share 🔗
            </button>
          </div>
        </div>

        {/* 3. Gambar Utama */}
        <img 
            src={news.tbl_pict || 'https://placehold.co/800x400'} 
            alt="News Image" 
            className="article-image" 
        />

        {/* 4. Isi Berita */}
        <div className="article-body">
            {news.tbl_text}
        </div>

        {/* Tombol Kembali */}
        <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <Link href="/" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                &larr; Kembali ke Beranda
            </Link>
        </div>
      </article>

      {/* 2. Panggil Footer di sini */}
      <Footer />
    </main>
  );
}