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
          >Mei 2026</span
        >
      </div>

      <div class="grid grid-cols-7 gap-2 text-center text-xs font-medium">
        <div
          v-for="h in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']"
          :key="h"
          class="text-slate-400 font-bold py-1"
        >
          {{ h }}
        </div>
        <div v-for="blank in 4" :key="'b-' + blank" class="py-2 text-slate-200">
          •
        </div>

        <div
          v-for="date in 31"
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
            :key="c.id"
            class="text-xs font-medium flex justify-between border-b border-slate-200/60 pb-1.5 last:border-none last:pb-0"
          >
            <span class="font-bold text-slate-800"
              >{{ c.nama_kelas }} — {{ c.nama_mapel }}</span
            >
            <span class="text-[#4A5D4E] font-semibold"
              >🕒 {{ c.jam_mulai.slice(0, 5) }} WIB</span
            >
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
              <span class="font-bold text-slate-600"
                >{{ jadwal.jam_mulai.slice(0, 5) }} WIB</span
              >
            </p>
          </div>

          <div
            class="px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-center sm:text-right shadow-sm min-w-[120px]"
          >
            <p class="text-[9px] font-bold text-slate-400 uppercase">
              HITUNG MUNDUR
            </p>
            <p
              :class="[
                'text-sm font-black mt-0.5 tracking-wider font-mono',
                statusAksesJadwal[jadwal.jadwal_id]?.bisaDiakses
                  ? 'text-emerald-600'
                  : 'text-amber-600',
              ]"
            >
              {{
                statusAksesJadwal[jadwal.jadwal_id]?.stringCountdown ||
                "00:00:00"
              }}
            </p>
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
import { ref, computed } from "vue";

const props = defineProps({
  listJadwal: Array,
  statusAksesJadwal: Object,
  hariSekarangString: String,
});

const tanggalTerpilihKalender = ref(22);
const detailKelasKalender = ref([]);

const kelasHariIni = computed(() => {
  return props.listJadwal.filter(
    (j) => j.hari.toLowerCase() === props.hariSekarangString.toLowerCase(),
  );
});

const isTanggalAdaKelas = (tanggal) => {
  const jumatDates = [1, 8, 15, 22, 29];
  const sabtuDates = [2, 9, 16, 23, 30];
  const jumatAdaKelas = props.listJadwal.some(
    (j) => j.hari.toLowerCase() === "jumat",
  );
  const sabtuAdaKelas = props.listJadwal.some(
    (j) => j.hari.toLowerCase() === "sabtu",
  );

  if (jumatAdaKelas && jumatDates.includes(tanggal)) return true;
  if (sabtuAdaKelas && sabtuDates.includes(tanggal)) return true;
  return false;
};

const klikTanggalKalender = (tanggal) => {
  tanggalTerpilihKalender.value = tanggal;
  const jumatDates = [1, 8, 15, 22, 29];
  const sabtuDates = [2, 9, 16, 23, 30];

  if (jumatDates.includes(tanggal)) {
    detailKelasKalender.value = props.listJadwal.filter(
      (j) => j.hari.toLowerCase() === "jumat",
    );
  } else if (sabtuDates.includes(tanggal)) {
    detailKelasKalender.value = props.listJadwal.filter(
      (j) => j.hari.toLowerCase() === "sabtu",
    );
  } else {
    detailKelasKalender.value = [];
  }
};
</script>
