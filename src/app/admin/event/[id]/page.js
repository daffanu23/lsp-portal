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

      // Pakai 'id_event' sesuai database
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

  // Loading Screen
  if (loading) {
    return (
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <Navbar />
        <div className="container" style={{ textAlign:'center', marginTop:'100px', flex:1 }}>
          <p>Sedang memuat data sertifikasi...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // 404 Screen
  if (!event) {
    return (
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <Navbar />
        <div className="container" style={{ textAlign:'center', marginTop:'100px', flex:1 }}>
          <h1>404 - Skema Tidak Ditemukan</h1>
          <Link href="/" style={{ color:'var(--primary)' }}>&larr; Kembali ke Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // FORMAT TANGGAL INDONESIA
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <main style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      
      {/* --- HERO HEADER --- */}
      <section style={{ background: 'linear-gradient(135deg, #0088cc 0%, #005f8f 100%)', color: 'white', padding: '60px 0' }}>
        <div className="container">
          <span style={{ 
              background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', 
              fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '15px'
          }}>
            {event.code_event}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '10px' }}>
            {event.nama_event}
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px' }}>
            Tingkatkan kompetensi profesional Anda dengan sertifikasi berstandar nasional di TUK {event.tuk}.
          </p>
        </div>
      </section>

      {/* --- KONTEN UTAMA (GRID) --- */}
      <div className="container" style={{ marginTop: '50px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            
            {/* KOLOM KIRI: Deskripsi Lengkap */}
            <div className="detail-content">
                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px', color:'var(--dark)' }}>
                    Tentang Skema
                </h3>
                <div style={{ lineHeight: '1.8', color: 'var(--dark)', fontSize: '16px' }}>
                    {/* Menampilkan Deskripsi (Support Newline) */}
                    <p style={{ whiteSpace: 'pre-line' }}>
                        {event.deksripsi || "Belum ada deskripsi detail untuk skema ini."}
                    </p>
                </div>

                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px', marginTop: '40px', color:'var(--dark)' }}>
                    Persyaratan Dasar
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--dark)', lineHeight: '1.8' }}>
                    <li>Fotokopi KTP</li>
                    <li>Pas Foto 3x4 (Latar Merah)</li>
                    <li>CV / Portofolio Terkini</li>
                    <li>Sertifikat Pelatihan Terkait (Jika ada)</li>
                </ul>
            </div>

            {/* KOLOM KANAN: Sidebar Informasi (Sticky) */}
            <aside>
                <div className="card" style={{ position: 'sticky', top: '100px' }}>
                    <div className="card-body">
                        <h4 style={{ marginBottom: '20px', fontSize: '18px' }}>Detail Pelaksanaan</h4>
                        
                        {/* Item Info 1 */}
                        <div style={{ marginBottom: '20px' }}>
                            <small style={{ color: 'gray', display: 'block', marginBottom: '5px' }}>Tanggal Mulai</small>
                            <span style={{ fontWeight: '600', color: 'var(--dark)' }}>{formatDate(event.tanggal_mulai)}</span>
                        </div>

                        {/* Item Info 2 */}
                        <div style={{ marginBottom: '20px' }}>
                             <small style={{ color: 'gray', display: 'block', marginBottom: '5px' }}>Tanggal Selesai</small>
                             <span style={{ fontWeight: '600', color: 'var(--dark)' }}>{formatDate(event.tanggal_selesai)}</span>
                        </div>

                        {/* Item Info 3 */}
                        <div style={{ marginBottom: '20px' }}>
                             <small style={{ color: 'gray', display: 'block', marginBottom: '5px' }}>Lokasi / Kota</small>
                             <span style={{ fontWeight: '600', color: 'var(--dark)' }}>{event.alamat}</span>
                        </div>

                        {/* Item Info 4 */}
                        <div style={{ marginBottom: '30px' }}>
                             <small style={{ color: 'gray', display: 'block', marginBottom: '5px' }}>Tempat Uji Kompetensi (TUK)</small>
                             <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{event.tuk}</span>
                        </div>

                        <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '20px' }} />

                        {/* Tombol Aksi */}
                        <a 
                            href={`https://wa.me/6281234567890?text=Halo+Admin,+saya+ingin+mendaftar+sertifikasi+${encodeURIComponent(event.nama_event)}+(${event.code_event})`}
                            target="_blank"
                            className="btn-fill"
                            style={{ 
                                display: 'block', textAlign: 'center', textDecoration: 'none', 
                                padding: '15px', fontSize: '16px', borderRadius: '8px' 
                            }}
                        >
                            Daftar Sekarang
                        </a>

                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                            <small style={{ color: 'gray' }}>Butuh bantuan? <a href="#" style={{ color: 'var(--primary)' }}>Hubungi Kami</a></small>
                        </div>

                    </div>
                </div>
            </aside>

        </div>
      </div>

      <Footer />
    </main>
  );
}