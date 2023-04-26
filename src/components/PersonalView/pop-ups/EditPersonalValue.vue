<template>
  <v-dialog v-model="editPersonalRecord" activator="parent">
    <v-card :title="personalValue.name">
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
            v-if="input === 'measurement'"
          >
            <v-col>
              <v-text-field
                v-model="newValue"
                label="Add new value"
                type="number"
                :suffix="personalValue.unit"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="newTargetValue"
                label="New target"
                :suffix="personalValue.unit"
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
                suffix="kg"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card
        title="Evolution"
        width="85%"
        style="margin: auto"
      >
        <VueApexCharts
          v-if="personalValue.name === 'Weight'"
          type="line"
          :options="chartOptionsWeight"
          :series="series"
          width="100%"
          height="70px"
        ></VueApexCharts>
        <VueApexCharts
          v-else
          type="line"
          :options="chartOptions"
          :series="series"
          width="100%"
          height="70px"
        ></VueApexCharts>
      </v-card>
      <v-card-actions>
        <v-btn color="error" @click="deleteRecord(true)">
          Delete Last Entry
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="updateRecord"> Update </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useStoreUser } from "@/stores/storeUser";

const storeUser = useStoreUser();

const props = defineProps({
  personalValue: {
    type: Object,
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  color: {
    type: Array,
    required: true,
  },
});

onMounted(() => {
  personalRecordEdited.value = { ...props.personalValue };
});

const editPersonalRecord = ref(false);
const personalRecordEdited = ref({});
const newValue = ref(null);
const newTargetValue = ref(null);

const getMinMax = () => {
  const max = Math.max(
    ...[
      Math.max(...[...props.personalValue.value, props.personalValue.target]),
    ]
  );
  const min = Math.min(
    ...[
      Math.min(...[...props.personalValue.value, props.personalValue.target]),
    ]
  );
  return [min, max];
};

const chartOptionsWeight = ref({
  annotations: {
    yaxis: [
      {
        y: props.personalValue.target,
        borderColor: "#AFADAD",
      },
    ],
  },
  yaxis: {
    min: getMinMax()[0],
    max: getMinMax()[1],
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
  colors: props.color,
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
    categories: props.personalValue.date,
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
});
const chartOptions = ref({
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
  colors: props.color,
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
    categories: props.personalValue.date,
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
});
const series = ref([
  {
    name: props.personalValue.name,
    data: props.personalValue.value,
  },
]);

const deleteRecord = (lastEntry) => {
  if (props.input === "measurement") {
    storeUser.deleteMeasurement(props.personalValue, lastEntry);
  } else {
    storeUser.deletePR(props.personalValue, lastEntry);
  }
};

const updateRecord = () => {
  if (newValue.value !== null) {
    personalRecordEdited.value.value.push(newValue.value);
  }
  if (
    personalRecordEdited.value.name === "Weight" &&
    newTargetValue.value !== null
  )
    personalRecordEdited.value.target = newTargetValue.value;
  let date = new Date().toString().split(" ");
  personalRecordEdited.value.date.push(date[2] + " " + date[1] + " " + date[3]);
  if (props.input === "measurement") {
    storeUser.updateMeasurement(personalRecordEdited.value);
  } else {
    storeUser.updatePR(personalRecordEdited.value);
  }
  newValue.value = null;
  newTargetValue.value = null;
  editPersonalRecord.value = false;
};

watch(
  () => [props.color, props.personalValue],
  () => {
    if (props.personalValue.name === "Weight") {
      chartOptionsWeight.value.colors = props.color;
    } else {
      chartOptions.value.colors = props.color;
    }
  }
);
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
