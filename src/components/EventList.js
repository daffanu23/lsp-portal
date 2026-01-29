'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

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
          <a href="#" className="view-all">Lihat Semua Event &rarr;</a>
        </div>

        <div id="event-container" className="grid-4">
          {loading && <p className="loading">Sedang memuat jadwal...</p>}
          {!loading && events.length === 0 && <p>Tidak ada event mendatang.</p>}

          {events.map((item) => (
            <div className="card" key={item.id}>
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
                   {item.tanggal_mulai}
                </p>
                
                {/* 2 TOMBOL SEJAJAR */}
                <div className="btn-group" style={{ display:'flex', gap:'10px', marginTop:'auto', paddingTop:'20px' }}>
                  
                  {/* Tombol Daftar (Biru) */}
                  <a 
                    href={`https://wa.me/6281234567890?text=Halo+Admin,+saya+tertarik+event+${encodeURIComponent(item.nama_event)}`}
                    target="_blank"
                    className="btn-fill"
                    style={{ textDecoration:'none', transition: '0.3s' }} // Tambah transisi
                  >
                    Daftar Sekarang
                  </a>

                  {/* Tombol Skema (Putih) - Style background dihapus biar CSS jalan */}
                  <button 
                    className="btn-outline"
                    onClick={() => alert('Fitur Skema Coming Soon!')}
                  >
                    Lihat Skema
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}