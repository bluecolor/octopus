import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findAll (connectionId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/transfers`)
  },
  remove (connectionId, id) {
    return axios.delete(`${API_BASE}/connections/${connectionId}/transfers/${id}`)
  },
  exp (connectionId, payload) {
    return axios.post(`${API_BASE}/connections/${connectionId}/transfers/export`, payload)
  }
}
