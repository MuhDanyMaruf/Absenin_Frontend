import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <--- Import router yang baru dibuat
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import './style.css'

const app = createApp(App)

app.use(router) // <--- Gunakan router
app.use(PrimeVue, {
    theme: { preset: Aura }
})

app.mount('#app')