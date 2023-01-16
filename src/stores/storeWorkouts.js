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
      themeString: "",
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
      if (localStorage.getItem("themeString")) {
        this.themeString = localStorage.getItem("themeString");
      }

      this.types = this.getTypes();
      this.updateWeek();
    },

    addDetails(workout) {
      var objIndex = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.allWorkouts[objIndex].details = workout.details;
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
    },

    addWorkout(newWorkout) {
      this.allWorkouts.push(newWorkout);
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      this.updateSummary(newWorkout, newWorkout.completions, 1);
      localStorage.setItem(
        "workoutSummary",
        JSON.stringify(this.workoutSummary)
      );
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
      localStorage.setItem(
        "currentWorkout",
        JSON.stringify(this.currentWorkout)
      );
      this.workoutSummary = this.clearWorkoutSummary();
      localStorage.setItem(
        "workoutSummary",
        JSON.stringify(this.workoutSummary)
      );
      this.timeline = this.clearTimeline();
      localStorage.setItem("timeline", JSON.stringify(this.timeline));
    },

    deleteWorkout(workout) {
      var index = this.allWorkouts.findIndex(
        (obj) => obj.id === workout.id
      );
      this.updateSummary(
        this.allWorkouts[index],
        this.allWorkouts[index].completions,
        -1
      );
      this.allWorkouts.splice(index, 1);
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      localStorage.setItem(
        "workoutSummary",
        JSON.stringify(this.workoutSummary)
      );
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
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
      localStorage.setItem(
        "workoutSummary",
        JSON.stringify(this.workoutSummary)
      );
    },

    importWorkouts(workouts) {
      for (const workout of workouts) {
        workout.id = uuidv4();
        this.addWorkout(workout);
      }
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
      localStorage.setItem(
        "currentWorkout",
        JSON.stringify(this.currentWorkout)
      );
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
      localStorage.setItem(
        "workoutSummary",
        JSON.stringify(this.workoutSummary)
      );
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
