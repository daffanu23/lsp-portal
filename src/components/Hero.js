'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation'; // <--- Hook untuk pindah halaman

export default function Hero() {
  const router = useRouter(); // Inisialisasi router

  // State Data Dropdown (Pilihan yang tersedia)
  const [listNama, setListNama] = useState([]);
  const [listLokasi, setListLokasi] = useState([]);
  const [listTanggal, setListTanggal] = useState([]);

  // State Pilihan User (Apa yang dipilih user)
  const [selectedNama, setSelectedNama] = useState('');
  const [selectedLokasi, setSelectedLokasi] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('');

  useEffect(() => {
    async function getDropdownOptions() {
      const { data } = await supabase.from('tbl_m_event').select('nama_event, alamat, tanggal_mulai');
      
      if (data) {
        const uniqueNama = [...new Set(data.map(item => item.nama_event))];
        const uniqueLokasi = [...new Set(data.map(item => item.alamat))];
        const uniqueTanggal = [...new Set(data.map(item => item.tanggal_mulai))];

        setListNama(uniqueNama);
        setListLokasi(uniqueLokasi);
        setListTanggal(uniqueTanggal);
      }
    }
    getDropdownOptions();
  }, []);

  // --- FUNGSI CARI ---
  const handleSearch = () => {
    // Kita menyusun URL dengan query parameter
    // Contoh hasil: /search?nama=Web&lokasi=Malang
    const params = new URLSearchParams();
    
    if (selectedNama) params.set('nama', selectedNama);
    if (selectedLokasi) params.set('lokasi', selectedLokasi);
    if (selectedTanggal) params.set('tanggal', selectedTanggal);

    // Pindah halaman ke /search dengan membawa data filter
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="hero-section">
      <div className="container">
        <h1 className="hero-title">Temukan Jadwal Sertifikasi</h1>
        <p className="hero-subtitle">Cari kompetensi yang sesuai dan tingkatkan karir profesionalmu.</p>
        
        <div className="search-box">
          {/* Dropdown Nama */}
          <div className="form-group">
            <label>Skema / Event</label>
            <select 
                value={selectedNama} 
                onChange={(e) => setSelectedNama(e.target.value)}
            >
              <option value="">Semua Skema</option>
              {listNama.map((nama, index) => (
                <option key={index} value={nama}>{nama}</option>
              ))}
            </select>
          </div>

          {/* Dropdown Lokasi */}
          <div className="form-group">
            <label>Lokasi</label>
            <select
                value={selectedLokasi}
                onChange={(e) => setSelectedLokasi(e.target.value)}
            >
              <option value="">Semua Lokasi</option>
              {listLokasi.map((lokasi, index) => (
                <option key={index} value={lokasi}>{lokasi}</option>
              ))}
            </select>
          </div>

          {/* Dropdown Tanggal */}
          <div className="form-group">
            <label>Tanggal Mulai</label>
            <select
                value={selectedTanggal}
                onChange={(e) => setSelectedTanggal(e.target.value)}
            >
              <option value="">Semua Tanggal</option>
              {listTanggal.map((tgl, index) => (
                <option key={index} value={tgl}>{tgl}</option>
              ))}
            </select>
          </div>

          {/* Tombol Search */}
          <button id="btn-search" onClick={handleSearch}>
            Cari Event
          </button>
        </div>
      </div>
    </section>
  );
}