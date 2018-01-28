import Vue from 'vue'
import Router from 'vue-router'
import Connection from '@/components/connection/Connection'
import Connections from '@/components/connection/Connections'
import DashView from '@/components/Dash.vue'
import Dashboard from '@/components/Dashboard.vue'
import Sessions from '@/components/session/Sessions.vue'
import TaskInstances from '@/components/task-instance/TaskInstances.vue'
import TaskInstance from '@/components/task-instance/TaskInstance.vue'
import Plans from '@/components/plan/Plans.vue'
import Plan from '@/components/plan/Plan.vue'
import Groups from '@/components/group/Groups.vue'
import Group from '@/components/group/Group.vue'
import Users from '@/components/user/Users.vue'
import User from '@/components/user/User.vue'
import GeneralSettings from '@/components/settings/General.vue'
import MailSettings from '@/components/settings/Mail.vue'
import SlackSettings from '@/components/settings/Slack.vue'
import Parameters from '@/components/parameter/Parameters.vue'
import Parameter from '@/components/parameter/Parameter.vue'
import Tasks from '@/components/task/Tasks.vue'
import Task from '@/components/task/Task.vue'

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
    }, {
      path: 'sessions',
      component: Sessions,
      name: 'Sessions'
    }, {
      path: 'task-instances',
      props: true,
      component: TaskInstances,
      name: 'TaskInstances'
    }, {
      path: 'task-instance/:id',
      props: true,
      component: TaskInstance,
      name: 'TaskInstance'
    }, {
      path: 'plans',
      component: Plans,
      name: 'Plans'
    }, {
      path: 'plan',
      component: Plan,
      name: 'Plan'
    }, {
      path: 'plan/:id',
      props: true,
      component: Plan,
      name: 'PlanProps'
    }, {
      path: 'groups',
      component: Groups,
      name: 'Groups'
    }, {
      path: 'group/:id',
      props: true,
      component: Group,
      name: 'Group'
    }, {
      path: 'users',
      component: Users,
      name: 'Users'
    }, {
      path: 'parameters',
      component: Parameters,
      name: 'Parameters'
    }, {
      path: 'parameter',
      component: Parameter,
      name: 'Parameter'
    }, {
      path: 'user',
      props: true,
      component: User,
      name: 'User'
    }, {
      path: 'settings/general',
      component: GeneralSettings,
      name: 'GeneralSettings'
    }, {
      path: 'settings/mail',
      component: MailSettings,
      name: 'MailSettings'
    }, {
      path: 'settings/slack',
      component: SlackSettings,
      name: 'SlackSettings'
    }, {
      path: 'tasks',
      props: true,
      component: Tasks,
      name: 'Tasks'
    }, {
      path: 'task',
      component: Task,
      name: 'Task'
    }, {
      path: 'task/:id',
      props: true,
      component: Task,
      name: 'TaskProps'
    }, {
      path: 'task/:id?dup=true',
      props: true,
      component: Task,
      name: 'DuplicateTask'
    }]
  }]
})
