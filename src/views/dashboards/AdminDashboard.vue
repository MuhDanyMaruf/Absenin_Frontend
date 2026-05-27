<template>
  <div
    class="h-screen w-full bg-neutral-50 flex antialiased font-sans text-neutral-800 overflow-hidden relative"
  >
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-neutral-900/20 z-40 md:hidden transition-opacity duration-300"
    ></div>

    <aside
      :class="[
        'w-64 bg-white border-r border-neutral-200/80 p-6 flex flex-col justify-between fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 md:translate-x-0 shrink-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="space-y-6">
        <div class="flex items-center justify-between px-2">
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-base shadow-sm"
            >
              A
            </div>
            <div>
              <h2
                class="text-sm font-bold tracking-tight underline decoration-sky-500 title_sidebar"
              >
                Absensi Apps
              </h2>
              <p class="text-[10px] text-neutral-400 font-medium">
                System Administrator
              </p>
            </div>
          </div>
          <button
            @click="isSidebarOpen = false"
            class="p-1 md:hidden text-neutral-400 hover:text-neutral-900 border-none bg-transparent cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav class="space-y-1">
          <button
            @click="switchTab('overview')"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer border-none bg-transparent',
              currentTab === 'overview'
                ? 'bg-white text-neutral-950 shadow-sm border border-neutral-200/50'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
            ]"
          >
            📊 Ringkasan
          </button>
          <button
            @click="switchTab('guru')"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer border-none bg-transparent',
              currentTab === 'guru'
                ? 'bg-white text-neutral-950 shadow-sm border border-neutral-200/50'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
            ]"
          >
            👨‍🏫 Kelola Data Guru
          </button>
          <button
            @click="switchTab('siswa')"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer border-none bg-transparent',
              currentTab === 'siswa'
                ? 'bg-white text-neutral-950 shadow-sm border border-neutral-200/50'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
            ]"
          >
            👨‍🎓 Kelola Data Siswa
          </button>
          <button
            @click="switchTab('master-kelas')"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer border-none bg-transparent',
              currentTab === 'master-kelas'
                ? 'bg-white text-neutral-950 shadow-sm border border-neutral-200/50'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
            ]"
          >
            <span>🏫</span> Master Kelas & Jurusan
          </button>
          <button
            @click="switchTab('jadwal')"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer border-none bg-transparent',
              currentTab === 'jadwal'
                ? 'bg-white text-neutral-950 shadow-sm border border-neutral-200/50'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
            ]"
          >
            <span>📅</span> Jadwal Mengajar Guru
          </button>
        </nav>
      </div>
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer border-none bg-transparent"
      >
        🚪 Keluar Aplikasi
      </button>
    </aside>

    <main class="flex-1 h-full overflow-y-auto p-6 md:p-10 min-w-0">
      <div class="max-w-5xl mx-auto space-y-8 pb-12">
        <div
          class="flex justify-between items-center border-b border-neutral-200/50 pb-4 gap-4"
        >
          <div class="flex items-center gap-3">
            <button
              @click="isSidebarOpen = true"
              class="p-2 bg-white border border-neutral-200 rounded-xl text-neutral-700 md:hidden flex items-center justify-center cursor-pointer shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div>
              <h1
                class="text-lg md:text-xl font-bold tracking-tight text-neutral-900 uppercase"
              >
                {{
                  currentTab === "overview"
                    ? "System Overview"
                    : currentTab === "guru"
                      ? "Manajemen Guru"
                      : "Manajemen Siswa"
                }}
              </h1>
              <p class="text-xs text-neutral-400 mt-0.5 hidden sm:block">
                Selamat datang kembali, Admin.
              </p>
            </div>
          </div>
          <div
            class="text-[11px] md:text-xs font-medium text-neutral-500 bg-white px-3 py-1.5 border border-neutral-200 rounded-xl shadow-sm whitespace-nowrap"
          >
            📅 {{ tanggalHariIni }}
          </div>
        </div>

        <OverviewSection
          v-if="currentTab === 'overview'"
          :stats="stats"
          @change-tab="switchTab"
        />
        <ManageGuru
          v-else-if="currentTab === 'guru'"
          :listData="listData"
          :loading="tableLoading"
          @add-user="openModalTambah"
          @edit-user="openModalEdit"
          @delete-user="hapusUser"
        />
        <ManageSiswa
          v-else-if="currentTab === 'siswa'"
          :listData="listData"
          :loading="tableLoading"
          @add-user="openModalTambah"
          @edit-user="openModalEdit"
          @delete-user="hapusUser"
        />
        <ManageMasterKelas v-else-if="currentTab === 'master-kelas'" />
        <ManageJadwalPelajaran v-else-if="currentTab === 'jadwal'" />
      </div>
    </main>

    <Dialog
      v-model:visible="modalForm"
      modal
      :header="
        isEditMode
          ? 'Edit Data ' + (currentTab === 'guru' ? 'Guru' : 'Siswa')
          : 'Tambah ' + (currentTab === 'guru' ? 'Guru Baru' : 'Siswa Baru')
      "
      :style="{ width: '95vw', maxWidth: '460px' }"
      class="font-sans"
    >
      <form @submit.prevent="submitUser" class="space-y-4 pt-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="flex flex-col gap-1.5">
            <label
              class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
            >
              {{ currentTab === "guru" ? "NIP / Username" : "NIS / Username" }}
            </label>
            <InputText
              v-model="formUser.username"
              placeholder="Nomor identitas login"
              class="w-full h-10 px-3 border border-neutral-200 rounded-xl text-xs focus:border-neutral-950 bg-white text-neutral-800"
              required
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
              >Email (Opsional)</label
            >
            <InputText
              v-model="formUser.email"
              type="email"
              placeholder="contoh@sekolah.sch.id"
              class="w-full h-10 px-3 border border-neutral-200 rounded-xl text-xs focus:border-neutral-950 bg-white text-neutral-800"
            />
          </div>
        </div>

        <div
          v-if="currentTab === 'siswa'"
          class="space-y-4 border-t border-neutral-100 pt-3.5 mt-1"
        >
          <div class="flex flex-col gap-1.5">
            <label
              class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
              >Nama Lengkap Siswa</label
            >
            <InputText
              v-model="formUser.nama_siswa"
              placeholder="Masukkan Nama Lengkap Sesuai Ijazah"
              class="w-full h-10 px-3 border border-neutral-200 rounded-xl text-xs focus:border-neutral-950 bg-white text-neutral-800"
              required
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                >NIS Nasional</label
              >
              <InputText
                v-model="formUser.nis"
                placeholder="Masukkan nomor NIS"
                class="w-full h-10 px-3 border border-neutral-200 rounded-xl text-xs focus:border-neutral-950 bg-white text-neutral-800"
                required
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label
                class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                >Jenis Kelamin</label
              >
              <Select
                v-model="formUser.gender"
                :options="[
                  { label: 'Laki-laki', value: 'L' },
                  { label: 'Perempuan', value: 'P' },
                ]"
                optionLabel="label"
                optionValue="value"
                placeholder="Pilih Gender"
                class="w-full h-10 border border-neutral-200 rounded-xl text-xs flex items-center px-2 bg-white text-neutral-800"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                >Kelas Akademik</label
              >
              <Select
                v-model="formUser.kelas_id"
                :options="opsiKelas"
                optionLabel="nama_kelas"
                optionValue="id"
                placeholder="Pilih Kelas"
                class="w-full h-10 border border-neutral-200 rounded-xl text-xs flex items-center px-2 bg-white text-neutral-800"
                required
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label
                class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                >Jurusan</label
              >
              <Select
                v-model="formUser.jurusan"
                :options="['IPA', 'IPS', 'Bahasa']"
                placeholder="Pilih Jurusan"
                class="w-full h-10 border border-neutral-200 rounded-xl text-xs flex items-center px-2 bg-white text-neutral-800"
                required
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1.5 border-t border-neutral-100 pt-3.5">
          <label
            class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
          >
            {{
              isEditMode
                ? "Ganti Password (Kosongkan jika tidak diubah)"
                : "Buat Password Akun"
            }}
          </label>
          <Password
            v-model="formUser.password"
            placeholder="Kombinasi minimal 6-8 karakter"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full h-10 px-3 border border-neutral-200 rounded-xl text-xs focus:border-neutral-950 bg-white text-neutral-800"
            :required="!isEditMode"
          />
        </div>

        <div
          class="flex justify-end gap-2 pt-4 border-t border-neutral-100 mt-4"
        >
          <Button
            type="button"
            label="Batal"
            class="p-button-text text-neutral-500 hover:bg-neutral-50 font-semibold text-xs cursor-pointer px-4 h-10 rounded-xl border-none transition"
            @click="modalForm = false"
          />
          <Button
            type="submit"
            label="Simpan Data"
            :loading="btnLoading"
            class="bg-neutral-900 text-white hover:bg-neutral-800 font-semibold text-xs cursor-pointer px-4 h-10 rounded-xl border-none shadow-sm transition"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Select from "primevue/select";
