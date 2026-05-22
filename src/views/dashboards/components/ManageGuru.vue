<template>
  <div class="bg-white p-4 md:p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4 overflow-hidden">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-2">
      <div>
        <h3 class="text-sm md:text-base font-bold text-neutral-900">Daftar Data Master Guru</h3>
        <p class="text-xs text-neutral-400">Total data terdaftar: {{ listData.length }} orang</p>
      </div>
      <Button 
        label="Tambah Guru" 
        icon="pi pi-plus" 
        @click="$emit('add-user')"
        class="p-button-sm bg-neutral-900 text-white border-none font-semibold cursor-pointer text-xs h-10 px-4 rounded-xl w-full sm:w-auto" 
      />
    </div>
    
    <div class="overflow-x-auto w-full rounded-xl border border-neutral-100">
      <DataTable :value="listData" :loading="loading" paginator :rows="6" responsiveLayout="scroll" class="p-datatable-minimalist min-w-[600px] w-full">
        <template #empty>
          <div class="text-center py-12 text-neutral-400 bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200 text-xs font-medium">
            Tidak ada data guru ditemukan.
          </div>
        </template>

        <Column field="username" header="NIP / USERNAME">
          <template #body="slotProps">
            <span class="font-semibold text-neutral-800 tracking-tight text-xs">{{ slotProps.data.username }}</span>
          </template>
        </Column>

        <Column field="email" header="EMAIL">
          <template #body="slotProps">
            <span class="text-neutral-500 text-xs font-medium">{{ slotProps.data.email || '—' }}</span>
          </template>
        </Column>

        <Column header="AKSI" class="w-24 text-center">
          <template #body="slotProps">
            <div class="flex items-center justify-center gap-1">
              <button type="button" @click="$emit('edit-user', slotProps.data)" class="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button type="button" @click="$emit('delete-user', slotProps.data.id)" class="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border-none bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

defineProps({
  listData: Array,
  loading: Boolean
});
defineEmits(['add-user', 'edit-user', 'delete-user']);
</script>