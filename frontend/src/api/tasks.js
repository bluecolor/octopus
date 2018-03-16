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
  removeBookmark (id) {
    return axios.put(`${API_BASE}/tasks/un-bookmark/${id}`)
  },
  create (payload) {
    return axios.post(`${API_BASE}/tasks`, payload)
  },
  update (id, payload) {
    return axios.put(`${API_BASE}/tasks/${id}`, payload)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/tasks/${id}`)
  },
  enable (id) {
    return axios.put(`${API_BASE}/tasks/enable/${id}`)
  },
  disable (id) {
    return axios.put(`${API_BASE}/tasks/disable/${id}`)
  }
}
