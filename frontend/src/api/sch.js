import axios from 'axios'
import { API_BASE } from './constants'

export default {

  findScenarioFolders (connectionId) {
    return axios.get(`${API_BASE}/connections/${connectionId}/schedule/scenario-folders`)
  }

}
