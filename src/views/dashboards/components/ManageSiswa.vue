  <template>
    <div
      class="bg-white p-4 md:p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-5 overflow-hidden"
    >
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-2"
      >
        <div>
          <h3 class="text-sm md:text-base font-bold text-neutral-900">
            Daftar Data Master Siswa
          </h3>
          <p class="text-xs text-neutral-400">
            Total data terdaftar: {{ filteredStudents.length }} orang
          </p>
        </div>
        <Button
          label="Tambah Siswa"
          icon="pi pi-plus"
          @click="$emit('add-user')"
          class="p-button-sm bg-neutral-900 text-white border-none font-semibold cursor-pointer text-xs h-10 px-4 rounded-xl w-full sm:w-auto shadow-sm"
        />
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-neutral-50/60 border border-neutral-200/60 rounded-xl"
      >
        <div class="flex flex-col gap-1">
          <label
            class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
            >Cari Siswa</label
          >
          <input
            v-model="filters.search"
            type="text"
            placeholder="Ketik Nama / NISN..."
            class="w-full h-10 border border-neutral-200 rounded-xl text-xs px-3 bg-white text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label
            class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
            >Filter Kelas</label
          >
          <select
            v-model="filters.kelas"
            class="w-full h-10 border border-neutral-200 rounded-xl text-xs px-2 bg-white text-neutral-800 focus:outline-none focus:border-neutral-900 transition cursor-pointer"
          >
            <option :value="null">Semua Kelas</option>
            <option
              v-for="kls in opsiKelas"
              :key="kls.id"
              :value="kls.nama_kelas"
            >
              {{ kls.nama_kelas }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label
            class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
            >Filter Jurusan</label
          >
          <select
            v-model="filters.jurusan"
            class="w-full h-10 border border-neutral-200 rounded-xl text-xs px-2 bg-white text-neutral-800 focus:outline-none focus:border-neutral-900 transition cursor-pointer"
          >
            <option :value="null">Semua Jurusan</option>
            <option
              v-for="jur in opsiJurusan"
              :key="jur.id"
              :value="jur.nama_jurusan"
            >
              {{ jur.nama_jurusan }}
            </option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto w-full rounded-xl border border-neutral-100">
        <DataTable
          :value="filteredStudents"
          :loading="loading"
          paginator
          :rows="6"
          responsiveLayout="scroll"
          class="p-datatable-minimalist min-w-[700px] w-full"
        >
          <template #empty>
            <div
              class="text-center py-12 text-neutral-400 bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200 text-xs font-medium"
            >
              Tidak ada data siswa yang cocok dengan filter.
            </div>
          </template>

          <Column field="nisn" header="NISN">
            <template #body="slotProps">
              <span class="font-mono text-neutral-800 tracking-tight text-xs">
                {{ slotProps.data.nisn || slotProps.data.nis || "—" }}
              </span>
            </template>
          </Column>

          <Column field="nama_lengkap" header="NAMA LENGKAP">
            <template #body="slotProps">
              <span class="font-semibold text-neutral-900 text-xs tracking-tight">
                {{
                  slotProps.data.nama_lengkap || slotProps.data.username || "—"
                }}
              </span>
            </template>
          </Column>

          <Column field="jenis_kelamin" header="Jenis Kelamin">
            <template #body="slotProps">
              <span
                class="px-2 py-0.5 bg-neutral-50 text-neutral-600 rounded-md text-[10px] font-bold border border-neutral-200/60"
              >
                {{
                  slotProps.data.jenis_kelamin === "L"
                    ? "Laki-laki"
                    : slotProps.data.jenis_kelamin === "P"
                      ? "Perempuan"
                      : "—"
                }}
              </span>
            </template>
          </Column>

          <Column field="kelas" header="KELAS/Jurusan">
            <template #body="slotProps">
              <span
                class="px-2 py-0.5 bg-neutral-900 text-white rounded-md font-bold text-[10px] tracking-wide"
              >
                {{ slotProps.data.kelas || "Belum Diplot" }}
              </span>
            </template>
          </Column>

          <Column field="email" header="AKUN EMAIL">
            <template #body="slotProps">
              <span class="text-neutral-500 text-xs font-medium">
                {{ slotProps.data.email || "—" }}
              </span>
            </template>
          </Column>

          <Column header="AKSI" class="w-32 text-center">
            <template #body="slotProps">
              <div class="flex items-center justify-center gap-1">
                <button
                  type="button"
                  @click="viewDetailSiswa(slotProps.data)"
                  class="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent"
                  title="Lihat Detail Profil"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>

                <button
                  type="button"
                  @click="$emit('edit-user', slotProps.data)"
                  class="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
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
                  type="button"
                  @click="$emit('delete-user', slotProps.data.id)"
                  class="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <Drawer
      v-model:visible="drawerOpen"
      position="right"
      header="Profil Lengkap Siswa"
      class="w-full max-w-md bg-white border-l border-neutral-200 shadow-2xl p-6 font-sans"
    >
      <div v-if="selectedSiswa" class="space-y-6 pt-4">
        <div class="flex items-center gap-4 pb-4 border-b border-neutral-100">
          <div
            class="w-14 h-14 bg-neutral-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm"
          >
            {{
              selectedSiswa.nama_lengkap
                ? selectedSiswa.nama_lengkap.charAt(0).toUpperCase()
                : "S"
            }}
          </div>
          <div>
            <h4 class="text-base font-bold text-neutral-900 tracking-tight">
              {{ selectedSiswa.nama_lengkap }}
            </h4>
            <p class="text-xs text-neutral-400 font-medium">
              Siswa Aktif • {{ selectedSiswa.kelas || "Belum Diplot" }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <h5
            class="text-[11px] font-bold text-neutral-400 uppercase tracking-widest"
          >
            Informasi Akademik
          </h5>

          <div
            class="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100"
          >
            <div>
              <p class="text-[10px] font-bold text-neutral-400 uppercase">
                NISN / Nomor Induk
              </p>
              <p class="text-xs font-mono font-bold text-neutral-800 mt-0.5">
                {{ selectedSiswa.nisn || "—" }}
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-neutral-400 uppercase">
                Kelas Saat Ini
              </p>
              <p class="text-xs font-bold text-neutral-800 mt-0.5">
                {{ selectedSiswa.kelas || "—" }}
              </p>
            </div>
            <div class="mt-2">
              <p class="text-[10px] font-bold text-neutral-400 uppercase">
                Jenis Kelamin
              </p>
              <p class="text-xs font-medium text-neutral-800 mt-0.5">
                {{
                  selectedSiswa.jenis_kelamin === "L"
                    ? "Laki-laki"
                    : selectedSiswa.jenis_kelamin === "P"
                      ? "Perempuan"
                      : "—"
                }}
              </p>
            </div>
            <div class="mt-2">
              <p class="text-[10px] font-bold text-neutral-400 uppercase">
                ID Sistem Akademik
              </p>
              <p class="text-xs font-mono text-neutral-500 mt-0.5">
                #SRV-{{ selectedSiswa.id }}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-2">
          <h5
            class="text-[11px] font-bold text-neutral-400 uppercase tracking-widest"
          >
            Kredensial Akun
          </h5>

          <div class="space-y-3 px-1">
            <div class="flex justify-between items-center text-xs">
              <span class="text-neutral-400 font-medium">ID Username Login</span>
              <span
                class="font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-md"
                >{{ selectedSiswa.username }}</span
              >
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-neutral-400 font-medium"
                >Alamat Email Terdaftar</span
              >
              <span class="font-medium text-neutral-700">{{
                selectedSiswa.email || "—"
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="p-3.5 bg-neutral-900 text-neutral-400 rounded-xl text-[11px] leading-relaxed font-medium flex items-start gap-2.5 shadow-sm"
        >
          <span>💡</span>
          <span
            >Data ini disinkronkan langsung dari Master Database Sekolah. Segala
            bentuk perubahan nama akademik wajib melalui verifikasi berkas resmi
            siswa.</span
          >
        </div>
      </div>
    </Drawer>
  </template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import api from "../../../services/api";
import Drawer from "primevue/drawer";

const props = defineProps({
  listData: Array,
  loading: Boolean,
});

defineEmits(["add-user", "edit-user", "delete-user"]);

const opsiKelas = ref([]);
const opsiJurusan = ref([]);

const filters = reactive({
  search: "",
  kelas: null,
  jurusan: null,
});

const loadFilterOptions = async () => {
  try {
    const resKelas = await api.get("/admin/kelas");
    const resJurusan = await api.get("/admin/jurusan");
    if (resKelas.data.success) opsiKelas.value = resKelas.data.data;
    if (resJurusan.data.success) opsiJurusan.value = resJurusan.data.data;
  } catch (error) {
    console.error("Gagal memuat opsi filter siswa:", error);
  }
};

// 🔴 PERBAIKAN LOGIKA: Ditambahkan toleransi nilai Null agar tidak menahan data tampil
const filteredStudents = computed(() => {
  if (!props.listData) return [];

  return props.listData.filter((student) => {
    const namaSiswa = student.nama_lengkap
      ? student.nama_lengkap.toLowerCase()
      : "";
    const usernameSiswa = student.username
      ? student.username.toLowerCase()
      : "";
    const nisnSiswa = student.nisn ? student.nisn.toLowerCase() : "";
    const searchTarget = filters.search.toLowerCase();

    // 1. Filter Search (Bisa cari pakai nama lengkap, username akun, atau nisn)
    const matchSearch = filters.search
      ? namaSiswa.includes(searchTarget) ||
        usernameSiswa.includes(searchTarget) ||
        nisnSiswa.includes(searchTarget)
      : true;

    // 2. Filter Kelas (Jika data kelas null, jangan sembunyikan barisnya kecuali filter aktif)
    const matchKelas = filters.kelas ? student.kelas === filters.kelas : true;

    // 3. Filter Jurusan
    const matchJurusan = filters.jurusan
      ? student.kelas &&
        student.kelas.toLowerCase().includes(filters.jurusan.toLowerCase())
      : true;

    return matchSearch && matchKelas && matchJurusan;
  });
});

const drawerOpen = ref(false);
const selectedSiswa = ref(null);

const viewDetailSiswa = (siswaData) => {
  selectedSiswa.value = siswaData;
  drawerOpen.value = true;
};

onMounted(() => {
  loadFilterOptions();
});
</script>
