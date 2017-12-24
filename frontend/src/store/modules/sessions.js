
import store from '../'
import api from '../../api/sessions'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD_SESSIONS = 'LOAD_SESSIONS'
const LOAD_PLAN_RUNS = 'LOAD_PLAN_RUNS'
const DELETE_SESSIONS = 'DELETE_SESSIONS'
const DELETE_SESSION = 'DELETE_SESSION'
const RESET_SESSIONS = 'RESET_SESSIONS'
const SET_SESSION_STATUS = 'SET_SESSION_STATUS'
const DELETE_LOAD_PLAN_RUN = 'DELETE_LOAD_PLAN_RUN'

const state = {
  sessions: [],
  loadPlanRuns: []
}

const getters = {
  sessions: state => state.sessions,
  loadPlanRuns: state => state.loadPlanRuns
}

// actions
const actions = {
  deleteLoadPlanRun ({commit}, id) {
    const connectionId = store.state.connectionId
    api.deleteLoadPlanRun(connectionId, id).then(response => {
      notifySuccess('Deleted load plan run')
      commit(DELETE_LOAD_PLAN_RUN, id)
    },
    error => {
      console.log(error)
      notifyError('Unable delete load plan run!')
    })
  },
  findLoadPlanRuns ({commit}) {
    const connectionId = store.state.connectionId
    api.findLoadPlanRuns(connectionId).then(response => {
      commit(LOAD_PLAN_RUNS, response.data)
    },
    error => {
      console.log(error)
      notifyError('Unable to load plan runs')
    })
  },
  findSessions ({commit}) {
    const connectionId = store.state.connectionId
    api.findByCriteria(connectionId, {name: '*'}).then(response => {
      commit(LOAD_SESSIONS, response.data)
    },
    error => {
      console.log(error)
      notifyError('Unable to load sessions')
    })
  },
  findSessionsByCriteria ({commit}, payload) {
    commit(RESET_SESSIONS)
    api.findByCriteria(payload.id, payload.criteria).then(response => {
      commit(LOAD_SESSIONS, response.data)
    })
  },
  deleteSessions ({commit}, payload) {
    api.deleteSessions(payload.id, payload.data).then(response => {
      commit(DELETE_SESSIONS, response.data)
    })
  },
  deleteSession ({commit}, payload) {
    api.deleteSession(payload.connectionId, payload.sessionId).then(response => {
      commit(DELETE_SESSION, response.data)
    })
  },
  setStatus ({commit}, payload) {
    const connectionId = store.state.connectionId
    api.setStatus(connectionId, payload.sessionId, payload.status).then(response => {
      commit(SET_SESSION_STATUS, response.data)
      notifySuccess('Updated session')
    },
    error => {
      console.log(error)
      notifyError('Unable to update session')
    })
  }
}

const mutations = {
  [RESET_SESSIONS] (state) {
    state.sessions = []
  },
  [LOAD_SESSIONS] (state, records) {
    state.sessions = records
  },
  [DELETE_SESSIONS] (state, ids) {
    state.sessions = _.filter(state.sessions, r => ids.indexOf(r.id) > -1)
  },
  [DELETE_SESSION] (state, id) {
    state.sessions = _.filter(state.sessions, r => id !== r.id)
  },
  [SET_SESSION_STATUS] (state, session) {
    let s = _.find(state.sessions, {id: session.id})
    s.status = session.status
  },
  [LOAD_PLAN_RUNS] (state, records) {
    state.loadPlanRuns = records
  },
  [DELETE_LOAD_PLAN_RUN] (state, id) {
    state.loadPlanRuns = _.filter(state.loadPlanRuns, r => id !== r.globalId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
