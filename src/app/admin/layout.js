'use client';

import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* 1. Sidebar (Fixed) */}
      <AdminSidebar />
      
      {/* 2. Area Konten Utama */}
      {/* MarginLeft 300px agar tidak tertutup sidebar */}
      <main style={{ flex: 1, marginLeft: '300px', width: 'calc(100% - 300px)' }}>
         {/* Children ini adalah page.js yang akan dianimasikan */}
         {children}
      </main>

    </div>
  );
}