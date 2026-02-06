'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
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
    <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ paddingTop: '120px' }}>
        
        {/* Header */}
        <div className="container" style={{ textAlign:'center', marginBottom:'60px' }}>
            <h1 style={{ fontSize:'48px', fontWeight:'900', marginBottom:'10px', textTransform:'uppercase' }}>UNI</h1>
            <div style={{ display:'flex', gap:'20px', justifyContent:'center', marginBottom:'50px', fontSize:'14px', fontWeight:'500', color:'#444' }}>
                <Link href="/about" style={{ textDecoration:'none', color:'#888' }}>About</Link>
                <Link href="/history" style={{ textDecoration:'none', color:'#888' }}>History</Link>
                <Link href="/news" style={{ textDecoration:'none', color:'#888' }}>News</Link>
                <Link href="/contact" style={{ textDecoration:'underline', color:'black', fontWeight:'bold' }}>Contact</Link>
            </div>

            {/* Address Columns */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'50px', textAlign:'left', maxWidth:'900px', margin:'0 auto' }}>
                <div>
                    <h3 style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'10px' }}>LSP Pusat</h3>
                    <p style={{ fontSize:'14px', color:'#666', marginBottom:'20px', lineHeight:'1.6' }}>{info.contact_address_1}</p>
                    <p style={{ fontSize:'14px', color:'#666' }}>{info.contact_phone_1}</p>
                </div>
                <div>
                    <h3 style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'10px' }}>Kampus STTI</h3>
                    <p style={{ fontSize:'14px', color:'#666', marginBottom:'20px', lineHeight:'1.6' }}>{info.contact_address_2}</p>
                    <p style={{ fontSize:'14px', color:'#666' }}>{info.contact_phone_2}</p>
                </div>
            </div>
        </div>

        {/* Black Box (Map Placeholder) */}
        <div style={{ background:'#1e1e1e', color:'white', padding:'100px 20px', textAlign:'center', marginBottom:'80px' }}>
            <h2 style={{ fontSize:'24px', fontWeight:'bold' }}>The map that leads to you</h2>
            {/* Nanti bisa diganti Google Maps Embed */}
        </div>

        {/* Form Section */}
        <div className="container" style={{ maxWidth:'700px', paddingBottom:'80px' }}>
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

      </div>
      <Footer />
    </div>
  );
}

const inputStyle = { width:'100%', padding:'15px', background:'#e5e5e5', border:'none', outline:'none', fontSize:'14px' };