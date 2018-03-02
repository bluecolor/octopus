import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findAll () {
    return axios.get(`${API_BASE}/users`)
  },
  save (user) {
    return axios.post(`${API_BASE}/users`, user)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/users/${id}`)
  }
}
