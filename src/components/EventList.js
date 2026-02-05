'use client'; 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      // Ambil 8 event terdekat untuk homepage
      const { data } = await supabase
        .from('tbl_m_event')
        .select('*')
        .order('tanggal_mulai', { ascending: true })
        .limit(4);
      
      setEvents(data || []);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  // Logika Badge
  const isComingSoon = (dateStr) => {
    return new Date(dateStr) > new Date();
  };

  return (
    // Background Putih Abu agar kontras dengan kartu hitam
    <section style={{ padding: '80px 0', background: '#f5f5f5' }}>
      <div className="container">
        
        {/* JUDUL SECTION */}
        <h2 style={{ 
            textAlign: 'center', marginBottom: '50px', 
            fontWeight: '800', fontSize: '1.8rem', color:'#111', 
            textTransform:'uppercase', letterSpacing:'1px' 
        }}>
            Daftar Skema Sertifikasi
        </h2>

        {loading ? <p style={{textAlign:'center'}}>Memuat jadwal...</p> : (
            
            // GRID SYSTEM (Sesuai Request: 250px)
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px' 
            }}>
            
            {events.map((item) => (
                <div key={item.id_event} style={{ 
                    background: '#1e1e1e', // Dark Background
                    borderRadius: '5px',   // Request: 5px
                    padding: '25px', 
                    color: 'white', 
                    position:'relative', 
                    minHeight:'380px', 
                    display:'flex', flexDirection:'column', justifyContent:'space-between',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                
                {/* BADGE "Coming Soon" (Top Center) */}
                {isComingSoon(item.tanggal_mulai) && (
                    <div style={{ 
                        position:'absolute', top:'0', left:'50%', transform:'translateX(-50%)',
                        background:'#d1d5db', // Abu terang
                        color:'#111', 
                        padding:'5px 20px', 
                        borderBottomLeftRadius:'5px', borderBottomRightRadius:'5px',
                        fontSize:'12px', fontWeight:'700'
                    }}>
                        Coming Soon
                    </div>
                )}

                {/* AREA KONTEN ATAS */}
                <div style={{ marginTop: '30px' }}>
                    
                    {/* Kode Event (Kiri Atas) */}
                    <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>
                        {item.code_event || '0101'}
                    </p>
                    
                    {/* Judul Event */}
                    <h3 style={{ fontSize: '22px', fontWeight: '700', lineHeight: '1.2', marginBottom: '25px' }}>
                        {item.nama_event}
                    </h3>
                    
                    {/* Lokasi & Tanggal */}
                    <div style={{ marginBottom:'10px' }}>
                        <p style={{ fontSize: '15px', fontWeight:'600', margin:0 }}>
                            {item.alamat}
                        </p>
                        <p style={{ fontSize: '12px', color: '#ccc', margin:0 }}>
                            {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}
                        </p>
                    </div>
                </div>

                {/* AREA BAWAH (Garis & Tombol) */}
                <div>
                    {/* Garis Horizontal */}
                    <div style={{ height:'1px', background:'white', width:'100%', marginBottom:'20px', opacity:0.8 }}></div>

                    {/* Tombol Action */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        
                        {/* Tombol LIHAT (Text Only) */}
                        <Link href={`/event/${item.id_event}`} style={{ 
                            color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
                            cursor: 'pointer'
                        }}>
                            Lihat
                        </Link>

                        {/* Tombol DAFTAR (Box) */}
                        <a href={`https://wa.me/6281234567890?text=Daftar+${encodeURIComponent(item.nama_event)}`} target="_blank" style={{ 
                            background: '#d1d5db', 
                            color: '#111', 
                            padding: '8px 25px', 
                            borderRadius: '5px', // Request: 5px
                            textAlign: 'center', textDecoration: 'none', fontSize: '14px', fontWeight:'700' 
                        }}>
                            Daftar
                        </a>
                    </div>
                </div>

                </div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
}