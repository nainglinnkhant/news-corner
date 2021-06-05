import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'

const app = createApp(App)

const BaseSpinner = defineAsyncComponent(() => import('./components/BaseSpinner.vue'))

app.use(router)
app.use(store)

app.component('base-spinner', BaseSpinner)

app.mount('#app')
