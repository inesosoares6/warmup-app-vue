<template>
	<v-btn
		v-for="(button, index) in buttons"
		:key="index"
		class="stopwatch-btns"
		size="x-small"
		color="grey"
		icon
		@click="$emit(button)"
	>
		<v-icon>{{ button === 'reload' ? `mdi-${button}` : buttonIcon }}</v-icon>
	</v-btn>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	isRunning: {
		type: Boolean,
		required: true
	}
})
const buttons = computed(() =>
	props.isRunning ? ['pause', 'reload'] : ['play', 'reload']
)

const buttonIcon = computed(() => (props.isRunning ? 'mdi-pause' : 'mdi-play'))

defineEmits(['play', 'pause', 'reload'])
</script>

<style scoped>
.stopwatch-btns {
	margin-left: 5px;
	margin-right: 5px;
	margin-bottom: 10px;
}
</style>
