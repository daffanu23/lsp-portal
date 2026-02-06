'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Pin, Trash2, Edit, Plus, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [newsList, setNewsList] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    const { data, error } = await supabase
      .from('tbl_m_news')
      .select('*')
      .order('tgl_upload', { ascending: false });

    if (data) {
        // Sorting: Pinned di atas
        const sorted = data.sort((a, b) => (a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1));
        setNewsList(sorted);
    }
    setLoading(false);
  }

  const togglePin = async (id, currentStatus) => {
    const { error } = await supabase.from('tbl_m_news').update({ is_pinned: !currentStatus }).eq('id_news', id);
    if (!error) fetchNews(); 
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus berita ini?")) return;
    const { error } = await supabase.from('tbl_m_news').delete().eq('id_news', id); 
    if (!error) { fetchNews(); }
  };

  if (loading) return <div style={{ height:'80vh', display:'flex', justifyContent:'center', alignItems:'center', color:'#666' }}><Loader2 className="animate-spin"/> Memuat Data...</div>;

  return (
    // WRAPPER UTAMA: Tambah Padding Top agar tidak ketutup Navbar/Header
    <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
                <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing:'-1px', textTransform:'uppercase' }}>Dashboard</h1>
                <p style={{ color: '#666', fontSize:'16px', fontWeight:'500' }}>Overview berita dan status pin terkini.</p>
            </div>
            <Link href="/admin/news/add">
                <button style={{ 
                    background: 'black', color: 'white', padding: '15px 30px', borderRadius: '12px', 
                    border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition:'transform 0.2s'
                }}>
                    <Plus size={20} /> Tambah Berita
                </button>
            </Link>
        </div>

        {/* CONTENT CARD (TABEL) */}
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 5px 30px rgba(0,0,0,0.05)', overflow: 'hidden', border:'1px solid #eee' }}>
            {newsList.length === 0 ? (
                <div style={{ padding: '80px', textAlign: 'center', color: '#888' }}>
                    <p style={{marginBottom:'20px'}}>Belum ada berita yang diupload.</p>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                    <thead style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                        <tr>
                            <th style={{ padding: '25px', textAlign: 'center', width: '80px', color:'#888', fontSize:'12px', letterSpacing:'1px' }}>PIN</th>
                            <th style={{ padding: '25px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>JUDUL BERITA</th>
                            <th style={{ padding: '25px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>TANGGAL</th>
                            <th style={{ padding: '25px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>PENULIS</th>
                            <th style={{ padding: '25px', textAlign: 'center', width: '150px', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsList.map((item) => (
                            <tr key={item.id_news} style={{ 
                                borderBottom: '1px solid #f3f4f6',
                                background: item.is_pinned ? '#fffbeb' : 'white',
                                transition: '0.2s'
                            }}>
                                {/* Kolom PIN */}
                                <td style={{ textAlign: 'center', padding: '20px' }}>
                                    <button onClick={() => togglePin(item.id_news, item.is_pinned)} style={{ background: 'none', border: 'none', cursor: 'pointer', transition:'0.2s' }} title={item.is_pinned ? 'Lepas Pin' : 'Pin Berita'}>
                                        <Pin size={22} fill={item.is_pinned ? "#f59e0b" : "none"} color={item.is_pinned ? "#f59e0b" : "#ccc"} />
                                    </button>
                                </td>
                                
                                {/* Kolom JUDUL */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#222' }}>
                                        {item.tbl_title}
                                        {item.is_pinned && <span style={{ marginLeft:'10px', fontSize:'10px', background:'black', color:'white', padding:'4px 8px', borderRadius:'6px' }}>PINNED</span>}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#888', marginTop: '5px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{item.category || 'General'}</div>
                                </td>

                                {/* Kolom TANGGAL */}
                                <td style={{ padding: '20px', color: '#666' }}>
                                    {new Date(item.tgl_upload).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                                </td>

                                {/* Kolom PENULIS */}
                                <td style={{ padding: '20px', color: '#666', fontWeight:'500' }}>{item.author}</td>

                                {/* Kolom AKSI */}
                                <td style={{ textAlign: 'center', padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                        <Link href={`/admin/news/edit/${item.id_news}`}>
                                            <button style={{ padding:'8px 12px', borderRadius:'8px', border:'1px solid #ddd', background:'white', cursor:'pointer', color:'#444' }}>
                                                <Edit size={16} />
                                            </button>
                                        </Link>
                                        <button onClick={() => handleDelete(item.id_news)} style={{ padding:'8px 12px', borderRadius:'8px', border:'none', background:'#fee2e2', cursor:'pointer', color:'#ef4444' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}