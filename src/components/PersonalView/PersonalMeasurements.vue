<template>
  <v-card title="Measurements">
    <template v-slot:prepend>
      <v-icon class="dumbbell-icon" color="secondary"
        >mdi-scale-bathroom</v-icon
      >
    </template>
    <template v-slot:append>
      <v-btn
        v-show="Object.keys(storeUser.measurements).length < 3"
        icon
        color="transparent"
        size="35"
      >
        <v-icon size="small">mdi-plus</v-icon>
        <AddMeasurement />
      </v-btn>
    </template>
    <v-divider />
    <v-card-text>
      <div class="text-center">
        <v-row class="center-btns">
          <v-col
            class="measurements"
            v-for="(record, index) in storeUser.measurements"
            :key="index"
          >
            <v-progress-circular
              :rotate="360"
              :size="80"
              :width="10"
              :model-value="calculatePercentage(record)"
              :color="getMeasurementColor(record)"
            >
              {{ record.value[record.value.length - 1] }}
              {{ record.unit }}</v-progress-circular
            >
            <EditPersonalValue
              :personalValue="record"
              :id="index"
              :input="'measurement'"
              :color="convertColor(getMeasurementColor(record))"
            />
            <br />
            <v-divider thickness="0px" />
            {{ record.name }}
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useStoreUser } from "@/stores/storeUser";
import AddMeasurement from "@/components/PersonalView/pop-ups/AddMeasurement.vue";
import EditPersonalValue from "@/components/PersonalView/pop-ups/EditPersonalValue.vue";

const storeUser = useStoreUser();

const calculatePercentage = (measurement) => {
  if (measurement.unit === "%")
    return measurement.value[measurement.value.length - 1];

  if (measurement.name === "Weight") {
    if (measurement.target > measurement.value[measurement.value.length - 1]) {
      return (
        (measurement.value[measurement.value.length - 1] / measurement.target) *
        100
      );
    } else {
      return (
        (measurement.target / measurement.value[measurement.value.length - 1]) *
        100
      );
    }
  } else {
    let value = 0;
    storeUser.measurements.forEach((record) => {
      if (record.name === "Weight") {
        value = Math.round(
          (measurement.value[measurement.value.length - 1] /
            record.value[record.value.length - 1]) *
            100
        );
      }
    });
    return value;
  }
};

const getMeasurementColor = (measurement) => {
  if (measurement.value.length < 2) return "secondary";
  switch (measurement.name) {
    case "Weight":
      return Math.abs(
        measurement.value[measurement.value.length - 1] - measurement.target
      ) <=
        Math.abs(
          measurement.value[measurement.value.length - 2] - measurement.target
        )
        ? "secondary"
        : "error";
    case "Body Fat":
      return measurement.value[measurement.value.length - 1] <=
        measurement.value[measurement.value.length - 2]
        ? "secondary"
        : "error";
    case "Muscle Mass":
      return measurement.value[measurement.value.length - 1] >
        measurement.value[measurement.value.length - 2]
        ? "secondary"
        : "error";
  }
};

const convertColor = (color) => {
  return color === "secondary" ? ["#03dac5"] : ["#cf6679"];
};
</script>
