import api from '../../api/settings'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD = 'LOAD'
const CREATE = 'CREATE'
const UPDATE = 'UPDATE'

const state = {
  all: []
}

const getters = {
  settings: state => state.all,
  mail: state => _.find(state.all, {name: 'MAIL'}),
  slack: state => _.find(state.all, {name: 'SLACK'}),
  maxParallel: state => _.find(state.all, {name: 'MAX_PARALLEL'})
}

// actions
const actions = {
  findAll ({commit}) {
    return api.findAll().then(response => {
      commit(LOAD, response.data)
    })
  },
  create ({commit}, payload) {
    return api.create(payload).then(response => {
      commit(CREATE, response.data)
      notifySuccess('Settings saved')
    },
    error => {
      notifyError(`Error! ${error.response.data.message}`)
    })
  },
  update ({commit}, payload) {
    return api.update(payload.id, payload).then(response => {
      commit(UPDATE, response.data)
      notifySuccess('Settings saved')
    },
    error => {
      notifyError(`Error! ${error.response.data.message}`)
    })
  }
}

// mutations
const mutations = {
  [LOAD] (state, records) {
    state.all = records.map(s => {
      s.val = JSON.parse(s.value)
      return s
    })
    console.log(state.all)
  },
  [UPDATE] (state, setting) {
    const name = setting.name
    setting.val = JSON.parse(setting.value)
    const i = _.findIndex(state.all, {name})
    state.all.splice(i, 1)
    state.all.push(setting)
  },
  [CREATE] (state, setting) {
    setting.val = JSON.parse(setting.value)
    state.all.push(setting)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
