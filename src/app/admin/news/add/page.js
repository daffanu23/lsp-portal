'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState('');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setAuthor(session.user.email.split('@')[0]); 
      }
    }
    checkSession();
  }, [router]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // PERUBAHAN 1: Hapus "!file" dari pengecekan agar gambar tidak wajib
    if (!title || !content) {
      alert("Mohon lengkapi Judul dan Isi Berita.");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = null; // Default null jika tidak ada gambar

      // PERUBAHAN 2: Bungkus logika upload dengan "if (file)"
      if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase
            .storage
            .from('news_images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase
            .storage
            .from('news_images')
            .getPublicUrl(filePath);
            
          finalImageUrl = urlData.publicUrl;
      }

      // Insert DB
      const { error: insertError } = await supabase
        .from('tbl_m_news')
        .insert({
          tbl_title: title,
          tbl_text: content,
          tbl_pict: finalImageUrl, // PERUBAHAN 3: Gunakan variabel ini (bisa url atau null)
          author: author,
          tgl_upload: new Date().toISOString()
        });

      if (insertError) throw insertError;

      alert("Berita berhasil disimpan.");
      router.push('/admin'); 

    } catch (error) {
      console.error("Error:", error);
      alert("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR (Mini version for UX consistency) */}
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
                <h2>Tambah Berita Baru</h2>
            </div>

            <div className="card">
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label>Judul Berita</label>
                    <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul berita"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label>Penulis</label>
                    <input 
                    type="text" 
                    value={author}
                    readOnly
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', opacity: 0.7, cursor: 'not-allowed' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label>Gambar Thumbnail (Opsional)</label>
                    <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--gray)', borderRadius: '8px' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '30px' }}>
                    <label>Isi Berita</label>
                    <textarea 
                    rows="10"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tulis konten berita di sini..."
                    style={{ 
                        width: '100%', padding: '12px', borderRadius: '8px', 
                        fontFamily: 'Poppins', lineHeight: '1.6' 
                    }}
                    ></textarea>
                </div>

                <div style={{ display:'flex', gap:'15px' }}>
                    <button 
                        type="button"
                        onClick={() => router.push('/admin')}
                        className="btn-outline"
                        style={{ textAlign:'center' }}
                    >
                        Batal
                    </button>
                    <button 
                        type="submit" 
                        className="btn-fill" 
                        disabled={loading}
                        style={{ flex: 2, fontSize: '14px', fontWeight: '600' }}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Berita'}
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