<template>
  <v-btn
    class="stopwatch-btns"
    size="x-small"
    color="grey"
    icon
    @click="$emit('start')"
  >
    <v-icon>mdi-play</v-icon>
  </v-btn>
  <v-btn
    class="stopwatch-btns"
    size="x-small"
    color="grey"
    icon
    @click="$emit('pause')"
  >
    <v-icon>mdi-pause</v-icon>
  </v-btn>
  <v-btn
    class="stopwatch-btns"
    size="x-small"
    color="grey"
    icon
    @click="$emit('restart')"
  >
    <v-icon>mdi-reload</v-icon>
  </v-btn>
</template>

<script setup>
defineEmits(["start", "pause", "restart"]);
</script>

<style scoped>
.stopwatch-btns {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
}
</style>
