
import api from '../../api/sessions'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const CLEAR = 'CLEAR'
const REMOVE = 'REMOVE'
const SET_LOADING = 'SET_LOADING'

const state = {
  all: [],
  meta: {},
  loading: false
}

const getters = {
  sessions: state => state,
  loading: state => state.loading
}

const actions = {
  findAll ({commit}, payload) {
    commit(SET_LOADING, true)
    return api.findAll(payload).then(response => {
      commit(LOAD, response.data)
    }).finally(() => {
      commit(SET_LOADING, false)
    })
  },
  remove ({commit}, id) {
    return new Promise((resolve, reject) => {
      return api.remove(id).then(response => {
        commit(REMOVE, id)
        notifySuccess('Deleted session')
        resolve(response.data)
      },
      error => {
        notifyError(`Error! ${error.response.data.message}`)
        reject(error.response.data.message)
      })
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
  [REMOVE] (state, id) {
    const i = _.findIndex(state.all, {id})
    if (i !== -1) {
      state.all.splice(i, 1)
    }
  },
  [SET_LOADING] (state, b) {
    this.state.loading = b
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
