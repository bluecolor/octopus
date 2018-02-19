
import api from '../../api/sessions'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const CLEAR = 'CLEAR'
const REMOVE = 'REMOVE'

const state = {
  all: [],
  meta: {}
}

const getters = {
  sessions: state => state
}

const actions = {
  findAll ({commit}, payload) {
    commit(CLEAR)
    api.findAll(payload).then(response => {
      commit(LOAD, response.data)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
