import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findAll () {
    return axios.get(`${API_BASE}/parameters`)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/parameters`, id)
  }
}
