<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-center" v-for="k in headerArray" :key="k">{{ k }} %</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center" v-for="k in headerArray" :key="k">
          {{ getLatestRM(k) }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
const props = defineProps(["headerArray", "personalValue"]);

const getLatestRM = (percentage) => {
  return Math.round(
    ((props.personalValue.value.at(-1) /
      (1.0278 - 0.0278 * props.personalValue.reps.at(-1))) *
      percentage) /
      100
  );
};
</script>
