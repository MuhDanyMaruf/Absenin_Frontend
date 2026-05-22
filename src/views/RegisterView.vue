<template>
  <div
    class="min-h-screen bg-neutral-50 flex items-center justify-center p-4 antialiased font-sans"
  >
    <div
      class="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl border border-neutral-200/60 shadow-sm space-y-6"
    >
      <div class="text-center space-y-2">
        <div
          class="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-sm"
        >
          A
        </div>
        <h1 class="text-xl font-bold text-neutral-900 tracking-tight">
          Pendaftaran Akun Siswa
        </h1>
        <p class="text-xs text-neutral-400">
          Isi data diri kamu dengan lengkap sesuai data sekolah
        </p>
      </div>

      <div
        class="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl flex gap-3 items-start"
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
            >Username (NIS)</label
          >
          <InputText
            id="username"
            v-model="registerForm.username"
            placeholder="Contoh: 12345678"
            class="w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm focus:border-neutral-950"
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
            class="w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm focus:border-neutral-950"
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
              class="w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center focus:border-neutral-950"
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
              class="w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center focus:border-neutral-950"
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
            class="w-full"
            inputClass="w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm focus:border-neutral-950"
            required
          />
        </div>

        <Button
          type="submit"
          label="Daftar Akun Siswa"
          :loading="loading"
          class="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm rounded-xl transition cursor-pointer shadow-sm mt-2 border-none"
        />
      </form>

      <div class="text-center pt-2 border-t border-neutral-100">
        <p class="text-xs text-neutral-500">
          Sudah punya akun?
          <a
            href="#"
            @click.prevent="goToLogin"
            class="font-semibold text-neutral-900 hover:underline"
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
