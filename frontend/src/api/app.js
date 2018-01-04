import axios from 'axios'
import { API_BASE } from './constants'

export default {

  findVersion () {
    return axios.get(`${API_BASE}/app/version`)
  }

}
