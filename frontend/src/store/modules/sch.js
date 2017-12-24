import store from '../'
import api from '../../api/sch'
// import _ from 'lodash'
// import { ADD_TOAST_MESSAGE } from 'vuex-toast'

const LOAD_SCENARIO_FOLDERS = 'LOAD_SCENARIO_FOLDERS'

const state = {
  scenarioFolders: []
}

const getters = {
  scenarioFolders: state => state.scenarioFolders
}

// actions
const actions = {
  findScenarioFolders ({ commit }) {
    const connectionId = store.state.connectionId
    return api.findScenarioFolders(connectionId).then(response => {
      commit(LOAD_SCENARIO_FOLDERS, response.data)
    })
  }
}

// mutations
const mutations = {
  [LOAD_SCENARIO_FOLDERS] (state, records) {
    state.scenarioFolders = records
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
