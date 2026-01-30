'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State Form Lengkap Sesuai DB
  const [form, setForm] = useState({
    code_event: '',
    nama_event: '',
    deksripsi: '', // Ikuti typo di database
    alamat: '',
    tuk: '',
    tanggal_mulai: '',
    tanggal_selesai: ''
  });

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
    }
    check();
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('tbl_m_event').insert([form]); // Insert object form langsung

      if (error) throw error;
      alert("Event berhasil ditambahkan.");
      router.push('/admin/event');
    } catch (error) {
      alert("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3 style={{ marginBottom: '30px', paddingBottom: '10px', borderBottom: '1px solid #34495e', fontSize:'18px' }}>Admin Panel</h3>
        <nav className="admin-menu"><Link href="/admin/event">Kembali ke List</Link></nav>
      </aside>

      <main className="admin-content">
        <div className="container" style={{ maxWidth: '700px', margin: '0' }}>
            <div className="section-header"><h2>Tambah Event Baru</h2></div>
            <div className="card">
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    
                    {/* Baris 1: Kode & Nama */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'20px', marginBottom:'15px' }}>
                        <div className="form-group">
                            <label>Kode Event</label>
                            <input name="code_event" type="text" onChange={handleChange} placeholder="WEB-001" required style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                        <div className="form-group">
                            <label>Nama Event</label>
                            <input name="nama_event" type="text" onChange={handleChange} placeholder="Sertifikasi Web Developer" required style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Deskripsi Singkat</label>
                        <textarea name="deksripsi" rows="3" onChange={handleChange} placeholder="Keterangan event..." style={{ width:'100%', padding:'10px', borderRadius:'6px' }}></textarea>
                    </div>

                    {/* Baris 2: Lokasi & TUK */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                        <div className="form-group">
                            <label>Kota / Lokasi</label>
                            <input name="alamat" type="text" onChange={handleChange} placeholder="Jakarta" required style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                        <div className="form-group">
                            <label>TUK (Tempat Uji)</label>
                            <input name="tuk" type="text" onChange={handleChange} placeholder="Univ Indonesia" required style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                    </div>

                    {/* Baris 3: Tanggal */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'25px' }}>
                        <div className="form-group">
                            <label>Tanggal Mulai</label>
                            <input name="tanggal_mulai" type="date" onChange={handleChange} required style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                        <div className="form-group">
                            <label>Tanggal Selesai</label>
                            <input name="tanggal_selesai" type="date" onChange={handleChange} required style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn-fill" disabled={loading} style={{ width:'100%', padding:'12px', fontSize:'14px' }}>
                        {loading ? 'Menyimpan...' : 'Simpan Event'}
                    </button>
                </form>
            </div>
            </div>
        </div>
      </main>
    </div>
  );
}