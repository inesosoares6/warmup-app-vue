<template>
  <v-dialog v-model="editPersonalRecord" activator="parent">
    <v-card :title="personalRecord.name">
      <template v-slot:prepend>
        <v-avatar size="25" color="secondary">
          <v-icon size="small">mdi-trophy</v-icon>
        </v-avatar>
      </template>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="newValue"
            :rules="[(v) => !!v || 'Field is required']"
            label="Add new value"
            type="number"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <div class="graph">
        <apexchart
          type="line"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
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
  props: ["personalRecord"],

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
      chartOptions: {
        chart: {
          id: "personal-record-evolution",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        title: {
          text: "Evolution",
          align: "left",
        },
        dataLabels: {
          enabled: false,
        },
      },
      series: [
        {
          name: "series-1",
          data: this.personalRecord.value,
        },
      ],
    };
  },

  methods: {
    updatePR() {
      this.personalRecordEdited.value.push(this.newValue);
      this.$emit("edit-personal-record", this.personalRecordEdited);
      this.editPersonalRecord = false;
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
