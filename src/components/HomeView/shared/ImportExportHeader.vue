<template>
  <v-card-title>
    {{ title }}
    <v-btn-toggle border>
      <v-btn drpressed :active="file" @click="$emit('toggle-value', true)">
        File
      </v-btn>
      <v-btn drpressed :active="!file" @click="$emit('toggle-value', false)">
        QR Code
      </v-btn>
    </v-btn-toggle>
  </v-card-title>
</template>

<script setup>
defineProps(["title", "file"]);
</script>
