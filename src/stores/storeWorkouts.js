import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { isWOD } from '@/helpers/utils'

export const useStoreWorkouts = defineStore('storeWorkouts', {
	state: () => {
		return {
			allWorkouts: {},
			currentWorkoutId: ''
		}
	},
	getters: {
		getCurrentWorkout: state => {
			return state.allWorkouts[state.currentWorkoutId]
		},

		getWODs: state => {
			let result = {}
			Object.keys(state.allWorkouts).forEach(key => {
				let workout = state.allWorkouts[key]
				if (isWOD(workout.type)) {
					result[key] = workout
				}
			})
			return result
		},

		getTypes: state => {
			let types = []
			Object.keys(state.allWorkouts).forEach(key => {
				let workout = state.allWorkouts[key]
				if (!types.some(e => e === workout.type)) {
					types.push(workout.type)
				}
			})
			return types
		},

		getWorkoutSummary: state => {
			let summary = {
				done: 0,
				todo: 0,
				types: []
			}
			Object.keys(state.allWorkouts).forEach(key => {
				let workout = state.allWorkouts[key]
				if (!isWOD(workout.type)) return
				if (workout.completions === 0) {
					summary.todo++
				} else {
					summary.done += workout.completions

					if (summary.types.some(e => e.type === workout.type)) {
						let index = summary.types.findIndex(object => {
							return object.type === workout.type
						})
						summary.types[index].value += workout.completions
						if (summary.types[index].value === 0) {
							summary.types.splice(index, 1)
						}
					} else {
						summary.types = [
							...summary.types,
							{ type: workout.type, value: workout.completions }
						]
					}
				}
			})
			return summary
		}
	},
	actions: {
		async init() {
			if (localStorage.getItem('allWorkouts'))
				this.allWorkouts = JSON.parse(localStorage.getItem('allWorkouts'))

			if (localStorage.getItem('currentWorkoutId'))
				this.currentWorkoutId = JSON.parse(
					localStorage.getItem('currentWorkoutId')
				)
		},

		addWorkout(payload) {
			this.allWorkouts[payload.id] = payload.workout
			this.writeInDB()
		},

		deleteWorkout(id) {
			delete this.allWorkouts[id]
			this.writeInDB()
		},

		updateWorkout(payload) {
			Object.assign(this.allWorkouts[payload.id], payload.updates)
			this.writeInDB()
		},

		importWorkouts(workouts) {
			Object.values(workouts).forEach(item => {
				this.addWorkout({ id: uuidv4(), workout: item })
			})
			this.writeInDB()
		},

		selectWorkout(id) {
			this.currentWorkoutId = id
			localStorage.setItem(
				'currentWorkoutId',
				JSON.stringify(this.currentWorkoutId)
			)
		},

		deleteAllCache() {
			this.allWorkouts = {}
			this.writeInDB()
			this.selectWorkout('')
		},

		writeInDB() {
			localStorage.setItem('allWorkouts', JSON.stringify(this.allWorkouts))
		}
	}
})
