<template>
	<v-card-title>Evolution</v-card-title>
	<v-card-subtitle>
		{{ personalValue.date.at(0) }} - {{ personalValue.date.at(-1) }}
	</v-card-subtitle>
	<VueApexCharts
		type="line"
		:options="
			input === 'measurement'
				? chartOptionsWithTarget
				: Object.keys(personalValue.value).length === 1
				? chartOptionsWithoutTarget
				: chartOptions
		"
		:series="series"
		width="100%"
		height="70px"
		style="margin-top: 15px"
	/>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getRMEvolution } from '@/helpers/math.js'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps(['personalValue', 'input', 'color'])

const getMinMax = (value, target) => {
	const max = Math.max(...[Math.max(...[...value, target])])
	const min = Math.min(...[Math.min(...[...value, target])])
	return min === max ? [min - 10, max + 10] : [min, max]
}

const series = ref([
	{
		name: props.personalValue.name,
		data:
			props.input === 'measurement'
				? props.personalValue.value
				: getRMEvolution(props.personalValue)
	}
])

const chartOptions = ref({
	chart: {
		id: 'records-evolution',
		group: 'sparks',
		type: 'line',
		sparkline: {
			enabled: true
		},
		zoom: {
			enabled: false
		},
		toolbar: {
			show: false
		}
	},
	colors: props.color,
	tooltip: {
		theme: 'dark'
	},
	stroke: {
		curve: 'smooth'
	},
	grid: {
		padding: {
			top: 10,
			bottom: 10,
			left: 10,
			right: 10
		}
	},
	xaxis: {
		categories: props.personalValue.date
	},
	dataLabels: {
		enabled: false
	},
	markers: {
		size: 6,
		strokeWidth: 0,
		hover: {
			size: 9
		}
	}
})

const chartOptionsWithoutTarget = ref({
	yaxis: {
		min: getMinMax(props.personalValue.value, props.personalValue.value)[0],
		max: getMinMax(props.personalValue.value, props.personalValue.value)[1]
	},
	...chartOptions.value
})

const chartOptionsWithTarget = ref({
	annotations: {
		yaxis: [
			{
				y: props.personalValue.target,
				borderColor: '#AFADAD'
			}
		]
	},
	yaxis: {
		min: getMinMax(props.personalValue.value, props.personalValue.target)[0],
		max: getMinMax(props.personalValue.value, props.personalValue.target)[1]
	},
	...chartOptions.value
})

watch(
	() => [props.color, props.personalValue],
	() => {
		if (props.input === 'measurement') {
			chartOptionsWithTarget.value.colors = props.color
		} else {
			chartOptions.value.colors = props.color
		}
	}
)
</script>
