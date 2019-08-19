const worldDefaultState = {
  isTimerRunning: false,
  planets: []
}

export default (state = worldDefaultState, action) => {
  switch (action.type) {
    case 'STORE_PLANETS':
      const { planets } = action.payload

      return { ...state, planets }
    case 'SET_TIMER_RUNNING':
      const { isTimerRunning } = action.payload

      return { ...state, isTimerRunning }
    default:
      return state
  }
}
