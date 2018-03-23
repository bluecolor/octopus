import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findMe () {
    return axios.get(`${API_BASE}/users/me`)
  },
  findAll () {
    return axios.get(`${API_BASE}/users`)
  },
  save (user) {
    return axios.post(`${API_BASE}/users`, user)
  },
  saveOptions (options) {
    return axios.put(`${API_BASE}/users/options`, options)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/users/${id}`)
  }
}
