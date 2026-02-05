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

      if (filterNama) query = query.ilike('nama_event', `%${filterNama}%`); 
      if (filterLokasi) query = query.ilike('alamat', `%${filterLokasi}%`);
      if (filterTanggal) query = query.eq('tanggal_mulai', filterTanggal);

      const { data, error } = await query;

      if (error) {
        console.error(error);
      } else {
        setResults(data || []);
      }
      setLoading(false);
    }

    fetchSearchResults();
  }, [filterNama, filterLokasi, filterTanggal]);

  // Fungsi cek apakah tanggal > hari ini (untuk badge)
  const isComingSoon = (dateStr) => new Date(dateStr) > new Date();

  return (
    // Background Halaman Putih Abu (Sesuai area "Daftar Skema" di Home-Page.jpg)
    <div style={{ background: '#f4f4f4', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* HEADER HALAMAN (Simple White) */}
      <div style={{ 
          background: 'white', 
          paddingTop: '120px', // Jarak dari navbar fixed
          paddingBottom: '40px', 
          marginBottom: '50px',
          borderBottom: '1px solid #ddd',
          textAlign: 'center'
      }}>
        <div className="container">
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111', margin: 0 }}>
                Hasil Pencarian
            </h1>
            <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>
                Menampilkan {results.length} skema sertifikasi yang tersedia
            </p>
        </div>
      </div>

      <div className="container">
        
        {/* Loading / Empty State */}
        {loading && <p style={{textAlign:'center'}}>Sedang memuat data...</p>}
        {!loading && results.length === 0 && (
           <div style={{ textAlign:'center', padding:'50px', color:'#888' }}>
              <img src="/material-symbols search.svg" alt="Empty" style={{ width:'40px', opacity:0.3, marginBottom:'10px' }} />
              <p>Tidak ada jadwal yang cocok.</p>
           </div>
        )}

        {/* GRID KARTU (Layout Grid Responsif) */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '30px'
        }}>
          
          {results.map((item) => (
            <div key={item.id_event} style={{ 
                background: '#1e1e1e', // Background Gelap
                borderRadius: '5px',   // Radius sedikit (kotak tegas)
                padding: '25px',
                color: 'white', 
                position: 'relative', 
                minHeight: '380px', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}>
              
              {/* BADGE "Coming Soon" (Posisi Tengah Atas) */}
              {isComingSoon(item.tanggal_mulai) && (
                  <div style={{ 
                      position:'absolute', top:'0', left:'50%', transform:'translateX(-50%)',
                      background:'#d1d5db', // Abu terang
                      color:'#111', 
                      padding:'5px 20px', 
                      borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px',
                      fontSize:'12px', fontWeight:'700'
                  }}>
                      Coming Soon
                  </div>
              )}

              {/* BAGIAN ATAS KARTU */}
              <div style={{ marginTop: '30px' }}> {/* Margin top agar tidak nabrak badge */}
                  
                  {/* Kode Event (Kiri Atas) */}
                  <div style={{ fontSize:'12px', color:'#aaa', marginBottom:'5px' }}>
                      {item.code_event || '0101'}
                  </div>

                  {/* Judul Event */}
                  <h3 style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.2', marginBottom: '30px' }}>
                      {item.nama_event}
                  </h3>
                  
                  {/* Lokasi & Tanggal */}
                  <div style={{ marginBottom:'10px' }}>
                      <p style={{ fontSize: '16px', fontWeight:'600', margin:0 }}>
                        {item.alamat}
                      </p>
                      <p style={{ fontSize: '13px', color: '#ccc', margin:0 }}>
                        {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}
                      </p>
                  </div>
              </div>

              {/* BAGIAN BAWAH KARTU */}
              <div>
                 {/* Garis Horizontal Putih */}
                 <div style={{ height:'1px', background:'white', width:'100%', marginBottom:'20px', opacity:0.8 }}></div>

                 {/* Tombol Action (Lihat & Daftar) */}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    {/* Tombol LIHAT (Teks Saja) */}
                    <Link href={`/event/${item.id_event}`} style={{ 
                        color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
                        cursor: 'pointer'
                    }}>
                        Lihat
                    </Link>

                    {/* Tombol DAFTAR (Kotak Putih/Abu) */}
                    <a 
                      href={`https://wa.me/6281234567890?text=Daftar+${encodeURIComponent(item.nama_event)}`}
                      target="_blank"
                      style={{ 
                        background: '#d1d5db', // Warna tombol sesuai gambar (abu terang)
                        color: '#111', 
                        padding: '8px 25px', 
                        borderRadius: '6px', 
                        textDecoration: 'none', 
                        fontWeight: '700', 
                        fontSize: '14px' 
                      }}
                    >
                        Daftar
                    </a>

                 </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main>
      <Navbar />
      
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </main>
  );
}