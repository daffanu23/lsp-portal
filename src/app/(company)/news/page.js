'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
   <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        padding: '40px',
        maxWidth: '1400px',
        margin: '0 auto'
    }}>
        {news.map((item, index) => (
            <Link 
                href={`/news/${item.id_news}`} 
                key={item.id_news}
                style={{ textDecoration: 'none' }} 
            >
                <div style={{ 
                    background: item.tbl_pict 
                        ? `url(${item.tbl_pict}) center/cover no-repeat` 
                        : (item.is_pinned ? '#222' : 'white'),
                    
                    color: item.tbl_pict ? 'white' : (item.is_pinned ? 'white' : 'black'),
                    
                    padding: '30px', 
                    aspectRatio: '1/1', 
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {item.tbl_pict && (
                        <div style={{ 
                            position:'absolute', top:0, left:0, width:'100%', height:'100%', 
                            background:'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)' 
                        }}></div>
                    )}

                    <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                        <div style={{ textAlign: 'center', fontSize: '12px', opacity: 0.8, textTransform:'uppercase', letterSpacing:'1px' }}>
                            {item.category || 'News'}
                        </div>

                        <h2 style={{ 
                            fontSize: '24px', fontWeight: '800', textAlign: 'center', lineHeight: '1.3',
                            textShadow: item.tbl_pict ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                        }}>
                            {item.tbl_title}
                        </h2>

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
  );
}