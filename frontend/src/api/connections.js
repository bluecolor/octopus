import axios from 'axios'
import { API_BASE } from './constants'

export default {
  findAll () {
    return axios.get(`${API_BASE}/connections`)
  },
  save (connection) {
    if (connection.id) {
      return this.update(connection)
    } else {
      return this.create(connection)
    }
  },
  create (connection) {
    connection.default = connection.default === 1
    return axios.post(`${API_BASE}/connections`, connection)
  },
  update (connection) {
    connection.default = connection.default === 1
    return axios.put(`${API_BASE}/connections/${connection.id}`, connection)
  },
  remove (id) {
    return axios.delete(`${API_BASE}/connections/${id}`)
  },
  test (connection) {
    return axios.post(`${API_BASE}/connections/test`, connection)
  }
}
