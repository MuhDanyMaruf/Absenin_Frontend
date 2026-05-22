import axios from "axios";

const api = axios.create({
  // 🌟 GANTI DENGAN URL BACKEND LIVE KAMU
  baseURL: "https://api-presensi-sekolah.onrender.com",
});

// Interceptor untuk menyisipkan JWT Token otomatis jika sudah login (Untuk request absensi nanti)
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

export default api;
