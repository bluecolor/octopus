import store from '../'
import api from '../../api/transfer'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const LOAD_TRANSFERS = 'LOAD_TRANSFERS'
const DELETE_TRANSFERS = 'DELETE_TRANSFERS'

const state = {
  all: []
}
const getters = {
  transfers: state => state.all
}

const actions = {
  doExport ({ commit }, payload) {
    const connectionId = store.state.connectionId
    api.exp(connectionId, payload).then(response => {
      notifySuccess('Started export process')
    },
    error => {
      console.log(error.response.data.message)
      notifyError('Unable export selections')
    })
  },
  findAll ({commit}) {
    const connectionId = store.state.connectionId
    api.findAll(connectionId).then(response => {
      commit(LOAD_TRANSFERS, response.data)
    },
    error => {
      console.log(error)
      notifyError('Unable to get transfers')
    })
  },
  remove ({commit}, id) {
    const connectionId = store.state.connectionId
    api.remove(connectionId, id).then(response => {
      commit(DELETE_TRANSFERS, id)
      notifySuccess('Transfer deleted')
    },
    error => {
      console.log(error)
      notifyError('Unable delete transfer')
    })
  }
}

const mutations = {
  [LOAD_TRANSFERS] (state, records) {
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
