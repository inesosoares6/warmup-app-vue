<template>
  <DisplayTime :time="tabataTimer" />
  <v-row align="center" justify="center" style="margin-top: 10px">
    <DisplaySetsCycles
      text="Sets"
      :currentValue="currentSet"
      :totalValue="storeTimer.tabata.sets.value"
    />
    <v-col cols="6" class="d-flex justify-center">
      <ControlButtons
        v-on:play="tabataTimer.resume()"
        v-on:pause="tabataTimer.pause()"
        v-on:reload="resetTabata()"
      />
    </v-col>
    <DisplaySetsCycles
      text="Cycles"
      :currentValue="currentCycle"
      :totalValue="storeTimer.tabata.cycles.value"
    />
  </v-row>
</template>

<script setup>
import { watchEffect, onMounted, ref, computed } from "vue";
import ControlButtons from "@/components/WorkoutView/Timer/ControlButtons.vue";
import DisplayTime from "@/components/WorkoutView/Timer/DisplayTime.vue";
import DisplaySetsCycles from "@/components/WorkoutView/Timer/DisplaySetsCycles.vue";
import { useTimer } from "vue-timer-hook";
import { useStoreTimer } from "@/stores/storeTimer";

const storeTimer = useStoreTimer();

const currentSet = ref(0);
const currentCycle = ref(0);
const tabataMode = ref(0);
let tabataTime = new Date();
tabataTime.setSeconds(
  tabataTime.getSeconds() + storeTimer.tabata.prepareTime.value
);
let tabataTimer = useTimer(tabataTime);
tabataTimer.pause();

const restartTabata = (time) => {
  tabataTime = new Date();
  tabataTime.setSeconds(tabataTime.getSeconds() + time);
  tabataTimer.restart(tabataTime);
  tabataTimer.pause();
};
const resetTabata = () => {
  restartTabata(storeTimer.tabata.prepareTime.value);
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
    const audioFinish = new Audio(require("../../../assets/finish.mp3"));
    const audioBuzzer = new Audio(require("../../../assets/buzzer.mp3"));
    if (tabataTimer.isExpired.value) {
      switch (tabataMode.value) {
        case 0: // PREPARE
          currentCycle.value = 1;
          currentSet.value = 1;
          goToState(storeTimer.tabata.workTime.value, 1);
          audioBuzzer.play();
          break;
        case 1: // WORK
          if (
            currentCycle.value === storeTimer.tabata.cycles.value &&
            currentSet.value < storeTimer.tabata.sets.value
          ) {
            audioBuzzer.play();
            goToState(
              storeTimer.tabata.restBetweenSets.value > 0
                ? storeTimer.tabata.restBetweenSets.value
                : storeTimer.tabata.restTime.value,
              3
            );
          } else if (currentCycle.value < storeTimer.tabata.cycles.value) {
            audioBuzzer.play();
            goToState(storeTimer.tabata.restTime.value, 2);
          } else {
            audioFinish.play();
            tabataMode.value = 4;
          }
          break;
        case 2: // REST BETWEEN CYCLES
          currentCycle.value = currentCycle.value + 1;
          goToState(storeTimer.tabata.workTime.value, 1);
          audioBuzzer.play();
          break;
        case 3: // REST BETWEEN SETS
          currentCycle.value = 1;
          currentSet.value = currentSet.value + 1;
          goToState(storeTimer.tabata.workTime.value, 1);
          audioBuzzer.play();
          break;
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

defineExpose({ isRunning, tabataStatus, resetTabata });
</script>