import api from "../../services/api";

// 🔴 IMPORT KOMPONEN ANAK
import OverviewSection from "./components/OverviewAdminSection.vue";
import ManageGuru from "./components/ManageGuru.vue";
import ManageSiswa from "./components/ManageSiswa.vue";
import ManageMasterKelas from "./components/ManageMasterKelas.vue";
import ManageJadwalPelajaran from "./components/ManageJadwalPelajaran.vue";

const router = useRouter();

const checkAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Jika tidak ada token (belum login), ATAU rolenya bukan admin
  if (!token || role !== "admin") {
    // Tampilkan notifikasi peringatan
    Swal.fire({
      icon: "error",
      title: "Akses Ditolak!",
      text: "Kamu tidak memiliki izin untuk masuk ke halaman ini. Silakan login terlebih dahulu.",
      confirmButtonColor: "#10b981",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-bold px-6 py-2.5",
      },
    });

    // Tendang (Redirect) paksa ke halaman login (/)
    router.push("/");
  }
};

// Jalankan sistem keamanan SEBELUM halaman berhasil dimuat/digambar di layar
onBeforeMount(() => {
  checkAuth();
});

const currentTab = ref("overview");
const tableLoading = ref(false);
const btnLoading = ref(false);
const modalForm = ref(false);
const listData = ref([]);
const isEditMode = ref(false);
const selectedId = ref(null);
const isSidebarOpen = ref(false);

