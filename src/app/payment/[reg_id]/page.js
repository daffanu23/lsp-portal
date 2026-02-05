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
  const [loadingPay, setLoadingPay] = useState(false);

  // 1. Load Snap JS Script secara dinamis
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 2. Fetch Data Registrasi
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

  // 3. Fungsi Bayar Midtrans
  const handlePay = async () => {
    setLoadingPay(true);

    // Minta Token ke API Server kita sendiri (Langkah 2 tadi)
    const response = await fetch('/api/payment/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_reg: data.id_reg,
        total: data.tbl_m_event.harga,
        customer_details: {
          nama: data.nama_lengkap,
          email: data.email,
          phone: data.no_hp
        }
      })
    });

    const { token } = await response.json();

    // Munculkan Popup Midtrans
    window.snap.pay(token, {
      onSuccess: function(result){
        // User berhasil bayar -> Redirect ke Sukses
        // (Nanti database diupdate otomatis oleh Webhook di Langkah 4)
        router.push(`/success?reg_id=${reg_id}`);
      },
      onPending: function(result){
        alert("Menunggu pembayaran...");
      },
      onError: function(result){
        alert("Pembayaran gagal!");
        setLoadingPay(false);
      },
      onClose: function(){
        alert('Anda menutup popup tanpa menyelesaikan pembayaran');
        setLoadingPay(false);
      }
    });
  };

  if (!data) return <div style={{textAlign:'center', paddingTop:'100px'}}>Loading...</div>;

  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <div className="container" style={{ marginTop: '140px', marginBottom: '80px', flex:1, maxWidth:'600px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign:'center' }}>
            
            <h1 style={{ fontSize:'24px', fontWeight:'800' }}>Tagihan Pembayaran</h1>
            <p style={{ color:'#666', fontSize:'14px', marginBottom:'20px' }}>ID: #{data.id_reg} • {data.tbl_m_event.nama_event}</p>
            
            <h2 style={{ fontSize:'40px', fontWeight:'800', color:'#111', marginBottom:'40px' }}>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.tbl_m_event.harga)}
            </h2>

            <button 
                onClick={handlePay}
                disabled={loadingPay}
                style={{ 
                    width:'100%', padding:'18px', background:'#0052cc', color:'white', 
                    fontWeight:'bold', borderRadius:'8px', border:'none', fontSize:'16px', cursor:'pointer'
                }}
            >
                {loadingPay ? 'Memproses...' : 'Pilih Metode Pembayaran'}
            </button>
            
            <p style={{ fontSize:'12px', color:'#888', marginTop:'20px' }}>
                Didukung oleh Midtrans Secure Payment
            </p>

        </div>
      </div>
      <Footer />
    </div>
  );
}