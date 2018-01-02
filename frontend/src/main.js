// Import System requirements
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'
import i18n from 'vue-i18n'
import VeeValidate from 'vee-validate'
import router from './router'
import pagination from 'vuejs-uib-pagination'

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

Vue.use(i18n)
Vue.use(VueRouter)
Vue.use(VeeValidate)
Vue.use(pagination)
// Vue.use(ElementUI, {locale})
Vue.config.productionTip = false
Vue.config.lang = 'en'

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

