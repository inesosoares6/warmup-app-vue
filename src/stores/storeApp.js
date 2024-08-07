import { defineStore } from 'pinia'
import { useStoreTimer } from '@/stores/storeTimer'
import { useStoreUser } from '@/stores/storeUser'
import { useStoreWorkouts } from '@/stores/storeWorkouts'
import { shareFile, formatDate, formatData } from '@/helpers/utils'

export const useStoreApp = defineStore('storeApp', {
	state: () => {
		return {
			timeline: [],
			weekNumber: 0,
			groupByType: false
		}
	},
	getters: {},
	actions: {
		init() {
			if (localStorage.getItem('timeline'))
				this.timeline = JSON.parse(localStorage.getItem('timeline'))
			else this.timeline = this.clearTimeline()
			if (localStorage.getItem('weekNumber'))
				this.weekNumber = localStorage.getItem('weekNumber')
			if (localStorage.getItem('groupByType'))
				this.groupByType =
					localStorage.getItem('groupByType') === 'true' ? true : false
			this.updateWeek()
		},

		clearTimeline() {
			return [
				{
					day: 'Monday',
					color: 'error',
					workoutsId: []
				},
				{
					day: 'Tuesday',
					color: 'error',
					workoutsId: []
				},
				{
					day: 'Wednesday',
					color: 'error',
					workoutsId: []
				},
				{
					day: 'Thursday',
					color: 'error',
					workoutsId: []
				},
				{
					day: 'Friday',
					color: 'error',
					workoutsId: []
				},
				{
					day: 'Saturday',
					color: 'error',
					workoutsId: []
				},
				{
					day: 'Sunday',
					color: 'error',
					workoutsId: []
				}
			]
		},

		groupByTypeFunction(value) {
			this.groupByType = value
			localStorage.setItem('groupByType', JSON.stringify(this.groupByType))
		},

		updateTimeline(day, workoutId) {
			this.timeline.forEach(item => {
				if (item.day.substring(0, 3) === day) {
					item.color = 'secondary'
					item.workoutsId.push(workoutId)
				}
			})
			localStorage.setItem('timeline', JSON.stringify(this.timeline))
		},

		updateWeek() {
			const currentDate = new Date()
			const startDate = new Date(currentDate.getFullYear(), 0, 1)
			const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000))
			const nextWeekNumber = Math.ceil(days / 7)
			if (
				this.weekNumber != nextWeekNumber &&
				currentDate.toString().split(' ')[0] !== 'Sun'
			) {
				this.timeline = this.clearTimeline()
				this.weekNumber = nextWeekNumber
				localStorage.setItem('timeline', JSON.stringify(this.timeline))
				localStorage.setItem('weekNumber', JSON.stringify(this.weekNumber))
			}
		},

		deleteAllCache() {
			this.groupByTypeFunction(false)
			this.timeline = this.clearTimeline()
			localStorage.setItem('timeline', JSON.stringify(this.timeline))
			this.weekNumber = 0
			localStorage.setItem('weekNumber', JSON.stringify(this.weekNumber))

			const storeTimer = useStoreTimer()
			const storeUser = useStoreUser()
			const storeWorkouts = useStoreWorkouts()

			storeTimer.deleteAllCache()
			storeUser.deleteAllCache()
			storeWorkouts.deleteAllCache()
		},

		async saveUserData() {
			const storeUser = useStoreUser()

			const data = {
				personalRecords: formatData(storeUser.personalRecords),
				measurements: formatData(storeUser.measurements),
				objectives: formatData(storeUser.objectives)
			}

			shareFile(`UserData-${formatDate(new Date())}`, data)
		}
	}
})
