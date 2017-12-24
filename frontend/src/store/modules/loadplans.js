
import api from '../../api/loadplans'
// import _ from 'lodash'
// import { ADD_TOAST_MESSAGE } from 'vuex-toast'

const LOAD_LOAD_PLANS = 'LOAD_LOAD_PLANS'
const LOAD_FOLDERS = 'LOAD_FOLDERS'

const state = {
  loadPlans: [],
  folders: []
}

const getters = {
  loadPlans: state => state.loadPlans,
  folders: state => state.folders
}

// actions
const actions = {
  findLoadPlans ({ commit }) {
    return api.findLoadPlans().then(response => {
      commit(LOAD_LOAD_PLANS, response.data)
    })
  },
  findFolders ({commit}) {
    return api.findFolders().then(response => {
      commit(LOAD_FOLDERS, response.data)
    })
  }
}

// mutations
const mutations = {
  [LOAD_LOAD_PLANS] (state, records) {
    state.loadPlans = records
  },
  [LOAD_FOLDERS] (state, records) {
    state.folders = records
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
