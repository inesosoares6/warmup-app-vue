<template>
  <v-container>
    <v-card title="Personal Records">
      <template v-slot:prepend>
        <v-icon class="dumbbell-icon" color="secondary">mdi-medal</v-icon>
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
        <div>
          <apexchart
            type="line"
            :options="chartOptions"
            :series="series"
            width="100%"
          ></apexchart>
        </div>
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
  props: ["personalRecords", "lastWorkout"],

  components: {
    AddPersonalRecord,
    EditPersonalRecord,
    apexchart: VueApexCharts,
  },

  mounted() {
    console.log(this.personalRecords);
  },

  data() {
    return {
      chartOptions: {
        chart: {
          id: "personal-records-average",
          zoom: {
            enabled: false,
          },
        },
        title: {
          text: "Average",
          align: "left",
        },
        dataLabels: {
          enabled: false,
        },
      },
      series: [
        {
          name: "series-1",
          data: this.personalRecords[0].value,
        },
      ],
    };
  },
  methods: {
    addPR(personalRecord) {
      this.$emit("add-personal-record", personalRecord);
    },

    updatePR(personalRecord) {
      this.$emit("edit-personal-record", personalRecord);
    },
  },
});
</script>
