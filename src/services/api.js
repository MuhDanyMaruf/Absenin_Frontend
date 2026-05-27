import axios from "axios";
import Swal from "sweetalert2"; // 🌟 Wajib import SweetAlert di sini

const URL_API_LIVE = "https://api-absenin-sekolah.onrender.com/api";
const URL_API_LOKAL = "http://localhost:5000/api";

const api = axios.create({
  baseURL:
    window.location.hostname === "localhost" ? URL_API_LOKAL : URL_API_LIVE,
  withCredentials: true, // Tambahkan ini agar sinkronisasi session/cookie aman
});

// ====================================================================
// 1. INTERCEPTOR REQUEST: Sisipkan JWT Token otomatis jika sudah login
// ====================================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ====================================================================
// 2. INTERCEPTOR RESPONSE: Tangkap eror Token Tidak Valid / Kedaluwarsa
// ====================================================================
api.interceptors.response.use(
  (response) => {
    // Jika respons dari backend sukses (status 200-299), teruskan saja
    return response;
  },
  (error) => {
    // 🌟 JIKA TOKEN DITOLAK KARENA TIDAK VALID (401) ATAU FORBIDDEN (403)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // 1. Bersihkan sisa-sisa data palsu/kedaluwarsa di browser secara total
      localStorage.clear();

      // 2. Tampilkan SweetAlert Peringatan
      Swal.fire({
        icon: "error",
        title: "Sesi Tidak Valid!",
        text: "Akses ditolak atau sesi login kamu telah berakhir. Silakan login kembali.",
        allowOutsideClick: false,
        confirmButtonColor: "#ef4444", // Warna merah terang
        confirmButtonText: "Ke Halaman Login",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-bold text-sm px-6 py-2.5 shadow-md",
        },
      }).then(() => {
        // 3. Redirect paksa ke halaman login (/)
        // Menggunakan window.location.href sangat ampuh untuk me-reset state aplikasi
        window.location.href = "/";
      });
    }

    return Promise.reject(error);
  },
);

export default api;
