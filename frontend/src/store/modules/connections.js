
import api from '../../api/connections'
import _ from 'lodash'

import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const SAVE = 'SAVE'
const REMOVE = 'REMOVE'

const state = {
  all: []
}

const getters = {
  connections: state => state.all,
  connection: state => id => _.find(state.all, {id})
}

// actions
const actions = {
  findAll ({ commit }) {
    return api.findAll().then(response => {
      commit(LOAD, response.data)
    })
  },
  save ({ commit }, payload) {
    api.save(payload).then(response => {
      commit(SAVE, response.data)
      notifySuccess('Connection saved')
    },
    error => {
      console.log(error)
      notifyError(`Unable to save connection. ${error.response.data.message}`)
    })
  },
  remove ({ commit }, id) {
    api.remove(id).then(response => {
      commit(REMOVE, response.data.id)
      notifySuccess('Connection deleted')
    })
  },
  test ({ commit }, payload) {
    api.test(payload).then(response => {
      notifySuccess('Connection works')
    },
    error => {
      notifyError(`Connection not working. ${error.response.data.message}`)
    })
  }
}

// mutations
const mutations = {
  [LOAD] (state, records) {
    state.all = records
  },
  [SAVE] (state, record) {
    const c = _.find(state.all, {id: record.id})
    if (c) {
      _.remove(state.all, r => r.id === record.id)
    }
    state.all.push(record)
    window.history.back()
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
