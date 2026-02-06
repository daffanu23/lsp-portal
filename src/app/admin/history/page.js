'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, PlusCircle } from 'lucide-react';

export default function AdminHistoryPage() {
  const [history, setHistory] = useState([]);
  // HAPUS description dari state
  const [form, setForm] = useState({ year: '', month: '', title: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    // LOGIKA SORTING BENAR:
    // 1. Tahun Terbaru paling atas (Descending)
    // 2. Bulan Terbesar (02) di atas Bulan Kecil (01) (Descending)
    const { data } = await supabase
        .from('tbl_history')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false }); 
        
    if(data) setHistory(data);
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.year || !form.title) return alert('Tahun dan Judul wajib diisi!');

    // LOGIKA TAMBAH ANGKA 0 (Tetap dipakai)
    let formattedMonth = '';
    if (form.month) {
        formattedMonth = form.month.toString().padStart(2, '0');
    }

    const dataToSubmit = {
        year: form.year,
        title: form.title,
        month: formattedMonth 
        // Description sudah dihapus
    };

    const { error } = await supabase.from('tbl_history').insert([dataToSubmit]);
    
    if (!error) {
        setForm({ year: '', month: '', title: '' });
        fetchHistory();
        alert('History berhasil ditambahkan!');
    } else {
        alert('Gagal: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Hapus sejarah ini?')) return;
    await supabase.from('tbl_history').delete().eq('id', id);
    fetchHistory();
  };

  const handleNumberInput = (e, field) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; 
    setForm({ ...form, [field]: val });
  };

  return (
    <div style={{ padding: '40px', maxWidth:'900px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '30px' }}>Kelola History</h1>

      {/* Form Tambah */}
      <div style={{ background:'white', padding:'25px', borderRadius:'12px', boxShadow:'0 5px 15px rgba(0,0,0,0.05)', marginBottom:'30px' }}>
        <h3 style={{ fontSize:'16px', fontWeight:'bold', marginBottom:'15px' }}>Tambah History Baru</h3>
        
        <form onSubmit={handleAdd} style={{ display:'flex', gap:'15px', alignItems:'flex-end' }}>
            
            <div style={{width:'100px'}}>
                <label style={labelStyle}>Tahun *</label>
                <input 
                    type="text" maxLength="4" placeholder="2026" 
                    value={form.year} onChange={(e) => handleNumberInput(e, 'year')} 
                    style={inputStyle} 
                />
            </div>
            <div style={{width:'80px'}}>
                <label style={labelStyle}>Bulan</label>
                <input 
                    type="text" maxLength="2" placeholder="02" 
                    value={form.month} onChange={(e) => handleNumberInput(e, 'month')} 
                    style={inputStyle} 
                />
            </div>
            <div style={{flex:1}}>
                <label style={labelStyle}>Judul Kejadian *</label>
                <input 
                    type="text" placeholder="Contoh: Pendaftaran Batch 1" 
                    value={form.title} onChange={e=>setForm({...form, title:e.target.value})} 
                    style={inputStyle} 
                />
            </div>
            {/* Input Deskripsi SUDAH DIHAPUS */}

            <button type="submit" style={{ padding:'10px 20px', background:'black', color:'white', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px', height:'42px' }}>
                <PlusCircle size={18} /> Tambah
            </button>
        </form>
      </div>

      {/* Tabel List */}
      <div style={{ background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 5px 15px rgba(0,0,0,0.05)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'14px' }}>
            <thead style={{ background:'#f9fafb', borderBottom:'1px solid #eee' }}>
                <tr>
                    <th style={{padding:'15px', textAlign:'left'}}>Waktu</th>
                    <th style={{padding:'15px', textAlign:'left'}}>Judul</th>
                    <th style={{padding:'15px', textAlign:'center', width:'80px'}}>Aksi</th>
                </tr>
            </thead>
            <tbody>
                {history.map(item => (
                    <tr key={item.id} style={{ borderBottom:'1px solid #f3f4f6' }}>
                        <td style={{padding:'15px'}}>
                            <div style={{fontWeight:'900', fontSize:'16px'}}>{item.year}</div>
                            <div style={{fontSize:'13px', color:'#888', fontWeight:'bold'}}>
                                {item.month ? item.month : '-'}
                            </div>
                        </td>
                        <td style={{padding:'15px', fontWeight:'500', color:'#333', fontSize:'16px'}}>{item.title}</td>
                        <td style={{padding:'15px', textAlign:'center'}}>
                            <button onClick={() => handleDelete(item.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444' }}>
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color:'#666' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' };