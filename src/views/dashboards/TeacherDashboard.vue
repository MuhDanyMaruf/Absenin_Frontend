<template>
  <div
    class="min-h-screen bg-[#FDFBF7] font-poppins antialiased text-slate-700 relative overflow-x-hidden"
  >
    <Transition name="toast-fade">
      <div
        v-if="toast.visible"
        class="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-slate-150 px-5 py-3.5 rounded-2xl shadow-xl max-w-sm border-l-4"
        :class="
          toast.type === 'error' ? 'border-l-rose-500' : 'border-l-emerald-500'
        "
      >
        <span class="text-lg">{{ toast.type === "error" ? "⚠️" : "✨" }}</span>
        <div>
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wide">
            {{ toast.title }}
          </h4>
          <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {{ toast.message }}
          </p>
        </div>
      </div>
    </Transition>

    <header
      class="bg-white border-b border-slate-100 sticky top-0 z-10 px-6 md:px-10 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm"
    >
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <div
          class="w-11 h-11 bg-[#4A5D4E] text-white rounded-xl flex items-center justify-center font-bold text-base shadow-sm"
        >
          G
        </div>
        <div>
          <h1 class="text-sm font-bold text-slate-800 tracking-wide uppercase">
            Portal Presensi Guru
          </h1>
          <p class="text-xs text-slate-400 font-semibold mt-0.5">
            {{ tanggalHariIni }}
          </p>
        </div>
      </div>

      <nav class="bg-slate-100/80 p-1 rounded-xl flex gap-1 w-full sm:w-auto">
        <button
          v-for="tab in ['overview', 'absensi', 'nilai']"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer flex-1 sm:flex-none text-center',
            activeTab === tab
              ? 'bg-[#4A5D4E] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-600',
          ]"
        >
          {{
            tab === "overview"
              ? "👁️ Overview"
              : tab === "absensi"
                ? "📝 Presensi"
                : "📊 Tugas & Nilai"
          }}
        </button>
      </nav>

      <div class="flex items-center gap-4 hidden md:flex">
        <span
          class="text-xs font-bold text-[#4A5D4E] bg-[#EAF0EC] px-4 py-2 rounded-xl"
          >👤 {{ guruInfo.username }}</span
        >
        <button
          @click="handleLogout"
          class="text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl bg-white transition cursor-pointer"
        >
          Keluar
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-4 md:p-8">
      <OverviewSection
        v-if="activeTab === 'overview'"
        :listJadwal="listJadwal"
        :statusAksesJadwal="statusAksesJadwal"
        :hariSekarangString="hariSekarangString"
      />

      <PresensiSection
        v-if="activeTab === 'absensi'"
        :listJadwal="listJadwal"
        :agendaTerpilih="agendaTerpilih"
        :listSiswa="listSiswa"
        :payloadAbsen="payloadAbsen"
        :statusAksesJadwal="statusAksesJadwal"
        :hitungStatus="hitungStatus"
        :btnLoading="btnLoading"
        @pilih-kelas="pilihAgenda"
        @simpan-absen="simpanPresensi"
        @unduh-dokumen="unduhDokumen"
      />

      <NilaiSection
        v-if="activeTab === 'nilai'"
        @toast-pemicu="
          showToast(
            'success',
            'Nilai Tersimpan',
            'Berhasil melakukan sinkronisasi lembar nilai ke raport digital.',
          )
        "
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";

// IMPORT TIGA FILE SUB-COMPONENTS BARU
import OverviewSection from "./components/OverviewGuruSection.vue";
import PresensiSection from "./components/PresensiSection.vue";
import NilaiSection from "./components/NilaiSection.vue";

const router = useRouter();
const activeTab = ref("overview");

const listJadwal = ref([]);
const listSiswa = ref([]);
const agendaTerpilih = ref(null);
const btnLoading = ref(false);
const guruInfo = ref({ id: null, username: "", email: "" });
const payloadAbsen = ref({});

const statusAksesJadwal = reactive({});
let intervalId = null;

const tanggalHariIni = ref(
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);
const hariSekarangString = ref(
  new Date().toLocaleDateString("id-ID", { weekday: "long" }),
);

const toast = reactive({
  visible: false,
  type: "success",
  title: "",
  message: "",
});
const showToast = (type, title, message) => {
  toast.type = type;
  toast.title = title;
  toast.message = message;
  toast.visible = true;
  setTimeout(() => {
    toast.visible = false;
  }, 4000);
};

const hitungStatus = computed(() => {
  const rekap = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0 };
  Object.values(payloadAbsen.value).forEach((status) => {
    const formatted =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    if (rekap[formatted] !== undefined) rekap[formatted]++;
  });
  return rekap;
});

