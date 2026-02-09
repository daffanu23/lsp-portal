'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Globe, User, Calendar, Search, ChevronDown } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const [options, setOptions] = useState({
    skema: [],
    daerah: [],
    jadwal: []
  });
  const [selected, setSelected] = useState({
    nama: '',
    lokasi: '',
    tanggal: ''
  });

  const [activeDropdown, setActiveDropdown] = useState(null); 
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchFilterOptions() {
      const { data } = await supabase
        .from('tbl_m_event')
        .select('nama_event, alamat, tanggal_mulai')
        .order('tanggal_mulai', { ascending: true });
      
      if (data) {
        const uniqueSkema = [...new Set(data.map(item => item.nama_event))];
        const uniqueDaerah = [...new Set(data.map(item => item.alamat))];
        
        const allMonths = data.map(item => 
             new Date(item.tanggal_mulai).toLocaleString('id-ID', { month: 'long', year: 'numeric' })
        );
        const uniqueJadwal = [...new Set(allMonths)];

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

  const dropdownMenuStyle = {
    position: 'absolute',
    bottom: '130%', 
    left: '-10px',
    width: '240px',
    background: 'rgba(30, 30, 30, 0.95)', 
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '10px',
    zIndex: 100,
    boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
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
        background: 'url(/hero.jpg) no-repeat center center/cover', 
        display: 'flex', alignItems: 'flex-end', paddingBottom: '120px'
    }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div 
            ref={dropdownRef}
            style={{ 
                background: 'rgba(40, 40, 40, 0.6)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '10px 20px', display: 'grid', 
                gridTemplateColumns: '1fr 1px 1fr 1px 1fr auto', alignItems: 'center', gap: '20px'
            }}
        >
        
            <div style={{ position: 'relative' }}>
                <div 
                    onClick={() => toggleDropdown('skema')}
                    style={{ display:'flex', alignItems:'center', gap:'15px', padding:'10px 0', cursor:'pointer' }}
                >
                    <User size={20} color="white" strokeWidth={2} />
                    
                    <div style={{ display:'flex', flexDirection:'column', flex: 1 }}>
                        <span style={{ color:'white', fontSize:'14px', fontWeight:'700', marginBottom:'2px' }}>Skema</span>
                        <span style={{ color: selected.nama ? 'white' : '#ccc', fontSize:'11px' }}>
                            {selected.nama || 'Pilih Skema'}
                        </span>
                    </div>
                    <ChevronDown size={16} color="white" style={{ transform: activeDropdown === 'skema' ? 'rotate(180deg)' : 'rotate(0deg)', transition:'0.3s' }} />
                </div>

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

            <div style={{ position: 'relative' }}>
                <div 
                    onClick={() => toggleDropdown('daerah')}
                    style={{ display:'flex', alignItems:'center', gap:'15px', padding:'10px 0', cursor:'pointer' }}
                >
                    <Globe size={20} color="white" strokeWidth={2} />

                    <div style={{ display:'flex', flexDirection:'column', flex: 1 }}>
                        <span style={{ color:'white', fontSize:'14px', fontWeight:'700', marginBottom:'2px' }}>Daerah</span>
                        <span style={{ color: selected.lokasi ? 'white' : '#ccc', fontSize:'11px' }}>
                            {selected.lokasi || 'Pilih Daerah'}
                        </span>
                    </div>
                    <ChevronDown size={16} color="white" style={{ transform: activeDropdown === 'daerah' ? 'rotate(180deg)' : 'rotate(0deg)', transition:'0.3s' }} />
                </div>

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

            <div style={{ position: 'relative' }}>
                <div 
                    onClick={() => toggleDropdown('jadwal')}
                    style={{ display:'flex', alignItems:'center', gap:'15px', padding:'10px 0', cursor:'pointer' }}
                >
                    <Calendar size={20} color="white" strokeWidth={2} />

                    <div style={{ display:'flex', flexDirection:'column', flex: 1 }}>
                        <span style={{ color:'white', fontSize:'14px', fontWeight:'700', marginBottom:'2px' }}>Jadwal</span>
                        <span style={{ color: selected.tanggal ? 'white' : '#ccc', fontSize:'11px' }}>
                            {selected.tanggal || 'Pilih Jadwal'}
                        </span>
                    </div>
                    <ChevronDown size={16} color="white" style={{ transform: activeDropdown === 'jadwal' ? 'rotate(180deg)' : 'rotate(0deg)', transition:'0.3s' }} />
                </div>

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
                                {opt}
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                <Search size={24} color="black" strokeWidth={2.5} />
            </button>
        </div>
      </div>
    </section>
  );
}