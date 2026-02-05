'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PaymentPage() {
  const { reg_id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(''); // State untuk pilihan user
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: reg } = await supabase
        .from('tbl_registrasi')
        .select(`*, tbl_m_event (nama_event, harga)`)
        .eq('id_reg', reg_id)
        .single();
      setData(reg);
    }
    fetchData();
  }, [reg_id]);

  const handleConfirm = async () => {
    if (!selectedMethod) return alert('Harap pilih metode pembayaran terlebih dahulu!');
    
    setLoadingBtn(true);

    // 1. UPDATE DATABASE (Simpan Pilihan User)
    const { error } = await supabase
        .from('tbl_registrasi')
        .update({ payment_method: selectedMethod })
        .eq('id_reg', reg_id);

    if (error) {
        alert('Gagal menyimpan data: ' + error.message);
        setLoadingBtn(false);
        return;
    }

    // 2. Buka WhatsApp (Di tab baru)
    const message = `Halo Admin, saya sudah melakukan pembayaran via ${selectedMethod} untuk ID Pendaftaran #${reg_id} (${data.nama_lengkap}). Mohon diverifikasi.`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');

    // 3. Redirect ke Halaman Sukses (Menunggu Verifikasi)
    router.push(`/success?reg_id=${reg_id}`);
  };

  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  if (!data) return <div style={{textAlign:'center', paddingTop:'100px'}}>Loading...</div>;

  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      
      <div className="container" style={{ marginTop: '140px', marginBottom: '80px', flex:1, maxWidth:'700px' }}>
        
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            
            <div style={{ textAlign:'center', marginBottom:'30px' }}>
                <h1 style={{ fontSize:'24px', fontWeight:'800' }}>Selesaikan Pembayaran</h1>
                <p style={{ color:'#666', fontSize:'14px' }}>ID: #{data.id_reg} • {data.tbl_m_event.nama_event}</p>
                <h2 style={{ fontSize:'36px', fontWeight:'800', color:'#d32f2f', marginTop:'10px' }}>
                    {formatRupiah(data.tbl_m_event.harga)}
                </h2>
            </div>

            <h3 style={{ fontSize:'16px', fontWeight:'700', marginBottom:'15px' }}>Pilih Metode Transfer:</h3>

            {/* OPSI 1: BCA */}
            <div 
                onClick={() => setSelectedMethod('BCA Transfer')}
                style={{ 
                    display:'flex', alignItems:'center', gap:'15px', padding:'15px', marginBottom:'10px',
                    border: selectedMethod === 'BCA Transfer' ? '2px solid black' : '1px solid #eee', 
                    background: selectedMethod === 'BCA Transfer' ? '#f9fafb' : 'white',
                    borderRadius:'8px', cursor:'pointer' 
                }}
            >
                <div style={{ width:'20px', height:'20px', borderRadius:'50%', border:'1px solid #ccc', background: selectedMethod === 'BCA Transfer' ? 'black' : 'white' }}></div>
                <div>
                    <div style={{ fontWeight:'bold' }}>BCA Virtual Account</div>
                    <div style={{ fontSize:'13px', color:'#666' }}>123-456-7890 a.n LSP Tekno</div>
                </div>
            </div>

            {/* OPSI 2: QRIS */}
            <div 
                onClick={() => setSelectedMethod('QRIS')}
                style={{ 
                    display:'flex', alignItems:'center', gap:'15px', padding:'15px', marginBottom:'20px',
                    border: selectedMethod === 'QRIS' ? '2px solid black' : '1px solid #eee',
                    background: selectedMethod === 'QRIS' ? '#f9fafb' : 'white',
                    borderRadius:'8px', cursor:'pointer' 
                }}
            >
                <div style={{ width:'20px', height:'20px', borderRadius:'50%', border:'1px solid #ccc', background: selectedMethod === 'QRIS' ? 'black' : 'white' }}></div>
                <div>
                    <div style={{ fontWeight:'bold' }}>QRIS (Gopay/OVO/Dana)</div>
                    <div style={{ fontSize:'13px', color:'#666' }}>Scan QR Code yang muncul</div>
                </div>
            </div>

            {/* TAMPILAN QR JIKA DIPILIH */}
            {selectedMethod === 'QRIS' && (
                <div style={{ textAlign:'center', padding:'20px', background:'#f0f0f0', borderRadius:'8px', marginBottom:'20px' }}>
                    <div style={{ width:'150px', height:'150px', background:'white', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" style={{width:'90%'}}/>
                    </div>
                    <p style={{ fontSize:'12px', marginTop:'10px', color:'#666' }}>Scan untuk membayar</p>
                </div>
            )}

            <button 
                onClick={handleConfirm}
                disabled={loadingBtn}
                style={{ 
                    width:'100%', padding:'15px', background:'#25D366', color:'white', 
                    fontWeight:'bold', borderRadius:'8px', border:'none', fontSize:'16px', cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'
                }}
            >
                {loadingBtn ? 'Menyimpan...' : 'Konfirmasi Pembayaran via WhatsApp'}
            </button>

        </div>
      </div>
      <Footer />
    </div>
  );
}