// State Penampung Opsi Kelas dari Database
const opsiKelas = ref([]);

const tanggalHariIni = ref(
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);
const stats = ref({ totalSiswa: 0, totalGuru: 0, totalAbsenHariIni: 0 });

// 🔴 STATE FORM: Ditambahkan field profil untuk sinkronisasi ke tabel siswa
const formUser = reactive({
  username: "",
  email: "",
  password: "",
  role: "",
  // Data Profil Akademik Siswa
  nama_siswa: "",
  nis: "",
  gender: null,
  kelas_id: null,
  jurusan: null,
});

// Fungsi memuat data master kelas dari database untuk dropdown modal
const loadMasterKelas = async () => {
  try {
    const response = await api.get("/admin/kelas");
    if (response.data.success) {
      opsiKelas.value = response.data.data;
    }
  } catch (error) {
    console.error("Gagal memuat referensi kelas untuk modal:", error);
  }
};

const loadStats = async () => {
  try {
    const response = await api.get("/admin/dashboard-stats");
    if (response.data.success) {
      stats.value = {
        totalSiswa: response.data.data.totalSiswa || 0,
        totalGuru: response.data.data.totalGuru || 0,
        totalAbsenHariIni: response.data.data.totalAbsenHariIni || 0,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchGridData = async (roleType) => {
  tableLoading.value = true;
  try {
    const response = await api.get(`/admin/users/${roleType}`);
    if (response.data.success) listData.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    tableLoading.value = false;
  }
};

const openModalTambah = () => {
  isEditMode.value = false;
  selectedId.value = null;

  // Reset Form Akun
  formUser.username = "";
  formUser.email = "";
  formUser.password = "";
  formUser.role = currentTab.value;

  // Reset Profil Siswa
  formUser.nama_siswa = "";
  formUser.nis = "";
  formUser.gender = null;
  formUser.kelas_id = null;
  formUser.jurusan = null;

  modalForm.value = true;
};

const openModalEdit = (userData) => {
  isEditMode.value = true;
  selectedId.value = userData.id;

  formUser.username = userData.username;
  formUser.email = userData.email || "";
  formUser.password = ""; // Kosongkan password demi keamanan saat edit
  formUser.role = userData.role;

  // Mapping data lama jika ada (untuk siswa)
  formUser.nama_siswa = userData.nama_siswa || "";
  formUser.nis = userData.nis || "";
  formUser.gender = userData.gender || null;
  formUser.kelas_id = userData.kelas_id || null;
  formUser.jurusan = userData.jurusan || null;

  modalForm.value = true;
};

// Di dalam file AdminDashboard.vue (Fungsi submitUser)

const submitUser = async () => {
  btnLoading.value = true;
  try {
    let response;

    // Tampilkan loading spinner kecil selama proses penyimpanan
    Swal.fire({
      title: "Menyimpan Data...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    if (isEditMode.value) {
      // Menggunakan selectedId.value dan backtick agar menembak ID dengan benar
      response = await api.put(`/admin/users/${selectedId.value}`, formUser);
    } else {
      // Tambahkan role sesuai tab yang aktif saat membuat akun baru
      formUser.role = currentTab.value === "guru" ? "guru" : "siswa";
      response = await api.post("/admin/users", formUser);
    }

    // 🌟 1. NOTIFIKASI SUKSES
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: `Data ${currentTab.value === "guru" ? "Guru" : "Siswa"} sukses disimpan.`,
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: "rounded-2xl" },
    });

    modalForm.value = false;

    // 🌟 PERBAIKAN: Gunakan fungsi bawaan milikmu untuk memuat ulang data tabel & statistik
    fetchGridData(currentTab.value);
    loadStats();
  } catch (error) {
    const status = error.response?.status;
    const errorMsg =
      error.response?.data?.message || "Gagal menghubungi server database.";

    // 🌟 2. NOTIFIKASI EROR DUPLIKAT (Misal: NIP/Username sudah dipakai)
    if (status === 400 || status === 409) {
      Swal.fire({
        icon: "warning",
        title: "Data Duplikat!",
        text: errorMsg,
        confirmButtonColor: "#f59e0b", // Amber/Jingga
        confirmButtonText: "Periksa Kembali",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-bold text-sm px-6 py-2.5",
        },
      });
    }
    // 🌟 3. NOTIFIKASI EROR SERVER FATAL ATAU EROR LAINNYA
    else {
      Swal.fire({
        icon: "error",
        title: "Eror Server",
        text: `Terjadi kendala sistem: ${errorMsg}`,
        confirmButtonColor: "#10b981", // Kembali ke warna utama emerald
        confirmButtonText: "Tutup",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-bold text-sm px-6 py-2.5",
        },
      });
    }
  } finally {
    btnLoading.value = false;
  }
};

