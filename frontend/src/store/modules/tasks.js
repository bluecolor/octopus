
import api from '../../api/tasks'
// import store from '../'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const CLEAR = 'CLEAR'
const BOOKMARK = 'BOOKMARK'

const state = {
  all: [],
  meta: {}
}

const getters = {
  tasks: state => state
}

const actions = {

  findAll ({commit}, payload) {
    commit(CLEAR)
    api.findAll(payload).then(response => {
      commit(LOAD, response.data)
    })
  },
  bookmark ({commit}, payload) {
    api.bookmark(payload.id).then(response => {
      commit(BOOKMARK, response.data.id)
      notifySuccess('Success.')
    },
    error => {
      notifyError(`Error! ${error.response.data.message}`)
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
  [BOOKMARK] (state, id) {
    const t = _.find(state.all, {id})
    if (t) {
      t.bookmarked = true
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
