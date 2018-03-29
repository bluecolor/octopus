import axios from 'axios'
import { API_BASE } from './constants'
import { toUrlString } from '../util'

export default {

  findByStatus (payload) {
    return axios.post(`${API_BASE}/sessions/status`, payload)
  },
  findAll (payload) {
    const u = toUrlString(payload)
    return axios.get(`${API_BASE}/sessions?${u}`)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/sessions/${id}`)
  },
  stop (id) {
    return axios.put(`${API_BASE}/sessions/${id}/stop`)
  },
  start (id) {
    return axios.put(`${API_BASE}/sessions/${id}/start`)
  }
}
