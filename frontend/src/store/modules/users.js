
import api from '../../api/users'
import _ from 'lodash'
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'
import {success as notifySuccess, error as notifyError, denoError} from '../../lib/notify'

const LOAD = 'LOAD'
const SAVE = 'SAVE'
const REMOVE = 'REMOVE'
const SET_ME = 'SET_ME'
const NOTIFY_TASK_ERR = 'NOTIFY_TASK_ERR'

const state = {
  all: [],
  me: {
    options: '{}'
  }
}

const getters = {
  users: state => state.all,
  me: state => state.me,
  options: state => JSON.parse(state.me.options)
}

// actions
const actions = {
  listen ({commit}) {
    const socket = new SockJS('/socket')
    const stomp = Stomp.over(socket)
    stomp.connect({}, f => {
      stomp.subscribe(`/topic/task-instance-error`, d => {
        commit(NOTIFY_TASK_ERR, d)
      })
    }, e => {
      console.log(e)
    })
  },
  pollMe ({commit}) {
    return api.findMe().then(response => {
    },
    error => {
      console.log(error)
      window.location = '/logout'
    })
  },
  findMe ({commit}) {
    return api.findMe().then(response => {
      commit(SET_ME, response.data)
    },
    error => {
      console.log(error.response.data.message)
      notifyError('Unable to load current user')
    })
  },
  findAll ({commit}) {
    api.findAll().then(response => {
      commit(LOAD, response.data)
    })
  },
  saveUser ({commit}, payload) {
    api.save(payload).then(response => {
      commit(SAVE, response.data)
      notifySuccess('User saved')
    },
    error => {
      notifyError(`Unable to save user. ${error.response.data.message}`)
    })
  },
  saveOptions ({commit}, options) {
    return api.saveOptions(JSON.stringify(options)).then(response => {
      notifySuccess('Options saves')
      commit(SET_ME, response.data)
      window.history.back()
    },
    error => {
      console.log(error.response.data.message)
      notifyError('Unable to save options')
    })
  },
  changePassword ({commit}, payload) {
    return api.changePassword(payload.o, payload.n).then(response => {
      notifySuccess('Password changed')
      window.history.back()
    },
    error => {
      console.log(error.response.data.message)
      notifyError('Unable to change password')
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
  },
  [NOTIFY_TASK_ERR] (state, d) {
    const options = JSON.parse(state.me.options)
    if (options && options.notifications && options.notifications.enabled === 1) {
      const instance = JSON.parse(d.body)
      denoError(`${instance.name} crashed`)
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
