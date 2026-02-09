'use client'; 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

function HomeEventCard({ item, isComingSoon }) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  return (
    <Link 
      href={`/event/${item.id_event}`} 
      style={{ textDecoration: 'none' }}
    >
      <div 
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
            border: isCardHovered ? '1px solid #555' : '1px solid #333', 
            transform: isCardHovered ? 'translateY(-10px)' : 'translateY(0)', // Naik
            boxShadow: isCardHovered ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.1)', // Bayangan
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 
            cursor: 'pointer'
        }}
      >

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

        <div style={{ marginTop: '30px' }}>
            <p style={{ 
                fontSize: '12px', 
                color: isCardHovered ? 'white' : '#aaa', // Jadi putih saat hover
                marginBottom: '5px',
                transition: 'color 0.3s'
            }}>
                {item.code_event || '0101'}
            </p>
            <h3 style={{ fontSize: '22px', fontWeight: '700', lineHeight: '1.2', marginBottom: '25px' }}>
                {item.nama_event}
            </h3>
            <div style={{ marginBottom:'10px' }}>
                <p style={{ fontSize: '15px', fontWeight:'600', margin:0 }}>
                    {item.alamat}
                </p>
                <p style={{ fontSize: '12px', color: '#ccc', margin:0 }}>
                    {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}
                </p>
            </div>
        </div>

        <div style={{ marginTop: 'auto' }}> 
            <div style={{ 
                height:'1px', background:'white', width:'100%', marginBottom:'20px', 
                opacity: isCardHovered ? 0.5 : 0.3, transition: 'opacity 0.3s' 
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div 
                    onMouseEnter={() => setIsBtnHovered(true)}
                    onMouseLeave={() => setIsBtnHovered(false)}
                    style={{ 
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

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
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

  const isComingSoon = (dateStr) => {
    return new Date(dateStr) > new Date();
  };

  return (
    <section style={{ padding: '80px 0', background: '#f5f5f5' }}>
      <div className="container">
        <h2 style={{ 
            textAlign: 'center', marginBottom: '50px', 
            fontWeight: '800', fontSize: '1.8rem', color:'#111', 
            textTransform:'uppercase', letterSpacing:'1px' 
        }}>
            Daftar Skema Sertifikasi
        </h2>

        {loading ? <p style={{textAlign:'center'}}>Memuat jadwal...</p> : (
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px' 
            }}>
            
            {events.map((item) => (
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