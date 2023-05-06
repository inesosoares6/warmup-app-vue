<template>
  <v-table fixed-header height="200px">
    <thead>
      <tr>
        <th class="text-center">Value</th>
        <th class="text-center">Reps</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in personalValue.value" :key="index">
        <td class="text-center">{{ item }} kg</td>
        <td class="text-center">{{ personalValue.reps[index] }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
defineProps(["personalValue"]);
</script>
