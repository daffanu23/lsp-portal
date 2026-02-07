import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Midtrans from 'midtrans-client';

// 1. Wajib Force Dynamic agar tidak di-cache oleh Next.js
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // 2. Setup Midtrans Client
    const snap = new Midtrans.Snap({
      isProduction: false, // Ubah ke true jika sudah production
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    // 3. Setup Supabase dengan SERVICE ROLE (ADMIN)
    // PENTING: Gunakan Service Role Key agar bisa bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY, // <--- GANTI INI DARI ANON KEY
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false // Wajib false di server side
        }
      }
    );

    // 4. Baca Data Notifikasi Midtrans
    const notificationJson = await request.json();

    // 5. Verifikasi Signature ke Midtrans (Security Check)
    // Ini memastikan data benar-benar dari Midtrans, bukan hacker
    const statusResponse = await snap.transaction.notification(notificationJson);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    console.log(`[Midtrans Notif] Order ID: ${orderId} | Status: ${transactionStatus}`);

    // 6. Tentukan Status Baru
    let updateData = {};

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        updateData = { payment_status: 'Challenge' };
      } else if (fraudStatus == 'accept') {
        updateData = { 
          payment_status: 'Paid', 
          status: 'Confirmed', // Auto ACC Event
          payment_method: paymentType 
        };
      }
    } else if (transactionStatus == 'settlement') {
      // Sukses (Transfer/Gopay/dll)
      updateData = { 
        payment_status: 'Paid', 
        status: 'Confirmed', 
        payment_method: paymentType 
      };
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      updateData = { payment_status: 'Failed' };
    } else if (transactionStatus == 'pending') {
      updateData = { payment_status: 'Pending' };
    }

    // 7. Update Database (Hanya jika ada perubahan status)
    if (Object.keys(updateData).length > 0) {
        
      // Kita pakai supabaseAdmin, jadi RLS akan di-bypass
      const { error } = await supabaseAdmin
        .from('tbl_registrasi')
        .update(updateData)
        .eq('id_reg', orderId); // Pastikan order_id di Midtrans = id_reg

      if (error) {
        console.error('Supabase Update Error:', error.message);
        return NextResponse.json({ error: 'Database Update Failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ status: 'OK' });

  } catch (error) {
    console.error('Midtrans Notification Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}