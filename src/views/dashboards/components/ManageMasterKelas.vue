<template>
  <div class="p-6 bg-neutral-50 min-h-screen">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold tracking-tight text-neutral-900">
        Kelola Data Wilayah Akademik
      </h1>
      <p class="text-sm text-neutral-500">
        Manajemen master data kelas dan jurusan yang terhubung ke sistem
        registrasi dan dashboard guru.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div
        class="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6"
      >
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-lg font-medium text-neutral-800">Daftar Kelas</h2>
            <p class="text-xs text-neutral-400">
              Total: {{ listKelas.length }} Kelas
            </p>
          </div>
          <button
            @click="openModal('kelas')"
            class="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl transition duration-200 flex items-center gap-2 shadow-sm"
          >
            <i class="pi pi-plus text-[10px]"></i> Tambah Kelas
          </button>
        </div>

        <div class="overflow-hidden rounded-xl border border-neutral-100">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-neutral-50 border-b border-neutral-100 text-neutral-500 text-xs font-semibold uppercase tracking-wider"
              >
                <th class="py-3 px-4">Nama Kelas</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 text-sm text-neutral-700">
              <tr
                v-for="item in listKelas"
                :key="item.id"
                class="hover:bg-neutral-50/50 transition"
              >
                <td class="py-3.5 px-4 font-medium text-neutral-800">
                  {{ item.nama_kelas }}
                </td>
                <td class="py-3.5 px-4 text-right flex justify-end gap-1">
                  <button
                    @click="editItem('kelas', item)"
                    class="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent"
                    title="Edit Data"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 20h9"></path>
                      <path
                        d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                      ></path>
                    </svg>
                  </button>

                  <button
                    @click="deleteItem('kelas', item.id)"
                    class="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent"
                    title="Hapus Data"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="listKelas.length === 0">
                <td
                  colspan="2"
                  class="py-6 text-center text-xs text-neutral-400"
                >
                  Belum ada data kelas.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6"
      >
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-lg font-medium text-neutral-800">Daftar Jurusan</h2>
            <p class="text-xs text-neutral-400">
              Total: {{ listJurusan.length }} Jurusan
            </p>
          </div>
          <button
            @click="openModal('jurusan')"
            class="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl transition duration-200 flex items-center gap-2 shadow-sm"
          >
            <i class="pi pi-plus text-[10px]"></i> Tambah Jurusan
          </button>
        </div>

        <div class="overflow-hidden rounded-xl border border-neutral-100">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-neutral-50 border-b border-neutral-100 text-neutral-500 text-xs font-semibold uppercase tracking-wider"
              >
                <th class="py-3 px-4">Nama Jurusan</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 text-sm text-neutral-700">
              <tr
                v-for="item in listJurusan"
                :key="item.id"
                class="hover:bg-neutral-50/50 transition"
              >
                <td class="py-3.5 px-4 font-medium text-neutral-800">
                  {{ item.nama_jurusan }}
                </td>
                <td class="py-3.5 px-4 text-right flex justify-end gap-1">
                  <button
                    @click="editItem('jurusan', item)"
                    class="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent"
                    title="Edit Data"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 20h9"></path>
                      <path
                        d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                      ></path>
                    </svg>
                  </button>

                  <button
                    @click="deleteItem('jurusan', item.id)"
                    class="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent"
                    title="Hapus Data"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="listJurusan.length === 0">
                <td
                  colspan="2"
                  class="py-6 text-center text-xs text-neutral-400"
                >
                  Belum ada data jurusan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="modalOpen"
      :header="isEdit ? 'Ubah Master Data' : 'Tambah Master Data'"
      :modal="true"
      :draggable="false"
      class="w-[90%] max-w-md bg-white p-6 rounded-2xl border border-neutral-100 shadow-xl"
    >
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-neutral-500 uppercase tracking-wider"
            >Nama {{ targetType === "kelas" ? "Kelas" : "Jurusan" }}</label
          >
          <input
            v-model="formData.name"
            type="text"
            :placeholder="
              targetType === 'kelas' ? 'Contoh: X IPA 1' : 'Contoh: IPA'
            "
            class="w-full h-11 border border-neutral-200 rounded-xl text-sm flex items-center px-3 bg-white text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
            required
          />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button
            type="button"
            @click="modalOpen = false"
            class="px-4 h-10 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-medium hover:bg-neutral-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 h-10 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium transition shadow-sm"
          >
            Simpan
          </button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../../services/api"; // Sesuaikan dengan konfigurasi instance axios kamu
import Dialog from "primevue/dialog"; // Menggunakan modal primeVue bawaan project

const listKelas = ref([]);
const listJurusan = ref([]);

const modalOpen = ref(false);
const isEdit = ref(false);
const targetType = ref("kelas"); // 'kelas' atau 'jurusan'
const selectedId = ref(null);

const formData = ref({
  name: "",
});

// Load Data From Server
const fetchData = async () => {
  try {
    const resKelas = await api.get("/admin/kelas");
    const resJurusan = await api.get("/admin/jurusan");
    if (resKelas.data.success) listKelas.value = resKelas.data.data;
    if (resJurusan.data.success) listJurusan.value = resJurusan.data.data;
  } catch (error) {
    console.error("Gagal mengambil data master:", error);
  }
};

// Open Modal Tambah
const openModal = (type) => {
  targetType.value = type;
  isEdit.value = false;
  selectedId.value = null;
  formData.value.name = "";
  modalOpen.value = true;
};

// Open Modal Edit
const editItem = (type, item) => {
  targetType.value = type;
  isEdit.value = true;
  selectedId.value = item.id;
  formData.value.name = type === "kelas" ? item.nama_kelas : item.nama_jurusan;
  modalOpen.value = true;
};

// Handle Save (Create & Update)
const handleSubmit = async () => {
  try {
    let payload = {};
    if (targetType.value === "kelas") payload.nama_kelas = formData.value.name;
    else payload.nama_jurusan = formData.value.name;

    if (isEdit.value) {
      // Update
      const res = await api.put(
        `/admin/${targetType.value}/${selectedId.value}`,
        payload,
      );
      if (res.data.success) modalOpen.value = false;
    } else {
      // Create
      const res = await api.post(`/admin/${targetType.value}`, payload);
      if (res.data.success) modalOpen.value = false;
    }
    fetchData(); // Refresh data table
  } catch (error) {
    alert(error.response?.data?.message || "Terjadi kesalahan operasi");
  }
};

// Handle Delete
const deleteItem = async (type, id) => {
  if (confirm(`Apakah kamu yakin ingin menghapus data master ${type} ini?`)) {
    try {
      const res = await api.delete(`/admin/${type}/${id}`);
      if (res.data.success) fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus data");
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>
