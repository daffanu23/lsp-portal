'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Pin, Trash2 } from 'lucide-react';

export default function AdminNewsManager() {
  const [news, setNews] = useState([]);

  useEffect(() => { fetchNews(); }, []);

  async function fetchNews() {
    const { data } = await supabase.from('tbl_m_news').select('*').order('tgl_upload', { ascending: false });
    if(data) setNews(data.sort((a, b) => (a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1)));
  }

  const togglePin = async (id, currentStatus) => {
    await supabase.from('tbl_m_news').update({ is_pinned: !currentStatus }).eq('id_news', id);
    fetchNews();
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Manage News & Notice</h1>
      <p>Klik ikon 📌 untuk menyematkan berita di halaman depan (kotak hitam).</p>

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
            <tr style={{ textAlign: 'left', background: '#eee' }}><th style={{padding:'10px'}}>Pin</th><th style={{padding:'10px'}}>Judul</th><th style={{padding:'10px'}}>Tanggal</th></tr>
        </thead>
        <tbody>
            {news.map(item => (
                <tr key={item.id_news} style={{ borderBottom: '1px solid #ddd', background: item.is_pinned ? '#fffbea' : 'white' }}>
                    <td style={{ padding: '10px' }}>
                        <button onClick={() => togglePin(item.id_news, item.is_pinned)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                            <Pin fill={item.is_pinned ? "orange" : "none"} color={item.is_pinned ? "orange" : "#ccc"} />
                        </button>
                    </td>
                    <td style={{ padding: '10px', fontWeight: item.is_pinned ? 'bold' : 'normal' }}>
                        {item.tbl_title}
                        {item.is_pinned && <span style={{fontSize:'10px', background:'black', color:'white', padding:'2px 5px', marginLeft:'10px', borderRadius:'4px'}}>PINNED</span>}
                    </td>
                    <td style={{ padding: '10px' }}>{item.tgl_upload}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}