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
                class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500"
                >{{ jadwal.hari }} • {{ jadwal.jam_mulai.slice(0, 5) }}</span
              >
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
          v-if="agendaTerpilih.is_locked_today"
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
              <th class="py-3 px-4 text-center w-56">Status Kehadiran</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr
              v-for="siswa in listSiswa"
              :key="siswa.id"
              class="hover:bg-slate-50/40"
            >
              <td class="py-3 px-4 font-bold text-slate-800">
                {{ siswa.nama_lengkap }}
                <p class="text-xs font-mono font-normal text-slate-400">
                  NISN: {{ siswa.nisn }}
                </p>
              </td>
              <td class="py-3 px-4">
                <div class="flex gap-1">
                  <label
                    v-for="status in ['Hadir', 'Sakit', 'Izin', 'Alfa']"
                    :key="status"
                    class="flex-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      :name="'st-' + siswa.id"
                      :value="status"
                      v-model="payloadAbsen[siswa.id]"
                      :disabled="agendaTerpilih.is_locked_today"
                      class="hidden"
                    />
                    <div
                      :class="[
                        'text-xs font-bold py-1.5 text-center rounded-lg border transition',
                        payloadAbsen[siswa.id] === status
                          ? 'bg-[#4A5D4E] text-white border-[#4A5D4E]'
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
          v-if="!agendaTerpilih.is_locked_today"
        >
          <button
            @click="$emit('simpan-absen')"
            :disabled="btnLoading"
            class="bg-[#4A5D4E] text-white font-bold text-xs px-5 h-10 rounded-xl cursor-pointer border-none shadow-sm"
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
      <div v-if="agendaTerpilih" class="space-y-3 text-xs">
        <div class="p-3 bg-slate-50 rounded-xl flex justify-between font-bold">
          <span>Total Kelas Aktif</span
          ><span>{{ agendaTerpilih.nama_kelas }}</span>
        </div>
        <div
          class="p-3 bg-[#F4F7F5] rounded-xl flex justify-between font-black text-emerald-800"
        >
          <span>🟢 Hadir</span><span>{{ hitungStatus.Hadir }} Anak</span>
        </div>
        <div
          class="p-3 bg-amber-50/60 rounded-xl flex justify-between font-black text-amber-700"
        >
          <span>🟡 Sakit</span><span>{{ hitungStatus.Sakit }} Anak</span>
        </div>
        <div
          class="p-3 bg-rose-50/60 rounded-xl flex justify-between font-black text-rose-700"
        >
          <span>🔴 Alfa</span><span>{{ hitungStatus.Alfa }} Anak</span>
        </div>
        <div class="pt-3 border-t border-slate-100 space-y-2">
          <button
            @click="$emit('unduh-dokumen', 'excel')"
            class="w-full bg-[#2D7A4D] text-white text-xs font-bold h-9 px-4 rounded-xl border-none cursor-pointer"
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
</script>
