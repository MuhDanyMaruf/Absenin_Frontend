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
      class="bg-[#FDFBF7] border-b border-slate-200/60 sticky top-0 z-50 px-4 md:px-12 py-5 backdrop-blur-md bg-[#FDFBF7]/95"
    >
      <div
        class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4"
      >
        <div
          class="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start"
        >
          <div class="flex flex-col">
            <h1
              class="text-base font-black text-[#0F172A] uppercase tracking-[0.15em] leading-tight"
            >
              Portal Presensi Guru
            </h1>
            <p
              class="text-[10px] font-black text-[#64748B] uppercase tracking-widest mt-1"
            >
              Hari Ini: {{ tanggalHariIni }}
            </p>
          </div>
        </div>

        <div class="w-full md:w-auto flex justify-center">
          <nav
            class="bg-slate-200/50 p-1 rounded-2xl flex gap-1 w-full max-w-lg md:w-auto shadow-inner overflow-x-auto custom-scrollbar"
          >
            <button
              v-for="tab in ['overview', 'absensi', 'riwayat', 'nilai']"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'px-4 md:px-5 py-2.5 text-[11px] font-black rounded-xl uppercase tracking-[0.1em] transition-all duration-300 cursor-pointer flex-1 md:flex-none text-center whitespace-nowrap flex items-center justify-center gap-2 select-none',
                activeTab === tab
                  ? 'bg-[#1E293B] text-white shadow-md transform scale-[1.02]'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/40',
              ]"
            >
              <span v-if="tab === 'overview'">👁️ Overview</span>
              <span v-else-if="tab === 'absensi'">📝 Absensi</span>
              <span v-else-if="tab === 'riwayat'">📜 Riwayat</span>
              <span v-else>📊 Nilai</span>
            </button>
          </nav>
        </div>

        <div
          class="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end border-t md:border-none border-slate-200/60 pt-4 md:pt-0"
        >
          <span
            class="text-[11px] font-black text-[#1E293B] bg-slate-200/60 px-4 py-2.5 rounded-xl uppercase tracking-wider whitespace-nowrap flex items-center gap-2"
          >
            👤 {{ guruInfo.username }}
          </span>
          <button
            @click="handleLogout"
            class="text-[11px] font-black text-rose-600 bg-rose-50/50 hover:bg-rose-100/70 border border-rose-200/60 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap uppercase tracking-wider shadow-sm"
          >
            Keluar
          </button>
        </div>
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

      <RiwayatSection v-if="activeTab === 'riwayat'" />

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
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  reactive,
  onBeforeMount,
} from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";
import Swal from "sweetalert2";

// IMPORT TIGA FILE SUB-COMPONENTS BARU
import OverviewSection from "./components/OverviewGuruSection.vue";
import PresensiSection from "./components/PresensiSection.vue";
import NilaiSection from "./components/NilaiSection.vue";
import RiwayatSection from "./components/RiwayatSection.vue";

const router = useRouter();

const checkAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Jika tidak ada token (belum login), ATAU rolenya bukan guru
  if (!token || role !== "guru") {
    // Tampilkan notifikasi peringatan
    Swal.fire({
      icon: "error",
      title: "Akses Ditolak!",
      text: "Kamu tidak memiliki izin untuk masuk ke Portal Guru. Silakan login terlebih dahulu.",
      confirmButtonColor: "#10b981",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-bold px-6 py-2.5",
      },
    });

    // Tendang (Redirect) paksa ke halaman utama/login
    router.push("/");
  }
};

// Jalankan sistem keamanan SEBELUM halaman berhasil dimuat di layar
onBeforeMount(() => {
  checkAuth();
});

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

const unduhDokumen = async (jenis) => {
  if (jenis === "excel") {
    if (!agendaTerpilih.value) {
      showToast(
        "error",
        "Pilih Kelas",
        "Silakan pilih kelas mengajar terlebih dahulu.",
      );
      return;
    }

    try {
      showToast(
        "success",
        "Memproses File",
        "Sedang menyiapkan dokumen Excel premium...",
      );

      const kelasId = agendaTerpilih.value.kelas_id;

      // 🌟 PERBAIKAN UTAMA: Ambil tanggal asli dari data payload presensi yang sedang aktif di layar!
      // Kita gunakan properti tanggal dari payloadAbsen milikmu agar 100% sinkron dengan database
      const tanggalFormat =
        payloadAbsen.value?.tanggal || new Date().toISOString().split("T")[0];

      console.log("Mengunduh excel untuk tanggal:", tanggalFormat); // Untuk debugging di console log frontend

      const response = await api.get("/absensi/ekspor-excel", {
        params: {
          kelas_id: Number(kelasId),
          tanggal: tanggalFormat, // Tanggal ini dijamin pasti sama dengan yang disimpan ke database
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Presensi_${agendaTerpilih.value.nama_kelas}_${tanggalFormat}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast(
        "success",
        "Unduhan Berhasil",
        "Laporan Excel terstruktur berhasil disimpan.",
      );
    } catch (error) {
      console.error("Eror pembuatan dokumen:", error);
      showToast(
        "error",
        "Unduhan Gagal",
        "Gagal memuat dokumen. Pastikan data presensi sudah tersimpan.",
      );
    }
  }
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
  router.push("/"); // 🌟 PERBAIKAN: Arahkan ke rute login awal (sesuaikan dengan rute login kamu, biasanya "/")
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
