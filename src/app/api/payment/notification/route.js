import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Pake supabase-js biasa karena ini di server murni
import Midtrans from 'midtrans-client';

// Setup Supabase (Admin Mode) supaya bisa update tabel tanpa login user
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  // Note: Sebaiknya pakai SERVICE_ROLE_KEY di env jika ada RLS ketat, tapi ANON KEY + Policy Update Public sudah cukup untuk sekarang.
);

const apiClient = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function POST(request) {
    try {
        const notificationJson = await request.json();
        
        // Verifikasi status transaksi ke Midtrans langsung (Biar gak ditipu postman palsu)
        const statusResponse = await apiClient.transaction.notification(notificationJson);
        
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const paymentType = statusResponse.payment_type;

        let updateData = {};

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                // Transaksi dicurigai
                updateData = { payment_status: 'Challenge' };
            } else if (fraudStatus == 'accept') {
                // Transaksi sukses (Kartu Kredit)
                updateData = { 
                    payment_status: 'Paid', 
                    status: 'Confirmed', // Auto ACC
                    payment_method: paymentType 
                };
            }
        } else if (transactionStatus == 'settlement') {
            // Transaksi sukses (BCA, Gopay, dll)
            updateData = { 
                payment_status: 'Paid', 
                status: 'Confirmed', // Auto ACC
                payment_method: paymentType 
            };
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            // Transaksi gagal
            updateData = { payment_status: 'Failed' };
        } else if (transactionStatus == 'pending') {
            updateData = { payment_status: 'Pending' };
        }

        // UPDATE DATABASE SUPABASE
        if (Object.keys(updateData).length > 0) {
            const { error } = await supabase
                .from('tbl_registrasi')
                .update(updateData)
                .eq('id_reg', orderId); // Midtrans Order ID = ID Reg kita
            
            if (error) console.error('Supabase Error:', error);
        }

        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error('Midtrans Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}