<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
    <div
      class="lg:col-span-5 bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4"
    >
      <div
        class="flex justify-between items-center border-b border-slate-50 pb-3"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">
          🗓️ Kalender Mengajar
        </h3>
        <span
          class="text-[11px] font-bold text-[#4A5D4E] bg-[#EAF0EC] px-2 py-0.5 rounded"
        >
          Mei 2026
        </span>
      </div>

      <div class="grid grid-cols-7 gap-2 text-center text-xs font-medium">
        <div
          v-for="h in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']"
          :key="h"
          class="text-slate-400 font-bold py-1"
        >
          {{ h }}
        </div>

        <div
          v-for="blank in totalKotakKosong"
          :key="'b-' + blank"
          class="py-2 text-slate-200/60 select-none"
        >
          •
        </div>

        <div
          v-for="date in totalHariBulanIni"
          :key="date"
          @click="klikTanggalKalender(date)"
          :class="[
            'py-2.5 rounded-xl transition duration-150 relative font-bold cursor-pointer flex flex-col items-center justify-center',
            isTanggalAdaKelas(date)
              ? 'bg-[#EAF0EC] text-[#4A5D4E] hover:bg-[#4A5D4E] hover:text-white'
              : 'text-slate-700 hover:bg-slate-50',
            tanggalTerpilihKalender === date
              ? 'ring-2 ring-[#4A5D4E] scale-105 shadow-sm'
              : '',
          ]"
        >
          {{ date }}
          <span
            v-if="isTanggalAdaKelas(date)"
            class="w-1 h-1 bg-[#4A5D4E] rounded-full absolute bottom-1"
          ></span>
        </div>
      </div>

      <div
        class="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2"
      >
        <p class="text-[10px] font-bold text-slate-400 uppercase">
          Detail Sesi Tanggal {{ tanggalTerpilihKalender || "..." }} Mei:
        </p>
        <div v-if="detailKelasKalender.length > 0" class="space-y-2">
          <div
            v-for="c in detailKelasKalender"
            :key="c.jadwal_id || c.id"
            class="text-xs font-medium flex justify-between border-b border-slate-200/60 pb-1.5 last:border-none last:pb-0"
          >
            <span class="font-bold text-slate-800">
              {{ c.nama_kelas }} — {{ c.nama_mapel }}
            </span>
            <span class="text-[#4A5D4E] font-semibold">
              🕒 {{ c.jam_mulai.slice(0, 5) }} WIB
            </span>
          </div>
        </div>
        <p v-else class="text-xs text-slate-400 font-medium">
          Tidak ada agenda mengajar terdaftar pada tanggal ini.
        </p>
      </div>
    </div>

    <div
      class="lg:col-span-7 bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4"
    >
      <h3
        class="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"
      >
        📢 Agenda Kelas Mengajar Hari Ini
      </h3>

      <div class="space-y-4">
        <div
          v-for="jadwal in kelasHariIni"
          :key="jadwal.jadwal_id"
          class="p-5 bg-gradient-to-r from-white to-slate-50/50 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4"
        >
          <div class="space-y-1">
            <span
              class="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#EAF0EC] text-[#4A5D4E]"
            >
              {{ jadwal.nama_mapel }}
            </span>
            <h4 class="text-base font-bold text-slate-800 tracking-tight">
              {{ jadwal.nama_kelas }}
            </h4>
            <p class="text-xs text-slate-400 font-medium">
              Sesi dimulai pukul:
              <span class="font-bold text-slate-600">
                {{ jadwal.jam_mulai.slice(0, 5) }} WIB
              </span>
            </p>
          </div>

          <div
            class="px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-center sm:text-right shadow-sm min-w-[130px]"
          >
            <p
              class="text-[9px] font-bold text-slate-400 uppercase tracking-wider"
            >
              Status Sesi
            </p>

            <div class="mt-1">
              <p
                v-if="apakahSesiSudahHabis(jadwal.jam_mulai)"
                class="text-xs font-black text-slate-400 uppercase tracking-wide flex items-center justify-center sm:justify-end gap-1.5 select-none py-0.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                Sesi Selesai
              </p>

              <p
                v-else-if="statusAksesJadwal[jadwal.jadwal_id]?.bisaDiakses"
                class="text-xs font-black text-emerald-600 uppercase tracking-wide flex items-center justify-center sm:justify-end gap-1.5 animate-pulse py-0.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Sesi Aktif
              </p>

              <p
                v-else
                class="text-sm font-black tracking-wider font-mono text-amber-600"
              >
                {{
                  statusAksesJadwal[jadwal.jadwal_id]?.stringCountdown ||
                  "00:00:00"
                }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="kelasHariIni.length === 0"
          class="text-center py-16 text-slate-400 text-xs font-semibold border border-dashed border-slate-200 rounded-xl"
        >
          🍃 Tidak ada jadwal mengajar untuk kamu pada hari
          {{ hariSekarangString }}. Selamat beristirahat!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  listJadwal: Array,
  statusAksesJadwal: Object,
  hariSekarangString: String,
});

