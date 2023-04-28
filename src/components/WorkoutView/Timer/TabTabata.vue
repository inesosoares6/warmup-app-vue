<template>
  <div class="timer-text" justify="center">
    <span>{{ tabataTimer.minutes }}</span
    >&nbsp;:&nbsp;<span>{{ tabataTimer.seconds }}</span>
  </div>
  <v-row align="center" justify="center" style="margin-top: 10px">
    <v-col cols="3">
      <p class="cycles-sets-numbers">
        {{ currentSet }}/{{ storeTimer.tabata.sets.value }}
      </p>
      <p class="cycles-sets-text">Sets</p>
    </v-col>
    <v-col cols="6" class="d-flex justify-center">
      <ControlButtons
        v-on:start="tabataTimer.resume()"
        v-on:pause="tabataTimer.pause()"
        v-on:restart="resetTabata()"
      />
    </v-col>
    <v-col cols="3">
      <p class="cycles-sets-numbers">
        {{ currentCycle }}/{{ storeTimer.tabata.cycles.value }}
      </p>
      <p class="cycles-sets-text">Cycles</p>
    </v-col>
  </v-row>
</template>

<script setup>
import { watchEffect, onMounted, ref, computed } from "vue";
import ControlButtons from "@/components/WorkoutView/Timer/ControlButtons.vue";
import { useTimer } from "vue-timer-hook";
import { useStoreTimer } from "@/stores/storeTimer";

const storeTimer = useStoreTimer();

let currentSet = ref(0);
let currentCycle = ref(0);
let tabataTime = new Date();
tabataTime.setSeconds(
  tabataTime.getSeconds() + storeTimer.tabata.prepareTime.value
);
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
      if (tabataMode.value === 0) {
        // PREPARE
        audioBuzzer.play();
        currentCycle.value = 1;
        currentSet.value = 1;
        goToState(storeTimer.tabata.workTime.value, 1);
      } else if (tabataMode.value === 1) {
        // WORK
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
      } else if (tabataMode.value === 2) {
        // REST
        audioBuzzer.play();
        if (currentCycle.value < storeTimer.tabata.cycles.value) {
          goToState(storeTimer.tabata.workTime.value, 1);
          currentCycle.value = currentCycle.value + 1;
        } else if (currentSet.value < storeTimer.tabata.sets.value) {
          goToState(storeTimer.tabata.restBetweenSets.value, 3);
        }
      } else if (tabataMode.value === 3) {
        // REST BETWEEN SETS
        currentCycle.value = 1;
        currentSet.value = currentSet.value + 1;
        goToState(storeTimer.tabata.workTime.value, 1);
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

defineExpose({ isRunning, tabataStatus, resetTabata });
</script>

<style scoped>
.timer-text {
  padding: 10px 10px 10px 10px;
  text-align: center;
  font-size: 40px;
}

.cycles-sets-numbers {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.cycles-sets-text {
  text-align: center;
  font-size: 11px;
  color: grey;
}
</style>
