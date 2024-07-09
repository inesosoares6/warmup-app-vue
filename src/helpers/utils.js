import { FileSharer } from '@byteowls/capacitor-filesharer'

const WODs = ['AFAP', 'WOD', 'I GO U GO', 'EMOM', 'AMRAP']

export const isWOD = workoutType => {
	return WODs.includes(workoutType)
}

export const formatDate = date => {
	return date
		.toLocaleString('pt-PT', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		})
		.replaceAll('/', '-')
}

export const shareFile = async (name, data) => {
	const fileName = name + '.json'
	FileSharer.share({
		filename: fileName,
		contentType: 'application/json',
		base64Data: btoa(JSON.stringify(data, null, 4))
	}).catch(error => {
		alert(error.message)
	})
}

export const formatData = list => {
	const tmp = []
	Object.keys(list).forEach(key => {
		const item = list[key]
		tmp.push({ ...item, id: key })
	})
	return tmp
}
