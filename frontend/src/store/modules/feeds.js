
// import api from '../../api/loadplans'
// import _ from 'lodash'

import {denoError as DenoError, denoSuccess as DenoSuccess} from '../../lib/notify'
import webstomp from 'webstomp-client'
import SockJS from 'sockjs-client'
import store from '../'

// import Push from 'push.js'

const socket = SockJS('/socket')
const stomp = webstomp.over(socket)

const state = {
}
const getters = {
}

const actions = {
  listen ({ commit }) {
    const connectionId = store.state.connectionId
    stomp.connect({}, () => {
      stomp.subscribe('/topic/session-error', data => {
        const session = JSON.parse(data.body)._2
        DenoError(`${session.name}`)
      })
      stomp.subscribe('/topic/transfer-result', data => {
        const t = JSON.parse(data.body)
        let message = ''
        if (t.status === 'SUCCESS') {
          if (t.transferType === 'EXPORT') {
            window.location = `/api/v1/connections/${connectionId}/transfers/${t.id}/download`
            message = `Downloaded your export file`
          } else if (t.transferType === 'IMPORT') {
            message = 'Imported odi objects'
          }
          DenoSuccess(message)
        } else {
          DenoError(`${t.transferType} failed`)
        }
      })
    })
  }
}

// mutations
const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
