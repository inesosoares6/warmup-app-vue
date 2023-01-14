<template>
  <v-dialog v-model="editPersonalRecord" activator="parent">
    <v-card :title="personalRecord.name">
      <template v-slot:prepend>
        <v-icon v-if="input === 'measurement'" size="small" color="secondary"
          >mdi-scale-bathroom</v-icon
        >
        <v-icon v-else size="small" color="secondary"
          >mdi-clipboard-text</v-icon
        >
      </template>
      <v-card-text>
        <v-form ref="form">
          <v-row
            v-if="input === 'measurement' && personalRecord.name === 'Weight'"
          >
            <v-col>
              <v-text-field
                v-model="newValue"
                :rules="[(v) => !!v || 'Field is required']"
                label="Add new value"
                type="number"
                suffix="kg"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="newTargetValue"
                :rules="[(v) => !!v || 'Field is required']"
                label="New target"
                suffix="kg"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <v-text-field
                v-model="newValue"
                :rules="[(v) => !!v || 'Field is required']"
                label="Add new value"
                type="number"
                :suffix="input === 'measurement' ? personalRecord.unit : 'kg'"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card
        title="Evolution"
        color="#424242"
        width="85%"
        style="margin: auto"
      >
        <apexchart
          v-if="personalRecord.name === 'Weight'"
          type="line"
          :options="chartOptionsWeight"
          :series="series"
          width="100%"
          height="70px"
        ></apexchart>
        <apexchart
          v-else
          type="line"
          :options="chartOptions"
          :series="series"
          width="100%"
          height="70px"
        ></apexchart>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="updateRecord"> Update </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useStoreWorkouts } from "@/stores/storeWorkouts";

export default defineComponent({
  name: "EditPersonalRecord",
  props: ["personalRecord", "input", "color"],

  setup() {
    const store = useStoreWorkouts();
    return {
      store,
    };
  },

  components: {
    apexchart: VueApexCharts,
  },

  mounted() {
    this.personalRecordEdited = { ...this.personalRecord };
  },

  data() {
    return {
      editPersonalRecord: false,
      personalRecordEdited: {},
      newValue: null,
      newTargetValue: null,
      chartOptionsWeight: {
        annotations: {
          yaxis: [
            {
              y: this.personalRecord.target,
              borderColor: "#AFADAD",
            },
          ],
        },
        yaxis: {
          min: this.getMinMax()[0],
          max: this.getMinMax()[1],
        },
        chart: {
          id: "personal-records-evolution",
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
        colors: this.color,
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
        xaxis: {
          categories: this.personalRecord.date,
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 6,
          strokeWidth: 0,
          hover: {
            size: 9,
          },
        },
      },
      chartOptions: {
        chart: {
          id: "personal-records-evolution",
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
        colors: this.color,
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
        xaxis: {
          categories: this.personalRecord.date,
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 6,
          strokeWidth: 0,
          hover: {
            size: 9,
          },
        },
      },
      series: [
        {
          name: this.personalRecord.name,
          data: this.personalRecord.value,
        },
      ],
    };
  },

  methods: {
    getMinMax() {
      const max = Math.max(
        ...[
          Math.max(
            ...[...this.personalRecord.value, this.personalRecord.target]
          ),
        ]
      );
      const min = Math.min(
        ...[
          Math.min(
            ...[...this.personalRecord.value, this.personalRecord.target]
          ),
        ]
      );
      return [min, max];
    },

    updateRecord() {
      if (this.newValue !== null) {
        this.personalRecordEdited.value.push(this.newValue);
      }
      if (
        this.personalRecordEdited.name === "Weight" &&
        this.newTargetValue !== null
      )
        this.personalRecordEdited.target = this.newTargetValue;
      let date = new Date().toString().split(" ");
      this.personalRecordEdited.date.push(
        date[2] + " " + date[1] + " " + date[3]
      );
      if (this.input === "measurement") {
        this.store.updateMeasurement(this.personalRecordEdited);
      } else {
        this.store.updatePR(this.personalRecordEdited);
      }
      this.newValue = null;
      this.newTargetValue = null;
      this.editPersonalRecord = false;
    },
  },

  watch: {
    color: {
      handler() {
        this.chartOptions.colors = this.color;
      },
      deep: true,
    },
    personalRecord: {
      handler() {
        this.chartOptions.colors = this.color;
      },
      deep: true,
    },
  },
});
</script>

<style scoped>
.v-card-title {
  margin-top: 10px;
}

.v-text-field :deep(input::-webkit-outer-spin-button),
.v-text-field :deep(input::-webkit-inner-spin-button) {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
}

.graph {
  margin: auto;
  width: 90%;
}
</style>
