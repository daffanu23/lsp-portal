'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ContactPage() {
  const [info, setInfo] = useState({});
  const [formData, setFormData] = useState({ name:'', email:'', contact:'', description:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchInfo() {
      const { data } = await supabase.from('tbl_settings').select('*');
      if (data) {
        const config = {};
        data.forEach(item => { config[item.key_name] = item.value_text });
        setInfo(config);
      }
    }
    fetchInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('tbl_messages').insert([formData]);
    if (error) alert('Gagal mengirim pesan');
    else {
        alert('Pesan terkirim!');
        setFormData({ name:'', email:'', contact:'', description:'' });
    }
    setLoading(false);
  };

  return (
    <>
       {/* 1. SECTION ALAMAT */}
       {/* Langsung grid layout, tidak perlu header UNI lagi */}
       <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'50px', textAlign:'left', marginBottom:'80px' }}>
            <div>
                <h3 style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'10px' }}>LSP Pusat</h3>
                <p style={{ fontSize:'14px', color:'#666', marginBottom:'20px', lineHeight:'1.6' }}>
                    {info.contact_address_1 || 'Loading address...'}
                </p>
                <p style={{ fontSize:'14px', color:'#666' }}>
                    {info.contact_phone_1}
                </p>
            </div>
            <div>
                <h3 style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'10px' }}>Kampus STTI</h3>
                <p style={{ fontSize:'14px', color:'#666', marginBottom:'20px', lineHeight:'1.6' }}>
                    {info.contact_address_2 || 'Loading address...'}
                </p>
                <p style={{ fontSize:'14px', color:'#666' }}>
                    {info.contact_phone_2}
                </p>
            </div>
        </div>

        {/* 2. SECTION PETA (BLACK BOX) */}
        <div style={{ background:'#1e1e1e', color:'white', padding:'80px 20px', textAlign:'center', marginBottom:'80px', borderRadius:'12px' }}>
            <h2 style={{ fontSize:'24px', fontWeight:'bold' }}>The map that leads to you</h2>
            <p style={{ fontSize:'14px', opacity:0.6, marginTop:'10px' }}>(Map Placeholder)</p>
        </div>

        {/* 3. SECTION FORM */}
        {/* Kita batasi lebarnya 700px agar rapi di tengah */}
        <div style={{ maxWidth:'700px', margin:'0 auto' }}>
            <h2 style={{ textAlign:'center', fontSize:'32px', fontWeight:'900', marginBottom:'10px', textTransform:'uppercase' }}>LET'S CONNECT</h2>
            <p style={{ textAlign:'center', color:'#666', marginBottom:'40px' }}>Anda bisa mengirim pesan melalui email</p>
            
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div>
                    <label style={{ fontWeight:'bold', display:'block', marginBottom:'5px' }}>Name</label>
                    <input type="text" required placeholder="Enter your name" style={inputStyle} 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label style={{ fontWeight:'bold', display:'block', marginBottom:'5px' }}>Email</label>
                    <input type="email" required placeholder="Enter your email" style={inputStyle} 
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                    <label style={{ fontWeight:'bold', display:'block', marginBottom:'5px' }}>Contact</label>
                    <input type="text" required placeholder="Enter your contact" style={inputStyle} 
                            value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div>
                    <label style={{ fontWeight:'bold', display:'block', marginBottom:'5px' }}>Description</label>
                    <textarea required placeholder="Type description here" style={{ ...inputStyle, height:'150px' }} 
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                
                <button type="submit" disabled={loading} style={{ background:'#222', color:'white', padding:'15px', border:'none', cursor:'pointer', fontWeight:'bold', marginTop:'20px' }}>
                    {loading ? 'Sending...' : 'Submit'}
                </button>
            </form>
        </div>
    </>
  );
}

const inputStyle = { width:'100%', padding:'15px', background:'#e5e5e5', border:'none', outline:'none', fontSize:'14px', borderRadius:'6px' };