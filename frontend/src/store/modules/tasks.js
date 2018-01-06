
import api from '../../api/tasks'
// import store from '../'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const CLEAR = 'CLEAR'
const BOOKMARK = 'BOOKMARK'
const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK'

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
  bookmark ({commit}, id) {
    api.bookmark(id).then(response => {
      commit(BOOKMARK, response.data.id)
      notifySuccess('Bookmarked')
    },
    error => {
      notifyError(`Error! ${error.response.data.message}`)
    })
  },
  removeBookmark ({commit}, id) {
    api.removeBookmark(id).then(response => {
      commit(REMOVE_BOOKMARK, response.data.id)
      notifySuccess('Removed bookmark')
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
    let t = _.chain(state.all).find({id}).clone().value()
    if (t) {
      t.bookmarked = true
      const i = _.findIndex(state.all, {id})
      state.all.splice(i, 1, t)
    }
  },
  [REMOVE_BOOKMARK] (state, id) {
    let t = _.chain(state.all).find({id}).clone().value()
    if (t) {
      t.bookmarked = false
      const i = _.findIndex(state.all, {id})
      state.all.splice(i, 1, t)
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
