import { createApp } from 'vue'
import { router } from './router/index'
import './style.css'
import App from './App.vue'
if (import.meta.env.DEV) {
    document.domain = 'localhost'
}

const app = createApp(App)
app.use(router)
app.mount('#app')
