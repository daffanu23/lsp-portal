'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Save, UploadCloud, Loader2, Image as ImageIcon, MapPin } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `about-hero-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        setFormData(prev => ({ ...prev, about_image: publicUrl }));

    } catch (error) {
        alert('Gagal upload gambar: ' + error.message);
    } finally {
        setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let hasError = false;

    try {
        for (const key of Object.keys(formData)) {
            const value = formData[key];
            const { data: existing } = await supabase.from('tbl_settings').select('*').eq('key_name', key).single();

            let error;
            if (existing) {
                const res = await supabase.from('tbl_settings').update({ value_text: value }).eq('key_name', key);
                error = res.error;
            } else {
                const res = await supabase.from('tbl_settings').insert([{ key_name: key, value_text: value }]);
                error = res.error;
            }

            if (error) { console.error(`Gagal simpan ${key}:`, error.message); hasError = true; }
        }

        if (hasError) alert('Sebagian data gagal disimpan.');
        else { alert('Pengaturan Berhasil Disimpan! ✅'); fetchSettings(); }

    } catch (error) { alert('Terjadi kesalahan fatal: ' + error.message); }
    setSaving(false);
  };
  
  if (loading) return <div style={{ height:'80vh', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', color:'#666' }}><Loader2 className="animate-spin"/> Memuat Pengaturan...</div>;

  return (
    // WRAPPER UTAMA (Padding Top Aman)
    <div style={{ paddingTop: '80px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing:'-1px', textTransform:'uppercase' }}>Pengaturan Halaman</h1>
          <p style={{ color: '#666', fontSize:'16px', fontWeight:'500' }}>Sesuaikan konten halaman About dan Contact.</p>
      </div>

      <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'30px' }}>
        
        {/* CARD 1: HALAMAN ABOUT */}
        <div style={{ background:'white', borderRadius:'20px', boxShadow:'0 5px 30px rgba(0,0,0,0.05)', overflow:'hidden', border:'1px solid #eee' }}>
            <div style={{ padding:'25px', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:'10px' }}>
                <ImageIcon size={20} color="#444" />
                <h3 style={{ margin:0, fontSize:'18px', fontWeight:'800', textTransform:'uppercase' }}>Konten About</h3>
            </div>
            
            <div style={{ padding:'30px' }}>
                {/* PREVIEW GAMBAR */}
                <div style={formGroup}>
                    <label style={labelStyle}>Foto Utama (Hero Image)</label>
                    
                    <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
                        {formData.about_image ? (
                            <div style={{ position:'relative', width:'200px', height:'120px', borderRadius:'12px', overflow:'hidden', border:'1px solid #eee' }}>
                                <img src={formData.about_image} alt="Preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            </div>
                        ) : (
                            <div style={{ width:'200px', height:'120px', background:'#f4f4f4', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'12px' }}>
                                No Image
                            </div>
                        )}

                        <div style={{ flex:1 }}>
                             <label style={{ 
                                display:'inline-flex', alignItems:'center', gap:'10px', padding:'12px 20px', 
                                background:'black', color:'white', borderRadius:'8px', cursor:'pointer',
                                fontSize:'13px', fontWeight:'bold', transition:'0.2s'
                             }}>
                                {uploading ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={16}/>} 
                                {uploading ? 'Mengupload...' : 'Upload Foto Baru'}
                                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display:'none' }} />
                            </label>
                            <p style={{ fontSize:'12px', color:'#888', marginTop:'10px' }}>Format JPG/PNG. Maksimal 2MB. Disarankan rasio 16:9.</p>
                        </div>
                    </div>
                </div>
                
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                    <div style={formGroup}>
                        <label style={labelStyle}>Teks Overlay (Di atas gambar)</label>
                        <input type="text" name="about_name_overlay" value={formData.about_name_overlay} onChange={handleChange} style={inputStyle} placeholder="Contoh: TENTANG KAMI" />
                    </div>
                    <div style={formGroup}>
                        <label style={labelStyle}>Judul Artikel</label>
                        <input type="text" name="about_title" value={formData.about_title} onChange={handleChange} style={inputStyle} placeholder="Judul Halaman About" />
                    </div>
                </div>

                <div style={{ marginBottom:0 }}>
                    <label style={labelStyle}>Isi Artikel</label>
                    <textarea name="about_description" value={formData.about_description} onChange={handleChange} style={{...inputStyle, height:'150px', lineHeight:'1.6'}} placeholder="Tulis deskripsi lengkap..." />
                </div>
            </div>
        </div>

        {/* CARD 2: HALAMAN CONTACT */}
        <div style={{ background:'white', borderRadius:'20px', boxShadow:'0 5px 30px rgba(0,0,0,0.05)', overflow:'hidden', border:'1px solid #eee' }}>
            <div style={{ padding:'25px', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:'10px' }}>
                <MapPin size={20} color="#444" />
                <h3 style={{ margin:0, fontSize:'18px', fontWeight:'800', textTransform:'uppercase' }}>Info Kontak</h3>
            </div>
            
            <div style={{ padding:'30px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px' }}>
                {/* LOKASI 1 */}
                <div>
                    <h4 style={{ marginBottom:'15px', fontSize:'14px', color:'#000', fontWeight:'bold', textDecoration:'underline' }}>LOKASI 1 (PUSAT)</h4>
                    <div style={formGroup}>
                        <label style={labelStyle}>Alamat Lengkap</label>
                        <textarea name="contact_address_1" value={formData.contact_address_1} onChange={handleChange} style={{...inputStyle, height:'80px'}} />
                    </div>
                    <div style={formGroup}>
                        <label style={labelStyle}>No. Telepon / WhatsApp</label>
                        <input type="text" name="contact_phone_1" value={formData.contact_phone_1} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>
                
                {/* LOKASI 2 */}
                <div>
                    <h4 style={{ marginBottom:'15px', fontSize:'14px', color:'#000', fontWeight:'bold', textDecoration:'underline' }}>LOKASI 2 (CABANG)</h4>
                    <div style={formGroup}>
                        <label style={labelStyle}>Alamat Lengkap</label>
                        <textarea name="contact_address_2" value={formData.contact_address_2} onChange={handleChange} style={{...inputStyle, height:'80px'}} />
                    </div>
                    <div style={formGroup}>
                        <label style={labelStyle}>No. Telepon / WhatsApp</label>
                        <input type="text" name="contact_phone_2" value={formData.contact_phone_2} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>
            </div>
        </div>

        {/* TOMBOL SAVE FLOAT */}
        <div style={{ position:'sticky', bottom:'40px', background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 5px 20px rgba(0,0,0,0.1)', border:'1px solid #eee', display:'flex', justifyContent:'flex-end' }}>
             <button type="submit" disabled={saving || uploading} style={{ 
                 padding:'15px 40px', background:'black', color:'white', fontWeight:'bold', borderRadius:'8px', border:'none', cursor:'pointer', 
                 display:'flex', alignItems:'center', gap:'10px', boxShadow:'0 4px 15px rgba(0,0,0,0.2)', fontSize:'15px', transition:'transform 0.2s'
             }}>
                <Save size={20} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
        </div>

      </form>
    </div>
  );
}

const formGroup = { marginBottom: '25px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color:'#444', textTransform:'uppercase', letterSpacing:'0.5px' };
const inputStyle = { width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px', background:'#f9f9f9', transition:'0.3s' };