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
          class="text-xl text-[#4A4A4A] font-bold text-neutral-900 tracking-tight"
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
            'py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer',
            selectedRole === role.value
              ? 'bg-white text-neutral-950 shadow-sm'
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
                ? "NIS atau Email Siswa"
                : selectedRole === "guru"
                  ? "NIP atau Email Guru"
                  : "Username Admin"
            }}
          </label>
          <InputText
            id="identifier"
            v-model="loginForm.identifier"
            :placeholder="getPlaceholder"
            class="w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm focus:border-neutral-950 focus:ring-0"
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
              class="text-xs text-neutral-400 hover:text-neutral-600 transition"
              >Lupa password?</a
            >
          </div>
          <Password
            id="password"
            v-model="loginForm.password"
            placeholder="••••••••"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full h-11 px-3 border border-neutral-200 rounded-xl text-sm focus:border-neutral-950"
            required
          />
        </div>

        <Button
          type="submit"
          :label="'Masuk sebagai ' + getRoleLabel"
          :loading="loading"
          class="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm rounded-xl transition cursor-pointer shadow-sm mt-2 border-none"
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
            class="font-semibold text-neutral-900 hover:underline"
            >Daftar sekarang</a
          >
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
import api from "../services/api"; // <-- IMPORT SERVICE API

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
  if (selectedRole.value === "siswa") return "Masukkan NIS atau email kamu";
  if (selectedRole.value === "guru") return "Masukkan NIP atau email guru";
  return "Masukkan username admin";
});

const getRoleLabel = computed(() => {
  return roles.find((r) => r.value === selectedRole.value)?.label || "User";
});

const handleLogin = async () => {
  loading.value = true;

  // Gunakan .trim() untuk membuang spasi tidak sengaja di ujung teks
  const payload = {
    identifier: loginForm.identifier.trim(),
    password: loginForm.password.trim(),
  };

  console.log("Mengirim payload bersih ke Express.js:", payload);

  try {
    const response = await api.post("/auth/login", payload);

    if (response.data.success) {
      const { token, user } = response.data;

      // 1. Simpan session murni ke LocalStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("role", user.role);

      // 2. 🌟 PERBAIKAN: Gunakan 'emit' murni (TANPA embel-embel 'this.')
      emit("login-success", user);

      // 3. Alihkan rute navigasi dengan aman ke URL baru
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (user.role === "guru") {
        router.push("/dashboard/guru");
      } else {
        router.push("/dashboard/siswa");
      }
    }
  } catch (error) {
    // Kode catch lamamu
    const errorMsg =
      error.response?.data?.message || "Terjadi kesalahan pada server.";
    alert(`Login Gagal: ${errorMsg}`);
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push("/register");
};
</script>
