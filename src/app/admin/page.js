'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [newsList, setNewsList] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // STATE DARK MODE
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function initAdmin() {
      // 1. Cek Login
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      // 2. Load Berita
      fetchNews();

      // 3. Cek Preference Dark Mode dari LocalStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.body.classList.add('dark-mode');
      } else {
        setIsDarkMode(false);
        document.body.classList.remove('dark-mode');
      }
    }
    initAdmin();
  }, [router]);

  // FUNGSI TOGGLE THEME
  const toggleTheme = () => {
    if (isDarkMode) {
      // Ubah ke Light
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      // Ubah ke Dark
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  async function fetchNews() {
    const { data, error } = await supabase
      .from('tbl_m_news')
      .select('*')
      .order('tgl_upload', { ascending: false }); 

    if (error) console.error('Error fetch news:', error);
    else setNewsList(data);
    
    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    try {
      const { error } = await supabase.from('tbl_m_news').delete().eq('id_news', id); 
      if (error) throw error;
      alert("Berita berhasil dihapus.");
      fetchNews(); 
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  if (loading) return <p className="loading" style={{ marginTop: '50px' }}>Memuat Dashboard...</p>;

  return (
    <div className="admin-layout">
      
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h3 style={{ marginBottom: '30px', paddingBottom: '10px', borderBottom: '1px solid #34495e', fontSize:'18px' }}>
          Admin Panel
        </h3>
        
        <nav className="admin-menu" style={{ flex: 1 }}>
            <Link href="/admin" className="active">Dashboard Berita</Link>
            <Link href="/admin/event" className={router.pathname == '/admin/event' ? 'active' : ''}>
                Manajemen Event
            </Link>
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          
          {/* --- TOMBOL DARK MODE (BARU) --- */}
          <button 
            onClick={toggleTheme}
            style={{
                background: 'transparent',
                border: '1px solid #7f8c8d',
                color: '#bdc3c7',
                padding: '10px',
                width: '100%',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '10px',
                fontSize: '13px',
                fontWeight: '500',
                transition: '0.3s'
            }}
            onMouseOver={(e) => { e.target.style.color = 'white'; e.target.style.borderColor = 'white'; }}
            onMouseOut={(e) => { e.target.style.color = '#bdc3c7'; e.target.style.borderColor = '#7f8c8d'; }}
          >
            {isDarkMode ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
          </button>
          {/* ------------------------------- */}

          <p style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '10px', marginTop: '15px' }}>
            User: {user?.email}
          </p>
          <button 
              onClick={handleLogout} 
              className="btn-danger"
              style={{ width: '100%', padding: '10px' }}
          >
              Logout
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="admin-content">
        <div className="section-header">
          <h2>Manajemen Berita</h2>
          
          <Link href="/admin/news/add">
            <button className="btn-fill" style={{ padding: '10px 20px', fontSize:'13px' }}>
               + Tambah Berita
            </button>
          </Link>
        </div>

        {/* TABEL BERITA */}
        <div className="card">
          <div className="card-body" style={{ padding: '0' }}>
            
            {newsList.length === 0 ? (
              <p style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>Belum ada berita yang diupload.</p>
            ) : (
              <table className="table-custom">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>No</th>
                    <th>Judul Berita</th>
                    <th>Tanggal</th>
                    <th>Penulis</th>
                    <th style={{ textAlign: 'center', width:'150px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {newsList.map((item, index) => (
                    <tr key={item.id_news}>
                      <td>{index + 1}</td>
                      <td>
                        <span style={{ fontWeight: '500' }}>{item.tbl_title}</span>
                      </td>
                      <td style={{ fontSize: '13px' }}>
                        {new Date(item.tgl_upload).toLocaleDateString('id-ID')}
                      </td>
                      <td style={{ fontSize: '13px' }}>
                        {item.author || '-'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <Link href={`/admin/news/edit/${item.id_news}`}>
                            <button 
                                className="btn-sm btn-warning"
                                style={{ marginRight: '5px' }} // Kasih jarak dikit sama tombol Hapus
                            >
                                Edit
                            </button>
                            </Link>

                          <button 
                            className="btn-sm btn-danger"
                            onClick={() => handleDelete(item.id_news)}
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