const hapusUser = async (userId) => {
  try {
    // 1. Munculkan loading
    Swal.fire({
      title: "Menghapus Data...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    // 2. Eksekusi penghapusan ke database
    const response = await api.delete(`/admin/users/${userId}`);

    if (response.data.success) {
      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Data user berhasil dihapus dari sistem secara permanen.",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });

      fetchGridData(currentTab.value);
      loadStats();
    }
  } catch (error) {
    const status = error.response?.status;
    let errorMsg =
      error.response?.data?.message ||
      "Terjadi kesalahan pada server saat menghapus.";

    // 🌟 LOGIKA BARU: Tangkap eror relasi jadwal (Foreign Key)
    // Jika backend mengirim status 500 atau pesan mengandung kata foreign key/jadwal
    if (
      status === 500 ||
      errorMsg.includes("foreign key") ||
      errorMsg.includes("jadwal")
    ) {
      errorMsg =
        "Tidak dapat menghapus! Guru ini masih memiliki Jadwal Mengajar aktif. Silakan hapus jadwalnya terlebih dahulu di menu Jadwal Mengajar Guru.";

      // Tampilkan SweetAlert dengan ikon Warning (Peringatan) bukan Eror silang merah
      Swal.fire({
        icon: "warning",
        title: "Data Terkunci",
        text: errorMsg,
        confirmButtonColor: "#f59e0b", // Warna Amber/Jingga agar lebih ramah
        confirmButtonText: "Mengerti",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-bold text-sm px-6 py-2.5",
        },
      });
    } else {
      // Jika eror karena hal lain (misal koneksi putus)
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: errorMsg,
        confirmButtonColor: "#10b981",
        confirmButtonText: "Tutup",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-bold text-sm px-6 py-2.5",
        },
      });
    }
  }
};

