import Vue from 'vue'
import Router from 'vue-router'
import Connection from '@/components/connection/Connection'
import Connections from '@/components/connection/Connections'
import DashView from '@/components/Dash.vue'
import Dashboard from '@/components/Dashboard.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: DashView,
    children: [{
      path: 'dashboard',
      alias: '',
      component: Dashboard,
      name: 'Dashboard',
      meta: {description: 'Overview of environment'}
    }, {
      path: 'connection/:id',
      props: true,
      component: Connection,
      name: 'Connection'
    }, {
      path: 'connection',
      component: Connection,
      name: 'NewConnection'
    }, {
      path: 'connection/:id',
      props: true,
      component: Connection,
      name: 'EditConnection'
    }, {
      path: 'connections',
      component: Connections,
      name: 'Connections'
    }]
  }]
})
