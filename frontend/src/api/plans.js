import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findAll () {
    return axios.get(`${API_BASE}/plans`)
  },
  create (data) {
    return axios.post(`${API_BASE}/plans`, data)
  },
  update (id, data) {
    return axios.put(`${API_BASE}/plans/${id}`, data)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/plans`, id)
  }
}
