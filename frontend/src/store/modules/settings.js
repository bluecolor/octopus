import store from '../'
import api from '../../api/settings'
import _ from 'lodash'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD_SETTINGS = 'LOAD_SETTINGS'
const SAVE_SETTINGS = 'SAVE_SETTINGS'

const state = {
  settings: []
}

const getters = {
  settings: state => state.settings,
  mailSettings: state => {
    const connectionId = store.state.connectionId
    const ms = _.find(state.settings, s => s.connection.id === connectionId && s.name.toLowerCase() === 'mail')
    if (ms) {
      return ms.value
    }
  }
}

// actions
const actions = {
  findAll ({ commit }) {
    const connectionId = store.state.connectionId
    return api.findAll(connectionId).then(response => {
      commit(LOAD_SETTINGS, response.data)
    })
  },
  saveSettings ({ commit }, payload) {
    const connectionId = store.state.connectionId
    return api.saveSettings(connectionId, payload).then(response => {
      commit(SAVE_SETTINGS, {connectionId, data: response.data})
      notifySuccess(`Saved settings`)
    },
    error => {
      console.log(error)
      notifyError(`Failed to save mail settings`)
    })
  }
}

// mutations
const mutations = {
  [LOAD_SETTINGS] (state, records) {
    state.settings = records.map(s => {
      s.value = JSON.parse(s.value)
      return s
    })
    console.log(state.settings)
  },
  [SAVE_SETTINGS] (state, payload) {
    let i = _.findIndex(state.settings, s => s.connection.id === payload.connectionId && s.name.toLowerCase() === payload.data.name)
    state.settings.splice(i, 1)
    payload.value = JSON.parse(payload.data.value)
    state.settings.push(payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
