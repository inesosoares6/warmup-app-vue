<template>
  <v-container>
    <v-card
      v-if="currentWorkout !== undefined"
      :title="currentWorkout.name"
      :subtitle="currentWorkout.type + ' - ' + currentWorkout.time + ' min'"
    >
      <template v-slot:prepend>
        <v-icon size="small" color="secondary">mdi-weight-lifter</v-icon>
      </template>
      <template v-slot:append>
        <v-checkbox
          v-model="checkbox"
          label="Done"
          hide-details
          @change="updateWorkout"
        ></v-checkbox>
      </template>
      <v-divider></v-divider>
      <v-col>
        <v-btn class="details-button" color="transparent" icon size="small">
          <v-icon>mdi-dots-vertical</v-icon>
          <WorkoutDetails
            v-bind:workout="currentWorkout"
            v-bind:id="storeWorkouts.currentWorkoutId"
          ></WorkoutDetails>
        </v-btn>
      </v-col>
      <v-card-text
        class="exercises"
        v-html="currentWorkout.exercises.replaceAll('\n', '<br/>')"
      >
      </v-card-text>
      <v-col>
        <v-btn
          class="floating-button"
          color="secondary"
          icon
          size="small"
          @click="copyWorkout"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </v-col>
    </v-card>

    <v-divider thickness="0px"></v-divider>

    <TimerCard />

    <NotificationToast
      v-if="snackbar"
      :timeout="2000"
      :text="text"
      @close="snackbar = false"
    ></NotificationToast>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { Clipboard } from "@capacitor/clipboard";
import WorkoutDetails from "@/components/pop-ups/WorkoutDetails.vue";
import NotificationToast from "@/components/shared/NotificationToast.vue";
import TimerCard from "@/components/WorkoutView/TimerCard.vue";
import { useStoreWorkouts } from "@/stores/storeWorkouts";
import { useStoreApp } from "@/stores/storeApp";

const storeWorkouts = useStoreWorkouts();

const checkbox = ref(false);
const snackbar = ref(false);
const text = ref("");

const currentWorkout = computed(() => {
  return storeWorkouts.getCurrentWorkout;
});

const copyWorkout = () => {
  Clipboard.write({
    string: createStringWorkout(),
  });
  snackbar.value = true;
  text.value = "Copied workout to clipboard";
};

const createStringWorkout = () => {
  return (
    currentWorkout.value.name +
    "\n" +
    currentWorkout.value.type +
    " - " +
    currentWorkout.value.time +
    " min" +
    "\n-------------\n" +
    currentWorkout.value.exercises
  );
};

const updateWorkout = () => {
  if (checkbox.value) {
    storeWorkouts.updateWorkout({
      id: storeWorkouts.currentWorkoutId,
      updates: {
        completions: currentWorkout.value.completions + 1,
      },
    });
    const storeApp = useStoreApp();
    storeApp.updateTimeline(
      new Date().toDateString().substring(0, 3),
      storeWorkouts.currentWorkoutId
    );
  }
};


onMounted(() => {
  snackbar.value = currentWorkout.value === undefined;
  text.value = "No workout selected";
});
</script>

<style scoped>
.floating-button {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.details-button {
  position: absolute;
  top: 100px;
  left: 5px;
}

.exercises {
  text-align: center;
  font-size: 20px;
}

.v-divider {
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
