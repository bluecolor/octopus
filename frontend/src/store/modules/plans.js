
import api from '../../api/plans'
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
  plans: state => state.all
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
      window.history.back()
      commit(CREATE, response.data)
      notifySuccess('Created plan')
    },
    error => {
      notifyError(`Failed to create plan ${error.response.data.message}`)
    })
  },
  update ({ commit }, payload) {
    return api.update(payload.id, payload).then(response => {
      window.history.back()
      commit(UPDATE, response.data)
      notifySuccess('Updated plan')
    },
    error => {
      notifyError(`Failed to update plan ${error.response.data.message}`)
    })
  },
  remove ({ commit }, payload) {
    return api.remove(payload).then(response => {
      commit(LOAD, response.data)
      notifySuccess('Deleted plan')
    },
    error => {
      notifyError(`Failed to delete plan ${error.response.data.message}`)
    })
  },
  unProtect ({commit}, id) {
    return api.unProtect(id).then(response => {
      commit(UPDATE, response.data)
      notifySuccess('Plan updated')
    },
    error => {
      notifyError(`Failed to update plan ${error.response.data.message}`)
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
