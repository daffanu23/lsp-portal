'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Fungsi Login Bawaan Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMsg('Login gagal! Email atau password salah.');
      setLoading(false);
    } else {
      // Jika sukses, lempar ke halaman admin
      router.push('/admin'); 
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f4f7f6' 
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <div className="card-body">
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>
            Admin Login 🔒
          </h2>
          
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kampus.id"
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>

            {errorMsg && (
              <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginBottom: '15px' }}>
                {errorMsg}
              </p>
            )}

            <button 
              type="submit" 
              className="btn-fill" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '16px' }}
            >
              {loading ? 'Memproses...' : 'Masuk Dashboard'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/" style={{ fontSize: '14px', color: 'gray' }}>
              &larr; Kembali ke Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}