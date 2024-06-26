<template>
	<v-dialog
		v-model="fileGenerator"
		activator="parent"
	>
		<v-card>
			<ImportExportHeader
				:file="file"
				title="Export"
				@toggle-value="val => (file = val)"
			/>
			<div v-if="file">
				<v-card-subtitle>Download and import in another device</v-card-subtitle>
				<v-card-text class="d-flex justify-center">
					<v-text-field
						v-model="name"
						label="File name"
						required
						hide-details
					/>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn
						color="secondary"
						@click="downloadFile"
					>
						Download
					</v-btn>
				</v-card-actions>
			</div>
			<div v-else>
				<v-card-subtitle>Read QR Code with another device</v-card-subtitle>
				<v-card-text class="d-flex justify-center">
					<div class="border">
						<VueQRCodeComponent
							class="qrcode"
							:text="JSON.stringify(workoutList)"
							:size="200"
						/>
					</div>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn
						color="secondary"
						@click="closeMenu('')"
					>
						Done
					</v-btn>
				</v-card-actions>
			</div>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { ref, onUpdated } from 'vue'
import VueQRCodeComponent from 'vue-qrcode-component'
import ImportExportHeader from '@/components/HomeView/shared/ImportExportHeader.vue'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'

const emit = defineEmits(['close-menu'])
const props = defineProps(['workoutList'])

const fileGenerator = ref(false)
const file = ref(true)
const name = ref('')

onUpdated(() => {
	file.value = Object.keys(props.workoutList).length > 1
})

const closeMenu = fileName => {
	fileGenerator.value = false
	emit('close-menu', fileName)
}

const downloadFile = async () => {
	try {
		const fileName =
			(name.value.length === 0 ? 'Workout' : name.value) + '.json'
		await Filesystem.writeFile({
			path: fileName,
			data: JSON.stringify(props.workoutList, null, 4),
			directory: Directory.Documents,
			encoding: Encoding.UTF8
		})
		closeMenu(fileName)
	} catch (e) {
		alert('Unable to write file', e)
	}
}
</script>

<style>
.border {
	flex: center;
	width: 240px;
	background-color: white;
}

.qrcode {
	padding: 20px 20px 20px 20px;
}
</style>
