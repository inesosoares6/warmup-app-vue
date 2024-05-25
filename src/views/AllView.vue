<template>
	<v-container>
		<ListWorkouts
			v-if="!storeApp.groupByType"
			:list="storeWorkouts.allWorkouts"
		/>

		<ListByTypes v-else />

		<div class="floating-button">
			<v-btn
				style="pointer-events: all"
				icon
				size="small"
				color="primary"
			>
				<v-icon>mdi-plus</v-icon>
				<AddWorkout />
			</v-btn>
		</div>

		<NotificationToast
			v-if="snackbar"
			:timeout="2000"
			text="Add workouts"
			@close="snackbar = false"
		/>
	</v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ListWorkouts from '@/components/AllView/ListWorkouts.vue'
import ListByTypes from '@/components/AllView/ListByTypes.vue'
import NotificationToast from '@/components/shared/NotificationToast.vue'
import AddWorkout from '@/components/pop-ups/AddWorkout.vue'
import { useStoreWorkouts } from '@/stores/storeWorkouts'
import { useStoreApp } from '@/stores/storeApp'

const storeApp = useStoreApp()
const storeWorkouts = useStoreWorkouts()

const snackbar = ref(false)

onMounted(() => {
	snackbar.value = Object.keys(storeWorkouts.allWorkouts).length < 1
})
</script>

<style scoped>
.floating-button {
	position: fixed;
	bottom: 75px;
	left: 50%;
	z-index: 10;
	pointer-events: none;
	transform: translate(-25%, 0%);
}
</style>
