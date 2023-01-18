import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useStoreApp } from "@/stores/storeApp";
import Localbase from 'localbase'

let db = new Localbase('db')

export const useStoreWorkouts = defineStore("storeWorkouts", {
  state: () => {
    return {
      allWorkouts: [],
      types: [],
      currentWorkout: {},
      workoutSummary: [],
    };
  },
  getters: {},
  actions: {
    init() {
      db.collection('workouts').get().then(tasks => {
        this.allWorkouts = tasks;
      });

      if (localStorage.getItem("workoutSummary"))
        this.workoutSummary = JSON.parse(
          localStorage.getItem("workoutSummary")
        );
      else this.workoutSummary = this.clearWorkoutSummary();
      if (localStorage.getItem("currentWorkout"))
        this.currentWorkout = JSON.parse(
          localStorage.getItem("currentWorkout")
        );

      this.types = this.getTypes();
    },

    addDetails(workout) {
      db.collection('workouts').doc({ id: workout.id }).update({
        details: workout.details
      });
    },

    addWorkout(newWorkout) {
      db.collection('workouts').add(newWorkout);

      this.updateSummary(newWorkout, newWorkout.completions, 1);
      localStorage.setItem(
        "workoutSummary",
        JSON.stringify(this.workoutSummary)
      );
    },

    clearWorkoutSummary() {
      return {
        done: 0,
        todo: 0,
        types: [],
      };
    },

    deleteWorkout(workout) {
      db.collection('workouts').doc({ id: workout.id }).delete();

      var index = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.updateSummary(
        this.allWorkouts[index],
        this.allWorkouts[index].completions,
        -1
      );
      localStorage.setItem(
        "workoutSummary",
        JSON.stringify(this.workoutSummary)
      );
    },

    editWorkout(workout) {
      db.collection('workouts').doc({ id: workout.id }).set(workout);

      var objIndex = this.allWorkouts.findIndex((obj) => obj.id === workout.id);
      this.updateSummary(
        this.allWorkouts[objIndex],
        this.allWorkouts[objIndex].completions,
        -1
      );
      this.updateSummary(workout, workout.completions, 1);
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

    selectWorkout(workout) {
      this.currentWorkout = workout;
      localStorage.setItem(
        "currentWorkout",
        JSON.stringify(this.currentWorkout)
      );
    },

    updateWorkout() {
      this.allWorkouts.forEach((item, index) => {
        if (item.id === this.currentWorkout.id) {
          if (this.allWorkouts[index].completions === 0) {
            this.workoutSummary.todo = this.workoutSummary.todo - 1;
          }
        
          db.collection('workouts').doc({ id: item.id }).update({
            completions: +item.completions+1
          });

          this.updateSummary(this.currentWorkout, 1, 1);
          const storeApp = useStoreApp();
          storeApp.updateTimeline(
            new Date().toDateString().substring(0, 3),
            this.currentWorkout.id
          );
        }
      });
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
