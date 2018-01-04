import axios from 'axios'
import { API_BASE } from './constants'
import { toUrlString } from '../util'

export default {
  findAll (payload) {
    const u = toUrlString(payload)
    return axios.get(`${API_BASE}/tasks?${u}`)
  }
}
