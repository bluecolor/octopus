import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findAll () {
    return axios.get(`${API_BASE}/plans`)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/plans`, id)
  }
}
