'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function EventList() {
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tbl_m_event')
      .select('*')
      .order('tanggal_mulai', { ascending: true }) 
      .limit(4);

    if (error) console.error(error);
    else setEvents(data);
    
    setLoading(false);
  }

  return (
    <section className="section-light">
      <div className="container">
        <div className="section-header">
          <h2>Event Terdekat</h2>
          <Link href="/search" className="view-all">Lihat Semua Event &rarr;</Link>
        </div>

        <div id="event-container" className="grid-4">
          {loading && <p className="loading">Sedang memuat jadwal...</p>}
          {!loading && events.length === 0 && <p>Tidak ada event mendatang.</p>}

          {events.map((item) => (
            <div className="card" key={item.id_event}>
              <div className="card-body">
                {/* Kode Event */}
                <span style={{
                  background:'#e0f2fe', color:'#0284c7', padding:'4px 10px', 
                  borderRadius:'4px', fontSize:'11px', alignSelf:'start', 
                  fontWeight:'600', marginBottom:'12px', display:'inline-block'
                }}>
                  {item.code_event}
                </span>

                <h3 style={{ fontSize:'18px', margin:'0 0 10px', fontWeight:'600' }}>
                    {item.nama_event}
                </h3>
                
                <p style={{ fontSize:'13px', marginBottom:'4px', color:'#666', fontWeight:'500' }}>
                   {item.alamat}
                </p>
                <p style={{ fontSize:'13px', color:'#d32f2f', fontWeight:'600' }}>
                   {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                
                {/* --- 2 TOMBOL (Fix Hover) --- */}
                <div className="btn-group" style={{ display:'flex', gap:'10px', marginTop:'auto', paddingTop:'20px' }}>
                  
                  {/* Tombol Daftar (Biru) */}
                  <a 
                    href={`https://wa.me/6281234567890?text=Halo+Admin,+saya+tertarik+event+${encodeURIComponent(item.nama_event)}`}
                    target="_blank"
                    className="btn-fill"
                    style={{ textDecoration:'none', transition: '0.3s', flex: 1 }}
                  >
                    Daftar Sekarang
                  </a>

                  {/* Tombol Lihat Skema (Putih) */}
                  <Link 
                    href={`/event/${item.id_event}`} 
                    className="btn-outline"
                    style={{ 
                        flex:1, 
                        padding:'10px', 
                        borderRadius:'8px', 
                        fontSize:'13px', 
                        fontWeight:'500', 
                        // background:'transparent', <-- SUDAH SAYA HAPUS!
                        textAlign: 'center', 
                        textDecoration: 'none',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center'
                    }}
                  >
                    Lihat Skema
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}