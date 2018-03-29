import axios from 'axios'
import { API_BASE } from './constants'
import { toUrlString } from '../util'

export default {
  findByStatus (payload) {
    return axios.post(`${API_BASE}/task-instances/status`, payload)
  },
  findAll (payload) {
    const u = toUrlString(payload)
    return axios.get(`${API_BASE}/task-instances?${u}`)
  },
  done (id) {
    return axios.put(`${API_BASE}/task-instances/done/${id}`)
  },
  start (id) {
    return axios.put(`${API_BASE}/task-instances/start/${id}`)
  },
  block (id) {
    return axios.put(`${API_BASE}/task-instances/block/${id}`)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/task-instances/${id}`)
  }
}
