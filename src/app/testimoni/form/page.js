'use client'; // Wajib karena ada interaksi form & upload

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation'; // Untuk pindah halaman otomatis
import Navbar from '@/components/Navbar'; // Biar ada header
import Link from 'next/link';

export default function TestimoniForm() {
  const router = useRouter(); // Hook untuk redirect
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // State untuk menampung inputan
  const [formData, setFormData] = useState({
    nama: '',
    kerja: '',
    pesan: ''
  });
  const [file, setFile] = useState(null);

  // Fungsi saat user mengetik
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi saat user pilih file
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // --- LOGIKA UTAMA: SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload browser standar
    
    // 1. Validasi
    if (!formData.nama || !formData.kerja || !formData.pesan || !file) {
      alert("Mohon lengkapi semua data dan upload foto!");
      return;
    }

    setLoading(true);
    setStatusMsg("Mengupload gambar...");

    try {
      // 2. Upload ke Supabase Storage (Bucket: profile_pict)
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('profile_pict') // Pastikan nama bucket benar
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 3. Ambil URL Publik
      const { data: urlData } = supabase
        .storage
        .from('profile_pict')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      setStatusMsg("Menyimpan ke database...");

      // 4. Simpan ke Database
      const { error: dbError } = await supabase
        .from('tbl_m_testimoni')
        .insert({
          nama: formData.nama,
          tmpt_kerja: formData.kerja,
          isi_testimoni: formData.pesan,
          testimoni_pict: publicUrl 
        });

      if (dbError) throw dbError;

      // 5. Sukses
      alert("Testimoni berhasil dikirim!");
      router.push('/'); // Redirect otomatis ke Home

    } catch (error) {
      console.error(error);
      setStatusMsg("Gagal: " + error.message);
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />

      <div className="container" style={{ marginTop: '50px', maxWidth: '600px' }}>
        <div className="card">
          <div className="card-body">
            <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--primary)' }}>
              Bagikan Pengalamanmu
            </h2>
            <p style={{ textAlign: 'center', color: 'gray', marginBottom: '30px' }}>
              Ceritakan pengalaman serumu mengikuti sertifikasi di sini.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Input Nama */}
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Budi Santoso" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>

              {/* Input Tempat Kerja */}
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Instansi / Tempat Kerja</label>
                <input 
                  type="text" 
                  name="kerja"
                  value={formData.kerja}
                  onChange={handleChange}
                  placeholder="Contoh: Universitas Merdeka" 
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>

              {/* Input Foto */}
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Foto Profil</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>

              {/* Input Pesan */}
              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label>Isi Testimoni</label>
                <textarea 
                  name="pesan"
                  rows="4" 
                  value={formData.pesan}
                  onChange={handleChange}
                  placeholder="Tuliskan kesan pesanmu..." 
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Poppins' }}
                ></textarea>
              </div>

              {/* Tombol Submit */}
              <button 
                type="submit" 
                className="btn-fill" 
                disabled={loading}
                style={{ width: '100%', padding: '15px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Sedang Mengirim...' : 'Kirim Testimoni 🚀'}
              </button>
            </form>

            {statusMsg && (
              <p style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: 'var(--primary)' }}>
                {statusMsg}
              </p>
            )}
            
            <div style={{textAlign: 'center', marginTop: '20px'}}>
                <Link href="/" style={{color: 'gray', fontSize: '14px'}}>Batal</Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}