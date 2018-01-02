
import api from '../../api/groups'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const REMOVE = 'REMOVE'

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
  remove ({ commit }, payload) {
    return api.remove(payload).then(response => {
      commit(LOAD, response.data)
      notifySuccess('Deleted group')
    },
    error => {
      notifyError(`Failed to delete group ${error.response.data.message}`)
    })
  }
}

// mutations
const mutations = {
  [LOAD] (state, records) {
    state.all = records
  },
  [REMOVE] (state, id) {
    const i = _.findIndex(state.all, r => r.id === id)
    state.all.splice(i, 1)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
