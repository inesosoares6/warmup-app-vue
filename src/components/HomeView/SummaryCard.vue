<template>
    <v-card title="Summary">
      <template v-slot:prepend>
        <v-icon class="dumbbell-icon" color="secondary"
          >mdi-clipboard-check-multiple-outline</v-icon
        >
      </template>
      <v-card-text>
        <v-row class="center-btns">
          <v-col class="done-todo">
            <v-avatar size="60" :color="'secondary'">
              {{ getWorkoutSummary.done }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            Done
          </v-col>
          <v-col class="done-todo">
            <v-avatar size="60" :color="'error'">
              {{ getWorkoutSummary.todo }} </v-avatar
            ><br />
            <v-divider thickness="0px"></v-divider>
            To Do
          </v-col>
        </v-row>
        <v-divider class="divider" thickness="1px"></v-divider>
        <v-slide-group>
          <v-slide-group-item
            v-for="(item, index) in getWorkoutSummary.types"
            :key="index"
          >
            <div class="types-avatar">
              <v-avatar :color="'secondary'"> {{ item.value }} </v-avatar><br />
              <v-divider thickness="0px"></v-divider>
              {{ item.type }}
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </v-card-text>
    </v-card>
</template>

<script setup>
import { useStoreWorkouts } from "@/stores/storeWorkouts";
import { storeToRefs } from "pinia";

const storeWorkouts = useStoreWorkouts();
const { getWorkoutSummary } = storeToRefs(storeWorkouts);
</script>