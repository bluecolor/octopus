import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findAll () {
    return axios.get(`${API_BASE}/parameters`)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/parameters/${id}`)
  },
  create (data) {
    return axios.post(`${API_BASE}/parameters`, data)
  },
  update (id, data) {
    return axios.put(`${API_BASE}/parameters/${id}`, data)
  }
}
