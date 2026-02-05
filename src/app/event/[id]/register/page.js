'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    no_hp: '',
    nik: '',
    instansi: ''
  });

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

  // --- LOGIC BARU SESUAI FLOWCHART ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isPaid = event.harga > 0;

    // Masuk DB sebagai "Pending" dan "Unpaid"
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
        // BRANCHING:
        if (isPaid) {
            // JIKA BERBAYAR -> Ke Halaman Instruksi Transfer
            router.push(`/payment/${data.id_reg}`);
        } else {
            // JIKA GRATIS -> Langsung ke Halaman Menunggu Verifikasi
            router.push(`/success?reg_id=${data.id_reg}`);
        }
    }
  };

  if (!event) return <div style={{paddingTop:'100px', textAlign:'center'}}>Loading...</div>;

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <div className="container" style={{ marginTop: '140px', marginBottom: '80px', flex:1, width:'100%', maxWidth:'1000px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            
            {/* Kiri: Info Event */}
            <div style={{ background: '#1e1e1e', color: 'white', padding: '50px' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#aaa', letterSpacing: '2px', marginBottom: '20px' }}>Form Pendaftaran</h3>
                <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.2', marginBottom: '30px' }}>{event.nama_event}</h1>
                <div style={{ display:'flex', flexDirection:'column', gap:'20px', fontSize:'14px', opacity:0.9 }}>
                    <div><strong>Tanggal:</strong> <br/>{new Date(event.tanggal_mulai).toLocaleDateString('id-ID')}</div>
                    <div><strong>Biaya:</strong> <br/>
                        <span style={{ color:'#4ade80', fontSize:'18px', fontWeight:'bold' }}>
                            {event.harga > 0 ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(event.harga) : 'Gratis'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Kanan: Form */}
            <div style={{ padding: '50px' }}>
                <h2 style={{ fontSize:'24px', fontWeight:'800', color:'#111', marginBottom:'30px' }}>Data Diri</h2>
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                    
                    <input type="text" name="nama_lengkap" required onChange={handleChange} placeholder="Nama Lengkap" style={inputStyle} />
                    <input type="email" name="email" required onChange={handleChange} placeholder="Email" style={inputStyle} />
                    <input type="text" name="no_hp" required onChange={handleChange} placeholder="No. WhatsApp" style={inputStyle} />
                    <input type="number" name="nik" required onChange={handleChange} placeholder="NIK" style={inputStyle} />
                    <input type="text" name="instansi" onChange={handleChange} placeholder="Instansi (Opsional)" style={inputStyle} />

                    <button type="submit" disabled={loading} style={{ 
                        marginTop:'20px', padding:'15px', background:'black', color:'white', 
                        borderRadius:'8px', fontWeight:'bold', border:'none', fontSize:'16px', cursor:'pointer'
                    }}>
                        {loading ? 'Menyimpan...' : 'Lanjut'}
                    </button>
                </form>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const inputStyle = { width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ddd', outline:'none' };