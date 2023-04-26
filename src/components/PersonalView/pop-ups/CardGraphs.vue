<template>
  <VueApexCharts
    v-if="input === 'measurement'"
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
</template>

<script setup>
import { ref, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";

const props = defineProps(["personalValue", "input", "color"]);

const getMinMax = () => {
  const max = Math.max(
    ...[Math.max(...[...props.personalValue.value, props.personalValue.target])]
  );
  const min = Math.min(
    ...[Math.min(...[...props.personalValue.value, props.personalValue.target])]
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
