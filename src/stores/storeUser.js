import { defineStore } from "pinia";

export const useStoreUser = defineStore("storeUser", {
  state: () => {
    return {
      personalRecords: [],
      measurements: [],
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

    addPR(personalRecord) {
      this.personalRecords.push(personalRecord);
      localStorage.setItem(
        "personalRecords",
        JSON.stringify(this.personalRecords)
      );
    },

    addMeasurement(measurement) {
      this.measurements.push(measurement);
      localStorage.setItem("measurements", JSON.stringify(this.measurements));
    },

    deleteMeasurement(measurement, lastEntry) {
      var index = this.measurements.findIndex(
        (obj) => obj.id === measurement.id
      );
      if(lastEntry) {
        this.measurements[index].value.pop();
      } else {
        this.measurements.splice(index, 1);
      }
      localStorage.setItem("measurements", JSON.stringify(this.measurements));
    },

    deletePR(record, lastEntry) {
      var index = this.personalRecords.findIndex((obj) => obj.id === record.id);
      if(lastEntry) {
        this.personalRecords[index].value.pop();
      } else {
        this.personalRecords.splice(index, 1);
      }
      localStorage.setItem(
        "personalRecords",
        JSON.stringify(this.personalRecords)
      );
    },

    updateMeasurement(measurement) {
      var objIndex = this.measurements.findIndex(
        (obj) => obj.id === measurement.id
      );
      this.measurements[objIndex] = measurement;

      localStorage.setItem("measurements", JSON.stringify(this.measurements));
    },

    updatePR(personalRecord) {
      var objIndex = this.personalRecords.findIndex(
        (obj) => obj.id === personalRecord.id
      );
      this.personalRecords[objIndex] = personalRecord;
      localStorage.setItem(
        "personalRecords",
        JSON.stringify(this.personalRecords)
      );
    },
  },
});
