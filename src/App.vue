<template>
	<v-app>
		<BottomToolbar />
		<TopToolbar @toggle-theme="toggleTheme" />
		<v-main>
			<router-view v-slot="{ Component, route }">
				<component
					:is="Component"
					:key="route.path"
				/>
			</router-view>
		</v-main>
	</v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopToolbar from '@/components/TopToolbar.vue'
import BottomToolbar from '@/components/BottomToolbar.vue'
import { useStoreWorkouts } from '@/stores/storeWorkouts'
import { useStoreUser } from '@/stores/storeUser'
import { useStoreApp } from '@/stores/storeApp'
import { useStoreTimer } from '@/stores/storeTimer'
import { useTheme } from 'vuetify'

const storeApp = useStoreApp()
const storeWorkouts = useStoreWorkouts()
const storeUser = useStoreUser()
const storeTimer = useStoreTimer()
const theme = ref(useTheme())

onMounted(() => {
	storeApp.init()
	storeWorkouts.init()
	storeUser.init()
	storeTimer.init()

	if (localStorage.getItem('themeString')) {
		theme.value.global.name = localStorage.getItem('themeString')
	}
})

const toggleTheme = newTheme => {
	theme.value.global.name = newTheme.toString()
	localStorage.setItem('themeString', newTheme)
}
</script>
