<template>
  <v-dialog v-model="settingsMenu" activator="parent">
    <v-card>
      <v-card-title> Settings </v-card-title>
      <v-card-text>
        <v-switch
          v-model="isDarkMode"
          label="Dark Mode"
          color="secondary"
          inset
          hide-details
          @change="toggleTheme"
        ></v-switch>
        <v-switch
          v-model="groupByTypeEnabled"
          label="Group Workouts by Type"
          color="secondary"
          inset
          hide-details
          @change="groupByTypeFunction"
        ></v-switch>

        <v-divider />

        <h3>Delete</h3>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" color="error">
              Workouts
              <PreviewList
                v-if="allWorkouts.length > 0"
                v-bind:allWorkouts="allWorkouts"
                v-bind:action="'delete'"
                v-on:delete-workouts="deleteWorkouts"
              ></PreviewList>
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn variant="outlined" color="error" @click="deleteCache">
              All Cache
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { useTheme } from "vuetify";
import PreviewList from "@/components/pop-ups/PreviewList.vue";

export default defineComponent({
  name: "SettingsMenu",
  props: ["allWorkouts", "groupByType"],

  components: {
    PreviewList,
  },

  updated() {
    this.groupByTypeEnabled = this.groupByType;
  },

  setup() {
    const theme = useTheme();

    return {
      theme,
      toggleTheme: () =>
        (theme.global.name.value = theme.global.current.value.dark
          ? "light"
          : "dark"),
    };
  },

  data() {
    return {
      settingsMenu: false,
      isDarkMode: true,
      groupByTypeEnabled: false,
    };
  },

  methods: {
    deleteCache() {
      this.$emit("delete-cache");
      this.settingsMenu = false;
    },

    deleteWorkouts(workoutList) {
      this.$emit("delete-workouts", workoutList);
      this.settingsMenu = false;
    },

    groupByTypeFunction() {
      this.$emit("group-by-types", this.groupByTypeEnabled);
    },
  },
});
</script>

<style>
.v-divider {
  margin-top: 10px;
  margin-bottom: 10px;
}

.v-row {
  margin-top: 10px;
}
</style>
