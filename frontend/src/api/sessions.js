import _ from 'lodash'
import axios from 'axios'
import { API_BASE } from './constants'

export default {

  findAll (payload) {
    const u = _.keys(payload, k => {
      return `${encodeURIComponent(k)}=${encodeURIComponent(payload[k])}`
    }).join('&')
    return axios.get(`${API_BASE}/sessions?${u}`)
  }
}
