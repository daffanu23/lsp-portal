'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Trash2, Mail, Loader2, Calendar, User } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('tbl_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
        setMessages(data);
    }
    setLoading(false);
  }

  const handleDelete = async (id, e) => {
    e.preventDefault(); 
    if (!confirm('Hapus pesan ini selamanya?')) return;

    await supabase.from('tbl_messages').delete().eq('id', id);
    fetchMessages(); 
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) return <div style={{ height:'80vh', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', color:'#666' }}><Loader2 className="animate-spin"/> Memuat Pesan...</div>;

  return (
    // WRAPPER UTAMA (Padding Top Aman & MaxWidth Lega)
    <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER SECTION (Gaya Baru: Big Typography) */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing:'-1px', textTransform:'uppercase' }}>Kotak Masuk</h1>
        <p style={{ color: '#666', fontSize:'16px', fontWeight:'500' }}>Pesan dan pertanyaan dari pengunjung website.</p>
      </div>

      {/* CARD TABLE CONTAINER */}
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 5px 30px rgba(0,0,0,0.05)', overflow: 'hidden', border:'1px solid #eee' }}>
        {messages.length === 0 ? (
             <div style={{ padding:'80px', textAlign:'center', color:'#888' }}>
                <Mail size={40} color="#ddd" style={{marginBottom:'10px'}} />
                <p>Belum ada pesan masuk.</p>
             </div>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            <thead style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                <tr>
                <th style={{ padding: '25px', textAlign: 'left', width:'25%', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>PENGIRIM</th>
                <th style={{ padding: '25px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>PESAN (PREVIEW)</th>
                <th style={{ padding: '25px', textAlign: 'left', width:'150px', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>TANGGAL</th>
                <th style={{ padding: '25px', textAlign: 'center', width:'80px', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>AKSI</th>
                </tr>
            </thead>
            <tbody>
                {messages.map((msg) => (
                <tr key={msg.id} style={{ borderBottom: '1px solid #f3f4f6' }} className="hover-effect">
                    
                    {/* Kolom 1: Nama & Email */}
                    <td style={{ padding: '20px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: '700', color:'#111', marginBottom:'4px', display:'flex', alignItems:'center', gap:'8px' }}>
                            <User size={16} color="#444"/> {msg.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', marginLeft:'24px' }}>
                            {msg.email}
                        </div>
                    </td>

                    {/* Kolom 2: Cuplikan Pesan */}
                    <td style={{ padding: '20px', verticalAlign: 'top' }}>
                        <Link href={`/admin/messages/${msg.id}`} style={{ textDecoration:'none', color:'inherit', display:'block' }}>
                            <div style={{ 
                                color: '#444', lineHeight:'1.5',
                                display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                            }}>
                                {msg.description}
                            </div>
                            <div style={{ fontSize:'12px', color:'black', marginTop:'8px', fontWeight:'700', display:'inline-block', borderBottom:'1px solid black' }}>
                                Baca Isi Pesan
                            </div>
                        </Link>
                    </td>

                    {/* Kolom 3: Tanggal */}
                    <td style={{ padding: '20px', textAlign: 'left', verticalAlign: 'top' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'#666', fontSize:'13px', fontWeight:'500' }}>
                            <Calendar size={14} />
                            {formatDate(msg.created_at)}
                        </div>
                    </td>

                    {/* Kolom 4: Hapus */}
                    <td style={{ padding: '20px', textAlign: 'center', verticalAlign: 'top' }}>
                        <button 
                            onClick={(e) => handleDelete(msg.id, e)} 
                            style={{ 
                                background: '#fff0f0', border: 'none', borderRadius:'8px', 
                                padding:'8px', cursor: 'pointer', color: '#e11d48', transition:'0.2s' 
                            }} 
                            title="Hapus Pesan"
                        >
                            <Trash2 size={18} />
                        </button>
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