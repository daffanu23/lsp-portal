'use client';

import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <AdminSidebar />
      <main style={{ flex: 1, marginLeft: '300px', width: 'calc(100% - 300px)' }}>
         {children}
      </main>
    </div>
  );
}