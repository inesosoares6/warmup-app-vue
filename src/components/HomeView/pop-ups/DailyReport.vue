<template>
	<v-dialog
		v-model="showWorkoutDone"
		activator="parent"
	>
		<v-card
			class="workouts-done-card"
			:title="selectedDay.day + ' Workouts'"
			style="overflow-y: auto"
		>
			<template v-slot:prepend>
				<v-icon
					class="title-icon"
					color="secondary"
				>
					mdi-history
				</v-icon>
			</template>
			<v-divider thickness="0px" />
			<div class="scroll-view">
				<div
					v-for="(workout, index) in getWorkoutsDone()"
					:key="index"
					width="95%"
				>
					<v-divider />
					<v-card
						:title="workout.name"
						:subtitle="workout.type + ' - ' + workout.time + ' min'"
					>
						<template v-slot:prepend>
							<v-icon
								size="small"
								color="secondary"
							>
								mdi-weight-lifter
							</v-icon>
						</template>
						<v-card-text
							style="text-align: center"
							v-html="workout.exercises.replaceAll('\n', '<br/>')"
						/>
					</v-card>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useStoreWorkouts } from '@/stores/storeWorkouts'

const storeWorkouts = useStoreWorkouts()
const props = defineProps(['selectedDay'])

const showWorkoutDone = ref(false)

const getWorkoutsDone = () => {
	let workoutsList = []
	props.selectedDay.workoutsId.forEach(id => {
		workoutsList.push(storeWorkouts.allWorkouts[id])
	})
	return workoutsList
}
</script>
<style>
.scroll-view {
	max-height: 500px;
	overflow-y: auto;
}
</style>
