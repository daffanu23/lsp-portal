'use client';

import { useEffect, useState, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
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

      if (filterNama) query = query.eq('nama_event', filterNama);
      if (filterLokasi) query = query.eq('alamat', filterLokasi);
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
    <div className="container" style={{ marginTop: '50px', marginBottom: '100px' }}>
      <h2 style={{ marginBottom: '20px' }}>
        Hasil Pencarian: {results.length} Event Ditemukan
      </h2>
      
      <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'underline', marginBottom: '30px', display: 'inline-block' }}>
        &larr; Kembali / Reset Pencarian
      </Link>

      <div className="grid-4">
        {loading && <p>Sedang mencari...</p>}
        
        {!loading && results.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '12px' }}>
            Tidak ada jadwal yang cocok dengan filter kamu.
          </p>
        )}

        {results.map((item) => (
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

              {/* Judul Event */}
              <h3 style={{ fontSize:'18px', margin:'0 0 10px', fontWeight:'600' }}>
                  {item.nama_event}
              </h3>
              
              {/* Lokasi (Clean No Emote) */}
              <p style={{ fontSize:'13px', marginBottom:'4px', color:'#666', fontWeight:'500' }}>
                 {item.alamat}
              </p>
              {/* Tanggal (Clean No Emote) */}
              <p style={{ fontSize:'13px', color:'#d32f2f', fontWeight:'600' }}>
                 {item.tanggal_mulai}
              </p>
              
              {/* --- 2 TOMBOL BARU --- */}
              <div className="btn-group" style={{ display:'flex', gap:'10px', marginTop:'auto', paddingTop:'20px' }}>
                
                {/* Tombol Daftar */}
                <a 
                  href={`https://wa.me/6281234567890?text=Halo+Admin,+saya+tertarik+event+${encodeURIComponent(item.nama_event)}`}
                  target="_blank"
                  className="btn-fill"
                  style={{ textDecoration:'none' }}
                >
                  Daftar Sekarang
                </a>

                {/* Tombol Skema */}
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
  );
}

export default function SearchPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="container">Loading Search...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}