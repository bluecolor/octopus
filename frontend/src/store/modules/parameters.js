
import api from '../../api/parameters'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const REMOVE = 'REMOVE'
const CREATE = 'CREATE'
const UPDATE = 'UPDATE'

const state = {
  all: []
}

const getters = {
  parameters: state => state.all
}

// actions
const actions = {
  findAll ({ commit }) {
    return api.findAll().then(response => {
      commit(LOAD, response.data)
    })
  },
  remove ({ commit }, payload) {
    return api.remove(payload).then(response => {
      commit(REMOVE, response.data)
      notifySuccess('Deleted parameter')
    },
    error => {
      notifyError(`Failed to delete parameter ${error.response.data.message}`)
    })
  },
  create ({ commit }, payload) {
    return api.create(payload).then(response => {
      window.history.back()
      commit(CREATE, response.data)
      notifySuccess('Created parameter')
    },
    error => {
      notifyError(`Failed to create parameter ${error.response.data.message}`)
    })
  },
  update ({ commit }, payload) {
    return api.update(payload.id, payload).then(response => {
      window.history.back()
      commit(UPDATE, response.data)
      notifySuccess('Updated parameter')
    },
    error => {
      notifyError(`Failed to update parameter ${error.response.data.message}`)
    })
  }
}

// mutations
const mutations = {
  [LOAD] (state, records) {
    state.all = records
  },
  [REMOVE] (state, id) {
    const i = _.findIndex(state.all, {id})
    state.all.splice(i, 1)
  },
  [CREATE] (state, data) {
    state.all.push(data)
  },
  [UPDATE] (state, data) {
    const i = _.findIndex(state.all, {id: data.id})
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
