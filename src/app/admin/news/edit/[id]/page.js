'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Ambil ID dari URL

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // State Form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [oldImage, setOldImage] = useState(''); // Untuk preview gambar lama
  const [file, setFile] = useState(null); // Jika user upload gambar baru

  // 1. Ambil Data Berita Lama saat Halaman Dibuka
  useEffect(() => {
    async function getNewsData() {
      // Cek Session dulu
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Fetch Data Berita berdasarkan ID
      const { data, error } = await supabase
        .from('tbl_m_news')
        .select('*')
        .eq('id_news', id)
        .single();

      if (error) {
        alert("Gagal mengambil data berita.");
        router.push('/admin');
      } else {
        // Isi Form dengan data lama
        setTitle(data.tbl_title);
        setAuthor(data.author);
        setContent(data.tbl_text);
        setOldImage(data.tbl_pict);
        setFetchLoading(false);
      }
    }

    getNewsData();
  }, [id, router]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // 2. Proses Update Data
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = oldImage; // Default: pakai gambar lama

      // A. Jika ada file baru, upload dulu
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_edit.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('news_images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase
          .storage
          .from('news_images')
          .getPublicUrl(fileName);
          
        finalImageUrl = urlData.publicUrl;
      }

      // B. Update Database
      const { error: updateError } = await supabase
        .from('tbl_m_news')
        .update({
          tbl_title: title,
          tbl_text: content,
          tbl_pict: finalImageUrl,
          // author tidak kita update agar tetap original
        })
        .eq('id_news', id);

      if (updateError) throw updateError;

      alert("Berita berhasil diperbarui.");
      router.push('/admin');

    } catch (error) {
      console.error(error);
      alert("Gagal update: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <p style={{ padding: '40px', textAlign: 'center' }}>Mengambil data berita...</p>;

  return (
    <div className="admin-layout">
      {/* Sidebar Mini */}
      <aside className="admin-sidebar">
        <h3 style={{ marginBottom: '30px', paddingBottom: '10px', borderBottom: '1px solid #34495e', fontSize:'18px' }}>
          Admin Panel
        </h3>
        <nav className="admin-menu">
            <Link href="/admin">Kembali ke Dashboard</Link>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="container" style={{ maxWidth: '800px', margin: '0' }}>
            <div className="section-header">
                <h2>Edit Berita</h2>
            </div>

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleUpdate}>
                
                  {/* Judul */}
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label>Judul Berita</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                      />
                  </div>

                  {/* Penulis (Read Only) */}
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label>Penulis</label>
                      <input 
                        type="text" 
                        value={author}
                        readOnly
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', opacity: 0.7, cursor: 'not-allowed' }}
                      />
                  </div>

                  {/* Gambar */}
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label>Gambar Thumbnail</label>
                      
                      {/* Preview Gambar Lama */}
                      {oldImage && !file && (
                        <div style={{ marginBottom: '10px' }}>
                          <img src={oldImage} alt="Preview" style={{ height: '100px', borderRadius: '8px', border: '1px solid #ddd' }} />
                          <p style={{ fontSize: '12px', color: 'gray' }}>Gambar saat ini</p>
                        </div>
                      )}

                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--gray)', borderRadius: '8px' }}
                      />
                      <small style={{ color: 'gray' }}>Biarkan kosong jika tidak ingin mengubah gambar.</small>
                  </div>

                  {/* Konten */}
                  <div className="form-group" style={{ marginBottom: '30px' }}>
                      <label>Isi Berita</label>
                      <textarea 
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ 
                            width: '100%', padding: '12px', borderRadius: '8px', 
                            fontFamily: 'Poppins', lineHeight: '1.6' 
                        }}
                      ></textarea>
                  </div>

                  <div style={{ display:'flex', gap:'15px' }}>
                      <Link href="/admin" className="btn-outline" style={{ textAlign:'center', padding: '12px 20px', textDecoration:'none' }}>
                          Batal
                      </Link>
                      <button 
                          type="submit" 
                          className="btn-fill" 
                          disabled={loading}
                          style={{ flex: 2, fontSize: '14px', fontWeight: '600' }}
                      >
                          {loading ? 'Menyimpan Perubahan...' : 'Update Berita'}
                      </button>
                  </div>

                </form>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}