'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AboutPage() {
  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchData() {
      const { data: settings } = await supabase.from('tbl_settings').select('*');
      if (settings) {
        const config = {};
        settings.forEach(item => { config[item.key_name] = item.value_text });
        setData(config);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          {data.about_image ? (
            <img src={data.about_image} alt="About" style={{ width: '100%', height: 'auto', display: 'block' }} />
          ) : (
            <div style={{ height:'300px', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center' }}>Loading Image...</div>
          )}
          
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '30px 20px 20px' }}>
              <h2 style={{ color: 'white', fontSize: '32px', margin: 0, fontWeight: '800', textTransform: 'uppercase', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {data.about_name_overlay}
              </h2>
          </div>
      </div>

      <div style={{ textAlign:'left' }}>
          <h2 style={{ fontSize:'24px', fontWeight:'800', marginBottom:'20px', color:'#111' }}>
            {data.about_title || 'Memuat Data...'}
          </h2>
          <div style={{ lineHeight:'1.8', color:'#444', fontSize:'16px', whiteSpace: 'pre-line' }}>
              {data.about_description}
          </div>
      </div>
    </>
  );
}