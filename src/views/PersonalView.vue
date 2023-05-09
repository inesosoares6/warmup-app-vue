<template>
  <v-container>
    <PersonalRecords />
    <v-divider thickness="0px"></v-divider>
    <PersonalMeasurements />
    <v-divider thickness="0px"></v-divider>
    <PersonalObjectives/>
  </v-container>
</template>

<script setup>
import PersonalRecords from "@/components/PersonalView/PersonalRecords.vue";
import PersonalMeasurements from "@/components/PersonalView/PersonalMeasurements.vue";
import PersonalObjectives from "@/components/PersonalView/PersonalObjectives.vue";
</script>
