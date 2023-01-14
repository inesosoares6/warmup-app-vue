<template>
  <v-container>
    <v-list
      v-if="!storeWorkouts.groupByType && storeWorkouts.allWorkouts.length > 0"
      lines="two"
    >
      <v-list-item
        v-for="workout in storeWorkouts.allWorkouts"
        :key="workout.id"
        :title="workout.name"
        :subtitle="workout.type + ' - ' + workout.time + ' min'"
      >
        <PreviewWorkout :workout="workout"></PreviewWorkout>

        <template v-slot:prepend>
          <v-avatar :color="workout.completions > 0 ? 'secondary' : 'error'">
            <v-icon>mdi-dumbbell</v-icon>
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-avatar outline color="#424242">
            {{ workout.completions }}
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-expansion-panels v-if="storeWorkouts.groupByType">
      <v-expansion-panel
        v-for="(list, index) in groupWorkoutsByType()"
        :key="index"
        :title="list.type"
      >
        <v-expansion-panel-text>
          <v-list lines="two">
            <v-list-item
              v-for="workout in list.details"
              :key="workout.id"
              :title="workout.name"
              :subtitle="workout.type + ' - ' + workout.time + ' min'"
            >
              <PreviewWorkout :workout="workout"></PreviewWorkout>

              <template v-slot:prepend>
                <v-avatar
                  :color="workout.completions > 0 ? 'secondary' : 'error'"
                >
                  <v-icon>mdi-dumbbell</v-icon>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-avatar outline color="#424242">
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

const storeWorkouts = useStoreWorkouts();
const snackbar = ref(false);
const text = ref("");
const timeout = ref(2000);

onMounted(() => {
  snackbar.value = storeWorkouts.allWorkouts.length < 1;
  text.value = "Add workouts";
});

const groupWorkoutsByType = () => {
  let returnList = [];
  storeWorkouts.allWorkouts.forEach((item) => {
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
