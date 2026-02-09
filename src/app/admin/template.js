'use client';
import { motion } from 'framer-motion';

export default function AdminTemplate({ children }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeOut', duration: 0.4 }}
      style={{ padding: '50px 60px' }}
    >
      {children}
    </motion.div>
  );
}