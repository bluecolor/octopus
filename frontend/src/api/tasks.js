import axios from 'axios'
import { API_BASE } from './constants'
import { toUrlString } from '../util'

export default {
  findAll (payload) {
    const u = toUrlString(payload)
    return axios.get(`${API_BASE}/tasks?${u}`)
  },
  bookmark (id) {
    return axios.put(`${API_BASE}/tasks/bookmark/${id}`)
  },
  unBookmark (id) {
    return axios.put(`${API_BASE}/tasks/un-bookmark/${id}`)
  }
}
