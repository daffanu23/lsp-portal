'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Plus, Calendar, Loader2 } from 'lucide-react';

export default function AdminHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ year: '', month: '', title: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    // Sorting: Tahun DESC, lalu Bulan DESC
    const { data } = await supabase
        .from('tbl_history')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false }); 
        
    if(data) setHistory(data);
    setLoading(false);
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.year || !form.title) return alert('Tahun dan Judul wajib diisi!');

    let formattedMonth = '';
    if (form.month) {
        formattedMonth = form.month.toString().padStart(2, '0');
    }

    const dataToSubmit = {
        year: form.year,
        title: form.title,
        month: formattedMonth 
    };

    const { error } = await supabase.from('tbl_history').insert([dataToSubmit]);
    
    if (!error) {
        setForm({ year: '', month: '', title: '' });
        fetchHistory();
    } else {
        alert('Gagal: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Hapus history ini?')) return;
    const { error } = await supabase.from('tbl_history').delete().eq('id', id);
    if (!error) fetchHistory();
  };

  const handleNumberInput = (e, field) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; 
    setForm({ ...form, [field]: val });
  };

  if (loading) return <div style={{ height:'80vh', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', color:'#666' }}><Loader2 className="animate-spin"/> Memuat History...</div>;

  return (
    // WRAPPER UTAMA (Padding Top Aman)
    <div style={{ paddingTop: '80px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing:'-1px', textTransform:'uppercase' }}>Kelola History</h1>
          <p style={{ color: '#666', fontSize:'16px', fontWeight:'500' }}>Catat momen penting dan perjalanan organisasi.</p>
      </div>

      {/* FORM CARD */}
      <div style={{ background:'white', padding:'30px', borderRadius:'20px', boxShadow:'0 5px 30px rgba(0,0,0,0.05)', marginBottom:'40px', border:'1px solid #eee' }}>
        <h3 style={{ fontSize:'16px', fontWeight:'800', marginBottom:'20px', textTransform:'uppercase', display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'24px', height:'24px', background:'black', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}><Plus size={14}/></div>
            Tambah History Baru
        </h3>
        
        <form onSubmit={handleAdd} style={{ display:'flex', gap:'20px', alignItems:'flex-end', flexWrap:'wrap' }}>
            
            {/* Input Tahun */}
            <div style={{ width:'120px' }}>
                <label style={labelStyle}>Tahun <span style={{color:'red'}}>*</span></label>
                <input 
                    type="text" maxLength="4" placeholder="YYYY" 
                    value={form.year} onChange={(e) => handleNumberInput(e, 'year')} 
                    style={inputStyle} 
                />
            </div>

            {/* Input Bulan */}
            <div style={{ width:'100px' }}>
                <label style={labelStyle}>Bulan (01-12)</label>
                <input 
                    type="text" maxLength="2" placeholder="MM" 
                    value={form.month} onChange={(e) => handleNumberInput(e, 'month')} 
                    style={inputStyle} 
                />
            </div>

            {/* Input Judul */}
            <div style={{ flex:1, minWidth:'250px' }}>
                <label style={labelStyle}>Judul Kejadian <span style={{color:'red'}}>*</span></label>
                <input 
                    type="text" placeholder="Contoh: Pendirian Kampus Baru" 
                    value={form.title} onChange={e=>setForm({...form, title:e.target.value})} 
                    style={inputStyle} 
                />
            </div>

            {/* Tombol Submit */}
            <button type="submit" style={{ 
                padding:'12px 25px', background:'black', color:'white', borderRadius:'8px', border:'none', 
                cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:'8px', height:'46px',
                boxShadow:'0 4px 10px rgba(0,0,0,0.1)'
            }}>
                <Plus size={18} /> Simpan
            </button>
        </form>
      </div>

      {/* LIST CARD */}
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 5px 30px rgba(0,0,0,0.05)', overflow: 'hidden', border:'1px solid #eee' }}>
        {history.length === 0 ? (
             <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Belum ada data history.</div>
        ) : (
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'15px' }}>
                <thead style={{ background:'#f8f8f8', borderBottom:'1px solid #eee' }}>
                    <tr>
                        <th style={{padding:'20px', textAlign:'center', width:'80px', color:'#888', fontSize:'12px'}}>THN</th>
                        <th style={{padding:'20px', textAlign:'center', width:'60px', color:'#888', fontSize:'12px'}}>BLN</th>
                        <th style={{padding:'20px', textAlign:'left', color:'#444', fontSize:'12px', letterSpacing:'1px'}}>JUDUL / PERISTIWA</th>
                        <th style={{padding:'20px', textAlign:'center', width:'80px', color:'#444', fontSize:'12px'}}>AKSI</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(item => (
                        <tr key={item.id} style={{ borderBottom:'1px solid #f3f4f6' }}>
                            {/* Tahun (Besar & Tebal) */}
                            <td style={{ padding:'20px', textAlign:'center' }}>
                                <div style={{ fontWeight:'900', fontSize:'20px', color:'black' }}>{item.year}</div>
                            </td>
                            
                            {/* Bulan (Kecil & Abu) */}
                            <td style={{ padding:'20px', textAlign:'center' }}>
                                <div style={{ fontSize:'14px', fontWeight:'bold', color:'#999', background:'#eee', padding:'4px', borderRadius:'6px' }}>
                                    {item.month ? item.month : '-'}
                                </div>
                            </td>

                            {/* Judul */}
                            <td style={{ padding:'20px', color:'#333', fontWeight:'500', fontSize:'16px' }}>
                                {item.title}
                            </td>

                            {/* Hapus */}
                            <td style={{ padding:'20px', textAlign:'center' }}>
                                <button onClick={() => handleDelete(item.id)} style={{ padding:'8px', borderRadius:'8px', border:'none', background:'#fee2e2', cursor:'pointer', color:'#ef4444' }}>
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>

    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color:'#444', textTransform:'uppercase', letterSpacing:'0.5px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background:'#f9f9f9', height:'46px' };