<template>
  <div class="timer-text" justify="center">
    <span>{{ stopwatch.minutes }}</span
    >&nbsp;:&nbsp;<span>{{ stopwatch.seconds }}</span>
  </div>
  <v-row align="center" justify="center" class="play-btns">
    <v-btn
      class="stopwatch-btns"
      size="x-small"
      color="grey"
      icon
      @click="stopwatch.start()"
    >
      <v-icon>mdi-play</v-icon>
    </v-btn>
    <v-btn
      class="stopwatch-btns"
      size="x-small"
      color="grey"
      icon
      @click="stopwatch.pause()"
    >
      <v-icon>mdi-pause</v-icon>
    </v-btn>
    <v-btn
      class="stopwatch-btns"
      size="x-small"
      color="grey"
      icon
      @click="
        stopwatch.reset();
        stopwatch.pause();
      "
    >
      <v-icon>mdi-reload</v-icon>
    </v-btn>
  </v-row>
</template>

<script setup>
import { ref } from "vue";
import { useStopwatch } from "vue-timer-hook";

const stopwatch = ref(useStopwatch());
stopwatch.value.reset();
stopwatch.value.pause();

defineExpose({ stopwatch });
</script>
