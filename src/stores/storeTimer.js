import { defineStore } from "pinia";

const tabataDefault = {
  prepareTime: 5,
  workTime: 5,
  restTime: 5,
  cycles: 1,
  sets: 2,
  restBetweenSets: 3,
};

export const useStoreTimer = defineStore("storeTimer", {
  state: () => {
    return {
      tabata: tabataDefault,
      timer: 5,
    };
  },
  getters: {},
  actions: {
    init() {
      if (localStorage.getItem("timer"))
        this.timer = JSON.parse(localStorage.getItem("timer"));
      if (localStorage.getItem("tabata"))
        this.tabata = JSON.parse(localStorage.getItem("tabata"));
    },

    updateTabata(newTabata) {
      this.tabata = newTabata;
      localStorage.setItem("tabata", JSON.stringify(this.tabata));
    },

    updateTimer(newTimer) {
      this.timer = newTimer;
      localStorage.setItem("timer", JSON.stringify(this.timer));
    },
  },
});
