<template>
  <div
    class="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 animate-fade-in"
  >
    <div
      class="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 gap-4"
    >
      <div>
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">
          📊 Lembar Input Penilaian Akademik
        </h3>
        <p class="text-xs text-slate-400 font-medium mt-0.5">
          Kelola bobot nilai kuis, tugas harian, dan ujian murid secara terpadu.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <select
          class="text-xs font-bold border border-slate-200 px-3 py-2.5 sm:py-2 rounded-xl bg-slate-50 text-slate-700 w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
        >
          <option>Pilih Kelas: X IPA 1</option>
          <option>Pilih Kelas: X IPA 2</option>
        </select>
        <select
          class="text-xs font-bold border border-slate-200 px-3 py-2.5 sm:py-2 rounded-xl bg-slate-50 text-slate-700 w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
        >
          <option>Kategori: Tugas Harian 1</option>
          <option>Kategori: Kuis Ulangan</option>
          <option>Kategori: Ujian Tengah Semester (UTS)</option>
        </select>
      </div>
    </div>

    <div class="block lg:hidden space-y-4">
      <div
        class="p-4 bg-slate-50/60 rounded-xl border border-slate-100 space-y-3"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Rifqa Oktaviani</h4>
            <p class="text-[11px] font-mono text-slate-400 mt-0.5">
              NISN: 0913750
            </p>
          </div>
          <div class="w-16">
            <p
              class="text-[9px] font-bold text-slate-400 uppercase text-center mb-1"
            >
              Nilai
            </p>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="85"
              class="w-full text-center font-bold text-sm h-9 border border-slate-200 rounded-lg focus:border-[#4A5D4E] focus:outline-none bg-white shadow-sm"
            />
          </div>
        </div>
        <div>
          <p class="text-[9px] font-bold text-slate-400 uppercase mb-1">
            Catatan Perkembangan Guru:
          </p>
          <input
            type="text"
            placeholder="Pemahaman materi mekanika fisika sangat baik."
            class="w-full font-medium text-xs h-9 px-3 border border-slate-200 rounded-lg focus:border-[#4A5D4E] focus:outline-none bg-white shadow-sm"
          />
        </div>
      </div>

      <div
        class="p-4 bg-slate-50/60 rounded-xl border border-slate-100 space-y-3"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Muh Dany</h4>
            <p class="text-[11px] font-mono text-slate-400 mt-0.5">
              NISN: 0913880
            </p>
          </div>
          <div class="w-16">
            <p
              class="text-[9px] font-bold text-slate-400 uppercase text-center mb-1"
            >
              Nilai
            </p>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="90"
              class="w-full text-center font-bold text-sm h-9 border border-slate-200 rounded-lg focus:border-[#4A5D4E] focus:outline-none bg-white shadow-sm"
            />
          </div>
        </div>
        <div>
          <p class="text-[9px] font-bold text-slate-400 uppercase mb-1">
            Catatan Perkembangan Guru:
          </p>
          <input
            type="text"
            placeholder="Tugas dikumpulkan tepat waktu dengan struktur rapi."
            class="w-full font-medium text-xs h-9 px-3 border border-slate-200 rounded-lg focus:border-[#4A5D4E] focus:outline-none bg-white shadow-sm"
          />
        </div>
      </div>
    </div>

    <div
      class="hidden lg:block overflow-x-auto rounded-xl border border-slate-100"
    >
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider"
          >
            <th class="py-3 px-4">Nama Lengkap Murid</th>
            <th class="py-3 px-4 w-36 text-center">Nilai Angka (0-100)</th>
            <th class="py-3 px-4">Catatan Perkembangan Guru</th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-slate-100 text-sm font-medium text-slate-700"
        >
          <tr class="hover:bg-slate-50/50">
            <td class="py-3.5 px-4 font-bold text-slate-800">
              Rifqa Oktaviani
              <p class="text-xs font-mono font-normal text-slate-400">
                NISN: 0913750
              </p>
            </td>
            <td class="py-3.5 px-4">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="85"
                class="w-full text-center font-bold text-sm h-9 border border-slate-200 rounded-lg focus:outline-none bg-slate-50/50"
              />
            </td>
            <td class="py-3.5 px-4">
              <input
                type="text"
                placeholder="Pemahaman materi mekanika fisika sangat baik."
                class="w-full font-medium text-xs h-9 px-3 border border-slate-200 rounded-lg focus:outline-none"
              />
            </td>
          </tr>
          <tr class="hover:bg-slate-50/50">
            <td class="py-3.5 px-4 font-bold text-slate-800">
              Muh Dany
              <p class="text-xs font-mono font-normal text-slate-400">
                NISN: 0913880
              </p>
            </td>
            <td class="py-3.5 px-4">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="90"
                class="w-full text-center font-bold text-sm h-9 border border-slate-200 rounded-lg focus:outline-none bg-slate-50/50"
              />
            </td>
            <td class="py-3.5 px-4">
              <input
                type="text"
                placeholder="Tugas dikumpulkan tepat waktu dengan struktur rapi."
                class="w-full font-medium text-xs h-9 px-3 border border-slate-200 rounded-lg focus:outline-none"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-end pt-2 border-t border-slate-100">
      <button
        @click="$emit('toast-pemicu')"
        class="w-full sm:w-auto bg-[#4A5D4E] hover:bg-[#3B4B3F] text-white text-xs font-bold h-11 sm:h-10 px-5 rounded-xl border-none cursor-pointer shadow-sm transition"
      >
        💾 Simpan & Sinkron Nilai
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(["toast-pemicu"]);
</script>
