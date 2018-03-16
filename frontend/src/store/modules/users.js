
import api from '../../api/users'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const SAVE = 'SAVE'
const REMOVE = 'REMOVE'
const SET_ME = 'SET_ME'

const state = {
  all: [],
  me: undefined
}

const getters = {
  users: state => state.all,
  me: state => state.me
}

// actions
const actions = {
  findMe ({commit}) {
    return api.findMe().then(response => {
      commit(SET_ME, response.data)
    },
    error => {
      console.log(error.response.data.message)
      notifyError('Unable to load current user')
    })
  },
  findAll ({ commit }) {
    api.findAll().then(response => {
      commit(LOAD, response.data)
    })
  },
  saveUser ({ commit }, payload) {
    api.save(payload).then(response => {
      commit(SAVE, response.data)
      notifySuccess('User saved')
    },
    error => {
      notifyError(`Unable to save user. ${error.response.data.message}`)
    })
  },
  remove ({ commit }, id) {
    return new Promise((resolve, reject) => {
      return api.remove(id).then(response => {
        commit(REMOVE, response.data.id)
        notifySuccess('User deleted')
        resolve(response.data)
      },
      error => {
        notifyError(error.response.data.message)
        reject(error.response.data.message)
      })
    })
  }
}

// mutations
const mutations = {
  [SET_ME] (state, me) {
    state.me = me
  },
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
