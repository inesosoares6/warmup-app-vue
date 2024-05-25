<template>
	<v-bottom-navigation
		app
		fixed
		grow
		v-model="activeItem"
		color="primary"
	>
		<v-btn
			value="home"
			:to="{ path: '/' }"
		>
			<v-icon>mdi-home</v-icon>
			Home
		</v-btn>

		<v-btn
			value="wod"
			:to="{ name: 'workout-view' }"
		>
			<v-icon>mdi-dumbbell</v-icon>
			WOD
		</v-btn>

		<v-btn
			value="all"
			:to="{ name: 'all-view' }"
		>
			<v-icon>mdi-format-list-bulleted</v-icon>
			All
		</v-btn>

		<v-btn
			value="personal"
			:to="{ name: 'personal-view' }"
		>
			<v-icon>mdi-account</v-icon>
			User
		</v-btn>
	</v-bottom-navigation>
</template>

<script setup>
import { ref } from 'vue'
const activeItem = ref('home')
</script>

<style scoped>
.v-icon {
	font-size: 16px;
	margin-bottom: 5px;
}
</style>
