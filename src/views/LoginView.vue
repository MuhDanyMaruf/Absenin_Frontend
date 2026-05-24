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

        <h1
          class="text-xl text-[#F0F0F0] font-bold text-neutral-800 tracking-tight"
        >
          Selamat Datang
        </h1>
        <p class="text-xs text-neutral-400">
          Silakan masuk ke akun Absensi Sekolah kamu
        </p>
      </div>

      <div class="bg-neutral-100 p-1 rounded-xl grid grid-cols-3 gap-1">
        <button
          v-for="role in roles"
          :key="role.value"
          type="button"
          @click="selectedRole = role.value"
          :class="[
            'py-2 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer',
            selectedRole === role.value
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-600',
          ]"
        >
          {{ role.label }}
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="flex flex-col gap-1.5">
          <label
            for="identifier"
            class="text-xs font-semibold text-neutral-600"
          >
            {{
              selectedRole === "siswa"
                ? "Nama atau NIS Siswa"
                : selectedRole === "guru"
                  ? "Nama atau Email Guru"
                  : "Username Admin"
            }}
          </label>
          <InputText
            id="identifier"
            v-model="loginForm.identifier"
            :placeholder="getPlaceholder"
            class="custom-input w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm outline-none transition-all duration-300"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between items-center">
            <label for="password" class="text-xs font-semibold text-neutral-600"
              >Password</label
            >
            <a
              href="#"
              class="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition"
              >Lupa password?</a
            >
          </div>
          <Password
            id="password"
            v-model="loginForm.password"
            placeholder="••••••••"
            :feedback="false"
            toggleMask
            class="w-full custom-password-wrapper"
            inputClass="custom-input w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm outline-none transition-all duration-300"
            required
          />
        </div>

        <Button
          type="submit"
          :label="'Masuk sebagai ' + getRoleLabel"
          :loading="loading"
          class="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl transition-all duration-300 transform active:scale-[0.99] cursor-pointer shadow-sm mt-2 border-none"
        />
      </form>

      <div
        v-if="selectedRole === 'siswa'"
        class="text-center pt-2 border-t border-neutral-100"
      >
        <p class="text-xs text-neutral-500">
          Belum punya akun?
          <a
            href="#"
            @click.prevent="goToRegister"
            class="font-semibold text-neutral-900 hover:underline ms-1"
          >
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import api from "../services/api";
// 🌟 1. Import SweetAlert2
import Swal from "sweetalert2";

const emit = defineEmits(["switch-page", "login-success"]);
const router = useRouter();
const loading = ref(false);
const selectedRole = ref("siswa");

const roles = [
  { label: "Siswa", value: "siswa" },
  { label: "Guru", value: "guru" },
  { label: "Admin", value: "admin" },
];

const loginForm = reactive({
  identifier: "",
  password: "",
});

const getPlaceholder = computed(() => {
  if (selectedRole.value === "siswa") return "Masukkan Nama atau NIS kamu";
  if (selectedRole.value === "guru") return "Masukkan Nama atau email guru";
  return "Masukkan username admin";
});

const getRoleLabel = computed(() => {
  return roles.find((r) => r.value === selectedRole.value)?.label || "User";
});

const handleLogin = async () => {
  loading.value = true;

  const payload = {
    identifier: loginForm.identifier.trim(),
    password: loginForm.password.trim(),
  };

  // 🌟 2. Jalankan Animasi Loading SweetAlert2
  Swal.fire({
    title: "Memproses Login...",
    text: "Mohon tunggu sebentar, sedang memverifikasi data.",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await api.post("/auth/login", payload);

    if (response.data.success) {
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("role", user.role);

      emit("login-success", user);

      // 🌟 3. Ubah Modal Loading menjadi Modal Sukses Otomatis
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: `Selamat datang kembali, ${user.username || "User"}!`,
        timer: 1500, // Akan tertutup otomatis dalam 1.5 detik
        showConfirmButton: false,
      }).then(() => {
        // Alihkan halaman SETELAH animasi sukses selesai
        if (user.role === "admin") {
          router.push("/dashboard/admin");
        } else if (user.role === "guru") {
          router.push("/dashboard/guru");
        } else {
          router.push("/dashboard/siswa");
        }
      });
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      "Terjadi kesalahan pada server atau kredensial tidak cocok.";

    // 🌟 4. Ubah Modal Loading menjadi Modal Peringatan Eror
    Swal.fire({
      icon: "error",
      title: "Akses Ditolak",
      text: errorMsg,
      confirmButtonText: "Coba Lagi",
      confirmButtonColor: "#10b981", // Emerald 500
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-bold text-sm px-6 py-2.5",
      },
    });
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
/* ── OVERRIDE PRIMEVUE & EFFECT INTERAKTIF ── */

:deep(.custom-input),
:deep(.p-inputtext) {
  background-color: #f9fafb !important;
  color: #1f2937 !important;
  border: 1px solid #e5e7eb !important;
}

:deep(.custom-input::placeholder) {
  color: #9ca3af !important;
}

:deep(.custom-input:focus),
:deep(.p-inputtext:focus) {
  background-color: #ffffff !important;
  border-color: #10b981 !important;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15) !important;
}

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
