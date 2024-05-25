<template>
	<div
		class="timer-text"
		justify="center"
	>
		<span>{{ time.minutes }}</span>
		&nbsp;:&nbsp;
		<span>{{ time.seconds }}</span>
	</div>
</template>

<script setup>
defineProps(['time'])
</script>

<style scoped>
.timer-text {
	padding: 10px 10px 10px 10px;
	text-align: center;
	font-size: 40px;
}
</style>