// Mengunci kalender pada tahun 2026 dan bulan Mei (Index 4)
const tahunKalender = ref(2026);
const bulanKalender = ref(4);

const tanggalTerpilihKalender = ref(new Date().getDate()); // Default otomatis langsung ke tanggal hari ini
const detailKelasKalender = ref([]);

// 🌟 LOGIKA UTAMA: Hitung jumlah kotak kosong awal bulan Mei 2026 secara akurat
const totalKotakKosong = computed(() => {
  return new Date(tahunKalender.value, bulanKalender.value, 1).getDay(); // Mei 2026 otomatis menghasilkan nilai 5 (Jumat)
});

// Hitung total hari dalam bulan berjalan (Mei = 31 hari)
const totalHariBulanIni = computed(() => {
  return new Date(tahunKalender.value, bulanKalender.value + 1, 0).getDate();
});

// Memetakan teks nama hari JavaScript ke hari bahasa Indonesia database kamu
const dapatkanNamaHariDariTanggal = (tanggal) => {
  const listNamaHariUptodate = [
    "minggu",
    "senin",
    "selasa",
    "rabu",
    "kamis",
    "jumat",
    "sabtu",
  ];
  const indexHari = new Date(
    tahunKalender.value,
    bulanKalender.value,
    tanggal,
  ).getDay();
  return listNamaHariUptodate[indexHari];
};

const kelasHariIni = computed(() => {
  return props.listJadwal.filter(
    (j) => j.hari.toLowerCase() === props.hariSekarangString.toLowerCase(),
  );
});

// Deteksi apakah pada tanggal tertentu ada jadwal mengajar guru
const isTanggalAdaKelas = (tanggal) => {
  const namaHari = dapatkanNamaHariDariTanggal(tanggal);
  return props.listJadwal.some((j) => j.hari.toLowerCase() === namaHari);
};

// Logika interaksi klik baris tanggal kalender
const klikTanggalKalender = (tanggal) => {
  tanggalTerpilihKalender.value = tanggal;
  const namaHari = dapatkanNamaHariDariTanggal(tanggal);

  detailKelasKalender.value = props.listJadwal.filter(
    (j) => j.hari.toLowerCase() === namaHari,
  );
};

// ====================================================================================
// LOGIKA VALIDASI SELESAI SESI MENGAJAR (ASUMSI DURASI: 2 JAM)
// ====================================================================================
const apakahSesiSudahHabis = (jamMulaiString) => {
  if (!jamMulaiString) return false;

  const waktuSekarang = new Date();

  // Pecah string jam "08:00:00" menjadi angka jam dan menit
  const [jam, menit] = jamMulaiString.split(":").map(Number);

  const waktuBatasSelesai = new Date();
  waktuBatasSelesai.setHours(jam, menit, 0, 0);

  // 🌟 Tambahkan durasi mengajar, misal ditambahkan 2 jam dari jam mulai
  waktuBatasSelesai.setHours(waktuBatasSelesai.getHours() + 2);

  // Jika waktu sekarang sudah melewati waktu batas selesai, kembalikan nilai true
  return waktuSekarang > waktuBatasSelesai;
};

// Saat komponen pertama kali dibuka, langsung muat detail kelas untuk tanggal hari ini
onMounted(() => {
  klikTanggalKalender(tanggalTerpilihKalender.value);
});
</script>
