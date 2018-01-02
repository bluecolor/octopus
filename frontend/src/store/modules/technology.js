
import api from '../../api/technology'

const LOAD = 'LOAD'

const state = {
  all: []
}

const getters = {
  technologies: state => state.all
}

// actions
const actions = {
  findAll ({ commit }) {
    return api.findAll().then(response => {
      commit(LOAD, response.data)
    })
  }
}

// mutations
const mutations = {
  [LOAD] (state, records) {
    state.all = records
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
