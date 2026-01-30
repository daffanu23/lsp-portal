'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EventDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      fetchEvents();
    }
    init();
  }, [router]);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('tbl_m_event')
      .select('*')
      .order('tanggal_mulai', { ascending: true });

    if (error) console.error(error);
    else setEvents(data);
    
    setLoading(false);
  }

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus event ini?")) return;

    try {
      // PERHATIKAN: Kita pakai 'id_event' sesuai database
      const { error } = await supabase.from('tbl_m_event').delete().eq('id_event', id);
      if (error) throw error;
      alert("Event berhasil dihapus.");
      fetchEvents();
    } catch (err) {
      alert("Gagal: " + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <p className="loading" style={{ marginTop: '50px' }}>Memuat Data Event...</p>;

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h3 style={{ marginBottom: '30px', paddingBottom: '10px', borderBottom: '1px solid #34495e', fontSize:'18px' }}>
          Admin Panel
        </h3>
        <nav className="admin-menu" style={{ flex: 1 }}>
            <Link href="/admin">Dashboard Berita</Link>
            <Link href="/admin/event" className="active">Manajemen Event</Link>
        </nav>
        <div style={{ marginTop: 'auto' }}>
            <p style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '10px' }}>{user?.email}</p>
            <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', padding: '10px' }}>Logout</button>
        </div>
      </aside>

      {/* KONTEN */}
      <main className="admin-content">
        <div className="section-header">
          <h2>Manajemen Jadwal Event</h2>
          <Link href="/admin/event/add">
            <button className="btn-fill" style={{ padding: '10px 20px', fontSize:'13px' }}>
               + Tambah Event
            </button>
          </Link>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: '0' }}>
            {events.length === 0 ? (
              <p style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>Belum ada jadwal event.</p>
            ) : (
              <table className="table-custom">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>No</th>
                    <th>Kode</th>
                    <th>Nama Event</th>
                    <th>TUK (Tempat)</th>
                    <th>Jadwal Pelaksanaan</th>
                    <th style={{ textAlign: 'center', width:'150px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((item, index) => (
                    // KEY pakai id_event
                    <tr key={item.id_event}>
                      <td>{index + 1}</td>
                      <td><span style={{ fontWeight:'bold', color:'var(--primary)' }}>{item.code_event}</span></td>
                      <td>
                        <span style={{ fontWeight: '500', display:'block' }}>{item.nama_event}</span>
                        <span style={{ fontSize:'11px', color:'gray' }}>{item.alamat}</span>
                      </td>
                      <td>{item.tuk}</td>
                      <td style={{ fontSize:'13px' }}>
                        {item.tanggal_mulai} <br/> s/d <br/> {item.tanggal_selesai}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <Link href={`/admin/event/edit/${item.id_event}`}>
                            <button className="btn-sm btn-warning">Edit</button>
                          </Link>
                          <button 
                            className="btn-sm btn-danger"
                            onClick={() => handleDelete(item.id_event)}
                          >
                            Hapus
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
      </main>
    </div>
  );
}