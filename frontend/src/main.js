import './assets/main.css'
import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js' // import the router

createApp(App)
  .use(router) // use the router
  .mount('#app')