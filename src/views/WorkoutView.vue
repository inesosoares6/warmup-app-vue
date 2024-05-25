<template>
	<v-container>
		<WorkoutCard />

		<v-divider thickness="0px" />

		<TimerCard />
	</v-container>
</template>

<script setup>
import TimerCard from '@/components/WorkoutView/Timer/TimerCard.vue'
import WorkoutCard from '@/components/WorkoutView/Workout/WorkoutCard.vue'
</script>

<style scoped>
.v-divider {
	margin-top: 5px;
	margin-bottom: 10px;
}
</style>
