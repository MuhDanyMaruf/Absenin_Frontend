<template>
  <div
    class="min-h-screen w-full bg-neutral-50 font-sans antialiased text-neutral-800"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoginView from "./views/LoginView.vue";
import RegisterView from "./views/RegisterView.vue";
import "./assets/main.css";

// Import komponen dashboard masing-masing role
import StudentDashboard from "./views/dashboards/StudentDashboard.vue";
import TeacherDashboard from "./views/dashboards/TeacherDashboard.vue";
import AdminDashboard from "./views/dashboards/AdminDashboard.vue";

/**
 * State untuk menentukan halaman mana yang sedang aktif.
 * Nilai bisa: 'login', 'register', 'dashboard-siswa', 'dashboard-guru', 'dashboard-admin'
 */
const currentPage = ref("login");

/**
 * Fungsi untuk mengubah halaman aktif (digunakan oleh login link & register link)
 */
const navigateTo = (pageName) => {
  currentPage.value = pageName;
};

/**
 * Fungsi menangkap sinyal sukses login dari LoginView
 * @param {Object} userData - berisi data payload termasuk jenis role
 */
const handleLoginSuccess = (userData) => {
  console.log("User berhasil diverifikasi di App.vue:", userData);

  // Mengubah halaman aktif ke dashboard sesuai dengan role-nya
  currentPage.value = `dashboard-${userData.role}`;
};
</script>

<style>
/* Animasi transisi halus saat berpindah halaman */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
