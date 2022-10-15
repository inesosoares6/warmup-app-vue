<template>
  <v-app>
    <BottomToolbar></BottomToolbar>
    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import BottomToolbar from './components/BottomToolbar.vue'

export default {
  name: 'App',

  components: {
    HelloWorld,
    BottomToolbar,
  },

  data() {
    return{

    };
  },
}
</script>
