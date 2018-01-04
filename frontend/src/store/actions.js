// import api from '../api'
// import { router } from '../main'

export default {
  init () {
    this.dispatch('connections/findAll')
    this.dispatch('sessions/findAll')
    this.dispatch('technology/findAll')
    this.dispatch('plans/findAll')
    this.dispatch('groups/findAll')
    this.dispatch('users/findAll')
    this.dispatch('parameters/findAll')
    this.dispatch('app/findVersion')
  }
}
