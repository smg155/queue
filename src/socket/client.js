import io from 'socket.io-client'
import {
  replaceQuestions,
  createQuestionSuccess,
  updateQuestionSuccess,
  deleteQuestionSuccess,
} from '../actions/question'
import {
  addQueueStaffSuccess,
  removeQueueStaffSuccess,
  updateQueueSuccess,
} from '../actions/queue'
import { replaceActiveStaff } from '../actions/activeStaff'
import { promptForLogin } from '../actions/app'
import { normalizeActiveStaff } from '../reducers/normalize'
import { baseUrl } from '../util'

const socketOpts = {
  path: `${baseUrl}/socket.io`,
  reconnectionAttempts: 4,
}

const queueSockets = {}

const handleQuestionCreate = (dispatch, queueId, question) => {
  dispatch(createQuestionSuccess(queueId, question))
}

const handleQuestionUpdate = (dispatch, question) => {
  dispatch(updateQuestionSuccess(question.id, question))
}

const handleQuestionDelete = (dispatch, queueId, questionId) => {
  dispatch(deleteQuestionSuccess(queueId, questionId))
}

const handleActiveStaffCreate = (dispatch, queueId, data) => {
  const normalized = normalizeActiveStaff(data)
  const activeStaff = normalized.entities.activeStaff[normalized.result]
  dispatch(addQueueStaffSuccess(queueId, null, activeStaff, normalized))
}

const handleActiveStaffDelete = (dispatch, queueId, id) => {
  dispatch(removeQueueStaffSuccess(queueId, null, id))
}

const handleQueueUpdate = (dispatch, queueId, queue) => {
  dispatch(updateQueueSuccess(queueId, queue))
}

export const connectToQueue = (dispatch, queueId) => {
  const socket = io('/queue', socketOpts)
  queueSockets[queueId] = socket
  socket.on('connect', () => {
    socket.emit('join', { queueId }, ({ questions, activeStaff }) => {
      dispatch(replaceQuestions(queueId, questions))
      dispatch(replaceActiveStaff(queueId, activeStaff))
    })
  })
  socket.on('question:create', ({ question }) =>
    handleQuestionCreate(dispatch, queueId, question)
  )
  socket.on('question:update', ({ question }) =>
    handleQuestionUpdate(dispatch, question)
  )
  socket.on('question:delete', ({ id }) =>
    handleQuestionDelete(dispatch, queueId, id)
  )
  socket.on('activeStaff:create', ({ activeStaff }) =>
    handleActiveStaffCreate(dispatch, queueId, activeStaff)
  )
  socket.on('activeStaff:delete', ({ id }) =>
    handleActiveStaffDelete(dispatch, queueId, id)
  )
  socket.on('queue:update', ({ queue }) =>
    handleQueueUpdate(dispatch, queueId, queue)
  )

  // Error handling: will happen if out Shib session expires
  // See socketOpts above - we'll retry the connection 4 times before bailing
  // and assuming the worst.
  socket.on('reconnect_error', (e) => console.log(e))
  socket.on('reconnect_failed', () => {
    dispatch(promptForLogin())
  })
}

export const disconnectFromQueue = queueId => {
  if (queueId in queueSockets) {
    queueSockets[queueId].close()
    delete queueSockets[queueId]
  }
}
