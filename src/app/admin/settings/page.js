'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Save, UploadCloud, Loader2 } from 'lucide-react'; // Tambah icon Loader

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // State khusus upload
  
  const [formData, setFormData] = useState({
    about_image: '',
    about_name_overlay: '',
    about_title: '',
    about_description: '',
    contact_address_1: '',
    contact_phone_1: '',
    contact_address_2: '',
    contact_phone_2: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('tbl_settings').select('*');
    if (data) {
        const config = {};
        data.forEach(item => { config[item.key_name] = item.value_text });
        setFormData(prev => ({ ...prev, ...config }));
    }
    setLoading(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- FUNGSI BARU: UPLOAD GAMBAR ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `about-hero-${Date.now()}.${fileExt}`; // Nama file unik
        const filePath = `${fileName}`;

        // 1. Upload ke Supabase Storage (Bucket 'images')
        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Ambil URL Publiknya
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        // 3. Simpan URL ke state formData (biar tampil di preview)
        setFormData(prev => ({ ...prev, about_image: publicUrl }));

    } catch (error) {
        alert('Gagal upload gambar: ' + error.message);
    } finally {
        setUploading(false);
    }
  };
  // ----------------------------------

  // Ganti fungsi handleSave yang lama dengan ini:
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let hasError = false;

    try {
        // Kita loop satu per satu
        for (const key of Object.keys(formData)) {
            const value = formData[key];

            // 1. Coba Check apakah data sudah ada?
            const { data: existing } = await supabase
                .from('tbl_settings')
                .select('*')
                .eq('key_name', key)
                .single();

            let error;
            
            if (existing) {
                // 2A. Kalau ada -> UPDATE
                const res = await supabase
                    .from('tbl_settings')
                    .update({ value_text: value })
                    .eq('key_name', key);
                error = res.error;
            } else {
                // 2B. Kalau tidak ada -> INSERT
                const res = await supabase
                    .from('tbl_settings')
                    .insert([{ key_name: key, value_text: value }]);
                error = res.error;
            }

            if (error) {
                console.error(`Gagal simpan ${key}:`, error.message);
                hasError = true;
            }
        }

        if (hasError) {
            alert('Sebagian data gagal disimpan. Cek Console (F12) untuk detail error.');
        } else {
            alert('Pengaturan Berhasil Disimpan! ✅');
            // Refresh data biar yakin
            fetchSettings();
        }

    } catch (error) {
        alert('Terjadi kesalahan fatal: ' + error.message);
    }
    setSaving(false);
  };
  
  if (loading) return <div style={{padding:'40px'}}>Memuat pengaturan...</div>;

  return (
    <div style={{ padding: '40px', maxWidth:'800px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '30px' }}>Edit Konten Halaman</h1>

      <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'30px' }}>
        
        {/* EDIT ABOUT */}
        <div style={{ background:'white', padding:'30px', borderRadius:'12px', boxShadow:'0 5px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom:'1px solid #eee', paddingBottom:'10px', marginBottom:'20px', fontWeight:'bold' }}>Halaman About</h3>
            
            {/* INPUT FOTO DENGAN UPLOAD */}
            <div style={formGroup}>
                <label style={labelStyle}>Foto Utama</label>
                
                {/* Preview Image */}
                {formData.about_image ? (
                    <div style={{ marginBottom:'15px', position:'relative', width:'fit-content' }}>
                        <img src={formData.about_image} alt="Preview" style={{ height:'200px', borderRadius:'8px', border:'1px solid #ddd' }} />
                        <div style={{ fontSize:'12px', color:'#666', marginTop:'5px' }}>Gambar aktif saat ini</div>
                    </div>
                ) : (
                    <div style={{ height:'100px', background:'#f4f4f4', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'#888', fontSize:'13px', marginBottom:'15px' }}>
                        Belum ada gambar
                    </div>
                )}

                {/* Tombol Upload */}
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <label style={{ 
                        padding:'10px 15px', background:'#eee', borderRadius:'6px', cursor:'pointer', 
                        fontSize:'13px', fontWeight:'600', display:'flex', alignItems:'center', gap:'8px' 
                    }}>
                        {uploading ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={16}/>} 
                        {uploading ? 'Mengupload...' : 'Ganti Foto'}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            disabled={uploading}
                            style={{ display:'none' }} 
                        />
                    </label>
                    <span style={{ fontSize:'12px', color:'#888' }}>Max 2MB. Format JPG/PNG.</span>
                </div>
            </div>
            
            <div style={formGroup}>
                <label style={labelStyle}>Nama Overlay</label>
                <input type="text" name="about_name_overlay" value={formData.about_name_overlay} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={formGroup}>
                <label style={labelStyle}>Judul Artikel</label>
                <input type="text" name="about_title" value={formData.about_title} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={formGroup}>
                <label style={labelStyle}>Isi Artikel About</label>
                <textarea name="about_description" value={formData.about_description} onChange={handleChange} style={{...inputStyle, height:'150px'}} />
            </div>
        </div>

        {/* EDIT CONTACT (Tetap Sama) */}
        <div style={{ background:'white', padding:'30px', borderRadius:'12px', boxShadow:'0 5px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom:'1px solid #eee', paddingBottom:'10px', marginBottom:'20px', fontWeight:'bold' }}>Halaman Contact</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                <div>
                    <h4 style={{marginBottom:'10px', fontSize:'14px'}}>Lokasi 1 (Pusat)</h4>
                    <div style={formGroup}>
                        <label style={labelStyle}>Alamat</label>
                        <textarea name="contact_address_1" value={formData.contact_address_1} onChange={handleChange} style={{...inputStyle, height:'80px'}} />
                    </div>
                    <div style={formGroup}>
                        <label style={labelStyle}>No. Telepon</label>
                        <input type="text" name="contact_phone_1" value={formData.contact_phone_1} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>
                <div>
                    <h4 style={{marginBottom:'10px', fontSize:'14px'}}>Lokasi 2 (Cabang)</h4>
                    <div style={formGroup}>
                        <label style={labelStyle}>Alamat</label>
                        <textarea name="contact_address_2" value={formData.contact_address_2} onChange={handleChange} style={{...inputStyle, height:'80px'}} />
                    </div>
                    <div style={formGroup}>
                        <label style={labelStyle}>No. Telepon</label>
                        <input type="text" name="contact_phone_2" value={formData.contact_phone_2} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>
            </div>
        </div>

        <button type="submit" disabled={saving || uploading} style={{ padding:'15px', background:'black', color:'white', fontWeight:'bold', borderRadius:'8px', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
            <Save size={20} /> {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </button>

      </form>
    </div>
  );
}

const formGroup = { marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color:'#444' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' };