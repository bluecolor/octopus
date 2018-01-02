import axios from 'axios'
import config from '../config'
import { API_BASE } from './constants'

export default {

  findVersion () {
    return axios.get(`${API_BASE}/app/version`)
  },

  request (method, uri, data = null) {
    if (!method) {
      console.error('API function call requires method argument')
      return
    }

    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    var url = config.serverURI + uri
    return axios({ method, url, data })
  }
}
