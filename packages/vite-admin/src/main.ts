import { createApp } from 'vue'
import './style.css'

import App from './App.vue'
import { router } from './router'
if (import.meta.env.DEV) {
    document.domain = 'localhost'
}
const app = createApp(App)
app.use(router)
app.mount('#app')

