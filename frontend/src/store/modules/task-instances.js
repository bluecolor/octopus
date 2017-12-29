
import api from '../../api/task-instances'
// import store from '../'
// import _ from 'lodash'
// import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const CLEAR = 'CLEAR'

const state = {
  all: [],
  meta: {}
}

const getters = {
  taskInstances: state => state
}

const actions = {

  findAll ({commit}, payload) {
    commit(CLEAR)
    api.findAll(payload).then(response => {
      commit(LOAD, response.data)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
