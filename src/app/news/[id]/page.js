'use client'; // Client Component karena butuh interaksi/fetch di browser

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Hook buat ambil ID dari URL
import { supabase } from '@/lib/supabaseClient'; // Pastikan path ini benar (sesuaikan dengan lokasi lib kamu)
import Link from 'next/link';
import Navbar from '@/components/Navbar'; // Kita pasang Navbar juga biar konsisten

export default function NewsDetail() {
  const params = useParams(); // 1. Ambil ID dari URL (folder [id])
  const { id } = params; 

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch Data Spesifik saat ID berubah
  useEffect(() => {
    async function getNewsDetail() {
      if (!id) return;

      const { data, error } = await supabase
        .from('tbl_m_news')
        .select('*')
        .eq('id_news', id) // Filter: Ambil yang ID-nya sama dengan URL
        .single(); // Ambil 1 baris saja

      if (error) {
        console.error("Gagal ambil berita:", error);
      } else {
        setNews(data);
      }
      setLoading(false);
    }

    getNewsDetail();
  }, [id]);

  // --- TAMPILAN ---

  // Jika masih loading...
  if (loading) {
    return (
      <div className="container" style={{ textAlign:'center', marginTop:'100px' }}>
        <p>Sedang memuat berita...</p>
      </div>
    );
  }

  // Jika data tidak ditemukan...
  if (!news) {
    return (
      <div className="container" style={{ textAlign:'center', marginTop:'100px' }}>
        <h1>404 - Berita Tidak Ditemukan</h1>
        <Link href="/" style={{ color:'blue' }}>&larr; Kembali ke Home</Link>
      </div>
    );
  }

  // Jika data ada, tampilkan layout Detail (Style "article-container" dari globals.css)
  return (
    <main>
      <Navbar />
      
      <article className="article-container">
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
          
          {/* Tombol Share Sederhana */}
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

      {/* Footer Sementara */}
      <footer style={{ background: '#1a252f', color: '#ccc', padding: '60px 0 30px', marginTop: '50px', textAlign:'center' }}>
        <p>&copy; 2026 LSP Teknologi Digital</p>
      </footer>
    </main>
  );
}