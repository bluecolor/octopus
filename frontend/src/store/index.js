import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'

import users from './modules/users'
import connections from './modules/connections'
import sessions from './modules/sessions'
import taskInstances from './modules/task-instances'
import technology from './modules/technology'
import plans from './modules/plans'
import groups from './modules/groups'
import parameters from './modules/parameters'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters: {
    loading: state => state.loading
  },
  modules: {
    users,
    connections,
    sessions,
    taskInstances,
    technology,
    plans,
    groups,
    parameters
  }
})
