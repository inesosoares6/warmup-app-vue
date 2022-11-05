<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline">Workout</h1>
      </v-col>
      <v-col>
        <v-checkbox
          v-if="currentWorkout.name !== undefined"
          v-model="checkbox"
          label="Mark as done"
          hide-details
          @change="updateWorkout"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-card
      v-if="currentWorkout.name !== undefined"
      :title="currentWorkout.name"
      :subtitle="currentWorkout.type + ' - ' + currentWorkout.time + ' min'"
    >
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
          <v-btn-toggle border>
            <v-btn size="small" :active="!isTimer" @click="isTimer = false">
              <v-icon>mdi-timer</v-icon>
            </v-btn>
            <v-btn size="small" :active="isTimer" @click="isTimer = true">
              <v-icon>mdi-timer-sand</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-spacer></v-spacer>
          <v-text-field
            v-if="isTimer"
            v-model="seconds"
            @change="restartTimer()"
            type="number"
            label="Timer (sec)"
            hide-details
          ></v-text-field>
        </v-row>
      </v-card-title>
      <v-card-text v-if="!isTimer">
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
      <v-card-text v-else>
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

export default defineComponent({
  name: "WorkoutView",
  props: ["currentWorkout"],

  data() {
    return {
      checkbox: false,
      snackbar: false,
      text: "",
      timeout: 2000,
      isTimer: false,
      stopwatch: null,
      time: null,
      timer: null,
      seconds: 600,
    };
  },

  created() {
    this.snackbar = this.currentWorkout.name === undefined;
    this.text = "No workout selected";
    this.stopwatch = useStopwatch();
    this.stopwatch.reset();
    this.stopwatch.pause();
    this.restartTimer();
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

    restartTimer() {
      this.time = new Date();
      this.time.setSeconds(this.time.getSeconds() + this.seconds);
      this.timer = useTimer(this.time);
      this.timer.pause();
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
</style>
