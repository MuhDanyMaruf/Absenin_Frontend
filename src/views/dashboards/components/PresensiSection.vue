<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
    <div class="lg:col-span-8 space-y-6">
      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">
          📅 Pilih Kelas Mengajar Aktif
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="jadwal in listJadwal"
            :key="jadwal.jadwal_id"
            @click="
              statusAksesJadwal[jadwal.jadwal_id]?.bisaDiakses ||
              jadwal.is_locked_today
                ? $emit('pilih-kelas', jadwal)
                : null
            "
            :class="[
              'p-4 rounded-xl border transition flex justify-between items-center shadow-sm',
              !statusAksesJadwal[jadwal.jadwal_id]?.bisaDiakses &&
              !jadwal.is_locked_today
                ? 'opacity-40 bg-slate-100 cursor-not-allowed pointer-events-none'
                : agendaTerpilih?.jadwal_id === jadwal.jadwal_id
                  ? 'bg-[#4A5D4E] border-[#4A5D4E] text-white'
                  : 'bg-white text-slate-700 hover:border-[#4A5D4E] cursor-pointer',
            ]"
          >
            <div class="space-y-1">
              <span
                :class="[
                  'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded',
                  agendaTerpilih?.jadwal_id === jadwal.jadwal_id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500',
                ]"
              >
                {{ jadwal.hari }} • {{ jadwal.jam_mulai.slice(0, 5) }}
              </span>
              <h4 class="text-sm font-bold mt-1">{{ jadwal.nama_kelas }}</h4>
            </div>
            <span class="text-xs font-bold">{{
              agendaTerpilih?.jadwal_id === jadwal.jadwal_id ? "✅" : "➜"
            }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="agendaTerpilih"
        class="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm"
      >
        <div
          v-if="agendaTerpilih.is_locked_today || isSesiHabis"
          class="bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 select-none"
        >
          🔒
          <span
            >Sesi Presensi Selesai & Terkunci Aman. Input data tidak dapat
            diubah kembali.</span
          >
        </div>

        <div
          v-else-if="agendaTerpilih.is_locked_today"
          class="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-800 text-xs font-medium"
        >
          🛡️ Sesi Presensi Selesai & Terkunci Aman di Database Sekolah.
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase"
            >
              <th class="py-3 px-4">Nama Siswa</th>
              <th class="py-3 px-4 text-center w-64">Status Kehadiran</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr
              v-for="siswa in listSiswa"
              :key="siswa.id"
              :class="[
                'transition duration-150',
                agendaTerpilih.is_locked_today || isSesiHabis
                  ? dapatkanWarnaBarisPreview(siswa.id)
                  : 'hover:bg-slate-50/40',
              ]"
            >
              <td class="py-3 px-4 font-bold text-slate-800">
                {{ siswa.nama_lengkap }}
                <p class="text-xs font-mono font-normal text-slate-400">
                  NISN: {{ siswa.nisn || siswa.nomor_induk || "-" }}
                </p>
              </td>
              <td class="py-3 px-4">
                <div class="flex gap-1">
                  <label
                    v-for="status in [
                      'Hadir',
                      'Sakit',
                      'Izin',
                      'Alfa',
                      'Bolos',
                    ]"
                    :key="status"
                    class="flex-1"
                    :class="
                      agendaTerpilih.is_locked_today || isSesiHabis
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer'
                    "
                  >
                    <input
                      type="radio"
                      :name="'st-' + siswa.id"
                      :value="status"
                      v-model="payloadAbsen[siswa.id]"
                      :disabled="agendaTerpilih.is_locked_today || isSesiHabis"
                      class="hidden"
                    />
                    <div
                      :class="[
                        'text-xs font-bold py-1.5 text-center rounded-lg border transition',
                        payloadAbsen[siswa.id] === status
                          ? dapatkanWarnaTombolAktif(status)
                          : 'bg-white text-slate-400 border-slate-200',
                      ]"
                    >
                      {{ status.charAt(0) }}
                    </div>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          class="flex justify-end pt-3 border-t border-slate-100"
          v-if="!agendaTerpilih.is_locked_today && !isSesiHabis"
        >
          <button
            @click="$emit('simpan-absen')"
            :disabled="btnLoading"
            class="bg-[#4A5D4E] hover:bg-[#3B4A3E] text-white font-bold text-xs px-5 h-10 rounded-xl cursor-pointer border-none shadow-sm transition"
          >
            🔒 Kunci & Kirim Data Presensi
          </button>
        </div>
      </div>
    </div>

    <div
      class="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4"
    >
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">
        📊 Panel Summary Live
      </h3>

      <div v-if="agendaTerpilih" class="space-y-4 text-xs">
        <div
          class="p-3 bg-slate-50 rounded-xl flex justify-between font-bold text-slate-700"
        >
          <span>Total Kelas Aktif</span>
          <span class="uppercase font-black">{{
            agendaTerpilih.nama_kelas
          }}</span>
        </div>

        <div
          class="border border-emerald-100 rounded-xl overflow-hidden bg-emerald-50/5"
        >
          <div
            class="p-3 bg-emerald-50/40 flex justify-between font-black text-emerald-800"
          >
            <span>🟢 Hadir</span>
            <span>{{ hitungStatus.Hadir || 0 }} Anak</span>
          </div>
          <div
            v-if="filterSiswaBerdasarStatus('Hadir').length > 0"
            class="p-3 bg-white border-t border-emerald-100/60 flex flex-wrap gap-1.5"
          >
            <span
              v-for="s in filterSiswaBerdasarStatus('Hadir')"
              :key="s.id"
              class="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tight"
            >
              {{ s.nama_lengkap.split(" ")[0] }}
            </span>
          </div>
        </div>

        <div
          class="border border-amber-100 rounded-xl overflow-hidden bg-amber-50/5"
        >
          <div
            class="p-3 bg-amber-50/40 flex justify-between font-black text-amber-700"
          >
            <span>🟡 Sakit</span>
            <span>{{ hitungStatus.Sakit || 0 }} Anak</span>
          </div>
          <div
            v-if="filterSiswaBerdasarStatus('Sakit').length > 0"
            class="p-3 bg-white border-t border-amber-100/60 flex flex-wrap gap-1.5"
          >
            <span
              v-for="s in filterSiswaBerdasarStatus('Sakit')"
              :key="s.id"
              class="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tight"
            >
              {{ s.nama_lengkap.split(" ")[0] }}
            </span>
          </div>
        </div>

        <div
          class="border border-rose-100 rounded-xl overflow-hidden bg-rose-50/5"
        >
          <div
            class="p-3 bg-rose-50/40 flex justify-between font-black text-rose-700"
          >
            <span>🔴 Alfa</span>
            <span>{{ hitungStatus.Alfa || 0 }} Anak</span>
          </div>
          <div
            v-if="filterSiswaBerdasarStatus('Alfa').length > 0"
            class="p-3 bg-white border-t border-rose-100/60 flex flex-wrap gap-1.5"
          >
            <span
              v-for="s in filterSiswaBerdasarStatus('Alfa')"
              :key="s.id"
              class="bg-rose-50 text-rose-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tight"
            >
              {{ s.nama_lengkap.split(" ")[0] }}
            </span>
          </div>
        </div>

        <div
          class="border border-purple-100 rounded-xl overflow-hidden bg-purple-50/5"
        >
          <div
            class="p-3 bg-purple-50/40 flex justify-between font-black text-purple-700"
          >
            <span>🟣 Bolos</span>
            <span>{{ hitungStatus.Bolos || 0 }} Anak</span>
          </div>
          <div
            v-if="filterSiswaBerdasarStatus('Bolos').length > 0"
            class="p-3 bg-white border-t border-purple-100/60 flex flex-wrap gap-1.5"
          >
            <span
              v-for="s in filterSiswaBerdasarStatus('Bolos')"
              :key="s.id"
              class="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tight"
            >
              {{ s.nama_lengkap.split(" ")[0] }}
            </span>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 space-y-2">
          <button
            @click="$emit('unduh-dokumen', 'excel')"
            class="w-full bg-[#2D7A4D] hover:bg-[#225F3B] text-white text-xs font-bold h-9 px-4 rounded-xl border-none cursor-pointer transition shadow-sm"
          >
            📥 Laporan Excel (.xlsx)
          </button>
        </div>
      </div>

      <p v-else class="text-xs text-slate-400 text-center py-6 font-medium">
        Pilih kelas mengajar untuk memuat ringkasan rekap.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  listJadwal: Array,
  agendaTerpilih: Object,
  listSiswa: Array,
  payloadAbsen: Object,
  statusAksesJadwal: Object,
  hitungStatus: Object,
  btnLoading: Boolean,
});

