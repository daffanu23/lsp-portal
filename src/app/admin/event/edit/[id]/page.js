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
    tanggal_selesai: '',
    jam_mulai: '',    
    jam_selesai: '',  
    kuota: '',        
    harga: '',        
    persyaratan: ''   
  });

  useEffect(() => {
    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

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
      const { id_event, created_at, sisa_kuota, ...updateData } = form;

      const { error } = await supabase
        .from('tbl_m_event')
        .update(updateData)
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

  const inputStyle = { width:'100%', padding:'10px', borderRadius:'6px', border:'1px solid #ccc' };
  const labelStyle = { display:'block', marginBottom:'5px', fontWeight:'500', fontSize:'14px' };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        <div className="section-header"><h2>Edit Event</h2></div>
        <div className="card">
            <div className="card-body">
            <form onSubmit={handleUpdate}>
                
                <h4 style={{ marginBottom:'15px', color:'#2c3e50', borderBottom:'1px solid #eee', paddingBottom:'5px' }}>Informasi Dasar</h4>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'20px', marginBottom:'15px' }}>
                    <div className="form-group">
                        <label style={labelStyle}>Kode Event</label>
                        <input name="code_event" type="text" value={form.code_event || ''} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelStyle}>Nama Event</label>
                        <input name="nama_event" type="text" value={form.nama_event || ''} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Deskripsi</label>
                    <textarea name="deksripsi" rows="3" value={form.deksripsi || ''} onChange={handleChange} style={inputStyle}></textarea>
                </div>

                <h4 style={{ marginBottom:'15px', marginTop:'25px', color:'#2c3e50', borderBottom:'1px solid #eee', paddingBottom:'5px' }}>Waktu & Tempat</h4>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                    <div className="form-group">
                        <label style={labelStyle}>Kota</label>
                        <input name="alamat" type="text" value={form.alamat || ''} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelStyle}>TUK</label>
                        <input name="tuk" type="text" value={form.tuk || ''} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                    <div className="form-group">
                        <label style={labelStyle}>Tanggal Mulai</label>
                        <input name="tanggal_mulai" type="date" value={form.tanggal_mulai || ''} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelStyle}>Tanggal Selesai</label>
                        <input name="tanggal_selesai" type="date" value={form.tanggal_selesai || ''} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                    <div className="form-group">
                        <label style={labelStyle}>Jam Mulai</label>
                        <input name="jam_mulai" type="time" value={form.jam_mulai || ''} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelStyle}>Jam Selesai</label>
                        <input name="jam_selesai" type="time" value={form.jam_selesai || ''} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <h4 style={{ marginBottom:'15px', marginTop:'25px', color:'#2c3e50', borderBottom:'1px solid #eee', paddingBottom:'5px' }}>Detail Pendaftaran</h4>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                    <div className="form-group">
                        <label style={labelStyle}>Kuota Peserta (Total)</label>
                        <input name="kuota" type="number" min="1" value={form.kuota || ''} onChange={handleChange} style={inputStyle} />
                        <small style={{ color:'#e74c3c', fontStyle:'italic' }}>*Mengubah kuota tidak otomatis mereset sisa kuota.</small>
                    </div>
                    <div className="form-group">
                        <label style={labelStyle}>Harga (Rp)</label>
                        <input name="harga" type="number" min="0" value={form.harga || ''} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '25px' }}>
                    <label style={labelStyle}>Persyaratan</label>
                    <textarea name="persyaratan" rows="5" value={form.persyaratan || ''} onChange={handleChange} style={inputStyle}></textarea>
                </div>

                <div style={{ display:'flex', gap:'10px' }}>
                    <Link href="/admin/event" style={{ padding:'12px 20px', border:'1px solid #ccc', borderRadius:'8px', color:'#333', textDecoration:'none', fontWeight:'bold' }}>
                        Batal
                    </Link>
                    <button type="submit" disabled={loading} style={{ flex:1, padding:'12px', background:'black', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer' }}>
                        {loading ? 'Menyimpan...' : 'Update Event'}
                    </button>
                </div>
            </form>
            </div>
        </div>
    </div>
  );
}