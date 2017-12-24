import axios from 'axios'
import { API_BASE } from './constants'

export default {
  createLogicalSchema (connectionId, technologyId, logicalSchema) {
    return axios.post(`${API_BASE}/connections/${connectionId}/technologies/${technologyId}/logical-schema`, logicalSchema)
  },
  findAllContexts (connectionId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/contexts`)
  },
  createContext (connectionId, context) {
    return axios.post(`${API_BASE}/connections/${connectionId}/contexts`, context)
  },
  deleteContext (connectionId, contextId) {
    return axios.delete(`${API_BASE}/connections/${connectionId}/contexts/${contextId}`)
  },
  findTechnologies (connectionId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/technologies`)
  },
  deleteTechnology (connectionId, technologyId) {
    return axios.delete(`${API_BASE}/connections/${connectionId}/technologies/${technologyId}`)
  },
  findPhysicalAgents (connectionId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/agents/physical`)
  },
  findLogicalAgents (connectionId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/agents/logical`)
  },
  createLogicalAgent (connectionId, agent) {
    return axios.post(`${API_BASE}/connections/${connectionId}/agents/logical`, agent)
  },
  updateLogicalAgent (connectionId, agent) {
    return axios.put(`${API_BASE}/connections/${connectionId}/agents/logical/${agent.agentId}`, agent)
  },
  testPhysicalAgent (connectionId, agentId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/agents/physical/test/${agentId}`)
  },
  deletePhysicalAgent (connectionId, agentId) {
    return axios.delete(`${API_BASE}/connections/${connectionId}/agents/physical/${agentId}`)
  },
  deleteLogicalAgent (connectionId, agentId) {
    return axios.delete(`${API_BASE}/connections/${connectionId}/agents/logical/${agentId}`)
  },
  createPhysicalAgent (connectionId, agent) {
    return axios.post(`${API_BASE}/connections/${connectionId}/agents/physical`, agent)
  },
  updatePhysicalAgent (connectionId, agent) {
    return axios.put(`${API_BASE}/connections/${connectionId}/agents/physical/${agent.agentId}`, agent)
  },
  testDataServer (connectionId, dataServerId, agentId) {
    const url = `${API_BASE}/connections/${connectionId}/technologies/data-servers/${dataServerId}/test` + (agentId ? `?agent=${agentId}` : '')
    return axios.get(url)
  },
  deleteDataServer (connectionId, dataServerId) {
    const url = `${API_BASE}/connections/${connectionId}/technologies/data-servers/${dataServerId}`
    return axios.delete(url)
  },
  createPhysicalSchema (connectionId, dataServerId, physicalSchema) {
    const url = `${API_BASE}/connections/${connectionId}/technologies/data-servers/${dataServerId}/physical-schemas`
    return axios.post(url, physicalSchema)
  },
  createDataServer (connectionId, technologyId, dataServer) {
    const url = `${API_BASE}/connections/${connectionId}/technologies/${technologyId}/data-servers`
    return axios.post(url, dataServer)
  },
  updateDataServer (connectionId, dataServer) {
    console.log(dataServer)
    const url = `${API_BASE}/connections/${connectionId}/technologies/data-servers/${dataServer.internalId}`
    return axios.put(url, dataServer)
  }

}
