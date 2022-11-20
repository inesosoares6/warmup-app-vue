<template>
  <v-dialog v-model="editPersonalRecord" activator="parent">
    <v-card>
      <v-card-title> Edit Personal Record </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="personalRecordEdited.name"
            :rules="[(v) => !!v || 'Field is required']"
            label="Exercise Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="personalRecordEdited.value"
            :rules="[(v) => !!v || 'Field is required']"
            label="Value"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="updatePR"> Update </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditPersonalRecord",
  props: ["personalRecord"],

  mounted() {
    this.personalRecordEdited = { ...this.personalRecord };
  },

  data() {
    return {
      editPersonalRecord: false,
      personalRecordEdited: {},
    };
  },

  methods: {
    updatePR() {
      this.$emit("edit-personal-record", this.personalRecordEdited);
      this.editPersonalRecord = false;
    },
  },
});
</script>

<style>
.v-card-title {
  margin-top: 10px;
}
</style>
