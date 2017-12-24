import axios from 'axios'
import { API_BASE } from './constants'

export default {

  findLoadPlans (connectionId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/load-plans`)
  },
  findFolders (connectionId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/scenarios/folders`)
  }

}
