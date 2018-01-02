
import api from '../../api/parameters'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const REMOVE = 'REMOVE'

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
      commit(LOAD, response.data)
      notifySuccess('Deleted parameter')
    },
    error => {
      notifyError(`Failed to delete parameter ${error.response.data.message}`)
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