defineEmits(["pilih-kelas", "simpan-absen", "unduh-dokumen"]);

const isSesiHabis = computed(() => {
  const jamMulai = props.agendaTerpilih?.jam_mulai;
  if (!jamMulai) return false;

  const waktuSekarang = new Date();
  const [jam, menit] = jamMulai.split(":").map(Number);

  const waktuBatasSelesai = new Date();
  waktuBatasSelesai.setHours(jam, menit, 0, 0);
  waktuBatasSelesai.setHours(waktuBatasSelesai.getHours() + 2);

  return waktuSekarang > waktuBatasSelesai;
});

const filterSiswaBerdasarStatus = (statusTarget) => {
  if (!props.listSiswa || !props.payloadAbsen) return [];
  return props.listSiswa.filter(
    (siswa) => props.payloadAbsen[siswa.id] === statusTarget,
  );
};

// 🌟 UPDATE: Logika penetapan warna tombol aktif untuk status Bolos (Ungu)
const dapatkanWarnaTombolAktif = (status) => {
  if (status === "Hadir")
    return "bg-emerald-600 text-white border-emerald-600 shadow-sm";
  if (status === "Alfa")
    return "bg-rose-600 text-white border-rose-600 shadow-sm";
  if (status === "Bolos")
    return "bg-purple-600 text-white border-purple-600 shadow-sm";
  return "bg-amber-500 text-white border-amber-500 shadow-sm";
};

// 🌟 UPDATE: Logika render background baris terkunci untuk status Bolos (Ungu Pastel)
const dapatkanWarnaBarisPreview = (siswaId) => {
  const status = props.payloadAbsen[siswaId];
  if (status === "Hadir")
    return "bg-emerald-50/30 border-l-4 border-l-emerald-500";
  if (status === "Alfa") return "bg-rose-50/30 border-l-4 border-l-rose-500";
  if (status === "Bolos")
    return "bg-purple-50/30 border-l-4 border-l-purple-500";
  if (status === "Sakit" || status === "Izin")
    return "bg-amber-50/30 border-l-4 border-l-amber-500";
  return "hover:bg-slate-50/40";
};
</script>
