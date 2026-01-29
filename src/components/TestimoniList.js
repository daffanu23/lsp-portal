'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TestimoniList() {
  const [testimoni, setTestimoni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimoni() {
      // Logic ambil data: 3 Terbaru
      const { data, error } = await supabase
        .from('tbl_m_testimoni')
        .select('*')
        .order('created_at', { ascending: false }) // Urutkan dari yang terbaru
        .limit(3);

      if (data) setTestimoni(data);
      setLoading(false);
    }
    
    fetchTestimoni();
  }, []);

  return (
    <section className="section-light">
      <div className="container">
        <div className="section-header center" style={{ textAlign:'center', marginBottom:'40px' }}>
          <h2>Apa Kata Alumni?</h2>
          <p>Pengalaman mereka yang telah tersertifikasi.</p>
        </div>

        <div className="grid-3">
          {loading && <p className="loading">Memuat testimoni...</p>}
          
          {testimoni.map((item) => (
            <div className="card" key={item.id} style={{ textAlign:'center', padding:'30px' }}>
              
              {/* Foto Profil Bulat */}
              <img 
                src={item.testimoni_pict || 'https://placehold.co/100?text=User'} 
                alt={item.nama}
                style={{ 
                    width:'80px', height:'80px', borderRadius:'50%', 
                    objectFit:'cover', margin:'0 auto 15px', 
                    border:'3px solid var(--primary)' 
                }} 
              />
              
              {/* Nama & Pekerjaan */}
              <h3 style={{ fontSize:'18px' }}>{item.nama}</h3>
              <p style={{ fontSize:'12px', color:'var(--primary)', fontWeight:'bold', textTransform:'uppercase', marginBottom:'15px' }}>
                {item.tmpt_kerja}
              </p>
              
              {/* Isi Testimoni */}
              <p style={{ fontStyle:'italic', fontSize:'14px', color:'#555' }}>
                "{item.isi_testimoni}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}