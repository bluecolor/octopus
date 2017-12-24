import axios from 'axios'
import { API_BASE } from './constants'

export default {

  findByCriteria (connectionId, criteria) {
    return axios.post(`${API_BASE}/connections/${connectionId}/sessions`, criteria)
  },
  deleteSessions (connectionId, sessionIds) {
    return axios.post(`${API_BASE}/connections/${connectionId}/sessions/delete`, sessionIds)
  },
  deleteById (connectionId, sessionId) {
    return axios.delete(`${API_BASE}/connections/${connectionId}/sessions/${sessionId}`)
  },
  setStatus (connectionId, sessionId, status) {
    return axios.put(`${API_BASE}/connections/${connectionId}/sessions/${sessionId}/status/${status}`)
  },
  findLoadPlanRuns (connectionId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/sessions/load-plans`)
  },
  deleteLoadPlanRun (connectionId, runId) {
    return axios.delete(`${API_BASE}/connections/${connectionId}/sessions/load-plans/${runId}`)
  }
}
