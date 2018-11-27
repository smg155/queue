import { makeActionCreator } from './util'
import * as types from '../constants/ActionTypes'

// eslint-disable-next-line import/prefer-default-export
export const promptForLogin = makeActionCreator(types.PROMPT_FOR_LOGIN)
