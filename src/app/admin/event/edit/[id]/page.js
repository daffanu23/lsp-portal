'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code_event: '',
    nama_event: '',
    deksripsi: '',
    alamat: '',
    tuk: '',
    tanggal_mulai: '',
    tanggal_selesai: ''
  });

  useEffect(() => {
    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      // FETCH pakai 'id_event'
      const { data, error } = await supabase
        .from('tbl_m_event')
        .select('*')
        .eq('id_event', id)
        .single();
        
      if (data) {
        setForm(data);
      } else {
        alert("Data tidak ditemukan");
        router.push('/admin/event');
      }
    }
    getData();
  }, [id, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // UPDATE pakai 'id_event'
      const { error } = await supabase
        .from('tbl_m_event')
        .update(form) // Update semua field yang ada di state form
        .eq('id_event', id);

      if (error) throw error;
      alert("Event berhasil diperbarui.");
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
            <div className="section-header"><h2>Edit Event</h2></div>
            <div className="card">
            <div className="card-body">
                <form onSubmit={handleUpdate}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'20px', marginBottom:'15px' }}>
                        <div className="form-group">
                            <label>Kode Event</label>
                            <input name="code_event" type="text" value={form.code_event} onChange={handleChange} style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                        <div className="form-group">
                            <label>Nama Event</label>
                            <input name="nama_event" type="text" value={form.nama_event} onChange={handleChange} style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Deskripsi</label>
                        <textarea name="deksripsi" rows="3" value={form.deksripsi || ''} onChange={handleChange} style={{ width:'100%', padding:'10px', borderRadius:'6px' }}></textarea>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                        <div className="form-group">
                            <label>Kota</label>
                            <input name="alamat" type="text" value={form.alamat} onChange={handleChange} style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                        <div className="form-group">
                            <label>TUK</label>
                            <input name="tuk" type="text" value={form.tuk} onChange={handleChange} style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'25px' }}>
                        <div className="form-group">
                            <label>Tanggal Mulai</label>
                            <input name="tanggal_mulai" type="date" value={form.tanggal_mulai} onChange={handleChange} style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                        <div className="form-group">
                            <label>Tanggal Selesai</label>
                            <input name="tanggal_selesai" type="date" value={form.tanggal_selesai} onChange={handleChange} style={{ width:'100%', padding:'10px', borderRadius:'6px' }} />
                        </div>
                    </div>

                    <div style={{ display:'flex', gap:'10px' }}>
                        <Link href="/admin/event" className="btn-outline" style={{ textAlign:'center' }}>Batal</Link>
                        <button type="submit" className="btn-fill" disabled={loading} style={{ flex:2 }}>{loading ? 'Menyimpan...' : 'Update Event'}</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
      </main>
    </div>
  );
}