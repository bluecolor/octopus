import api from '../../api/tasks'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const CLEAR = 'CLEAR'
const BOOKMARK = 'BOOKMARK'
const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK'
const REMOVE = 'REMOVE'
const UPDATE = 'UPDATE'

const state = {
  all: [],
  meta: {},
  loading: false
}

const getters = {
  tasks: state => state,
  loading: state => state.loading
}

const actions = {

  findAll ({commit}, payload) {
    commit(CLEAR)
    api.findAll(payload).then(response => {
      commit(LOAD, response.data)
    })
  },
  findOne ({commit}, payload) {
    return new Promise((resolve, reject) => {
      return api.findOne(payload).then(response => {
        resolve(response.data)
      },
      error => {
        reject(error.response.data.message)
      })
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
  },
  create ({commit}, payload) {
    api.create(payload).then(response => {
      window.history.back()
      notifySuccess('Created task')
    },
    error => {
      notifyError(`Error! ${error.response.data.message}`)
    })
  },
  update ({commit}, payload) {
    api.update(payload.id, payload).then(response => {
      window.history.back()
      notifySuccess('Updated task')
    },
    error => {
      notifyError(`Error! ${error.response.data.message}`)
    })
  },
  remove ({commit}, id) {
    return new Promise((resolve, reject) => {
      return api.remove(id).then(response => {
        notifySuccess('Deleted task')
        commit(REMOVE, id)
        resolve(response.data)
      },
      error => {
        notifyError(`Error! ${error.response.data.message}`)
        reject(error.response.data.message)
      })
    })
  },
  enable ({commit}, id) {
    return api.enable(id).then(response => {
      notifySuccess('Enabled task')
      commit(UPDATE, response.data)
    },
    error => {
      console.log(error)
      notifyError(`Error! ${error.response.data.message}`)
    })
  }
}

const mutations = {
  [LOAD] (state, data) {
    state.loading = false
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
    state.loading = true
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
  },
  [REMOVE] (state, id) {
    const i = _.findIndex(state.all, {id})
    if (i !== -1) {
      state.all.splice(i, 1)
    }
  },
  [UPDATE] (state, task) {
    const id = task.id
    const i = _.findIndex(state.all, {id})
    if (i !== -1) {
      state.all.splice(i, 1)
    }
    this.all.push(task)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
