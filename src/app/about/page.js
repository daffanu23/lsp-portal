'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AboutPage() {
  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchData() {
      // Ambil semua settings
      const { data: settings } = await supabase.from('tbl_settings').select('*');
      if (settings) {
        // Konversi array ke object biar gampang dipanggil
        const config = {};
        settings.forEach(item => { config[item.key_name] = item.value_text });
        setData(config);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth:'800px', textAlign:'center' }}>
        
        {/* Header Style Sesuai Gambar */}
        <h1 style={{ fontSize:'48px', fontWeight:'900', marginBottom:'10px', textTransform:'uppercase' }}>UNI</h1>
        <div style={{ display:'flex', gap:'20px', justifyContent:'center', marginBottom:'50px', fontSize:'14px', fontWeight:'500', color:'#444' }}>
            <Link href="/about" style={{ textDecoration:'underline', color:'black', fontWeight:'bold' }}>About</Link>
            <Link href="/history" style={{ textDecoration:'none', color:'#888' }}>History</Link>
            <Link href="/news" style={{ textDecoration:'none', color:'#888' }}>News</Link>
            <Link href="/contact" style={{ textDecoration:'none', color:'#888' }}>Contact</Link>
        </div>

        {/* IMAGE CARD */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px' }}>
            <img src={data.about_image} alt="About" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'rgba(0,0,0,0.8)', padding: '20px' }}>
                {/* PERBAIKAN DISINI: Hapus cursive, pakai default sans-serif yang tebal */}
                <h2 style={{ color: 'white', fontSize: '32px', margin: 0, fontWeight: '800', textTransform: 'uppercase' }}>
                    {data.about_name_overlay}
                </h2>
            </div>
        </div>

        {/* Content Text */}
        <div style={{ textAlign:'left' }}>
            <h2 style={{ fontSize:'24px', fontWeight:'bold', marginBottom:'20px' }}>{data.about_title || 'Loading...'}</h2>
            <div style={{ lineHeight:'1.8', color:'#555', whiteSpace: 'pre-line' }}>
                {data.about_description}
            </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}