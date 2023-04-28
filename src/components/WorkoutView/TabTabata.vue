<template>
  <div class="timer-text" justify="center">
    <span>{{ tabataTimer.minutes }}</span
    >&nbsp;:&nbsp;<span>{{ tabataTimer.seconds }}</span>
  </div>
  <v-row align="center" justify="center" style="margin-top: 10px">
    <v-col cols="3">
      <p class="cycles-sets-numbers">
        {{ currentSet }}/{{ storeTimer.tabata.sets }}
      </p>
      <p class="cycles-sets-text">Sets</p>
    </v-col>
    <v-col cols="6" class="d-flex justify-center">
      <v-btn
        class="stopwatch-btns"
        size="x-small"
        color="grey"
        icon
        @click="tabataTimer.resume()"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <v-btn
        class="stopwatch-btns"
        size="x-small"
        color="grey"
        icon
        @click="tabataTimer.pause()"
      >
        <v-icon>mdi-pause</v-icon>
      </v-btn>
      <v-btn
        class="stopwatch-btns"
        size="x-small"
        color="grey"
        icon
        @click="resetTabata()"
      >
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="3">
      <p class="cycles-sets-numbers">
        {{ currentCycle }}/{{ storeTimer.tabata.cycles }}
      </p>
      <p class="cycles-sets-text">Cycles</p>
    </v-col>
  </v-row>
</template>

<script setup>
import { watchEffect, onMounted, ref, computed } from "vue";
import { useTimer } from "vue-timer-hook";
import { useStoreTimer } from "@/stores/storeTimer";

const storeTimer = useStoreTimer();
//TABATA
let currentSet = ref(0);
let currentCycle = ref(0);
let tabataTime = new Date();
tabataTime.setSeconds(tabataTime.getSeconds() + storeTimer.tabata.prepareTime);
let tabataTimer = useTimer(tabataTime);
tabataTimer.pause();
let tabataMode = ref(0);

const restartTabata = (time) => {
  const tabataTime = new Date();
  tabataTime.setSeconds(tabataTime.getSeconds() + time);
  tabataTimer.restart(tabataTime);
  tabataTimer.pause();
};
const resetTabata = () => {
  restartTabata(storeTimer.tabata.prepareTime);
  currentCycle.value = 0;
  currentSet.value = 0;
  tabataMode.value = 0;
};
const goToState = (time, state) => {
  restartTabata(time);
  tabataTimer.resume();
  tabataMode.value = state;
};

onMounted(() => {
  watchEffect(async () => {
    const audioFinish = new Audio(require("../../assets/finish.mp3"));
    const audioBuzzer = new Audio(require("../../assets/buzzer.mp3"));
    if (tabataTimer.isExpired.value) {
      if (tabataMode.value === 0) {
        // PREPARE
        audioBuzzer.play();
        currentCycle.value = 1;
        currentSet.value = 1;
        goToState(storeTimer.tabata.workTime, 1);
      } else if (tabataMode.value === 1) {
        // WORK
        if (
          currentCycle.value === storeTimer.tabata.cycles &&
          currentSet.value < storeTimer.tabata.sets
        ) {
          audioBuzzer.play();
          goToState(
            storeTimer.tabata.restBetweenSets > 0
              ? storeTimer.tabata.restBetweenSets
              : storeTimer.tabata.rest,
            3
          );
        } else if (currentCycle.value < storeTimer.tabata.cycles) {
          audioBuzzer.play();
          goToState(storeTimer.tabata.rest, 2);
        } else {
          audioFinish.play();
          tabataMode.value = 4;
        }
      } else if (tabataMode.value === 2) {
        // REST
        audioBuzzer.play();
        if (currentCycle.value < storeTimer.tabata.cycles) {
          goToState(storeTimer.tabata.workTime, 1);
          currentCycle.value = currentCycle.value + 1;
        } else if (currentSet.value < storeTimer.tabata.sets) {
          goToState(storeTimer.tabata.restBetweenSets, 3);
        }
      } else if (tabataMode.value === 3) {
        // REST BETWEEN SETS
        currentCycle.value = 1;
        currentSet.value = currentSet.value + 1;
        goToState(storeTimer.tabata.workTime, 1);
        audioBuzzer.play();
      }
    }
  });
});

const isRunning = computed(() => {
  return tabataTimer.isRunning;
});

const tabataStatus = computed(() => {
  switch (tabataMode.value) {
    case 0:
      return "PREPARE";
    case 1:
      return "WORK";
    case 2:
    case 3:
      return "REST";
    case 4:
      return "FINISHED";
  }
  return "";
});

defineExpose({ isRunning, tabataStatus });
</script>
