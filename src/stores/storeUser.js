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
      this.writeInDB(true);
    },

    addMeasurement(payload) {
      this.measurements[payload.id] = payload.measurement;
      this.writeInDB(false);
    },

    deleteMeasurement(id, lastEntry) {
      if (lastEntry) {
        this.measurements[id].value.pop();
      } else {
        delete this.measurements[id];
      }
      this.writeInDB(false);
    },

    deletePR(id, lastEntry) {
      if (lastEntry) {
        this.personalRecords[id].value.pop();
      } else {
        delete this.personalRecords[id];
      }
      this.writeInDB(true);
    },

    updateValue(variableName, payload) {
      if (variableName === "measurement") this.updateMeasurement(payload);
      else this.updatePR(payload);
    },

    updateMeasurement(payload) {
      Object.assign(this.measurements[payload.id], payload.updates);
      this.writeInDB(false);
    },

    updatePR(payload) {
      Object.assign(this.personalRecords[payload.id], payload.updates);
      this.writeInDB(true);
    },

    deleteAllCache() {
      this.personalRecords = {};
      this.measurements = {};
      this.writeInDB(true);
      this.writeInDB(false);
    },

    writeInDB(record) {
      if (record)
        localStorage.setItem(
          "personalRecords",
          JSON.stringify(this.personalRecords)
        );
      else
        localStorage.setItem("measurements", JSON.stringify(this.measurements));
    },
  },
});
