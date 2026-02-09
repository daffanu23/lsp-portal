'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Clock, Calendar, MapPin, Users, Ticket } from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams(); 
  const { id } = params; 

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getEventDetail() {
      if (!id) return;

      const { data, error } = await supabase
        .from('tbl_m_event')
        .select('*')
        .eq('id_event', id)
        .single(); 

      if (error) {
        console.error("Gagal ambil event:", error);
      } else {
        setEvent(data);
      }
      setLoading(false);
    }

    getEventDetail();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const formatRupiah = (number) => {
    if (!number || number == 0) return 'GRATIS';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.slice(0, 5); 
  };

  if (loading) return (
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', paddingTop: '80px' }}>
        <div className="container" style={{ textAlign:'center', marginTop:'100px', flex:1, color:'#666' }}>
          <p>Sedang memuat data sertifikasi...</p>
        </div>
      </div>
  );

  if (!event) return (
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', paddingTop: '80px' }}>
        <div className="container" style={{ textAlign:'center', marginTop:'100px', flex:1 }}>
          <h1 style={{ fontWeight:'900' }}>404</h1>
          <p>Skema Tidak Ditemukan</p>
          <Link href="/" style={{ color:'black', textDecoration:'underline' }}>&larr; Kembali ke Home</Link>
        </div>
      </div>
  );

  return (
    <main style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f8f9fa', paddingTop: '80px' }}>
      
      <section style={{ background: 'black', color: 'white', padding: '80px 0 100px 0', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-50%', right:'-10%', width:'600px', height:'600px', background:'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius:'50%' }}></div>
        
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'20px' }}>
            <span style={{ background: 'white', color:'black', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
               {event.code_event}
            </span>
            {event.sisa_kuota > 0 ? (
                 <span style={{ background: 'rgba(16, 185, 129, 0.2)', color:'#34d399', border:'1px solid #34d399', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    Tersedia
                 </span>
            ) : (
                <span style={{ background: 'rgba(239, 68, 68, 0.2)', color:'#f87171', border:'1px solid #f87171', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    Penuh
                 </span>
            )}
          </div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px', lineHeight:'1.1', maxWidth:'900px' }}>
            {event.nama_event}
          </h1>
          
          <div style={{ display:'flex', gap:'30px', flexWrap:'wrap', marginTop:'30px', opacity:0.9 }}>
             <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <MapPin size={20} />
                <span>{event.alamat}</span>
             </div>
             <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <Calendar size={20} />
                <span>{formatDate(event.tanggal_mulai)}</span>
             </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-60px', flex: 1, position:'relative', zIndex:5, marginBottom:'80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            
            <div style={{ background:'white', padding:'40px', borderRadius:'12px', boxShadow:'0 5px 30px rgba(0,0,0,0.05)' }}>
                
                <h3 style={{ fontSize:'20px', fontWeight:'800', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
                    Tentang Skema
                </h3>
                <div style={{ lineHeight: '1.8', color: '#444', fontSize: '16px', marginBottom:'40px', whiteSpace: 'pre-line' }}>
                    {event.deksripsi || "Belum ada deskripsi detail untuk skema ini."}
                </div>

                <hr style={{ border:'none', borderTop:'1px solid #eee', marginBottom:'40px' }} />

                <h3 style={{ fontSize:'20px', fontWeight:'800', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
                    Persyaratan Peserta
                </h3>
                {event.persyaratan ? (
                    <ul style={{ listStyle: 'none', padding: 0, display:'grid', gap:'15px' }}>
                        {event.persyaratan.split('\n').map((req, index) => (
                            req.trim() && (
                                <li key={index} style={{ display:'flex', gap:'15px', alignItems:'start', color:'#444', lineHeight:'1.6' }}>
                                    <div style={{ minWidth:'24px', height:'24px', background:'#eef2ff', color:'black', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'bold', marginTop:'2px' }}>
                                        {index + 1}
                                    </div>
                                    {req}
                                </li>
                            )
                        ))}
                    </ul>
                ) : (
                    <p style={{ color:'#888', fontStyle:'italic' }}>Tidak ada persyaratan khusus.</p>
                )}
            </div>

            <aside>
                <div style={{ background:'white', padding:'30px', borderRadius:'12px', boxShadow:'0 5px 30px rgba(0,0,0,0.05)', position: 'sticky', top: '100px' }}>
                    
                    <div style={{ marginBottom:'25px', borderBottom:'1px solid #eee', paddingBottom:'25px' }}>
                        <small style={{ color:'#888', fontWeight:'600', textTransform:'uppercase', fontSize:'11px', letterSpacing:'1px' }}>Biaya Sertifikasi</small>
                        <div style={{ fontSize:'32px', fontWeight:'900', color:'black', marginTop:'5px' }}>
                            {formatRupiah(event.harga)}
                        </div>
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                        
                        <div style={{ display:'flex', gap:'15px' }}>
                            <Clock size={20} color="#666" style={{ marginTop:'2px' }} />
                            <div>
                                <strong style={{ display:'block', fontSize:'14px', marginBottom:'2px' }}>Waktu Pelaksanaan</strong>
                                <span style={{ color:'#666', fontSize:'14px' }}>
                                    {formatTime(event.jam_mulai)} - {formatTime(event.jam_selesai)} WIB
                                </span>
                            </div>
                        </div>

                        <div style={{ display:'flex', gap:'15px' }}>
                            <MapPin size={20} color="#666" style={{ marginTop:'2px' }} />
                            <div>
                                <strong style={{ display:'block', fontSize:'14px', marginBottom:'2px' }}>Lokasi TUK</strong>
                                <span style={{ color:'#666', fontSize:'14px' }}>{event.tuk}</span>
                            </div>
                        </div>

                        <div style={{ display:'flex', gap:'15px' }}>
                            <Users size={20} color="#666" style={{ marginTop:'2px' }} />
                            <div>
                                <strong style={{ display:'block', fontSize:'14px', marginBottom:'2px' }}>Sisa Kuota</strong>
                                <span style={{ color:'#666', fontSize:'14px' }}>
                                    <span style={{ color:'black', fontWeight:'bold' }}>{event.sisa_kuota}</span> / {event.kuota} Kursi
                                </span>
                            </div>
                        </div>

                    </div>

                    <div style={{ marginTop:'30px' }}>
                        {event.sisa_kuota > 0 ? (
                            <Link 
                                href={`/register/${event.id_event}`} 
                                style={{ 
                                    display: 'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                                    background: 'black', color: 'white', textDecoration: 'none', 
                                    padding: '15px', fontSize: '16px', fontWeight:'bold', borderRadius: '8px',
                                    transition: '0.2s'
                                }}
                            >
                                <Ticket size={18} /> Daftar Sekarang
                            </Link>
                        ) : (
                            <button disabled style={{ 
                                width:'100%', padding:'15px', background:'#eee', color:'#999', 
                                border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'not-allowed' 
                            }}>
                                Kuota Penuh
                            </button>
                        )}
                        
                        <p style={{ textAlign:'center', fontSize:'12px', color:'#888', marginTop:'15px' }}>
                            Pastikan data diri Anda sesuai dengan persyaratan sebelum mendaftar.
                        </p>
                    </div>

                </div>
            </aside>

        </div>
      </div>
    </main>
  );
}