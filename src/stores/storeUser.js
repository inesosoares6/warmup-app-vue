import { defineStore } from 'pinia'

export const useStoreUser = defineStore('storeUser', {
	state: () => {
		return {
			personalRecords: {},
			measurements: {},
			objectives: {}
		}
	},
	getters: {
		getObjectivesSorted: state => {
			let objectivesSorted = {},
				keysOrdered = Object.keys(state.objectives)

			keysOrdered.sort((a, b) => {
				let productAProp = new Date(state.objectives[a]['dateDone']).getTime(),
					productBProp = new Date(state.objectives[b]['dateDone']).getTime()
				return productAProp - productBProp
			})

			keysOrdered.forEach(key => {
				objectivesSorted[key] = state.objectives[key]
			})

			return objectivesSorted
		}
	},
	actions: {
		init() {
			if (localStorage.getItem('personalRecords'))
				this.personalRecords = JSON.parse(
					localStorage.getItem('personalRecords')
				)
			if (localStorage.getItem('measurements'))
				this.measurements = JSON.parse(localStorage.getItem('measurements'))
			if (localStorage.getItem('objectives'))
				this.objectives = JSON.parse(localStorage.getItem('objectives'))
		},

		addPR(payload) {
			this.personalRecords[payload.id] = payload.record
			this.writeInDB(1)
		},

		addMeasurement(payload) {
			this.measurements[payload.id] = payload.measurement
			this.writeInDB(2)
		},

		addObjective(payload) {
			this.objectives[payload.id] = payload.objective
			this.writeInDB(3)
		},

		deletePR(id, lastEntry) {
			if (lastEntry) {
				this.personalRecords[id].value.pop()
			} else {
				delete this.personalRecords[id]
			}
			this.writeInDB(1)
		},

		deleteMeasurement(id, lastEntry) {
			if (lastEntry) {
				this.measurements[id].value.pop()
			} else {
				delete this.measurements[id]
			}
			this.writeInDB(2)
		},

		deleteObjective(id) {
			delete this.objectives[id]
			this.writeInDB(3)
		},

		updateValue(variableName, payload) {
			if (variableName === 'measurement') this.updateMeasurement(payload)
			else this.updatePR(payload)
		},

		updateMeasurement(payload) {
			Object.assign(this.measurements[payload.id], payload.updates)
			this.writeInDB(2)
		},

		updatePR(payload) {
			Object.assign(this.personalRecords[payload.id], payload.updates)
			this.writeInDB(1)
		},

		updateObjective(id) {
			this.objectives[id].done = !this.objectives[id].done
			this.objectives[id].dateDone = this.objectives[id].done ? new Date() : 0
			this.writeInDB(3)
		},

		deleteAllCache() {
			this.personalRecords = {}
			this.measurements = {}
			this.objectives = {}
			for (let i = 1; i <= 3; i++) {
				this.writeInDB(i)
			}
		},

		writeInDB(mode) {
			switch (mode) {
				case 1:
					localStorage.setItem(
						'personalRecords',
						JSON.stringify(this.personalRecords)
					)
					break
				case 2:
					localStorage.setItem(
						'measurements',
						JSON.stringify(this.measurements)
					)
					break
				case 3:
					localStorage.setItem('objectives', JSON.stringify(this.objectives))
					break
			}
		}
	}
})
