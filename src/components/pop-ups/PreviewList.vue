<template>
  <v-dialog v-model="previewList" activator="parent">
    <v-card title="Select Workouts">
      <v-card-text>
        <v-list class="wod-list" lines="two" v-if="allWorkouts.length > 0">
          <v-list-item
            v-for="(workout, index) in allWorkouts"
            :key="index"
            :title="workout.name"
            :subtitle="workout.type + ' - ' + workout.time + ' min'"
          >
            <template v-slot:prepend>
              <v-avatar
                :color="workout.completions > 0 ? 'secondary' : 'error'"
              >
                <v-icon>mdi-dumbbell</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-checkbox
                v-model="selected"
                hide-details
              ></v-checkbox>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary">
          Send
          <QrcodeGenerator :message="'Hello World'"/>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import QrcodeGenerator from "@/components/pop-ups/QrcodeGenerator.vue";

export default defineComponent({
  name: "PreviewList",
  props: ["allWorkouts"],

  components: {
    QrcodeGenerator,
  },

  data() {
    return {
      previewList: false,
      selected: false,
    };
  },

  methods: {},
});
</script>
