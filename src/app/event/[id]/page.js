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

      if (error) {
        console.error("Gagal ambil event:", error);
      } else {
        setEvent(data);
      }
      setLoading(false);
    }

    getEventDetail();
  }, [id]);

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      <div className="container" style={{ textAlign:'center', marginTop:'100px', flex:1 }}>
        <p>Sedang memuat data sertifikasi...</p>
      </div>
      <Footer />
    </div>
  );

  if (!event) return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      <div className="container" style={{ textAlign:'center', marginTop:'100px', flex:1 }}>
        <h1>404 - Skema Tidak Ditemukan</h1>
        <Link href="/" style={{ color:'var(--primary)' }}>&larr; Kembali ke Home</Link>
      </div>
      <Footer />
    </div>
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    // FIX 1: Main dikasih width 100% agar tidak menyusut ke tengah
    <main style={{ display:'flex', flexDirection:'column', minHeight:'100vh', width: '100%' }}>
      <Navbar />
      
      {/* HEADER SECTION */}
      <section style={{ background: 'linear-gradient(135deg, #0088cc 0%, #005f8f 100%)', color: 'white', padding: '60px 0', width: '100%' }}>
        {/* FIX 2: Container dipaksa Rata Kiri */}
        <div className="container" style={{ textAlign: 'left', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'15px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                {event.code_event}
            </span>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '10px' }}>
            {event.nama_event}
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px' }}>
            Pelaksanaan uji kompetensi sertifikasi profesi di TUK {event.tuk}.
          </p>
        </div>
      </section>

      {/* KONTEN UTAMA */}
      {/* FIX 3: Container Konten juga dipaksa Rata Kiri & Lebar Penuh */}
      <div className="container" style={{ 
          marginTop: '50px', 
          marginBottom: '50px', 
          flex: 1, 
          width: '100%', 
          maxWidth: '1200px', 
          alignSelf: 'center', // Jaga-jaga kalau parent flex
          textAlign: 'left'    // Override global text-align center
      }}>
        
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', width: '100%' }}>
            
            {/* KOLOM KIRI */}
            <div className="detail-content">
                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px', color:'var(--dark)', textAlign: 'left' }}>
                    Tentang Skema
                </h3>
                <div style={{ lineHeight: '1.8', color: 'var(--dark)', fontSize: '16px', textAlign: 'left' }}>
                    <p style={{ whiteSpace: 'pre-line' }}>
                        {event.deksripsi || "Deskripsi lengkap mengenai skema ini belum tersedia."}
                    </p>
                </div>
            </div>

            {/* KOLOM KANAN */}
            <aside>
                <div className="card" style={{ position: 'sticky', top: '100px', textAlign: 'left' }}>
                    <div className="card-body">
                        <h4 style={{ marginBottom: '20px', fontSize: '18px' }}>Detail Pelaksanaan</h4>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <small style={{ color: 'gray', display: 'block' }}>Jadwal</small>
                            <span style={{ fontWeight: '600', color: 'var(--dark)' }}>
                                {formatDate(event.tanggal_mulai)} <br/>
                                <span style={{ fontSize:'12px', fontWeight:'normal' }}>s/d {formatDate(event.tanggal_selesai)}</span>
                            </span>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                             <small style={{ color: 'gray', display: 'block' }}>Lokasi</small>
                             <span style={{ fontWeight: '600', color: 'var(--dark)' }}>{event.alamat}</span>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                             <small style={{ color: 'gray', display: 'block' }}>Tempat Uji (TUK)</small>
                             <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{event.tuk}</span>
                        </div>

                        <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '20px' }} />

                        <a 
                            href={`https://wa.me/6281234567890?text=Halo+Admin,+saya+ingin+mendaftar+sertifikasi+${encodeURIComponent(event.nama_event)}+(${event.code_event})`}
                            target="_blank"
                            className="btn-fill"
                            style={{ 
                                display: 'block', textAlign: 'center', textDecoration: 'none', 
                                padding: '15px', fontSize: '16px', borderRadius: '8px',
                                background: '#25D366', color: 'white'
                            }}
                        >
                           Hubungi via WhatsApp
                        </a>

                    </div>
                </div>
            </aside>

        </div>
      </div>

      <Footer />
    </main>
  );
}