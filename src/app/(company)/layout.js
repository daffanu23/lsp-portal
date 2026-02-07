import CompanyHeader from '@/components/CompanyHeader';

export default function CompanyLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>
      {/* Ini STATIS (Tidak beranimasi saat pindah antar page di grup ini) */}
      <CompanyHeader />

      {/* Children di bawah ini yang akan dibungkus Template & Beranimasi */}
      <div className="container" style={{ paddingBottom: '80px', maxWidth:'1200px', margin:'0 auto' }}>
         {children}
      </div>
    </div>
  );
}