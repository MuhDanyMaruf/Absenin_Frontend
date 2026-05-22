<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="bg-neutral-900 p-6 rounded-2xl text-white shadow-sm relative overflow-hidden h-32 flex flex-col justify-between">
        <div>
          <p class="text-[10px] opacity-60 font-bold uppercase tracking-wider">Total Siswa Aktif</p>
          <p class="text-3xl font-bold mt-1">{{ stats.totalSiswa }}</p>
        </div>
        <span class="absolute right-4 bottom-3 text-3xl opacity-10">👨‍🎓</span>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm relative overflow-hidden h-32 flex flex-col justify-between">
        <div>
          <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Guru Terdaftar</p>
          <p class="text-3xl font-bold mt-1 text-neutral-900">{{ stats.totalGuru }}</p>
        </div>
        <span class="absolute right-4 bottom-3 text-3xl opacity-20">👨‍🏫</span>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm relative overflow-hidden h-32 flex flex-col justify-between">
        <div>
          <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Absen Masuk Hari Ini</p>
          <p class="text-3xl font-bold mt-1 text-emerald-600">{{ stats.totalAbsenHariIni }}</p>
        </div>
        <span class="absolute right-4 bottom-3 text-3xl opacity-20">📝</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4 lg:col-span-2">
        <div class="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">Log Aktivitas Sistem</h3>
          <span class="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-md text-[10px] font-bold">LIVE</span>
        </div>

        <div class="space-y-3.5">
          <div class="flex items-start gap-3 text-xs">
            <div class="w-2 h-2 rounded-full bg-neutral-950 mt-1.5 shrink-0"></div>
            <div class="flex-1">
              <p class="text-neutral-800 font-medium"><span class="font-bold">System Administrator</span> memperbarui data master guru <span class="font-semibold text-neutral-500">(pak_budi)</span></p>
              <p class="text-[10px] text-neutral-400 mt-0.5">Baru saja</p>
            </div>
          </div>

          <div class="flex items-start gap-3 text-xs">
            <div class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
            <div class="flex-1">
              <p class="text-neutral-800 font-medium">Akun siswa baru berhasil didaftarkan: <span class="font-bold">budi_siswa</span></p>
              <p class="text-[10px] text-neutral-400 mt-0.5">10 menit yang lalu</p>
            </div>
          </div>

          <div class="flex items-start gap-3 text-xs">
            <div class="w-2 h-2 rounded-full bg-neutral-300 mt-1.5 shrink-0"></div>
            <div class="flex-1">
              <p class="text-neutral-800 font-medium"><span class="font-bold">Admin</span> sukses melakukan sinkronisasi database harian dengan Supabase</p>
              <p class="text-[10px] text-neutral-400 mt-0.5">Hari ini, 07:00 WIB</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4">
          <h3 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">Aksi Cepat</h3>
          <div class="flex flex-col gap-2">
            <Button @click="$emit('change-tab', 'guru')" label="Buka Manajemen Guru" icon="pi pi-arrow-right" iconPos="right" class="w-full bg-neutral-900 text-white hover:bg-neutral-800 font-semibold text-xs rounded-xl h-10 border-none justify-between px-4 cursor-pointer" />
            <Button @click="$emit('change-tab', 'siswa')" label="Buka Manajemen Siswa" icon="pi pi-arrow-right" iconPos="right" class="w-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 font-semibold text-xs rounded-xl h-10 border-none justify-between px-4 cursor-pointer" />
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-lg">⚡</span>
            <div>
              <h4 class="text-xs font-bold text-neutral-900">Status Database</h4>
              <p class="text-[10px] text-neutral-400">Terhubung ke Supabase</p>
            </div>
          </div>
          <div class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
defineProps({
  stats: Object
});
defineEmits(['change-tab']);
</script>