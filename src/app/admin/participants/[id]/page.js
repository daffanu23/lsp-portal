'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function ParticipantDetailPage() {
  const { id } = useParams(); // id_event
  const [participants, setParticipants] = useState([]);
  const [eventDetail, setEventDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(id) fetchData();
  }, [id]);

  async function fetchData() {
    // 1. Ambil Detail Event
    const { data: ev } = await supabase.from('tbl_m_event').select('*').eq('id_event', id).single();
    setEventDetail(ev);

    // 2. Ambil List Peserta di Event ini
    const { data: users } = await supabase
        .from('tbl_registrasi')
        .select('*')
        .eq('id_event', id)
        .order('nama_lengkap', { ascending: true }); // Urut abjad
    
    if (users) setParticipants(users);
    setLoading(false);
  }

  const getStatusBadge = (status) => {
    if (status === 'Approved') return <span style={{display:'flex',alignItems:'center',gap:'5px', color:'#166534', background:'#dcfce7', padding:'5px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}><CheckCircle size={14}/> Diterima</span>;
    if (status === 'Rejected') return <span style={{display:'flex',alignItems:'center',gap:'5px', color:'#991b1b', background:'#fee2e2', padding:'5px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}><XCircle size={14}/> Ditolak</span>;
    return <span style={{display:'flex',alignItems:'center',gap:'5px', color:'#854d0e', background:'#fef9c3', padding:'5px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}><Clock size={14}/> Menunggu</span>;
  };

  if (loading) return <div style={{ height:'80vh', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', color:'#666' }}><Loader2 className="animate-spin"/> Memuat Daftar...</div>;

  return (
    <div style={{ paddingTop: '80px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER & NAVIGASI */}
      <div style={{ marginBottom: '40px' }}>
          <Link href="/admin/participants" style={{ display:'inline-flex', alignItems:'center', gap:'8px', textDecoration:'none', color:'#666', fontWeight:'600', marginBottom:'20px' }}>
              <ArrowLeft size={18}/> Kembali ke List Event
          </Link>
          
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing:'-1px' }}>
             {eventDetail?.nama_event}
          </h1>
          <p style={{ color: '#666', fontSize:'16px' }}>
             Total: <b>{participants.length}</b> Peserta Terdaftar
          </p>
      </div>

      {/* TABLE PESERTA */}
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 5px 30px rgba(0,0,0,0.05)', overflow: 'hidden', border:'1px solid #eee' }}>
        {participants.length === 0 ? (
            <div style={{ padding:'60px', textAlign:'center', color:'#888' }}>Belum ada peserta untuk event ini.</div>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                    <tr>
                        <th style={thStyle}>No</th>
                        <th style={thStyle}>Nama Lengkap</th>
                        <th style={thStyle}>Kontak</th>
                        <th style={thStyle}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {participants.map((user, index) => (
                        <tr key={user.id_reg} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '20px', textAlign:'center', color:'#888' }}>{index + 1}</td>
                            <td style={{ padding: '20px', fontWeight:'bold', color:'#222' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                                    <div style={{ width:'30px', height:'30px', background:'#eee', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}><User size={16}/></div>
                                    {user.nama_lengkap}
                                </div>
                            </td>
                            <td style={{ padding: '20px' }}>
                                <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                                    <span style={{ display:'flex', alignItems:'center', gap:'8px', color:'#444' }}><Mail size={14}/> {user.email}</span>
                                    <span style={{ display:'flex', alignItems:'center', gap:'8px', color:'#666' }}><Phone size={14}/> {user.no_hp || '-'}</span>
                                </div>
                            </td>
                            <td style={{ padding: '20px' }}>
                                {getStatusBadge(user.status)}
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

const thStyle = { padding: '20px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px', fontWeight:'700', textTransform:'uppercase' };