<template>
	<v-list lines="two">
		<v-list-item
			v-for="(workout, key) in props.list"
			:key="key"
			:value="workout"
			:title="workout.name"
			:subtitle="workout.type + ' - ' + workout.time + ' min'"
			rounded="xl"
		>
			<PreviewWorkout
				:workout="workout"
				:id="key"
			/>

			<template v-slot:prepend>
				<v-avatar :color="workout.completions > 0 ? 'secondary' : 'error'">
					<v-icon>mdi-dumbbell</v-icon>
				</v-avatar>
			</template>
			<template v-slot:append>
				<v-btn
					flat
					round
					icon
					@click="storeWorkouts.deleteWorkout(key)"
				>
					<v-icon color="red">mdi-delete</v-icon>
				</v-btn>
			</template>
		</v-list-item>
	</v-list>
</template>

<script setup>
import PreviewWorkout from '@/components/AllView/pop-ups/PreviewWorkout.vue'
import { useStoreWorkouts } from '@/stores/storeWorkouts'

const storeWorkouts = useStoreWorkouts()
const props = defineProps(['list'])
</script>
