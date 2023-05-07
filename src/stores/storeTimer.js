import { defineStore } from "pinia";

const tabataDefault = {
  prepareTime: {
    value: 5,
    label: "Get ready",
    suffix: "s",
  },
  restBetweenSets: {
    value: 5,
    label: "Rest between sets",
    suffix: "s",
  },
  workTime: {
    value: 5,
    label: "Work",
    suffix: "s",
  },
  restTime: {
    value: 5,
    label: "Rest",
    suffix: "s",
  },
  cycles: {
    value: 5,
    label: "Cycles",
    suffix: "",
  },
  sets: {
    value: 5,
    label: "Sets",
    suffix: "",
  },
};

export const useStoreTimer = defineStore("storeTimer", {
  state: () => {
    return {
      tabata: tabataDefault,
      timer: 5,
    };
  },
  getters: {
    getTimer: (state) => {
      return state.timer;
    },
  },
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

    deleteAllCache() {
      this.updateTabata(tabataDefault);
      this.updateTimer(5);
    },
  },
});
