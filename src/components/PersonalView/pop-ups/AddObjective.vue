<template>
	<v-dialog
		v-model="addObjectiveModal"
		activator="parent"
	>
		<v-card>
			<v-card-title>Add Objective</v-card-title>
			<v-card-text>
				<v-form ref="form">
					<v-text-field
						v-model="objective.text"
						:rules="[v => !!v || 'Field is required']"
						label="Objective"
						required
						autofocus
					/>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn
					color="secondary"
					@click="addObjective"
					:disabled="!objective.text"
				>
					Add
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useStoreUser } from '@/stores/storeUser'

const storeUser = useStoreUser()
const addObjectiveModal = ref(false)

const clearObjective = () => {
	return {
		text: '',
		date: 0,
		dateDone: 0,
		done: false
	}
}

const objective = ref(clearObjective())

const addObjective = () => {
	objective.value.date = new Date()
	storeUser.addObjective({
		id: uuidv4(),
		objective: objective.value
	})
	objective.value = clearObjective()
	addObjectiveModal.value = false
}
</script>

<style scoped>
.v-card-title {
	margin-top: 10px;
}
</style>
