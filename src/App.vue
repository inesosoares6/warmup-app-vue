<template>
  <v-app>
    <BottomToolbar></BottomToolbar>
    <TopToolbar
      :allWorkouts="allWorkouts"
      :groupByType="groupByType"
      :types="getTypes()"
      :personalRecords="personalRecords"
      :theme="themeString"
      :measurements="measurements"
      v-on:add-workout="addWorkout"
      v-on:delete-cache="deleteCache"
      v-on:delete-workouts="deleteWorkouts"
      v-on:group-by-types="groupByTypeFunction"
      v-on:delete-personal-records="deletePRs"
      v-on:toggle-theme="toggleTheme"
      v-on:delete-measurements="deleteMeasurements"
    ></TopToolbar>
    <v-main>
      <router-view v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.path"
          :allWorkouts="allWorkouts"
          :workoutSummary="workoutSummary"
          :currentWorkout="currentWorkout"
          :timeline="timeline"
          :types="getTypes()"
          :groupByType="groupByType"
          :personalRecords="personalRecords"
          :averagePR="averagePR"
          :measurements="measurements"
          v-on:update-workout="updateWorkout"
          v-on:edit-workout="editWorkout"
          v-on:select-workout="selectWorkout"
          v-on:import-workouts="importWorkouts"
          v-on:add-details="addDetails"
          v-on:add-personal-record="addPR"
          v-on:edit-personal-record="updatePR"
          v-on:add-measurement="addMeasurement"
          v-on:edit-measurement="updateMeasurement"
        />
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import TopToolbar from "./components/TopToolbar.vue";
import BottomToolbar from "./components/BottomToolbar.vue";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "vuetify";

