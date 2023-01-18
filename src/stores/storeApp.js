import { defineStore } from "pinia";

export const useStoreApp = defineStore("storeApp", {
  state: () => {
    return {
      timeline: [],
      weekNumber: 0,
      groupByType: false,
    };
  },
  getters: {},
  actions: {
    init() {
      if (localStorage.getItem("timeline"))
        this.timeline = JSON.parse(localStorage.getItem("timeline"));
      else this.timeline = this.clearTimeline();
      if (localStorage.getItem("weekNumber"))
        this.weekNumber = localStorage.getItem("weekNumber");
      if (localStorage.getItem("groupByType"))
        this.groupByType =
          localStorage.getItem("groupByType") === "true" ? true : false;
      this.updateWeek();
    },

    clearTimeline() {
      return [
        {
          day: "Mon",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Tue",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Wed",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Thu",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Fri",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Sat",
          color: "error",
          workoutsId: [],
        },
        {
          day: "Sun",
          color: "error",
          workoutsId: [],
        },
      ];
    },

    groupByTypeFunction(value) {
      this.groupByType = value;
      localStorage.setItem("groupByType", JSON.stringify(this.groupByType));
    },

    updateTimeline(day, workoutId) {
      this.timeline.forEach((item) => {
        if (item.day === day) {
          item.color = "secondary";
          item.workoutsId.push(workoutId);
        }
      });
      localStorage.setItem("timeline", JSON.stringify(this.timeline));
    },

    updateWeek() {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), 0, 1);
      const days = Math.floor(
        (currentDate - startDate) / (24 * 60 * 60 * 1000)
      );
      const nextWeekNumber = Math.ceil(days / 7);
      if (
        this.weekNumber != nextWeekNumber &&
        currentDate.toString().split(" ")[0] !== "Sun"
      ) {
        this.timeline = this.clearTimeline();
        this.weekNumber = nextWeekNumber;
        localStorage.setItem("timeline", JSON.stringify(this.timeline));
        localStorage.setItem("weekNumber", JSON.stringify(this.weekNumber));
      }
    },
  },
});
