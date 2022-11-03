<template>
  <v-dialog v-model="editWorkout" activator="parent">
    <v-card>
      <v-card-title> Edit Workout </v-card-title>
      <v-card-text>
        <v-form ref="formEdit">
          <v-text-field
            v-model="workoutEdited.name"
            :rules="[(v) => !!v || 'Name is required']"
            label="Name"
            required
          ></v-text-field>
          <v-select
            v-model="workoutEdited.type"
            :items="types"
            :rules="[(v) => !!v || 'Type is required']"
            label="Type"
            required
          ></v-select>
          <v-text-field v-if="workoutEdited.type === '--> Add new type'"
            v-model="newType"
            :rules="nameRules"
            label="New type"
            required
          ></v-text-field>
          <v-row
            ><v-col>
              <v-text-field
                v-model="workoutEdited.time"
                type="number"
                :rules="timeRules"
                label="Time (min)"
                required
              ></v-text-field> </v-col
            ><v-col>
              <v-text-field
                v-model="workoutEdited.completions"
                type="number"
                label="Completions"
                required
              ></v-text-field> </v-col
          ></v-row>
          <v-textarea
            v-model="workoutEdited.exercises"
            :rules="[(v) => !!v || 'Exercises are required']"
            label="Exercises"
            required
            hide-details
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer
        ><v-btn color="error" @click="resetForm"> Reset </v-btn>
        <v-btn color="secondary" @click="updateWorkout"> Update </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditWorkout",
  props: ["workout", "types"],

  mounted() {
    this.workoutEdited = { ...this.workout };
  },

  data() {
    return {
      editWorkout: false,
      timeRules: [
        (v) => !!v || "Field is required",
        (v) => v >= 0 || "Time must be greater than 0",
      ],
      workoutEdited: {},
      newType: "",
    };
  },

  methods: {
    updateWorkout() {
      this.editWorkout = false;
      if(this.workoutEdited.type === '--> Add new type') {
        this.workoutEdited.type = this.newType;
      }
      this.$emit("edit-workout", this.workoutEdited);
    },
    resetForm() {
      this.$refs.formEdit.reset();
    },
  },
});
</script>

<style>
.v-card-title {
  margin-top: 10px;
}
</style>
