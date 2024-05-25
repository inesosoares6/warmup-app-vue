export const getRM = (personalValue, percentage, index) => {
	return Math.round(
		((personalValue.value.at(index) /
			(1.0278 - 0.0278 * personalValue.reps.at(index))) *
			percentage) /
			100
	)
}

export const getRMEvolution = personalValue => {
	let evolution = []
	personalValue.value.forEach((_item, index) => {
		evolution.push(getRM(personalValue, 100, index))
	})
	return evolution
}
