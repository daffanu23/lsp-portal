'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AddEventPage() {
  const router = useRouter();
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
      const payload = {
        ...form,
        sisa_kuota: form.kuota 
      };

      const { error } = await supabase.from('tbl_m_event').insert([payload]);

      if (error) throw error;
      alert("Event berhasil ditambahkan.");
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
        <div className="section-header"><h2>Tambah Event Baru</h2></div>
        
        <div className="card">
            <div className="card-body">
            <form onSubmit={handleSubmit}>
                
                <h4 style={{ marginBottom:'15px', color:'#2c3e50', borderBottom:'1px solid #eee', paddingBottom:'5px' }}>Informasi Dasar</h4>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'20px', marginBottom:'15px' }}>
                    <div className="form-group">
                        <label style={labelStyle}>Kode Event</label>
                        <input name="code_event" type="text" onChange={handleChange} placeholder="WEB-001" required style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelStyle}>Nama Event</label>
                        <input name="nama_event" type="text" onChange={handleChange} placeholder="Sertifikasi Web Developer" required style={inputStyle} />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Deskripsi Singkat</label>
                    <textarea name="deksripsi" rows="3" onChange={handleChange} placeholder="Jelaskan detail event..." style={inputStyle}></textarea>
                </div>

                <h4 style={{ marginBottom:'15px', marginTop:'25px', color:'#2c3e50', borderBottom:'1px solid #eee', paddingBottom:'5px' }}>Waktu & Tempat</h4>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                    <div className="form-group">
                        <label style={labelStyle}>Kota / Lokasi</label>
                        <input name="alamat" type="text" onChange={handleChange} placeholder="Jakarta" required style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelStyle}>TUK (Tempat Uji)</label>
                        <input name="tuk" type="text" onChange={handleChange} placeholder="Gedung Serbaguna Lt. 2" required style={inputStyle} />
                    </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                    <div>
                        <label style={labelStyle}>Tanggal Mulai</label>
                        <input name="tanggal_mulai" type="date" onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Tanggal Selesai</label>
                        <input name="tanggal_selesai" type="date" onChange={handleChange} required style={inputStyle} />
                    </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                    <div>
                        <label style={labelStyle}>Jam Mulai</label>
                        <input name="jam_mulai" type="time" onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Jam Selesai</label>
                        <input name="jam_selesai" type="time" onChange={handleChange} required style={inputStyle} />
                    </div>
                </div>

                <h4 style={{ marginBottom:'15px', marginTop:'25px', color:'#2c3e50', borderBottom:'1px solid #eee', paddingBottom:'5px' }}>Detail Pendaftaran</h4>
                
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px' }}>
                    <div className="form-group">
                        <label style={labelStyle}>Kuota Peserta</label>
                        <input name="kuota" type="number" min="1" onChange={handleChange} placeholder="Contoh: 100" required style={inputStyle} />
                    </div>
                    <div className="form-group">
                        <label style={labelStyle}>Harga (Rp)</label>
                        <input name="harga" type="number" min="0" onChange={handleChange} placeholder="0 jika gratis" required style={inputStyle} />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '25px' }}>
                    <label style={labelStyle}>Persyaratan (Pisahkan dengan Enter/Baris baru)</label>
                    <textarea name="persyaratan" rows="5" onChange={handleChange} placeholder="- KTP&#10;- Ijazah&#10;- Pas Foto" style={inputStyle}></textarea>
                </div>

                <div style={{ display:'flex', gap:'15px' }}>
                    <button 
                        type="button"
                        onClick={() => router.push('/admin/event')}
                        className="btn-outline"
                        style={{ textAlign:'center', padding: '12px 20px', borderRadius:'8px', border:'1px solid #ccc', background:'white', cursor:'pointer' }}
                    >
                        Batal
                    </button>
                    <button 
                        type="submit" 
                        className="btn-fill" 
                        disabled={loading} 
                        style={{ flex: 2, padding:'15px', fontSize:'16px', fontWeight:'bold', background:'black', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' }}
                    >
                        {loading ? 'Menyimpan Data...' : 'Simpan Event Baru'}
                    </button>
                </div>

            </form>
            </div>
        </div>
    </div>
  );
}