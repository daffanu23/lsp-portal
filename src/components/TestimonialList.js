'use client'; 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TestimonialList() {
  const [testis, setTestis] = useState([]);

  useEffect(() => {
    async function fetchTesti() {
      // Mengambil data dari tbl_m_testimoni (Pastikan nama tabel benar di kode Supabase Anda, di SQL namanya tbl_m_testimoni)
      const { data, error } = await supabase
        .from('tbl_m_testimoni') 
        .select('*')
        .limit(3);
        
      if(error) console.log("Error fetch testimoni:", error);
      setTestis(data || []);
    }
    fetchTesti();
  }, []);

  return (
    <section style={{ padding: '80px 0', background: '#f5f5f5' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontWeight: '800', fontSize: '1.8rem', color:'#111', textTransform:'uppercase', letterSpacing:'1px' }}>
            Testimonials
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          {testis.map((item) => (
            <div key={item.id} style={{ 
                background: '#1f1f1f', padding: '40px', color: 'white', 
                minHeight: '320px', display:'flex', flexDirection:'column', justifyContent:'space-between' 
            }}>
               
               {/* Isi Testimoni */}
               <h3 style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1.4', marginBottom:'20px' }}>
                  "{item.isi_testimoni}"
               </h3>

               {/* Info User */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #444', paddingTop: '20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      {/* Foto User (Jika kosong pakai icon User (1).svg) */}
                      <img 
                        src={item.testimoni_pict || '/User (1).svg'} 
                        alt={item.nama} 
                        style={{ width:'24px', height:'24px', borderRadius:'50%', objectFit:'cover', filter: item.testimoni_pict ? 'none' : 'invert(1)' }} 
                        onError={(e) => {e.target.src='/User (1).svg'; e.target.style.filter='invert(1)'}}
                      />
                      <span style={{ fontSize:'12px', fontWeight:'600', textTransform:'uppercase' }}>{item.nama}</span>
                  </div>
                  
                  {/* Tempat Kerja (Sesuai Request) */}
                  <span style={{ fontSize:'10px', color:'#888' }}>
                      {item.tmpt_kerja}
                  </span>
               </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}