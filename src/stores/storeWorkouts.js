import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useStoreWorkouts = defineStore("storeWorkouts", {
  state: () => {
    return {
      allWorkouts: {},
      currentWorkoutId: "",
    };
  },
  getters: {
    getCurrentWorkout: (state) => {
      return state.allWorkouts[state.currentWorkoutId];
    },

    getTypes: (state) => {
      let types = [];
      Object.keys(state.allWorkouts).forEach((key) => {
        let workout = state.allWorkouts[key];
        if (!types.some((e) => e === workout.type)) {
          types.push(workout.type);
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
      Object.keys(state.allWorkouts).forEach((key) => {
        let workout = state.allWorkouts[key];
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

    addWorkout(payload) {
      this.allWorkouts[payload.id] = payload.workout;
    },

    deleteWorkout(id) {
      delete this.allWorkouts[id];
    },

    updateWorkout(payload) {
      Object.assign(this.allWorkouts[payload.id], payload.updates);
    },

    importWorkouts(workouts) {
      for (const workout of workouts) {
        this.addWorkout({ id: uuidv4(), workout: workout });
      }
    },

    selectWorkout(id) {
      this.currentWorkoutId = id;
      localStorage.setItem(
        "currentWorkoutId",
        JSON.stringify(this.currentWorkoutId)
      );
    },
  },
});
