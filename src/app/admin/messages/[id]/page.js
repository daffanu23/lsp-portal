'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, User, Mail, Phone, Calendar, Reply, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function MessageDetailPage() {
  const { id } = useParams();
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      const { data, error } = await supabase.from('tbl_messages').select('*').eq('id', id).single();
      if (data) setMsg(data);
      setLoading(false);
    }
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', gap:'10px', color:'#666' }}>
            <Loader2 className="animate-spin" /> Memuat surat...
        </div>
    );
  }

  if (!msg) return <div style={{ textAlign:'center', paddingTop:'150px' }}>Pesan tidak ditemukan.</div>;

  return (
    // CONTAINER UTAMA: Sama seperti Inbox (Tengah, Padding Top aman)
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', paddingTop: '100px' }}>
      
      {/* Tombol Kembali */}
      <Link href="/admin/messages" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#666', marginBottom: '25px', fontWeight: '600', transition:'0.2s' }}>
        <ArrowLeft size={20} /> Kembali ke Inbox
      </Link>

      {/* SURAT CONTAINER (Card Putih) */}
      <div style={{ background: 'white', padding: '50px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        
        {/* HEADER SURAT */}
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '30px', marginBottom: '30px' }}>
            
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
                {/* Info Pengirim */}
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 10px 0', color:'#111' }}>{msg.name}</h1>
                    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '15px' }}>
                            <Mail size={16} color="#888" /> 
                            <span style={{ fontWeight:'500' }}>{msg.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '15px' }}>
                            <Phone size={16} color="#888" /> 
                            <span>{msg.contact}</span>
                        </div>
                    </div>
                </div>

                {/* Tanggal di Pojok Kanan */}
                <div style={{ textAlign:'right', background:'#f8f8f8', padding:'10px 15px', borderRadius:'8px', color:'#666', fontSize:'13px', fontWeight:'600', display:'flex', alignItems:'center', gap:'8px' }}>
                    <Calendar size={16} /> 
                    {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    <span style={{ opacity:0.5 }}>|</span>
                    {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

        </div>

        {/* ISI PESAN (BODY) */}
        <div style={{ minHeight:'200px' }}>
            <span style={{ display:'block', fontSize:'12px', fontWeight:'bold', color:'#999', marginBottom:'15px', textTransform:'uppercase', letterSpacing:'1px' }}>Isi Pesan:</span>
            <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', whiteSpace: 'pre-line', fontFamily:'inherit' }}>
                {msg.description}
            </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #eee', display:'flex', justifyContent:'flex-end' }}>
            <a 
                href={`mailto:${msg.email}?subject=Re: Balasan untuk ${msg.name}&body=Halo ${msg.name},%0D%0A%0D%0ATerima kasih telah menghubungi kami.%0D%0A%0D%0A...`} 
                style={{ 
                    display:'inline-flex', alignItems:'center', gap:'10px',
                    background:'black', color:'white', padding:'14px 30px', 
                    borderRadius:'8px', textDecoration:'none', fontWeight:'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition:'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <Reply size={20} /> Balas via Email
            </a>
        </div>

      </div>
    </div>
  );
}