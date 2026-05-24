<template>
  <div class="space-y-6 animate-fade-in">
    <div v-if="!modeDetail" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div
        class="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col"
      >
        <div class="flex justify-between items-center mb-6">
          <h3
            class="text-base font-black text-slate-800 uppercase tracking-widest"
          >
            {{ namaBulan[currentMonth] }} {{ currentYear }}
          </h3>
          <div class="flex gap-2">
            <button
              @click="prevMonth"
              class="w-8 h-8 flex justify-center items-center rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              @click="nextMonth"
              class="w-8 h-8 flex justify-center items-center rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2 mb-2">
          <div
            v-for="hari in namaHari"
            :key="hari"
            class="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2"
          >
            {{ hari }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2 flex-1">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="aspect-square flex justify-center items-center relative"
          >
            <button
              v-if="day"
              @click="pilihTanggal(day)"
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200',
                isSelected(day)
                  ? 'bg-[#1E293B] text-white shadow-md transform scale-110'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                isToday(day) && !isSelected(day)
                  ? 'border-2 border-slate-200'
                  : '',
              ]"
            >
              {{ day }}

              <span
                v-if="cekAdaData(day)"
                class="absolute bottom-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 flex flex-col gap-4">
        <div
          class="bg-[#1E293B] text-white p-6 rounded-3xl shadow-sm relative overflow-hidden h-full flex flex-col"
        >
          <div
            class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"
          ></div>

          <h4
            class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
          >
            Ringkasan Absensi
          </h4>
          <h2 class="text-lg font-black tracking-wide mb-6">
            {{ formatTanggalTeks(selectedDate) }}
          </h2>

          <div
            v-if="riwayatTerpilih"
            class="flex-1 flex flex-col justify-between z-10"
          >
            <div>
              <div
                class="inline-block px-3 py-1 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider mb-2 text-emerald-300"
              >
                ✔️ Terekam
              </div>
              <h3 class="text-2xl font-black mb-1 uppercase">
                {{ riwayatTerpilih.nama_kelas }}
              </h3>
              <p class="text-xs text-slate-300 font-medium">
                Total Siswa:
                <span class="text-white font-bold"
                  >{{ riwayatTerpilih.total_siswa }} Anak</span
                >
              </p>

              <div class="grid grid-cols-2 gap-3 mt-6">
                <div class="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p class="text-[10px] text-slate-400 font-bold uppercase">
                    Hadir
                  </p>
                  <p class="text-xl font-black text-emerald-400">
                    {{ riwayatTerpilih.stats.hadir }}
                  </p>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p class="text-[10px] text-slate-400 font-bold uppercase">
                    Alfa / Bolos
                  </p>
                  <p class="text-xl font-black text-rose-400">
                    {{
                      riwayatTerpilih.stats.alfa + riwayatTerpilih.stats.bolos
                    }}
                  </p>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p class="text-[10px] text-slate-400 font-bold uppercase">
                    Sakit
                  </p>
                  <p class="text-xl font-black text-amber-400">
                    {{ riwayatTerpilih.stats.sakit }}
                  </p>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p class="text-[10px] text-slate-400 font-bold uppercase">
                    Izin
                  </p>
                  <p class="text-xl font-black text-blue-400">
                    {{ riwayatTerpilih.stats.izin }}
                  </p>
                </div>
              </div>
            </div>

            <button
              @click="bukaDetail"
              class="w-full mt-6 py-3.5 bg-white text-[#1E293B] hover:bg-slate-100 text-sm font-black rounded-xl transition cursor-pointer shadow-lg"
            >
              Lihat Detail Siswa
            </button>
          </div>

          <div
            v-else
            class="flex-1 flex flex-col items-center justify-center text-center opacity-50 z-10 py-10"
          >
            <span class="text-4xl mb-3">📭</span>
            <p class="text-xs font-medium">
              Tidak ada riwayat mengajar<br />di tanggal ini.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-white p-5 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6"
    >
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5"
      >
        <div class="flex items-center gap-4">
          <button
            @click="tutupDetail"
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-600 transition cursor-pointer border-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h3
              class="text-lg font-black text-slate-800 uppercase tracking-tight"
            >
              {{ riwayatTerpilih.nama_kelas }}
            </h3>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              {{ formatTanggalTeks(selectedDate) }}
            </p>
          </div>
        </div>

        <button
          class="bg-[#2D7A4D] hover:bg-[#235F3C] text-white text-xs font-bold h-10 px-5 rounded-xl border-none cursor-pointer flex items-center justify-center gap-2 shadow-md transition w-full md:w-auto"
        >
          📥 Unduh Bukti (.xlsx)
        </button>
      </div>

      <div class="overflow-hidden border border-slate-100 rounded-2xl">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100"
            >
              <th class="py-4 px-5">Info Siswa</th>
              <th class="py-4 px-5 text-center w-40">Status Presensi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 text-sm">
            <tr
              v-for="siswa in riwayatTerpilih.listSiswa"
              :key="siswa.id"
              class="hover:bg-slate-50/50 transition duration-150"
            >
              <td class="py-3.5 px-5">
                <div class="font-bold text-slate-800">
                  {{ siswa.nama_lengkap }}
                </div>
                <div class="text-[10px] font-mono text-slate-400 mt-0.5">
                  NISN: {{ siswa.nisn || "-" }}
                </div>
              </td>
              <td class="py-3.5 px-5 text-center">
                <span
                  :class="[
                    'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex w-24 justify-center',
                    getBadgeColor(siswa.status),
                  ]"
                >
                  {{ siswa.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// --- KONFIGURASI KALENDER ---
const namaBulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const namaHari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const hariIni = new Date(); // Atau gunakan tanggal statis new Date('2026-05-25') untuk tes
const currentMonth = ref(hariIni.getMonth());
const currentYear = ref(hariIni.getFullYear());

// Format YYYY-MM-DD
const selectedDate = ref(
  formatDateStr(hariIni.getFullYear(), hariIni.getMonth(), hariIni.getDate()),
);

// --- DATA MOCKUP (Ganti dengan Fetch API Backend nantinya) ---
const listRiwayat = ref([
  {
    tanggal: "2026-05-24", // Sesuaikan format dengan selectedDate
    nama_kelas: "XI NEWTON",
    total_siswa: 32,
    stats: { hadir: 30, sakit: 1, izin: 0, alfa: 1, bolos: 0 },
    listSiswa: [
      {
        id: 1,
        nama_lengkap: "Ahmad Ardiansyah",
        nisn: "123456702",
        status: "Hadir",
      },
      {
        id: 2,
        nama_lengkap: "Alif Candra Kusuma",
        nisn: "123456701",
        status: "Sakit",
      },
      { id: 3, nama_lengkap: "Amelia", nisn: "123456729", status: "Alfa" },
      {
        id: 4,
        nama_lengkap: "Asyara Sintia R.",
        nisn: "123456703",
        status: "Hadir",
      },
    ],
  },
  {
    tanggal: "2026-05-20",
    nama_kelas: "XI ARISTOTELES",
    total_siswa: 28,
    stats: { hadir: 28, sakit: 0, izin: 0, alfa: 0, bolos: 0 },
    listSiswa: [
      {
        id: 1,
        nama_lengkap: "Budi Santoso",
        nisn: "29492492",
        status: "Hadir",
      },
      {
        id: 2,
        nama_lengkap: "Cici Lestari",
        nisn: "29492493",
        status: "Hadir",
      },
    ],
  },
]);

// --- LOGIKA KALENDER ---
function formatDateStr(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const totalDays = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0,
  ).getDate();

  // Kotak kosong sebelum tanggal 1
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Tanggal isi
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }
  return days;
});

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const pilihTanggal = (day) => {
  selectedDate.value = formatDateStr(
    currentYear.value,
    currentMonth.value,
    day,
  );
};

