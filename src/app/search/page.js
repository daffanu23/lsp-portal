'use client';

import { useEffect, useState, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; 
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  
  const filterNama = searchParams.get('nama');
  const filterLokasi = searchParams.get('lokasi');
  const filterTanggal = searchParams.get('tanggal');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      
      let query = supabase.from('tbl_m_event').select('*');

      // Filter Logic (Case Insensitive)
      if (filterNama) query = query.ilike('nama_event', `%${filterNama}%`); 
      if (filterLokasi) query = query.ilike('alamat', `%${filterLokasi}%`);
      if (filterTanggal) query = query.eq('tanggal_mulai', filterTanggal);

      const { data, error } = await query;

      if (error) {
        console.error(error);
      } else {
        setResults(data);
      }
      setLoading(false);
    }

    fetchSearchResults();
  }, [filterNama, filterLokasi, filterTanggal]);

  return (
    // CONTAINER UTAMA: Dipaksa rata kiri (textAlign: left) dan lebar full
    <div className="container" style={{ 
        marginTop: '50px', 
        marginBottom: '100px', 
        flex: 1, 
        width: '100%', 
        maxWidth: '1200px', 
        textAlign: 'left',   // <-- PAKSA RATA KIRI
        alignSelf: 'center'  // <-- Agar container tetap di tengah layar
    }}>
      
      <h2 style={{ marginBottom: '20px', textAlign: 'left' }}>
        Hasil Pencarian: {results.length} Event Ditemukan
      </h2>
      
      <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'underline', marginBottom: '30px', display: 'inline-block' }}>
        &larr; Kembali / Reset Pencarian
      </Link>

      {/* GRID SYSTEM: Dipaksa Grid 4 Kolom */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Logika Grid 4 Responsif
          gap: '25px',
          width: '100%',
          justifyContent: 'start' // Pastikan item mulai dari kiri
      }}>
        
        {loading && <p>Sedang mencari...</p>}
        
        {!loading && results.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '12px', color: 'gray' }}>
            Tidak ada jadwal yang cocok dengan filter kamu.
          </p>
        )}

        {results.map((item) => (
          <div className="card" key={item.id_event} style={{ display:'flex', flexDirection:'column' }}>
            <div className="card-body" style={{ flex:1, display:'flex', flexDirection:'column' }}>
              
              {/* Kode Event */}
              <span style={{
                background:'#e0f2fe', color:'#0284c7', padding:'4px 10px', 
                borderRadius:'4px', fontSize:'11px', alignSelf:'start', 
                fontWeight:'600', marginBottom:'12px', display:'inline-block'
              }}>
                {item.code_event}
              </span>

              {/* Judul Event */}
              <h3 style={{ fontSize:'18px', margin:'0 0 10px', fontWeight:'600' }}>
                  {item.nama_event}
              </h3>
              
              {/* Lokasi */}
              <p style={{ fontSize:'13px', marginBottom:'4px', color:'#666', fontWeight:'500' }}>
                 {item.alamat}
              </p>
              {/* Tanggal */}
              <p style={{ fontSize:'13px', color:'#d32f2f', fontWeight:'600' }}>
                 {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              
              {/* --- 2 TOMBOL (Fix Hover & Sejajar) --- */}
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
                    // Background dihapus agar hover CSS jalan
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
  );
}

export default function SearchPage() {
  return (
    <main style={{ display:'flex', flexDirection:'column', minHeight:'100vh', width:'100%' }}>
      <Navbar />
      <Suspense fallback={<div className="container" style={{ marginTop:'100px', textAlign:'center' }}>Loading Search...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </main>
  );
}