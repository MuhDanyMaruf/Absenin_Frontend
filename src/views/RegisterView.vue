<template>
  <div
    class="min-h-screen bg-neutral-50 flex items-center justify-center p-4 antialiased font-sans"
  >
    <div
      class="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl border border-neutral-200/60 shadow-sm space-y-6"
    >
      <div class="text-center space-y-2">
        <div class="mx-auto flex items-center justify-center">
          <img
            src="../assets/absenin.png"
            alt="Logo Absensi Sekolah"
            class="w-72 h-15 object-contain"
          />
        </div>
        <h1 class="text-xl font-bold text-neutral-800 tracking-tight">
          Pendaftaran Akun Siswa
        </h1>
        <p class="text-xs text-neutral-400">
          Isi data diri kamu dengan lengkap sesuai data sekolah
        </p>
      </div>

      <div
        class="p-3 bg-amber-50/60 border border-amber-200/40 rounded-xl flex gap-3 items-start"
      >
        <span class="text-amber-600 text-sm mt-0.5">⚠️</span>
        <p class="text-[11px] text-amber-700 leading-relaxed">
          <strong>Khusus Guru & Staf:</strong> Pendaftaran akun tidak dibuka
          secara umum. Silakan hubungi bagian Admin/Kurikulum untuk dibuatkan
          akun akses.
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="flex flex-col gap-1.5">
          <label for="username" class="text-xs font-semibold text-neutral-600"
            >Nama</label
          >
          <InputText
            id="username"
            v-model="registerForm.username"
            placeholder="Contoh: Budi"
            class="custom-register-input w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm outline-none transition-all duration-300"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-xs font-semibold text-neutral-600"
            >Email Aktif</label
          >
          <InputText
            id="email"
            type="email"
            v-model="registerForm.email"
            placeholder="siswa_baru@gmail.com"
            class="custom-register-input w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm outline-none transition-all duration-300"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="kelas" class="text-xs font-semibold text-neutral-600"
              >Kelas</label
            >
            <Select
              id="kelas"
              v-model="registerForm.kelas"
              :options="listKelas"
              placeholder="Pilih Kelas"
              class="custom-register-select w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center outline-none transition-all duration-300"
              required
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="jurusan" class="text-xs font-semibold text-neutral-600"
              >Jurusan</label
            >
            <Select
              id="jurusan"
              v-model="registerForm.jurusan"
              :options="listJurusan"
              placeholder="Pilih Jurusan"
              class="custom-register-select w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center outline-none transition-all duration-300"
              required
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-xs font-semibold text-neutral-600"
            >Buat Password</label
          >
          <Password
            id="password"
            v-model="registerForm.password"
            placeholder="passwordsiswa123"
            :feedback="false"
            toggleMask
            class="w-full custom-password-wrapper"
            inputClass="custom-register-input w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm outline-none transition-all duration-300"
            required
          />
        </div>

        <Button
          type="submit"
          label="Daftar Akun Siswa"
          :loading="loading"
          class="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl transition-all duration-300 transform active:scale-[0.99] cursor-pointer shadow-sm mt-2 border-none"
        />
      </form>

      <div class="text-center pt-2 border-t border-neutral-100">
        <p class="text-xs text-neutral-500">
          Sudah punya akun?
          <a
            href="#"
            @click.prevent="goToLogin"
            class="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline ms-1 transition-colors duration-200"
            >Masuk di sini</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Select from "primevue/select";
import { useRouter } from "vue-router";
import api from "../services/api"; // <-- IMPORT SERVICE API

const router = useRouter();
const loading = ref(false);

const registerForm = reactive({
  username: "", // Ini akan menampung data NIS saat di-POST ke backend
  email: "",
  password: "",
  role: "siswa",
  kelas: null,
  jurusan: null,
});

const listKelas = ref([
  "X IPA 1",
  "X IPA 2",
  "XI IPA 1",
  "XI IPA 2",
  "XII IPA 1",
  "XII IPS 1",
]);
const listJurusan = ref(["IPA", "IPS", "Bahasa"]);

const handleRegister = async () => {
  loading.value = true;

  try {
    // Hit endpoint register backend Express.js (Misal: /auth/register)
    const response = await api.post("/auth/register", registerForm);

    if (response.data.success) {
      alert("Pendaftaran Berhasil! Silakan login menggunakan akun kamu.");
      router.push("/login");
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Gagal melakukan registrasi.";
    alert(`Registrasi Gagal: ${errorMsg}`);
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
/* ── OVERRIDE STYLING & GLOW INTERACTIVE EFFECT ── */

/* 1. Reset & Paksa input (PrimeVue InputText & Select) menjadi warna soft putih/abu-abu */
:deep(.custom-register-input),
:deep(.custom-register-select),
:deep(.p-inputtext),
:deep(.p-select) {
  background-color: #f9fafb !important; /* Soft grey background (neutral-50) */
  color: #1f2937 !important; /* Text color */
  border: 1px solid #e5e7eb !important; /* Soft border border-neutral-200 */
}

/* Penyesuaian khusus teks placeholder di dalam Dropdown Select */
:deep(.p-select-label.p-placeholder),
:deep(.custom-register-input::placeholder) {
  color: #9ca3af !important; /* Warna teks placeholder abu-abu netral */
}

/* Penyesuaian padding text & icon panah di dalam PrimeVue Select */
:deep(.p-select-label) {
  padding-left: 0.75rem !important;
  font-size: 0.875rem !important;
  color: #1f2937 !important;
}
:deep(.p-select-dropdown) {
  color: #9ca3af !important;
  padding-right: 0.5rem !important;
}

/* 2. Efek Interaktif (Glow Emerald) saat kolom diklik atau aktif */
:deep(.custom-register-input:focus),
:deep(.custom-register-select:focus-within),
:deep(.p-inputtext:focus),
:deep(.p-select:not(.p-disabled).p-focus) {
  background-color: #ffffff !important;
  border-color: #10b981 !important; /* Border berubah jadi Hijau Emerald */
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15) !important; /* Ring pendaran cahaya */
}

/* 3. Perbaikan Posisi Ikon Mata pada Input Password PrimeVue */
:deep(.custom-password-wrapper) {
  display: inline-flex;
  position: relative;
}
:deep(.custom-password-wrapper .p-icon-field) {
  width: 100%;
}
:deep(.custom-password-wrapper svg),
:deep(.custom-password-wrapper i) {
  color: #9ca3af !important;
  position: absolute;
  right: 0.75rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  cursor: pointer;
}
</style>
