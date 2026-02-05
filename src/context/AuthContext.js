'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Cek sesi saat loading pertama
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        setLoading(false);
      }
    };
    checkUser();

    // Dengar perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Berubah:", event); // Debugging Log
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
        router.refresh(); // Pastikan UI refresh saat logout
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data) setRole(data.role);
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  // --- PERBAIKAN FUNGSI LOGOUT ---
  const logout = async () => {
    console.log("Tombol Logout ditekan..."); // 1. Cek apakah tombol bisa diklik
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        console.log("Berhasil SignOut dari Supabase"); // 2. Cek apakah sukses ke server
        
        setUser(null);
        setRole(null);
        router.push('/'); // Pindah ke home dulu
        router.refresh(); // Paksa refresh komponen
        
    } catch (error) {
        console.error("Gagal Logout:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);