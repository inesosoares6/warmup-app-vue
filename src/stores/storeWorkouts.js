import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useStoreApp } from "@/stores/storeApp";
import Localbase from "localbase";

let db = new Localbase("db");

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
      await this.getAllWorkouts();

      if (localStorage.getItem("currentWorkoutId"))
        this.currentWorkoutId = JSON.parse(
          localStorage.getItem("currentWorkoutId")
        );
    },

    addDetails(workout) {
      db.collection("workouts").doc({ id: workout.id }).update({
        details: workout.details,
      });
    },

    addWorkout(newWorkout) {
      db.collection("workouts").add(newWorkout);
      // TODO: delete this when implement snapshot
      this.allWorkouts.push(newWorkout);
    },

    async addWorkoutCompletion() {
      db.collection("workouts")
        .doc({ id: this.currentWorkoutId })
        .update({
          completions: this.getCurrentWorkout.completions + 1,
        });
      // TODO: delete this when implement snapshot
      let workout = this.getCurrentWorkout();
      workout.completions += 1;
      this.updateWorkout(workout);

      const storeApp = useStoreApp();
      storeApp.updateTimeline(
        new Date().toDateString().substring(0, 3),
        this.currentWorkoutId
      );
    },

    deleteWorkout(workout) {
      db.collection("workouts").doc({ id: workout.id }).delete();
      // TODO: fix app breaking after splice array
      // TODO: delete this when implement snapshot
      // var index = this.allWorkouts.findIndex(
      //   (obj) => obj.id === workout.id
      // );
      // this.allWorkouts.splice(index, 1);
    },

    editWorkout(workout) {
      db.collection("workouts").doc({ id: workout.id }).update(workout);
      // TODO: delete this when implement snapshot
      this.updateWorkout(workout);
    },

    getAllWorkouts() {
      this.allWorkouts = [];
      db.collection("workouts")
        .get()
        .then((tasks) => {
          this.allWorkouts = tasks;
        });
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

    // TODO: delete this when implement snapshot
    updateWorkout(workout) {
      var index = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.allWorkouts[index] = workout;
    },
  },
});
