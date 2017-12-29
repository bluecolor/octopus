import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'

import connections from './modules/connections'
import sessions from './modules/sessions'
import taskInstances from './modules/task-instances'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters: {
    loading: state => state.loading
  },
  modules: {
    connections,
    sessions,
    taskInstances
  }
})
