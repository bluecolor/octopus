import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findAll () {
    return axios.get(`${API_BASE}/groups`)
  },
  create (payload) {
    return axios.post(`${API_BASE}/groups`, payload)
  },
  update (id, payload) {
    return axios.put(`${API_BASE}/groups/${id}`, payload)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/groups/${id}`)
  }
}
