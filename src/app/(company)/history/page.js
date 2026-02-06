'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // LOGIKA SORTING (Tahun DESC, Bulan DESC)
    supabase
        .from('tbl_history')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false }) // 02 di atas 01
        .then(({ data }) => setHistory(data || []));
  }, []);

  return (
    // Tidak perlu div container/background lagi.
    // Langsung ke wrapper list history-nya.
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {history.length === 0 && (
            <div style={{ textAlign:'center', color:'#999', padding:'20px' }}>Memuat History...</div>
        )}

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
                
                {/* Kolom 3: JUDUL (Abu-abu agak gelap) */}
                <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
                    {item.title}
                </div>

            </div>
        ))}
    </div>
  );
}