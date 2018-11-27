import { PROMPT_FOR_LOGIN } from '../constants/ActionTypes'

const defaultState = {
  showLoginPrompt: false,
}

const app = (state = defaultState, action) => {
  switch (action.type) {
    case PROMPT_FOR_LOGIN:
    return {
      ...state,
      showLoginPrompt: true,
    }
    default:
    return state
  }
}

export default app
