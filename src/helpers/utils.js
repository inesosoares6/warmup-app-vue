export const isWOD = workoutType => {
	return !(
		workoutType === 'Mobilidade' ||
		workoutType === 'CORE' ||
		workoutType === 'Plano Be 2020'
	)
}
