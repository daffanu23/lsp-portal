'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import { formatTimeAgo } from '../lib/timeUtils'; // Import helper waktu tadi

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase
        .from('tbl_m_news')
        .select('*')
        .order('tgl_upload', { ascending: false }) 
        .limit(8);
      
      if (data) setNews(data);
      setLoading(false);
    }
    fetchNews();
  }, []);

  return (
    <section className="section-white">
      <div className="container">
        <div className="section-header">
          <h2>Berita Terkini</h2>
          <a href="#" className="view-all">Lihat Semua Berita &rarr;</a>
        </div>

        <div className="grid-4">
          {loading && <p className="loading">Memuat berita...</p>}

          {news.map((item) => (
            // UPDATE: Seluruh Card dibungkus Link (Clickable Area)
            <Link href={`/news/${item.id_news}`} key={item.id_news} className="card card-hover">
              <img 
                src={item.tbl_pict || 'https://placehold.co/400x300?text=No+Image'} 
                className="card-img" 
                alt={item.tbl_title} 
              />
              <div className="card-body">
                {/* UPDATE: Waktu Clean (Tanpa Emoji) & Format Baru */}
                <small style={{ color:'#888', display:'block', marginBottom:'5px', fontSize:'12px' }}>
                  {formatTimeAgo(item.tgl_upload)}
                </small>

                <h4 style={{ margin:'0 0 10px', fontSize:'16px', lineHeight:'1.4' }}>
                    {item.tbl_title}
                </h4>
                
                <p style={{ fontSize:'13px', color:'#555', lineHeight:'1.6' }}>
                  {item.tbl_text ? item.tbl_text.substring(0, 80) + '...' : ''}
                </p>
                
                {/* Tombol "Baca Selengkapnya" DIHAPUS sesuai request */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}