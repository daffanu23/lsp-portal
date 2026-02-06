'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext'; // Asumsi pakai context ini
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { User, Mail, Phone, AtSign, Save, Loader2, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // --- STATE BARU: PROFILE FORM ---
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    phone: '',
    email: '' 
  });
  const [saving, setSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load Data saat User Ready
  useEffect(() => {
    if (user) {
      fetchHistory(user.email);
      fetchProfileData(user.id, user.email);
    }
  }, [user]);

  // 1. Fetch History (KODE ANDA TETAP SAMA)
  const fetchHistory = async (email) => {
    const { data, error } = await supabase
      .from('tbl_registrasi')
      .select(`*, tbl_m_event (nama_event, tanggal_mulai, harga)`)
      .eq('email', email)
      .order('tgl_daftar', { ascending: false });

    if (!error) setHistory(data);
    setLoadingData(false);
  };

  // 2. Fetch Profile Data (BARU)
  const fetchProfileData = async (userId, userEmail) => {
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (data) {
        setProfile({
            full_name: data.full_name || '',
            username: data.username || '',
            phone: data.phone || '',
            email: data.email || userEmail
        });
    } else {
        // Fallback jika belum ada di tabel profiles
        setProfile(prev => ({ ...prev, email: userEmail }));
    }
    setProfileLoading(false);
  };

  // 3. Update Profile (BARU)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: profile.full_name,
            username: profile.username,
            phone: profile.phone
        })
        .eq('id', user.id);

    if (error) {
        alert('Gagal update profile: ' + error.message);
    } else {
        alert('Data berhasil disimpan! ✅');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      window.location.href = '/login';
  };

  // Helper Warna Status (KODE ANDA TETAP SAMA)
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
      
      <div className="container" style={{ marginTop: '120px', marginBottom: '80px', flex:1, maxWidth:'900px', margin:'120px auto 80px auto', padding:'0 20px' }}>
        
        {/* HEADER SECTION */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'40px' }}>
            <div>
                <h1 style={{ fontSize:'28px', fontWeight:'800', marginBottom:'5px' }}>Halo, {profile.full_name || user.user_metadata?.full_name || 'User'}! 👋</h1>
                <p style={{ color:'#666', margin:0 }}>Kelola data diri dan pantau pendaftaran event.</p>
            </div>
            <button 
                onClick={handleLogout}
                style={{ 
                    padding:'10px 20px', background:'#fee2e2', color:'#ef4444', borderRadius:'8px', border:'none', 
                    fontWeight:'bold', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', fontSize:'14px'
                }}
            >
                <LogOut size={16}/> Logout
            </button>
        </div>

        {/* --- BAGIAN 1: EDIT PROFILE (BARU) --- */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', overflow: 'hidden', padding:'30px', marginBottom:'40px' }}>
            <h3 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
                <User size={20} /> Data Diri
            </h3>

            {profileLoading ? <p>Memuat profil...</p> : (
                <form onSubmit={handleUpdate} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                    
                    {/* Nama Lengkap */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>Nama Lengkap</label>
                        <div style={inputContainer}>
                            <User size={16} color="#666" />
                            <input 
                                type="text" value={profile.full_name} 
                                onChange={e => setProfile({...profile, full_name: e.target.value})} 
                                style={inputStyle} placeholder="Nama Lengkap"
                            />
                        </div>
                    </div>

                    {/* Email (Read Only) */}
                    <div>
                        <label style={labelStyle}>Email</label>
                        <div style={{...inputContainer, background:'#f3f4f6'}}>
                            <Mail size={16} color="#999" />
                            <input type="text" value={profile.email} disabled style={{...inputStyle, color:'#888', cursor:'not-allowed'}} />
                        </div>
                    </div>

                    {/* Username */}
                    <div>
                        <label style={labelStyle}>Username</label>
                        <div style={inputContainer}>
                            <AtSign size={16} color="#666" />
                            <input 
                                type="text" value={profile.username} 
                                onChange={e => setProfile({...profile, username: e.target.value})} 
                                style={inputStyle} placeholder="Username"
                            />
                        </div>
                    </div>

                    {/* No HP */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>No. Handphone / WhatsApp</label>
                        <div style={inputContainer}>
                            <Phone size={16} color="#666" />
                            <input 
                                type="text" value={profile.phone} 
                                onChange={e => setProfile({...profile, phone: e.target.value})} 
                                style={inputStyle} placeholder="08xxxxxxxxxx"
                            />
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div style={{ gridColumn: 'span 2', marginTop:'10px' }}>
                        <button type="submit" disabled={saving} style={{ 
                            background:'black', color:'white', padding:'12px 25px', borderRadius:'8px', border:'none', 
                            fontWeight:'bold', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', fontSize:'14px'
                        }}>
                            {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>

                </form>
            )}
        </div>

        {/* --- BAGIAN 2: RIWAYAT PENDAFTARAN (KODE LAMA ANDA) --- */}
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

// STYLE HELPERS
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#444', textTransform: 'uppercase' };
const inputContainer = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' };
const inputStyle = { border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: '#333' };