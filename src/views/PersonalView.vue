<template>
  <v-container>
    <v-card title="Personal Records">
      <template v-slot:prepend>
        <v-icon class="dumbbell-icon" color="secondary"
          >mdi-clipboard-text</v-icon
        >
      </template>
      <template v-slot:append>
        <v-btn icon color="transparent" size="35">
          <v-icon size="small">mdi-plus</v-icon>
          <AddPersonalRecord></AddPersonalRecord>
        </v-btn>
      </template>
      <v-divider></v-divider>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="(record, index) in storeUser.personalRecords"
            :key="index"
            :value="record"
            rounded="xl"
            ><template v-slot:prepend>
              <v-avatar size="25" :color="getColor(record.value, true)">
                <v-icon size="small">mdi-dumbbell</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title
              v-text="
                record.name +
                ': ' +
                record.value[record.value.length - 1] +
                ' kg'
              "
            ></v-list-item-title>
            <template v-slot:append>
              <v-btn @click="deleteRecord(record)" size="small" icon flat>
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
            <EditPersonalRecord
              v-bind:personalRecord="record"
              v-bind:input="'record'"
              v-bind:color="getColor(record.value, false)"
            ></EditPersonalRecord>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <v-divider thickness="0px"></v-divider>
    <v-card title="Measurements">
      <template v-slot:prepend>
        <v-icon class="dumbbell-icon" color="secondary"
          >mdi-scale-bathroom</v-icon
        >
      </template>
      <template v-slot:append>
        <v-btn
          v-show="storeUser.measurements.length < 3"
          icon
          color="transparent"
          size="35"
        >
          <v-icon size="small">mdi-plus</v-icon>
          <AddMeasurement></AddMeasurement>
        </v-btn>
      </template>
      <v-divider></v-divider>
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
              <EditPersonalRecord
                v-bind:personalRecord="record"
                v-bind:input="'measurement'"
                v-bind:color="convertColor(getMeasurementColor(record))"
              ></EditPersonalRecord
              ><br />
              <v-divider thickness="0px"></v-divider>
              {{ record.name }}
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import AddPersonalRecord from "@/components/pop-ups/AddPersonalRecord.vue";
import EditPersonalRecord from "@/components/pop-ups/EditPersonalRecord.vue";
import AddMeasurement from "@/components/pop-ups/AddMeasurement.vue";
import { useStoreUser } from "@/stores/storeUser";

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

const convertColor = (color) => {
  return color === "secondary" ? ["#03dac5"] : ["#cf6679"];
};

const getColor = (array, avatar) => {
  if (array.length === 1) return avatar ? "secondary" : ["#03dac5"];
  return array[array.length - 1] > array[array.length - 2]
    ? avatar
      ? "secondary"
      : ["#03dac5"]
    : avatar
    ? "error"
    : ["#cf6679"];
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

const deleteRecord = (record) => {
  storeUser.deletePR(record, false);
};
</script>

<style scoped>
.measurements {
  font-size: 16px;
}

.center-btns {
  text-align: center;
}
</style>
