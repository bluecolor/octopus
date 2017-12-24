import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findUsers () {
    return axios.get(`${API_BASE}/users`)
  },
  saveUser (user) {
    return axios.post(`${API_BASE}/users`, user)
  },
  deleteUser (id) {
    return axios.delete(`${API_BASE}/users/${id}`)
  }
}
