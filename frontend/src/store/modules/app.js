
import api from '../../api/app'
// import _ from 'lodash'
// import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD_VERSION = 'LOAD_VERSION'

const state = {
  version: []
}

const getters = {
  version: state => state.version
}

// actions
const actions = {
  findVersion ({ commit }) {
    api.findVersion().then(response => {
      commit(LOAD_VERSION, response.data)
    })
  }
}

// mutations
const mutations = {
  [LOAD_VERSION] (state, version) {
    state.version = version
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
