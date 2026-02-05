'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function VerifikasiPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchApplicants(); }, []);

  async function fetchApplicants() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tbl_registrasi')
      .select('*, tbl_m_event(id_event, nama_event, sisa_kuota)') // Ambil sisa kuota event juga
      .order('tgl_daftar', { ascending: false });

    if (!error) setApplicants(data || []);
    setLoading(false);
  }

  // --- LOGIKA ACC + POTONG KUOTA ---
  const handleApprove = async (regItem) => {
    const confirm = window.confirm(`Terima ${regItem.nama_lengkap}? Kuota event akan berkurang 1.`);
    if (!confirm) return;

    // 1. Cek Kuota Dulu (Client Side Check)
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

        // Sukses
        alert('Berhasil! Peserta diterima dan kuota dikurangi.');
        fetchApplicants();

    } catch (error) {
        alert('Terjadi kesalahan: ' + error.message);
    }
  };

  // Fungsi Tolak (Tetap sama)
  const handleReject = async (id) => {
    const reason = window.prompt('Alasan penolakan:');
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

  const getStatusColor = (status) => {
    if (status === 'Approved') return '#d1fae5';
    if (status === 'Rejected') return '#fee2e2';
    return '#fef3c7';
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '30px' }}>Verifikasi Pendaftar</h1>

      <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize:'14px' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #eee' }}>
            <tr>
              <th style={{ padding: '15px', textAlign:'left' }}>Peserta</th>
              <th style={{ padding: '15px', textAlign:'left' }}>Event</th>
              <th style={{ padding: '15px', textAlign:'left' }}>Metode Bayar</th>
              <th style={{ padding: '15px', textAlign:'left' }}>Status</th>
              <th style={{ padding: '15px', textAlign:'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((item) => (
              <tr key={item.id_reg} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight:'bold' }}>{item.nama_lengkap}</div>
                    <div style={{ fontSize:'12px', color:'#666' }}>{new Date(item.tgl_daftar).toLocaleDateString()}</div>
                </td>
                <td style={{ padding: '15px' }}>
                    {item.tbl_m_event?.nama_event}
                    <div style={{ fontSize:'11px', color:'#888' }}>Sisa Kuota: {item.tbl_m_event?.sisa_kuota}</div>
                </td>
                <td style={{ padding: '15px' }}>
                    {/* Tampilkan Metode Pembayaran yg dipilih user */}
                    <div style={{ fontWeight:'600', color: item.payment_method ? '#111' : '#999' }}>
                        {item.payment_method || '-'}
                    </div>
                    <div style={{ fontSize:'11px', color:'#666' }}>
                        {item.total_bayar > 0 ? `Rp ${item.total_bayar.toLocaleString()}` : 'Gratis'}
                    </div>
                </td>
                <td style={{ padding: '15px' }}>
                    <span style={{ background: getStatusColor(item.status), padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'bold', color:'#333' }}>
                        {item.status}
                    </span>
                </td>
                <td style={{ padding: '15px', textAlign:'center' }}>
                    {item.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {/* Pass 'item' object penuh, bukan cuma ID */}
                            <button onClick={() => handleApprove(item)} style={{ background: '#2563eb', color: 'white', border: 'none', padding:'6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                                ✓ ACC
                            </button>
                            <button onClick={() => handleReject(item.id_reg)} style={{ background: '#ef4444', color: 'white', border: 'none', padding:'6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                                ✕
                            </button>
                        </div>
                    ) : <span style={{ color:'#aaa', fontSize:'12px' }}>Selesai</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applicants.length === 0 && <p style={{ padding:'20px', textAlign:'center' }}>Tidak ada data.</p>}
      </div>
    </div>
  );
}