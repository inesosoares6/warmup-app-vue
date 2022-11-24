<template>
  <v-dialog v-model="addPersonalRecord" activator="parent">
    <v-card>
      <v-card-title> Add Personal Record </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="name"
            :rules="[(v) => !!v || 'Field is required']"
            label="Exercise Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="value"
            :rules="[(v) => !!v || 'Field is required']"
            label="Value"
            type="number"
            suffix="kg"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="addPR"> Add PR </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  name: "AddPersonalRecord",

  data() {
    return {
      addPersonalRecord: false,
      name: "",
      value: "",
    };
  },

  methods: {
    addPR() {
      let date = new Date().toString().split(' ');
      this.$emit("add-personal-record", {
        id: uuidv4(),
        name: this.name,
        value: [this.value],
        date: [date[2] + ' ' + date[1] + ' ' + date[3]]
      });
      this.name = "";
      this.value = "";
      this.addPersonalRecord = false;
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
