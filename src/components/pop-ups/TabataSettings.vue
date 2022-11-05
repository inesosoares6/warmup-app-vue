<template>
  <v-dialog v-model="tabataSettings" activator="parent">
    <v-card>
      <v-card-title> Tabata Settings </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="prepareTime"
            type="number"
            :rules="timeRules"
            label="Prepare (sec)"
            required
            hide-details
          ></v-text-field>
          <v-row>
            <v-col>
              <v-text-field
                v-model="workTime"
                type="number"
                :rules="timeRules"
                label="Work (sec)"
                required
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="rest"
                type="number"
                :rules="timeRules"
                label="Rest (sec)"
                required
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="cycles"
                type="number"
                :rules="timeRules"
                label="Cycles"
                required
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="sets"
                type="number"
                :rules="timeRules"
                label="Sets"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            v-model="restBetweenSets"
            type="number"
            :rules="timeRules"
            label="Rest between sets (sec)"
            required
            hide-details
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="returnTabata()"> Go </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TabataSettings",

  data() {
    return {
      tabataSettings: false,
      valid: true,
      timeRules: [(v) => v >= 0 || "Time must be greater than 0"],
      prepareTime: 5,
      workTime: 10,
      rest: 0,
      cycles: 1,
      sets: 1,
      restBetweenSets: 0,
    };
  },

  methods: {
    returnTabata() {
      this.$emit("created-tabata", {
        prepareTime: this.prepareTime,
        workTime: this.workTime,
        rest: this.rest,
        cycles: this.cycles,
        sets: this.sets,
        restBetweenSets: this.restBetweenSets,
      });
      this.tabataSettings = false;
    },
  },
});
</script>

<style scoped>
.v-card-title {
  margin-top: 10px;
}
</style>
