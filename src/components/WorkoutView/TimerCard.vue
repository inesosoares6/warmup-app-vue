<template>
  <v-card :color="getColor()" height="200px">
    <v-card-title>
      <v-row class="timer-title">
        <v-btn-toggle border v-model="toggle_exclusive" divided :disabled="isRunning">
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
        <span class="tabata-text" v-if="mode == 2">{{ getTabataText() }}</span>
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
          <TabataSettings v-on:updateTimes="resetTabata()" />
        </v-btn>
      </v-row>
    </v-card-title>
    <v-card-text>
      <TabStopwatch v-if="mode === 0" />
      <TabTimer v-else-if="mode === 1" />
      <TabTabata v-else />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import TabStopwatch from "@/components/WorkoutView/TabStopwatch.vue";
import TabTimer from "@/components/WorkoutView/TabTimer.vue";
import TabTabata from "@/components/WorkoutView/TabTabata.vue";
import TabataSettings from "@/components/pop-ups/TabataSettings.vue";
import { useStoreTimer } from "@/stores/storeTimer";

const storeTimer = useStoreTimer();
const mode = ref(0);
const toggle_exclusive = ref(0);
let seconds = ref(storeTimer.timer);
const isRunning = ref(false);
const tabataMode = ref(0);

const getColor = () => {
  if (isRunning.value && (mode.value === 0 || mode.value === 1)) {
    return "error";
  } else if (isRunning.value && mode.value === 2) {
    switch (tabataMode.value) {
      case 0:
      case 2:
      case 3:
        return "warning";
      case 1:
        return "error";
    }
  } else {
    return "secondary";
  }
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
</script>

<style>
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
