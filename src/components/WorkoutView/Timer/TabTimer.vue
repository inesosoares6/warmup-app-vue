<template>
  <div class="timer-text" justify="center">
    <span>{{ timer.minutes }}</span
    >&nbsp;:&nbsp;<span>{{ timer.seconds }}</span>
  </div>
  <v-row align="center" justify="center" class="play-btns">
    <ControlButtons
      v-on:play="timer.resume()"
      v-on:pause="timer.pause()"
      v-on:reload="restartTimer()"
    />
  </v-row>
</template>

<script setup>
import { onMounted, watchEffect, computed } from "vue";
import ControlButtons from "@/components/WorkoutView/Timer/ControlButtons.vue";
import { useStoreTimer } from "@/stores/storeTimer";
import { useTimer } from "vue-timer-hook";

const storeTimer = useStoreTimer();
const seconds = computed(() => {
  return storeTimer.getTimer;
});

let time = new Date();
time.setSeconds(time.getSeconds() + seconds.value);
let timer = useTimer(time);
timer.pause();

const restartTimer = () => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + seconds.value);
  timer.restart(time);
  timer.pause();
};

onMounted(() => {
  watchEffect(async () => {
    const audioFinish = new Audio(require("../../../assets/finish.mp3"));
    if (timer.isExpired.value) {
      audioFinish.play();
    }
  });
});

const isRunning = computed(() => {
  return timer.isRunning;
});

defineExpose({ isRunning, restartTimer });
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
