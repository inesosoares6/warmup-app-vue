<template>
  <v-container>
    <v-list
      v-if="!storeApp.groupByType && Object.keys(allWorkouts).length > 0"
      lines="two"
    >
      <v-list-item
        v-for="(workout, key) in allWorkouts"
        :key="key"
        :title="workout.name"
        :subtitle="workout.type + ' - ' + workout.time + ' min'"
      >
        <PreviewWorkout :workout="workout" :id="key"></PreviewWorkout>

        <template v-slot:prepend>
          <v-avatar :color="workout.completions > 0 ? 'secondary' : 'error'">
            <v-icon>mdi-dumbbell</v-icon>
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-btn
            flat
            round
            dense
            icon
            @click="storeWorkouts.deleteWorkout(key)"
          ><v-icon color="red">mdi-delete</v-icon></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-expansion-panels v-if="storeApp.groupByType">
      <v-expansion-panel
        v-for="(list, index) in groupWorkoutsByType()"
        :key="index"
        :title="list.type"
      >
        <v-expansion-panel-text>
          <v-list lines="two">
            <v-list-item
              v-for="(workout, key) in list.details"
              :key="key"
              :title="workout.name"
              :subtitle="workout.type + ' - ' + workout.time + ' min'"
            >
              <PreviewWorkout :workout="workout" :id="key"></PreviewWorkout>

              <template v-slot:prepend>
                <v-avatar
                  :color="workout.completions > 0 ? 'secondary' : 'error'"
                >
                  <v-icon>mdi-dumbbell</v-icon>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-avatar outline color="grey">
                  {{ workout.completions }}
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:actions>
        <v-btn color="error" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PreviewWorkout from "@/components/pop-ups/PreviewWorkout.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";
import { useStoreApp } from "@/stores/storeApp";
import { storeToRefs } from "pinia";

const storeApp = useStoreApp();
const storeWorkouts = useStoreWorkouts();
const snackbar = ref(false);
const text = ref("");
const timeout = ref(2000);

const { allWorkouts } = storeToRefs(storeWorkouts);

onMounted(() => {
  snackbar.value = Object.keys(allWorkouts).length < 1;
  text.value = "Add workouts";
});

const groupWorkoutsByType = () => {
  let returnList = [];
  Object.keys(allWorkouts.value).forEach((key) => {
    let item = allWorkouts.value[key];
    if (returnList.some((e) => e.type === item.type)) {
      returnList.forEach((typeList, index) => {
        if (typeList.type === item.type) {
          returnList[index].details.push(item);
        }
      });
    } else {
      returnList.push({ type: item.type, details: [item] });
    }
  });
  return returnList;
};
</script>
