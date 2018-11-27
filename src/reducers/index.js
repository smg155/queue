import { combineReducers } from 'redux'
import activeStaff from './activeStaff'
import courses from './courses'
import questions from './questions'
import queues from './queues'
import users from './users'
import user from './user'
import app from './app'

const Reducer = combineReducers({
  activeStaff,
  courses,
  questions,
  queues,
  users,
  user,
  app,
})

export default Reducer