export default {
  name: "App",

  components: {
    TopToolbar,
    BottomToolbar,
  },

  data() {
    return {
      allWorkouts: [],
      types: [],
      currentWorkout: {},
      workoutSummary: this.clearWorkoutSummary(),
      timeline: this.clearTimeline(),
      weekNumber: 0,
      groupByType: false,
      personalRecords: [],
      averagePR: [],
      theme: useTheme(),
      themeString: "",
      measurements: [],
    };
  },

  created() {
    if (localStorage.getItem("allWorkouts"))
      this.allWorkouts = JSON.parse(localStorage.getItem("allWorkouts"));
    if (localStorage.getItem("workoutSummary"))
      this.workoutSummary = JSON.parse(localStorage.getItem("workoutSummary"));
    if (localStorage.getItem("currentWorkout"))
      this.currentWorkout = JSON.parse(localStorage.getItem("currentWorkout"));
    if (localStorage.getItem("timeline"))
      this.timeline = JSON.parse(localStorage.getItem("timeline"));
    if (localStorage.getItem("weekNumber"))
      this.weekNumber = localStorage.getItem("weekNumber");
    if (localStorage.getItem("groupByType"))
      this.groupByType =
        localStorage.getItem("groupByType") === "true" ? true : false;
    if (localStorage.getItem("personalRecords"))
      this.personalRecords = JSON.parse(
        localStorage.getItem("personalRecords")
      );
    if (localStorage.getItem("themeString")) {
      this.themeString = localStorage.getItem("themeString");
      this.theme.global.name = this.themeString;
    }
    if (localStorage.getItem("measurements"))
      this.measurements = JSON.parse(localStorage.getItem("measurements"));

    this.averagePR = this.getAveragePR();
    this.updateWeek();
  },

  methods: {
    addDetails(workout) {
      var objIndex = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.allWorkouts[objIndex].details = workout.details;
    },

    addPR(personalRecord) {
      this.personalRecords.push(personalRecord);
      this.averagePR = this.getAveragePR();
    },

    addMeasurement(measurement) {
      this.measurements.push(measurement);
    },

    addWorkout(newWorkout) {
      this.allWorkouts.push(newWorkout);
      this.updateSummary(newWorkout, newWorkout.completions, 1);
    },

    clearTimeline() {
      return [
        {
          day: "Mon",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Tue",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Wed",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Thu",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Fri",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Sat",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Sun",
          color: "error",
          workoutsId: [],
        },
      ];
    },

    clearWorkoutSummary() {
      return {
        done: 0,
        todo: 0,
        types: [],
      };
    },

    deleteCache() {
      this.allWorkouts = [];
      this.currentWorkout = {};
      this.workoutSummary = this.clearWorkoutSummary();
      this.timeline = this.clearTimeline();
      this.personalRecords = [];
      this.measurements = [];
    },

    deleteMeasurements(measurementsList) {
      if (measurementsList.length === this.measurements.length) {
        this.measurements = [];
      } else {
        for (const record of measurementsList) {
          var index = this.measurements.findIndex(
            (obj) => obj.id === record.id
          );
          this.measurements.splice(index, 1);
        }
      }
    },

    deletePRs(personalRecordsList) {
      if (personalRecordsList.length === this.personalRecords.length) {
        this.personalRecords = [];
        this.averagePR = [];
      } else {
        for (const record of personalRecordsList) {
          var index = this.personalRecords.findIndex(
            (obj) => obj.id === record.id
          );
          this.personalRecords.splice(index, 1);
        }
        this.averagePR = this.getAveragePR();
      }
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

    getAveragePR() {
      //Get max length array
      let max = 0;
      this.personalRecords.forEach((record) => {
        max = record.value.length > max ? record.value.length : max;
      });
      //Calculate average
      let average = [];
      for (var k = 0; k < max; k++) {
        let sum = 0;
        this.personalRecords.forEach((record) => {
          if (record.value[k] !== undefined) {
            sum = sum + record.value[k];
          } else {
            sum = sum + record.value[record.value.length - 1];
          }
        });
        average[k] = Math.round(sum / this.personalRecords.length);
      }
      return average;
    },

    getTypes() {
      let types = [];
      this.allWorkouts.forEach((element) => {
        if (!types.some((e) => e === element.type)) {
          types.push(element.type);
        }
      });
      types.push("--> Add new type");
      return types;
    },

    groupByTypeFunction(value) {
      this.groupByType = value;
    },

    selectWorkout(workout) {
      this.currentWorkout = workout;
    },

    toggleTheme() {
      this.theme.global.name = this.theme.global.current.dark
        ? "light"
        : "dark";
      this.themeString = this.theme.global.name;
    },

    updateTimeline(day, workoutId) {
      this.timeline.forEach((item) => {
        if (item.day === day) {
          item.color = "secondary";
          item.workoutsId.push(workoutId);
        }
      });
    },

    updateMeasurement(measurement) {
      var objIndex = this.measurements.findIndex(
        (obj) => obj.id === measurement.id
      );
      this.measurements[objIndex] = measurement;
    },

    updatePR(personalRecord) {
      var objIndex = this.personalRecords.findIndex(
        (obj) => obj.id === personalRecord.id
      );
      this.personalRecords[objIndex] = personalRecord;
      this.averagePR = this.getAveragePR();
    },

    updateWeek() {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), 0, 1);
      const days = Math.floor(
        (currentDate - startDate) / (24 * 60 * 60 * 1000)
      );
      const nextWeekNumber = Math.ceil(days / 7);
      if (
        this.weekNumber != nextWeekNumber &&
        currentDate.toString().split(" ")[0] !== "Sun"
      ) {
        this.timeline = this.clearTimeline();
        this.weekNumber = nextWeekNumber;
      }
    },

    updateWorkout(workout) {
      this.allWorkouts.forEach((item, index) => {
        if (item.id === workout.id) {
          if (this.allWorkouts[index].completions === 0) {
            this.workoutSummary.todo = this.workoutSummary.todo - 1;
          }
          this.allWorkouts[index].completions =
            this.allWorkouts[index].completions + 1;
          this.updateSummary(workout, 1, 1);
          this.updateTimeline(new Date().toDateString().substring(0, 3), workout.id);
        }
      });
    },

    updateSummary(workout, numTimes, addRemove) {
      if (workout.completions > 0) {
        this.workoutSummary.done =
          this.workoutSummary.done + numTimes * addRemove;
        if (this.workoutSummary.types.some((e) => e.type === workout.type)) {
          let index = this.workoutSummary.types.findIndex((object) => {
            return object.type === workout.type;
          });
          this.workoutSummary.types[index].value =
            this.workoutSummary.types[index].value + numTimes * addRemove;
          if (this.workoutSummary.types[index].value === 0) {
            this.workoutSummary.types.splice(index, 1);
          }
        } else {
          this.workoutSummary.types = [
            ...this.workoutSummary.types,
            { type: workout.type, value: numTimes },
          ];
        }
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

    groupByType: {
      handler() {
        localStorage.setItem("groupByType", this.groupByType);
      },
    },

    personalRecords: {
      handler() {
        localStorage.setItem(
          "personalRecords",
          JSON.stringify(this.personalRecords)
        );
      },
      deep: true,
    },

    measurements: {
      handler() {
        localStorage.setItem("measurements", JSON.stringify(this.measurements));
      },
      deep: true,
    },

    themeString: {
      handler() {
        localStorage.setItem("themeString", this.themeString);
      },
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
