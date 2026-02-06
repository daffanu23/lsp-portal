'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Plus, Edit, Trash2, Calendar, MapPin, Loader2 } from 'lucide-react';

export default function EventDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('tbl_m_event')
      .select('*')
      .order('tanggal_mulai', { ascending: true });

    if (!error) setEvents(data);
    setLoading(false);
  }

  const handleDelete = async (id) => {
    if (!confirm("Hapus event ini?")) return;
    const { error } = await supabase.from('tbl_m_event').delete().eq('id_event', id);
    if (!error) { fetchEvents(); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) return <div style={{ height:'80vh', display:'flex', justifyContent:'center', alignItems:'center', color:'#666', gap:'10px' }}><Loader2 className="animate-spin"/> Memuat Event...</div>;

  return (
    // WRAPPER UTAMA (Padding Top Aman)
    <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
                <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing:'-1px', textTransform:'uppercase' }}>Jadwal Event</h1>
                <p style={{ color: '#666', fontSize:'16px', fontWeight:'500' }}>Kelola jadwal sertifikasi dan lokasi pelaksanaan.</p>
            </div>
            <Link href="/admin/event/add">
                <button style={{ 
                    background: 'black', color: 'white', padding: '15px 30px', borderRadius: '12px', 
                    border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition:'transform 0.2s'
                }}>
                    <Plus size={20} /> Tambah Event
                </button>
            </Link>
        </div>

        {/* CARD TABEL */}
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 5px 30px rgba(0,0,0,0.05)', overflow: 'hidden', border:'1px solid #eee' }}>
            {events.length === 0 ? (
                <div style={{ padding: '80px', textAlign: 'center', color: '#888' }}>Belum ada jadwal event.</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                    <thead style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                        <tr>
                            <th style={{ padding: '25px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px', width:'80px' }}>KODE</th>
                            <th style={{ padding: '25px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>NAMA EVENT</th>
                            <th style={{ padding: '25px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>LOKASI (TUK)</th>
                            <th style={{ padding: '25px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>TANGGAL</th>
                            <th style={{ padding: '25px', textAlign: 'center', width: '150px', color:'#444', fontSize:'12px', letterSpacing:'1px' }}>AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((item) => (
                            <tr key={item.id_event} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                
                                {/* KODE */}
                                <td style={{ padding: '20px', fontWeight:'bold', color:'black' }}>
                                    <span style={{ background:'#eee', padding:'6px 10px', borderRadius:'6px', fontSize:'13px' }}>
                                        {item.code_event}
                                    </span>
                                </td>

                                {/* NAMA EVENT */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#222' }}>{item.nama_event}</div>
                                    <div style={{ fontSize: '13px', color: '#888', marginTop: '5px', display:'flex', alignItems:'center', gap:'5px' }}>
                                        <MapPin size={12}/> {item.alamat}
                                    </div>
                                </td>

                                {/* LOKASI TUK */}
                                <td style={{ padding: '20px', color: '#444', fontWeight:'500' }}>
                                    {item.tuk}
                                </td>

                                {/* TANGGAL PELAKSANAAN */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'#222', fontWeight:'600' }}>
                                        <Calendar size={16} color="#666"/>
                                        {formatDate(item.tanggal_mulai)}
                                    </div>
                                    <div style={{ fontSize:'12px', color:'#888', marginLeft:'24px', marginTop:'4px' }}>
                                        s/d {formatDate(item.tanggal_selesai)}
                                    </div>
                                </td>

                                {/* AKSI */}
                                <td style={{ textAlign: 'center', padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                        <Link href={`/admin/event/edit/${item.id_event}`}>
                                            <button style={{ padding:'8px 12px', borderRadius:'8px', border:'1px solid #ddd', background:'white', cursor:'pointer', color:'#444' }}>
                                                <Edit size={16} />
                                            </button>
                                        </Link>
                                        <button onClick={() => handleDelete(item.id_event)} style={{ padding:'8px 12px', borderRadius:'8px', border:'none', background:'#fee2e2', cursor:'pointer', color:'#ef4444' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}