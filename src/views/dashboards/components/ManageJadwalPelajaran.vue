<template>
  <div class="space-y-6">
    <div
      class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4"
    >
      <h3 class="text-sm font-bold text-neutral-900 uppercase tracking-wider">
        Plotting Pembagian Tugas Mengajar Guru
      </h3>

      <form
        @submit.prevent="submitPlotting"
        class="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-neutral-500 uppercase tracking-wider"
            >Nama Guru</label
          >
          <Select
            v-model="formPlot.guru_id"
            :options="opsiGuru"
            optionLabel="username"
            optionValue="id"
            placeholder="Pilih Guru"
            class="w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center px-2 bg-white text-neutral-800"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-neutral-500 uppercase tracking-wider"
            >Kelas yang Diajar</label
          >
          <Select
            v-model="formPlot.kelas_diajar"
            :options="opsiKelas"
            optionLabel="nama_kelas"
            optionValue="nama_kelas"
            placeholder="Pilih Kelas"
            class="w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center px-2 bg-white text-neutral-800"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-neutral-500 uppercase tracking-wider"
            >Mata Pelajaran</label
          >
          <Select
            v-model="formPlot.mapel_id"
            :options="opsiMapel"
            optionLabel="nama_mapel"
            optionValue="id"
            placeholder="Pilih Mapel"
            class="w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center px-2 bg-white text-neutral-800"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-neutral-500 uppercase tracking-wider"
            >Hari</label
          >
          <Select
            v-model="formPlot.hari"
            :options="['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']"
            placeholder="Pilih Hari"
            class="w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center px-2 bg-white text-neutral-800"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-neutral-500 uppercase tracking-wider"
            >Jam Mulai</label
          >
          <input
            v-model="formPlot.jam_mulai"
            type="time"
            class="w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center px-3 bg-white text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-neutral-500 uppercase tracking-wider"
            >Jam Selesai</label
          >
          <input
            v-model="formPlot.jam_selesai"
            type="time"
            class="w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center px-3 bg-white text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
            required
          />
        </div>

        <div class="md:col-span-3 flex justify-end pt-2">
          <Button
            type="submit"
            label="Simpan & Amankan Jadwal"
            :loading="btnLoading"
            class="bg-neutral-900 text-white hover:bg-neutral-800 font-semibold text-xs cursor-pointer px-5 h-11 rounded-xl border-none shadow-sm"
          />
        </div>
      </form>
    </div>

    <div
      class="bg-white p-5 md:p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4 overflow-hidden"
    >
      <div>
        <h3 class="text-sm md:text-base font-bold text-neutral-900">
          Jadwal & Agenda Pelajaran Aktif
        </h3>
        <p class="text-xs text-neutral-400">
          Daftar integrasi penuh waktu mengajar guru di sekolah.
        </p>
      </div>

      <div class="overflow-x-auto w-full rounded-xl border border-neutral-100">
        <DataTable
          :value="listJadwal"
          paginator
          :rows="6"
          responsiveLayout="scroll"
          class="p-datatable-minimalist min-w-[700px] w-full"
        >
          <template #empty>
            <div
              class="text-center py-12 text-neutral-400 bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200 text-xs font-medium"
            >
              Belum ada plotting jadwal mengajar terdaftar.
            </div>
          </template>
          <Column
            field="hari"
            header="HARI"
            class="font-bold text-neutral-900"
          />
          <Column field="nama_guru" header="NAMA GURU" />
          <Column field="nama_mapel" header="MATA PELAJARAN" />
          <Column field="kelas_id" header="KELAS" />
          <Column header="JAM BELAJAR">
            <template #body="slotProps">
              <span
                class="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-[11px] font-bold tracking-tight"
              >
                ⏳ {{ slotProps.data.jam_mulai.slice(0, 5) }} -
                {{ slotProps.data.jam_selesai.slice(0, 5) }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "../../../services/api";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Select from "primevue/select";

const listJadwal = ref([]);
const opsiGuru = ref([]);
const opsiKelas = ref([]);
const opsiMapel = ref([]);
const btnLoading = ref(false);

const formPlot = reactive({
  guru_id: null,
  mapel_id: null,
  kelas_diajar: null,
  hari: null,
  jam_mulai: "",
  jam_selesai: "",
});

const loadDataForm = async () => {
  try {
    const resGuru = await api.get("/admin/users/guru");
    const resKelas = await api.get("/admin/kelas");
    const resMapel = await api.get("/admin/mapel");
    const resJadwal = await api.get("/admin/jadwal-induk");

    if (resGuru.data.success) opsiGuru.value = resGuru.data.data;
    if (resKelas.data.success) opsiKelas.value = resKelas.data.data;
    if (resMapel.data.success) opsiMapel.value = resMapel.data.data;
    if (resJadwal.data.success) listJadwal.value = resJadwal.data.data;
  } catch (error) {
    console.error("Gagal memuat referensi:", error);
  }
};

const submitPlotting = async () => {
  btnLoading.value = true;
  try {
    const res = await api.post("/admin/jadwal-induk", formPlot);
    if (res.data.success) {
      alert("Sukses mem-plotting tugas mengajar guru!");
      // Reset form jam
      formPlot.jam_mulai = "";
      formPlot.jam_selesai = "";
      // Reload tabel
      const reloadJadwal = await api.get("/admin/jadwal-induk");
      if (reloadJadwal.data.success) listJadwal.value = reloadJadwal.data.data;
    }
  } catch (error) {
    alert(error.response?.data?.message || "Gagal menyimpan jadwal.");
  } finally {
    btnLoading.value = false;
  }
};

onMounted(() => {
  loadDataForm();
});
</script>
