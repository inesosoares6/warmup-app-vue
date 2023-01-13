import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "@mdi/font/css/materialdesignicons.css";
import { createRouter, createWebHashHistory } from "vue-router";
import AllView from "./views/AllView.vue";
import HomeView from "./views/HomeView.vue";
import WorkoutView from "./views/WorkoutView.vue";
import PersonalView from "./views/PersonalView.vue";

const routes = [
  { name: "home-view", path: "/", component: HomeView, props: true },
  {
    name: "workout-view",
    path: "/workout-view",
    component: WorkoutView,
  },
  { name: "all-view", path: "/all-view", component: AllView, props: true },
  { name: "personal-view", path: "/personal-view", component: PersonalView, props: true },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const pinia = createPinia()

loadFonts();

createApp(App).use(vuetify).use(router).use(pinia).mount("#app");
