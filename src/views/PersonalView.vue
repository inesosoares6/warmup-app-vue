<template>
  <v-container>
    <v-card title="Personal Records">
      <template v-slot:prepend>
        <v-icon class="dumbbell-icon" color="secondary">mdi-clipboard-text</v-icon>
      </template>
      <template v-slot:append>
        <v-btn icon color="#424242" size="35">
          <v-icon size="small">mdi-plus</v-icon>
          <AddPersonalRecord
            v-on:add-personal-record="addPR"
          ></AddPersonalRecord>
        </v-btn>
      </template>
      <v-divider></v-divider>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="(record, index) in personalRecords"
            :key="index"
            :title="
              record.name + ': ' + record.value[record.value.length - 1] + ' kg'
            "
            ><template v-slot:prepend>
              <v-avatar size="25" color="secondary">
                <v-icon size="small">mdi-check</v-icon>
              </v-avatar>
            </template>
            <EditPersonalRecord
              v-bind:personalRecord="record"
              v-on:edit-personal-record="updatePR"
            ></EditPersonalRecord>
          </v-list-item>
        </v-list>
        <v-card title="Average" color="#424242" v-if="averagePR.length > 0">
          <apexchart
            id="averageGraph"
            ref="averageGraph"
            type="line"
            :options="chartOptions"
            :series="[
              {
                name: 'Average',
                data: this.averagePR,
              },
            ]"
            width="100%"
            height="70px"
          ></apexchart>
        </v-card>
      </v-card-text>
    </v-card>
    <v-divider thickness="0px"></v-divider>
    <v-card title="Last Workout">
      <template v-slot:prepend>
        <v-icon class="dumbbell-icon" color="secondary">mdi-history</v-icon>
      </template>
      <v-card-subtitle>
        <div>{{ lastWorkout.name }}</div>
        <div>
          {{ lastWorkout.type + " - " + lastWorkout.time + " min" }}
        </div>
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text
        class="exercises"
        v-html="lastWorkout.exercises.replaceAll('\n', '<br/>')"
      >
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import AddPersonalRecord from "@/components/pop-ups/AddPersonalRecord.vue";
import EditPersonalRecord from "@/components/pop-ups/EditPersonalRecord.vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "PersonalView",
  props: ["personalRecords", "lastWorkout", "averagePR"],

  components: {
    AddPersonalRecord,
    EditPersonalRecord,
    apexchart: VueApexCharts,
  },

  data() {
    return {
      chartOptions: {
        chart: {
          id: "personal-records-average",
          group: "sparks",
          type: "line",
          sparkline: {
            enabled: true,
          },
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        colors: this.getColor(),
        tooltip: {
          theme: "dark",
        },
        stroke: {
          curve: "smooth",
        },
        grid: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          },
        },
        dataLabels: {
          enabled: false,
        },
      },
    };
  },
  methods: {
    addPR(personalRecord) {
      this.$emit("add-personal-record", personalRecord);
    },

    getColor() {
      return this.averagePR[this.averagePR.length - 1] >
        this.averagePR[this.averagePR.length - 2]
        ? ["#03dac5"]
        : ["#cf6679"];
    },

    updatePR(personalRecord) {
      this.$emit("edit-personal-record", personalRecord);
    },
  },

  watch: {
    averagePR: {
      handler() {
        this.$refs.averageGraph.updateOptions({
          colors: this.getColor(),
        });
      },
      deep: true,
    },
  },
});
</script>
