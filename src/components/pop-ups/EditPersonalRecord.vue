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
      <template v-slot:append>
        <v-icon @click="deleteRecord(false)" size="small" color="error"
          >mdi-delete</v-icon
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
        <VueApexCharts
          v-if="personalRecord.name === 'Weight'"
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
import { useStoreWorkouts } from "@/stores/storeWorkouts";

const storeWorkouts = useStoreWorkouts();

const props = defineProps({
  personalRecord: {
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
  personalRecordEdited.value = { ...props.personalRecord };
});

const editPersonalRecord = ref(false);
const personalRecordEdited = ref({});
const newValue = ref(null);
const newTargetValue = ref(null);

const getMinMax = () => {
  const max = Math.max(
    ...[
      Math.max(...[...props.personalRecord.value, props.personalRecord.target]),
    ]
  );
  const min = Math.min(
    ...[
      Math.min(...[...props.personalRecord.value, props.personalRecord.target]),
    ]
  );
  return [min, max];
};

const chartOptionsWeight = ref({
  annotations: {
    yaxis: [
      {
        y: props.personalRecord.target,
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
    categories: props.personalRecord.date,
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
    categories: props.personalRecord.date,
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
    name: props.personalRecord.name,
    data: props.personalRecord.value,
  },
]);

const deleteRecord = (lastEntry) => {
  if (props.input === "measurement") {
    storeWorkouts.deleteMeasurement(props.personalRecord, lastEntry);
  } else {
    storeWorkouts.deletePR(props.personalRecord, lastEntry);
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
    storeWorkouts.updateMeasurement(personalRecordEdited.value);
  } else {
    storeWorkouts.updatePR(personalRecordEdited.value);
  }
  newValue.value = null;
  newTargetValue.value = null;
  editPersonalRecord.value = false;
};

watch(
  () => [props.color, props.personalRecord],
  () => {
    if (props.personalRecord.name === "Weight") {
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
