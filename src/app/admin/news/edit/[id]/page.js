'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; 

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // State Form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [oldImage, setOldImage] = useState(''); 
  const [file, setFile] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null); // State baru untuk preview real-time

  // 1. Ambil Data Berita Lama
  useEffect(() => {
    async function getNewsData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('tbl_m_news')
        .select('*')
        .eq('id_news', id)
        .single();

      if (error) {
        alert("Gagal mengambil data berita.");
        router.push('/admin/news');
      } else {
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
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Buat preview URL sementara untuk file baru
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  // 2. Proses Update Data
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = oldImage; // Default: pakai gambar lama

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

      const { error: updateError } = await supabase
        .from('tbl_m_news')
        .update({
          tbl_title: title,
          tbl_text: content,
          tbl_pict: finalImageUrl,
        })
        .eq('id_news', id);

      if (updateError) throw updateError;

      alert("Berita berhasil diperbarui.");
      router.push('/admin/news'); // Redirect ke list berita

    } catch (error) {
      console.error(error);
      alert("Gagal update: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <p style={{ padding: '40px', textAlign: 'center', color:'#666' }}>Mengambil data berita...</p>;

  return (
    // Wrapper container simple
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        
        <div className="section-header">
            <h2>Edit Berita</h2>
        </div>

        <div className="card">
            <div className="card-body">
            <form onSubmit={handleUpdate}>
            
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight:'bold', marginBottom:'5px', display:'block' }}>Judul Berita</label>
                    <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border:'1px solid #ddd' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight:'bold', marginBottom:'5px', display:'block' }}>Penulis</label>
                    <input 
                    type="text" 
                    value={author}
                    readOnly
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', opacity: 0.7, cursor: 'not-allowed', background:'#f9f9f9', border:'1px solid #ddd' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight:'bold', marginBottom:'5px', display:'block' }}>Gambar Thumbnail</label>
                    
                    {/* Logika Preview Cerdas: Tampilkan Gambar Baru (jika ada) ATAU Gambar Lama */}
                    {(previewImage || oldImage) && (
                    <div style={{ marginBottom: '10px' }}>
                        <img 
                            src={previewImage || oldImage} 
                            alt="Preview" 
                            style={{ height: '150px', borderRadius: '8px', border: '1px solid #ddd', objectFit:'cover' }} 
                        />
                        <p style={{ fontSize: '12px', color: 'gray', marginTop:'5px' }}>
                            {previewImage ? "Preview Gambar Baru" : "Gambar Saat Ini"}
                        </p>
                    </div>
                    )}

                    <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background:'white' }}
                    />
                    <small style={{ color: 'gray', display:'block', marginTop:'5px' }}>
                        Biarkan kosong jika tidak ingin mengubah gambar.
                    </small>
                </div>

                <div className="form-group" style={{ marginBottom: '30px' }}>
                    <label style={{ fontWeight:'bold', marginBottom:'5px', display:'block' }}>Isi Berita</label>
                    <textarea 
                    rows="10"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ 
                        width: '100%', padding: '12px', borderRadius: '8px', border:'1px solid #ddd',
                        fontFamily: 'inherit', lineHeight: '1.6' 
                    }}
                    ></textarea>
                </div>

                <div style={{ display:'flex', gap:'15px' }}>
                    <button 
                        type="button"
                        onClick={() => router.push('/admin/')}
                        className="btn-outline"
                        style={{ textAlign:'center', padding: '12px 20px', borderRadius:'8px', border:'1px solid #ccc', background:'white', cursor:'pointer' }}
                    >
                        Batal
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            flex: 2, fontSize: '14px', fontWeight: 'bold', 
                            background:'black', color:'white', padding:'12px', 
                            border:'none', borderRadius:'8px', cursor:'pointer' 
                        }}
                    >
                        {loading ? 'Menyimpan Perubahan...' : 'Update Berita'}
                    </button>
                </div>

            </form>
            </div>
        </div>
    </div>
  );
}