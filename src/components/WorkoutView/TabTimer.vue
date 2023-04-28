<template>
  <div class="timer-text" justify="center">
    <span>{{ timer.minutes }}</span
    >&nbsp;:&nbsp;<span>{{ timer.seconds }}</span>
  </div>
  <v-row align="center" justify="center" class="play-btns">
    <v-btn
      class="stopwatch-btns"
      size="x-small"
      color="grey"
      icon
      @click="timer.resume()"
    >
      <v-icon>mdi-play</v-icon>
    </v-btn>
    <v-btn
      class="stopwatch-btns"
      size="x-small"
      color="grey"
      icon
      @click="timer.pause()"
    >
      <v-icon>mdi-pause</v-icon>
    </v-btn>
    <v-btn
      class="stopwatch-btns"
      size="x-small"
      color="grey"
      icon
      @click="restartTimer()"
    >
      <v-icon>mdi-reload</v-icon>
    </v-btn>
  </v-row>
</template>

<script setup>
import { onMounted, watchEffect, computed } from "vue";
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
    const audioFinish = new Audio(require("../../assets/finish.mp3"));
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
