import { defineStore } from "pinia";

export const useStoreUser = defineStore("storeUser", {
  state: () => {
    return {
      personalRecords: {},
      measurements: {},
    };
  },
  getters: {},
  actions: {
    init() {
      if (localStorage.getItem("personalRecords"))
        this.personalRecords = JSON.parse(
          localStorage.getItem("personalRecords")
        );
      if (localStorage.getItem("measurements"))
        this.measurements = JSON.parse(localStorage.getItem("measurements"));
    },

    addPR(payload) {
      this.personalRecords[payload.id] = payload.record;
    },

    addMeasurement(payload) {
      this.measurements[payload.id] = payload.measurement;
    },

    deleteMeasurement(id, lastEntry) {
      if (lastEntry) {
        this.measurements[id].value.pop();
      } else {
        delete this.measurements[id];
      }
    },

    deletePR(id, lastEntry) {
      if (lastEntry) {
        this.personalRecords[id].value.pop();
      } else {
        delete this.personalRecords[id];
      }
    },

    updateValue(variableName, payload) {
      if (variableName === "measurement") this.updateMeasurement(payload);
      else this.updatePR(payload);
    },

    updateMeasurement(payload) {
      Object.assign(this.measurements[payload.id], payload.updates);
    },

    updatePR(payload) {
      Object.assign(this.personalRecords[payload.id], payload.updates);
    },

    deleteAllCache() {
      this.personalRecords = {};
      this.measurements = {};
    },
  },
});
