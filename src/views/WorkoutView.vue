<template>
  <v-container>
    <v-card
      v-if="storeWorkouts.getCurrentWorkout.name !== undefined"
      :title="storeWorkouts.getCurrentWorkout.name"
      :subtitle="storeWorkouts.getCurrentWorkout.type + ' - ' + storeWorkouts.getCurrentWorkout.time + ' min'"
    >
      <template v-slot:prepend>
        <v-icon size="small" color="secondary">mdi-weight-lifter</v-icon>
      </template>
      <template v-slot:append>
        <v-checkbox
          v-model="checkbox"
          label="Done"
          hide-details
          @change="updateWorkout"
        ></v-checkbox>
      </template>
      <v-divider></v-divider>
      <v-col>
        <v-btn class="details-button" color="transparent" icon>
          <v-icon>mdi-dots-vertical</v-icon>
          <WorkoutDetails
            v-bind:workout="storeWorkouts.getCurrentWorkout"
          ></WorkoutDetails>
        </v-btn>
      </v-col>
      <v-card-text
        class="exercises"
        v-html="storeWorkouts.getCurrentWorkout.exercises.replaceAll('\n', '<br/>')"
      >
      </v-card-text>
      <v-col>
        <v-btn
          class="floating-button"
          color="secondary"
          icon
          @click="copyWorkout"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </v-col>
    </v-card>

    <v-divider thickness="0px"></v-divider>

    <v-card
      :color="getColor()"
      height="200px"
    >
      <v-card-title>
        <v-row class="timer-title">
          <v-btn-toggle
            border
            v-model="toggle_exclusive"
            divided
            :disabled="
              stopwatch.isRunning.value ||
              timer.isRunning.value ||
              tabataTimer.isRunning.value
            "
          >
            <v-btn size="small" @click="mode = 0">
              <v-icon>mdi-timer</v-icon>
            </v-btn>
            <v-btn size="small" @click="mode = 1">
              <v-icon>mdi-timer-sand</v-icon>
            </v-btn>
            <v-btn size="small" @click="mode = 2">
              <v-icon>mdi-camera-timer</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-spacer></v-spacer>
          <span class="tabata-text" v-if="mode == 2">{{
            getTabataText()
          }}</span>
          <v-spacer></v-spacer>
          <v-text-field
            v-if="mode === 1"
            v-model="seconds"
            @change="restartTimer()"
            type="number"
            label="Timer (s)"
          ></v-text-field>
          <v-btn
            v-if="mode === 2"
            size="small"
            icon
            color="grey"
            style="margin-right: 5px"
          >
            <v-icon>mdi-dots-vertical</v-icon>
            <TabataSettings v-on:updateTimes="resetTabata()"/>
          </v-btn>
        </v-row>
      </v-card-title>
      <v-card-text v-if="mode === 0">
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
      </v-card-text>
      <v-card-text v-else-if="mode === 1">
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
      </v-card-text>
      <v-card-text v-else>
        <div class="timer-text" justify="center">
          <span>{{ tabataTimer.minutes }}</span
          >&nbsp;:&nbsp;<span>{{ tabataTimer.seconds }}</span>
        </div>
        <v-row align="center" justify="center" style="margin-top: 10px;">
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
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:actions>
        <v-btn color="error" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { watchEffect, onMounted, ref } from "vue";
import { Clipboard } from "@capacitor/clipboard";
import { useStopwatch, useTimer } from "vue-timer-hook";
import TabataSettings from "@/components/pop-ups/TabataSettings.vue";
import WorkoutDetails from "@/components/pop-ups/WorkoutDetails.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";
import { useStoreTimer } from "@/stores/storeTimer";

const storeWorkouts = useStoreWorkouts();
const storeTimer = useStoreTimer();

const checkbox = ref(false);
const snackbar = ref(false);
const text = ref("");
const timeout = ref(2000);
const mode = ref(0);
const toggle_exclusive = ref(0);

const copyWorkout = () => {
  Clipboard.write({
    string: createStringWorkout(),
  });
  snackbar.value = true;
  text.value = "Copied workout to clipboard";
};

const createStringWorkout = () => {
  return (
    storeWorkouts.getCurrentWorkout.name +
    "\n" +
    storeWorkouts.getCurrentWorkout.type +
    " - " +
    storeWorkouts.getCurrentWorkout.time +
    " min" +
    "\n-------------\n" +
    storeWorkouts.getCurrentWorkout.exercises
  );
};

const updateWorkout = () => {
  if (checkbox.value) storeWorkouts.updateWorkout();
};

//STOPWATCH
let stopwatch = useStopwatch();
stopwatch.reset();
stopwatch.pause();

//TIMER
let time = new Date();
let seconds = ref(storeTimer.timer);
time.setSeconds(time.getSeconds() + seconds.value);
let timer = useTimer(time);
timer.pause();
const restartTimer = () => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + seconds.value);
  timer.restart(time);
  timer.pause();
  storeTimer.updateTimer(seconds.value);
};

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
const getTabataText = () => {
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
};
const getColor = () => {
  if (stopwatch.isRunning.value || timer.isRunning.value) {
    return "error";
  } else if (tabataTimer.isRunning.value) {
    switch (tabataMode.value) {
      case 0:
      case 2:
      case 3:
        return "yellow";
      case 1:
        return "error";
    }
  } else {
    return "secondary";
  }
};

onMounted(() => {
  snackbar.value = storeWorkouts.getCurrentWorkout.name === undefined;
  text.value = "No workout selected";
  watchEffect(async () => {
    const audioFinish = new Audio(require("../assets/finish.mp3"));
    const audioBuzzer = new Audio(require("../assets/buzzer.mp3"));
    if (timer.isExpired.value) {
      audioFinish.play();
    }
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

</script>

<style scoped>
.floating-button {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.details-button {
  position: absolute;
  top: 100px;
  left: 5px;
}

.exercises {
  text-align: center;
  font-size: 20px;
}

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

.v-divider {
  margin-top: 5px;
  margin-bottom: 10px;
}

.v-text-field {
  width: 10px !important;
}

.v-card-title {
  margin-bottom: 10px;
  margin-top: 0px;
}

.timer-title {
  margin-top: 5px;
  height: 55px;
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

.play-btns {
  margin-top: 22px;
}

.tabata-text {
  margin-top: 8px;
}
</style>
