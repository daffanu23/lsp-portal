export default function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        {/* Kolom 1 */}
        <div className="footer-col">
          <h3>LSP Teknologi Digital</h3>
          <p>&copy; 2026 LSP Teknologi Digital.<br />All Rights Reserved.</p>
          <p>Mengembangkan kompetensi SDM Indonesia menuju era digital.</p>
        </div>

        {/* Kolom 2 */}
        <div className="footer-col">
          <h3>Hubungi Kami</h3>
          <ul className="footer-links">
            <li>📍 Jl. Raya Tidar No. 100, Malang</li>
            <li>📞 (0341) 555-1234</li>
            <li>📧 info@lsp-tekno.id</li>
          </ul>
        </div>

        {/* Kolom 3 */}
        <div className="footer-col">
          <h3>Tautan Cepat</h3>
          <ul className="footer-links">
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Verifikasi Sertifikat</a></li>
            <li><a href="#">Kebijakan Privasi</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}