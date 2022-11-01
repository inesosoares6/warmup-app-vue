<template>
  <v-app>
    <BottomToolbar></BottomToolbar>
    <TopToolbar
      :allWorkouts="allWorkouts"
      v-on:add-workout="addWorkout"
      v-on:delete-cache="deleteCache"
      v-on:delete-workouts="deleteWorkouts"
    ></TopToolbar>
    <v-main>
      <router-view v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.path"
          :allWorkouts="allWorkouts"
          :workoutSummary="workoutSummary"
          :currentWorkout="currentWorkout"
          :lastWorkout="lastWorkout"
          :timeline="timeline"
          v-on:update-workout="updateWorkout"
          v-on:edit-workout="editWorkout"
          v-on:select-workout="selectWorkout"
          v-on:import-workouts="importWorkouts"
        />
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import TopToolbar from "./components/TopToolbar.vue";
import BottomToolbar from "./components/BottomToolbar.vue";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "App",

  components: {
    TopToolbar,
    BottomToolbar,
  },

  data() {
    return {
      allWorkouts: [],
      currentWorkout: {},
      lastWorkout: {},
      workoutSummary: this.clearWorkoutSummary(),
      timeline: this.clearTimeline(),
      weekNumber: 0,
    };
  },

  mounted() {
    if (localStorage.getItem("allWorkouts"))
      this.allWorkouts = JSON.parse(localStorage.getItem("allWorkouts"));
    if (localStorage.getItem("workoutSummary"))
      this.workoutSummary = JSON.parse(localStorage.getItem("workoutSummary"));
    if (localStorage.getItem("currentWorkout"))
      this.currentWorkout = JSON.parse(localStorage.getItem("currentWorkout"));
    if (localStorage.getItem("lastWorkout"))
      this.lastWorkout = JSON.parse(localStorage.getItem("lastWorkout"));
    if (localStorage.getItem("timeline"))
      this.timeline = JSON.parse(localStorage.getItem("timeline"));
    if (localStorage.getItem("weekNumber"))
      this.weekNumber = localStorage.getItem("weekNumber");

    this.updateWeek();
  },

  methods: {
    addWorkout(newWorkout) {
      this.allWorkouts.push(newWorkout);
      this.updateSummary(newWorkout, newWorkout.completions, 1);
    },

    clearTimeline() {
      return [
        {
          day: "Mon",
          color: "error",
        },
        {
          day: "Tue",
          color: "error",
        },
        {
          day: "Wed",
          color: "error",
        },
        {
          day: "Thu",
          color: "error",
        },
        {
          day: "Fri",
          color: "error",
        },
        {
          day: "Sat",
          color: "error",
        },
        {
          day: "Sun",
          color: "error",
        },
      ];
    },

    clearWorkoutSummary() {
      return {
        done: 0,
        todo: 0,
        types: [
          {
            type: "WOD",
            value: 0,
          },
          {
            type: "AFAP",
            value: 0,
          },
          {
            type: "AMRAP",
            value: 0,
          },
          {
            type: "EMOM",
            value: 0,
          },
        ],
      };
    },

    deleteCache() {
      this.allWorkouts = [];
      this.currentWorkout = {};
      this.lastWorkout = {};
      this.workoutSummary = this.clearWorkoutSummary();
      this.timeline = this.this.clearTimeline();
    },

    deleteWorkouts(workoutList) {
      if (workoutList.length === this.allWorkouts.length) {
        this.allWorkouts = [];
        this.workoutSummary = this.clearWorkoutSummary();
      } else {
        for (const workout of workoutList) {
          var index = this.allWorkouts.findIndex(
            (obj) => obj.id === workout.id
          );
          this.updateSummary(
            this.allWorkouts[index],
            this.allWorkouts[index].completions,
            -1
          );
          this.allWorkouts.splice(index, 1);
        }
      }
    },

    editWorkout(workout) {
      var objIndex = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.updateSummary(
        this.allWorkouts[objIndex],
        this.allWorkouts[objIndex].completions,
        -1
      );
      this.allWorkouts[objIndex] = { ...workout };
      this.updateSummary(workout, workout.completions, 1);
    },

    importWorkouts(workouts) {
      for (const workout of workouts) {
        workout.id = uuidv4();
        this.addWorkout(workout);
      }
    },

    selectWorkout(workout) {
      this.currentWorkout = workout;
    },

    updateTimeline(day) {
      this.timeline.forEach((item) => {
        if (item.day === day) {
          item.color = "secondary";
        }
      });
    },

    updateWeek() {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), 0, 1);
      const days = Math.floor(
        (currentDate - startDate) / (24 * 60 * 60 * 1000)
      );
      const nextWeekNumber = Math.ceil(days / 7);
      if(this.weekNumber !== nextWeekNumber) {
        this.clearTimeline();
        this.weekNumber = nextWeekNumber;
      }
    },

    updateWorkout(workout) {
      this.lastWorkout = { ...workout };
      this.allWorkouts.forEach((item, index) => {
        if (item.id === workout.id) {
          if (this.allWorkouts[index].completions === 0) {
            this.workoutSummary.todo = this.workoutSummary.todo - 1;
          }
          this.allWorkouts[index].completions =
            this.allWorkouts[index].completions + 1;
          this.updateSummary(workout, 1, 1);
          this.updateTimeline(new Date().toDateString().substring(0, 3));
        }
      });
    },

    updateSummary(workout, numTimes, addRemove) {
      if (workout.completions > 0) {
        this.workoutSummary.done =
          this.workoutSummary.done + numTimes * addRemove;
        this.workoutSummary.types.forEach((item, index) => {
          if (workout.type === item.type) {
            this.workoutSummary.types[index].value =
              this.workoutSummary.types[index].value + numTimes * addRemove;
          }
        });
      } else {
        this.workoutSummary.todo = this.workoutSummary.todo + addRemove;
      }
    },
  },

  watch: {
    allWorkouts: {
      handler() {
        localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      },
      deep: true,
    },

    currentWorkout: {
      handler() {
        localStorage.setItem(
          "currentWorkout",
          JSON.stringify(this.currentWorkout)
        );
      },
      deep: true,
    },

    lastWorkout: {
      handler() {
        localStorage.setItem("lastWorkout", JSON.stringify(this.lastWorkout));
      },
      deep: true,
    },

    timeline: {
      handler() {
        localStorage.setItem("timeline", JSON.stringify(this.timeline));
      },
      deep: true,
    },

    weekNumber: {
      handler() {
        localStorage.setItem("weekNumber", this.weekNumber);
      },
    },

    workoutSummary: {
      handler() {
        localStorage.setItem(
          "workoutSummary",
          JSON.stringify(this.workoutSummary)
        );
      },
      deep: true,
    },
  },
};
</script>
