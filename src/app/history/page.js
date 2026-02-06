'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // LOGIKA SORTING HARUS SAMA DENGAN ADMIN
    supabase
        .from('tbl_history')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false }) // 02 di atas 01
        .then(({ data }) => setHistory(data || []));
  }, []);

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh', color: 'black' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header Navigation */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '10px' }}>UNI</h1>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '14px', color: '#666' }}>
                <Link href="/about" style={{ textDecoration:'none', color:'#666' }}>About</Link>
                <span style={{ borderBottom: '2px solid black', color: 'black', fontWeight: 'bold' }}>History</span>
                <Link href="/news" style={{ textDecoration:'none', color:'#666' }}>News</Link>
                <Link href="/contact" style={{ textDecoration:'none', color:'#666' }}>Contact</Link>
            </div>
        </div>

        {/* LIST HISTORY SESUAI DESAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {history.map((item) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', alignItems: 'baseline' }}>
                    {/* Kolom 1: TAHUN (Besar Tebal) */}
                    <div style={{ fontSize: '24px', fontWeight: '900', color: 'black' }}>
                        {item.year}
                    </div>
                    
                    {/* Kolom 2: BULAN (Kecil Abu Tebal) */}
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#999' }}>
                        {item.month}
                    </div>
                    
                    {/* Kolom 3: JUDUL (Abu-abu agak gelap) - Deskripsi dihapus */}
                    <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
                        {item.title}
                    </div>
                </div>
            ))}
        </div>

      </div>
      <Footer />
    </div>
  );
}