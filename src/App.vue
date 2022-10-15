<template>
  <v-app>
    <BottomToolbar></BottomToolbar>
    <TopToolbar></TopToolbar>
    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import TopToolbar from './components/TopToolbar.vue'
import BottomToolbar from './components/BottomToolbar.vue'

export default {
  name: 'App',

  components: {
    HelloWorld,
    TopToolbar,
    BottomToolbar,
  },

  data() {
    return{

    };
  },
}
</script>
