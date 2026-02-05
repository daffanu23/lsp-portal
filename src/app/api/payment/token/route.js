import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';

export async function POST(request) {
  try {
    // 1. CEK ENV (Apakah Server Key terbaca?)
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    console.log("--- DEBUG START ---");
    console.log("1. Cek Server Key:", serverKey ? "✅ Ada (Panjang: " + serverKey.length + ")" : "❌ KOSONG/UNDEFINED");

    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY tidak ditemukan di .env.local. Pastikan Server Restart!");
    }

    // Setup Midtrans Client
    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: serverKey,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    // 2. CEK DATA DARI FRONTEND
    const body = await request.json();
    console.log("2. Data diterima dari Frontend:", body);

    const { id_reg, total, customer_details } = body;

    // Validasi Data Sederhana
    if (!id_reg || !total || !customer_details) {
      throw new Error("Data tidak lengkap! Pastikan id_reg, total, dan customer_details dikirim.");
    }

    // Pastikan Total adalah Angka Bulat (Midtrans tidak suka koma/string)
    const grossAmount = Math.round(Number(total));

    const parameter = {
      transaction_details: {
        order_id: `REG-${id_reg}-${Date.now()}`, // Tambah timestamp biar Order ID selalu unik (Midtrans tolak Order ID duplikat)
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customer_details.nama,
        email: customer_details.email,
        phone: customer_details.phone,
      },
      credit_card: {
        secure: true
      }
    };

    console.log("3. Mengirim ke Midtrans...", parameter);

    // 3. MINTA TOKEN
    const token = await snap.createTransaction(parameter);
    console.log("4. Sukses dapat Token:", token);
    console.log("--- DEBUG END ---");

    return NextResponse.json(token);

  } catch (error) {
    console.error("🔥 ERROR FATAL DI BACKEND:", error.message);
    // Print error lengkap dari Midtrans jika ada
    if (error.ApiResponse) {
        console.error("Midtrans Response:", JSON.stringify(error.ApiResponse, null, 2));
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}