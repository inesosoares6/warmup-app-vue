<template>
	<v-card title="Week Overview">
		<template v-slot:prepend>
			<v-icon
				class="title-icon"
				color="secondary"
			>
				mdi-checkbox-marked-circle-outline
			</v-icon>
		</template>

		<v-btn
			class="print-button"
			icon
			flat
			size="small"
		>
			<v-icon color="secondary">mdi-format-list-bulleted</v-icon>
			<WeeklyReport />
		</v-btn>

		<v-card-text class="pa-0 ml-3 mr-3 mb-3">
			<v-timeline
				direction="horizontal"
				line-inset="8"
				truncate-line="both"
			>
				<v-timeline-item
					v-for="(item, index) in timeline"
					size="x-small"
					:key="index"
					:dot-color="timeline[index].color"
					@click="handleTimelineItemClick(item)"
				>
					<template v-if="index % 2 !== 0">
						{{ item.day.substring(0, 3) }}
					</template>
					<template
						v-if="index % 2 === 0"
						v-slot:opposite
					>
						{{ item.day.substring(0, 3) }}
					</template>
				</v-timeline-item>
			</v-timeline>
		</v-card-text>
	</v-card>

	<DailyReport
		v-if="showWorkoutDone"
		:selectedDay="selectedDay"
	/>
</template>

<script setup>
import { ref, computed } from 'vue'
import WeeklyReport from '@/components/HomeView/pop-ups/WeeklyReport.vue'
import DailyReport from '@/components/HomeView/pop-ups/DailyReport.vue'
import { useStoreApp } from '@/stores/storeApp'

const selectedDay = ref('')
const showWorkoutDone = ref(false)

const storeApp = useStoreApp()
const timeline = computed(() => storeApp.timeline)

const handleTimelineItemClick = item => {
	showWorkoutDone.value = true
	selectedDay.value = item
}
</script>

<style>
.print-button {
	position: absolute;
	top: 10px;
	right: 10px;
}

.workouts-done-card {
	max-height: 600px;
	overflow-y: auto;
}
</style>
