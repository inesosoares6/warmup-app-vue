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
      localStorage.setItem(
        "personalRecords",
        JSON.stringify(this.personalRecords)
      );
    },

    addMeasurement(payload) {
      this.measurements[payload.id] = payload.measurement;
      localStorage.setItem("measurements", JSON.stringify(this.measurements));
    },

    deleteMeasurement(id, lastEntry) {
      if (lastEntry) {
        this.measurements[id].value.pop();
      } else {
        delete this.measurements[id];
      }
      localStorage.setItem("measurements", JSON.stringify(this.measurements));
    },

    deletePR(id, lastEntry) {
      if (lastEntry) {
        this.personalRecords[id].value.pop();
      } else {
        delete this.personalRecords[id];
      }
      localStorage.setItem(
        "personalRecords",
        JSON.stringify(this.personalRecords)
      );
    },

    updateValue(variableName, payload) {
      if (variableName === "measurement") this.updateMeasurement(payload);
      else this.updatePR(payload);
    },

    updateMeasurement(payload) {
      Object.assign(this.measurements[payload.id], payload.updates);
      localStorage.setItem("measurements", JSON.stringify(this.measurements));
    },

    updatePR(payload) {
      Object.assign(this.personalRecords[payload.id], payload.updates);
      localStorage.setItem(
        "personalRecords",
        JSON.stringify(this.personalRecords)
      );
    },
  },
});
