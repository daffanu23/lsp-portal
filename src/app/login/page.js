'use client';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const { user, loginWithGoogle } = useAuth();
  const router = useRouter();

  // Kalau sudah login, tendang ke home
  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection:'column', background: '#f4f4f4' }}>
      <Navbar />
      <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center' }}>
          
          <div style={{ background: 'white', padding: '50px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth:'400px', width:'100%' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px' }}>Selamat Datang</h1>
            <p style={{ color:'#666', marginBottom:'30px' }}>Masuk untuk mendaftar sertifikasi atau mengelola sistem.</p>
            
            <button 
                onClick={loginWithGoogle}
                style={{ 
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                    width: '100%', padding: '15px', background: 'white', color: '#333', 
                    border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize:'16px', fontWeight:'600',
                    transition:'0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
                {/* Logo Google SVG */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" style={{ width:'20px' }} />
                Masuk dengan Google
            </button>
          </div>

      </div>
    </div>
  );
}