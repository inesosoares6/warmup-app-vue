<template>
	<v-dialog
		v-model="addMeasurement"
		activator="parent"
	>
		<v-card>
			<v-card-title>Add Measurement</v-card-title>
			<v-card-text>
				<v-form ref="form">
					<v-row>
						<v-col>
							<v-select
								v-model="measurement.name"
								:items="getTypes()"
								:rules="[v => !!v || 'Item is required']"
								label="Type"
								required
								hide-details
							/>
						</v-col>
						<v-col cols="4">
							<v-select
								v-model="measurement.unit"
								:items="getItems()"
								:rules="[v => !!v || 'Item is required']"
								label="Unit"
								required
							/>
						</v-col>
					</v-row>
					<v-row v-if="measurement.unit">
						<v-col>
							<v-text-field
								v-model="measurement.value[0]"
								:rules="[v => !!v || 'Field is required']"
								:suffix="measurement.unit"
								label="Value"
								type="number"
								required
							/>
						</v-col>
						<v-col cols="4">
							<v-text-field
								v-model="measurement.target"
								label="Target"
								:suffix="measurement.unit"
								type="number"
								required
							/>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn
					color="secondary"
					@click="addRecord"
					:disabled="
						!(measurement.name && measurement.unit && measurement.value[0])
					"
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
const addMeasurement = ref(false)

const clearMeasurement = () => {
	return {
		name: '',
		value: [''],
		unit: '',
		target: '',
		date: ['']
	}
}

const measurement = ref(clearMeasurement())

const addRecord = () => {
	let date = new Date().toString().split(' ')
	measurement.value.date = [date[2] + ' ' + date[1] + ' ' + date[3]]
	if (!measurement.value.target)
		measurement.value.target = measurement.value.value[0]
	storeUser.addMeasurement({
		id: uuidv4(),
		measurement: measurement.value
	})
	measurement.value = clearMeasurement()
	addMeasurement.value = false
}

const getItems = () => {
	if (measurement.value.name === 'Weight') {
		measurement.value.unit = 'kg'
		return ['kg']
	} else {
		return ['%', 'kg']
	}
}

const getTypes = () => {
	let types = ['Weight', 'Body Fat', 'Muscle Mass']
	if (Object.keys(storeUser.measurements).length === 0) return types
	Object.values(storeUser.measurements).forEach(record => {
		const index = types.indexOf(record.name)
		if (index > -1) {
			types.splice(index, 1)
		}
	})
	return types
}
</script>

<style scoped>
.v-card-title {
	margin-top: 10px;
}

.v-text-field :deep(input::-webkit-outer-spin-button),
.v-text-field :deep(input::-webkit-inner-spin-button) {
	appearance: none !important;
	-webkit-appearance: none !important;
	-moz-appearance: none !important;
}
</style>
