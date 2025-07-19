// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E429F",      // Siswa / Header
        secondary: "#0052CC",    // Aksen
        accent: "#003F8E",       // Sidebar aktif
        warning: "#FDC62E",      // Badge / highlight
        danger: "#FF3434",       // Tombol hapus/logout
        light: "#FFFFFF",        // Background umum
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
