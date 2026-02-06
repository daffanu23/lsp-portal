'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Check, X, Loader2, Calendar, User, CreditCard, Ticket } from 'lucide-react';

export default function VerifikasiPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchApplicants(); }, []);

  async function fetchApplicants() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tbl_registrasi')
      .select('*, tbl_m_event(id_event, nama_event, sisa_kuota)')
      .order('tgl_daftar', { ascending: false });

    if (!error) setApplicants(data || []);
    setLoading(false);
  }

  // --- LOGIKA ACC + POTONG KUOTA ---
  const handleApprove = async (regItem) => {
    const confirm = window.confirm(`Terima ${regItem.nama_lengkap}? Kuota event akan berkurang 1.`);
    if (!confirm) return;

    // 1. Cek Kuota (Client Side)
    const currentQuota = regItem.tbl_m_event?.sisa_kuota;
    if (currentQuota <= 0) {
        alert('GAGAL: Kuota event ini sudah habis (0). Tidak bisa menerima peserta lagi.');
        return;
    }

    try {
        // 2. Update Status Peserta
        const { error: errReg } = await supabase
            .from('tbl_registrasi')
            .update({ status: 'Approved', payment_status: 'Paid' })
            .eq('id_reg', regItem.id_reg);
        
        if (errReg) throw errReg;

        // 3. Update Kuota Event (Kurangi 1)
        const { error: errEvent } = await supabase
            .from('tbl_m_event')
            .update({ sisa_kuota: currentQuota - 1 })
            .eq('id_event', regItem.tbl_m_event.id_event);

        if (errEvent) throw errEvent;

        alert('Berhasil! Peserta diterima dan kuota dikurangi.');
        fetchApplicants();

    } catch (error) {
        alert('Terjadi kesalahan: ' + error.message);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Alasan penolakan (Opsional):');
    if (reason === null) return;

    const { error } = await supabase
      .from('tbl_registrasi')
      .update({ status: 'Rejected' })
      .eq('id_reg', id);

    if (!error) {
        alert('Peserta Ditolak.');
        fetchApplicants();
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
        case 'Approved': return { bg: '#dcfce7', color: '#166534', label: 'Diterima' };
        case 'Rejected': return { bg: '#fee2e2', color: '#991b1b', label: 'Ditolak' };
        default: return { bg: '#fef9c3', color: '#854d0e', label: 'Menunggu' };
    }
  };

  if (loading) return <div style={{ height:'80vh', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', color:'#666' }}><Loader2 className="animate-spin"/> Memuat Data Pendaftar...</div>;

  return (
    // WRAPPER UTAMA
    <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing:'-1px', textTransform:'uppercase' }}>Verifikasi Akun</h1>
          <p style={{ color: '#666', fontSize:'16px', fontWeight:'500' }}>Validasi pendaftaran peserta dan kelola kuota event.</p>
      </div>

      {/* TABLE CARD */}
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 5px 30px rgba(0,0,0,0.05)', overflow: 'hidden', border:'1px solid #eee' }}>
        {applicants.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Belum ada pendaftar baru.</div>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize:'15px' }}>
                <thead style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                    <tr>
                        <th style={thStyle}>PESERTA</th>
                        <th style={thStyle}>EVENT PILIHAN</th>
                        <th style={thStyle}>PEMBAYARAN</th>
                        <th style={thStyle}>STATUS</th>
                        <th style={{...thStyle, textAlign:'center'}}>AKSI</th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.map((item) => {
                        const statusStyle = getStatusStyle(item.status);
                        return (
                            <tr key={item.id_reg} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                
                                {/* KOLOM 1: PESERTA */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'5px' }}>
                                        <div style={{ background:'#f3f4f6', padding:'8px', borderRadius:'50%' }}><User size={16} color="#444"/></div>
                                        <span style={{ fontWeight:'700', fontSize:'16px', color:'#111' }}>{item.nama_lengkap}</span>
                                    </div>
                                    <div style={{ fontSize:'12px', color:'#666', marginLeft:'42px', display:'flex', alignItems:'center', gap:'5px' }}>
                                        <Calendar size={12}/> {new Date(item.tgl_daftar).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}
                                    </div>
                                </td>

                                {/* KOLOM 2: EVENT */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ fontWeight:'600', color:'#333', marginBottom:'5px' }}>{item.tbl_m_event?.nama_event}</div>
                                    <div style={{ fontSize:'12px', color:'#666', display:'flex', alignItems:'center', gap:'6px' }}>
                                        <Ticket size={12}/> Sisa Kuota: <b style={{color: item.tbl_m_event?.sisa_kuota > 0 ? 'green' : 'red'}}>{item.tbl_m_event?.sisa_kuota}</b>
                                    </div>
                                </td>

                                {/* KOLOM 3: PEMBAYARAN */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'14px', fontWeight:'600', color: item.payment_method ? '#111' : '#999' }}>
                                        <CreditCard size={16} />
                                        {item.payment_method || 'Belum Pilih'}
                                    </div>
                                    <div style={{ fontSize:'12px', color:'#666', marginTop:'4px', marginLeft:'24px' }}>
                                        {item.total_bayar > 0 ? `Rp ${item.total_bayar.toLocaleString('id-ID')}` : 'Gratis'}
                                    </div>
                                </td>

                                {/* KOLOM 4: STATUS */}
                                <td style={{ padding: '20px' }}>
                                    <span style={{ 
                                        background: statusStyle.bg, color: statusStyle.color, 
                                        padding:'6px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'800',
                                        textTransform:'uppercase', letterSpacing:'0.5px'
                                    }}>
                                        {statusStyle.label}
                                    </span>
                                </td>

                                {/* KOLOM 5: AKSI */}
                                <td style={{ padding: '20px', textAlign:'center' }}>
                                    {item.status === 'Pending' ? (
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <button 
                                                onClick={() => handleApprove(item)} 
                                                title="Terima Peserta"
                                                style={{ 
                                                    background: '#16a34a', color: 'white', border: 'none', 
                                                    padding:'8px', borderRadius: '8px', cursor: 'pointer',
                                                    display:'flex', alignItems:'center', justifyContent:'center',
                                                    boxShadow:'0 2px 5px rgba(22, 163, 74, 0.3)'
                                                }}
                                            >
                                                <Check size={18} strokeWidth={3} />
                                            </button>
                                            <button 
                                                onClick={() => handleReject(item.id_reg)} 
                                                title="Tolak Peserta"
                                                style={{ 
                                                    background: '#dc2626', color: 'white', border: 'none', 
                                                    padding:'8px', borderRadius: '8px', cursor: 'pointer',
                                                    display:'flex', alignItems:'center', justifyContent:'center',
                                                    boxShadow:'0 2px 5px rgba(220, 38, 38, 0.3)'
                                                }}
                                            >
                                                <X size={18} strokeWidth={3} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize:'12px', color:'#aaa', fontStyle:'italic' }}>Selesai</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}

const thStyle = { 
    padding: '25px', textAlign: 'left', color:'#444', fontSize:'12px', letterSpacing:'1px', fontWeight:'700' 
};