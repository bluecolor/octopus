
import api from '../../api/task-instances'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const CLEAR = 'CLEAR'
const UPDATE = 'UPDATE'
const REMOVE = 'REMOVE'
const SET_STATS = 'SET_STATS'

const state = {
  all: [],
  meta: {},
  loading: false,
  stats: {
    error: [],
    running: []
  }
}

const getters = {
  taskInstances: state => state,
  loading: state => state.loading,
  stats: state => state.stats
}

const actions = {
  findByStatus ({commit}, payload) {
    api.findByStatus(payload).then(response => {
      commit(SET_STATS, response.data)
    },
    error => {
      console.log(error.response.data.message)
      notifyError(`Unable to find stats ${error.response.data.message}`)
    })
  },
  findAll ({commit}, payload) {
    commit(CLEAR)
    api.findAll(payload).then(response => {
      commit(LOAD, response.data)
    })
  },
  done ({commit}, id) {
    api.done(id).then(response => {
      commit(UPDATE, response.data)
      notifySuccess('Updated task')
    },
    error => {
      notifyError(`Failed to update task ${error.response.data.message}`)
    })
  },
  remove ({commit}, id) {
    api.remove(id).then(response => {
      commit(REMOVE, response.data)
      notifySuccess('Deleted task')
    },
    error => {
      notifyError(`Failed to delete task ${error.response.data.message}`)
    })
  },
  start ({commit}, id) {
    api.start(id).then(response => {
      commit(UPDATE, response.data)
      notifySuccess('Updated task')
    },
    error => {
      notifyError(`Failed to update task ${error.response.data.message}`)
    })
  },
  block ({commit}, id) {
    api.block(id).then(response => {
      commit(UPDATE, response.data)
      notifySuccess('Updated task')
    },
    error => {
      notifyError(`Failed to update task ${error.response.data.message}`)
    })
  }
}

const mutations = {
  [LOAD] (state, data) {
    state.loading = false
    state.all = data.content
    state.meta = {
      count: data.count,
      first: data.first,
      last: data.last,
      page: data.last,
      pageSize: data.pageSize,
      totalPages: data.totalPages
    }
  },
  [CLEAR] (state, records) {
    state.loading = true
    state.all = []
  },
  [UPDATE] (state, data) {
    const id = data.id
    const i = _.findIndex(state.all, {id})
    state.all.splice(i, 1)
    state.all.push(data)
  },
  [REMOVE] (state, data) {
    const id = data.id
    const i = _.findIndex(state.all, {id})
    state.all.splice(i, 1)
  },
  [SET_STATS] (state, instances) {
    let running = _.filter(instances, i => i.status === 'RUNNING')
    let error = _.filter(instances, i => i.status === 'ERROR')
    state.stats = {running, error}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
