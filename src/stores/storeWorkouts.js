import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useStoreWorkouts = defineStore("storeWorkouts", {
  state: () => {
    return {
      allWorkouts: [],
      currentWorkoutId: "",
    };
  },
  getters: {
    getCurrentWorkout: (state) => {
      return state.allWorkouts.find((obj) => {
        return obj.id === state.currentWorkoutId;
      });
    },

    getTypes: (state) => {
      let types = [];
      state.allWorkouts.forEach((element) => {
        if (!types.some((e) => e === element.type)) {
          types.push(element.type);
        }
      });
      types.push("--> Add new type");
      return types;
    },

    getWorkoutSummary: (state) => {
      let summary = {
        done: 0,
        todo: 0,
        types: [],
      };
      state.allWorkouts.forEach((workout) => {
        if (workout.completions === 0) {
          summary.todo++;
        } else {
          summary.done += workout.completions;

          if (summary.types.some((e) => e.type === workout.type)) {
            let index = summary.types.findIndex((object) => {
              return object.type === workout.type;
            });
            summary.types[index].value += workout.completions;
            if (summary.types[index].value === 0) {
              summary.types.splice(index, 1);
            }
          } else {
            summary.types = [
              ...summary.types,
              { type: workout.type, value: workout.completions },
            ];
          }
        }
      });
      return summary;
    },
  },
  actions: {
    async init() {

      if (localStorage.getItem("allWorkouts"))
        this.allWorkouts = JSON.parse(localStorage.getItem("allWorkouts"));

      if (localStorage.getItem("currentWorkoutId"))
        this.currentWorkoutId = JSON.parse(
          localStorage.getItem("currentWorkoutId")
        );
    },

    addDetails(workout) {
      var objIndex = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.allWorkouts[objIndex].details = workout.details;
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
    },

    addWorkout(newWorkout) {
      this.allWorkouts.push(newWorkout);
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
    },

    deleteWorkout(workout) {
      var index = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.allWorkouts.splice(index, 1);
      localStorage.setItem("allWorkouts", JSON.stringify(this.allWorkouts));
    },

    editWorkout(workout) {
      var objIndex = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.allWorkouts[objIndex] = { ...workout };
    },

    importWorkouts(workouts) {
      for (const workout of workouts) {
        workout.id = uuidv4();
        this.addWorkout(workout);
      }
    },

    selectWorkout(workout) {
      this.currentWorkoutId = workout.id;
      localStorage.setItem(
        "currentWorkoutId",
        JSON.stringify(this.currentWorkoutId)
      );
    },
  },
});
