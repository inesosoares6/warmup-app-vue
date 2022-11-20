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
      this.$emit("add-personal-record", { name: this.name, value: this.value });
      this.addPersonalRecord = false;
    },
  },
});
</script>

<style>
.v-card-title {
  margin-top: 10px;
}
</style>
