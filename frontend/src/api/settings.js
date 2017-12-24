import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findAll (connectionId) {
    return axios.get(`${API_BASE}/settings/connection/${connectionId}`)
  },
  saveSettings (connectionId, payload) {
    return axios.post(`${API_BASE}/settings/connection/${connectionId}`, payload)
  }

}
