<template>
  <v-container>
    <v-card
      v-if="currentWorkout.name !== undefined"
      :title="currentWorkout.name"
      :subtitle="currentWorkout.type + ' - ' + currentWorkout.time + ' min'"
    >
    <template v-slot:append>
      <v-checkbox
          v-model="checkbox"
          label="Done"
          hide-details
          @change="updateWorkout"
        ></v-checkbox>
      </template>
      <v-divider></v-divider>
      <v-card-text
        class="exercises"
        v-html="currentWorkout.exercises.replaceAll('\n', '<br/>')"
      >
      </v-card-text>
      <v-col class="text-right">
        <v-btn
          v-if="currentWorkout.name !== undefined"
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
      v-if="currentWorkout.name !== undefined"
      :color="stopwatch.isRunning || timer.isRunning ? 'error' : 'secondary'"
    >
      <v-card-title>
        <v-row class="timer-title">
          <v-btn-toggle border v-model="toggle_exclusive" divided>
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
          <v-text-field
            v-if="mode === 1"
            v-model="seconds"
            @change="restartTimer()"
            type="number"
            label="Timer (sec)"
            hide-details
          ></v-text-field>
          <v-btn v-if="mode === 2" size="small" icon color="grey" style="margin-right: 5px;">
            <v-icon>mdi-dots-vertical</v-icon>
            <TabataSettings v-on:created-tabata="updateTabata" />
          </v-btn>
        </v-row>
      </v-card-title>
      <v-card-text v-if="mode === 0">
        <div class="timer-text" justify="center">
          <span>{{ stopwatch.minutes }}</span
          >&nbsp;:&nbsp;<span>{{ stopwatch.seconds }}</span>
        </div>
        <v-row align="center" justify="center">
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
        <v-row align="center" justify="center">
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
        <v-row align="center" justify="center">
          <v-col cols="2">
            <p class="cycles-sets-numbers">
              {{ currentSet }}/{{ tabata.sets }}
            </p>
            <p class="cycles-sets-text">Sets</p>
          </v-col>
          <v-col cols="8" class="d-flex justify-center">
            <v-btn
              class="stopwatch-btns"
              size="x-small"
              color="grey"
              icon
              @click="startTabata()"
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
              @click="restartTabata()"
            >
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="2">
            <p class="cycles-sets-numbers">
              {{ currentCycle }}/{{ tabata.cycles }}
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

<script>
import { defineComponent } from "vue";
import { Clipboard } from "@capacitor/clipboard";
import { useStopwatch, useTimer } from "vue-timer-hook";
import TabataSettings from "@/components/pop-ups/TabataSettings.vue";

export default defineComponent({
  name: "WorkoutView",
  props: ["currentWorkout"],

  components: {
    TabataSettings,
  },

  data() {
    return {
      checkbox: false,
      snackbar: false,
      text: "",
      timeout: 2000,
      mode: 0,
      toggle_exclusive: 0,
      stopwatch: null,
      time: null,
      timer: null,
      tabataTime: null,
      tabataTimer: null,
      seconds: 5,
      currentSet: 0,
      currentCycle: 0,
      tabata: {
        prepareTime: 5,
        workTime: 10,
        rest: 0,
        cycles: 1,
        sets: 1,
        restBetweenSets: 0,
      },
      endedTimer: false,
    };
  },

  updated(){
    this.endedTimer = this.timer.isExpired.value;
    console.log(this.endedTimer);
  },

  created() {
    this.snackbar = this.currentWorkout.name === undefined;
    this.text = "No workout selected";
    this.stopwatch = useStopwatch();
    this.stopwatch.reset();
    this.stopwatch.pause();
    this.restartTimer();
    this.restartTabata();
  },

  mounted() {
    
    console.log(this.timer.isExpired.value);
  },

  methods: {
    copyWorkout() {
      Clipboard.write({
        string: this.createStringWorkout(),
      });
      this.snackbar = true;
      this.text = "Copied workout to clipboard";
    },

    createStringWorkout() {
      return (
        this.currentWorkout.name +
        "\n" +
        this.currentWorkout.type +
        " - " +
        this.currentWorkout.time +
        " min" +
        "\n-------------\n" +
        this.currentWorkout.exercises
      );
    },

    restartTabata() {
      this.tabataTime = new Date();
      this.tabataTime.setSeconds(
        this.tabataTime.getSeconds() + this.tabata.prepareTime
      );
      this.tabataTimer = useTimer(this.tabataTime);
      this.tabataTimer.pause();
    },

    restartTimer() {
      this.time = new Date();
      this.time.setSeconds(this.time.getSeconds() + this.seconds);
      this.timer = useTimer(this.time);
      this.timer.pause();
    },

    startTabata() {
      this.tabataTimer.resume();
    },

    updateTabata(data) {
      console.log(data);
      this.tabata = { ...data };
    },

    updateWorkout() {
      if (this.checkbox) this.$emit("update-workout", this.currentWorkout);
    },
  },
});
</script>

<style scoped>
.floating-button {
  position: absolute;
  bottom: 5px;
  right: 5px;
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
</style>
