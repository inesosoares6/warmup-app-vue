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
            v-if="input === 'measurment' && personalRecord.name === 'Weight'"
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
                :suffix="input === 'measurment' ? personalRecord.unit : 'kg'"
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
          type="line"
          :options="chartOptions"
          :series="series"
          width="100%"
          height="70px"
        ></apexchart>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="updatePR"> Update </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "EditPersonalRecord",
  props: ["personalRecord", "input", "color"],

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
            bottom: 20,
            left: 20,
            right: 20,
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
    getColor() {
      if (this.input !== undefined && this.input === "measurement") {
        return this.color === "secondary" ? ["#03dac5"] : ["#cf6679"];
      } else {
        return this.personalRecord.value[this.personalRecord.value.length - 1] >
          this.personalRecord.value[this.personalRecord.value.length - 2]
          ? ["#03dac5"]
          : ["#cf6679"];
      }
    },
    updatePR() {
      this.personalRecordEdited.value.push(this.newValue);
      let date = new Date().toString().split(" ");
      this.personalRecordEdited.date.push(
        date[2] + " " + date[1] + " " + date[3]
      );
      if (this.input === "measurement") {
        this.$emit("edit-measurement", this.personalRecordEdited);
      } else {
        this.$emit("edit-personal-record", this.personalRecordEdited);
      }
      this.newValue = null;
      this.editPersonalRecord = false;
    },
  },

  watch: {
    color: {
      handler() {
        console.log(this.color);
        this.chartOptions.colors = this.getColor();
      },
      deep: true,
    },
    personalRecord: {
      handler() {
        this.chartOptions.colors = this.getColor();
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
