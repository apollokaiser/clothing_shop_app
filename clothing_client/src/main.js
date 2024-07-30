import "@/assets/main.css"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const app = createApp(App)


const vuetify = createVuetify({
  components,
  directives,
}) 
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(vue3GoogleLogin, {
    clientId: '1000426255601-gegcrjo15vbu0vlaibgvlk43q2imtkk3.apps.googleusercontent.com'
  })

app.mount('#app')
