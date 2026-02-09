'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    supabase
        .from('tbl_history')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .then(({ data }) => setHistory(data || []));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>        
        {history.length === 0 && (
            <div style={{ textAlign:'center', color:'#999', padding:'20px' }}>Memuat History...</div>
        )}
        {history.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', alignItems: 'baseline' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'black' }}>
                    {item.year}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#999' }}>
                    {item.month}
                </div>
                <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
                    {item.title}
                </div>

            </div>
        ))}
    </div>
  );
}