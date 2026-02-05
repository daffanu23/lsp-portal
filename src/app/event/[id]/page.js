'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

      if (!error) setEvent(data);
      setLoading(false);
    }
    getEventDetail();
  }, [id]);

  // Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  if (loading) return <div style={{background:'white', minHeight:'100vh', paddingTop:'150px', textAlign:'center'}}>Loading...</div>;
  if (!event) return <div style={{background:'white', minHeight:'100vh', paddingTop:'150px', textAlign:'center'}}>Data Tidak Ditemukan</div>;

  return (
    <main style={{ background: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ marginTop: '120px' }}></div>

      {/* BREADCRUMB */}
      <div style={{ borderBottom:'1px solid #eee', paddingBottom:'20px', marginBottom:'40px' }}>
         <div className="container">
            <p style={{ fontSize:'12px', color:'#888', margin:0 }}>
                <Link href="/" style={{ textDecoration:'none', color:'#888' }}>Home</Link> / 
                <span style={{ color:'black', fontWeight:'600', marginLeft:'5px' }}>{event.code_event}</span>
            </p>
         </div>
      </div>

      <div className="container" style={{ marginBottom: '80px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'start' }}>

            {/* --- KOLOM KIRI --- */}
            <div style={{ gridColumn: 'span 2' }}> 
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111', lineHeight: '1.2', marginBottom: '15px' }}>{event.nama_event}</h1>

                {/* Tags Info */}
                <div style={{ display:'flex', gap:'10px', marginBottom:'30px', flexWrap:'wrap' }}>
                    <span style={{ background:'#f3f4f6', padding:'6px 14px', borderRadius:'6px', fontSize:'13px', fontWeight:'600', color:'#374151' }}>🏷️ {event.code_event}</span>
                    <span style={{ background:'#f3f4f6', padding:'6px 14px', borderRadius:'6px', fontSize:'13px', fontWeight:'600', color:'#374151' }}>🏢 {event.tuk}</span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color:'#111' }}>Deskripsi</h3>
                <div style={{ lineHeight: '1.8', color: '#444', fontSize: '16px', marginBottom:'40px' }}>
                     {event.deksripsi ? event.deksripsi.split('\n').map((str, i) => <p key={i} style={{marginBottom:'10px'}}>{str}</p>) : "Belum ada deskripsi."}
                </div>

                {/* PERSYARATAN (Data Baru) */}
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color:'#111' }}>Persyaratan Peserta</h3>
                <div style={{ background:'#f9f9f9', padding:'25px', borderRadius:'10px', border:'1px dashed #ccc' }}>
                    <ul style={{ paddingLeft:'20px', margin:0, color:'#444', lineHeight:'1.8' }}>
                        {event.persyaratan ? event.persyaratan.split('\n').map((req, i) => (
                            <li key={i}>{req.replace('- ', '')}</li>
                        )) : <li>Tidak ada persyaratan khusus.</li>}
                    </ul>
                </div>
            </div>

            {/* --- KOLOM KANAN (Sidebar Informasi Lengkap) --- */}
            <aside style={{ position: 'sticky', top: '120px' }}>
                <div style={{ background: '#1e1e1e', color: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                    
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '25px' }}>Detail Pelaksanaan</h4>

                    {/* Harga */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Biaya Sertifikasi</p>
                        <p style={{ fontSize: '24px', fontWeight: '700', color:'#4ade80' }}>
                            {event.harga > 0 ? formatRupiah(event.harga) : 'Gratis / Subsidi'}
                        </p>
                    </div>

                    {/* Kuota */}
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px', background:'rgba(255,255,255,0.1)', padding:'10px', borderRadius:'6px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#aaa' }}>Sisa Kuota</p>
                            <p style={{ fontWeight: '700' }}>{event.sisa_kuota} Kursi</p>
                        </div>
                        <div style={{ textAlign:'right' }}>
                            <p style={{ fontSize: '11px', color: '#aaa' }}>Total</p>
                            <p style={{ fontWeight: '700' }}>{event.kuota} Kursi</p>
                        </div>
                    </div>

                    {/* Waktu & Lokasi */}
                    <div style={{ marginBottom: '15px', borderBottom:'1px solid #444', paddingBottom:'15px' }}>
                        <p style={{ fontSize: '14px', marginBottom:'5px' }}>📅 {new Date(event.tanggal_mulai).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} - {new Date(event.tanggal_selesai).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</p>
                        <p style={{ fontSize: '14px', marginBottom:'5px' }}>⏰ {event.jam_mulai?.slice(0,5)} - {event.jam_selesai?.slice(0,5)} WIB</p>
                        <p style={{ fontSize: '14px' }}>📍 {event.alamat}</p>
                    </div>

                    {/* Tombol Daftar (Link ke Form Internal) */}
                    {event.sisa_kuota > 0 ? (
                        <Link href={`/event/${event.id_event}/register`} style={{ 
                            display: 'block', background: 'white', color: 'black', textAlign: 'center', 
                            padding: '14px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', marginTop:'20px' 
                        }}>
                            Daftar Sekarang
                        </Link>
                    ) : (
                        <button disabled style={{ 
                            width:'100%', background: '#444', color: '#aaa', padding: '14px', 
                            borderRadius: '8px', fontWeight: '700', border:'none', cursor:'not-allowed', marginTop:'20px' 
                        }}>
                            Kuota Penuh
                        </button>
                    )}

                </div>
            </aside>

        </div>
      </div>
      <Footer />
    </main>
  );
}