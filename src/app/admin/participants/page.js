'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Users, Calendar, ArrowRight, Loader2, Ticket } from 'lucide-react';

export default function AdminParticipantsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventsWithCount();
  }, []);

  async function fetchEventsWithCount() {
    setLoading(true);

    try {
        // 1. Ambil SEMUA Event
        const { data: eventsData, error: errEvent } = await supabase
            .from('tbl_m_event')
            .select('*')
            .order('tanggal_mulai', { ascending: false });
        
        if (errEvent) throw errEvent;

        // 2. Ambil SEMUA Registrasi (Hanya kolom id_event saja biar ringan)
        const { data: regData, error: errReg } = await supabase
            .from('tbl_registrasi')
            .select('id_event');

        if (errReg) throw errReg;

        // 3. LOGIKA HITUNG MANUAL (Jantungnya ada di sini)
        // Kita gabungkan data event dengan jumlah pendaftarnya
        const formatted = eventsData.map(ev => {
            // Hitung berapa kali id_event muncul di tabel registrasi
            const jumlahPendaftar = regData.filter(r => r.id_event === ev.id_event).length;
            
            return {
                ...ev,
                total_pendaftar: jumlahPendaftar // <--- Ini variabel buatan kita
            };
        });

        setEvents(formatted);

    } catch (error) {
        console.error("Gagal memuat data:", error.message);
    } finally {
        setLoading(false);
    }
  }

  if (loading) return <div style={{ height:'80vh', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', color:'#666' }}><Loader2 className="animate-spin"/> Memuat Data Peserta...</div>;

  return (
    <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing:'-1px', textTransform:'uppercase' }}>Data Peserta</h1>
          <p style={{ color: '#666', fontSize:'16px', fontWeight:'500' }}>Monitor jumlah pendaftar per skema sertifikasi.</p>
      </div>

      {/* LIST EVENT CARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {events.map((item) => (
              <div key={item.id_event} style={{ background: 'white', borderRadius: '16px', border: '1px solid #eee', padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  
                  <div>
                      <div style={{ marginBottom:'15px', display:'flex', justifyContent:'space-between', alignItems:'start' }}>
                          <span style={{ background:'#f3f4f6', padding:'5px 10px', borderRadius:'6px', fontSize:'12px', fontWeight:'bold', color:'#444' }}>
                              {item.code_event || 'CODE'}
                          </span>
                          {/* Status Kuota Visual */}
                          <span style={{ fontSize:'12px', fontWeight:'bold', color: item.sisa_kuota > 0 ? '#16a34a' : '#dc2626' }}>
                              {item.sisa_kuota > 0 ? 'Kuota Tersedia' : 'Kuota Penuh'}
                          </span>
                      </div>
                      
                      <h3 style={{ fontSize:'18px', fontWeight:'800', marginBottom:'10px', lineHeight:'1.4', minHeight:'50px' }}>
                          {item.nama_event}
                      </h3>
                      
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'#666', fontSize:'13px', marginBottom:'20px' }}>
                          <Calendar size={14} />
                          {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}
                      </div>
                  </div>

                  {/* FOOTER CARD: Statistik & Tombol */}
                  <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:'20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div>
                          <p style={{ margin:0, fontSize:'12px', color:'#888', textTransform:'uppercase', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px' }}>
                            <Ticket size={12}/> Total Pendaftar
                          </p>
                          <div style={{ fontSize:'24px', fontWeight:'900', color:'black', display:'flex', alignItems:'center', gap:'8px', marginTop:'5px' }}>
                              <Users size={20} color="#444"/>
                              {/* Ini angka yang tadi error, sekarang harusnya aman */}
                              {item.total_pendaftar}
                              
                              <span style={{ fontSize:'12px', color:'#aaa', fontWeight:'normal' }}>
                                / {item.kuota + item.total_pendaftar} {/* Opsional: Estimasi Total Kuota Awal */}
                              </span>
                          </div>
                      </div>

                      <Link href={`/admin/participants/${item.id_event}`}>
                          <button style={{ 
                              background:'black', color:'white', border:'none', width:'40px', height:'40px', borderRadius:'50%', 
                              display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'transform 0.2s',
                              boxShadow:'0 4px 10px rgba(0,0,0,0.2)'
                          }}>
                              <ArrowRight size={20} />
                          </button>
                      </Link>
                  </div>

              </div>
          ))}
      </div>
    </div>
  );
}