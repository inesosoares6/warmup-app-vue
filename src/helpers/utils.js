const WODs = ['AFAP', 'WOD', 'I GO U GO', 'EMOM', 'AMRAP']

export const isWOD = workoutType => {
	return WODs.includes(workoutType)
}
