'use client';

import { motion } from 'framer-motion';

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ ease: 'easeOut', duration: 0.4 }}
      style={{ width: '100%', overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
}