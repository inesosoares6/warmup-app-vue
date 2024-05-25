<template>
	<v-expansion-panels>
		<v-expansion-panel
			v-for="(list, index) in groupWorkoutsByType"
			:key="index"
			:title="index"
		>
			<v-expansion-panel-text>
				<ListWorkouts :list="list" />
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup>
import { computed } from 'vue'
import ListWorkouts from '@/components/AllView/ListWorkouts.vue'
import { useStoreWorkouts } from '@/stores/storeWorkouts'

const storeWorkouts = useStoreWorkouts()

const groupWorkoutsByType = computed(() => {
	const returnList = [...storeWorkouts.getTypes].reduce(
		(item, key) => ({ ...item, [key]: {} }),
		{}
	)
	Object.keys(storeWorkouts.allWorkouts).forEach(key => {
		let item = storeWorkouts.allWorkouts[key]
		returnList[item.type][key] = item
	})
	return returnList
})
</script>
