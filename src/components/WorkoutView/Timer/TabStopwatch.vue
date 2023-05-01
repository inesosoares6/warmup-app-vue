<template>
  <DisplayTime :time="stopwatch"/>
  <v-row align="center" justify="center" class="play-btns">
    <ControlButtons
      v-on:play="stopwatch.start()"
      v-on:pause="stopwatch.pause()"
      v-on:reload="
        stopwatch.reset();
        stopwatch.pause();
      "
    />
  </v-row>
</template>

<script setup>
import { computed } from "vue";
import ControlButtons from "@/components/WorkoutView/Timer/ControlButtons.vue";
import DisplayTime from "@/components/WorkoutView/Timer/DisplayTime.vue";
import { useStopwatch } from "vue-timer-hook";

const stopwatch = useStopwatch();
stopwatch.reset();
stopwatch.pause();

const isRunning = computed(() => {
  return stopwatch.isRunning;
});

defineExpose({ isRunning });
</script>

<style scoped>
.play-btns {
  margin-top: 22px;
}
</style>