const isSelected = (day) => {
  return (
    selectedDate.value ===
    formatDateStr(currentYear.value, currentMonth.value, day)
  );
};

const isToday = (day) => {
  const todayStr = formatDateStr(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );
  return todayStr === formatDateStr(currentYear.value, currentMonth.value, day);
};

const cekAdaData = (day) => {
  const dateStr = formatDateStr(currentYear.value, currentMonth.value, day);
  return listRiwayat.value.some((r) => r.tanggal === dateStr);
};

// --- LOGIKA DATA ---
const modeDetail = ref(false);

const riwayatTerpilih = computed(() => {
  return (
    listRiwayat.value.find((r) => r.tanggal === selectedDate.value) || null
  );
});

const bukaDetail = () => {
  modeDetail.value = true;
};

const tutupDetail = () => {
  modeDetail.value = false;
};

// --- HELPER FORMATTING ---
const formatTanggalTeks = (dateString) => {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
};

const getBadgeColor = (status) => {
  const s = status.toLowerCase();
  if (s === "hadir") return "bg-emerald-100 text-emerald-700";
  if (s === "sakit") return "bg-amber-100 text-amber-700";
  if (s === "izin") return "bg-blue-100 text-blue-700";
  if (s === "alfa") return "bg-rose-100 text-rose-700";
  if (s === "bolos") return "bg-purple-100 text-purple-700";
  return "bg-slate-100 text-slate-700";
};
</script>
