import axios from 'axios'

const api = axios.create({
  // Sesuaikan dengan port / URL server Express.js kamu
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor untuk menyisipkan JWT Token otomatis jika sudah login (Untuk request absensi nanti)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, (error) => {
  return Promise.reject(error)
})

export default api