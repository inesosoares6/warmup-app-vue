import { defineStore } from 'pinia'

export const useStoreWorkouts = defineStore('storeWorkouts', {
    state: () => {
      return {
        allWorkouts: {},
      };
    },
    getters: {},
    actions: {
      init() {
        this.allWorkouts = JSON.parse(localStorage.getItem("allWorkouts"));
      },
    },
})