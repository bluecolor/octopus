
import api from '../../api/task-instances'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const CLEAR = 'CLEAR'
const UPDATE = 'UPDATE'

const state = {
  all: [],
  meta: {}
}

const getters = {
  taskInstances: state => state
}

const actions = {
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
    state.all = []
  },
  [UPDATE] (state, data) {
    const id = data.id
    const i = _.findIndex(state.all, {id})
    state.all.splice(i, 1)
    state.all.push(data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