const switchTab = (tabName) => {
  currentTab.value = tabName;
  isSidebarOpen.value = false;
  if (tabName === "guru" || tabName === "siswa") {
    fetchGridData(tabName);
  } else if (tabName === "overview") {
    loadStats();
  }
};

const handleLogout = () => {
  Swal.fire({
    title: "Konfirmasi Keluar",
    text: "Apakah kamu yakin ingin keluar dari sesi Admin?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444", // Warna merah muda/rose khas opsi destruktif
    cancelButtonColor: "#64748b", // Warna slate/abu-abu netral
    confirmButtonText: "Ya, Keluar Saja!",
    cancelButtonText: "Batal",
    reverseButtons: true, // Membalik posisi tombol agar tombol batal mudah dijangkau di HP
    customClass: {
      popup: "rounded-2xl",
      confirmButton: "rounded-xl font-bold text-sm px-5 py-2.5 shadow-sm",
      cancelButton: "rounded-xl font-bold text-sm px-5 py-2.5",
    },
  }).then((result) => {
    // Jika tombol 'Ya, Keluar' ditekan
    if (result.isConfirmed) {
      // 1. Bersihkan semua data sesi di localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("role");

      // 2. Tampilkan notifikasi sukses kecil (opsional, bisa dibuang jika dirasa berlebihan)
      Swal.fire({
        icon: "success",
        title: "Berhasil Keluar",
        text: "Sesi kamu telah berakhir dengan aman.",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });

      // 3. Alihkan kembali ke halaman utama/login
      router.push("/");
    }
  });
};

onMounted(() => {
  loadStats();
  loadMasterKelas(); // 🔴 Jalankan penarikan data kelas saat admin masuk
});
</script>

<style scoped>
/* Style custom PrimeVue DataTable & Dialog tetap sama persis seperti yang kita buat */
:deep(.p-datatable-minimalist),
:deep(.p-datatable-minimalist .p-datatable-table) {
  background: #fff !important;
  border-radius: 12px !important;
}
:deep(.p-datatable-minimalist .p-datatable-tbody > tr) {
  background: #fff !important;
  color: #171717 !important;
}
:deep(.p-datatable-minimalist .p-datatable-tbody > tr:hover) {
  background: #fafafa !important;
}
:deep(.p-datatable-minimalist .p-datatable-tbody > tr > td) {
  padding: 14px 16px !important;
  border-bottom: 1px solid #f5f5f5 !important;
  white-space: nowrap !important;
}
:deep(.p-datatable-minimalist .p-datatable-thead > tr > th) {
  background: #fff !important;
  color: #737373 !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  border-bottom: 1px solid #f5f5f5 !important;
  text-transform: uppercase;
  white-space: nowrap !important;
}
:deep(.p-datatable-minimalist .p-paginator) {
  background: #fff !important;
  border-top: 1px solid #f5f5f5 !important;
  padding: 12px 0 !important;
}
:deep(.p-datatable-minimalist .p-paginator-page.p-highlight) {
  background: #171717 !important;
  color: #fff !important;
}
:deep(.p-dialog) {
  background: #fff !important;
  border-radius: 20px !important;
}
:deep(.p-dialog-header) {
  background: #fff !important;
  color: #171717 !important;
  border-bottom: 1px solid #f5f5f5 !important;
  padding: 24px 24px 16px 24px !important;
}
:deep(.p-dialog-content) {
  background: #fff !important;
  padding: 24px !important;
}
:deep(.p-dialog-content .p-inputtext),
:deep(.p-dialog-content .p-select),
:deep(.p-dialog-content .p-password input) {
  background: #fff !important;
  color: #171717 !important;
  border: 1px solid #e5e5e5 !important;
}
:deep(.p-dialog-content .p-inputtext:focus),
:deep(.p-dialog-content .p-select:focus-within),
:deep(.p-dialog-content .p-password input:focus) {
  border-color: #171717 !important;
}
</style>

<style>
body .swal2-container {
  z-index: 999999 !important;
}
</style>
