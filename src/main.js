import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import '@mdi/font/css/materialdesignicons.css'
import {createRouter, createWebHashHistory} from 'vue-router'
import AllView from './views/AllView.vue'
import HomeView from './views/HomeView.vue'
import WorkoutView from './views/WorkoutView.vue'

const routes = [
  { name:'home-view', path: '/', component: HomeView },
  { name:'workout-view', path: '/workout-view', component: WorkoutView },
  { name:'all-view', path: '/all-view', component: AllView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})

loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
