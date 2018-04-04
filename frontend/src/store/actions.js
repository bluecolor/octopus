// import api from '../api'
// import { router } from '../main'

export default {
  init () {
    this.dispatch('sessions/findByStatus', ['ERROR', 'RUNNING'])
    this.dispatch('taskInstances/findByStatus', ['ERROR', 'RUNNING'])
    this.dispatch('connections/findAll')
    this.dispatch('sessions/findAll')
    this.dispatch('technology/findAll')
    this.dispatch('plans/findAll')
    this.dispatch('groups/findAll')
    this.dispatch('users/findAll')
    this.dispatch('users/findMe')
    this.dispatch('parameters/findAll')
    this.dispatch('app/findVersion')
    this.dispatch('settings/findAll')

    setInterval(() => {
      this.dispatch('users/pollMe')
    }, 10 * 1000)
  }
}
