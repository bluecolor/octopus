
import api from '../../api/groups'
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
  groups: state => state.all
}

// actions
const actions = {
  findAll ({ commit }) {
    return api.findAll().then(response => {
      commit(LOAD, response.data)
    })
  },
  create ({ commit }, payload) {
    return api.create(payload).then(response => {
      commit(CREATE, response.data)
      window.history.back()
      notifySuccess('Created group')
    },
    error => {
      notifyError(`Failed to create group ${error.response.data.message}`)
    })
  },
  update ({ commit }, payload) {
    return api.update(payload.id, payload).then(response => {
      commit(UPDATE, response.data)
      window.history.back()
      notifySuccess('Updated group')
    },
    error => {
      notifyError(`Failed to update group ${error.response.data.message}`)
    })
  },
  remove ({ commit }, id) {
    return new Promise((resolve, reject) => {
      return api.remove(id).then(response => {
        commit(REMOVE, response.data)
        notifySuccess('Deleted group')
        resolve(response.data)
      },
      error => {
        notifyError(`Failed to delete group ${error.response.data.message}`)
        reject(error.response.data.message)
      })
    })
  }
}

// mutations
const mutations = {
  [LOAD] (state, records) {
    state.all = records
  },
  [CREATE] (state, data) {
    state.all.push(data)
  },
  [REMOVE] (state, id) {
    const i = _.findIndex(state.all, r => r.id === id)
    state.all.splice(i, 1)
  },
  [UPDATE] (state, data) {
    const i = _.findIndex(state.all, {id: data.id})
    if (i !== -1) {
      state.all.splice(i, 1)
      state.all.push(data)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
