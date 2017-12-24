// Import System requirements
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import VeeValidate from 'vee-validate'
import router from './router'

import 'pnotify/dist/pnotify.css'
import 'pnotify/dist/pnotify.buttons.css'
import 'pnotify/dist/pnotify.buttons'
import 'pnotify/includes/style.css'

import { domain, count, prettyDate, pluralize } from './filters'

import AppView from './components/App.vue'

// Import Install and register helper items
Vue.filter('count', count)
Vue.filter('domain', domain)
Vue.filter('prettyDate', prettyDate)
Vue.filter('pluralize', pluralize)

Vue.use(VueRouter)
Vue.use(VeeValidate)
Vue.config.productionTip = false

// Start out app!
// eslint-disable-next-line no-new
new Vue({
  el: '#root',
  router,
  store: store,
  created () {
    this.$store.dispatch('init')
  },
  render: h => h(AppView)
})

// Check local storage to handle refreshes
if (window.localStorage) {
  var localUserString = window.localStorage.getItem('user') || 'null'
  var localUser = JSON.parse(localUserString)

  if (localUser && store.state.user !== localUser) {
    store.commit('SET_USER', localUser)
    store.commit('SET_TOKEN', window.localStorage.getItem('token'))
  }
}

export {
  router
}

