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
import { ref, computed } from "vue";
import { useStopwatch } from "vue-timer-hook";

const stopwatch = ref(useStopwatch());
stopwatch.value.reset();
stopwatch.value.pause();

const isRunning = computed(()=>{
    return stopwatch.value.isRunning
})

defineExpose({ isRunning });
</script>



<style scoped>
.stopwatch-btns {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
}

.timer-text {
  padding: 10px 10px 10px 10px;
  text-align: center;
  font-size: 40px;
}

.play-btns {
  margin-top: 22px;
}
</style>