const hitungSeluruhCountdown = () => {
  const sekarang = new Date();
  const totalDetikSekarang =
    sekarang.getHours() * 3600 +
    sekarang.getMinutes() * 60 +
    sekarang.getSeconds();

  listJadwal.value.forEach((jadwal) => {
    if (hariSekarangString.value.toLowerCase() !== jadwal.hari.toLowerCase()) {
      statusAksesJadwal[jadwal.jadwal_id] = {
        bisaDiakses: false,
        stringCountdown: `Bukan Hari Ini (${jadwal.hari})`,
      };
      return;
    }

    const [jamMulai, menitMulai] = jadwal.jam_mulai.split(":").map(Number);
    const totalDetikMulai = jamMulai * 3600 + menitMulai * 60;

    // 🌟 SINKRONISASI NAMA VARIABEL (Pastikan atas bawah sama namanya)
    const toleransiMulaiDetik = 10 * 60;

    if (totalDetikSekarang >= totalDetikMulai - toleransiMulaiDetik) {
      statusAksesJadwal[jadwal.jadwal_id] = {
        bisaDiakses: true,
        stringCountdown: "🟢 Sesi Mengajar Aktif",
      };
    } else {
      const selisihDetik = totalDetikMulai - totalDetikSekarang;
      const sisaJam = Math.floor(selisihDetik / 3600);
      const sisaMenit = Math.floor((selisihDetik % 3600) / 60);
      const sisaDetik = selisihDetik % 60;

      statusAksesJadwal[jadwal.jadwal_id] = {
        bisaDiakses: false,
        stringCountdown: `${String(sisaJam).padStart(2, "0")}:${String(sisaMenit).padStart(2, "0")}:${String(sisaDetik).padStart(2, "0")}`,
      };
    }
  });
};

const loadJadwalGuru = async () => {
  if (!guruInfo.value.id) return;
  try {
    const res = await api.get(`/guru/jadwal/${guruInfo.value.id}`);
    if (res.data.success) {
      listJadwal.value = res.data.data;
      hitungSeluruhCountdown();
    }
  } catch (error) {
    console.error(error);
  }
};

const pilihAgenda = async (jadwal) => {
  const akses = statusAksesJadwal[jadwal.jadwal_id];
  if (akses && !akses.bisaDiakses && !jadwal.is_locked_today) {
    showToast(
      "error",
      "Sesi Terkunci",
      `Akses ditolak! Jadwal kelas dibuka tepat 10 menit sebelum pelajaran mulai.`,
    );
    return;
  }
  agendaTerpilih.value = { ...jadwal };
  listSiswa.value = [];
  payloadAbsen.value = {};

  try {
    const resSiswa = await api.get(`/guru/siswa-per-kelas/${jadwal.kelas_id}`);
    if (!resSiswa.data.success) return;
    listSiswa.value = resSiswa.data.data;

    const resHistory = await api.get(
      `/guru/cek-absensi-hari-ini?jadwal_id=${jadwal.jadwal_id}`,
    );
    if (resHistory.data.success && resHistory.data.already_exists) {
      agendaTerpilih.value.is_locked_today = true;
      resHistory.data.data.forEach((row) => {
        payloadAbsen.value[row.siswa_id] = row.status;
      });
    } else {
      agendaTerpilih.value.is_locked_today = false;
      listSiswa.value.forEach((siswa) => {
        payloadAbsen.value[siswa.id] = "Hadir";
      });
    }
  } catch (error) {
    showToast("error", "Error", "Gagal sinkronisasi.");
  }
};

const simpanPresensi = async () => {
  btnLoading.value = true;
  try {
    const dataKirim = {
      jadwal_id: agendaTerpilih.value.id || agendaTerpilih.value.jadwal_id,
      guru_id: guruInfo.value.id,
      daftar_kehadiran: payloadAbsen.value,
    };
    const res = await api.post("/guru/absensi", dataKirim);
    if (res.data.success) {
      showToast(
        "success",
        "Presensi Dikunci",
        `Seluruh data presensi kelas ${agendaTerpilih.value.nama_kelas} sukses dikunci!`,
      );
      agendaTerpilih.value.is_locked_today = true;
      await loadJadwalGuru();
    }
  } catch (error) {
    showToast("error", "Gagal", "Ditolak server.");
  } finally {
    btnLoading.value = false;
  }
};

const unduhDokumen = (tipeDokumen) => {
  const urlDownload = `http://localhost:5000/api/guru/export/${tipeDokumen}?kelas_id=${agendaTerpilih.value.kelas_id}&mapel_id=${agendaTerpilih.value.mapel_id}&hari=${agendaTerpilih.value.hari}`;
  window.open(urlDownload, "_blank");
};

const loadGuruSession = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  if (!userId || userId === "null") {
    router.push("/login");
    return false;
  }
  guruInfo.value = { id: parseInt(userId), username: username || "Pengajar" };
  return true;
};

const handleLogout = () => {
  localStorage.clear();
  router.push("/login");
};

onMounted(async () => {
  if (loadGuruSession()) {
    await loadJadwalGuru();
    intervalId = setInterval(hitungSeluruhCountdown, 1000);
  }
});
onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap");
.font-poppins {
  font-family: "Poppins", sans-serif;
}
.animate-fade-in {
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.toast-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}
.toast-fade-leave-to {
  transform: translateX(40px);
  opacity: 0;
}
</style>
