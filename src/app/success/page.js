'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'; // <--- 1. Import Suspense
import Link from 'next/link';

// 2. Buat Komponen TERPISAH untuk isi kontennya
function SuccessContent() {
  const searchParams = useSearchParams(); // Gunakan useSearchParams di sini
  const orderId = searchParams.get('order_id'); // Contoh ambil data

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Pembayaran Berhasil! 🎉</h1>
      {orderId && <p>Order ID: {orderId}</p>}
      <Link href="/">Kembali ke Beranda</Link>
    </div>
  );
}

// 3. Komponen UTAMA hanya memanggil Suspense
export default function SuccessPage() {
  return (
    // Fallback adalah tampilan loading sebentar saat parameter URL dibaca
    <Suspense fallback={<div style={{textAlign:'center', padding:'50px'}}>Memuat data...</div>}>
      <SuccessContent />
    </Suspense>
  );
}