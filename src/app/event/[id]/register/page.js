'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { CreditCard, QrCode, MessageCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bca');
  
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    no_hp: '',
    nik: '',
    instansi: ''
  });

  const adminWA = "+6285888351950"; 

  useEffect(() => {
    async function fetchEvent() {
        const { data } = await supabase.from('tbl_m_event').select('*').eq('id_event', id).single();
        setEvent(data);
    }
    if (id) fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.from('tbl_registrasi').insert([{
        id_event: id,
        ...formData,
        total_bayar: event.harga,
        status: 'Pending',        
        payment_status: 'Unpaid'   
    }]).select().single();

    if (error) {
        alert('Gagal: ' + error.message);
        setLoading(false);
    } else {
        setIsSubmitted(true);
        setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const getWALink = () => {
    const isFree = event.harga === 0;
    let text = `Halo Admin, saya *${formData.nama_lengkap}* ingin verifikasi pendaftaran untuk skema *${event.nama_event}*.\n\n`;
    
    if (isFree) {
        text += `Event ini gratis. Berikut saya lampirkan berkas persyaratan yang diminta.`;
    } else {
        text += `Metode Pembayaran: *${paymentMethod.toUpperCase()}*.\nBerikut saya lampirkan *Bukti Transfer* dan berkas persyaratan yang diminta.`;
    }
    
    return `https://wa.me/${adminWA}?text=${encodeURIComponent(text)}`;
  };

  if (!event) return <div style={{paddingTop:'100px', textAlign:'center'}}>Loading...</div>;

  const isFree = event.harga === 0;

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <div className="container" style={{ marginTop: '140px', marginBottom: '80px', flex:1, width:'100%', maxWidth:'1000px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            
            <div style={{ background: '#1e1e1e', color: 'white', padding: '50px' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#aaa', letterSpacing: '2px', marginBottom: '20px' }}>Form Pendaftaran</h3>
                <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.2', marginBottom: '30px' }}>{event.nama_event}</h1>
                <div style={{ display:'flex', flexDirection:'column', gap:'20px', fontSize:'14px', opacity:0.9 }}>
                    <div><strong>Tanggal:</strong> <br/>{new Date(event.tanggal_mulai).toLocaleDateString('id-ID')}</div>
                    <div><strong>Biaya:</strong> <br/>
                        <span style={{ color:'#4ade80', fontSize:'18px', fontWeight:'bold' }}>
                            {event.harga > 0 ? formatRupiah(event.harga) : 'Gratis'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ padding: '50px' }}>
                {!isSubmitted ? (
                    <>
                        <h2 style={{ fontSize:'24px', fontWeight:'800', color:'#111', marginBottom:'30px' }}>Data Diri</h2>
                        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                            <input type="text" name="nama_lengkap" required value={formData.nama_lengkap} onChange={handleChange} placeholder="Nama Lengkap" style={inputStyle} />
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email" style={inputStyle} />
                            <input type="text" name="no_hp" required value={formData.no_hp} onChange={handleChange} placeholder="No. WhatsApp" style={inputStyle} />
                            <input type="number" name="nik" required value={formData.nik} onChange={handleChange} placeholder="NIK" style={inputStyle} />
                            <input type="text" name="instansi" value={formData.instansi} onChange={handleChange} placeholder="Instansi (Opsional)" style={inputStyle} />

                            {!isFree && (
                                <div style={{ marginTop:'10px' }}>
                                    <label style={{ display:'block', marginBottom:'10px', fontSize:'14px', fontWeight:'bold' }}>Metode Pembayaran</label>
                                    <div style={{ display:'flex', gap:'15px' }}>
                                        <div onClick={() => setPaymentMethod('bca')} style={{ flex:1, border: paymentMethod === 'bca' ? '2px solid black' : '1px solid #ddd', padding:'12px', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', background: paymentMethod === 'bca' ? '#f9f9f9' : 'white' }}>
                                            <CreditCard size={18} color={paymentMethod === 'bca' ? 'black' : '#888'} />
                                            <span style={{ fontWeight: paymentMethod === 'bca' ? 'bold' : 'normal', fontSize:'13px' }}>Transfer BCA</span>
                                        </div>
                                        <div onClick={() => setPaymentMethod('qris')} style={{ flex:1, border: paymentMethod === 'qris' ? '2px solid black' : '1px solid #ddd', padding:'12px', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', background: paymentMethod === 'qris' ? '#f9f9f9' : 'white' }}>
                                            <QrCode size={18} color={paymentMethod === 'qris' ? 'black' : '#888'} />
                                            <span style={{ fontWeight: paymentMethod === 'qris' ? 'bold' : 'normal', fontSize:'13px' }}>QRIS</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loading} style={{ 
                                marginTop:'20px', padding:'15px', background:'black', color:'white', 
                                borderRadius:'8px', fontWeight:'bold', border:'none', fontSize:'16px', cursor:'pointer'
                            }}>
                                {loading ? 'Memproses...' : 'Daftar Sekarang'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign:'center' }}>
                        <CheckCircle size={60} color="#10b981" style={{ margin:'0 auto 20px auto' }} />
                        <h2 style={{ fontSize:'22px', fontWeight:'800', marginBottom:'10px' }}>Pendaftaran Berhasil</h2>
                        <p style={{ color:'#666', fontSize:'14px', marginBottom:'30px', lineHeight:'1.6' }}>
                            Data Anda telah tersimpan. Silakan lanjutkan konfirmasi melalui WhatsApp Admin kami.
                        </p>

                        {!isFree && (
                            <div style={{ background:'#f8f9fa', padding:'25px', borderRadius:'12px', marginBottom:'30px', border:'1px solid #eee' }}>
                                <p style={{ fontSize:'12px', color:'#888', fontWeight:'bold', textTransform:'uppercase', marginBottom:'10px' }}>Total Tagihan</p>
                                <div style={{ fontSize:'28px', fontWeight:'900', color:'black', marginBottom:'20px' }}>{formatRupiah(event.harga)}</div>
                                
                                {paymentMethod === 'bca' ? (
                                    <div style={{ textAlign:'left', background:'white', padding:'15px', borderRadius:'8px', border:'1px solid #ddd' }}>
                                        <p style={{ fontSize:'13px', color:'#666', marginBottom:'5px' }}>Transfer ke Rekening BCA:</p>
                                        <p style={{ fontSize:'18px', fontWeight:'bold', color:'black', letterSpacing:'1px' }}>123 456 7890</p>
                                        <p style={{ fontSize:'13px', color:'#666', marginTop:'5px' }}>a.n. PT Lembaga Sertifikasi</p>
                                    </div>
                                ) : (
                                    <div style={{ textAlign:'left', background:'white', padding:'15px', borderRadius:'8px', border:'1px solid #ddd' }}>
                                        <p style={{ fontSize:'13px', color:'#666', marginBottom:'10px' }}>Scan QRIS di bawah ini:</p>
                                        <div style={{ width:'150px', height:'150px', background:'#eee', margin:'0 auto', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                            <QrCode size={40} color="#999" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <a 
                            href={getWALink()} 
                            target="_blank" 
                            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', background:'#25D366', color:'white', padding:'15px', borderRadius:'8px', textDecoration:'none', fontWeight:'bold', fontSize:'15px' }}
                        >
                            <MessageCircle size={20} /> Konfirmasi ke WhatsApp
                        </a>
                        
                        <button onClick={() => router.push(`/event/${id}`)} style={{ background:'none', border:'none', color:'#888', marginTop:'20px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>
                            Kembali ke Detail Event
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ddd', outline:'none' };