<template>
  <v-btn
    v-for="(button, index) in buttons"
    :key="index"
    class="stopwatch-btns"
    size="x-small"
    color="grey"
    icon
    @click="$emit(button)"
  >
    <v-icon>mdi-{{ button }}</v-icon>
  </v-btn>
</template>

<script setup>
import { ref } from "vue";
const buttons = ref(["play", "pause", "reload"]);
defineEmits(["play", "pause", "reload"]);
</script>

<style scoped>
.stopwatch-btns {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
}
</style>
