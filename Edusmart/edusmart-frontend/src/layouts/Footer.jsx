import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-3">Tentang EduSmart</h3>
          <p className="text-sm text-gray-300">
            EduSmart adalah platform pembelajaran interaktif dengan gamifikasi
            yang mendorong semangat belajar siswa secara menyenangkan dan efektif.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Link Cepat</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/materials" className="hover:underline">Materi</a></li>
            <li><a href="/quiz" className="hover:underline">Kuis</a></li>
            <li><a href="/badges" className="hover:underline">Lencana</a></li>
            <li><a href="/leaderboard" className="hover:underline">Leaderboard</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3">Kontak</h3>
          <ul className="text-sm space-y-2">
            <li>Email: support@edusmart.com</li>
            <li>Telepon: +62 812 3456 7890</li>
            <li>Alamat: Jl. Pendidikan No. 1, Indonesia</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} EduSmart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
