<template>
	<v-dialog
		v-model="editPersonalRecord"
		activator="parent"
	>
		<v-card :title="personalValue.name">
			<template v-slot:prepend>
				<v-icon
					v-if="input === 'measurement'"
					size="small"
					color="secondary"
				>
					mdi-scale-bathroom
				</v-icon>
				<v-icon
					v-else
					size="small"
					color="secondary"
				>
					mdi-clipboard-text
				</v-icon>
			</template>
			<v-card-text>
				<v-row>
					<v-col>
						<v-text-field
							v-model="newValue"
							label="New value"
							type="number"
							:suffix="personalValue.unit ?? 'kg'"
						/>
					</v-col>
					<v-col>
						<v-text-field
							v-model="newTargetValue"
							:label="input === 'measurement' ? 'New target' : 'Reps'"
							:suffix="input === 'measurement' ? personalValue.unit : ''"
							type="number"
						/>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card
				v-if="input === 'measurement'"
				width="85%"
				style="margin: auto"
			>
				<CardGraphs
					:personalValue="personalValue"
					:input="input"
					:color="color"
				/>
			</v-card>
			<v-card
				v-else
				width="95%"
				style="margin: auto"
			>
				<v-tabs
					v-model="tab"
					color="secondary"
					align-tabs="center"
				>
					<v-tab :value="1">
						RM &nbsp;
						<v-icon>mdi-chart-timeline-variant</v-icon>
					</v-tab>
					<v-tab :value="2">RM &nbsp;%</v-tab>
					<v-tab :value="3">
						Log &nbsp;
						<v-icon>mdi-history</v-icon>
					</v-tab>
				</v-tabs>
				<v-window v-model="tab">
					<v-window-item :value="1">
						<v-container fluid>
							<CardGraphs
								:personalValue="personalValue"
								:input="input"
								:color="color"
							/>
						</v-container>
					</v-window-item>
					<v-window-item :value="2">
						<v-container fluid>
							<TableRM
								:personalValue="personalValue"
								:headerArray="[100, 90, 80, 70, 60]"
							/>
							<v-divider />
							<TableRM
								:personalValue="personalValue"
								:headerArray="[50, 40, 30, 20, 10]"
							/>
						</v-container>
					</v-window-item>
					<v-window-item :value="3">
						<v-container fluid>
							<TableLog :personalValue="personalValue" />
						</v-container>
					</v-window-item>
				</v-window>
			</v-card>
			<v-card-actions>
				<v-btn
					color="error"
					@click="deleteRecord(true)"
					:disabled="!personalValue.value"
				>
					Delete Last Entry
				</v-btn>
				<v-spacer />
				<v-btn
					color="secondary"
					@click="updateRecord"
					:disabled="!(newValue && newTargetValue)"
				>
					Update
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CardGraphs from '@/components/PersonalView/pop-ups/CardGraphs.vue'
import TableRM from '@/components/PersonalView/shared/TableRM.vue'
import TableLog from '@/components/PersonalView/shared/TableLog.vue'
import { useStoreUser } from '@/stores/storeUser'

const storeUser = useStoreUser()
const props = defineProps(['personalValue', 'input', 'color', 'id'])
const tab = ref(null)

onMounted(() => {
	personalValueEdited.value = { ...props.personalValue }
})

const editPersonalRecord = ref(false)
const personalValueEdited = ref({})
const newValue = ref(null)
const newTargetValue = ref(null)

const deleteRecord = lastEntry => {
	if (props.input === 'measurement') {
		storeUser.deleteMeasurement(props.id, lastEntry)
	} else {
		storeUser.deletePR(props.id, lastEntry)
	}
}

const updateRecord = () => {
	personalValueEdited.value.value.push(newValue.value)
	let date = new Date().toString().split(' ')
	personalValueEdited.value.date.push(date[2] + ' ' + date[1] + ' ' + date[3])
	if (props.input === 'measurement')
		personalValueEdited.value.target = newTargetValue.value
	else personalValueEdited.value.reps.push(newTargetValue.value)

	storeUser.updateValue(props.input, {
		id: props.id,
		updates: personalValueEdited.value
	})
	newValue.value = null
	newTargetValue.value = null
	editPersonalRecord.value = false
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
