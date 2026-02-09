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
       <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'50px', textAlign:'left', marginBottom:'80px' }}>
            <div>
                <h3 style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'10px' }}>Lokasi 1</h3>
                <p style={{ fontSize:'14px', color:'#666', marginBottom:'20px', lineHeight:'1.6' }}>
                    {info.contact_address_1 || 'Loading address...'}
                </p>
                <p style={{ fontSize:'14px', color:'#666' }}>
                    {info.contact_phone_1}
                </p>
            </div>
            <div>
                <h3 style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'10px' }}>Lokasi 2</h3>
                <p style={{ fontSize:'14px', color:'#666', marginBottom:'20px', lineHeight:'1.6' }}>
                    {info.contact_address_2 || 'Loading address...'}
                </p>
                <p style={{ fontSize:'14px', color:'#666' }}>
                    {info.contact_phone_2}
                </p>
            </div>
        </div>

        <div style={{ width:'100%', height:'450px', marginBottom:'80px', borderRadius:'12px', overflow:'hidden', boxShadow:'0 5px 20px rgba(0,0,0,0.05)' }}>
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25028.227435443245!2d112.61196478328479!3d-7.960694095278894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78829b5b4269c3%3A0x11dc7198d46d6e2!2sHardcore%20Internet%20Lounge!5e0!3m2!1sid!2sid!4v1770617852726!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border:0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>

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