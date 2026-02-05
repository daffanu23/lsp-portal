'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link'; // Import Link yang ketinggalan

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory(user.email);
    }
  }, [user]);

  const fetchHistory = async (email) => {
    // Ambil data registrasi berdasarkan email user yang login
    const { data, error } = await supabase
      .from('tbl_registrasi')
      .select(`*, tbl_m_event (nama_event, tanggal_mulai, harga)`)
      .eq('email', email) // Filter punya dia sendiri
      .order('tgl_daftar', { ascending: false });

    if (!error) setHistory(data);
    setLoadingData(false);
  };

  // Helper Warna Status
  const getStatusColor = (status) => {
    if (status === 'Approved') return '#d1fae5';
    if (status === 'Rejected') return '#fee2e2';
    return '#fef3c7';
  };

  const getStatusText = (status) => {
    if (status === 'Approved') return '#065f46';
    if (status === 'Rejected') return '#991b1b';
    return '#92400e';
  };

  if (authLoading) return <div style={{textAlign:'center', paddingTop:'100px'}}>Memeriksa sesi...</div>;
  if (!user) return <div style={{textAlign:'center', paddingTop:'100px'}}>Silakan Login Terlebih Dahulu.</div>;

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      
      <div className="container" style={{ marginTop: '120px', marginBottom: '80px', flex:1, maxWidth:'900px' }}>
        
        <h1 style={{ fontSize:'28px', fontWeight:'800', marginBottom:'10px' }}>Halo, {user.user_metadata?.full_name || 'User'}! 👋</h1>
        <p style={{ color:'#666', marginBottom:'40px' }}>Berikut adalah riwayat pendaftaran sertifikasi Anda.</p>

        {/* Tabel Riwayat */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', overflow: 'hidden', padding:'30px' }}>
            <h3 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'20px' }}>Riwayat Pendaftaran</h3>

            {loadingData ? (
                <p>Memuat data...</p>
            ) : history.length === 0 ? (
                <div style={{ textAlign:'center', padding:'40px', background:'#f4f4f4', borderRadius:'8px' }}>
                    <p style={{ color:'#666', marginBottom:'15px' }}>Anda belum mendaftar event apapun.</p>
                    <Link href="/" style={{ background:'black', color:'white', padding:'10px 20px', borderRadius:'6px', textDecoration:'none', fontSize:'14px', fontWeight:'bold' }}>
                        Cari Event
                    </Link>
                </div>
            ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
                    {history.map((item) => (
                        <div key={item.id_reg} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px', border:'1px solid #eee', borderRadius:'10px' }}>
                            <div>
                                <h4 style={{ margin:'0 0 5px 0', fontSize:'16px' }}>{item.tbl_m_event?.nama_event}</h4>
                                <p style={{ margin:0, fontSize:'13px', color:'#666' }}>
                                    Daftar: {new Date(item.tgl_daftar).toLocaleDateString('id-ID')} • 
                                    ID: #{item.id_reg}
                                </p>
                            </div>
                            
                            <div style={{ textAlign:'right' }}>
                                {/* Badge Status */}
                                <span style={{ 
                                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                                    background: getStatusColor(item.status),
                                    color: getStatusText(item.status),
                                    display:'inline-block', marginBottom:'5px'
                                }}>
                                    {item.status}
                                </span>
                                
                                {/* Link Bayar (Jika masih unpaid & pending) */}
                                {item.status === 'Pending' && item.payment_status === 'Unpaid' && (
                                    <div style={{ marginTop:'5px' }}>
                                        <Link href={`/payment/${item.id_reg}`} style={{ fontSize:'12px', color:'#2563eb', fontWeight:'600', textDecoration:'none' }}>
                                            Bayar Sekarang &rarr;
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
      <Footer />
    </div>
  );
}