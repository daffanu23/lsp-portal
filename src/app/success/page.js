'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const regId = searchParams.get('reg_id');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <Navbar />
      
      <div style={{ textAlign: 'center', padding: '20px', maxWidth:'500px' }}>
        
        {/* Ikon Jam / Menunggu */}
        <div style={{ 
            width: '80px', height: '80px', background: '#FFC107', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' 
        }}>
            <span style={{ fontSize: '40px', color: 'white' }}>⏳</span>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '10px' }}>Pendaftaran Diterima</h1>
        <p style={{ color: '#666', lineHeight:'1.6' }}>
            Data pendaftaran Anda dengan ID <strong>#{regId}</strong> telah masuk ke sistem kami.
            <br/><br/>
            <strong>Status Saat Ini: Menunggu Verifikasi Admin</strong>
            <br/>
            Admin kami akan segera memverifikasi data (dan pembayaran) Anda. Silakan cek email atau WhatsApp secara berkala.
        </p>

        <div style={{ marginTop:'30px' }}>
            <Link href="/" style={{ padding: '12px 25px', background: 'black', borderRadius: '8px', textDecoration: 'none', color: 'white', fontWeight: '600' }}>
                Kembali ke Beranda
            </Link>
        </div>
      </div>
    </div>
  );
}