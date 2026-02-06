'use client';

import { motion } from 'framer-motion';

export default function Template({ children }) {
  return (
    <motion.div
      // Awal: Posisi di kanan (x: 50px) dan transparan
      initial={{ y: 50, opacity: 0 }} 
      
      // Akhir: Geser ke titik tengah (x: 0) dan jelas
      animate={{ y: 0, opacity: 1 }} 
      
      // Animasi: Menggunakan tipe 'easeOut' agar pendaratannya mulus
      transition={{ ease: 'easeOut', duration: 0.4 }} 
      
      // (Opsional) Style agar halaman tidak melebar saat animasi
      style={{ width: '100%', overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
}