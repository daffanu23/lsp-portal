'use client';
import { supabase } from '@/lib/supabaseClient';
import { Download } from 'lucide-react';

export default function ExportButton({ eventId, eventName }) {
  
  const handleExport = async () => {
    if (!confirm(`Download data peserta untuk event "${eventName}"?`)) return;

    try {
      const { data: participants, error } = await supabase
        .from('tbl_registrasi')
        .select('*') 
        .eq('id_event', eventId);

      if (error) throw error;
      if (!participants || participants.length === 0) {
        alert('Belum ada peserta untuk event ini.');
        return;
      }

      const headers = Object.keys(participants[0]).join(',');
      const csvRows = participants.map(row => {
        return Object.values(row).map(value => {
          const stringValue = String(value);
          return `"${stringValue.replace(/"/g, '""')}"`; 
        }).join(',');
      });
      const csvString = [headers, ...csvRows].join('\n');

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Peserta_${eventName.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Gagal export:', err);
      alert('Gagal mendownload data.');
    }
  };

  return (
    <button 
      onClick={handleExport}
      title="Download Backup Data Peserta"
      style={{
        background: '#10b981',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.opacity = 0.9}
      onMouseOut={(e) => e.currentTarget.style.opacity = 1}
    >
      <Download size={18} />
    </button>
  );
}