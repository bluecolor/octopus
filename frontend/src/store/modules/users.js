
import api from '../../api/users'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD_USERS = 'LOAD_USERS'
const SAVE_USER = 'SAVE_USER'
const REMOVE_USER = 'REMOVE_USER'

const state = {
  all: []
}

const getters = {
  users: state => state.all
}

// actions
const actions = {
  findUsers ({ commit }) {
    api.findUsers().then(response => {
      commit(LOAD_USERS, response.data)
    })
  },
  saveUser ({ commit }, payload) {
    api.saveUser(payload).then(response => {
      commit(SAVE_USER, response.data)
      notifySuccess('User saved')
    },
    error => {
      notifyError(`Unable to save user. ${error.response.data.message}`)
    })
  },
  deleteUser ({ commit }, id) {
    api.deleteUser(id).then(response => {
      commit(REMOVE_USER, response.data.id)
      notifySuccess('User deleted')
    },
    error => {
      notifyError(error.response.data.message)
    })
  }
}

// mutations
const mutations = {
  [LOAD_USERS] (state, records) {
    state.all = records
  },
  [SAVE_USER] (state, record) {
    const c = _.find(state.all, {id: record.id})
    if (c) {
      _.remove(state.all, r => r.id === record.id)
    }
    state.all.push(record)
    window.history.back()
  },
  [REMOVE_USER] (state, id) {
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
