<template>
	<v-dialog
		v-model="previewWorkout"
		activator="parent"
	>
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
			<template v-slot:append>
				<v-btn
					icon
					color="grey"
				>
					<v-icon>mdi-pencil</v-icon>
					<EditWorkout
						v-bind:workout="workout"
						v-bind:id="id"
					/>
				</v-btn>
			</template>
			<v-card-text v-html="workout.exercises.replaceAll('\n', '<br/>')" />
			<v-card-actions>
				<span class="doneText">Done {{ workout.completions }} times!</span>
				<v-spacer />
				<v-btn
					color="secondary"
					@click="selectWorkout"
					:to="{ name: 'workout-view' }"
				>
					Select
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import EditWorkout from '@/components/AllView/pop-ups/EditWorkout.vue'
import { useStoreWorkouts } from '@/stores/storeWorkouts'

const props = defineProps(['workout', 'id'])

const storeWorkouts = useStoreWorkouts()
const previewWorkout = ref(false)

const selectWorkout = () => {
	storeWorkouts.selectWorkout(props.id)
	previewWorkout.value = false
}
</script>

<style scoped>
.doneText {
	color: #ffcc80;
	margin-left: 10px;
}
</style>
