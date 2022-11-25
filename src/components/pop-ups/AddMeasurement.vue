<template>
  <v-dialog v-model="addMeasurement" activator="parent">
    <v-card>
      <v-card-title> Add Measurement </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col>
              <v-select
                v-model="name"
                :items="getTypes()"
                :rules="[(v) => !!v || 'Item is required']"
                label="Type"
                required
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="unit"
                :items="getItems()"
                :rules="[(v) => !!v || 'Item is required']"
                label="Unit"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
              v-if="unit!==''"
                v-model="value"
                :rules="[(v) => !!v || 'Field is required']"
                label="Value"
                type="number"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-if="name==='Weight' && unit!==''"
                v-model="targetValue"
                :rules="[(v) => !!v || 'Field is required']"
                label="Target"
                type="number"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="addRecord"> Add </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  name: "AddMeasurement",
  props: ["measurements"],

  data() {
    return {
      addMeasurement: false,
      name: "",
      value: "",
      unit: "",
      targetValue: "",
    };
  },

  methods: {
    addRecord() {
      let date = new Date().toString().split(" ");
      this.$emit("add-measurement", {
        id: uuidv4(),
        name: this.name,
        value: [this.value],
        unit: this.unit,
        target: this.targetValue,
        date: [date[2] + " " + date[1] + " " + date[3]],
      });
      this.name = "";
      this.value = "";
      this.targetValue = "";
      this.addMeasurement = false;
    },

    getItems() {
      if(this.name === 'Weight') {
        this.unit = 'kg';
        return ['kg'];
      } else {
        return ['%', 'kg'];
      }
    },

    getTypes() {
      let types = ["Weight", "Body Fat", "Muscle Mass"];
      if (this.measurements.length === 0) return types;
      this.measurements.forEach((record) => {
        const index = types.indexOf(record.name);
        if (index > -1) {
          types.splice(index, 1);
        }
      });
      return types;
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
</style>
