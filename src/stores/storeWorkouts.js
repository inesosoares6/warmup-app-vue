import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useStoreWorkouts = defineStore("storeWorkouts", {
  state: () => {
    return {
      allWorkouts: {},
      types: [],
      currentWorkout: {},
      workoutSummary: [],
      timeline: [],
      weekNumber: 0,
      groupByType: false,
      personalRecords: [],
      averagePR: [],
      themeString: "",
      measurements: [],
    };
  },
  getters: {},
  actions: {
    init() {
      if (localStorage.getItem("allWorkouts"))
        this.allWorkouts = JSON.parse(localStorage.getItem("allWorkouts"));
      if (localStorage.getItem("workoutSummary"))
        this.workoutSummary = JSON.parse(
          localStorage.getItem("workoutSummary")
        );
      else this.workoutSummary = this.clearWorkoutSummary();
      if (localStorage.getItem("currentWorkout"))
        this.currentWorkout = JSON.parse(
          localStorage.getItem("currentWorkout")
        );
      if (localStorage.getItem("timeline"))
        this.timeline = JSON.parse(localStorage.getItem("timeline"));
      else this.timeline = this.clearTimeline();
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
      }
      if (localStorage.getItem("measurements"))
        this.measurements = JSON.parse(localStorage.getItem("measurements"));

      this.types = this.getTypes();
      this.averagePR = this.getAveragePR();
      this.updateWeek();
    },

    addDetails(workout) {
      var objIndex = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.allWorkouts[objIndex].details = workout.details;
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
    },

    addPR(personalRecord) {
      this.personalRecords.push(personalRecord);
      localStorage.setItem("personalRecords", JSON.stringify(this.personalRecords));
      this.averagePR = this.getAveragePR();
    },

    addMeasurement(measurement) {
      this.measurements.push(measurement);
      localStorage.setItem("measurements", JSON.stringify(this.measurements));
    },

    addWorkout(newWorkout) {
      this.allWorkouts.push(newWorkout);
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      this.updateSummary(newWorkout, newWorkout.completions, 1);
      localStorage.setItem("workoutSummary", JSON.stringify(this.workoutSummary));
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
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      this.currentWorkout = {};
      localStorage.setItem("currentWorkout", JSON.stringify(this.currentWorkout));
      this.workoutSummary = this.clearWorkoutSummary();
      localStorage.setItem("workoutSummary", JSON.stringify(this.workoutSummary));
      this.timeline = this.clearTimeline();
      localStorage.setItem("timeline", JSON.stringify(this.timeline));
      this.personalRecords = [];
      localStorage.setItem("personalRecords", JSON.stringify(this.personalRecords));
      this.measurements = [];
      localStorage.setItem("measurements", JSON.stringify(this.measurements));
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
      localStorage.setItem("measurements", JSON.stringify(this.measurements));
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
      localStorage.setItem("personalRecords", JSON.stringify(this.personalRecords));
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
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      localStorage.setItem("workoutSummary", JSON.stringify(this.workoutSummary));
    },

    editWorkout(workout) {
      var objIndex = this.allWorkouts.findIndex(
        (obj) => obj.id === workout.id
      );
      this.updateSummary(
        this.allWorkouts[objIndex],
        this.allWorkouts[objIndex].completions,
        -1
      );
      this.allWorkouts[objIndex] = { ...workout };
      this.updateSummary(workout, workout.completions, 1);
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      localStorage.setItem("workoutSummary", JSON.stringify(this.workoutSummary));
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
      localStorage.setItem("groupByType", JSON.stringify(this.groupByType));
    },

    selectWorkout(workout) {
      this.currentWorkout = workout;
      localStorage.setItem("currentWorkout", JSON.stringify(this.currentWorkout));
    },

    toggleTheme(theme) {
      this.themeString = theme;
      localStorage.setItem("themeString", JSON.stringify(this.themeString));
    },

    updateTimeline(day, workoutId) {
      this.timeline.forEach((item) => {
        if (item.day === day) {
          item.color = "secondary";
          item.workoutsId.push(workoutId);
        }
      });
      localStorage.setItem("timeline", JSON.stringify(this.timeline));
    },

    updateMeasurement(measurement) {
      var objIndex = this.measurements.findIndex(
        (obj) => obj.id === measurement.id
      );
      this.measurements[objIndex] = measurement;
      
      localStorage.setItem("measurements", JSON.stringify(this.measurements));
    },

    updatePR(personalRecord) {
      var objIndex = this.personalRecords.findIndex(
        (obj) => obj.id === personalRecord.id
      );
      this.personalRecords[objIndex] = personalRecord;
      localStorage.setItem("personalRecords", JSON.stringify(this.personalRecords));
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
        localStorage.setItem("timeline", JSON.stringify(this.timeline));
        localStorage.setItem("weekNumber", JSON.stringify(this.weekNumber));
      }
    },

    updateWorkout() {
      this.allWorkouts.forEach((item, index) => {
        if (item.id === this.currentWorkout.id) {
          if (this.allWorkouts[index].completions === 0) {
            this.workoutSummary.todo = this.workoutSummary.todo - 1;
          }
          this.allWorkouts[index].completions =
            this.allWorkouts[index].completions + 1;
          this.updateSummary(this.currentWorkout, 1, 1);
          this.updateTimeline(
            new Date().toDateString().substring(0, 3),
            this.currentWorkout.id
          );
        }
      });
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      localStorage.setItem("workoutSummary", JSON.stringify(this.workoutSummary));
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
});
