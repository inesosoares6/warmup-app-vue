<template>
	<v-card title="Personal Records">
		<template v-slot:prepend>
			<v-icon
				class="title-icon"
				color="secondary"
			>
				mdi-clipboard-text
			</v-icon>
		</template>
		<template v-slot:append>
			<v-btn
				icon
				color="transparent"
				size="35"
				flat
			>
				<v-icon size="small">mdi-plus</v-icon>
				<AddPersonalRecord />
			</v-btn>
		</template>
		<v-divider />
		<v-card-text>
			<v-list>
				<v-list-item
					v-for="(record, index) in storeUser.personalRecords"
					:key="index"
					:value="record"
					:title="
						record.name +
						': ' +
						record.value.at(-1) +
						' kg - ' +
						record.reps.at(-1) +
						' reps'
					"
					rounded="xl"
				>
					<template v-slot:prepend>
						<v-avatar
							size="25"
							:color="getColor(record, true)"
						>
							<v-icon size="small">mdi-dumbbell</v-icon>
						</v-avatar>
					</template>
					<template v-slot:append>
						<v-btn
							@click="storeUser.deletePR(index, false)"
							size="small"
							icon
							flat
						>
							<v-icon color="red">mdi-delete</v-icon>
						</v-btn>
					</template>
					<EditPersonalValue
						:personalValue="record"
						:id="index"
						:input="'record'"
						:color="getColor(record, false)"
					/>
				</v-list-item>
			</v-list>
		</v-card-text>
	</v-card>
</template>

<script setup>
import { useStoreUser } from '@/stores/storeUser'
import { getRM } from '@/helpers/math.js'
import AddPersonalRecord from '@/components/PersonalView/pop-ups/AddPersonalRecord.vue'
import EditPersonalValue from '@/components/PersonalView/pop-ups/EditPersonalValue.vue'

const storeUser = useStoreUser()

const getColor = (array, avatar) => {
	if (array.value.length === 1) return avatar ? 'secondary' : ['#03dac5']
	return getRM(array, 100, -1) > getRM(array, 100, -2)
		? avatar
			? 'secondary'
			: ['#03dac5']
		: avatar
		? 'error'
		: ['#ffcc80']
}
</script>
