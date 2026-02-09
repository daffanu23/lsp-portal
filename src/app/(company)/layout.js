import CompanyHeader from '@/components/CompanyHeader';

export default function CompanyLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>
      <CompanyHeader />
      <div className="container" style={{ paddingBottom: '80px', maxWidth:'1200px', margin:'0 auto' }}>
         {children}
      </div>
    </div>
  );
}