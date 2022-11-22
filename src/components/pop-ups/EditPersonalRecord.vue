<template>
  <v-dialog v-model="editPersonalRecord" activator="parent">
    <v-card>
      <v-card-title> Edit Personal Record </v-card-title>
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
    this.newValue = this.personalRecord.value[this.personalRecord.value.length-1];
  },

  data() {
    return {
      editPersonalRecord: false,
      personalRecordEdited: {},
      newValue: 0,
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
</style>
