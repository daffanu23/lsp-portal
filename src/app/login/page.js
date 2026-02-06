'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Loader2, User, Mail, Lock, Phone, AtSign, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // Toggle Login/Register

  // Form State
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- LOGIN EMAIL BIASA ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Login Supabase (Support Email)
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      alert('Login Gagal: ' + error.message);
      setLoading(false);
    } else {
      router.push('/admin'); // Redirect ke dashboard/admin
      router.refresh();
    }
  };

  // --- REGISTER MANUAL ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validasi sederhana
    if (!form.email || !form.password || !form.fullName) {
        alert("Mohon lengkapi data wajib (Nama, Email, Password)");
        setLoading(false);
        return;
    }

    // Sign Up Supabase
    // Kita kirim data tambahan (metadata) agar ditangkap Trigger SQL
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          username: form.username,
          phone: form.phone
        }
      }
    });

    if (error) {
      alert('Registrasi Gagal: ' + error.message);
    } else {
      alert('Registrasi Berhasil! Silakan cek email untuk verifikasi (jika aktif) atau langsung login.');
      setIsRegister(false); // Balik ke mode login
    }
    setLoading(false);
  };

  // --- LOGIN GOOGLE ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '20px' }}>
      
      <div style={{ maxWidth: '450px', width: '100%', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-1px' }}>UNI</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {isRegister ? 'Buat akun baru untuk memulai.' : 'Selamat datang kembali.'}
          </p>
        </div>

        {/* TOGGLE BUTTONS */}
        <div style={{ display: 'flex', background: '#f1f1f1', padding: '5px', borderRadius: '12px', marginBottom: '30px' }}>
            <button 
                onClick={() => setIsRegister(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: !isRegister ? 'white' : 'transparent', fontWeight: !isRegister ? 'bold' : 'normal', boxShadow: !isRegister ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: '0.3s' }}
            >
                Masuk
            </button>
            <button 
                onClick={() => setIsRegister(true)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: isRegister ? 'white' : 'transparent', fontWeight: isRegister ? 'bold' : 'normal', boxShadow: isRegister ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: '0.3s' }}
            >
                Daftar
            </button>
        </div>

        {/* FORM */}
        <form onSubmit={isRegister ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Input Khusus Register */}
            {isRegister && (
                <>
                    <div style={inputGroup}>
                        <User size={18} color="#666" />
                        <input type="text" name="fullName" placeholder="Nama Lengkap" value={form.fullName} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={inputGroup}>
                        <AtSign size={18} color="#666" />
                        <input type="text" name="username" placeholder="Username (Opsional)" value={form.username} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={inputGroup}>
                        <Phone size={18} color="#666" />
                        <input type="text" name="phone" placeholder="Nomor HP / WhatsApp" value={form.phone} onChange={handleChange} style={inputStyle} />
                    </div>
                </>
            )}

            {/* Input Umum (Login & Register) */}
            <div style={inputGroup}>
                <Mail size={18} color="#666" />
                <input type="email" name="email" placeholder="Alamat Email" value={form.email} onChange={handleChange} style={inputStyle} required />
            </div>
            
            <div style={inputGroup}>
                <Lock size={18} color="#666" />
                <input type="password" name="password" placeholder="Kata Sandi" value={form.password} onChange={handleChange} style={inputStyle} required />
            </div>

            <button type="submit" disabled={loading} style={{ 
                background: 'black', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', 
                fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginTop: '10px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' 
            }}>
                {loading ? <Loader2 className="animate-spin" size={20}/> : (isRegister ? 'Buat Akun' : 'Masuk Sekarang')}
                {!loading && <ArrowRight size={18} />}
            </button>
        </form>

        {/* DIVIDER */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0', color: '#ccc', fontSize: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
            <span style={{ padding: '0 10px' }}>ATAU</span>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
        </div>

        {/* GOOGLE BUTTON */}
        <button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            style={{ 
                width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', 
                fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: '0.2s', color: '#333'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
            Lanjutkan dengan Google
        </button>

      </div>
    </div>
  );
}

// STYLES
const inputGroup = {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', 
    background: '#f9f9f9', borderRadius: '10px', border: '1px solid #eee'
};

const inputStyle = {
    border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: '#333'
};