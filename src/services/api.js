import axios from "axios";

const URL_API_LIVE = "https://api-absenin-sekolah.onrender.com/api";
const URL_API_LOKAL = "http://localhost:5000/api";

const api = axios.create({
  baseURL:
    window.location.hostname === "localhost" ? URL_API_LOKAL : URL_API_LIVE,
  withCredentials: true, // Tambahkan ini agar sinkronisasi session/cookie aman
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
