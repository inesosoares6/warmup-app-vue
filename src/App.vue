<template>
  <v-app>
    <BottomToolbar></BottomToolbar>
    <TopToolbar></TopToolbar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import TopToolbar from './components/TopToolbar.vue'
import BottomToolbar from './components/BottomToolbar.vue'

export default {
  name: 'App',

  components: {
    TopToolbar,
    BottomToolbar,
  },

  data() {
    return{

    };
  },
}
</script>
