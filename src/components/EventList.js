'use client'; 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

// --- 1. KOMPONEN KARTU INTERAKTIF (Dipisah) ---
function HomeEventCard({ item, isComingSoon }) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  return (
    <Link 
      href={`/event/${item.id_event}`} 
      style={{ textDecoration: 'none' }}
    >
      <div 
        // Event Handler KARTU
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        style={{ 
            background: '#1e1e1e', 
            borderRadius: '5px',   
            padding: '25px', 
            color: 'white', 
            position:'relative', 
            minHeight:'380px', 
            display:'flex', 
            flexDirection:'column', 
            justifyContent:'space-between',
            
            // --- ANIMASI INTERAKTIF ---
            border: isCardHovered ? '1px solid #555' : '1px solid #333', 
            transform: isCardHovered ? 'translateY(-10px)' : 'translateY(0)', // Naik
            boxShadow: isCardHovered ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.1)', // Bayangan
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 
            cursor: 'pointer'
        }}
      >
        
        {/* BADGE "Coming Soon" */}
        {isComingSoon(item.tanggal_mulai) && (
            <div style={{ 
                position:'absolute', top:'0', left:'50%', transform:'translateX(-50%)',
                background: isCardHovered ? 'white' : '#d1d5db', // Berubah putih saat hover
                color:'#111', 
                padding:'5px 20px', 
                borderBottomLeftRadius:'5px', borderBottomRightRadius:'5px',
                fontSize:'12px', fontWeight:'700', zIndex: 10,
                transition: 'background 0.3s'
            }}>
                Coming Soon
            </div>
        )}

        {/* AREA KONTEN ATAS */}
        <div style={{ marginTop: '30px' }}>
            
            {/* Kode Event */}
            <p style={{ 
                fontSize: '12px', 
                color: isCardHovered ? 'white' : '#aaa', // Jadi putih saat hover
                marginBottom: '5px',
                transition: 'color 0.3s'
            }}>
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
        <div style={{ marginTop: 'auto' }}> 
            
            {/* Garis Horizontal */}
            <div style={{ 
                height:'1px', background:'white', width:'100%', marginBottom:'20px', 
                opacity: isCardHovered ? 0.5 : 0.3, transition: 'opacity 0.3s' 
            }}></div>

            {/* Tombol Action Container */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                
                {/* Visual Tombol (Interaktif) */}
                <div 
                    // Event Handler TOMBOL
                    onMouseEnter={() => setIsBtnHovered(true)}
                    onMouseLeave={() => setIsBtnHovered(false)}
                    style={{ 
                        // Style berubah saat tombol dihover
                        background: isBtnHovered ? 'transparent' : 'white',           
                        color: isBtnHovered ? 'white' : 'black',
                        border: isBtnHovered ? '2px solid white' : '2px solid white', 
                        
                        fontWeight: '700', 
                        fontSize: '14px',
                        padding: '10px 40px',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        display: 'inline-block',
                        transition: 'all 0.3s ease',
                        boxShadow: isBtnHovered ? '0 0 15px rgba(255,255,255,0.4)' : 'none', // Glow
                        transform: isBtnHovered ? 'scale(1.05)' : 'scale(1)'
                    }}
                >
                    Lihat Detail
                </div>

            </div>
        </div>

      </div>
    </Link>
  );
}

// --- 2. KOMPONEN UTAMA (EventList) ---
export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      // Ambil 4 event terdekat (Sesuai kode asli Anda)
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
            
            // GRID SYSTEM
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px' 
            }}>
            
            {events.map((item) => (
                // Panggil Komponen Kartu di sini
                <HomeEventCard 
                    key={item.id_event} 
                    item={item} 
                    isComingSoon={isComingSoon} 
                />
            ))}

            </div>
        )}
      </div>
    </section>
  );
}