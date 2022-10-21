<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-icon class="dumbbell-icon" color="secondary"
          >mdi-clipboard-check-multiple-outline</v-icon
        >
        Summary
      </v-card-title>
      <v-card-text>
        <v-row class="center-btns">
          <v-col class="done-todo">
            <v-avatar size="60" :color="'secondary'">
              {{ workoutSummary.done }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            Done
          </v-col>
          <v-col class="done-todo">
            <v-avatar size="60" :color="'error'">
              {{ workoutSummary.todo }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            To Do
          </v-col>
        </v-row>
        <v-divider class="divider" thickness="1px"></v-divider>
        <v-row class="center-btns">
          <v-col v-for="(item, index) in workoutSummary.types" :key="index">
            <v-avatar :color="'secondary'"> {{ item.value }} </v-avatar><br />
            <v-divider thickness="0px"></v-divider>
            {{ item.type }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-divider thickness="0px"></v-divider>
    <v-card>
      <v-card-title>
        <v-icon color="secondary">mdi-swap-horizontal</v-icon>
        Exchange WODs
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" append-icon="mdi-arrow-top-right">
              Send
              <QrcodeGenerator/>
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" prepend-icon="mdi-arrow-bottom-left">
              Receive
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-divider thickness="0px"></v-divider>
    <v-card>
      <v-card-title>
        <v-icon class="dumbbell-icon" color="secondary">mdi-dumbbell</v-icon>
        Generate Random
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              v-model="time"
              type="number"
              :rules="[(v) => v >= 0 || 'Time must be greater than 0']"
              label="Max time (min)"
              required
            ></v-text-field>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn
              class="go-btn"
              prepend-icon="mdi-weight-lifter"
              color="secondary"
            >
              GO
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-divider thickness="0px"></v-divider>
    <v-card v-if="lastWorkout.name !== undefined">
      <v-card-title>
        <v-icon class="dumbbell-icon" color="secondary">mdi-history</v-icon>
        Last Workout
      </v-card-title>
      <v-card-subtitle>
        <div>{{ lastWorkout.name }}</div>
        <div>{{ lastWorkout.type + " - " + lastWorkout.time + " min" }}</div>
      </v-card-subtitle>
      <v-card-text v-html="lastWorkout.exercises.replaceAll('\n', '<br/>')">
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import QrcodeGenerator from "@/components/pop-ups/QrcodeGenerator.vue";

export default defineComponent({
  name: "AddWorkout",
  props: ["workoutSummary", "lastWorkout"],

  components: {
    QrcodeGenerator,
  },

  data() {
    return {
      time: null,
    };
  },
});
</script>

<style>
.v-divider {
  margin-top: 5px;
  margin-bottom: 5px;
}
.divider {
  margin-top: 10px;
  margin-bottom: 10px;
}

.go-btn {
  margin-top: 10px;
}

.dumbbell-icon {
  font-size: 23px;
}

.center-btns {
  text-align: center;
}

.done-todo {
  font-size: 20px;
  font-weight: bold;
}
</style>
