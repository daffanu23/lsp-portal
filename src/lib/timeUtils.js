export function formatTimeAgo(dateString) {
  if (!dateString) return '';

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date; // Selisih dalam milidetik
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  // LOGIKA KELIPATAN 10 MENIT
  if (diffMinutes < 10) {
    return "Baru saja diupload";
  } 
  
  if (diffMinutes < 60) {
    // Membulatkan ke bawah kelipatan 10 (contoh: 15 -> 10, 48 -> 40)
    const kelipatan = Math.floor(diffMinutes / 10) * 10;
    return `${kelipatan} Menit yang lalu`;
  }

  if (diffHours < 24) {
    return `${diffHours} Jam yang lalu`;
  }

  if (diffDays < 30) {
    return `${diffDays} Hari yang lalu`;
  }

  return `${diffMonths} Bulan yang lalu`;
}