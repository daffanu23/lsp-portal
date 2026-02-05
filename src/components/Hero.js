'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Hero() {
  const router = useRouter();
  
  // State Data Opsi
  const [options, setOptions] = useState({
    skema: [],
    daerah: [],
    jadwal: []
  });

  // State Pilihan User
  const [selected, setSelected] = useState({
    nama: '',
    lokasi: '',
    tanggal: ''
  });

  // State Kontrol Dropdown
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const dropdownRef = useRef(null);

  // Fetch Data Unik
  useEffect(() => {
    async function fetchFilterOptions() {
      const { data } = await supabase.from('tbl_m_event').select('nama_event, alamat, tanggal_mulai');
      
      if (data) {
        const uniqueSkema = [...new Set(data.map(item => item.nama_event))];
        const uniqueDaerah = [...new Set(data.map(item => item.alamat))];
        const uniqueJadwal = [...new Set(data.map(item => item.tanggal_mulai))];

        setOptions({
          skema: uniqueSkema,
          daerah: uniqueDaerah,
          jadwal: uniqueJadwal
        });
      }
    }
    fetchFilterOptions();

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type, value) => {
    setSelected({ ...selected, [type]: value });
    setActiveDropdown(null);
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selected.nama) params.append('nama', selected.nama);
    if (selected.lokasi) params.append('lokasi', selected.lokasi);
    if (selected.tanggal) params.append('tanggal', selected.tanggal);
    router.push(`/search?${params.toString()}`);
  };

  // --- STYLE DROPDOWN (MODIFIED: OPEN UPWARDS) ---
  const dropdownMenuStyle = {
    position: 'absolute',
    // Ganti 'top' jadi 'bottom' agar muncul ke atas
    bottom: '130%', 
    left: '-10px',
    width: '240px',
    background: 'rgba(30, 30, 30, 0.95)', 
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '10px',
    zIndex: 100,
    boxShadow: '0 -10px 40px rgba(0,0,0,0.5)', // Bayangan ke atas
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    maxHeight: '300px',
    overflowY: 'auto'
  };

  const itemStyle = {
    padding: '10px 15px',
    color: '#ddd',
    fontSize: '13px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: '0.2s',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  };

  return (
    <section style={{ 
        position: 'relative', height: '100vh', width: '100%', 
        background: 'url(/hero-image.jpg) no-repeat center center/cover', 
        display: 'flex', alignItems: 'flex-end', paddingBottom: '120px'
    }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        
        {/* SEARCH BAR CONTAINER */}
        <div 
            ref={dropdownRef}
            style={{ 
                background: 'rgba(40, 40, 40, 0.6)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '10px 20px', display: 'grid', 
                gridTemplateColumns: '1fr 1px 1fr 1px 1fr auto', alignItems: 'center', gap: '20px'
            }}
        >
            
            {/* 1. DROPDOWN SKEMA */}
            <div style={{ position: 'relative' }}>
                <div 
                    onClick={() => toggleDropdown('skema')}
                    style={{ display:'flex', alignItems:'center', gap:'15px', padding:'10px 0', cursor:'pointer' }}
                >
                    <img src="/User.svg" alt="icon" style={{ width:'20px', filter: 'brightness(0) invert(1)' }} />
                    <div style={{ display:'flex', flexDirection:'column', flex: 1 }}>
                        <span style={{ color:'white', fontSize:'14px', fontWeight:'700', marginBottom:'2px' }}>Skema</span>
                        <span style={{ color: selected.nama ? 'white' : '#ccc', fontSize:'11px' }}>
                            {selected.nama || 'Pilih Skema'}
                        </span>
                    </div>
                    {/* Panah (Diputar jika aktif) */}
                    <span style={{ color:'white', fontSize:'12px', transform: activeDropdown === 'skema' ? 'rotate(180deg)' : 'rotate(0deg)', transition:'0.3s' }}>▼</span>
                </div>

                {/* MENU SKEMA (UP) */}
                {activeDropdown === 'skema' && (
                    <div style={dropdownMenuStyle}>
                        <div onClick={() => handleSelect('nama', '')} style={{...itemStyle, color: '#aaa'}}>Semua Skema</div>
                        {options.skema.map((opt, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleSelect('nama', opt)}
                                style={itemStyle}
                                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ width:'1px', height:'40px', background:'rgba(255,255,255,0.2)' }}></div>

            {/* 2. DROPDOWN DAERAH */}
            <div style={{ position: 'relative' }}>
                <div 
                    onClick={() => toggleDropdown('daerah')}
                    style={{ display:'flex', alignItems:'center', gap:'15px', padding:'10px 0', cursor:'pointer' }}
                >
                    <img src="/Globe.svg" alt="icon" style={{ width:'20px', filter: 'brightness(0) invert(1)' }} />
                    <div style={{ display:'flex', flexDirection:'column', flex: 1 }}>
                        <span style={{ color:'white', fontSize:'14px', fontWeight:'700', marginBottom:'2px' }}>Daerah</span>
                        <span style={{ color: selected.lokasi ? 'white' : '#ccc', fontSize:'11px' }}>
                            {selected.lokasi || 'Pilih Daerah'}
                        </span>
                    </div>
                    <span style={{ color:'white', fontSize:'12px', transform: activeDropdown === 'daerah' ? 'rotate(180deg)' : 'rotate(0deg)', transition:'0.3s' }}>▼</span>
                </div>

                {/* MENU DAERAH (UP) */}
                {activeDropdown === 'daerah' && (
                    <div style={dropdownMenuStyle}>
                        <div onClick={() => handleSelect('lokasi', '')} style={{...itemStyle, color: '#aaa'}}>Semua Daerah</div>
                        {options.daerah.map((opt, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleSelect('lokasi', opt)}
                                style={itemStyle}
                                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ width:'1px', height:'40px', background:'rgba(255,255,255,0.2)' }}></div>

            {/* 3. DROPDOWN JADWAL */}
            <div style={{ position: 'relative' }}>
                <div 
                    onClick={() => toggleDropdown('jadwal')}
                    style={{ display:'flex', alignItems:'center', gap:'15px', padding:'10px 0', cursor:'pointer' }}
                >
                    <img src="/Trello.svg" alt="icon" style={{ width:'20px', filter: 'brightness(0) invert(1)' }} />
                    <div style={{ display:'flex', flexDirection:'column', flex: 1 }}>
                        <span style={{ color:'white', fontSize:'14px', fontWeight:'700', marginBottom:'2px' }}>Jadwal</span>
                        <span style={{ color: selected.tanggal ? 'white' : '#ccc', fontSize:'11px' }}>
                            {selected.tanggal ? new Date(selected.tanggal).toLocaleDateString('id-ID', {month: 'short'}) : 'Pilih Jadwal'}
                        </span>
                    </div>
                    <span style={{ color:'white', fontSize:'12px', transform: activeDropdown === 'jadwal' ? 'rotate(180deg)' : 'rotate(0deg)', transition:'0.3s' }}>▼</span>
                </div>

                {/* MENU JADWAL (UP) */}
                {activeDropdown === 'jadwal' && (
                    <div style={dropdownMenuStyle}>
                         <div onClick={() => handleSelect('tanggal', '')} style={{...itemStyle, color: '#aaa'}}>Semua Jadwal</div>
                        {options.jadwal.map((opt, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleSelect('tanggal', opt)}
                                style={itemStyle}
                                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                            >
                                {new Date(opt).toLocaleDateString('id-ID', {month: 'long', year: 'numeric' })}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. TOMBOL CARI */}
            <button 
                onClick={handleSearch}
                style={{ 
                    background:'white', border:'none', borderRadius:'8px', 
                    width:'45px', height:'45px', display:'flex', alignItems:'center', justifyContent:'center', 
                    cursor:'pointer', marginLeft:'10px', transition: '0.2s'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
            >
                <img src="/material-symbols_search.svg" alt="Search" style={{ width:'24px' }} />
            </button>
        </div>

      </div>
    </section>
  );
}