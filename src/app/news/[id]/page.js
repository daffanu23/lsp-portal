'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Home, BookOpen } from 'lucide-react';

export default function NewsDetailPage() {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Style untuk tombol navigasi kecil
  const navBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '8px 16px', borderRadius: '50px',
    background: '#f3f4f6', color: '#444', 
    textDecoration: 'none', fontSize: '13px', fontWeight: '600',
    transition: '0.2s'
  };

  if (loading) return (
      <div className="container" style={{ textAlign:'center', marginTop:'100px', minHeight:'60vh', color:'#666' }}>
        <p>Memuat konten...</p>
      </div>
  );

  if (!news) return (
      <div className="container" style={{ textAlign:'center', marginTop:'100px', minHeight:'60vh' }}>
        <h1 style={{ fontWeight:'900', fontSize:'2rem' }}>404</h1>
        <p style={{ marginBottom:'20px' }}>Berita Tidak Ditemukan</p>
        <Link href="/company/news" style={{ textDecoration:'underline' }}>Kembali ke Daftar Berita</Link>
      </div>
  );

  return (
    <main style={{ background:'white', paddingBottom:'100px' }}>
      
      <div className="container" style={{ maxWidth:'800px', margin:'0 auto' }}>
        
        {/* --- NAVIGASI ATAS (Antisipasi salah klik) --- */}
        <div style={{ display:'flex', gap:'10px', padding:'30px 0', borderBottom:'1px solid #eee' }}>
            <Link href="/" style={navBtnStyle}>
                <Home size={14} /> Home
            </Link>
            <Link href="/company/news" style={navBtnStyle}>
                <BookOpen size={14} /> Daftar Berita
            </Link>
        </div>

        {/* --- HEADER KONTEN --- */}
        <div style={{ marginTop:'40px', marginBottom:'30px' }}>
            <div style={{ display:'flex', gap:'20px', fontSize:'14px', color:'#888', marginBottom:'15px', fontWeight:'500' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <Calendar size={16} color="#000" /> {formatDate(news.tgl_upload)}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <User size={16} color="#000" /> {news.author || 'Admin'}
                </div>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight:'1.3', color:'#111', letterSpacing:'-0.5px' }}>
                {news.tbl_title}
            </h1>
        </div>

        {/* --- GAMBAR UTAMA (Clean & Rounded, Bukan Banner) --- */}
        {news.tbl_pict && (
            <div style={{ marginBottom:'40px' }}>
                <img 
                    src={news.tbl_pict} 
                    alt={news.tbl_title} 
                    style={{ 
                        width:'100%', height:'auto', maxHeight:'500px', 
                        objectFit:'cover', borderRadius:'16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }} 
                />
            </div>
        )}

        {/* --- ISI ARTIKEL --- */}
        <div style={{ fontSize:'18px', lineHeight:'1.8', color:'#333', fontFamily:'Georgia, serif' }}>
            {news.tbl_text.split('\n').map((paragraph, idx) => (
                paragraph.trim() !== "" && (
                    <p key={idx} style={{ marginBottom:'24px' }}>
                        {paragraph}
                    </p>
                )
            ))}
        </div>

        {/* --- NAVIGASI BAWAH (Setelah Membaca) --- */}
        <div style={{ marginTop:'60px', paddingTop:'30px', borderTop:'1px solid #eee' }}>
            <p style={{ fontSize:'14px', color:'#888', marginBottom:'15px', fontWeight:'600' }}>Navigasi Cepat:</p>
            <div style={{ display:'flex', gap:'15px', flexWrap:'wrap' }}>
                <Link href="/news" style={{ ...navBtnStyle, background:'black', color:'white' }}>
                    <ArrowLeft size={16} /> Kembali ke Daftar Berita
                </Link>
                <Link href="/" style={navBtnStyle}>
                    <Home size={16} /> Halaman Utama
                </Link>
            </div>
        </div>

      </div>

    </main>
  );
}