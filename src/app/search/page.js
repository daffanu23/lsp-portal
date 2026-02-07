'use client';

import { useEffect, useState, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; 
import Link from 'next/link';

// --- KOMPONEN KARTU INTERAKTIF ---
function EventCard({ item }) {
  // Kita pisah state hover-nya
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const isComingSoon = new Date(item.tanggal_mulai) > new Date();

  return (
    <Link 
      href={`/event/${item.id_event}`} 
      style={{ textDecoration: 'none' }} 
    >
      <div 
        // Event Handler untuk KARTU
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        style={{ 
            background: '#1e1e1e', 
            borderRadius: '16px',
            padding: '25px',
            color: 'white', 
            position: 'relative', 
            minHeight: '400px',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: isCardHovered ? '1px solid #555' : '1px solid #333', 
            
            // Animasi Kartu Naik (Lift Up)
            transform: isCardHovered ? 'translateY(-10px)' : 'translateY(0)', 
            boxShadow: isCardHovered ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.15)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 
            cursor: 'pointer'
        }}
      >
          
          {/* BADGE "Coming Soon" */}
          {isComingSoon && (
              <div style={{ 
                  position:'absolute', top:'0', left:'50%', transform:'translateX(-50%)',
                  background: isCardHovered ? 'white' : '#d1d5db', 
                  color:'#111', 
                  padding:'5px 20px', 
                  borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px',
                  fontSize:'12px', fontWeight:'700', zIndex: 10,
                  transition: 'background 0.3s'
              }}>
                  Coming Soon
              </div>
          )}

          {/* BAGIAN ATAS KARTU */}
          <div style={{ marginTop: '20px' }}>
              
              {/* Kode Event */}
              <div style={{ 
                  fontSize:'12px', color: isCardHovered ? 'white' : '#aaa', marginBottom:'10px', 
                  background:'rgba(255,255,255,0.1)', padding:'4px 10px', 
                  borderRadius:'6px', display:'inline-block', transition: 'color 0.3s'
              }}>
                  {item.code_event || 'CODE'}
              </div>

              {/* Judul Event */}
              <h3 style={{ fontSize: '22px', fontWeight: '700', lineHeight: '1.4', marginBottom: '20px', minHeight: '60px' }}>
                  {item.nama_event}
              </h3>
              
              {/* Lokasi & Tanggal */}
              <div style={{ marginBottom:'10px' }}>
                  <p style={{ fontSize: '15px', fontWeight:'600', margin:'0 0 5px 0' }}>
                    {item.alamat}
                  </p>
                  <p style={{ fontSize: '13px', color: '#ccc', margin:0 }}>
                    {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}
                  </p>
              </div>
          </div>

          {/* BAGIAN BAWAH KARTU (Tombol) */}
          <div style={{ marginTop: 'auto' }}>
             
             {/* Garis Horizontal */}
             <div style={{ height:'1px', background:'white', width:'100%', marginBottom:'20px', opacity: isCardHovered ? 0.5 : 0.2, transition: 'opacity 0.3s' }}></div>

             {/* Tombol Action Container */}
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                
                {/* Visual Tombol */}
                <div 
                    // Event Handler KHUSUS TOMBOL
                    onMouseEnter={() => setIsBtnHovered(true)}
                    onMouseLeave={() => setIsBtnHovered(false)}
                    style={{ 
                        // Logika Style: Berubah hanya jika tombol di-hover (isBtnHovered)
                        background: isBtnHovered ? 'transparent' : 'white',           
                        color: isBtnHovered ? 'white' : 'black',
                        border: isBtnHovered ? '2px solid white' : '2px solid white', 
                        
                        fontWeight: '700', 
                        fontSize: '14px',
                        padding: '10px 50px',
                        borderRadius: '50px',
                        display: 'inline-block',
                        transition: 'all 0.3s ease', 
                        // Glow effect hanya muncul saat tombol di-hover
                        boxShadow: isBtnHovered ? '0 0 20px rgba(255,255,255,0.6)' : 'none',
                        transform: isBtnHovered ? 'scale(1.05)' : 'scale(1)' // Sedikit membesar saat dihover
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

// ------------------------------------------------------------------

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

  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* HEADER HALAMAN */}
      <div style={{ 
          background: 'white', 
          paddingTop: '120px', 
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
              <p>Tidak ada jadwal yang cocok.</p>
           </div>
        )}

        {/* GRID KARTU */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '30px'
        }}>
          
          {results.map((item) => (
            <EventCard key={item.id_event} item={item} />
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
      <Suspense fallback={<div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>Loading Search...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </main>
  );
}